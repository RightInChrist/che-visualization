import { 
    MeshBuilder, 
    StandardMaterial, 
    Color3, 
    Texture, 
    Vector3,
    DynamicTexture
} from '@babylonjs/core';
import { BaseModel } from './BaseModel';

/**
 * Creates a ground plane for the scene
 */
export class GroundModel extends BaseModel {
    constructor(scene, size = 5000, position = new Vector3(0, 0, 0), options = {}) {
        // Call parent constructor
        super(scene, position, { ...options, name: 'ground' });
        
        this.size = size;
        this.mesh = null;
        
        this.createGround();
    }
    
    /**
     * Creates the ground mesh with grid texture
     */
    createGround() {
        this.debugLog('Creating ground mesh');
        
        // Create ground mesh
        this.mesh = MeshBuilder.CreateGround('ground', {
            width: this.size,
            height: this.size,
            subdivisions: 32
        }, this.scene);
        
        // Position at y=0 (important for height measurements)
        this.mesh.position = new Vector3(0, 0, 0);
        
        // Parent to root node
        this.mesh.parent = this.rootNode;
        
        // Create a simple ground material with no reflections
        const groundMaterial = new StandardMaterial('groundMaterial', this.scene);
        groundMaterial.diffuseColor = new Color3(0.2, 0.5, 0.2);
        groundMaterial.specularColor = new Color3(0, 0, 0); // No specular reflection at all
        
        // Create a simple grid texture
        const textureSize = 1024;
        const gridTexture = new DynamicTexture('gridTexture', textureSize, this.scene, true);
        const textureContext = gridTexture.getContext();
        
        // Set background color
        textureContext.fillStyle = "#366936";
        textureContext.fillRect(0, 0, textureSize, textureSize);
        
        // Draw grid lines
        textureContext.lineWidth = 2;
        textureContext.strokeStyle = "#488A48";
        
        // Draw only major grid lines, skip minor ones
        textureContext.lineWidth = 4;
        const majorGridSize = textureSize / 10;
        for (let i = 0; i <= 10; i++) {
            const pos = i * majorGridSize;
            
            // Horizontal lines
            textureContext.beginPath();
            textureContext.moveTo(0, pos);
            textureContext.lineTo(textureSize, pos);
            textureContext.stroke();
            
            // Vertical lines
            textureContext.beginPath();
            textureContext.moveTo(pos, 0);
            textureContext.lineTo(pos, textureSize);
            textureContext.stroke();
        }
        
        // Update the texture
        gridTexture.update();
        
        // Set texture parameters with lower tiling for better performance
        gridTexture.uScale = this.size / 100;
        gridTexture.vScale = this.size / 100;
        groundMaterial.diffuseTexture = gridTexture;
        
        // Set material with no reflection
        groundMaterial.useSpecularOverAlpha = false;
        
        // Apply material to mesh
        this.mesh.material = groundMaterial;
        
        // Add collisions
        this.mesh.checkCollisions = true;
        
        this.debugLog('Ground mesh created successfully');
    }
    
    /**
     * Override getName to return "Ground"
     * @returns {string} The display name for this model
     */
    getName() {
        return "Ground";
    }
    
    /**
     * Override base setVisible method to handle mesh visibility
     * @param {boolean} isVisible - Whether the ground should be visible
     */
    setVisible(isVisible) {
        super.setVisible(isVisible);
        
        if (this.mesh) {
            this.mesh.isVisible = isVisible;
        }
    }
    
    /**
     * Override base dispose method to also dispose the mesh
     */
    dispose() {
        if (this.mesh) {
            this.mesh.dispose();
            this.mesh = null;
        }
        
        super.dispose();
    }
} 