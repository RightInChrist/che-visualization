export interface Model3D {
  id: string;
  name: string;
  visible: boolean;
  type: 'primitive' | 'composite';
  references?: ModelReference[];
}

export interface ModelReference {
  modelId: string;
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
  models: Model3D[];
  getModelById: (id: string) => Model3D | undefined;
  toggleVisibility: (id: string) => void;
  addModel: (model: Model3D) => void;
} 