import { 
    MeshBuilder, 
    StandardMaterial, 
    Color3, 
    Vector3,
    TransformNode,
    Mesh,
    Material
} from '@babylonjs/core';

/**
 * Creates a 1000m tall pipe with height markers every 100m
 */
export class PipeModel {
    constructor(scene, position = new Vector3(0, 0, 0), options = {}) {
        this.scene = scene;
        this.position = position;
        
        // Default options
        this.options = {
            height: 1000, // meters
            radius: 5,    // meters
            color: new Color3(0.7, 0.7, 0.7),
            markerInterval: 100, // meters between regular markers
            mainMarkerInterval: 500, // meters between main markers
            ...options
        };
        
        // Create parent node for all meshes
        this.rootNode = new TransformNode('pipe', this.scene);
        this.rootNode.position = this.position;
        
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
     * Disposes of all resources
     */
    dispose() {
        this.pipeMesh.dispose();
        this.markers.forEach(marker => marker.dispose());
        this.rootNode.dispose();
    }
} 