import { TransformNode, Vector3 } from '@babylonjs/core';

/**
 * Generates a simple UUID v4 format string
 * @returns {string} A UUID string
 */
function generateUUID() {
    // Use crypto.randomUUID() if available (modern browsers)
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    
    // Fallback implementation for older browsers
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Base model class that provides common functionality for all models
 * Intended to be extended by more specific model classes
 */
export class BaseModel {
    static instanceCounter = 0;

    /**
     * @param {BABYLON.Scene} scene - The Babylon.js scene
     * @param {BABYLON.Vector3} position - The position of the model
     * @param {Object} options - Configuration options
     */
    constructor(scene, position = null, options = {}) {
        // Increment instance counter for unique identification
        BaseModel.instanceCounter++;
        
        // Store creation time for debugging
        this.creationTime = new Date().toISOString();
        
        // Store instance counter value for identification
        this.instanceNumber = BaseModel.instanceCounter;
        
        // Generate a UUID for this model
        this.id = generateUUID();
        
        // Generate a unique ID for this model (for backward compatibility)
        this.uniqueId = `${this.constructor.name}_${this.instanceNumber}`;

        // Store reference to the scene
        this.scene = scene;
        
        // Store options
        this.options = options;
        
        // Create root transform node
        this.rootNode = new TransformNode(this.uniqueId, scene);
        
        // Store initial values for logging/debugging
        this.initialValues = {
            position: position ? position.clone() : null,
        };
        
        // Set initial position if provided
        if (position) {
            this.rootNode.position = position;
        }
        
        // Debug mode
        this.debug = options.debug || false;
        
        // Track visibility state
        this._isVisible = true;
        
        this.debugLog(`Created ${this.constructor.name} at position (${position?.x.toFixed(2) || 'null'}, ${position?.y.toFixed(2) || 'null'}, ${position?.z.toFixed(2) || 'null'})`);
    }
    
    /**
     * Get a user-friendly name for this model
     * @returns {string} A display name for this model
     */
    getName() {
        // Extract the base class name
        let className = this.constructor.name;
        
        // Remove "Model" suffix if present
        if (className.endsWith('Model')) {
            className = className.slice(0, -5);
        }
        
        // Handle special cases
        if (className === 'SingleCut') {
            return 'CUT';
        }
        
        // Insert spaces before capital letters for multi-word names
        const spaced = className.replace(/([A-Z])/g, ' $1').trim();
        
        // Return the formatted name
        return spaced;
    }
    
    /**
     * Debug logging function that only logs when debug is enabled
     * @param {...any} args - Arguments to log
     */
    debugLog(...args) {
        if (this.debug) {
            console.log(`[${this.constructor.name} Debug]`, ...args);
        }
    }
    
    /**
     * Updates level of detail based on camera distance
     * To be implemented by child classes
     * @param {BABYLON.Vector3} cameraPosition - Position of the camera
     */
    updateLOD(cameraPosition) {
        // Default implementation does nothing
        // Child classes should override this
    }
    
    /**
     * Sets visibility of the model
     * @param {boolean} isVisible - Whether the model should be visible
     */
    setVisible(isVisible) {
        this._isVisible = isVisible;
        
        if (this.rootNode) {
            this.rootNode.setEnabled(isVisible);
            this.debugLog(`Set ${this.constructor.name} visibility to ${isVisible}`);
        }
    }
    
    /**
     * Gets the current visibility state
     * @returns {boolean} - Whether the model is visible
     */
    isVisible() {
        return this._isVisible;
    }
    
    /**
     * Disposes of the model's resources
     */
    dispose() {
        if (this.rootNode) {
            this.rootNode.dispose();
            this.debugLog(`Disposed ${this.constructor.name}`);
        }
    }
    
    /**
     * Log detailed information about this model
     * Useful for debugging when triggered from scene editor
     */
    logModelDetails() {
        console.group(`${this.constructor.name} Details`);
        
        // Basic info
        console.log("Type:", this.constructor.name);
        
        // Initial values
        if (this.initialValues) {
            console.group("Initial Values");
            
            if (this.initialValues.position) {
                console.log("Position:", {
                    x: this.initialValues.position.x.toFixed(2),
                    y: this.initialValues.position.y.toFixed(2),
                    z: this.initialValues.position.z.toFixed(2)
                });
            }
            
            if (this.initialValues.radius !== undefined) {
                console.log("Radius:", this.initialValues.radius.toFixed(2));
            }
            
            if (this.initialValues.rotationAngle !== undefined) {
                console.log("Rotation:", this.initialValues.rotationAngle.toFixed(2) + "°");
            }
            
            console.groupEnd();
        }
        
        // Current values from rootNode
        if (this.rootNode) {
            console.group("Current Transform");
            
            const position = this.rootNode.position;
            console.log("Position:", {
                x: position.x.toFixed(2),
                y: position.y.toFixed(2),
                z: position.z.toFixed(2)
            });
            
            const rotation = this.rootNode.rotation;
            console.log("Rotation:", {
                x: (rotation.x * 180 / Math.PI).toFixed(2) + "°",
                y: (rotation.y * 180 / Math.PI).toFixed(2) + "°",
                z: (rotation.z * 180 / Math.PI).toFixed(2) + "°"
            });
            
            console.log("Enabled:", this.rootNode.isEnabled());
            console.groupEnd();
        }
        
        // Option values
        if (this.options) {
            console.group("Options");
            
            // Radius values
            if (this.options.radius !== undefined) {
                console.log("Radius:", this.options.radius.toFixed(2));
            }
            
            if (this.options.outerRadius !== undefined) {
                console.log("Outer Radius:", this.options.outerRadius.toFixed(2));
            }
            
            if (this.options.innerRadius !== undefined) {
                console.log("Inner Radius:", this.options.innerRadius.toFixed(2));
            }
            
            if (this.options.singleCutRadius !== undefined) {
                console.log("SingleCut Radius:", this.options.singleCutRadius.toFixed(2));
            }
            
            // Rotation values
            if (this.options.rotationAngle !== undefined) {
                console.log("Rotation Angle:", this.options.rotationAngle.toFixed(2) + "°");
            }
            
            // Parent reference (if any)
            if (this.options.parent) {
                console.log("Parent:", this.options.parent.uniqueId || "Unknown");
            }
            
            console.groupEnd();
        }
        
        // Calculate changes if we have initial values
        if (this.initialValues && this.initialValues.position && this.rootNode) {
            console.group("Changes from Initial State");
            
            const initialPos = this.initialValues.position;
            const currentPos = this.rootNode.position;
            
            console.log("Position Delta:", {
                x: (currentPos.x - initialPos.x).toFixed(2),
                y: (currentPos.y - initialPos.y).toFixed(2),
                z: (currentPos.z - initialPos.z).toFixed(2)
            });
            
            if (this.initialValues.radius !== undefined && this.options.radius !== undefined) {
                console.log("Radius Delta:", (this.options.radius - this.initialValues.radius).toFixed(2));
            }
            
            if (this.initialValues.rotationAngle !== undefined && this.options.rotationAngle !== undefined) {
                console.log("Rotation Delta:", (this.options.rotationAngle - this.initialValues.rotationAngle).toFixed(2) + "°");
            }
            
            console.groupEnd();
        }
        
        console.groupEnd();
    }
} 