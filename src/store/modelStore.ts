import { create } from 'zustand';
import { Model3D, ModelStore, PrimitiveModel, CompositeModel } from '@/types/models';

// Define initial primitive models
const initialModels: Model3D[] = [
  // Big pipe model
  {
    id: 'big-pipe',
    name: 'Big Pipe',
    visible: true,
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
    visible: true,
    type: 'primitive',
    parameters: {
      height: 1000, // 1000 meters tall
      width: 30,    // 30 meters wide
      thickness: 0.1, // 0.1 meters (1 decimeter) thick
    }
  } as PrimitiveModel,
  
  // Single cut composite model
  {
    id: 'single-cut',
    name: 'Single Cut',
    visible: true,
    type: 'composite',
    references: [
      // 6 pipes
      { modelId: 'big-pipe', position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
      { modelId: 'big-pipe', position: [10, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
      { modelId: 'big-pipe', position: [20, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
      { modelId: 'big-pipe', position: [30, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
      { modelId: 'big-pipe', position: [40, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
      { modelId: 'big-pipe', position: [50, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
      
      // 6 panels
      { modelId: 'big-panel', position: [0, 0, 10], rotation: [0, 0, 0], scale: [1, 1, 1] },
      { modelId: 'big-panel', position: [0, 0, 20], rotation: [0, 0, 0], scale: [1, 1, 1] },
      { modelId: 'big-panel', position: [0, 0, 30], rotation: [0, 0, 0], scale: [1, 1, 1] },
      { modelId: 'big-panel', position: [0, 0, 40], rotation: [0, 0, 0], scale: [1, 1, 1] },
      { modelId: 'big-panel', position: [0, 0, 50], rotation: [0, 0, 0], scale: [1, 1, 1] },
      { modelId: 'big-panel', position: [0, 0, 60], rotation: [0, 0, 0], scale: [1, 1, 1] },
    ]
  } as CompositeModel,
];

// Create the store
export const useModelStore = create<ModelStore>((set, get) => ({
  models: initialModels,
  
  getModelById: (id: string) => {
    return get().models.find(model => model.id === id);
  },
  
  toggleVisibility: (id: string) => {
    set(state => ({
      models: state.models.map(model => 
        model.id === id ? { ...model, visible: !model.visible } : model
      )
    }));
  },
  
  addModel: (model: Model3D) => {
    set(state => ({
      models: [...state.models, model]
    }));
  }
})); 