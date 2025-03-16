import { 
    MeshBuilder, 
    StandardMaterial, 
    Color3, 
    Vector3,
    Axis,
    Space
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
        
        // Initialize rotation tracking
        this.initialRotation = null;
        this.panelIndex = -1;
        // rotationState will be set by SingleCutModel
        
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
            depth: this.options.depth,
            faceUV: this._createUVs() // Create proper UV mapping
        }, this.scene);
        
        // Position box so bottom is at y=0
        panelMesh.position.y = this.options.height / 2;
        
        // Create enhanced material
        const panelMaterial = new StandardMaterial('panelMaterial', this.scene);
        panelMaterial.diffuseColor = this.options.color;
        panelMaterial.ambientColor = this.options.color.scale(0.6); // Add ambient color for better lighting
        panelMaterial.specularColor = new Color3(0.2, 0.2, 0.2); // Reduced specular for less shininess
        panelMaterial.specularPower = 32; // More focused specular highlights
        
        // Add metallic-like reflections
        panelMaterial.useReflectionFresnelFromSpecular = true;
        panelMaterial.reflectionFresnelParameters = {
            leftColor: this.options.color.scale(0.9),
            rightColor: new Color3(0.8, 0.8, 0.8),
            bias: 0.2,
            power: 1.5
        };
        
        // Add micro-surface texture for subtle variation
        panelMaterial.microSurface = 0.92; // Slight roughness
        
        // Make edges more visible with emissive color
        panelMaterial.emissiveColor = this.options.color.scale(0.1);
        
        // Apply material
        panelMesh.material = panelMaterial;
        
        // Enhance shadows with better settings
        panelMesh.receiveShadows = true;
        panelMesh.castShadow = true;
        
        // Enable collisions
        panelMesh.checkCollisions = true;
        
        // Parent to root node
        panelMesh.parent = this.rootNode;
        
        this.panelMesh = panelMesh;
    }
    
    /**
     * Creates proper UV mapping for the panel faces
     * @returns {Array} - Face UVs array for box creation
     * @private
     */
    _createUVs() {
        // Create a simple UV mapping that stretches the texture across each face
        const faceUV = new Array(6);
        
        // Set UV for each face (0-5) - the mapping depends on how you want each face to look
        // For panels, we want the front and back to be the primary faces
        for (let i = 0; i < 6; i++) {
            faceUV[i] = new BABYLON.Vector4(0, 0, 1, 1);
        }
        
        return faceUV;
    }
    
    /**
     * Store the initial rotation state of the panel
     * This is needed for proper delta rotations
     */
    storeInitialRotation() {
        if (!this.initialRotation && this.rootNode) {
            // Store base rotation without any added delta
            // This should only include the pipe-to-pipe angle rotation
            this.initialRotation = this.rootNode.rotation.clone();
            
            console.log(`Stored initial rotation for panel ${this.panelIndex+1}: (${this.radToDeg(this.initialRotation.x)}°, ${this.radToDeg(this.initialRotation.y)}°, ${this.radToDeg(this.initialRotation.z)}°)`);
            
            // For SingleCutModel panels, log the default rotation
            if (this.rotationState && this.panelIndex >= 0) {
                const defaultAngle = this.rotationState.defaultAngles[this.panelIndex];
                console.log(`Panel ${this.panelIndex+1} default angle from shared state: ${defaultAngle?.toFixed(1)}°`);
            }
        }
    }
    
    /**
     * Apply a rotation delta to the panel
     * @param {number} deltaRotation - Delta angle in degrees
     * @param {boolean} [renderScene=true] - Whether to render the scene after applying rotation
     */
    applyRotationDelta(deltaRotation, renderScene = true) {
        if (!this.rootNode) return;
        
        // Store initial rotation if not already stored
        this.storeInitialRotation();
        
        // Update current delta in the shared state if available
        if (this.rotationState && this.panelIndex >= 0) {
            this.rotationState.currentDelta = deltaRotation;
            
            // Also update the current angle in the shared state
            if (this.rotationState.defaultAngles && this.rotationState.defaultAngles[this.panelIndex] !== undefined) {
                this.rotationState.currentAngles[this.panelIndex] = 
                    this.rotationState.defaultAngles[this.panelIndex] + deltaRotation;
                    
                console.log(`Panel ${this.panelIndex+1} current angle in shared state updated to: ${this.rotationState.currentAngles[this.panelIndex].toFixed(1)}°`);
            }
        }
        
        // Reset to initial rotation first
        if (this.initialRotation) {
            this.rootNode.rotation = this.initialRotation.clone();
            
            // Log the initial rotation value for debugging
            console.log(`Panel ${this.panelIndex+1} initial rotation: (${this.radToDeg(this.initialRotation.y)}°)`);
        } else {
            console.warn(`Panel ${this.panelIndex+1} missing initial rotation, creating one`);
            // If no initial rotation stored, create one now
            this.initialRotation = new BABYLON.Vector3(0, 0, 0);
            this.rootNode.rotation = this.initialRotation.clone();
        }
        
        // Apply new delta
        const deltaRadians = (deltaRotation * Math.PI) / 180;
        
        // Apply rotation directly to the rotation property rather than using rotate()
        // This seems to be more reliable for panel rotations
        let targetAngle = deltaRadians;
        
        // If we have a default angle from the shared state, incorporate it
        if (this.rotationState && this.rotationState.defaultAngles && this.panelIndex >= 0) {
            const defaultAngleDegrees = this.rotationState.defaultAngles[this.panelIndex] || 0;
            const defaultAngleRadians = (defaultAngleDegrees * Math.PI) / 180;
            targetAngle = defaultAngleRadians + deltaRadians;
            
            console.log(`Panel ${this.panelIndex+1} applying total rotation of ${this.radToDeg(targetAngle)}° (default ${defaultAngleDegrees}° + delta ${deltaRotation}°)`);
        }
        
        // Set the Y rotation directly
        this.rootNode.rotation.y = targetAngle;
        
        // Log the current rotation after applying
        console.log(`Panel ${this.panelIndex+1} rotation after update: Y=${this.radToDeg(this.rootNode.rotation.y)}°`);
        
        // Force update of world matrix and rendering (with optional scene rendering)
        this.forceUpdate(renderScene);
    }
    
    /**
     * Force Babylon.js to update the panel mesh and matrices
     * @param {boolean} [renderScene=true] - Whether to render the scene
     */
    forceUpdate(renderScene = true) {
        // Force updates to Babylon.js objects
        if (this.rootNode) {
            this.rootNode.computeWorldMatrix(true);
        }
        
        if (this.panelMesh) {
            this.panelMesh.markAsDirty();
            this.panelMesh.refreshBoundingInfo();
            this.panelMesh.computeWorldMatrix(true);
        }
        
        // Force scene update only if requested and if there's a camera
        // This is critical during app initialization when there might not be a camera yet
        if (renderScene && this.scene && this.scene.activeCamera) {
            try {
                this.scene.render();
            } catch (e) {
                // Safely handle errors during initialization
                console.warn(`PanelModel: Couldn't render scene, this is normal during initialization: ${e.message}`);
            }
        }
    }
    
    /**
     * Get the current rotation delta
     * @returns {number} - Current delta in degrees
     */
    getCurrentDelta() {
        // Use shared state if available
        if (this.rotationState) {
            return this.rotationState.currentDelta;
        }
        // Fallback to direct value
        return 0;
    }
    
    /**
     * Get the current total rotation angle (default + delta)
     * @returns {number} - Current total angle in degrees
     */
    getCurrentTotalAngle() {
        if (this.rotationState && this.panelIndex >= 0) {
            const defaultAngle = this.rotationState.defaultAngles[this.panelIndex] || 0;
            const delta = this.rotationState.currentDelta || 0;
            return defaultAngle + delta;
        }
        
        // Fallback: convert current rotation to degrees
        if (this.rootNode) {
            return parseFloat(this.radToDeg(this.rootNode.rotation.y));
        }
        
        return 0;
    }
    
    /**
     * Helper function to convert radians to degrees
     * @param {number} rad - Angle in radians
     * @returns {number} - Angle in degrees
     */
    radToDeg(rad) {
        return (rad * 180 / Math.PI).toFixed(1);
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
    
    /**
     * Override getName to return "Panel"
     * @returns {string} The display name for this model
     */
    getName() {
        return "Panel";
    }
} 