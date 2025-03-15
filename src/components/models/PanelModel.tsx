import React from 'react';
import { PrimitiveModel } from '@/types/models';
import * as THREE from 'three';

interface PanelModelProps {
  model: PrimitiveModel;
  instanceId: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export function PanelModel({ 
  model, 
  instanceId,
  position = [0, 0, 0], 
  rotation = [0, 0, 0], 
  scale = [1, 1, 1] 
}: PanelModelProps) {
  const { height, width, thickness } = model.parameters as { 
    height: number;
    width: number;
    thickness: number;
  };

  // Calculate Y position offset to ensure panel is positioned from ground up
  // By default, box is centered on its origin, so we need to shift it up by half its height
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
        <meshStandardMaterial color="blue" />
      </mesh>
      
      {/* Main panel */}
      <mesh>
        <boxGeometry args={[width, height, thickness]} />
        <meshStandardMaterial color="#aaaaaa" transparent opacity={0.7} />
      </mesh>
      
      {/* Height markers every 100 units */}
      {Array.from({ length: Math.floor(height / 100) + 1 }).map((_, i) => (
        <mesh key={i} position={[0, -height/2 + i * 100, 0]}>
          <boxGeometry args={[width + 0.2, 0.5, thickness + 0.2]} />
          <meshStandardMaterial color={i % 5 === 0 ? "red" : "orange"} />
        </mesh>
      ))}
      
      {/* Edge outlines for better visibility */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(width, height, thickness)]} />
        <lineBasicMaterial color="#000000" />
      </lineSegments>
    </group>
  );
}

export default PanelModel; 