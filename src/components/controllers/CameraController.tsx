import React, { useState, useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, FlyControls, FirstPersonControls, PointerLockControls } from '@react-three/drei';
import { Vector3 } from 'three';

type ControllerType = 'orbit' | 'firstPerson' | 'flight';

interface CameraControllerProps {
  defaultController?: ControllerType;
}

interface WindowWithController extends Window {
  setController?: (type: ControllerType) => void;
}

export function CameraController({ defaultController = 'orbit' }: CameraControllerProps) {
  const [activeController, setActiveController] = useState<ControllerType>(defaultController);
  const orbitRef = useRef(null);
  const flyRef = useRef(null);
  const firstPersonRef = useRef(null);
  const pointerLockRef = useRef(null);
  const { camera, scene } = useThree();
  const [isLocked, setIsLocked] = useState(false);
  
  // Track arrow key states
  const arrowKeys = useRef({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  });
  
  // Movement speed with arrow keys (adjust as needed)
  const ARROW_MOVE_SPEED = 2;

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
  
  // Set up arrow key controls that work across all controller types
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault(); // Prevent default browser scrolling
        arrowKeys.current[e.key as keyof typeof arrowKeys.current] = true;
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        arrowKeys.current[e.key as keyof typeof arrowKeys.current] = false;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  // Camera movement with arrow keys
  useFrame(() => {
    // Only apply arrow key movement when not using pointer lock controls
    // or if pointer lock controls are locked
    if (!((activeController === 'firstPerson' || activeController === 'flight') && !isLocked)) {
      const moveDirection = new Vector3(0, 0, 0);
      
      // Get camera's forward direction (z-axis)
      const forward = new Vector3(0, 0, -1);
      forward.applyQuaternion(camera.quaternion);
      forward.y = 0; // Keep movement horizontal
      forward.normalize();
      
      // Get camera's right direction (x-axis)
      const right = new Vector3(1, 0, 0);
      right.applyQuaternion(camera.quaternion);
      right.y = 0; // Keep movement horizontal
      right.normalize();
      
      // Apply movement based on arrow keys
      if (arrowKeys.current.ArrowUp) {
        moveDirection.add(forward.clone().multiplyScalar(ARROW_MOVE_SPEED));
      }
      if (arrowKeys.current.ArrowDown) {
        moveDirection.add(forward.clone().multiplyScalar(-ARROW_MOVE_SPEED));
      }
      if (arrowKeys.current.ArrowRight) {
        moveDirection.add(right.clone().multiplyScalar(ARROW_MOVE_SPEED));
      }
      if (arrowKeys.current.ArrowLeft) {
        moveDirection.add(right.clone().multiplyScalar(-ARROW_MOVE_SPEED));
      }
      
      // Apply the movement to the camera position
      if (moveDirection.length() > 0) {
        camera.position.add(moveDirection);
        
        // If using OrbitControls, update the target position to follow the camera
        if (activeController === 'orbit' && orbitRef.current) {
          // @ts-ignore - OrbitControls has a target property
          const target = orbitRef.current.target;
          target.add(moveDirection);
        }
      }
    }
  });

  return (
    <>
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
        />
      )}
      
      {/* First person controls - WASD + mouse movement */}
      {activeController === 'firstPerson' && (
        <>
          <PointerLockControls 
            ref={pointerLockRef}
            onLock={() => handleLockChange(true)}
            onUnlock={() => handleLockChange(false)}
          />
          {isLocked && (
            <FirstPersonControls
              ref={firstPersonRef}
              makeDefault
              lookSpeed={0.1}
              movementSpeed={50}
              lookVertical={true}
            />
          )}
        </>
      )}
      
      {/* Flight controls - more free movement in all directions */}
      {activeController === 'flight' && (
        <>
          <PointerLockControls 
            ref={pointerLockRef}
            onLock={() => handleLockChange(true)}
            onUnlock={() => handleLockChange(false)}
          />
          {isLocked && (
            <FlyControls
              ref={flyRef}
              makeDefault
              movementSpeed={100}
              rollSpeed={0.5}
              dragToLook={false}
            />
          )}
        </>
      )}
    </>
  );
}

export default CameraController; 