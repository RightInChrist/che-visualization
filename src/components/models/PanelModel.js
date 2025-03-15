import { 
    MeshBuilder, 
    StandardMaterial, 
    Color3, 
    Vector3
} from '@babylonjs/core';
import { BaseModel } from './BaseModel';

/**
 * Creates a tall panel for the Convective Heat Engine
 */
export class PanelModel extends BaseModel {
    constructor(scene, position = new Vector3(0, 0, 0), options = {}) {
        // Default options
        const defaultOptions = {
            height: 1000, // meters
            width: 50,    // meters
            depth: 2,     // meters
            color: new Color3(0.2, 0.6, 0.8),
            name: 'panel'
        };
        
        // Call parent constructor
        super(scene, position, { ...defaultOptions, ...options });
        
        // Create panel
        this.createPanel();
    }
    
    /**
     * Creates the main panel mesh
     */
    createPanel() {
        // Create box for panel - note that Babylon.js creates boxes centered at origin
        // so we need to offset position to make it start from ground
        const panelMesh = MeshBuilder.CreateBox('panel', {
            height: this.options.height,
            width: this.options.width,
            depth: this.options.depth
        }, this.scene);
        
        // Position box so bottom is at y=0
        panelMesh.position.y = this.options.height / 2;
        
        // Create material
        const panelMaterial = new StandardMaterial('panelMaterial', this.scene);
        panelMaterial.diffuseColor = this.options.color;
        panelMaterial.specularColor = new Color3(0.3, 0.3, 0.3);
        
        // Apply material
        panelMesh.material = panelMaterial;
        
        // Enable shadows
        panelMesh.receiveShadows = true;
        panelMesh.castShadow = true;
        
        // Enable collisions
        panelMesh.checkCollisions = true;
        
        // Parent to root node
        panelMesh.parent = this.rootNode;
        
        this.panelMesh = panelMesh;
    }
    
    /**
     * Sets visibility of the model
     * @param {boolean} isVisible - Whether the model should be visible
     */
    setVisible(isVisible) {
        this._isVisible = isVisible;
        
        // Log for debugging
        console.log(`PanelModel setVisible called with ${isVisible}`);
        
        if (this.rootNode) {
            console.log(`Setting PanelModel rootNode enabled to ${isVisible}`);
            this.rootNode.setEnabled(isVisible);
        }
        
        if (this.panelMesh) {
            console.log(`Setting PanelModel panelMesh visibility to ${isVisible}`);
            this.panelMesh.isVisible = isVisible;
            
            // Force mesh to update its visibility
            this.panelMesh.refreshBoundingInfo();
        }
        
        // Log state after change
        if (this.panelMesh) {
            console.log(`PanelModel after change: mesh visible=${this.panelMesh.isVisible}, rootNode enabled=${this.rootNode ? this.rootNode.isEnabled() : 'N/A'}`);
        }
    }
    
    /**
     * Disposes of all resources
     */
    dispose() {
        if (this.panelMesh) this.panelMesh.dispose();
        super.dispose();
    }
} 