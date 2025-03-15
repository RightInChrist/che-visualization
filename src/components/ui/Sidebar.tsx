import React, { useState, useEffect } from 'react';
import { useModelStore } from '@/store/modelStore';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

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

  // Toggle visibility for all instances of a model type
  const toggleModelTypeVisibility = (modelId: string, currentVisibility: boolean) => {
    const modelInstances = getInstancesByModelId(modelId);
    modelInstances.forEach(instance => {
      // Only toggle if current visibility doesn't match desired state
      if (instance.visible === currentVisibility) {
        toggleInstanceVisibility(instance.instanceId);
      }
    });
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
  const getCompositeReferences = (compositeModel: any, instanceId: string) => {
    if (!compositeModel.references) return [];
    
    return compositeModel.references.map((ref: any) => {
      const instance = getInstanceById(ref.instanceId);
      if (!instance) return null;
      return instance;
    }).filter(Boolean);
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
      <CollapsibleSection title="Models by Type" defaultOpen={true}>
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
                        onChange={() => toggleInstanceVisibility(instance.instanceId)}
                        className="mr-2"
                      />
                      <label htmlFor={`instance-${instance.instanceId}`} className="text-gray-300">
                        {instance.name || `${model.name} Instance`}
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

      {/* Hierarchical instances section */}
      <CollapsibleSection title="Instance Hierarchy" defaultOpen={true}>
        {/* Display top-level instances first */}
        {instances
          .filter(instance => {
            // Show only composite instances or standalone instances
            const model = models.find(m => m.id === instance.modelId);
            return model?.type === 'composite' || 
                   !instances.some(i => {
                     const compositeModel = models.find(m => m.id === i.modelId && m.type === 'composite');
                     if (!compositeModel || !Array.isArray((compositeModel as any).references)) return false;
                     return (compositeModel as any).references.some((ref: any) => ref.instanceId === instance.instanceId);
                   });
          })
          .map(instance => {
            const model = models.find(m => m.id === instance.modelId);
            const isComposite = model?.type === 'composite';
            const isExpanded = expandedInstances[instance.instanceId] || false;
            let childInstances: any[] = [];
            
            if (isComposite) {
              childInstances = getCompositeReferences(model, instance.instanceId);
            }
            
            return (
              <div key={instance.instanceId} className="mb-2">
                <div className="flex items-center">
                  {isComposite ? (
                    <div 
                      className="flex items-center cursor-pointer hover:text-blue-300"
                      onClick={() => toggleInstanceExpansion(instance.instanceId)}
                    >
                      {isExpanded ? (
                        <ChevronDownIcon className="h-3 w-3 mr-1" />
                      ) : (
                        <ChevronRightIcon className="h-3 w-3 mr-1" />
                      )}
                      <span>{instance.name || `${model?.name} Instance`}</span>
                    </div>
                  ) : (
                    <span className="ml-4">{instance.name || `${model?.name} Instance`}</span>
                  )}
                  
                  <input
                    type="checkbox"
                    id={`hierarchy-instance-${instance.instanceId}`}
                    checked={instance.visible}
                    onChange={() => toggleInstanceVisibility(instance.instanceId)}
                    className="ml-2"
                  />
                </div>
                
                {isComposite && isExpanded && childInstances.length > 0 && (
                  <ul className="ml-6 mt-1 space-y-1">
                    {childInstances.map(childInstance => {
                      const childModel = models.find(m => m.id === childInstance.modelId);
                      return (
                        <li key={childInstance.instanceId} className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            id={`hierarchy-child-${childInstance.instanceId}`}
                            checked={childInstance.visible}
                            onChange={() => toggleInstanceVisibility(childInstance.instanceId)}
                            className="mr-2"
                          />
                          <label 
                            htmlFor={`hierarchy-child-${childInstance.instanceId}`}
                            className="text-gray-300"
                          >
                            {childInstance.name || `${childModel?.name} Instance`}
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
      </CollapsibleSection>
    </div>
  );
}

export default Sidebar; 