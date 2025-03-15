import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useModelStore } from '@/store/modelStore';
import PipeModel from './models/PipeModel';
import PanelModel from './models/PanelModel';
import GroundModel from './models/GroundModel';
import CompositeModel from './models/CompositeModel';
import CameraController from './controllers/CameraController';
import { Stats, Environment } from '@react-three/drei';
import { PrimitiveModel, CompositeModel as CompositeModelType } from '@/types/models';

type ControllerType = 'orbit' | 'firstPerson' | 'flight';

interface WindowWithController extends Window {
  setController?: (type: ControllerType) => void;
}

interface Scene3DProps {
  controllerType?: ControllerType;
}

export function Scene3D({ controllerType = 'orbit' }: Scene3DProps) {
  const { models, instances, getModelById } = useModelStore();
  const [isFocused, setIsFocused] = useState(false);
  const [activeController, setActiveController] = useState<ControllerType>(controllerType);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Handle focus state
  const handleCanvasClick = useCallback(() => {
    if (!isFocused) {
      setIsFocused(true);
      canvasRef.current?.focus();
    }
  }, [isFocused]);

  // Handle escape key to exit focus
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
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
  }, [isFocused]);

  // Set up and clean up event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

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
      
      <Canvas 
        ref={canvasRef}
        style={{ height: '100%', width: '100%' }} 
        shadows
        tabIndex={0}
        camera={{ position: [0, 50, 100], fov: 50 }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 100, 10]} intensity={1} castShadow />
        
        <CameraController defaultController={activeController} />
        <Environment preset="sunset" />
        
        {/* Render all visible instances */}
        {instances.map(instance => {
          if (!instance.visible) return null;
          
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