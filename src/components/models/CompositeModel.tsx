import React from 'react';
import { CompositeModel as CompositeModelType, PrimitiveModel } from '@/types/models';
import { useModelStore } from '@/store/modelStore';
import PipeModel from './PipeModel';
import PanelModel from './PanelModel';
import GroundModel from './GroundModel';

interface CompositeModelProps {
  model: CompositeModelType;
  instanceId: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export function CompositeModel({ 
  model, 
  instanceId,
  position = [0, 0, 0], 
  rotation = [0, 0, 0], 
  scale = [1, 1, 1] 
}: CompositeModelProps) {
  const { getModelById, getInstanceById } = useModelStore();

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {model.references.map((reference, index) => {
        const instance = getInstanceById(reference.instanceId);
        if (!instance || !instance.visible) return null;

        const referencedModel = getModelById(instance.modelId);
        if (!referencedModel) return null;

        if (referencedModel.type === 'primitive') {
          if (referencedModel.id === 'big-pipe') {
            return (
              <PipeModel
                key={`${instanceId}-ref-${index}`}
                model={referencedModel as PrimitiveModel}
                instanceId={instance.instanceId}
                position={reference.position}
                rotation={reference.rotation}
                scale={reference.scale}
              />
            );
          } else if (referencedModel.id === 'big-panel') {
            return (
              <PanelModel
                key={`${instanceId}-ref-${index}`}
                model={referencedModel as PrimitiveModel}
                instanceId={instance.instanceId}
                position={reference.position}
                rotation={reference.rotation}
                scale={reference.scale}
              />
            );
          } else if (referencedModel.id === 'green-ground') {
            return (
              <GroundModel
                key={`${instanceId}-ref-${index}`}
                model={referencedModel as PrimitiveModel}
                instanceId={instance.instanceId}
                position={reference.position}
                rotation={reference.rotation}
                scale={reference.scale}
              />
            );
          }
        } else if (referencedModel.type === 'composite') {
          return (
            <CompositeModel
              key={`${instanceId}-ref-${index}`}
              model={referencedModel as CompositeModelType}
              instanceId={instance.instanceId}
              position={reference.position}
              rotation={reference.rotation}
              scale={reference.scale}
            />
          );
        }
        return null;
      })}
    </group>
  );
}

export default CompositeModel; 