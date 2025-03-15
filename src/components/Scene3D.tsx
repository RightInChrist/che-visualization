import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useModelStore } from '@/store/modelStore';
import PipeModel from './models/PipeModel';
import PanelModel from './models/PanelModel';
import CompositeModel from './models/CompositeModel';
import CameraController from './controllers/CameraController';
import { Stats, Environment } from '@react-three/drei';
import { PrimitiveModel, CompositeModel as CompositeModelType } from '@/types/models';

interface Scene3DProps {
  controllerType?: 'orbit' | 'firstPerson' | 'flight';
}

export function Scene3D({ controllerType = 'orbit' }: Scene3DProps) {
  const { models } = useModelStore();

  return (
    <Canvas style={{ height: '100%', width: '100%' }} shadows>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} castShadow />
      <gridHelper args={[1000, 100, '#444444', '#555555']} />
      <axesHelper args={[500]} />
      
      <CameraController defaultController={controllerType} />
      <Environment preset="city" />
      
      {/* Render all visible models */}
      {models.map(model => {
        if (!model.visible) return null;
        
        if (model.type === 'primitive') {
          if (model.id === 'big-pipe') {
            return <PipeModel key={model.id} model={model as PrimitiveModel} />;
          } else if (model.id === 'big-panel') {
            return <PanelModel key={model.id} model={model as PrimitiveModel} />;
          }
        } else if (model.type === 'composite') {
          return <CompositeModel key={model.id} model={model as CompositeModelType} />;
        }
        
        return null;
      })}
      
      <Stats />
    </Canvas>
  );
}

export default Scene3D; 