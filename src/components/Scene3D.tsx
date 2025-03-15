import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useModelStore } from '@/store/modelStore';
import PipeModel from './models/PipeModel';
import PanelModel from './models/PanelModel';
import GroundModel from './models/GroundModel';
import CompositeModel from './models/CompositeModel';
import CameraController, { KeyName, globalKeyStates } from './controllers/CameraController';
import { Stats, Environment } from '@react-three/drei';
import { PrimitiveModel, CompositeModel as CompositeModelType } from '@/types/models';
import { Vector3 } from 'three';

type ControllerType = 'orbit' | 'firstPerson' | 'flight';

interface WindowWithController extends Window {
  setController?: (type: ControllerType) => void;
}

// Interface for key events in the log
interface KeyEvent {
  key: string;
  type: 'keydown' | 'keyup';
  timestamp: number;
}

// Component to track camera position and report changes
function CameraPositionTracker({ onPositionChange }: { onPositionChange: (position: Vector3) => void }) {
  const { camera } = useThree();
  
  useFrame(() => {
    onPositionChange(camera.position.clone());
  });
  
  return null;
}

// Component to create a human-readable string of active keys
function formatActiveKeys(keyStates: Record<KeyName, boolean>): string {
  const activeKeys: string[] = [];
  
  // Check for WASD keys
  if (keyStates.w || keyStates.W) activeKeys.push('W');
  if (keyStates.a || keyStates.A) activeKeys.push('A');
  if (keyStates.s || keyStates.S) activeKeys.push('S');
  if (keyStates.d || keyStates.D) activeKeys.push('D');
  
  // Check for arrow keys
  if (keyStates.ArrowUp) activeKeys.push('↑');
  if (keyStates.ArrowDown) activeKeys.push('↓');
  if (keyStates.ArrowLeft) activeKeys.push('←');
  if (keyStates.ArrowRight) activeKeys.push('→');
  
  // Check for space and shift
  if (keyStates[' ']) activeKeys.push('Space');
  if (keyStates.Shift) activeKeys.push('Shift');
  
  return activeKeys.length > 0 ? activeKeys.join(' + ') : 'None';
}

// Format a single key event for display
function formatKeyEvent(event: KeyEvent): string {
  const timeString = new Date(event.timestamp).toISOString().substr(11, 8);
  const keyDisplay = event.key === ' ' ? 'Space' : event.key;
  const eventType = event.type === 'keydown' ? '▼' : '▲';
  return `${timeString} ${eventType} ${keyDisplay}`;
}

interface Scene3DProps {
  controllerType?: ControllerType;
}

export function Scene3D({ controllerType = 'orbit' }: Scene3DProps) {
  const { models, instances, getModelById } = useModelStore();
  const [isFocused, setIsFocused] = useState(false);
  const [activeController, setActiveController] = useState<ControllerType>(controllerType);
  const [cameraPosition, setCameraPosition] = useState<Vector3>(new Vector3(0, 50, 100));
  const [activeKeys, setActiveKeys] = useState<Record<KeyName, boolean>>({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    ' ': false,
    'Shift': false,
    'w': false,
    'a': false,
    's': false,
    'd': false,
    'W': false,
    'A': false,
    'S': false,
    'D': false
  });
  // State to track the last 20 key events
  const [keyEventLog, setKeyEventLog] = useState<KeyEvent[]>([]);
  // Ref to track which keys are currently down to prevent duplicate keydown events
  const keysPressedRef = useRef<Set<string>>(new Set());
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Create a list of instance IDs that are referenced by composite models
  // These should not be rendered directly to avoid duplicates
  const compositeMemberIds = useMemo(() => {
    const memberIds = new Set<string>();
    
    models.forEach(model => {
      if (model.type === 'composite') {
        const compositeModel = model as CompositeModelType;
        if (compositeModel.references) {
          compositeModel.references.forEach(ref => {
            memberIds.add(ref.instanceId);
          });
        }
      }
    });
    
    return memberIds;
  }, [models]);

  // Handle focus state
  const handleCanvasClick = useCallback(() => {
    if (!isFocused) {
      setIsFocused(true);
      canvasRef.current?.focus();
    }
  }, [isFocused]);

  // Handle key states change from CameraController
  const handleKeyStateChange = useCallback((newKeyStates: Record<KeyName, boolean>) => {
    setActiveKeys(newKeyStates);
  }, []);

  // Add a key event to the log
  const addKeyEventToLog = useCallback((key: string, type: 'keydown' | 'keyup') => {
    // For keydown events, only add if the key wasn't already pressed
    if (type === 'keydown') {
      if (keysPressedRef.current.has(key)) {
        return; // Skip this event as it's a repeat
      }
      keysPressedRef.current.add(key);
    } else if (type === 'keyup') {
      // For keyup events, remove the key from the pressed set
      keysPressedRef.current.delete(key);
    }

    setKeyEventLog(prevLog => {
      // Create new event
      const newEvent: KeyEvent = {
        key,
        type,
        timestamp: Date.now()
      };
      
      // Add to beginning of log and limit to 20 entries
      const updatedLog = [newEvent, ...prevLog].slice(0, 20);
      return updatedLog;
    });
  }, []);

  // Handle escape key to exit focus
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Add to key event log (only non-repeating events will be added)
    addKeyEventToLog(e.key, 'keydown');
    
    if (e.key === 'Escape') {
      setIsFocused(false);
    } else if (isFocused) {
      const customWindow = window as WindowWithController;
      // Toggle camera controllers with number keys when focused
      if (e.key === '1') {
        setActiveController('orbit');
        customWindow.setController?.('orbit');
      } else if (e.key === '2') {
        setActiveController('firstPerson');
        customWindow.setController?.('firstPerson');
      } else if (e.key === '3') {
        setActiveController('flight');
        customWindow.setController?.('flight');
      }
    }
  }, [isFocused, addKeyEventToLog]);

  // Handle key up events
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    // Add to key event log
    addKeyEventToLog(e.key, 'keyup');
  }, [addKeyEventToLog]);

  // Set up and clean up event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Function to update camera position from the Three.js scene
  const handleCameraPositionUpdate = (position: Vector3) => {
    setCameraPosition(position);
  };

  // Keep track of active keys in each frame
  useEffect(() => {
    const updateKeyStatesInterval = setInterval(() => {
      setActiveKeys({...globalKeyStates.current});
    }, 16); // Update roughly 60 times per second
    
    return () => {
      clearInterval(updateKeyStatesInterval);
    };
  }, []);

  // Format the active keys as a readable string
  const activeKeysString = formatActiveKeys(activeKeys);

  return (
    <div 
      className="relative w-full h-full"
      onClick={handleCanvasClick}
      style={{ outline: isFocused ? '3px solid #3b82f6' : 'none' }}
    >
      {!isFocused && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 text-white py-2 px-4 rounded z-10">
          Click to interact
        </div>
      )}
      
      {/* Camera position and key indicator display */}
      <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white py-1 px-3 rounded text-xs z-10" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        <p>Camera Position:</p>
        <p>X: {cameraPosition.x.toFixed(2)}</p>
        <p>Y: {cameraPosition.y.toFixed(2)}</p>
        <p>Z: {cameraPosition.z.toFixed(2)}</p>
        <div className="mt-2 pt-1 border-t border-gray-500">
          <p>Active Keys: <span className="font-mono">{activeKeysString}</span></p>
          <div className="mt-1">
            <p>Key Event Log:</p>
            <div className="mt-1 font-mono text-2xs bg-black bg-opacity-50 p-1 rounded" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {keyEventLog.length === 0 ? (
                <p className="text-gray-500">No key events yet</p>
              ) : (
                keyEventLog.map((event, index) => (
                  <div key={index} className={`${event.type === 'keydown' ? 'text-green-400' : 'text-red-400'}`}>
                    {formatKeyEvent(event)}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Canvas 
        ref={canvasRef}
        style={{ height: '100%', width: '100%' }} 
        shadows
        tabIndex={0}
        camera={{ position: [0, 50, 100], fov: 50 }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 100, 10]} intensity={1} castShadow />
        
        <CameraController 
          defaultController={activeController} 
          onKeyStateChange={handleKeyStateChange}
        />
        <Environment preset="sunset" />
        
        {/* Tracking camera position */}
        <CameraPositionTracker onPositionChange={handleCameraPositionUpdate} />
        
        {/* Render all visible instances that are not part of a composite */}
        {instances.map(instance => {
          // Skip if not visible
          if (!instance.visible) return null;
          
          // Skip if this instance is part of a composite model
          if (compositeMemberIds.has(instance.instanceId)) return null;
          
          const model = getModelById(instance.modelId);
          if (!model) return null;
          
          if (model.type === 'primitive') {
            if (model.id === 'big-pipe') {
              return (
                <PipeModel
                  key={instance.instanceId}
                  model={model as PrimitiveModel}
                  instanceId={instance.instanceId}
                  position={instance.position}
                  rotation={instance.rotation}
                  scale={instance.scale}
                />
              );
            } else if (model.id === 'big-panel') {
              return (
                <PanelModel
                  key={instance.instanceId}
                  model={model as PrimitiveModel}
                  instanceId={instance.instanceId}
                  position={instance.position}
                  rotation={instance.rotation}
                  scale={instance.scale}
                />
              );
            } else if (model.id === 'green-ground') {
              return (
                <GroundModel
                  key={instance.instanceId}
                  model={model as PrimitiveModel}
                  instanceId={instance.instanceId}
                  position={instance.position}
                  rotation={instance.rotation}
                  scale={instance.scale}
                />
              );
            }
          } else if (model.type === 'composite') {
            return (
              <CompositeModel
                key={instance.instanceId}
                model={model as CompositeModelType}
                instanceId={instance.instanceId}
                position={instance.position}
                rotation={instance.rotation}
                scale={instance.scale}
              />
            );
          }
          
          return null;
        })}
        
        <Stats />
      </Canvas>

      {isFocused && (
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white py-1 px-2 rounded text-sm">
          <p>Press [ESC] to exit | Camera modes: [1] Orbit | [2] First Person | [3] Flight</p>
        </div>
      )}
    </div>
  );
}

export default Scene3D; 