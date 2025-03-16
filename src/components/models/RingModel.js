import { Vector3 } from '@babylonjs/core';
import { CompositeModel } from './CompositeModel';
import { SingleCutModel } from './SingleCutModel';
import { LayerOneModel } from './LayerOneModel';
import { LayerTwoModel } from './LayerTwoModel';

/**
 * RingModel - A composite model containing ring-shaped layers
 * Organizes Layer One Ring and Layer Two Ring into a single model
 * (Central CUT has been moved out of the RingModel)
 */
export class RingModel extends CompositeModel {
    constructor(scene, position = new Vector3(0, 0, 0), options = {}) {
        // Default options
        const defaultOptions = {
            debug: false,
            visibility: {
                layerOne: true,
                layerTwo: true
            }
        };
        
        // Call parent constructor with merged options
        super(scene, position, { ...defaultOptions, ...options });
        
        // Store model references for direct access
        this.models = {
            layerOneRing: null,
            layerTwoRing: null
        };
        
        // Friendly names for display in SceneEditor
        this.friendlyNames = {
            layerOneRing: "Layer One Ring",
            layerTwoRing: "Layer Two Ring"
        };
        
        // Create models
        this.createModels();
    }
    
    /**
     * Create all component models
     */
    createModels() {
        this.debugLog('Creating Ring Model with all layers');
        
        // Create Layer One Ring model
        const layerOneRing = new LayerOneModel(this.scene, new Vector3(0, 0, 0), {
            parent: this
        });
        layerOneRing.friendlyName = this.friendlyNames.layerOneRing;
        this.models.layerOneRing = layerOneRing;
        this.addChild(layerOneRing);
        
        // Create Layer Two Ring model
        const layerTwoRing = new LayerTwoModel(this.scene, new Vector3(0, 0, 0), {
            parent: this
        });
        layerTwoRing.friendlyName = this.friendlyNames.layerTwoRing;
        this.models.layerTwoRing = layerTwoRing;
        this.addChild(layerTwoRing);
        
        // Apply initial visibility settings
        this.setModelVisibility();
        
        this.debugLog('Ring Model creation complete');
    }
    
    /**
     * Set individual model visibility based on options
     */
    setModelVisibility() {
        const { visibility } = this.options;
        
        // Set visibility for each component
        if (this.models.layerOneRing) {
            this.models.layerOneRing.setVisible(visibility.layerOne);
        }
        
        if (this.models.layerTwoRing) {
            this.models.layerTwoRing.setVisible(visibility.layerTwo);
        }
    }
    
    /**
     * Update visibility of a model by its key
     * @param {string} modelKey - Key of the model to update ('layerOne' or 'layerTwo')
     * @param {boolean} isVisible - Whether the model should be visible
     */
    updateModelVisibility(modelKey, isVisible) {
        // Map option keys to model keys
        const modelKeyMap = {
            layerOne: 'layerOneRing',
            layerTwo: 'layerTwoRing'
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
        
        // Get pipes from Layer One Ring
        if (this.models.layerOneRing) {
            const layerOnePipes = this.models.layerOneRing.getAllPipes() || [];
            allPipes.push(...layerOnePipes);
        }
        
        // Get pipes from Layer Two Ring
        if (this.models.layerTwoRing) {
            const layerTwoPipes = this.models.layerTwoRing.getAllPipes() || [];
            allPipes.push(...layerTwoPipes);
        }
        
        return allPipes;
    }
    
    /**
     * Get all SingleCUT models across all layers
     * @returns {Object} - Object containing all SingleCUT models by layer
     */
    getAllSingleCuts() {
        return {
            central: [], // Empty as central CUT has been moved out
            layerOne: this.models.layerOneRing ? this.models.layerOneRing.getChildren() : [],
            layerTwo: this.models.layerTwoRing ? this.models.layerTwoRing.getChildren() : []
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