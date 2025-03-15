import React, { useState, useRef, useEffect, MutableRefObject } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, PointerLockControls } from '@react-three/drei';
import { Vector3, Raycaster, Object3D } from 'three';

type ControllerType = 'orbit' | 'firstPerson' | 'flight';

interface CameraControllerProps {
  defaultController?: ControllerType;
  onKeyStateChange?: (keyStates: Record<KeyName, boolean>) => void;
  groundRef?: React.RefObject<Object3D>;
}

interface WindowWithController extends Window {
  setController?: (type: ControllerType) => void;
}

// Define valid keys for type safety
export type KeyName = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | ' ' | 'Shift' | 
               'w' | 'a' | 's' | 'd' | 'W' | 'A' | 'S' | 'D' | 'F1';

// Export keyStates object for external use
export const globalKeyStates: MutableRefObject<Record<KeyName, boolean>> = {
  current: {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    ' ': false,     // Space key
    'Shift': false, // Shift key
    'w': false,     // WASD keys
    'a': false,
    's': false,
    'd': false,
    'W': false,     // Capital WASD keys
    'A': false,
    'S': false,
    'D': false,
    'F1': false
  }
};

export function CameraController({ 
  defaultController = 'orbit', 
  onKeyStateChange,
  groundRef 
}: CameraControllerProps) {
  const [activeController, setActiveController] = useState<ControllerType>(defaultController);
  const orbitRef = useRef(null);
  const pointerLockRef = useRef(null);
  const { camera, scene } = useThree();
  const [isLocked, setIsLocked] = useState(false);
  
  // Movement tracking
  const keyStates = useRef<Record<KeyName, boolean>>({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    ' ': false,     // Space key
    'Shift': false, // Shift key
    'w': false,     // WASD keys
    'a': false,
    's': false,
    'd': false,
    'W': false,     // Capital WASD keys
    'A': false,
    'S': false,
    'D': false,
    'F1': false
  });
  
  // Movement speed and limits
  const MOVE_SPEED = 2;
  const VERTICAL_SPEED = 5;  // Adjusted to be faster to navigate the 1000m tall pipes
  const MIN_HEIGHT = 1;
  const groundY = useRef(0);

  // Make controller change accessible from outside via window object
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const customWindow = window as WindowWithController;
      customWindow.setController = (type: ControllerType) => {
        if (['orbit', 'firstPerson', 'flight'].includes(type)) {
          setActiveController(type);
          
          // If switching to a mode that requires pointer lock
          if (type === 'firstPerson' && pointerLockRef.current) {
            // Small timeout to ensure component is ready
            setTimeout(() => {
              if (pointerLockRef.current) {
                // @ts-ignore - PointerLockControls has a lock method
                pointerLockRef.current.lock();
              }
            }, 100);
          }
        }
      };
    }
  }, []);
  
  // Handle pointer lock change events
  const handleLock = () => {
    setIsLocked(true);
  };
  
  const handleUnlock = () => {
    setIsLocked(false);
  };
  
  // Set up keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      // Handle number keys for camera mode switching
      if (['1', '2', '3'].includes(key)) {
        e.preventDefault();
        
        if (key === '1') {
          setActiveController('orbit');
        } else if (key === '2') {
          setActiveController('firstPerson');
          if (pointerLockRef.current) {
            // @ts-ignore - PointerLockControls has a lock method
            pointerLockRef.current.lock();
          }
        } else if (key === '3') {
          setActiveController('flight');
        }
        
        return;
      }
      
      // Handle WASD keys
      if (['w', 'a', 's', 'd'].includes(key)) {
        e.preventDefault();
        if (key in keyStates.current) {
          keyStates.current[key as KeyName] = true;
          globalKeyStates.current[key as KeyName] = true;
        }
        
        // Also set uppercase version
        const upperKey = key.toUpperCase() as KeyName;
        if (upperKey in keyStates.current) {
          keyStates.current[upperKey] = true;
          globalKeyStates.current[upperKey] = true;
        }
        
        if (onKeyStateChange) {
          onKeyStateChange({...keyStates.current});
        }
        return;
      }
      
      // Handle arrow keys and space
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
        e.preventDefault();
        const storeKey = key === ' ' ? ' ' as KeyName : e.key as KeyName;
        if (storeKey in keyStates.current) {
          keyStates.current[storeKey] = true;
          globalKeyStates.current[storeKey] = true;
        }
        
        if (onKeyStateChange) {
          onKeyStateChange({...keyStates.current});
        }
      }
      
      // Check for shift key
      if (key === 'shift') {
        keyStates.current['Shift'] = true;
        globalKeyStates.current['Shift'] = true;
        
        if (onKeyStateChange) {
          onKeyStateChange({...keyStates.current});
        }
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      // Handle WASD keys
      if (['w', 'a', 's', 'd'].includes(key)) {
        if (key in keyStates.current) {
          keyStates.current[key as KeyName] = false;
          globalKeyStates.current[key as KeyName] = false;
        }
        
        // Also update uppercase version
        const upperKey = key.toUpperCase() as KeyName;
        if (upperKey in keyStates.current) {
          keyStates.current[upperKey] = false;
          globalKeyStates.current[upperKey] = false;
        }
        
        if (onKeyStateChange) {
          onKeyStateChange({...keyStates.current});
        }
        return;
      }
      
      // Handle arrow keys and space
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
        const storeKey = key === ' ' ? ' ' as KeyName : e.key as KeyName;
        if (storeKey in keyStates.current) {
          keyStates.current[storeKey] = false;
          globalKeyStates.current[storeKey] = false;
        }
        
        if (onKeyStateChange) {
          onKeyStateChange({...keyStates.current});
        }
      }
      
      // Check for shift key
      if (key === 'shift') {
        keyStates.current['Shift'] = false;
        globalKeyStates.current['Shift'] = false;
        
        if (onKeyStateChange) {
          onKeyStateChange({...keyStates.current});
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onKeyStateChange]);
  
  // Find the ground height
  useEffect(() => {
    // Find the groundPlane in the scene if not provided
    if (!groundRef?.current) {
      scene.traverse((object) => {
        if (object.name === 'GroundPlane' || object.name?.includes('ground')) {
          groundY.current = object.position.y;
        }
      });
    } else {
      groundY.current = groundRef.current.position.y;
    }
  }, [scene, groundRef]);
  
  // Camera movement with keyboard and ground following
  useFrame(() => {
    // Keep global keyStates in sync
    Object.assign(globalKeyStates.current, keyStates.current);
    
    // Calculate movement direction
    const moveDirection = new Vector3(0, 0, 0);
    
    // Get camera forward and right vectors
    const forward = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    forward.y = 0;
    forward.normalize();
    
    const right = new Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    right.y = 0;
    right.normalize();
    
    // Apply movement based on key states
    if (keyStates.current.ArrowUp || keyStates.current.w || keyStates.current.W) {
      moveDirection.add(forward.clone().multiplyScalar(MOVE_SPEED));
    }
    if (keyStates.current.ArrowDown || keyStates.current.s || keyStates.current.S) {
      moveDirection.add(forward.clone().multiplyScalar(-MOVE_SPEED));
    }
    if (keyStates.current.ArrowRight || keyStates.current.d || keyStates.current.D) {
      moveDirection.add(right.clone().multiplyScalar(MOVE_SPEED));
    }
    if (keyStates.current.ArrowLeft || keyStates.current.a || keyStates.current.A) {
      moveDirection.add(right.clone().multiplyScalar(-MOVE_SPEED));
    }
    
    // Apply vertical movement
    let verticalMovement = 0;
    if (keyStates.current[' ']) {
      verticalMovement += VERTICAL_SPEED;
    }
    if (keyStates.current['Shift']) {
      verticalMovement -= VERTICAL_SPEED;
    }
    
    // Apply minimum height constraint
    if (camera.position.y + verticalMovement < MIN_HEIGHT + groundY.current && verticalMovement < 0) {
      verticalMovement = (MIN_HEIGHT + groundY.current) - camera.position.y;
    }
    
    moveDirection.y += verticalMovement;
    
    // Apply movement to camera
    if (moveDirection.length() > 0) {
      camera.position.add(moveDirection);
      
      // Update orbit controls target
      if (activeController === 'orbit' && orbitRef.current) {
        // @ts-ignore - OrbitControls has a target property
        const target = orbitRef.current.target;
        
        // Always follow camera horizontally
        target.x += moveDirection.x;
        target.z += moveDirection.z;
        
        // Simple target height adjustment based on camera height
        const cameraHeight = camera.position.y - groundY.current;
        let targetHeight;
        
        if (cameraHeight < 50) {
          // Near ground
          targetHeight = groundY.current;
        } else if (cameraHeight < 200) {
          // Medium height
          targetHeight = groundY.current + cameraHeight * 0.1;
        } else {
          // High elevation
          targetHeight = groundY.current + cameraHeight * 0.2;
        }
        
        // Smooth interpolation
        target.y += (targetHeight - target.y) * 0.1;
      }
    }
  });

  return (
    <React.Fragment>
      {/* Grid for spatial awareness */}
      <Grid 
        infiniteGrid 
        cellSize={5} 
        cellThickness={0.5}
        cellColor="#444444" 
        sectionSize={25}
        sectionThickness={1}
        sectionColor="#888888"
        fadeDistance={80}
        fadeStrength={1}
      />
      
      {/* Orbit controls */}
      {activeController === 'orbit' && (
        <OrbitControls
          ref={orbitRef}
          makeDefault
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={1}
          maxDistance={5000}
          minPolarAngle={0.1}
          maxPolarAngle={Math.PI - 0.1}
        />
      )}
      
      {/* First person controls (uses pointer lock for mouse look) */}
      {activeController === 'firstPerson' && (
        <PointerLockControls
          ref={pointerLockRef}
          onLock={handleLock}
          onUnlock={handleUnlock}
        />
      )}
      
      {/* Flight controls (similar to first person) */}
      {activeController === 'flight' && (
        <PointerLockControls
          ref={pointerLockRef}
          onLock={handleLock}
          onUnlock={handleUnlock}
        />
      )}
    </React.Fragment>
  );
}

export default CameraController; 