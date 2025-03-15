import React, { useState, useRef, useEffect, MutableRefObject } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, FlyControls, FirstPersonControls, PointerLockControls, Grid } from '@react-three/drei';
import { Vector3 } from 'three';

type ControllerType = 'orbit' | 'firstPerson' | 'flight';

interface CameraControllerProps {
  defaultController?: ControllerType;
  onKeyStateChange?: (keyStates: Record<KeyName, boolean>) => void;
}

interface WindowWithController extends Window {
  setController?: (type: ControllerType) => void;
}

// Define valid keys for type safety
export type KeyName = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | ' ' | 'Shift' | 
               'w' | 'a' | 's' | 'd' | 'W' | 'A' | 'S' | 'D';

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
    'D': false
  }
};

export function CameraController({ defaultController = 'orbit', onKeyStateChange }: CameraControllerProps) {
  const [activeController, setActiveController] = useState<ControllerType>(defaultController);
  const orbitRef = useRef(null);
  const flyRef = useRef(null);
  const firstPersonRef = useRef(null);
  const pointerLockRef = useRef(null);
  const { camera, scene } = useThree();
  const [isLocked, setIsLocked] = useState(false);
  
  // Track key states
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
    'D': false
  });
  
  // Movement speed with keys (adjust as needed)
  const MOVE_SPEED = 2;
  const VERTICAL_SPEED = 2;
  
  // Minimum height from ground to maintain (prevents going below ground)
  const MIN_HEIGHT = 1;

  // Make controller change accessible from outside via window object for UI controls
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const customWindow = window as WindowWithController;
      customWindow.setController = (type: ControllerType) => {
        if (['orbit', 'firstPerson', 'flight'].includes(type)) {
          setActiveController(type);
          
          // If switching to a mode that requires pointer lock
          if ((type === 'firstPerson' || type === 'flight') && pointerLockRef.current) {
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

  // Handle lock change
  const handleLockChange = (isLocked: boolean) => {
    setIsLocked(isLocked);
  };
  
  // Set up keyboard controls that work across all controller types
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      // Handle WASD keys explicitly
      if (['w', 'a', 's', 'd'].includes(key)) {
        e.preventDefault();
        // Safely set the key state
        if (key in keyStates.current) {
          keyStates.current[key as KeyName] = true;
          globalKeyStates.current[key as KeyName] = true;
        }
        
        // Also set uppercase version for case-insensitive handling
        const upperKey = key.toUpperCase() as KeyName;
        if (upperKey in keyStates.current) {
          keyStates.current[upperKey] = true;
          globalKeyStates.current[upperKey] = true;
        }
        
        // Notify parent component about key state change
        if (onKeyStateChange) {
          onKeyStateChange({...keyStates.current});
        }
        return;
      }
      
      // Handle arrow keys and space
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
        e.preventDefault();
        
        // For arrow keys, we need to use the original key since they're stored with capital letters
        const storeKey = key === ' ' ? ' ' as KeyName : e.key as KeyName;
        if (storeKey in keyStates.current) {
          keyStates.current[storeKey] = true;
          globalKeyStates.current[storeKey] = true;
        }
        
        // Notify parent component about key state change
        if (onKeyStateChange) {
          onKeyStateChange({...keyStates.current});
        }
      }
      
      // Check for shift key
      if (key === 'shift') {
        keyStates.current['Shift'] = true;
        globalKeyStates.current['Shift'] = true;
        
        // Notify parent component about key state change
        if (onKeyStateChange) {
          onKeyStateChange({...keyStates.current});
        }
      }
      
      // Debug - log key states on keydown
      console.log('Key Down:', e.key);
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      // Handle WASD keys explicitly
      if (['w', 'a', 's', 'd'].includes(key)) {
        // Safely set the key state
        if (key in keyStates.current) {
          keyStates.current[key as KeyName] = false;
          globalKeyStates.current[key as KeyName] = false;
        }
        
        // Also set uppercase version for case-insensitive handling
        const upperKey = key.toUpperCase() as KeyName;
        if (upperKey in keyStates.current) {
          keyStates.current[upperKey] = false;
          globalKeyStates.current[upperKey] = false;
        }
        
        // Notify parent component about key state change
        if (onKeyStateChange) {
          onKeyStateChange({...keyStates.current});
        }
        return;
      }
      
      // Handle arrow keys and space
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
        // For arrow keys, we need to use the original key since they're stored with capital letters
        const storeKey = key === ' ' ? ' ' as KeyName : e.key as KeyName;
        if (storeKey in keyStates.current) {
          keyStates.current[storeKey] = false;
          globalKeyStates.current[storeKey] = false;
        }
        
        // Notify parent component about key state change
        if (onKeyStateChange) {
          onKeyStateChange({...keyStates.current});
        }
      }
      
      // Check for shift key
      if (key === 'shift') {
        keyStates.current['Shift'] = false;
        globalKeyStates.current['Shift'] = false;
        
        // Notify parent component about key state change
        if (onKeyStateChange) {
          onKeyStateChange({...keyStates.current});
        }
      }
      
      // Debug - log key states on keyup
      console.log('Key Up:', e.key);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onKeyStateChange]);
  
  // Update global key states ref in useFrame to ensure it stays synced
  useFrame(() => {
    // Sync global key states with local key states
    Object.assign(globalKeyStates.current, keyStates.current);
  });
  
  // Camera movement with keyboard
  useFrame(() => {
    // Always apply keyboard movement, regardless of controller type
    const moveDirection = new Vector3(0, 0, 0);
    
    // Get camera's forward direction (z-axis)
    const forward = new Vector3(0, 0, -1);
    forward.applyQuaternion(camera.quaternion);
    forward.y = 0; // Keep horizontal movement horizontal
    forward.normalize();
    
    // Get camera's right direction (x-axis)
    const right = new Vector3(1, 0, 0);
    right.applyQuaternion(camera.quaternion);
    right.y = 0; // Keep horizontal movement horizontal
    right.normalize();
    
    // Apply movement based on arrow keys AND WASD
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
    
    // Apply vertical movement based on space and shift keys
    let verticalMovement = 0;
    if (keyStates.current[' ']) {
      verticalMovement += VERTICAL_SPEED; // Move up with spacebar
    }
    if (keyStates.current['Shift']) {
      verticalMovement -= VERTICAL_SPEED; // Move down with shift
    }
    
    // Check for minimum height constraint
    if (camera.position.y + verticalMovement < MIN_HEIGHT && verticalMovement < 0) {
      // If would go below minimum height, set to exactly minimum height
      verticalMovement = MIN_HEIGHT - camera.position.y;
    }
    
    moveDirection.y += verticalMovement;
    
    // Apply the movement to the camera position
    if (moveDirection.length() > 0) {
      camera.position.add(moveDirection);
      
      // Special handling for orbit controls to maintain proper view of the scene
      if (activeController === 'orbit' && orbitRef.current) {
        // @ts-ignore - OrbitControls has a target property
        const target = orbitRef.current.target;
        
        // For orbit camera, we want to:
        // 1. Always update X and Z to follow the camera horizontally
        // 2. For Y, we want to adjust it based on camera height to maintain a reasonable viewing angle
        target.x += moveDirection.x;
        target.z += moveDirection.z;
        
        // Dynamic target height adjustment:
        // - At lower camera heights, keep target near ground
        // - At higher heights, gradually raise target to look more downward
        const cameraHeight = camera.position.y;
        const targetHeight = Math.max(0, cameraHeight * 0.3 - 5);
        
        // Smoothly interpolate the target height toward the desired value
        target.y += (targetHeight - target.y) * 0.1;
      }
    }
  });

  return (
    <>
      {/* Reference grid to provide visual orientation */}
      <Grid 
        infiniteGrid 
        cellSize={5} 
        cellThickness={0.5} 
        cellColor="#444444" 
        sectionSize={25}
        sectionThickness={1}
        sectionColor="#888888"
        fadeDistance={100}
        fadeStrength={1}
      />
      
      {/* Orbit controls - standard camera rotation around a target */}
      {activeController === 'orbit' && (
        <OrbitControls
          ref={orbitRef}
          makeDefault
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={1}
          maxDistance={1000}
          minPolarAngle={0.1} // Prevent going exactly overhead
          maxPolarAngle={Math.PI - 0.1} // Prevent going exactly underneath
        />
      )}
      
      {/* First person controls - mouse movement only for looking */}
      {activeController === 'firstPerson' && (
        <PointerLockControls 
          ref={pointerLockRef}
          onLock={() => handleLockChange(true)}
          onUnlock={() => handleLockChange(false)}
        />
      )}
      
      {/* Flight controls - more free movement in all directions */}
      {activeController === 'flight' && (
        <PointerLockControls 
          ref={pointerLockRef}
          onLock={() => handleLockChange(true)}
          onUnlock={() => handleLockChange(false)}
        />
      )}
    </>
  );
}

export default CameraController; 