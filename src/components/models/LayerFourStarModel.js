import { Vector3 } from '@babylonjs/core';
import { HexagonModel } from './HexagonModel';
import { SingleCutModel } from './SingleCutModel';

/**
 * LayerFourStarModel - A model with 6 SingleCutModel instances at the corners 
 * and 18 SingleCutModel instances along the sides (3 between each corner).
 * Similar to LayerFourRingModel but with different default settings.
 */
export class LayerFourStarModel extends HexagonModel {
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
            cornerRotationAngle: 0, // Default rotation angle for corner SingleCUTs (different from Ring)
            sideRotationAngle: 0,   // Default rotation angle for side SingleCUTs (different from Ring)
            radius: 168.0,          // Default outer star radius (larger than previous layer)
            sidesPerCorner: 3,      // Number of side cuts between each corner
            visibility: {
                all: true
            }
        };
        
        // Call parent constructor with merged options
        super(scene, position, { ...defaultOptions, ...options });
        
        // Create rotation arrays that will be passed by reference to SingleCutModels
        this.cornerRotations = [];
        this.sideRotations = [];
        
        // Create the corner and side SingleCUT models
        this.createModels();
    }
    
    /**
     * Create the corner and side SingleCUT models
     */
    createModels() {
        this.debugLog('Creating LayerFourStarModel with 6 corner SingleCUTs and 18 side SingleCUTs');
        
        const { singleCutRadius, cornerRotationAngle, sideRotationAngle, sidesPerCorner } = this.options;
        
        // Store models for direct access
        this.cornerCuts = [];
        this.sideCuts = [];
        
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
        
        // Initialize side rotations - 18 in total (3 per segment)
        for (let i = 0; i < 6 * sidesPerCorner; i++) {
            this.sideRotations.push({
                id: `side-${i}`,
                name: `Side ${i + 1}`,
                index: i,
                angle: sideRotationAngle,
                min: 0,
                max: 360,
                default: sideRotationAngle
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
        
        // Create the side cuts - 3 between each corner
        for (let i = 0; i < 6; i++) {
            // Calculate the next corner index (wrapping around to 0)
            const nextCornerIndex = (i + 1) % 6;
            
            // Get positions of current and next corner
            const currentCornerPosition = this.cornerNodes[i].position.clone();
            const nextCornerPosition = this.cornerNodes[nextCornerIndex].position.clone();
            
            // Create 3 cuts between each corner
            for (let j = 1; j <= sidesPerCorner; j++) {
                // Calculate position - divide segment into sidesPerCorner+1 parts
                const t = j / (sidesPerCorner + 1);
                
                // Interpolate between the two corner positions
                const sidePosition = new Vector3(
                    currentCornerPosition.x * (1 - t) + nextCornerPosition.x * t,
                    currentCornerPosition.y * (1 - t) + nextCornerPosition.y * t,
                    currentCornerPosition.z * (1 - t) + nextCornerPosition.z * t
                );
                
                // Calculate the side cut index
                const sideIndex = i * sidesPerCorner + (j - 1);
                
                // Create a SingleCUT model at this side position
                const sideCut = new SingleCutModel(this.scene, sidePosition, {
                    radius: singleCutRadius,
                    rotationAngle: this.sideRotations[sideIndex].angle,
                    parent: this,
                    debug: this.options.debug
                });
                
                // Store reference and add as child
                this.sideCuts.push(sideCut);
                this.addChild(sideCut);
            }
        }
        
        this.debugLog(`LayerFourStarModel creation complete with ${this.cornerCuts.length} corners and ${this.sideCuts.length} sides`);
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
     * Gets the rotation information for corner and side models
     * @returns {Array} - Array of rotation objects for all models
     */
    getChildrenRotations() {
        return [...this.cornerRotations, ...this.sideRotations];
    }
    
    /**
     * Update radius and reposition all corner and side SingleCUTs
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
        
        // Re-calculate positions for side cuts
        const { sidesPerCorner } = this.options;
        let sideIndex = 0;
        
        // Update position of each side SingleCUT
        for (let i = 0; i < 6; i++) {
            // Calculate the next corner index (wrapping around to 0)
            const nextCornerIndex = (i + 1) % 6;
            
            // Get positions of current and next corner
            const currentCornerPosition = this.cornerNodes[i].position.clone();
            const nextCornerPosition = this.cornerNodes[nextCornerIndex].position.clone();
            
            // Update positions for side cuts between this pair of corners
            for (let j = 1; j <= sidesPerCorner; j++) {
                if (sideIndex < this.sideCuts.length) {
                    const sideCut = this.sideCuts[sideIndex];
                    
                    if (sideCut && sideCut.rootNode) {
                        // Calculate position - divide segment into sidesPerCorner+1 parts
                        const t = j / (sidesPerCorner + 1);
                        
                        // Interpolate between the two corner positions
                        const sidePosition = new Vector3(
                            currentCornerPosition.x * (1 - t) + nextCornerPosition.x * t,
                            currentCornerPosition.y * (1 - t) + nextCornerPosition.y * t,
                            currentCornerPosition.z * (1 - t) + nextCornerPosition.z * t
                        );
                        
                        // Update the position
                        sideCut.rootNode.position = sidePosition;
                    }
                    
                    sideIndex++;
                }
            }
        }
        
        this.debugLog(`Updated radius to ${newRadius}`);
    }

    /**
     * Return the minimum allowed radius
     * @returns {number} The minimum radius
     */
    getMinRadius() {
        return 130; // Minimum radius for this layer
    }

    /**
     * Return the maximum allowed radius
     * @returns {number} The maximum radius
     */
    getMaxRadius() {
        return 210; // Maximum radius for this layer
    }

    /**
     * Return the default radius
     * @returns {number} The default radius
     */
    getDefaultRadius() {
        return 168.0; // Default radius for this layer
    }

    /**
     * Override getName to return "Layer Four Star"
     * @returns {string} The display name for this model
     */
    getName() {
        return "Layer Four Star";
    }

    /**
     * Model initialization method called after scene setup
     * Ensures the model and its children are properly initialized
     */
    onRender() {
        this.debugLog('Initializing LayerFourStarModel');
        
        // Propagate to corner children
        this.cornerCuts.forEach(cornerCut => {
            if (cornerCut && typeof cornerCut.onRender === 'function') {
                cornerCut.onRender();
            }
        });
        
        // Propagate to side children
        this.sideCuts.forEach(sideCut => {
            if (sideCut && typeof sideCut.onRender === 'function') {
                sideCut.onRender();
            }
        });
        
        this.debugLog('LayerFourStarModel initialization complete');
    }
    
    /**
     * Dispose this model and its resources
     */
    dispose() {
        // Clean up references to cuts
        this.cornerCuts = [];
        this.cornerRotations = [];
        this.sideCuts = [];
        this.sideRotations = [];
        
        // Call parent dispose method which will dispose children
        super.dispose();
    }
} 