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

// General input event types
type InputEventType = 'keydown' | 'keyup' | 'mousedown' | 'mouseup' | 'mousemove' | 'wheel';

// Interface for tracked input events
interface InputEvent {
  type: InputEventType;
  key?: string;        // For keyboard events
  button?: number;     // For mouse clicks (0 = left, 1 = middle, 2 = right)
  x?: number;          // Mouse X position
  y?: number;          // Mouse Y position
  deltaY?: number;     // For wheel events
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

// Format a human-readable string of active keys
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

// Format a single input event for display
function formatInputEvent(event: InputEvent): string {
  const timeString = new Date(event.timestamp).toISOString().substr(11, 8);
  
  // Format based on event type
  switch (event.type) {
    case 'keydown':
      const keyDisplay = event.key === ' ' ? 'Space' : event.key;
      return `${timeString} 🔽 Key: ${keyDisplay}`;
    
    case 'keyup':
      const keyUpDisplay = event.key === ' ' ? 'Space' : event.key;
      return `${timeString} 🔼 Key: ${keyUpDisplay}`;
    
    case 'mousedown':
      const buttonNames = ['Left', 'Middle', 'Right'];
      const buttonName = buttonNames[event.button || 0] || `Button ${event.button}`;
      return `${timeString} 🖱️🔽 ${buttonName} at (${event.x?.toFixed(0)}, ${event.y?.toFixed(0)})`;
    
    case 'mouseup':
      const upButtonNames = ['Left', 'Middle', 'Right'];
      const upButtonName = upButtonNames[event.button || 0] || `Button ${event.button}`;
      return `${timeString} 🖱️🔼 ${upButtonName} at (${event.x?.toFixed(0)}, ${event.y?.toFixed(0)})`;
    
    case 'mousemove':
      return `${timeString} 🖱️ Move to (${event.x?.toFixed(0)}, ${event.y?.toFixed(0)})`;
    
    case 'wheel':
      const direction = event.deltaY && event.deltaY > 0 ? 'down' : 'up';
      return `${timeString} 🖱️🔄 Scroll ${direction}`;
    
    default:
      return `${timeString} Unknown event`;
  }
}

// Function to get color for different event types
function getEventColor(eventType: InputEventType): string {
  switch (eventType) {
    case 'keydown': return 'text-green-400';
    case 'keyup': return 'text-red-400';
    case 'mousedown': return 'text-blue-400';
    case 'mouseup': return 'text-purple-400';
    case 'mousemove': return 'text-gray-400';
    case 'wheel': return 'text-yellow-400';
    default: return 'text-white';
  }
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
  
  // State to track the last 20 input events (both keyboard and mouse)
  const [inputEventLog, setInputEventLog] = useState<InputEvent[]>([]);
  
  // Refs to track active inputs to prevent duplicate events
  const keysPressedRef = useRef<Set<string>>(new Set());
  const mouseButtonsPressedRef = useRef<Set<number>>(new Set());
  const lastMouseMoveRef = useRef<{ x: number, y: number } | null>(null);
  const throttleTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

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
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (!isFocused) {
      setIsFocused(true);
      canvasRef.current?.focus();
    }
  }, [isFocused]);

  // Handle key states change from CameraController
  const handleKeyStateChange = useCallback((newKeyStates: Record<KeyName, boolean>) => {
    setActiveKeys(newKeyStates);
  }, []);

  // Add an input event to the log
  const addInputEventToLog = useCallback((event: Omit<InputEvent, 'timestamp'>) => {
    // Special handling for different event types to avoid duplicates
    if (event.type === 'keydown' && event.key) {
      if (keysPressedRef.current.has(event.key)) {
        return; // Skip repeat key events
      }
      keysPressedRef.current.add(event.key);
    } 
    else if (event.type === 'keyup' && event.key) {
      keysPressedRef.current.delete(event.key);
    }
    else if (event.type === 'mousedown' && event.button !== undefined) {
      mouseButtonsPressedRef.current.add(event.button);
    }
    else if (event.type === 'mouseup' && event.button !== undefined) {
      mouseButtonsPressedRef.current.delete(event.button);
    }
    else if (event.type === 'mousemove') {
      // Skip if position hasn't changed significantly (throttle mouse moves)
      if (lastMouseMoveRef.current && 
          Math.abs(lastMouseMoveRef.current.x - (event.x || 0)) < 5 &&
          Math.abs(lastMouseMoveRef.current.y - (event.y || 0)) < 5) {
        return;
      }
      
      // Throttle mouse move events
      if (throttleTimerRef.current) return;
      
      throttleTimerRef.current = setTimeout(() => {
        throttleTimerRef.current = null;
      }, 100);
      
      lastMouseMoveRef.current = { x: event.x || 0, y: event.y || 0 };
    }

    // Add event to log
    setInputEventLog(prevLog => {
      const newEvent: InputEvent = {
        ...event,
        timestamp: Date.now()
      };
      
      // Add to beginning of log and limit to 20 entries
      const updatedLog = [newEvent, ...prevLog].slice(0, 20);
      return updatedLog;
    });
  }, []);

  // Handle keyboard events
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Add to input event log
    addInputEventToLog({
      type: 'keydown',
      key: e.key
    });
    
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
  }, [isFocused, addInputEventToLog]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    // Add to input event log
    addInputEventToLog({
      type: 'keyup',
      key: e.key
    });
  }, [addInputEventToLog]);

  // Handle mouse events
  const handleMouseDown = useCallback((e: MouseEvent) => {
    // Skip if we already logged this button as pressed
    if (mouseButtonsPressedRef.current.has(e.button)) return;
    
    // Add to input event log
    addInputEventToLog({
      type: 'mousedown',
      button: e.button,
      x: e.clientX,
      y: e.clientY
    });
  }, [addInputEventToLog]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    // Add to input event log
    addInputEventToLog({
      type: 'mouseup',
      button: e.button,
      x: e.clientX,
      y: e.clientY
    });
  }, [addInputEventToLog]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    // Add to input event log (will be throttled)
    addInputEventToLog({
      type: 'mousemove',
      x: e.clientX,
      y: e.clientY
    });
  }, [addInputEventToLog]);

  const handleWheel = useCallback((e: WheelEvent) => {
    // Add to input event log
    addInputEventToLog({
      type: 'wheel',
      deltaY: e.deltaY,
      x: e.clientX,
      y: e.clientY
    });
  }, [addInputEventToLog]);

  // Set up and clean up event listeners
  useEffect(() => {
    // Attach all event listeners to the document
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Only attach mouse events if we have a canvas container
    if (canvasContainerRef.current) {
      canvasContainerRef.current.addEventListener('mousedown', handleMouseDown);
      canvasContainerRef.current.addEventListener('mouseup', handleMouseUp);
      canvasContainerRef.current.addEventListener('mousemove', handleMouseMove);
      canvasContainerRef.current.addEventListener('wheel', handleWheel);
    }
    
    return () => {
      // Clean up all event listeners
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      
      if (canvasContainerRef.current) {
        canvasContainerRef.current.removeEventListener('mousedown', handleMouseDown);
        canvasContainerRef.current.removeEventListener('mouseup', handleMouseUp);
        canvasContainerRef.current.removeEventListener('mousemove', handleMouseMove);
        canvasContainerRef.current.removeEventListener('wheel', handleWheel);
      }
      
      // Clear throttle timer if it exists
      if (throttleTimerRef.current) {
        clearTimeout(throttleTimerRef.current);
      }
    };
  }, [handleKeyDown, handleKeyUp, handleMouseDown, handleMouseUp, handleMouseMove, handleWheel]);

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
      ref={canvasContainerRef}
      className="relative w-full h-full"
      onClick={handleCanvasClick}
      style={{ outline: isFocused ? '3px solid #3b82f6' : 'none' }}
    >
      {!isFocused && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 text-white py-2 px-4 rounded z-10">
          Click to interact
        </div>
      )}
      
      {/* Camera position and input indicator display */}
      <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white py-1 px-3 rounded text-xs z-10" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        <p>Camera Position:</p>
        <p>X: {cameraPosition.x.toFixed(2)}</p>
        <p>Y: {cameraPosition.y.toFixed(2)}</p>
        <p>Z: {cameraPosition.z.toFixed(2)}</p>
        <div className="mt-2 pt-1 border-t border-gray-500">
          <p>Active Keys: <span className="font-mono">{activeKeysString}</span></p>
          <div className="mt-1">
            <p>Input Event Log:</p>
            <div className="mt-1 font-mono text-2xs bg-black bg-opacity-50 p-1 rounded" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {inputEventLog.length === 0 ? (
                <p className="text-gray-500">No input events yet</p>
              ) : (
                inputEventLog.map((event, index) => (
                  <div key={index} className={getEventColor(event.type)}>
                    {formatInputEvent(event)}
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