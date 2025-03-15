import React, { useState, useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls, FlyControls, FirstPersonControls, PointerLockControls } from '@react-three/drei';

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { camera } = useThree();
  const [isLocked, setIsLocked] = useState(false);

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