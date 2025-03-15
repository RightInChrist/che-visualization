import { Vector3, TransformNode, Color3 } from '@babylonjs/core';
import { SingleCutModel } from './SingleCutModel';

/**
 * Creates a Seven CUTs model with 7 SingleCUT models arranged in a specific pattern
 * One central SingleCUT and 6 surrounding in a larger hexagonal pattern
 */
export class SevenCutsModel {
    constructor(scene, position = new Vector3(0, 0, 0), options = {}) {
        this.scene = scene;
        this.position = position;
        
        // Default options
        this.options = {
            outerRadius: 500, // Distance from center to outer SingleCUTs
            singleCutRadius: 150, // Radius for each individual SingleCUT
            debug: false, // Enable/disable debug logging
            ...options
        };
        
        // Create parent node for all models
        this.rootNode = new TransformNode('sevenCuts', this.scene);
        this.rootNode.position = this.position;
        
        // Create the models
        this.createModels();
    }
    
    /**
     * Debug logging function that only logs when debug is enabled
     * @param {...any} args - Arguments to log
     */
    debugLog(...args) {
        if (this.options.debug) {
            console.log('[SevenCUTs Debug]', ...args);
        }
    }
    
    /**
     * Create all the SingleCUT models
     */
    createModels() {
        this.singleCuts = [];
        
        this.debugLog('Creating Seven CUTs model');
        
        // Create center SingleCUT
        const centerCut = new SingleCutModel(this.scene, new Vector3(0, 0, 0), {
            radius: this.options.singleCutRadius
        });
        centerCut.rootNode.parent = this.rootNode;
        this.singleCuts.push(centerCut);
        
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
            
            singleCut.rootNode.parent = this.rootNode;
            this.singleCuts.push(singleCut);
        }
        
        this.debugLog('Seven CUTs model creation complete');
    }
    
    /**
     * Updates the level of detail based on camera distance
     * @param {Vector3} cameraPosition - The camera position
     */
    updateLOD(cameraPosition) {
        // Update LOD for each SingleCUT model
        this.singleCuts.forEach(singleCut => {
            singleCut.updateLOD(cameraPosition);
        });
    }
    
    /**
     * Collects all pipes from all SingleCUT models
     * @returns {Array} - Array of all pipe meshes
     */
    getAllPipes() {
        const allPipes = [];
        
        this.singleCuts.forEach(singleCut => {
            singleCut.pipes.forEach(pipe => {
                allPipes.push(pipe);
            });
        });
        
        return allPipes;
    }
    
    /**
     * Disposes of all resources
     */
    dispose() {
        this.singleCuts.forEach(singleCut => {
            singleCut.dispose();
        });
        this.rootNode.dispose();
    }
} 