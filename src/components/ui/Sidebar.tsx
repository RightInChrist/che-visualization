import React from 'react';
import { useModelStore } from '@/store/modelStore';

interface SidebarProps {
  setController: (type: 'orbit' | 'firstPerson' | 'flight') => void;
}

export function Sidebar({ setController }: SidebarProps) {
  const { models, toggleVisibility } = useModelStore();

  return (
    <div className="bg-gray-800 text-white p-4 w-64 h-full overflow-y-auto flex flex-col">
      <h2 className="text-xl font-bold mb-4">3D Visualizer</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Camera Controls</h3>
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => setController('orbit')}
            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
          >
            Orbit Mode
          </button>
          <button 
            onClick={() => setController('firstPerson')}
            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
          >
            First Person Walking
          </button>
          <button 
            onClick={() => setController('flight')}
            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
          >
            Flight Mode
          </button>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Models</h3>
        <ul className="space-y-2">
          {models.map(model => (
            <li key={model.id} className="flex items-center">
              <input
                type="checkbox"
                id={`model-${model.id}`}
                checked={model.visible}
                onChange={() => toggleVisibility(model.id)}
                className="mr-2"
              />
              <label htmlFor={`model-${model.id}`}>{model.name}</label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar; 