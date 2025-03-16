import { Vector3 } from '@babylonjs/core';
import { CompositeModel } from './CompositeModel';
import { SingleCutModel } from './SingleCutModel';

/**
 * StarModel - A simplified model with just a central CUT
 */
export class StarModel extends CompositeModel {
    constructor(scene, position = new Vector3(0, 0, 0), options = {}) {
        // Default options
        const defaultOptions = {
            debug: false,
            singleCutRadius: 21,      // Radius for the SingleCUT
            rotationAngle: 30,        // Default rotation angle
            visibility: {
                centralCut: false
            }
        };
        
        // Call parent constructor with merged options
        super(scene, position, { ...defaultOptions, ...options });
        
        // Create the central CUT
        this.createModels();
        
        // Initialize as invisible by default
        this._isVisible = false;
        if (this.rootNode) {
            this.rootNode.setEnabled(false);
        }
    }
    
    /**
     * Create the central SingleCUT model
     */
    createModels() {
        this.debugLog('Creating Star Model with central CUT');
        
        const { singleCutRadius, rotationAngle } = this.options;
        
        // Create the central SingleCUT
        const centralCut = new SingleCutModel(this.scene, new Vector3(0, 0, 0), {
            radius: singleCutRadius,
            rotationAngle: rotationAngle,
            parent: this
        });
        
        // Store reference to the central cut for direct access
        this.centralCut = centralCut;
        this.addChild(centralCut);
        
        // Ensure the central cut is also hidden by default
        centralCut.setVisible(false);
        
        this.debugLog('Star Model creation complete');
    }
    
    /**
     * Update the radius settings for the central CUT
     * @param {number} outerRadius - Not used in this simplified model
     * @param {number} singleCutRadius - New radius for the SingleCUT
     */
    updateRadiusSettings(outerRadius, singleCutRadius) {
        this.options.singleCutRadius = singleCutRadius;
        
        // Update the central SingleCUT radius
        if (this.centralCut && typeof this.centralCut.updateRadius === 'function') {
            this.centralCut.updateRadius(singleCutRadius);
        }
    }
    
    /**
     * Override getName to return "Star"
     * @returns {string} The display name for this model
     */
    getName() {
        return "Star";
    }
    
    /**
     * Get all pipes from the central CUT
     * @returns {Array} - Array of all pipe objects
     */
    getAllPipes() {
        return this.centralCut && this.centralCut.pipes ? [...this.centralCut.pipes] : [];
    }
    
    /**
     * Get all SingleCUT models
     * @returns {Object} - Object containing all SingleCUT models by layer
     */
    getAllSingleCuts() {
        return {
            central: this.centralCut ? [this.centralCut] : [],
            layerOne: [] // Empty since we only have the central CUT
        };
    }
    
    /**
     * Gets the rotation object for this model
     * @returns {Object} - Rotation object with angle, min, max and default properties
     */
    getRotation() {
        // Initialize a rotation object if it doesn't exist
        if (!this._rotation) {
            this._rotation = {
                angle: this.options.rotationAngle || 0,    // Current rotation angle
                min: 0,                                    // Minimum rotation angle
                max: 360,                                  // Maximum rotation angle
                default: this.options.rotationAngle || 0   // Default rotation angle
            };
            
            // Define a setter for the angle property that applies rotation when changed
            Object.defineProperty(this._rotation, 'angle', {
                get: () => this.options.rotationAngle || 0,
                set: (value) => {
                    // Update the stored angle
                    this.options.rotationAngle = value;
                    
                    // Apply rotation to the model if it has a root node
                    if (this.rootNode) {
                        this.rootNode.rotation.y = (value * Math.PI) / 180;
                    }
                }
            });
        }
        
        return this._rotation;
    }
    
    /**
     * Gets the rotation information for child models (centralCut)
     * For use with rotation controls UI
     * @returns {Array} - Array of rotation objects
     */
    getChildrenRotations() {
        if (this.centralCut && typeof this.centralCut.getRotation === 'function') {
            return [this.centralCut.getRotation()];
        }
        return null;
    }
    
    /**
     * Model initialization method called after scene setup
     * Ensures the model and its children are properly initialized
     */
    onRender() {
        this.debugLog('Initializing Star Model');
        
        // Apply any Star-specific initialization here
        
        // Propagate to children - especially important for the central cut
        if (this.centralCut && typeof this.centralCut.onRender === 'function') {
            this.centralCut.onRender();
        }
        
        this.debugLog('Star Model initialization complete');
    }
} 