import { PrimitiveModel, CompositeModel, ModelInstance, ModelReference } from '@/types/models';

// Define Single CUT model and instances
export const getSingleCutModel = (): CompositeModel => {
  return {
    id: 'single-cut',
    name: 'Single Cut',
    type: 'composite',
    references: []
  } as CompositeModel;
};

// Create all the pipe instances for the hexagon
export const getHexPipeInstances = (): ModelInstance[] => {
  return [
    {
      instanceId: 'instance-hex-pipe-1',
      modelId: 'big-pipe',
      name: 'Big Pipe #1',
      visible: true,
      position: [15.5, 0, -26.84],
      rotation: [0, 0, 0],
      scale: [1, 1, 1]
    },
    {
      instanceId: 'instance-hex-pipe-2',
      modelId: 'big-pipe',
      name: 'Big Pipe #2',
      visible: true,
      position: [31, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1]
    },
    {
      instanceId: 'instance-hex-pipe-3',
      modelId: 'big-pipe',
      name: 'Big Pipe #3',
      visible: true,
      position: [15.5, 0, 26.84],
      rotation: [0, 0, 0],
      scale: [1, 1, 1]
    },
    {
      instanceId: 'instance-hex-pipe-4',
      modelId: 'big-pipe',
      name: 'Big Pipe #4',
      visible: true,
      position: [-15.5, 0, 26.84],
      rotation: [0, 0, 0],
      scale: [1, 1, 1]
    },
    {
      instanceId: 'instance-hex-pipe-5',
      modelId: 'big-pipe',
      name: 'Big Pipe #5',
      visible: true,
      position: [-31, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1]
    },
    {
      instanceId: 'instance-hex-pipe-6',
      modelId: 'big-pipe',
      name: 'Big Pipe #6',
      visible: true,
      position: [-15.5, 0, -26.84],
      rotation: [0, 0, 0],
      scale: [1, 1, 1]
    }
  ];
};

// Create all the panel instances for the hexagon
export const getHexPanelInstances = (): ModelInstance[] => {
  return [
    {
      instanceId: 'instance-hex-panel-1',
      modelId: 'big-panel',
      name: 'Big Panel #1',
      visible: true,
      position: [23.25, 0, -13.42],
      rotation: [0, -Math.PI/6, 0],
      scale: [1, 1, 1]
    },
    {
      instanceId: 'instance-hex-panel-2',
      modelId: 'big-panel',
      name: 'Big Panel #2',
      visible: true,
      position: [23.25, 0, 13.42],
      rotation: [0, Math.PI/6, 0],
      scale: [1, 1, 1]
    },
    {
      instanceId: 'instance-hex-panel-3',
      modelId: 'big-panel',
      name: 'Big Panel #3',
      visible: true,
      position: [0, 0, 26.84],
      rotation: [0, Math.PI/2, 0],
      scale: [1, 1, 1]
    },
    {
      instanceId: 'instance-hex-panel-4',
      modelId: 'big-panel',
      name: 'Big Panel #4',
      visible: true,
      position: [-23.25, 0, 13.42],
      rotation: [0, 5*Math.PI/6, 0],
      scale: [1, 1, 1]
    },
    {
      instanceId: 'instance-hex-panel-5',
      modelId: 'big-panel',
      name: 'Big Panel #5',
      visible: true,
      position: [-23.25, 0, -13.42],
      rotation: [0, 7*Math.PI/6, 0],
      scale: [1, 1, 1]
    },
    {
      instanceId: 'instance-hex-panel-6',
      modelId: 'big-panel',
      name: 'Big Panel #6',
      visible: true,
      position: [0, 0, -26.84],
      rotation: [0, 3*Math.PI/2, 0],
      scale: [1, 1, 1]
    }
  ];
};

// Get the main SingleCUT instance
export const getSingleCutInstance = (): ModelInstance => {
  return {
    instanceId: 'instance-single-cut',
    modelId: 'single-cut',
    name: 'Single CUT #1',
    visible: true,
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1]
  };
};

// Generate all SingleCUT-related references
export const generateSingleCutReferences = (
  hexPipeInstances: ModelInstance[],
  hexPanelInstances: ModelInstance[]
): ModelReference[] => {
  return [
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
};

// Initialize the Single CUT model with its instances
export const initializeSingleCutModel = (
  singleCutModel: CompositeModel,
  hexPipeInstances: ModelInstance[],
  hexPanelInstances: ModelInstance[]
): void => {
  const references = generateSingleCutReferences(hexPipeInstances, hexPanelInstances);
  singleCutModel.references = references;
};

// Get all instances related to the Single CUT
export const getAllSingleCutInstances = (): ModelInstance[] => {
  const hexPipes = getHexPipeInstances();
  const hexPanels = getHexPanelInstances();
  const singleCut = getSingleCutInstance();
  
  return [
    ...hexPipes,
    ...hexPanels,
    singleCut
  ];
}; 