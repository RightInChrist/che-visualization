import { create } from 'zustand';
import { Model3D, ModelStore, PrimitiveModel, CompositeModel, ModelInstance, ModelReference } from '@/types/models';
import { v4 as uuidv4 } from 'uuid';

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
  
  // Single cut composite model (hexagon arrangement)
  {
    id: 'single-cut',
    name: 'Single Cut',
    type: 'composite',
    references: [
      // References will be filled when creating instances
    ]
  } as CompositeModel,
];

// Define initial instances
const initialInstances: ModelInstance[] = [];

// Ground instance
const groundInstance: ModelInstance = {
  instanceId: 'instance-ground',
  modelId: 'green-ground',
  name: 'Ground Plane',
  visible: true,
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  scale: [1, 1, 1]
};

// Add ground to instances
initialInstances.push(groundInstance);

// Pre-create pipe and panel instances for the hexagon
const hexPipeInstances: ModelInstance[] = [
  {
    instanceId: 'instance-hex-pipe-1',
    modelId: 'big-pipe',
    visible: true,
    position: [15.5, 0, -26.84],
    rotation: [0, 0, 0],
    scale: [1, 1, 1]
  },
  {
    instanceId: 'instance-hex-pipe-2',
    modelId: 'big-pipe',
    visible: true,
    position: [31, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1]
  },
  {
    instanceId: 'instance-hex-pipe-3',
    modelId: 'big-pipe',
    visible: true,
    position: [15.5, 0, 26.84],
    rotation: [0, 0, 0],
    scale: [1, 1, 1]
  },
  {
    instanceId: 'instance-hex-pipe-4',
    modelId: 'big-pipe',
    visible: true,
    position: [-15.5, 0, 26.84],
    rotation: [0, 0, 0],
    scale: [1, 1, 1]
  },
  {
    instanceId: 'instance-hex-pipe-5',
    modelId: 'big-pipe',
    visible: true,
    position: [-31, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1]
  },
  {
    instanceId: 'instance-hex-pipe-6',
    modelId: 'big-pipe',
    visible: true,
    position: [-15.5, 0, -26.84],
    rotation: [0, 0, 0],
    scale: [1, 1, 1]
  }
];

const hexPanelInstances: ModelInstance[] = [
  {
    instanceId: 'instance-hex-panel-1',
    modelId: 'big-panel',
    visible: true,
    position: [23.25, 0, -13.42],
    rotation: [0, -Math.PI/6, 0],
    scale: [1, 1, 1]
  },
  {
    instanceId: 'instance-hex-panel-2',
    modelId: 'big-panel',
    visible: true,
    position: [23.25, 0, 13.42],
    rotation: [0, Math.PI/6, 0],
    scale: [1, 1, 1]
  },
  {
    instanceId: 'instance-hex-panel-3',
    modelId: 'big-panel',
    visible: true,
    position: [0, 0, 26.84],
    rotation: [0, Math.PI/2, 0],
    scale: [1, 1, 1]
  },
  {
    instanceId: 'instance-hex-panel-4',
    modelId: 'big-panel',
    visible: true,
    position: [-23.25, 0, 13.42],
    rotation: [0, 5*Math.PI/6, 0],
    scale: [1, 1, 1]
  },
  {
    instanceId: 'instance-hex-panel-5',
    modelId: 'big-panel',
    visible: true,
    position: [-23.25, 0, -13.42],
    rotation: [0, 7*Math.PI/6, 0],
    scale: [1, 1, 1]
  },
  {
    instanceId: 'instance-hex-panel-6',
    modelId: 'big-panel',
    visible: true,
    position: [0, 0, -26.84],
    rotation: [0, 3*Math.PI/2, 0],
    scale: [1, 1, 1]
  }
];

// Add hex components to initial instances
initialInstances.push(...hexPipeInstances, ...hexPanelInstances);

// Single Cut instance with references to the pipe and panel instances
const singleCutInstance: ModelInstance = {
  instanceId: 'instance-single-cut',
  modelId: 'single-cut',
  name: 'Single CUT',
  visible: true,
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  scale: [1, 1, 1]
};

// Add to initial instances
initialInstances.push(singleCutInstance);

// References for the Single Cut model
const singleCutReferences: ModelReference[] = [
  ...hexPipeInstances.map(instance => ({
    instanceId: instance.instanceId,
    position: instance.position,
    rotation: instance.rotation,
    scale: instance.scale
  })),
  ...hexPanelInstances.map(instance => ({
    instanceId: instance.instanceId,
    position: instance.position,
    rotation: instance.rotation,
    scale: instance.scale
  }))
];

// Update the Single Cut model with the references
const singleCutModel = initialModels.find(model => model.id === 'single-cut') as CompositeModel;
if (singleCutModel) {
  singleCutModel.references = singleCutReferences;
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