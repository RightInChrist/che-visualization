import { create } from 'zustand';
import { Model3D, ModelStore, PrimitiveModel, CompositeModel } from '@/types/models';

// Define initial primitive models
const initialModels: Model3D[] = [
  // Green ground model
  {
    id: 'green-ground',
    name: 'Green Ground',
    visible: true,
    type: 'primitive',
    parameters: {
      size: 2000, // 2000x2000 meter ground
    }
  } as PrimitiveModel,
  
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
      width: 31,    // 31 meters wide (adjusted for hexagon)
      thickness: 0.1, // 0.1 meters (1 decimeter) thick
    }
  } as PrimitiveModel,
  
  // Single cut composite model (hexagon arrangement)
  {
    id: 'single-cut',
    name: 'Single Cut',
    visible: true,
    type: 'composite',
    references: [
      // 6 pipes at the vertices of a hexagon
      { 
        modelId: 'big-pipe', 
        position: [15.5, 0, -26.84], // 15.5 = half-width of panel, 26.84 = 31*sin(60°)
        rotation: [0, 0, 0], 
        scale: [1, 1, 1] 
      },
      { 
        modelId: 'big-pipe', 
        position: [31, 0, 0], 
        rotation: [0, 0, 0], 
        scale: [1, 1, 1] 
      },
      { 
        modelId: 'big-pipe', 
        position: [15.5, 0, 26.84], 
        rotation: [0, 0, 0], 
        scale: [1, 1, 1] 
      },
      { 
        modelId: 'big-pipe', 
        position: [-15.5, 0, 26.84], 
        rotation: [0, 0, 0], 
        scale: [1, 1, 1] 
      },
      { 
        modelId: 'big-pipe', 
        position: [-31, 0, 0], 
        rotation: [0, 0, 0], 
        scale: [1, 1, 1] 
      },
      { 
        modelId: 'big-pipe', 
        position: [-15.5, 0, -26.84], 
        rotation: [0, 0, 0], 
        scale: [1, 1, 1] 
      },
      
      // 6 panels connecting the pipes
      { 
        modelId: 'big-panel', 
        position: [23.25, 0, -13.42], // Positioned between pipes
        rotation: [0, -Math.PI/6, 0], // 30 degrees 
        scale: [1, 1, 1] 
      },
      { 
        modelId: 'big-panel', 
        position: [23.25, 0, 13.42], 
        rotation: [0, Math.PI/6, 0], // 30 degrees
        scale: [1, 1, 1] 
      },
      { 
        modelId: 'big-panel', 
        position: [0, 0, 26.84], 
        rotation: [0, Math.PI/2, 0], // 90 degrees
        scale: [1, 1, 1] 
      },
      { 
        modelId: 'big-panel', 
        position: [-23.25, 0, 13.42], 
        rotation: [0, 5*Math.PI/6, 0], // 150 degrees
        scale: [1, 1, 1] 
      },
      { 
        modelId: 'big-panel', 
        position: [-23.25, 0, -13.42], 
        rotation: [0, 7*Math.PI/6, 0], // 210 degrees
        scale: [1, 1, 1] 
      },
      { 
        modelId: 'big-panel', 
        position: [0, 0, -26.84], 
        rotation: [0, 3*Math.PI/2, 0], // 270 degrees
        scale: [1, 1, 1] 
      },
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