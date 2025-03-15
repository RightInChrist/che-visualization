import React from 'react';
import { PrimitiveModel } from '@/types/models';

interface PipeModelProps {
  model: PrimitiveModel;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export function PipeModel({ 
  model, 
  position = [0, 0, 0], 
  rotation = [0, 0, 0], 
  scale = [1, 1, 1] 
}: PipeModelProps) {
  const { height, radius, thickness } = model.parameters as { 
    height: number;
    radius: number;
    thickness: number;
  };

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh>
        <cylinderGeometry args={[radius, radius, height, 32]} />
        <meshStandardMaterial color="#888888" transparent opacity={0.8} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[radius - thickness, radius - thickness, height, 32]} />
        <meshStandardMaterial color="#888888" transparent opacity={0} />
      </mesh>
    </group>
  );
}

export default PipeModel; 