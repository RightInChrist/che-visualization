import { 
    MeshBuilder, 
    StandardMaterial, 
    Color3, 
    Vector3,
    Mesh
} from '@babylonjs/core';
import { BaseModel } from './BaseModel';

/**
 * Creates a 1000m tall pipe with height markers every 100m
 */
export class PipeModel extends BaseModel {
    constructor(scene, position = new Vector3(0, 0, 0), options = {}) {
        // Default options
        const defaultOptions = {
            height: 1000, // meters
            radius: 5,    // meters
            color: new Color3(0.7, 0.7, 0.7),
            markerInterval: 100, // meters between regular markers
            mainMarkerInterval: 500, // meters between main markers
            name: 'pipe'
        };
        
        // Call parent constructor
        super(scene, position, { ...defaultOptions, ...options });
        
        // Create pipe and markers
        this.createPipe();
        this.createHeightMarkers();
    }
    
    /**
     * Creates the main pipe mesh
     */
    createPipe() {
        // Create cylinder for pipe - note that Babylon.js creates cylinders centered at origin
        // so we need to offset position to make it start from ground
        const pipeMesh = MeshBuilder.CreateCylinder('pipe', {
            height: this.options.height,
            diameter: this.options.radius * 2,
            tessellation: 24
        }, this.scene);
        
        // Position cylinder so bottom is at y=0
        pipeMesh.position.y = this.options.height / 2;
        
        // Create material
        const pipeMaterial = new StandardMaterial('pipeMaterial', this.scene);
        pipeMaterial.diffuseColor = this.options.color;
        pipeMaterial.specularColor = new Color3(0.3, 0.3, 0.3);
        
        // Apply material
        pipeMesh.material = pipeMaterial;
        
        // Enable shadows
        pipeMesh.receiveShadows = true;
        pipeMesh.castShadow = true;
        
        // Enable collisions
        pipeMesh.checkCollisions = true;
        
        // Parent to root node
        pipeMesh.parent = this.rootNode;
        
        this.pipeMesh = pipeMesh;
    }
    
    /**
     * Creates height markers along the pipe
     */
    createHeightMarkers() {
        const markers = [];
        const markerCount = Math.floor(this.options.height / this.options.markerInterval) + 1;
        
        for (let i = 0; i < markerCount; i++) {
            const y = i * this.options.markerInterval;
            
            // Skip marker at y=0 (ground level)
            if (y === 0) continue;
            
            // Determine if this is a main marker (multiples of mainMarkerInterval)
            const isMainMarker = y % this.options.mainMarkerInterval === 0;
            
            // Create ring marker
            const marker = this.createRingMarker(
                this.options.radius + 0.2,
                isMainMarker ? 0.5 : 0.2,
                isMainMarker ? new Color3(1, 0, 0) : new Color3(1, 1, 0)
            );
            
            // Position marker at correct height
            marker.position.y = y;
            
            // Add text for height
            if (isMainMarker) {
                const heightText = this.createHeightText(y, marker);
                heightText.parent = this.rootNode;
            }
            
            // Add marker to parent node
            marker.parent = this.rootNode;
            markers.push(marker);
        }
        
        this.markers = markers;
    }
    
    /**
     * Creates a ring marker for height indication
     * @param {number} radius - Radius of the ring
     * @param {number} thickness - Thickness of the ring
     * @param {Color3} color - Color of the ring
     * @returns {Mesh} - The created ring mesh
     */
    createRingMarker(radius, thickness, color) {
        // Create torus for the ring
        const ring = MeshBuilder.CreateTorus('heightMarker', {
            diameter: radius * 2,
            thickness: thickness,
            tessellation: 32
        }, this.scene);
        
        // Create material
        const ringMaterial = new StandardMaterial('ringMaterial', this.scene);
        ringMaterial.diffuseColor = color;
        ringMaterial.emissiveColor = color.scale(0.5); // Make it glow a bit
        ringMaterial.specularColor = new Color3(1, 1, 1);
        
        // Apply material
        ring.material = ringMaterial;
        
        return ring;
    }
    
    /**
     * Creates a text mesh for height indication
     * @param {number} height - The height to display
     * @param {Mesh} parent - The parent mesh
     * @returns {Mesh} - The created text mesh
     */
    createHeightText(height, parent) {
        // For now, we'll use a simple plane as a placeholder
        // In a real implementation, you might use a DynamicTexture or HTML overlay
        const plane = MeshBuilder.CreatePlane('heightText', {
            width: 10,
            height: 2
        }, this.scene);
        
        // Position text next to parent
        plane.position = new Vector3(this.options.radius + 5, 0, 0);
        
        // Create material
        const textMaterial = new StandardMaterial('textMaterial', this.scene);
        textMaterial.diffuseColor = new Color3(1, 1, 1);
        textMaterial.emissiveColor = new Color3(1, 1, 1);
        textMaterial.backFaceCulling = false;
        
        // Apply material
        plane.material = textMaterial;
        
        // Make text billboard face camera
        plane.billboardMode = Mesh.BILLBOARDMODE_ALL;
        
        // Parent to the marker
        plane.parent = parent;
        
        return plane;
    }
    
    /**
     * Override getName to return "Pipe"
     * @returns {string} The display name for this model
     */
    getName() {
        return "Pipe";
    }
    
    /**
     * Disposes of all resources
     */
    dispose() {
        if (this.pipeMesh) this.pipeMesh.dispose();
        if (this.markers) this.markers.forEach(marker => marker.dispose());
        super.dispose();
    }

    /**
     * Sets visibility of the model
     * @param {boolean} isVisible - Whether the model should be visible
     */
    setVisible(isVisible) {
        this._isVisible = isVisible;
        
        // Log for debugging
        console.log(`PipeModel setVisible called with ${isVisible}`);
        
        if (this.rootNode) {
            console.log(`Setting PipeModel rootNode enabled to ${isVisible}`);
            this.rootNode.setEnabled(isVisible);
        }
        
        if (this.pipeMesh) {
            console.log(`Setting PipeModel pipeMesh visibility to ${isVisible}`);
            this.pipeMesh.isVisible = isVisible;
            
            // Force mesh to update its visibility
            this.pipeMesh.refreshBoundingInfo();
        }
        
        // Update markers visibility
        if (this.markers) {
            this.markers.forEach(marker => {
                marker.isVisible = isVisible;
            });
        }
        
        // Log state after change
        if (this.pipeMesh) {
            console.log(`PipeModel after change: mesh visible=${this.pipeMesh.isVisible}, rootNode enabled=${this.rootNode ? this.rootNode.isEnabled() : 'N/A'}`);
        }
    }
} 