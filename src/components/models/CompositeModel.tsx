import React from 'react';
import { CompositeModel as CompositeModelType, PrimitiveModel } from '@/types/models';
import { useModelStore } from '@/store/modelStore';
import PipeModel from './PipeModel';
import PanelModel from './PanelModel';

interface CompositeModelProps {
  model: CompositeModelType;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export function CompositeModel({ 
  model, 
  position = [0, 0, 0], 
  rotation = [0, 0, 0], 
  scale = [1, 1, 1] 
}: CompositeModelProps) {
  const { getModelById } = useModelStore();

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {model.references.map((reference, index) => {
        const referencedModel = getModelById(reference.modelId);
        if (!referencedModel || !referencedModel.visible) return null;

        if (referencedModel.type === 'primitive') {
          if (referencedModel.id === 'big-pipe') {
            return (
              <PipeModel
                key={`${model.id}-ref-${index}`}
                model={referencedModel as PrimitiveModel}
                position={reference.position}
                rotation={reference.rotation}
                scale={reference.scale}
              />
            );
          } else if (referencedModel.id === 'big-panel') {
            return (
              <PanelModel
                key={`${model.id}-ref-${index}`}
                model={referencedModel as PrimitiveModel}
                position={reference.position}
                rotation={reference.rotation}
                scale={reference.scale}
              />
            );
          }
        } else if (referencedModel.type === 'composite') {
          return (
            <CompositeModel
              key={`${model.id}-ref-${index}`}
              model={referencedModel as CompositeModelType}
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