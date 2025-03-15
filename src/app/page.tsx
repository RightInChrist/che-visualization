'use client';

import { useState } from 'react';
import Scene3D from '@/components/Scene3D';
import Sidebar from '@/components/ui/Sidebar';

export default function Home() {
  const [controllerType, setControllerType] = useState<'orbit' | 'firstPerson' | 'flight'>('orbit');
  
  const handleControllerChange = (type: 'orbit' | 'firstPerson' | 'flight') => {
    setControllerType(type);
    if (typeof window !== 'undefined' && (window as any).setController) {
      (window as any).setController(type);
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
