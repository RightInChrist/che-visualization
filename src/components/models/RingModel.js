import { Vector3 } from '@babylonjs/core';
import { CompositeModel } from './CompositeModel';
import { SingleCutModel } from './SingleCutModel';

/**
 * RingModel - A simplified composite model
 * Contains a ring of SingleCUT models
 */
export class RingModel extends CompositeModel {
    constructor(scene, position = new Vector3(0, 0, 0), options = {}) {
        // Default options
        const defaultOptions = {
            debug: false,
            outerRadius: 72.52,       // Radius for positioning SingleCUTs
            singleCutRadius: 21,      // Radius for each SingleCUT
            numModels: 12,            // Number of SingleCUTs in the ring
            rotationAngle: 30,        // Overall rotation angle
            visibility: {
                ring: true
            }
        };
        
        // Call parent constructor with merged options
        super(scene, position, { ...defaultOptions, ...options });
        
        // Create the SingleCUT models in a ring
        this.createModels();
    }
    
    /**
     * Create all SingleCUT models arranged in a ring
     */
    createModels() {
        this.debugLog('Creating Ring Model with SingleCUTs');
        
        const { outerRadius, singleCutRadius, numModels, rotationAngle } = this.options;
        
        // Create SingleCUTs arranged in a ring
        for (let i = 0; i < numModels; i++) {
            // Calculate angle
            const angle = (i * 2 * Math.PI) / numModels;
            
            // Calculate position
            const x = outerRadius * Math.cos(angle);
            const z = outerRadius * Math.sin(angle);
            const position = new Vector3(x, 0, z);
            
            // Create a SingleCUT model
            const singleCut = new SingleCutModel(this.scene, position, {
                radius: singleCutRadius,
                rotationAngle: rotationAngle,
                parent: this
            });
            
            // Add to the model children
            this.addChild(singleCut);
        }
        
        this.debugLog('Ring Model creation complete');
    }
    
    /**
     * Update the radius settings for all SingleCUTs
     * @param {number} outerRadius - New outer radius for positioning
     * @param {number} singleCutRadius - New radius for each SingleCUT
     */
    updateRadiusSettings(outerRadius, singleCutRadius) {
        this.options.outerRadius = outerRadius;
        this.options.singleCutRadius = singleCutRadius;
        
        // Update positions of all SingleCUTs
        this.childModels.forEach((singleCut, i) => {
            // Calculate angle
            const angle = (i * 2 * Math.PI) / this.options.numModels;
            
            // Calculate new position
            const x = outerRadius * Math.cos(angle);
            const z = outerRadius * Math.sin(angle);
            const position = new Vector3(x, 0, z);
            
            // Update SingleCUT position
            if (singleCut.rootNode) {
                singleCut.rootNode.position = position;
            }
            
            // Update SingleCUT radius
            if (typeof singleCut.updateRadius === 'function') {
                singleCut.updateRadius(singleCutRadius);
            }
        });
    }
    
    /**
     * Get all pipes from all SingleCUTs
     * @returns {Array} - Array of all pipe objects
     */
    getAllPipes() {
        const allPipes = [];
        
        // Collect pipes from all SingleCUTs
        this.childModels.forEach(singleCut => {
            if (singleCut.pipes) {
                allPipes.push(...singleCut.pipes);
            }
        });
        
        return allPipes;
    }
    
    /**
     * Get all SingleCUT models
     * @returns {Object} - Object containing all SingleCUT models by layer
     */
    getAllSingleCuts() {
        return {
            central: [], // Empty as central CUT has been moved out
            layerOne: this.childModels || []
        };
    }
    
    /**
     * Calculate the distance between opposite panels
     * @returns {number} - The distance between panels in meters
     */
    calculatePanelDistance() {
        // For hexagons, distance between opposite sides is 2 * radius * sin(60°)
        // or simply radius * √3
        return this.options.outerRadius * Math.sqrt(3);
    }
} 