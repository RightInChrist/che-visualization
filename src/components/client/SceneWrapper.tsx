'use client';

import React, { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/ui/Sidebar';
import ErrorBoundary from './ErrorBoundary';

type ControllerType = 'orbit' | 'firstPerson' | 'flight';

interface WindowWithController extends Window {
  setController?: (type: ControllerType) => void;
}

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center bg-black text-white">
    <div className="text-center">
      <h2 className="text-xl font-semibold mb-2">Loading 3D Visualization</h2>
      <p>Preparing the scene...</p>
      <div className="mt-4 w-32 h-1 mx-auto bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 animate-pulse rounded-full"></div>
      </div>
    </div>
  </div>
);

// Error fallback component
const ErrorFallback = () => (
  <div className="flex h-screen w-full items-center justify-center bg-black text-white">
    <div className="text-center p-6 max-w-md">
      <h2 className="text-xl font-bold mb-4">Unable to Load 3D Scene</h2>
      <p className="mb-4">There was a problem loading the 3D visualization.</p>
      <p className="mb-6 text-gray-400">This could be due to browser compatibility issues or insufficient system resources.</p>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => window.location.reload()}
      >
        Try Again
      </button>
    </div>
  </div>
);

// Dynamically import the 3D scene component with SSR disabled
const Scene3D = dynamic(() => import('@/components/Scene3D'), {
  ssr: false,
  loading: () => <LoadingFallback />
});

export default function SceneWrapper() {
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
    <div className="flex h-screen w-full">
      <div className="h-full">
        <Sidebar setController={handleControllerChange} />
      </div>
      <div className="flex-1 h-full">
        <ErrorBoundary fallback={<ErrorFallback />}>
          <Suspense fallback={<LoadingFallback />}>
            <Scene3D controllerType={controllerType} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
} 