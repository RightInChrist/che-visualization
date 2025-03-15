import { TransformNode, Vector3 } from '@babylonjs/core';

/**
 * Base model class that provides common functionality for all models
 * Intended to be extended by more specific model classes
 */
export class BaseModel {
    /**
     * @param {BABYLON.Scene} scene - The Babylon.js scene
     * @param {BABYLON.Vector3} position - The position of the model
     * @param {Object} options - Configuration options
     */
    constructor(scene, position = new Vector3(0, 0, 0), options = {}) {
        this.scene = scene;
        this.position = position;
        
        // Store options with defaults
        this.options = {
            debug: false,  // Enable debug logging
            name: 'model', // Default name for the model
            ...options
        };
        
        // Create root transform node
        const nodeName = this.options.name || this.constructor.name;
        this.rootNode = new TransformNode(nodeName, this.scene);
        this.rootNode.position = this.position;
        
        // Track visibility state
        this._isVisible = true;
        
        this.debugLog(`Created ${this.constructor.name} at position (${position.x}, ${position.y}, ${position.z})`);
    }
    
    /**
     * Debug logging function that only logs when debug is enabled
     * @param {...any} args - Arguments to log
     */
    debugLog(...args) {
        if (this.options.debug) {
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
} 