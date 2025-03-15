import { Vector3, Color3 } from '@babylonjs/core';
import { SingleCutModel } from './SingleCutModel';
import { CompositeModel } from './CompositeModel';

/**
 * Creates a Seven CUTs model with 7 SingleCUT models arranged in a specific pattern
 * One central SingleCUT and 6 surrounding in a larger hexagonal pattern with overlap
 */
export class SevenCutsModel extends CompositeModel {
    constructor(scene, position = new Vector3(0, 0, 0), options = {}) {
        // Default options
        const defaultOptions = {
            outerRadius: 250, // Distance from center to outer SingleCUTs (reduced from 500 to create overlap)
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
        
        // Track permanently hidden elements for scene editor
        this.permanentlyHiddenElements = [];
        
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
            
            // Hide overlapping pipes and panels for outer SingleCUTs
            // Each outer SingleCUT needs to hide:
            // 1. The pipe facing the center
            // 2. The pipe clockwise to the center-facing pipe
            // 3. The panel connecting these two pipes
            // 4. The panel before the center-facing pipe
            
            // Calculate which pipe is pointing toward the center (opposite of the angle)
            const centerFacingIndex = this.getIndexFacingCenter(i, angle);
            
            // Pipe facing the center
            singleCut.pipes[centerFacingIndex].setVisible(false);
            singleCut.pipes[centerFacingIndex].isPermanentlyHidden = true;
            this.permanentlyHiddenElements.push({
                modelIndex: i + 1,
                type: 'pipe',
                index: centerFacingIndex
            });
            this.debugLog(`Hiding pipe ${centerFacingIndex + 1} for SingleCUT #${i+2} (facing center)`);
            
            // Pipe clockwise to the center-facing one (instead of counter-clockwise)
            const cwIndex = (centerFacingIndex + 1) % 6;
            singleCut.pipes[cwIndex].setVisible(false);
            singleCut.pipes[cwIndex].isPermanentlyHidden = true;
            this.permanentlyHiddenElements.push({
                modelIndex: i + 1,
                type: 'pipe',
                index: cwIndex
            });
            this.debugLog(`Hiding pipe ${cwIndex + 1} for SingleCUT #${i+2} (clockwise to center)`);
            
            // Panel between the hidden pipes (connecting them)
            // The panel index might be either centerFacingIndex or one less, depending on how indices wrap
            const panelBetweenIndex = centerFacingIndex;
            singleCut.panels[panelBetweenIndex].setVisible(false);
            singleCut.panels[panelBetweenIndex].isPermanentlyHidden = true;
            this.permanentlyHiddenElements.push({
                modelIndex: i + 1,
                type: 'panel',
                index: panelBetweenIndex
            });
            this.debugLog(`Hiding panel ${panelBetweenIndex + 1} for SingleCUT #${i+2} (between hidden pipes)`);
            
            // Panel clockwise to the center-facing pipe
            const panelClockwiseIndex = (centerFacingIndex + 1) % 6;
            singleCut.panels[panelClockwiseIndex].setVisible(false);
            singleCut.panels[panelClockwiseIndex].isPermanentlyHidden = true;
            this.permanentlyHiddenElements.push({
                modelIndex: i + 1,
                type: 'panel',
                index: panelClockwiseIndex
            });
            this.debugLog(`Hiding panel ${panelClockwiseIndex + 1} for SingleCUT #${i+2} (clockwise to center-facing pipe)`);
        }
        
        this.debugLog('Seven CUTs model creation complete');
    }
    
    /**
     * Check if a pipe or panel is permanently hidden
     * @param {number} modelIndex - The index of the SingleCUT (1-7, where 1 is center)
     * @param {string} type - 'pipe' or 'panel'
     * @param {number} index - The index of the pipe or panel
     * @returns {boolean} - Whether the element is permanently hidden
     */
    isElementPermanentlyHidden(modelIndex, type, index) {
        if (!this.permanentlyHiddenElements) return false;
        
        return this.permanentlyHiddenElements.some(element => 
            element.modelIndex === modelIndex && 
            element.type === type && 
            element.index === index);
    }
    
    /**
     * Calculate the index of the pipe facing the center for an outer SingleCUT
     * @param {number} modelIndex - The index of the SingleCUT (0-5)
     * @param {number} modelAngle - The angle of the SingleCUT from the center
     * @returns {number} - The index of the pipe facing the center (0-5)
     */
    getIndexFacingCenter(modelIndex, modelAngle) {
        // The pipe direction is opposite of the model's angle from center
        // Convert this to an index in the range 0-5 based on the closest pipe angle
        
        // Inverse angle (pointing toward center)
        const inverseAngle = (modelAngle + Math.PI) % (2 * Math.PI);
        
        // Convert angle to pipe index (finding closest pipe to this angle)
        // Each pipe is at 60° (π/3 radians) intervals
        const normalizedAngle = inverseAngle < 0 ? inverseAngle + 2 * Math.PI : inverseAngle;
        const pipeIndex = Math.round(normalizedAngle / (Math.PI / 3)) % 6;
        
        return pipeIndex;
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