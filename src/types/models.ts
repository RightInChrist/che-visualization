export interface Model3D {
  id: string;
  name: string;
  type: 'primitive' | 'composite';
}

export interface ModelInstance {
  instanceId: string;
  modelId: string;
  name?: string; // Optional custom name
  visible: boolean;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

export interface ModelReference {
  instanceId: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

export interface PrimitiveModel extends Model3D {
  type: 'primitive';
  parameters: {
    [key: string]: number | string;
  };
}

export interface CompositeModel extends Model3D {
  type: 'composite';
  references: ModelReference[];
}

export interface ModelStore {
  // Models (definitions)
  models: Model3D[];
  getModelById: (id: string) => Model3D | undefined;
  addModel: (model: Model3D) => void;
  
  // Instances (occurrences)
  instances: ModelInstance[];
  ensureInstancesInitialized: () => boolean;
  getInstanceById: (instanceId: string) => ModelInstance | null | undefined;
  getInstancesByModelId: (modelId: string) => ModelInstance[];
  addInstance: (instance: ModelInstance) => void;
  toggleInstanceVisibility: (instanceId: string) => void;
  toggleModelInstancesVisibility: (modelId: string) => void;
  
  // Composite instance creation helper
  createCompositeInstance: (
    modelId: string, 
    name?: string,
    position?: [number, number, number],
    rotation?: [number, number, number],
    scale?: [number, number, number]
  ) => string | null; // Returns instanceId or null if creation failed
  
  // Scene hierarchy
  getSceneHierarchy: () => Record<string, {
    name: string;
    rootInstanceIds: string[];
    childInstanceIds: string[];
  }>;
} 