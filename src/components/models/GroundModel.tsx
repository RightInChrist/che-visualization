import React, { forwardRef } from 'react';
import { PrimitiveModel } from '@/types/models';
import { Object3D } from 'three';

interface GroundModelProps {
  model: PrimitiveModel;
  instanceId: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

// Convert to forwardRef to allow parent components to access the ground mesh
const GroundModel = forwardRef<Object3D, GroundModelProps>(({
  model, 
  instanceId,
  position = [0, 0, 0], 
  rotation = [0, 0, 0], 
  scale = [1, 1, 1] 
}, ref) => {
  const { size } = model.parameters as { 
    size: number;
  };

  return (
    <group 
      ref={ref}
      position={position} 
      rotation={rotation} 
      scale={scale}
      name={`GroundPlane-${instanceId}`}
    >
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color="#2e8b57" />
      </mesh>
    </group>
  );
});

// Add display name for debugging
GroundModel.displayName = 'GroundModel';

export default GroundModel; 