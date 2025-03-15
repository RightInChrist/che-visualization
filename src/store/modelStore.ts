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

// Define model definitions (blueprints)
const initialModels: Model3D[] = [
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

// Define initial instances
const initialInstances: ModelInstance[] = [];

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
initialInstances.push(groundInstance);

// Add all Single CUT related instances
const singleCutInstances = getAllSingleCutInstances();
initialInstances.push(...singleCutInstances);

// Get references to the individual components for the scene hierarchy
const singleCutInstance = getSingleCutInstance();
const hexPipeInstances = getHexPipeInstances();
const hexPanelInstances = getHexPanelInstances();

// Initialize the Single CUT model with references
const singleCutModel = initialModels.find(model => model.id === 'single-cut') as CompositeModel;
if (singleCutModel) {
  initializeSingleCutModel(singleCutModel, hexPipeInstances, hexPanelInstances);
}

// Define scene structure for the UI organization
const sceneHierarchy = {
  'convective-heat-engine': {
    name: 'Convective Heat Engine #1',
    rootInstanceIds: ['instance-ground', 'instance-single-cut'],
    childInstanceIds: [] // For future use with nested scene components
  }
};

// Create the store
export const useModelStore = create<ModelStore>((set, get) => ({
  // Models (definitions)
  models: initialModels,
  
  getModelById: (id: string) => {
    return get().models.find(model => model.id === id);
  },
  
  addModel: (model: Model3D) => {
    set(state => ({
      models: [...state.models, model]
    }));
  },
  
  // Instances (occurrences)
  instances: initialInstances,
  
  getInstanceById: (instanceId: string) => {
    return get().instances.find(instance => instance.instanceId === instanceId);
  },
  
  getInstancesByModelId: (modelId: string) => {
    return get().instances.filter(instance => instance.modelId === modelId);
  },
  
  addInstance: (instance: ModelInstance) => {
    set(state => ({
      instances: [...state.instances, instance]
    }));
  },
  
  toggleInstanceVisibility: (instanceId: string) => {
    set(state => ({
      instances: state.instances.map(instance => 
        instance.instanceId === instanceId 
          ? { ...instance, visible: !instance.visible } 
          : instance
      )
    }));
  },
  
  createCompositeInstance: (
    modelId: string, 
    name = "New Composite", 
    position = [0, 0, 0], 
    rotation = [0, 0, 0], 
    scale = [1, 1, 1]
  ) => {
    const model = get().getModelById(modelId);
    if (!model || model.type !== 'composite') {
      throw new Error(`Model ${modelId} is not a composite model`);
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
})); 