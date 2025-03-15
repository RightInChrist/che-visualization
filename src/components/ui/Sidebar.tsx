import React, { useState, useEffect, useMemo } from 'react';
import { useModelStore } from '@/store/modelStore';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { ModelInstance } from '@/types/models';

type ControllerType = 'orbit' | 'firstPerson' | 'flight';

interface SidebarProps {
  setController: (type: ControllerType) => void;
}

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

// A reusable collapsible section component
function CollapsibleSection({ title, children, defaultOpen = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="mb-4">
      <div 
        className="flex items-center cursor-pointer hover:bg-gray-700 px-2 py-1 rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <ChevronDownIcon className="h-4 w-4 mr-1" />
        ) : (
          <ChevronRightIcon className="h-4 w-4 mr-1" />
        )}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      
      {isOpen && (
        <div className="mt-2 ml-2">
          {children}
        </div>
      )}
    </div>
  );
}

export function Sidebar({ setController }: SidebarProps) {
  const { 
    models, 
    instances, 
    toggleInstanceVisibility, 
    getInstancesByModelId, 
    getInstanceById 
  } = useModelStore();
  const [activeController, setActiveController] = useState<ControllerType>('orbit');
  const [expandedModels, setExpandedModels] = useState<Record<string, boolean>>({});
  const [expandedInstances, setExpandedInstances] = useState<Record<string, boolean>>({});
  // Add a state to force re-renders when visibility changes
  const [visibilityVersion, setVisibilityVersion] = useState(0);

  // Generate instance counters for each model type
  const instanceCounters = useMemo(() => {
    const counters: Record<string, Record<string, number>> = {};
    
    // Initialize counters for each model
    models.forEach(model => {
      counters[model.id] = {};
    });
    
    // Assign numbers to instances based on their model type
    instances.forEach(instance => {
      if (!counters[instance.modelId]) return;
      
      const modelCounter = counters[instance.modelId];
      const count = Object.keys(modelCounter).length + 1;
      modelCounter[instance.instanceId] = count;
    });
    
    return counters;
  }, [models, instances]);

  // Get display name for an instance
  const getInstanceDisplayName = (instance: ModelInstance, model: any) => {
    // Override with specific naming for certain instances
    if (instance.instanceId === 'instance-ground') {
      return 'Ground Plane #1';
    }
    
    if (instance.instanceId === 'instance-single-cut') {
      return 'Single CUT #1';
    }
    
    // For others, use the counter-based naming
    const counter = instanceCounters[model.id]?.[instance.instanceId];
    if (counter) {
      return `${model.name} #${counter}`;
    }
    
    // Fallback
    return `${model.name} Instance`;
  };

  // Toggle expansion state for model sections
  const toggleModelExpansion = (modelId: string) => {
    setExpandedModels(prev => ({
      ...prev,
      [modelId]: !prev[modelId]
    }));
  };

  // Toggle expansion state for instance sections
  const toggleInstanceExpansion = (instanceId: string) => {
    setExpandedInstances(prev => ({
      ...prev,
      [instanceId]: !prev[instanceId]
    }));
  };

  // Modified toggle function that ensures UI updates
  const handleToggleInstanceVisibility = (instanceId: string) => {
    toggleInstanceVisibility(instanceId);
    // Force a re-render to update all checkbox states
    setVisibilityVersion(prev => prev + 1);
  };

  // Toggle visibility for all instances of a model type
  const toggleModelTypeVisibility = (modelId: string, currentVisibility: boolean) => {
    const modelInstances = getInstancesByModelId(modelId);
    modelInstances.forEach(instance => {
      // Only toggle if current visibility doesn't match desired state
      if (instance.visible === currentVisibility) {
        toggleInstanceVisibility(instance.instanceId);
      }
    });
    // Force a re-render to update all checkbox states
    setVisibilityVersion(prev => prev + 1);
  };

  // Check if all instances of a model have the same visibility
  const getModelVisibilityState = (modelId: string): { allVisible: boolean, allHidden: boolean, mixed: boolean } => {
    const modelInstances = getInstancesByModelId(modelId);
    if (modelInstances.length === 0) return { allVisible: false, allHidden: true, mixed: false };
    
    const visibleCount = modelInstances.filter(i => i.visible).length;
    return {
      allVisible: visibleCount === modelInstances.length,
      allHidden: visibleCount === 0,
      mixed: visibleCount > 0 && visibleCount < modelInstances.length
    };
  };

  // Get composite references
  const getCompositeReferences = (compositeModel: any, instanceId: string): ModelInstance[] => {
    if (!compositeModel.references) return [];
    
    return compositeModel.references.map((ref: any) => {
      const instance = getInstanceById(ref.instanceId);
      if (!instance) return null;
      return instance;
    }).filter(Boolean);
  };

  // Handle toggling visibility for all instances
  const toggleAllVisibility = (setVisible: boolean) => {
    instances.forEach(instance => {
      if (instance.visible !== setVisible) {
        toggleInstanceVisibility(instance.instanceId);
      }
    });
    // Force a re-render to update all checkbox states
    setVisibilityVersion(prev => prev + 1);
  };

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

  // This effect reruns whenever visibilityVersion changes, but doesn't do anything
  // other than forcing the component to re-render
  useEffect(() => {
    // Just using visibilityVersion as a dependency to force re-renders
  }, [visibilityVersion]);

  return (
    <div className="bg-gray-800 text-white p-4 w-64 h-full overflow-y-auto flex flex-col">
      <h2 className="text-xl font-bold mb-4">3D Visualizer</h2>
      
      <CollapsibleSection title="Camera Controls" defaultOpen={true}>
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
      </CollapsibleSection>
      
      {/* Models section - organized by model type */}
      <CollapsibleSection title="Models" defaultOpen={true}>
        {models.map(model => {
          const { allVisible, allHidden, mixed } = getModelVisibilityState(model.id);
          const isExpanded = expandedModels[model.id] || false;
          const modelInstances = getInstancesByModelId(model.id);
          
          return (
            <div key={model.id} className="mb-3">
              <div className="flex items-center">
                <div 
                  className="flex items-center cursor-pointer hover:text-blue-300"
                  onClick={() => toggleModelExpansion(model.id)}
                >
                  {isExpanded ? (
                    <ChevronDownIcon className="h-3 w-3 mr-1" />
                  ) : (
                    <ChevronRightIcon className="h-3 w-3 mr-1" />
                  )}
                  <span className="font-medium text-blue-300">{model.name}</span>
                </div>
                
                <input
                  type="checkbox"
                  id={`model-visibility-${model.id}`}
                  checked={allVisible}
                  ref={el => {
                    if (el) {
                      el.indeterminate = mixed;
                    }
                  }}
                  onChange={() => toggleModelTypeVisibility(model.id, allVisible)}
                  className="ml-2"
                />
              </div>
              
              {isExpanded && (
                <ul className="ml-5 mt-1 space-y-1">
                  {modelInstances.map(instance => (
                    <li key={instance.instanceId} className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        id={`instance-${instance.instanceId}`}
                        checked={instance.visible}
                        onChange={() => handleToggleInstanceVisibility(instance.instanceId)}
                        className="mr-2"
                      />
                      <label htmlFor={`instance-${instance.instanceId}`} className="text-gray-300">
                        {getInstanceDisplayName(instance, model)}
                      </label>
                    </li>
                  ))}
                  
                  {modelInstances.length === 0 && (
                    <li className="text-gray-400 text-sm italic">No instances</li>
                  )}
                </ul>
              )}
            </div>
          );
        })}
      </CollapsibleSection>

      {/* Scenes section - for hierarchical scene organization */}
      <CollapsibleSection title="Scenes" defaultOpen={true}>
        {/* Create a "Convective Heat Engine #1" scene that contains everything */}
        <div className="mb-2">
          <div className="flex items-center">
            <div 
              className="flex items-center cursor-pointer hover:text-blue-300"
              onClick={() => setExpandedInstances(prev => ({...prev, "scene-che": !prev["scene-che"]}))}
            >
              {expandedInstances["scene-che"] ? (
                <ChevronDownIcon className="h-3 w-3 mr-1" />
              ) : (
                <ChevronRightIcon className="h-3 w-3 mr-1" />
              )}
              <span className="font-medium text-blue-300">Convective Heat Engine #1</span>
            </div>
            <input
              type="checkbox"
              id="scene-che-visibility"
              checked={instances.some(i => i.visible)}
              ref={el => {
                if (el) {
                  // Make the checkbox indeterminate if some but not all instances are visible
                  const visibleCount = instances.filter(i => i.visible).length;
                  el.indeterminate = visibleCount > 0 && visibleCount < instances.length;
                }
              }}
              onChange={() => {
                const anyVisible = instances.some(i => i.visible);
                toggleAllVisibility(!anyVisible);
              }}
              className="ml-2"
            />
          </div>
          
          {expandedInstances["scene-che"] && (
            <ul className="ml-6 mt-1 space-y-1">
              {/* Ground Plane entry */}
              {instances
                .filter(instance => instance.modelId === 'green-ground')
                .map(instance => {
                  const model = models.find(m => m.id === instance.modelId);
                  if (!model) return null;
                  
                  return (
                    <li key={instance.instanceId} className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        id={`scene-item-${instance.instanceId}`}
                        checked={instance.visible}
                        onChange={() => handleToggleInstanceVisibility(instance.instanceId)}
                        className="mr-2"
                      />
                      <label 
                        htmlFor={`scene-item-${instance.instanceId}`}
                        className="text-gray-300"
                      >
                        Ground Plane #1
                      </label>
                    </li>
                  );
                })}
                
              {/* Single Cut composite with nested pipes and panels */}
              {instances
                .filter(instance => instance.modelId === 'single-cut')
                .map(instance => {
                  const model = models.find(m => m.id === instance.modelId);
                  if (!model) return null;
                  
                  const isExpanded = expandedInstances[instance.instanceId] || false;
                  const childInstances = getCompositeReferences(model, instance.instanceId);
                  
                  return (
                    <li key={instance.instanceId} className="mb-1">
                      <div className="flex items-center">
                        <div 
                          className="flex items-center cursor-pointer hover:text-blue-300"
                          onClick={() => toggleInstanceExpansion(instance.instanceId)}
                        >
                          {isExpanded ? (
                            <ChevronDownIcon className="h-3 w-3 mr-1" />
                          ) : (
                            <ChevronRightIcon className="h-3 w-3 mr-1" />
                          )}
                          <span>Single CUT #1</span>
                        </div>
                        <input
                          type="checkbox"
                          id={`scene-item-${instance.instanceId}`}
                          checked={instance.visible}
                          onChange={() => handleToggleInstanceVisibility(instance.instanceId)}
                          className="ml-2"
                        />
                      </div>
                      
                      {isExpanded && childInstances.length > 0 && (
                        <ul className="ml-6 mt-1 space-y-1">
                          {childInstances.map((childInstance: ModelInstance) => {
                            const childModel = models.find(m => m.id === childInstance.modelId);
                            if (!childModel) return null;
                            
                            return (
                              <li key={childInstance.instanceId} className="flex items-center text-sm">
                                <input
                                  type="checkbox"
                                  id={`scene-child-${childInstance.instanceId}`}
                                  checked={childInstance.visible}
                                  onChange={() => handleToggleInstanceVisibility(childInstance.instanceId)}
                                  className="mr-2"
                                />
                                <label 
                                  htmlFor={`scene-child-${childInstance.instanceId}`}
                                  className="text-gray-300"
                                >
                                  {getInstanceDisplayName(childInstance, childModel)}
                                </label>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
      </CollapsibleSection>
    </div>
  );
}

export default Sidebar; 