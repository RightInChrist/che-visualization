import { Vector3 } from '@babylonjs/core';
import { CompositeModel } from './CompositeModel';
import { SingleCutModel } from './SingleCutModel';
import { LayerOneStarModel } from './LayerOneStarModel';

/**
 * StarModel - A composite model containing a central CUT and star-shaped layers
 * Organizes Central CUT and Layer One Star into a single model
 */
export class StarModel extends CompositeModel {
    constructor(scene, position = new Vector3(0, 0, 0), options = {}) {
        // Default options
        const defaultOptions = {
            debug: false,
            visibility: {
                centralCut: true,
                layerOne: true
            }
        };
        
        // Call parent constructor with merged options
        super(scene, position, { ...defaultOptions, ...options });
        
        // Store model references for direct access
        this.models = {
            centralCut: null,
            layerOneStar: null
        };
        
        // Friendly names for display in SceneEditor
        this.friendlyNames = {
            centralCut: "Star Central CUT",
            layerOneStar: "Layer One Star"
        };
        
        // Create models
        this.createModels();
    }
    
    /**
     * Create all component models
     */
    createModels() {
        this.debugLog('Creating Star Model with all layers');
        
        // Create Central CUT model
        const centralCut = new SingleCutModel(this.scene, new Vector3(0, 0, 0), {
            parent: this
        });
        centralCut.friendlyName = this.friendlyNames.centralCut;
        this.models.centralCut = centralCut;
        this.addChild(centralCut);
        
        // Create Layer One Star model
        const layerOneStar = new LayerOneStarModel(this.scene, new Vector3(0, 0, 0), {
            parent: this
        });
        layerOneStar.friendlyName = this.friendlyNames.layerOneStar;
        this.models.layerOneStar = layerOneStar;
        this.addChild(layerOneStar);
        
        // Apply initial visibility settings
        this.setModelVisibility();
        
        this.debugLog('Star Model creation complete');
    }
    
    /**
     * Set individual model visibility based on options
     */
    setModelVisibility() {
        const { visibility } = this.options;
        
        // Set visibility for each component
        if (this.models.centralCut) {
            this.models.centralCut.setVisible(visibility.centralCut);
        }
        
        if (this.models.layerOneStar) {
            this.models.layerOneStar.setVisible(visibility.layerOne);
        }
    }
    
    /**
     * Update visibility of a model by its key
     * @param {string} modelKey - Key of the model to update ('centralCut', 'layerOne')
     * @param {boolean} isVisible - Whether the model should be visible
     */
    updateModelVisibility(modelKey, isVisible) {
        // Map option keys to model keys
        const modelKeyMap = {
            centralCut: 'centralCut',
            layerOne: 'layerOneStar'
        };
        
        const modelRealKey = modelKeyMap[modelKey];
        if (modelRealKey && this.models[modelRealKey]) {
            this.models[modelRealKey].setVisible(isVisible);
            this.options.visibility[modelKey] = isVisible;
        }
    }
    
    /**
     * Get all pipes from all SingleCUTs across all layers
     * @returns {Object} - Object containing all pipes from all layers
     */
    getAllPipes() {
        const allPipes = [];
        
        // Get pipes from Central CUT
        if (this.models.centralCut) {
            const centralCutPipes = this.models.centralCut.pipes || [];
            allPipes.push(...centralCutPipes);
        }
        
        // Get pipes from Layer One Star
        if (this.models.layerOneStar) {
            const layerOneStarPipes = this.models.layerOneStar.getAllPipes() || [];
            allPipes.push(...layerOneStarPipes);
        }
        
        return allPipes;
    }
    
    /**
     * Get all SingleCUT models across all layers
     * @returns {Object} - Object containing all SingleCUT models by layer
     */
    getAllSingleCuts() {
        return {
            central: this.models.centralCut ? [this.models.centralCut] : [],
            layerOne: this.models.layerOneStar ? this.models.layerOneStar.getChildren() : [],
            layerTwo: [] // Empty array for no layerTwo
        };
    }
    
    /**
     * Get all models in this composite structure
     * @returns {Object} - Object containing all component models
     */
    getAllModels() {
        return { ...this.models };
    }
} 