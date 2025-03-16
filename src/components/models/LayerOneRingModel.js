import { Vector3 } from '@babylonjs/core';
import { HexagonModel } from './HexagonModel';
import { SingleCutModel } from './SingleCutModel';

/**
 * LayerOneRingModel - A model with 6 SingleCutModel instances at the corners of a hexagon
 * and no instances on the sides.
 */
export class LayerOneRingModel extends HexagonModel {
    /**
     * @param {BABYLON.Scene} scene - The Babylon.js scene
     * @param {BABYLON.Vector3} position - The position of the model
     * @param {Object} options - Configuration options
     */
    constructor(scene, position = new Vector3(0, 0, 0), options = {}) {
        // Default options
        const defaultOptions = {
            debug: false,
            singleCutRadius: 21,    // Radius for the SingleCUT instances
            cornerRotationAngle: 30, // Default rotation angle for corner SingleCUTs
            radius: 36.37,   // Default outer ring radius
            visibility: {
                all: true
            }
        };
        
        // Call parent constructor with merged options
        super(scene, position, { ...defaultOptions, ...options });
        
        // Create cornerRotations array that will be passed by reference to SingleCutModels
        this.cornerRotations = [];
        
        // Create the corner SingleCUT models
        this.createModels();
    }
    
    /**
     * Create the corner SingleCUT models
     */
    createModels() {
        this.debugLog('Creating LayerOneRingModel with 6 corner SingleCUTs');
        
        const { singleCutRadius, cornerRotationAngle } = this.options;
        
        // Store corner models for direct access
        this.cornerCuts = [];
        
        // Initialize corner rotations
        for (let i = 0; i < 6; i++) {
            this.cornerRotations.push({
                id: `corner-${i}`,
                name: `Corner ${i + 1}`,
                index: i,
                angle: cornerRotationAngle,
                min: 0,
                max: 360,
                default: cornerRotationAngle
            });
        }
        
        // Create a SingleCUT at each corner
        for (let i = 0; i < 6; i++) {
            // Calculate the position from the corner node
            const cornerPosition = this.cornerNodes[i].position.clone();
            
            // Create a SingleCUT model at this corner
            const cornerCut = new SingleCutModel(this.scene, cornerPosition, {
                radius: singleCutRadius,
                rotationAngle: this.cornerRotations[i].angle,
                parent: this,
                debug: this.options.debug
            });
            
            // Store reference and add as child
            this.cornerCuts.push(cornerCut);
            this.addChild(cornerCut);
        }
        
        this.debugLog('LayerOneRingModel creation complete');
    }

    /**
     * Override getRadius to return the distance from center to corners
     * @returns {Object} - The radius object that can be modified by reference
     */
    getRadius() {
        // Initialize a radius object if it doesn't exist
        if (!this._radius) {
            this._radius = {
                value: this.options.radius, // Current radius value (distance to corners)
                min: this.getMinRadius(),   // Minimum radius
                max: this.getMaxRadius(),   // Maximum radius
                default: this.getDefaultRadius() // Default radius
            };
            
            // Define a setter for the value property that applies the radius when changed
            Object.defineProperty(this._radius, 'value', {
                get: () => this.options.radius,
                set: (value) => {
                    // Only update if the value actually changed
                    if (this.options.radius !== value) {
                        this.updateRadius(value);
                    }
                }
            });
        }
        
        return this._radius;
    }
    
    /**
     * Gets the rotation information for corner models
     * @returns {Array} - Array of rotation objects for corner models
     */
    getChildrenRotations() {
        return this.cornerRotations;
    }
    
    /**
     * Update radius and reposition all corner SingleCUTs
     * @param {number} newRadius - The new radius value
     */
    updateRadius(newRadius) {
        // Update parent first (will update transform nodes)
        super.updateRadius(newRadius);
        
        // Update position of each corner SingleCUT
        for (let i = 0; i < this.cornerCuts.length; i++) {
            const cornerCut = this.cornerCuts[i];
            const cornerNode = this.cornerNodes[i];
            
            if (cornerCut && cornerCut.rootNode && cornerNode) {
                cornerCut.rootNode.position = cornerNode.position.clone();
            }
        }
        
        this.debugLog(`Updated radius to ${newRadius}`);
    }

    /**
     * Override getName to return "Layer One Ring"
     * @returns {string} The display name for this model
     */
    getName() {
        return "Layer One Ring";
    }

    /**
     * Model initialization method called after scene setup
     * Ensures the model and its children are properly initialized
     */
    onRender() {
        this.debugLog('Initializing LayerOneRingModel');
        
        // Propagate to children
        this.cornerCuts.forEach(cornerCut => {
            if (cornerCut && typeof cornerCut.onRender === 'function') {
                cornerCut.onRender();
            }
        });
        
        this.debugLog('LayerOneRingModel initialization complete');
    }
    
    /**
     * Dispose this model and its resources
     */
    dispose() {
        // Clean up references to cornerCuts
        this.cornerCuts = [];
        this.cornerRotations = [];
        
        // Call parent dispose method which will dispose children
        super.dispose();
    }
} 