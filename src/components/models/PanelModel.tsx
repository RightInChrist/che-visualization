import React from 'react';
import { PrimitiveModel } from '@/types/models';

interface PanelModelProps {
  model: PrimitiveModel;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export function PanelModel({ 
  model, 
  position = [0, 0, 0], 
  rotation = [0, 0, 0], 
  scale = [1, 1, 1] 
}: PanelModelProps) {
  const { height, width, thickness } = model.parameters as { 
    height: number;
    width: number;
    thickness: number;
  };

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh>
        <boxGeometry args={[width, height, thickness]} />
        <meshStandardMaterial color="#aaaaaa" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

export default PanelModel; 