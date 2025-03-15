import { Vector3, Color3 } from '@babylonjs/core';
import { SingleCutModel } from './SingleCutModel';
import { CompositeModel } from './CompositeModel';

/**
 * Creates a Seven CUTs model with 7 SingleCUT models arranged in a specific pattern
 * One central SingleCUT and 6 surrounding in a larger hexagonal pattern
 */
export class SevenCutsModel extends CompositeModel {
    constructor(scene, position = new Vector3(0, 0, 0), options = {}) {
        // Default options
        const defaultOptions = {
            outerRadius: 500, // Distance from center to outer SingleCUTs
            singleCutRadius: 150, // Radius for each individual SingleCUT
            debug: false, // Enable/disable debug logging
        };

        // Call parent constructor
        super(scene, position, { ...defaultOptions, ...options });
        
        // Create the models
        this.createModels();
    }
    
    /**
     * Create all the SingleCUT models
     */
    createModels() {
        this.debugLog('Creating Seven CUTs model');
        
        // Create center SingleCUT
        const centerCut = new SingleCutModel(this.scene, new Vector3(0, 0, 0), {
            radius: this.options.singleCutRadius
        });
        this.addChild(centerCut);
        
        this.debugLog('Created center SingleCUT at (0, 0, 0)');
        
        // Create 6 surrounding SingleCUTs in a hexagonal pattern
        for (let i = 0; i < 6; i++) {
            const angle = (i * 2 * Math.PI) / 6;
            const x = this.options.outerRadius * Math.cos(angle);
            const z = this.options.outerRadius * Math.sin(angle);
            
            const position = new Vector3(x, 0, z);
            
            this.debugLog(`Creating SingleCUT #${i+2} at (${x.toFixed(2)}, 0, ${z.toFixed(2)})`);
            
            const singleCut = new SingleCutModel(this.scene, position, {
                radius: this.options.singleCutRadius
            });
            
            this.addChild(singleCut);
        }
        
        this.debugLog('Seven CUTs model creation complete');
    }
    
    /**
     * Collects all pipes from all SingleCUT models
     * @returns {Array} - Array of all pipe meshes
     */
    getAllPipes() {
        return this.getAllMeshes('pipes');
    }
    
    /**
     * Provides access to all SingleCUT models (for backward compatibility)
     * @returns {Array} - Array of all SingleCUT models
     */
    get singleCuts() {
        return this.getChildren();
    }
} 