'use client';

import React, { useRef, useState, useCallback, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useModelStore, isStoreInitialized } from '@/store/modelStore';
import PipeModel from './models/PipeModel';
import PanelModel from './models/PanelModel';
import GroundModel from './models/GroundModel';
import CompositeModel from './models/CompositeModel';
import CameraController, { KeyName } from './controllers/CameraController';
import { Stats, Environment, Loader } from '@react-three/drei';
import { PrimitiveModel, CompositeModel as CompositeModelType } from '@/types/models';
import { Vector3, Object3D, WebGLRenderer, Mesh, Material } from 'three';

// Memory-optimized renderer with automatic recovery
function OptimizedRenderer() {
  const { gl, scene, camera } = useThree();
  
  useEffect(() => {
    // WebGL renderer is created by R3F
    const renderer = gl as WebGLRenderer;
    
    // Set memory-efficient renderer settings
    renderer.setPixelRatio(1); // Force pixel ratio to 1 for performance
    renderer.shadowMap.enabled = false; // Disable shadows for performance
    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2, false); // Half-resolution rendering
    
    // Disable expensive post-processing
    renderer.autoClear = true;
    renderer.outputColorSpace = 'srgb';
    
    // Implement aggressive memory management
    const maxAllowedMemory = 256 * 1024 * 1024; // 256MB
    
    // Handle context loss with more resilience
    const canvas = renderer.domElement;
    
    const handleContextLost = (event: Event) => {
      console.warn('WebGL context lost. Attempting to restore...');
      event.preventDefault();
      
      // Delay restoration attempt to allow GPU resources to free up
      setTimeout(() => {
        try {
          console.log('Attempting to reinitialize...');
          // Force resize to trigger internal recreations
          renderer.setSize(window.innerWidth / 2, window.innerHeight / 2, false);
          renderer.setSize(window.innerWidth, window.innerHeight, false);
        } catch (e) {
          console.error('Failed to recover:', e);
        }
      }, 3000);
    };
    
    const handleContextRestored = () => {
      console.log('WebGL context restored!');
      try {
        // Instead of using init() which doesn't exist on WebGLRenderer, 
        // just re-render the scene with current state
        renderer.setSize(renderer.domElement.width, renderer.domElement.height);
        renderer.render(scene, camera);
      } catch (e) {
        console.error('Error during context restoration:', e);
      }
    };
    
    // Monitor GPU memory usage if extension is available
    if (renderer.extensions.get('WEBGL_debug_renderer_info')) {
      console.log('WebGL debug info available');
      try {
        const gl = renderer.getContext();
        if (gl) {
          const ext = gl.getExtension('WEBGL_debug_renderer_info');
          if (ext) {
            const vendor = gl.getParameter(ext.UNMASKED_VENDOR_WEBGL);
            const renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
            console.log(`GPU: ${vendor} - ${renderer}`);
          }
        }
      } catch (e) {
        console.warn('Could not get GPU info', e);
      }
    }
    
    canvas.addEventListener('webglcontextlost', handleContextLost as EventListener);
    canvas.addEventListener('webglcontextrestored', handleContextRestored as EventListener);
    
    // Force garbage collection-like behavior
    const cleanup = () => {
      try {
        // Attempt to free some GPU resources
        scene.traverse((object) => {
          if (object.type === 'Mesh') {
            const mesh = object as Mesh;
            // Check if geometry exists but hasn't been marked as disposed yet
            if (mesh.geometry) {
              // Check if this is the first time we're seeing it
              if (!mesh.geometry.userData.__disposed) {
                mesh.geometry.dispose();
                // Mark as disposed to prevent duplicate dispose calls
                mesh.geometry.userData.__disposed = true;
              }
            }
            if (mesh.material) {
              const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
              materials.forEach((material: Material) => {
                // Skip if already disposed
                if (material.userData && material.userData.__disposed) return;
                
                Object.keys(material).forEach(prop => {
                  // Use type assertion for dynamic property access
                  const value = material[prop as keyof Material];
                  if (value && typeof value === 'object' && 'isTexture' in value && value.isTexture) {
                    value.dispose();
                  }
                });
                material.dispose();
                // Mark as disposed
                material.userData = material.userData || {};
                material.userData.__disposed = true;
              });
            }
          }
        });
        
        // Render a minimal scene to force cleanup
        renderer.render(scene, camera);
      } catch (e) {
        console.warn('Error in cleanup:', e);
      }
    };
    
    // Periodically run cleanup
    const cleanupInterval = setInterval(cleanup, 60000); // Every minute
    
    return () => {
      clearInterval(cleanupInterval);
      canvas.removeEventListener('webglcontextlost', handleContextLost as EventListener);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored as EventListener);
    };
  }, [gl, scene, camera]);
  
  return null;
}

// Simplified model renderer
const SimpleModelRenderer = React.memo(() => {
  const { models, instances, getModelById } = useModelStore();
  
  // Create a list of instance IDs that are referenced by composite models
  const compositeMemberIds = useMemo(() => {
    const memberIds = new Set<string>();
    
    models.forEach(model => {
      if (model.type === 'composite') {
        const compositeModel = model as CompositeModelType;
        if (compositeModel.references) {
          compositeModel.references.forEach(ref => {
            memberIds.add(ref.instanceId);
          });
        }
      }
    });
    
    return memberIds;
  }, [models]);
  
  useEffect(() => {
    isStoreInitialized();
  }, []);
  
  // Only render visible instances that aren't part of composites
  const visibleInstances = useMemo(() => {
    return instances.filter(instance => 
      instance.visible && 
      !compositeMemberIds.has(instance.instanceId)
    );
  }, [instances, compositeMemberIds]);
  
  return (
    <React.Fragment>
      {visibleInstances.map(instance => {
        const model = getModelById(instance.modelId);
        if (!model) return null;
        
        if (model.type === 'primitive') {
          const primitiveModel = model as PrimitiveModel;
          
          // Render different primitive types based on model ID
          if (model.id === 'green-ground') {
            return (
              <GroundModel 
                key={instance.instanceId}
                model={primitiveModel}
                instanceId={instance.instanceId}
                position={instance.position}
                rotation={instance.rotation}
                scale={instance.scale}
              />
            );
          } 
          else if (model.id.includes('pipe')) {
            return (
              <PipeModel
                key={instance.instanceId}
                model={primitiveModel}
                instanceId={instance.instanceId}
                position={instance.position}
                rotation={instance.rotation}
                scale={instance.scale}
              />
            );
          }
          else if (model.id.includes('panel')) {
            return (
              <PanelModel
                key={instance.instanceId}
                model={primitiveModel}
                instanceId={instance.instanceId}
                position={instance.position}
                rotation={instance.rotation}
                scale={instance.scale}
              />
            );
          }
        }
        else if (model.type === 'composite') {
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
    </React.Fragment>
  );
});

SimpleModelRenderer.displayName = 'SimpleModelRenderer';

// Simple position tracker without frequent updates
function SimpleCameraTracker({ onPositionChange }: { onPositionChange: (position: Vector3) => void }) {
  const { camera } = useThree();
  const lastUpdateRef = useRef(0);
  
  useFrame(() => {
    const now = Date.now();
    // Only update position every 500ms to reduce overhead
    if (now - lastUpdateRef.current > 500) {
      onPositionChange(camera.position.clone());
      lastUpdateRef.current = now;
    }
  });
  
  return null;
}

interface Scene3DProps {
  controllerType?: 'orbit' | 'firstPerson' | 'flight';
}

export default function Scene3D({ controllerType = 'orbit' }: Scene3DProps) {
  const [activeController, setActiveController] = useState(controllerType);
  const [cameraPosition, setCameraPosition] = useState(new Vector3(0, 50, 100));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const groundRef = useRef<Object3D>(null);
  
  // Simplified key state handling
  const handleKeyStateChange = useCallback((newKeyStates: Record<KeyName, boolean>) => {
    // We don't need to store all key states - just respond to them
  }, []);
  
  // Make sure store is initialized
  useEffect(() => {
    isStoreInitialized();
  }, []);
  
  return (
    <div className="relative w-full h-full flex flex-1">
      <Canvas
        ref={canvasRef}
        shadows={false} // Disable shadows for performance
        flat={true} // Disable tone mapping for performance
        camera={{ position: [0, 50, 100], fov: 50 }}
        gl={{ 
          antialias: false, // Disable antialiasing for performance
          alpha: false,
          stencil: false,
          depth: true,
          powerPreference: 'low-power' // Request low-power mode for stability
        }}
        dpr={1} // Force pixel ratio to 1 for stability
        frameloop="demand" // Only render when needed
        style={{ width: '100%', height: '100%' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x87ceeb, 1); // Light blue sky background
        }}
      >
        <Suspense fallback={null}>
          {/* Optimized renderer settings */}
          <OptimizedRenderer />
          
          {/* Simple position tracking */}
          <SimpleCameraTracker onPositionChange={setCameraPosition} />
          
          {/* Camera controller */}
          <CameraController 
            defaultController={activeController}
            onKeyStateChange={handleKeyStateChange}
            groundRef={groundRef as React.RefObject<Object3D>}
          />
          
          {/* Minimal lighting - single light */}
          <ambientLight intensity={0.8} />
          
          {/* Simplified models */}
          <SimpleModelRenderer />
        </Suspense>
      </Canvas>
      
      {/* Loading indicator */}
      <Loader />
    </div>
  );
} 