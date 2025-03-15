import { 
    MeshBuilder, 
    StandardMaterial, 
    Color3, 
    Texture, 
    Vector3
} from '@babylonjs/core';

/**
 * Creates a ground plane for the scene
 */
export class GroundModel {
    constructor(scene, size = 5000) {
        this.scene = scene;
        this.size = size;
        this.mesh = null;
        
        this.createGround();
    }
    
    /**
     * Creates the ground mesh with grid texture
     */
    createGround() {
        // Create ground mesh
        this.mesh = MeshBuilder.CreateGround('ground', {
            width: this.size,
            height: this.size,
            subdivisions: 32
        }, this.scene);
        
        // Position at y=0 (important for height measurements)
        this.mesh.position = new Vector3(0, 0, 0);
        
        // Create grid material
        const groundMaterial = new StandardMaterial('groundMaterial', this.scene);
        groundMaterial.diffuseColor = new Color3(0.2, 0.5, 0.2);
        groundMaterial.specularColor = new Color3(0.1, 0.1, 0.1);
        
        // Create grid texture
        const gridTexture = new Texture('https://assets.babylonjs.com/textures/floor_grid.png', this.scene);
        gridTexture.uScale = this.size / 100;
        gridTexture.vScale = this.size / 100;
        groundMaterial.diffuseTexture = gridTexture;
        
        // Apply material to mesh
        this.mesh.material = groundMaterial;
        
        // Enable receiving shadows
        this.mesh.receiveShadows = true;
        
        // Add collisions
        this.mesh.checkCollisions = true;
    }
} 