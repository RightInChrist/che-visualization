import { Vector3 } from '@babylonjs/core';
import { CompositeModel } from './CompositeModel';
import { SingleCutModel } from './SingleCutModel';
import { LayerOneStarModel } from './LayerOneStarModel';
import { LayerTwoStarModel } from './LayerTwoStarModel';
import { LayerThreeStarModel } from './LayerThreeStarModel';
import { LayerFourStarModel } from './LayerFourStarModel';

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
            outerRadius: 168.0,       // Outer radius (now matches LayerFourStarModel)
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
     * Create the central SingleCUT model and star layers
     */
    createModels() {
        this.debugLog('Creating Star Model with central CUT and four star layers');
        
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
        
        // Create the Layer One Star with 6 SingleCUTs at corners
        const layerOneStar = new LayerOneStarModel(this.scene, new Vector3(0, 0, 0), {
            singleCutRadius: singleCutRadius,
            cornerRotationAngle: rotationAngle,
            parent: this,
            debug: this.options.debug
        });
        
        // Store reference to the layer one star for direct access
        this.layerOneStar = layerOneStar;
        this.addChild(layerOneStar);
        
        // Create the Layer Two Star with 12 SingleCUTs (6 corners, 6 sides)
        const layerTwoStar = new LayerTwoStarModel(this.scene, new Vector3(0, 0, 0), {
            singleCutRadius: singleCutRadius,
            cornerRotationAngle: rotationAngle,
            sideRotationAngle: rotationAngle,
            parent: this,
            debug: this.options.debug
        });
        
        // Store reference to the layer two star for direct access
        this.layerTwoStar = layerTwoStar;
        this.addChild(layerTwoStar);
        
        // Create the Layer Three Star with 18 SingleCUTs (6 corners, 12 sides)
        const layerThreeStar = new LayerThreeStarModel(this.scene, new Vector3(0, 0, 0), {
            singleCutRadius: singleCutRadius,
            cornerRotationAngle: rotationAngle,
            sideRotationAngle: rotationAngle,
            parent: this,
            debug: this.options.debug
        });
        
        // Store reference to the layer three star for direct access
        this.layerThreeStar = layerThreeStar;
        this.addChild(layerThreeStar);
        
        // Create the Layer Four Star with 24 SingleCUTs (6 corners, 18 sides)
        const layerFourStar = new LayerFourStarModel(this.scene, new Vector3(0, 0, 0), {
            singleCutRadius: singleCutRadius,
            cornerRotationAngle: rotationAngle,
            sideRotationAngle: rotationAngle,
            parent: this,
            debug: this.options.debug
        });
        
        // Store reference to the layer four star for direct access
        this.layerFourStar = layerFourStar;
        this.addChild(layerFourStar);
        
        // Ensure the star components are hidden by default
        centralCut.setVisible(false);
        layerOneStar.setVisible(false);
        layerTwoStar.setVisible(false);
        layerThreeStar.setVisible(false);
        layerFourStar.setVisible(false);
        
        this.debugLog('Star Model creation complete with all four layers');
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
        
        // Propagate to layer two star
        if (this.layerTwoStar && typeof this.layerTwoStar.onRender === 'function') {
            this.layerTwoStar.onRender();
        }
        
        // Propagate to layer three star
        if (this.layerThreeStar && typeof this.layerThreeStar.onRender === 'function') {
            this.layerThreeStar.onRender();
        }
        
        // Propagate to layer four star
        if (this.layerFourStar && typeof this.layerFourStar.onRender === 'function') {
            this.layerFourStar.onRender();
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
        
        // Store default radii for proportional scaling
        const layerOneDefaultRadius = this.layerOneStar ? this.layerOneStar.getDefaultRadius() : 42.0;
        const layerTwoDefaultRadius = this.layerTwoStar ? this.layerTwoStar.getDefaultRadius() : 84.0;
        const layerThreeDefaultRadius = this.layerThreeStar ? this.layerThreeStar.getDefaultRadius() : 126.0;
        const layerFourDefaultRadius = this.layerFourStar ? this.layerFourStar.getDefaultRadius() : 168.0;
        
        // Use proportional scaling if outerRadius differs from default
        const scaleFactor = outerRadius / layerFourDefaultRadius;
        
        // Update layer one star radius
        if (this.layerOneStar) {
            const radius = this.layerOneStar.getRadius();
            if (radius) {
                radius.value = layerOneDefaultRadius * scaleFactor;
            }
        }
        
        // Update layer two star radius
        if (this.layerTwoStar) {
            const radius = this.layerTwoStar.getRadius();
            if (radius) {
                radius.value = layerTwoDefaultRadius * scaleFactor;
            }
        }
        
        // Update layer three star radius
        if (this.layerThreeStar) {
            const radius = this.layerThreeStar.getRadius();
            if (radius) {
                radius.value = layerThreeDefaultRadius * scaleFactor;
            }
        }
        
        // Update layer four star radius
        if (this.layerFourStar) {
            const radius = this.layerFourStar.getRadius();
            if (radius) {
                radius.value = outerRadius;
            }
        }
        
        this.debugLog(`Updated radius settings: outerRadius=${outerRadius}, singleCutRadius=${singleCutRadius}, scaleFactor=${scaleFactor}`);
    }
} 