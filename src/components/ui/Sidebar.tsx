import React, { useState, useEffect } from 'react';
import { useModelStore } from '@/store/modelStore';

type ControllerType = 'orbit' | 'firstPerson' | 'flight';

interface SidebarProps {
  setController: (type: ControllerType) => void;
}

export function Sidebar({ setController }: SidebarProps) {
  const { models, instances, toggleInstanceVisibility, getInstancesByModelId } = useModelStore();
  const [activeController, setActiveController] = useState<ControllerType>('orbit');

  // Listen for controller changes from other components
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '1') setActiveController('orbit');
      if (e.key === '2') setActiveController('firstPerson');
      if (e.key === '3') setActiveController('flight');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleControllerChange = (type: ControllerType) => {
    setActiveController(type);
    setController(type);
  };

  const getButtonClass = (type: ControllerType) => {
    return type === activeController
      ? "bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded font-semibold"
      : "bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded";
  };

  // Group instances by model type
  const modelInstances = models.map(model => {
    const modelSpecificInstances = getInstancesByModelId(model.id);
    return {
      model,
      instances: modelSpecificInstances
    };
  });

  return (
    <div className="bg-gray-800 text-white p-4 w-64 h-full overflow-y-auto flex flex-col">
      <h2 className="text-xl font-bold mb-4">3D Visualizer</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Camera Controls</h3>
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => handleControllerChange('orbit')}
            className={getButtonClass('orbit')}
          >
            Orbit Mode
          </button>
          <button 
            onClick={() => handleControllerChange('firstPerson')}
            className={getButtonClass('firstPerson')}
          >
            First Person Walking
          </button>
          <button 
            onClick={() => handleControllerChange('flight')}
            className={getButtonClass('flight')}
          >
            Flight Mode
          </button>
        </div>
        <div className="mt-2 text-sm text-gray-300">
          <p>Click the scene to interact</p>
          <p>Press ESC to exit interaction mode</p>
          <p>Keyboard shortcuts: 1, 2, 3 to change modes</p>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Models</h3>
        
        {modelInstances.map(({ model, instances }) => (
          <div key={model.id} className="mb-4">
            <h4 className="font-medium text-blue-300">{model.name} Model</h4>
            
            {/* List instances of this model */}
            <ul className="space-y-1 mt-1 ml-2">
              {instances.map(instance => (
                <li key={instance.instanceId} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`instance-${instance.instanceId}`}
                    checked={instance.visible}
                    onChange={() => toggleInstanceVisibility(instance.instanceId)}
                    className="mr-2"
                  />
                  <label htmlFor={`instance-${instance.instanceId}`}>
                    {instance.name || `${model.name} Instance`}
                  </label>
                </li>
              ))}
              
              {instances.length === 0 && (
                <li className="text-gray-400 text-sm italic">No instances</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar; 