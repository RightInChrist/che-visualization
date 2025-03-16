import { Vector3 } from '@babylonjs/core';
import { CompositeModel } from './CompositeModel';
import { SingleCutModel } from './SingleCutModel';
import { LayerOneStarModel } from './LayerOneStarModel';
import { LayerTwoStarModel } from './LayerTwoStarModel';

/**
 * StarModel - A composite model containing a central CUT and star-shaped layers
 * Organizes Central CUT, Layer One Star, and Layer Two Star into a single model
 */
export class StarModel extends CompositeModel {
    constructor(scene, position = new Vector3(0, 0, 0), options = {}) {
        // Default options
        const defaultOptions = {
            debug: false,
            visibility: {
                centralCut: true,
                layerOne: true,
                layerTwo: true
            }
        };
        
        // Call parent constructor with merged options
        super(scene, position, { ...defaultOptions, ...options });
        
        // Store model references for direct access
        this.models = {
            centralCut: null,
            layerOneStar: null,
            layerTwoStar: null
        };
        
        // Friendly names for display in SceneEditor
        this.friendlyNames = {
            centralCut: "Star Central CUT",
            layerOneStar: "Layer One Star",
            layerTwoStar: "Layer Two Star"
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
        
        // Create Layer Two Star model
        const layerTwoStar = new LayerTwoStarModel(this.scene, new Vector3(0, 0, 0), {
            parent: this
        });
        layerTwoStar.friendlyName = this.friendlyNames.layerTwoStar;
        this.models.layerTwoStar = layerTwoStar;
        this.addChild(layerTwoStar);
        
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
        
        if (this.models.layerTwoStar) {
            this.models.layerTwoStar.setVisible(visibility.layerTwo);
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
        
        // Get pipes from layer one star
        if (this.models.layerOneStar && typeof this.models.layerOneStar.getAllPipes === 'function') {
            allPipes.push(...this.models.layerOneStar.getAllPipes());
        }
        
        // Get pipes from layer two star
        if (this.models.layerTwoStar && typeof this.models.layerTwoStar.getAllPipes === 'function') {
            allPipes.push(...this.models.layerTwoStar.getAllPipes());
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
            layerOne: this.models.layerOneStar && this.models.layerOneStar.singleCuts ? 
                      this.models.layerOneStar.singleCuts : [],
            layerTwo: this.models.layerTwoStar && this.models.layerTwoStar.singleCuts ? 
                      this.models.layerTwoStar.singleCuts : []
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

    /**
     * Override the setVisible method to add debugging
     * @param {boolean} isVisible - Whether the model should be visible
     */
    setVisible(isVisible) {
        console.log(`StarModel.setVisible(${isVisible}) called`);
        
        // Check rootNode state before setting visibility
        if (this.rootNode) {
            console.log(`StarModel rootNode before: isEnabled=${this.rootNode.isEnabled()}`);
        }
        
        // Call parent class setVisible method
        super.setVisible(isVisible);
        
        // Check rootNode state after setting visibility
        if (this.rootNode) {
            console.log(`StarModel rootNode after: isEnabled=${this.rootNode.isEnabled()}`);
        }
        
        // Make sure all child models get visibility set correctly
        if (this.models.centralCut) {
            console.log(`Setting centralCut visibility to ${isVisible && this.options.visibility.centralCut}`);
            this.models.centralCut.setVisible(isVisible && this.options.visibility.centralCut);
        }
        
        if (this.models.layerOneStar) {
            console.log(`Setting layerOneStar visibility to ${isVisible && this.options.visibility.layerOne}`);
            this.models.layerOneStar.setVisible(isVisible && this.options.visibility.layerOne);
        }
        
        if (this.models.layerTwoStar) {
            console.log(`Setting layerTwoStar visibility to ${isVisible && this.options.visibility.layerTwo}`);
            this.models.layerTwoStar.setVisible(isVisible && this.options.visibility.layerTwo);
            
            // Force verify the Layer Two Star visibility
            if (isVisible && this.options.visibility.layerTwo) {
                const layerTwoVisible = this.models.layerTwoStar.isVisible();
                console.log(`Verified layerTwoStar visibility: ${layerTwoVisible}`);
                
                // If it's not visible but should be, try to force it
                if (!layerTwoVisible) {
                    console.log('Forcing layerTwoStar visibility');
                    this.models.layerTwoStar.setVisible(true);
                    
                    // Double-check that it worked
                    console.log(`Re-verified layerTwoStar visibility: ${this.models.layerTwoStar.isVisible()}`);
                }
            }
        }
        
        console.log(`StarModel.setVisible complete`);
    }
} 