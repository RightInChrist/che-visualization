import React from 'react';
import { PrimitiveModel } from '@/types/models';

interface PipeModelProps {
  model: PrimitiveModel;
  instanceId: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export function PipeModel({ 
  model, 
  instanceId,
  position = [0, 0, 0], 
  rotation = [0, 0, 0], 
  scale = [1, 1, 1] 
}: PipeModelProps) {
  const { height, radius, thickness } = model.parameters as { 
    height: number;
    radius: number;
    thickness: number;
  };

  // Calculate Y position offset to ensure pipe is positioned from ground up
  // By default, cylinder is centered on its origin, so we need to shift it up by half its height
  const yOffset = height / 2;
  const adjustedPosition: [number, number, number] = [
    position[0],
    position[1] + yOffset,
    position[2]
  ];

  return (
    <group position={adjustedPosition} rotation={rotation} scale={scale}>
      {/* Add a debug sphere to mark the actual position */}
      <mesh position={[0, -yOffset, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="red" />
      </mesh>
      
      {/* Outer pipe */}
      <mesh>
        <cylinderGeometry args={[radius, radius, height, 32]} />
        <meshStandardMaterial color="#888888" transparent opacity={0.8} />
      </mesh>
      
      {/* Inner pipe (hollow part) */}
      <mesh>
        <cylinderGeometry args={[radius - thickness, radius - thickness, height, 32]} />
        <meshStandardMaterial color="#888888" transparent opacity={0} />
      </mesh>
      
      {/* Height markers every 100 units */}
      {Array.from({ length: Math.floor(height / 100) + 1 }).map((_, i) => (
        <mesh key={i} position={[0, -height/2 + i * 100, 0]}>
          <torusGeometry args={[radius + 0.1, 0.1, 16, 32]} />
          <meshStandardMaterial color={i % 5 === 0 ? "red" : "yellow"} />
        </mesh>
      ))}
    </group>
  );
}

export default PipeModel; 