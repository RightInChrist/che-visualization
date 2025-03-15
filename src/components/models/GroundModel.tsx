import React from 'react';
import { PrimitiveModel } from '@/types/models';

interface GroundModelProps {
  model: PrimitiveModel;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export function GroundModel({ 
  model, 
  position = [0, 0, 0], 
  rotation = [0, 0, 0], 
  scale = [1, 1, 1] 
}: GroundModelProps) {
  const { size } = model.parameters as { 
    size: number;
  };

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color="#2e8b57" />
      </mesh>
    </group>
  );
}

export default GroundModel; 