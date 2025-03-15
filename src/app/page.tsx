'use client';

import { useState } from 'react';
import Scene3D from '@/components/Scene3D';
import Sidebar from '@/components/ui/Sidebar';

type ControllerType = 'orbit' | 'firstPerson' | 'flight';

interface WindowWithController extends Window {
  setController?: (type: ControllerType) => void;
}

export default function Home() {
  const [controllerType, setControllerType] = useState<ControllerType>('orbit');
  
  const handleControllerChange = (type: ControllerType) => {
    setControllerType(type);
    if (typeof window !== 'undefined') {
      const customWindow = window as WindowWithController;
      if (customWindow.setController) {
        customWindow.setController(type);
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="flex h-screen w-full">
        <div className="h-full">
          <Sidebar setController={handleControllerChange} />
        </div>
        <div className="flex-1 h-full">
          <Scene3D controllerType={controllerType} />
        </div>
      </div>
    </main>
  );
}
