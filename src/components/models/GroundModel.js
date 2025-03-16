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
            subdivisions: 64 // Increased subdivisions for better shadow detail
        }, this.scene);
        
        // Position at y=0 (important for height measurements)
        this.mesh.position = new Vector3(0, 0, 0);
        
        // Parent to root node
        this.mesh.parent = this.rootNode;
        
        // Create enhanced ground material
        const groundMaterial = new StandardMaterial('groundMaterial', this.scene);
        groundMaterial.diffuseColor = new Color3(0.25, 0.55, 0.25); // Slightly greener base color
        groundMaterial.specularColor = new Color3(0.05, 0.05, 0.05); // Minimal specular for ground
        groundMaterial.specularPower = 128; // Sharper but subtle highlights
        groundMaterial.ambientColor = new Color3(0.2, 0.3, 0.2); // Green-tinted ambient
        
        // Create a procedural grid texture with improved quality
        const textureSize = 2048; // Increased texture resolution
        const gridTexture = new DynamicTexture('gridTexture', textureSize, this.scene, true);
        const textureContext = gridTexture.getContext();
        
        // Create a subtle gradient background
        const gradient = textureContext.createLinearGradient(0, 0, textureSize, textureSize);
        gradient.addColorStop(0, "#3a7a3a"); // Darker green at edges
        gradient.addColorStop(0.5, "#4a8a4a"); // Lighter green in center
        gradient.addColorStop(1, "#3a7a3a"); // Darker green at edges
        textureContext.fillStyle = gradient;
        textureContext.fillRect(0, 0, textureSize, textureSize);
        
        // Draw grid lines with better visibility
        textureContext.lineWidth = 2;
        textureContext.strokeStyle = "#5a9a5a"; // Lighter green for regular grid
        
        // Draw major grid lines
        textureContext.lineWidth = 4;
        const majorGridSize = textureSize / 10;
        for (let i = 0; i <= 10; i++) {
            const pos = i * majorGridSize;
            
            // Use a different color for the center lines
            if (i === 5) {
                textureContext.strokeStyle = "#7ab07a"; // Highlight center lines
                textureContext.lineWidth = 6;
            } else {
                textureContext.strokeStyle = "#5a9a5a";
                textureContext.lineWidth = 4;
            }
            
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
        
        // Draw minor grid lines
        textureContext.lineWidth = 1;
        textureContext.strokeStyle = "#4a8a4a"; // Subtle minor grid lines
        const minorGridSize = majorGridSize / 10;
        for (let i = 0; i <= 100; i++) {
            if (i % 10 === 0) continue; // Skip major lines
            
            const pos = i * minorGridSize;
            
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
        
        // Set texture parameters
        gridTexture.uScale = this.size / 100;
        gridTexture.vScale = this.size / 100;
        groundMaterial.diffuseTexture = gridTexture;
        
        // Add bump map for subtle terrain effect
        const bumpTexture = new DynamicTexture('bumpTexture', 512, this.scene, true);
        const bumpContext = bumpTexture.getContext();
        
        // Create a random noise pattern
        for (let x = 0; x < 512; x++) {
            for (let y = 0; y < 512; y++) {
                const value = 220 + Math.random() * 20; // Subtle noise
                bumpContext.fillStyle = `rgb(${value},${value},${value})`;
                bumpContext.fillRect(x, y, 1, 1);
            }
        }
        
        bumpTexture.update();
        groundMaterial.bumpTexture = bumpTexture;
        groundMaterial.bumpTexture.level = 0.1; // Subtle bump effect
        
        // Apply material to mesh
        this.mesh.material = groundMaterial;
        
        // Enable receiving shadows with better settings
        this.mesh.receiveShadows = true;
        
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