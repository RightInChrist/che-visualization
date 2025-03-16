import { Vector3 } from '@babylonjs/core';
import { CompositeModel } from './CompositeModel';
import { SingleCutModel } from './SingleCutModel';
import { LayerOneModel } from './LayerOneModel';
import { LayerTwoModel } from './LayerTwoModel';

/**
 * RingModel - A composite model containing a central CUT and ring-shaped layers
 * Organizes Central CUT, Layer One Ring, and Layer Two Ring into a single model
 */
export class RingModel extends CompositeModel {
    constructor(scene, position = new Vector3(0, 0, 0), options = {}) {
        // Default options
        const defaultOptions = {
            debug: false,
            visibility: {
                centralCut: true,
                layerOne: true,
                layerTwo: false
            }
        };
        
        // Call parent constructor with merged options
        super(scene, position, { ...defaultOptions, ...options });
        
        // Store model references for direct access
        this.models = {
            centralCut: null,
            layerOneRing: null,
            layerTwoRing: null
        };
        
        // Friendly names for display in SceneEditor
        this.friendlyNames = {
            centralCut: "Central CUT",
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
        
        // Create Central CUT model
        const centralCut = new SingleCutModel(this.scene, new Vector3(0, 0, 0), {
            parent: this
        });
        centralCut.friendlyName = this.friendlyNames.centralCut;
        this.models.centralCut = centralCut;
        this.addChild(centralCut);
        
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
        if (this.models.centralCut) {
            this.models.centralCut.setVisible(visibility.centralCut);
        }
        
        if (this.models.layerOneRing) {
            this.models.layerOneRing.setVisible(visibility.layerOne);
        }
        
        if (this.models.layerTwoRing) {
            this.models.layerTwoRing.setVisible(visibility.layerTwo);
        }
    }
    
    /**
     * Update the visibility of a specific model
     * @param {string} modelKey - Key of the model to update (centralCut, layerOne, layerTwo)
     * @param {boolean} isVisible - Whether the model should be visible
     */
    updateModelVisibility(modelKey, isVisible) {
        if (this.options.visibility[modelKey] !== undefined) {
            this.options.visibility[modelKey] = isVisible;
            this.setModelVisibility();
        }
    }
    
    /**
     * Gets all pipe models from all layers
     * @returns {Array} - Array of all pipe models
     */
    getAllPipes() {
        const allPipes = [];
        
        // Get pipes from central cut
        if (this.models.centralCut && this.models.centralCut.pipes) {
            allPipes.push(...this.models.centralCut.pipes);
        }
        
        // Get pipes from layer one ring
        if (this.models.layerOneRing && typeof this.models.layerOneRing.getAllPipes === 'function') {
            allPipes.push(...this.models.layerOneRing.getAllPipes());
        }
        
        // Get pipes from layer two ring
        if (this.models.layerTwoRing && typeof this.models.layerTwoRing.getAllPipes === 'function') {
            allPipes.push(...this.models.layerTwoRing.getAllPipes());
        }
        
        return allPipes;
    }
    
    /**
     * Gets all SingleCUT models from all layers
     * @returns {Object} - Object with keys for each layer containing SingleCUT arrays
     */
    getAllSingleCuts() {
        const allSingleCuts = {
            central: this.models.centralCut ? [this.models.centralCut] : [],
            layerOne: this.models.layerOneRing && this.models.layerOneRing.singleCuts ? 
                      this.models.layerOneRing.singleCuts : [],
            layerTwo: this.models.layerTwoRing && this.models.layerTwoRing.singleCuts ? 
                      this.models.layerTwoRing.singleCuts : []
        };
        
        return allSingleCuts;
    }
    
    /**
     * Get a flat array of all models in this composite, including the top level model
     * @returns {Array} - Array of all models
     */
    getAllModels() {
        const models = [this];
        
        Object.values(this.models).forEach(model => {
            if (model) {
                models.push(model);
                
                // If model has SingleCUTs, add them too
                if (model.singleCuts && Array.isArray(model.singleCuts)) {
                    models.push(...model.singleCuts);
                }
            }
        });
        
        return models;
    }
} 