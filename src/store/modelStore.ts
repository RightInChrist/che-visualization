import { create } from 'zustand';
import { Model3D, ModelStore, PrimitiveModel, CompositeModel, ModelInstance, ModelReference } from '@/types/models';
import { v4 as uuidv4 } from 'uuid';
import { 
  getSingleCutModel,
  getHexPipeInstances,
  getHexPanelInstances,
  getSingleCutInstance,
  initializeSingleCutModel,
  getAllSingleCutInstances
} from '@/components/models/SingleCutModel';

// Create store with initialization handling SSR
// We need to ensure modelStore is only created once on the client side
// and properly initialized with all instances 

// Define model definitions (blueprints)
const createInitialModels = () => {
  const models: Model3D[] = [
    // Green ground model
    {
      id: 'green-ground',
      name: 'Green Ground',
      type: 'primitive',
      parameters: {
        size: 2000, // 2000x2000 meter ground
      }
    } as PrimitiveModel,
    
    // Big pipe model
    {
      id: 'big-pipe',
      name: 'Big Pipe',
      type: 'primitive',
      parameters: {
        height: 1000, // 1000 meters tall
        radius: 2,    // 2 meters radius
        thickness: 0.1, // 0.1 meters (1 decimeter) wall thickness
      }
    } as PrimitiveModel,
    
    // Big panel model
    {
      id: 'big-panel',
      name: 'Big Panel',
      type: 'primitive',
      parameters: {
        height: 1000, // 1000 meters tall
        width: 31,    // 31 meters wide (adjusted for hexagon)
        thickness: 0.1, // 0.1 meters (1 decimeter) thick
      }
    } as PrimitiveModel,
    
    // Add the Single CUT model
    getSingleCutModel()
  ];
  
  return models;
};

// Create instances only on the client side
const createInitialInstances = (models: Model3D[]) => {
  const instances: ModelInstance[] = [];
  
  // Ground instance
  const groundInstance: ModelInstance = {
    instanceId: 'instance-ground',
    modelId: 'green-ground',
    name: 'Ground Plane #1',
    visible: true,
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1]
  };
  
  // Add ground to instances
  instances.push(groundInstance);
  
  // Add all Single CUT related instances
  const singleCutInstances = getAllSingleCutInstances();
  instances.push(...singleCutInstances);
  
  // Get references to the individual components
  const singleCutInstance = getSingleCutInstance();
  const hexPipeInstances = getHexPipeInstances();
  const hexPanelInstances = getHexPanelInstances();
  
  // Initialize the Single CUT model with references
  const singleCutModel = models.find(model => model.id === 'single-cut') as CompositeModel;
  if (singleCutModel) {
    initializeSingleCutModel(singleCutModel, hexPipeInstances, hexPanelInstances);
  }
  
  return instances;
};

// Define scene structure for the UI organization
const sceneHierarchy = {
  'convective-heat-engine': {
    name: 'Convective Heat Engine #1',
    rootInstanceIds: ['instance-ground', 'instance-single-cut'],
    childInstanceIds: [] // For future use with nested scene components
  }
};

// Helper function to safely check if we're in a browser environment
const isBrowser = () => typeof window !== 'undefined';

// Create the store with lazy initialization to avoid SSR issues
export const useModelStore = create<ModelStore>((set, get) => {
  // Initialize models upfront (these are just definitions, safe for SSR)
  const models = createInitialModels();
  
  // Initialize instances lazily (will be created on first access)
  let instances: ModelInstance[] | null = null;
  
  // Function to safely initialize instances if needed
  const getInstances = () => {
    if (instances === null && isBrowser()) {
      instances = createInitialInstances(models);
    }
    // Fallback empty array if we're in SSR
    return instances || [];
  };
  
  return {
    // Models (definitions)
    models,
    
    getModelById: (id: string) => {
      return get().models.find(model => model.id === id);
    },
    
    addModel: (model: Model3D) => {
      set(state => ({
        models: [...state.models, model]
      }));
    },
    
    // Instances (occurrences) - lazily initialized
    get instances() {
      return getInstances();
    },
    
    // Safe method to ensure instances exist before operations
    ensureInstancesInitialized: () => {
      if (!isBrowser()) return false;
      if (instances === null) {
        instances = createInitialInstances(models);
      }
      return true;
    },
    
    getInstanceById: (instanceId: string) => {
      if (!get().ensureInstancesInitialized()) return null;
      return instances!.find(instance => instance.instanceId === instanceId);
    },
    
    getInstancesByModelId: (modelId: string) => {
      if (!get().ensureInstancesInitialized()) return [];
      return instances!.filter(instance => instance.modelId === modelId);
    },
    
    addInstance: (instance: ModelInstance) => {
      if (!get().ensureInstancesInitialized()) return;
      instances = [...instances!, instance];
      set({ instances: [...instances] });
    },
    
    toggleInstanceVisibility: (instanceId: string) => {
      if (!get().ensureInstancesInitialized()) return;
      instances = instances!.map(instance => 
        instance.instanceId === instanceId 
          ? { ...instance, visible: !instance.visible } 
          : instance
      );
      set({ instances: [...instances] });
    },
    
    // Toggle visibility for all instances of a specific model
    toggleModelInstancesVisibility: (modelId: string) => {
      if (!get().ensureInstancesInitialized()) return;
      
      // First determine if most instances are visible or hidden
      const modelInstances = instances!.filter(instance => instance.modelId === modelId);
      const visibleCount = modelInstances.filter(instance => instance.visible).length;
      const shouldMakeVisible = visibleCount <= modelInstances.length / 2;
      
      // Toggle all instances to the target visibility state
      instances = instances!.map(instance => 
        instance.modelId === modelId 
          ? { ...instance, visible: shouldMakeVisible } 
          : instance
      );
      
      set({ instances: [...instances] });
    },
    
    createCompositeInstance: (
      modelId: string, 
      name = "New Composite", 
      position = [0, 0, 0], 
      rotation = [0, 0, 0], 
      scale = [1, 1, 1]
    ) => {
      if (!get().ensureInstancesInitialized()) return null;
      
      const model = get().getModelById(modelId);
      if (!model || model.type !== 'composite') {
        console.error(`Model ${modelId} is not a composite model`);
        return null;
      }
      
      const compositeModel = model as CompositeModel;
      const instanceId = `instance-${uuidv4()}`;
      
      // Create the instance
      const instance: ModelInstance = {
        instanceId,
        modelId,
        name,
        visible: true,
        position,
        rotation,
        scale
      };
      
      get().addInstance(instance);
      return instanceId;
    },
    
    // Scene-related helpers for UI organization
    getSceneHierarchy: () => {
      // This is a simple placeholder. In the future, this would be part of the store state
      return sceneHierarchy;
    }
  };
});

// Utility function for component initialization check
export const isStoreInitialized = () => {
  return isBrowser() && useModelStore.getState().ensureInstancesInitialized();
}; 