import { Vector3 } from '@babylonjs/core';
import { CompositeModel } from './CompositeModel';
import { SingleCutModel } from './SingleCutModel';

/**
 * StarModel - A simplified composite model
 * Contains a central SingleCUT and a star arrangement of outer SingleCUTs
 */
export class StarModel extends CompositeModel {
    constructor(scene, position = new Vector3(0, 0, 0), options = {}) {
        // Default options
        const defaultOptions = {
            debug: false,
            outerRadius: 72.52,       // Radius for positioning outer SingleCUTs
            singleCutRadius: 21,      // Radius for each SingleCUT
            numPoints: 6,             // Number of points in the star (number of outer SingleCUTs)
            rotationAngle: 30,        // Default rotation angle
            visibility: {
                centralCut: true
            }
        };
        
        // Call parent constructor with merged options
        super(scene, position, { ...defaultOptions, ...options });
        
        // Create the models
        this.createModels();
    }
    
    /**
     * Create all SingleCUT models in a star arrangement
     */
    createModels() {
        this.debugLog('Creating Star Model with SingleCUTs');
        
        const { outerRadius, singleCutRadius, numPoints, rotationAngle } = this.options;
        
        // Create the central SingleCUT
        const centralCut = new SingleCutModel(this.scene, new Vector3(0, 0, 0), {
            radius: singleCutRadius,
            rotationAngle: rotationAngle,
            parent: this
        });
        
        // Store reference to the central cut for direct access
        this.centralCut = centralCut;
        this.addChild(centralCut);
        
        // Create outer SingleCUTs in a star arrangement
        for (let i = 0; i < numPoints; i++) {
            // Calculate angle
            const angle = (i * 2 * Math.PI) / numPoints;
            
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
        
        this.debugLog('Star Model creation complete');
    }
    
    /**
     * Update the radius settings for all SingleCUTs
     * @param {number} outerRadius - New outer radius for positioning
     * @param {number} singleCutRadius - New radius for each SingleCUT
     */
    updateRadiusSettings(outerRadius, singleCutRadius) {
        this.options.outerRadius = outerRadius;
        this.options.singleCutRadius = singleCutRadius;
        
        // Update the central SingleCUT radius
        if (this.centralCut && typeof this.centralCut.updateRadius === 'function') {
            this.centralCut.updateRadius(singleCutRadius);
        }
        
        // Update positions and radius of all outer SingleCUTs
        const outerCuts = this.childModels.slice(1); // Skip the central cut
        outerCuts.forEach((singleCut, i) => {
            // Calculate angle
            const angle = (i * 2 * Math.PI) / this.options.numPoints;
            
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
     * Update rotation for all SingleCUTs
     * @param {number} rotationAngle - New rotation angle in degrees
     */
    updateAllSingleCutRotations(rotationAngle) {
        this.options.rotationAngle = rotationAngle;
        
        // Update rotation for all SingleCUTs
        this.childModels.forEach(singleCut => {
            if (typeof singleCut.updateRotation === 'function') {
                singleCut.updateRotation(rotationAngle);
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
            central: this.centralCut ? [this.centralCut] : [],
            layerOne: this.childModels.slice(1) || [] // Skip the central cut
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