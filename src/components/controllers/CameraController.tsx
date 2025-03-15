import React, { useState, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls, FlyControls, FirstPersonControls } from '@react-three/drei';

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { camera } = useThree();

  // Make controller change accessible from outside via window object for UI controls
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const customWindow = window as WindowWithController;
      customWindow.setController = (type: ControllerType) => {
        if (['orbit', 'firstPerson', 'flight'].includes(type)) {
          setActiveController(type);
        }
      };
    }
  }, []);

  return (
    <>
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
      
      {activeController === 'firstPerson' && (
        <FirstPersonControls
          ref={firstPersonRef}
          makeDefault
          lookSpeed={0.1}
          movementSpeed={50}
          lookVertical={true}
        />
      )}
      
      {activeController === 'flight' && (
        <FlyControls
          ref={flyRef}
          makeDefault
          movementSpeed={100}
          rollSpeed={0.5}
          dragToLook={true}
        />
      )}
    </>
  );
}

export default CameraController; 