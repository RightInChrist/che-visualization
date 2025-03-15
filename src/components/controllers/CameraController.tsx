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
  
  // Track key states
  const keyStates = useRef({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    ' ': false,     // Space key
    'Shift': false  // Shift key
  });
  
  // Movement speed with keys (adjust as needed)
  const MOVE_SPEED = 2;
  const VERTICAL_SPEED = 2;

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
      // Check for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault(); // Prevent default browser scrolling/actions
        keyStates.current[e.key as keyof typeof keyStates.current] = true;
      }
      
      // Check for shift key
      if (e.key === 'Shift') {
        keyStates.current['Shift'] = true;
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      // Check for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        keyStates.current[e.key as keyof typeof keyStates.current] = false;
      }
      
      // Check for shift key
      if (e.key === 'Shift') {
        keyStates.current['Shift'] = false;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  // Camera movement with keyboard
  useFrame(() => {
    // Only apply keyboard movement when not using pointer lock controls
    // or if pointer lock controls are locked
    if (!((activeController === 'firstPerson' || activeController === 'flight') && !isLocked)) {
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
      
      // Apply movement based on arrow keys
      if (keyStates.current.ArrowUp) {
        moveDirection.add(forward.clone().multiplyScalar(MOVE_SPEED));
      }
      if (keyStates.current.ArrowDown) {
        moveDirection.add(forward.clone().multiplyScalar(-MOVE_SPEED));
      }
      if (keyStates.current.ArrowRight) {
        moveDirection.add(right.clone().multiplyScalar(MOVE_SPEED));
      }
      if (keyStates.current.ArrowLeft) {
        moveDirection.add(right.clone().multiplyScalar(-MOVE_SPEED));
      }
      
      // Apply vertical movement based on space and shift keys
      if (keyStates.current[' ']) {
        moveDirection.y += VERTICAL_SPEED; // Move up with spacebar
      }
      if (keyStates.current['Shift']) {
        moveDirection.y -= VERTICAL_SPEED; // Move down with shift
      }
      
      // Apply the movement to the camera position
      if (moveDirection.length() > 0) {
        camera.position.add(moveDirection);
        
        // If using OrbitControls, update the target position to follow the camera horizontally
        if (activeController === 'orbit' && orbitRef.current) {
          // @ts-ignore - OrbitControls has a target property
          const target = orbitRef.current.target;
          // Only update X and Z for target (not Y) to maintain proper orbital behavior
          target.x += moveDirection.x;
          target.z += moveDirection.z;
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