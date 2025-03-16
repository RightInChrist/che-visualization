import { Vector3 } from '@babylonjs/core';
import { CompositeModel } from './CompositeModel';
import { SingleCutModel } from './SingleCutModel';
import { LayerOneStarModel } from './LayerOneStarModel';

/**
 * StarModel - A model with a central CUT and outer star rings
 */
export class StarModel extends CompositeModel {
    constructor(scene, position = new Vector3(0, 0, 0), options = {}) {
        // Default options
        const defaultOptions = {
            debug: false,
            singleCutRadius: 21,      // Radius for the SingleCUT
            rotationAngle: 0,         // Default rotation angle for star (different from ring)
            outerRadius: 72.52,       // Outer radius
            visibility: {
                centralCut: true,
                outerRing: true
            }
        };
        
        // Call parent constructor with merged options
        super(scene, position, { ...defaultOptions, ...options });
        
        // Create the models
        this.createModels();
        
        // Initialize as invisible by default
        this._isVisible = false;
        if (this.rootNode) {
            this.rootNode.setEnabled(false);
        }
    }
    
    /**
     * Create the central SingleCUT model and layer one star
     */
    createModels() {
        this.debugLog('Creating Star Model with central CUT and outer star');
        
        const { singleCutRadius, rotationAngle, outerRadius } = this.options;
        
        // Create the central SingleCUT
        const centralCut = new SingleCutModel(this.scene, new Vector3(0, 0, 0), {
            radius: singleCutRadius,
            rotationAngle: rotationAngle,
            parent: this,
            debug: this.options.debug
        });
        
        // Store reference to the central cut for direct access
        this.centralCut = centralCut;
        this.addChild(centralCut);
        
        // Create the Layer One Star with 6 SingleCUTs
        const layerOneStar = new LayerOneStarModel(this.scene, new Vector3(0, 0, 0), {
            singleCutRadius: singleCutRadius,
            cornerRotationAngle: rotationAngle,
            parent: this,
            debug: this.options.debug
        });
        
        // Store reference to the layer one star for direct access
        this.layerOneStar = layerOneStar;
        this.addChild(layerOneStar);
        
        // Ensure the star components are hidden by default
        centralCut.setVisible(false);
        layerOneStar.setVisible(false);
        
        this.debugLog('Star Model creation complete');
    }

    /**
     * Override getName to return "Star"
     * @returns {string} The display name for this model
     */
    getName() {
        return "Star";
    }
 
    /**
     * Model initialization method called after scene setup
     * Ensures the model and its children are properly initialized
     */
    onRender() {
        this.debugLog('Initializing Star Model');
        
        // Apply any Star-specific initialization here
        
        // Propagate to central cut
        if (this.centralCut && typeof this.centralCut.onRender === 'function') {
            this.centralCut.onRender();
        }
        
        // Propagate to layer one star
        if (this.layerOneStar && typeof this.layerOneStar.onRender === 'function') {
            this.layerOneStar.onRender();
        }
        
        this.debugLog('Star Model initialization complete');
    }
    
    /**
     * Update radius settings for the model and its children
     * @param {number} outerRadius - The outer radius for the star
     * @param {number} singleCutRadius - The radius for individual SingleCUTs
     */
    updateRadiusSettings(outerRadius, singleCutRadius) {
        this.options.outerRadius = outerRadius;
        this.options.singleCutRadius = singleCutRadius;
        
        // Update layer one star radius
        if (this.layerOneStar) {
            const radius = this.layerOneStar.getRadius();
            if (radius) {
                radius.value = outerRadius * 0.55; // Scale the layerOne radius proportionally
            }
        }
        
        this.debugLog(`Updated radius settings: outerRadius=${outerRadius}, singleCutRadius=${singleCutRadius}`);
    }
} 