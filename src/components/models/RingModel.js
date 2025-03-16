import { Vector3 } from '@babylonjs/core';
import { CompositeModel } from './CompositeModel';
import { SingleCutModel } from './SingleCutModel';
import { LayerOneRingModel } from './LayerOneRingModel';
import { LayerTwoRingModel } from './LayerTwoRingModel';
import { LayerThreeRingModel } from './LayerThreeRingModel';
import { LayerFourRingModel } from './LayerFourRingModel';
import { LayerFiveRingModel } from './LayerFiveRingModel';

/**
 * RingModel - A model with a central CUT and five rings of SingleCUTs
 */
export class RingModel extends CompositeModel {
    constructor(scene, position = new Vector3(0, 0, 0), options = {}) {
        // Default options
        const defaultOptions = {
            debug: false,
            singleCutRadius: 21,    // Radius for the SingleCUT
            rotationAngle: 30,      // Default rotation angle
            visibility: {
                ring: true
            }
        };
        
        // Call parent constructor with merged options
        super(scene, position, { ...defaultOptions, ...options });
        
        // Create the models
        this.createModels();
    }
    
    /**
     * Create the central SingleCUT model and layer rings
     */
    createModels() {
        this.debugLog('Creating Ring Model with central CUT and outer rings');
        
        const { singleCutRadius, rotationAngle } = this.options;
        
        // Create a central SingleCUT
        const centralCut = new SingleCutModel(this.scene, new Vector3(0, 0, 0), {
            radius: singleCutRadius,
            rotationAngle: rotationAngle,
            parent: this,
            debug: this.options.debug
        });
        
        // Store reference to the central cut for direct access
        this.centralCut = centralCut;
        this.addChild(centralCut);
        
        // Create the Layer One Ring with 6 SingleCUTs at corners
        const layerOneRing = new LayerOneRingModel(this.scene, new Vector3(0, 0, 0), {
            singleCutRadius: singleCutRadius,
            cornerRotationAngle: rotationAngle,
            parent: this,
            debug: this.options.debug
        });
        
        // Store reference to the layer one ring for direct access
        this.layerOneRing = layerOneRing;
        this.addChild(layerOneRing);

        // Create the Layer Two Ring with 12 SingleCUTs (6 corners, 6 sides)
        const layerTwoRing = new LayerTwoRingModel(this.scene, new Vector3(0, 0, 0), {
            singleCutRadius: singleCutRadius,
            cornerRotationAngle: rotationAngle,
            sideRotationAngle: rotationAngle,
            parent: this,
            debug: this.options.debug
        });
        
        // Store reference to the layer two ring for direct access
        this.layerTwoRing = layerTwoRing;
        this.addChild(layerTwoRing);
        
        // Create the Layer Three Ring with 18 SingleCUTs (6 corners, 12 sides)
        const layerThreeRing = new LayerThreeRingModel(this.scene, new Vector3(0, 0, 0), {
            singleCutRadius: singleCutRadius,
            cornerRotationAngle: rotationAngle,
            sideRotationAngle: rotationAngle,
            parent: this,
            debug: this.options.debug
        });
        
        // Store reference to the layer three ring for direct access
        this.layerThreeRing = layerThreeRing;
        this.addChild(layerThreeRing);
        
        // Create the Layer Four Ring with 24 SingleCUTs (6 corners, 18 sides)
        const layerFourRing = new LayerFourRingModel(this.scene, new Vector3(0, 0, 0), {
            singleCutRadius: singleCutRadius,
            cornerRotationAngle: rotationAngle,
            sideRotationAngle: rotationAngle,
            parent: this,
            debug: this.options.debug
        });
        
        // Store reference to the layer four ring for direct access
        this.layerFourRing = layerFourRing;
        this.addChild(layerFourRing);
        
        // Create the Layer Five Ring with 30 SingleCUTs (6 corners, 24 sides)
        const layerFiveRing = new LayerFiveRingModel(this.scene, new Vector3(0, 0, 0), {
            singleCutRadius: singleCutRadius,
            cornerRotationAngle: rotationAngle,
            sideRotationAngle: rotationAngle,
            parent: this,
            debug: this.options.debug
        });
        
        // Store reference to the layer five ring for direct access
        this.layerFiveRing = layerFiveRing;
        this.addChild(layerFiveRing);
        
        this.debugLog('Ring Model creation complete');
    }

    /**
     * Override getName to return "Ring"
     * @returns {string} The display name for this model
     */
    getName() {
        return "Ring";
    }

    /**
     * Model initialization method called after scene setup
     * Ensures the model and its children are properly initialized
     */
    onRender() {
        this.debugLog('Initializing Ring Model');
        
        // Apply any Ring-specific initialization here
        
        // Propagate to central cut
        if (this.centralCut && typeof this.centralCut.onRender === 'function') {
            this.centralCut.onRender();
        }
        
        // Propagate to layer one ring
        if (this.layerOneRing && typeof this.layerOneRing.onRender === 'function') {
            this.layerOneRing.onRender();
        }

        // Propagate to layer two ring
        if (this.layerTwoRing && typeof this.layerTwoRing.onRender === 'function') {
            this.layerTwoRing.onRender();
        }
        
        // Propagate to layer three ring
        if (this.layerThreeRing && typeof this.layerThreeRing.onRender === 'function') {
            this.layerThreeRing.onRender();
        }
        
        // Propagate to layer four ring
        if (this.layerFourRing && typeof this.layerFourRing.onRender === 'function') {
            this.layerFourRing.onRender();
        }
        
        // Propagate to layer five ring
        if (this.layerFiveRing && typeof this.layerFiveRing.onRender === 'function') {
            this.layerFiveRing.onRender();
        }
        
        this.debugLog('Ring Model initialization complete');
    }
    
    /**
     * Update radius settings for the model and its children
     * @param {number} outerRadius - The outer radius for the ring
     * @param {number} singleCutRadius - The radius for individual SingleCUTs
     */
    updateRadiusSettings(outerRadius, singleCutRadius) {
        this.options.singleCutRadius = singleCutRadius;
        
        // Calculate proportional radiuses based on the outerRadius (layer five radius)
        const layerOneDefaultRadius = this.layerOneRing ? this.layerOneRing.getDefaultRadius() : 36.4;
        const layerTwoDefaultRadius = this.layerTwoRing ? this.layerTwoRing.getDefaultRadius() : 72.8;
        const layerThreeDefaultRadius = this.layerThreeRing ? this.layerThreeRing.getDefaultRadius() : 109.2;
        const layerFourDefaultRadius = this.layerFourRing ? this.layerFourRing.getDefaultRadius() : 145.6;
        const layerFiveDefaultRadius = this.layerFiveRing ? this.layerFiveRing.getDefaultRadius() : 182.0;
        
        // Use proportional scaling if outerRadius differs from default
        const scaleFactor = outerRadius / layerFiveDefaultRadius;
        
        // Update layer one ring radius
        if (this.layerOneRing) {
            const layerOneRadius = this.layerOneRing.getRadius();
            if (layerOneRadius) {
                layerOneRadius.value = layerOneDefaultRadius * scaleFactor;
            }
        }

        // Update layer two ring radius
        if (this.layerTwoRing) {
            const layerTwoRadius = this.layerTwoRing.getRadius();
            if (layerTwoRadius) {
                layerTwoRadius.value = layerTwoDefaultRadius * scaleFactor;
            }
        }
        
        // Update layer three ring radius
        if (this.layerThreeRing) {
            const layerThreeRadius = this.layerThreeRing.getRadius();
            if (layerThreeRadius) {
                layerThreeRadius.value = layerThreeDefaultRadius * scaleFactor;
            }
        }
        
        // Update layer four ring radius
        if (this.layerFourRing) {
            const layerFourRadius = this.layerFourRing.getRadius();
            if (layerFourRadius) {
                layerFourRadius.value = layerFourDefaultRadius * scaleFactor;
            }
        }
        
        // Update layer five ring radius
        if (this.layerFiveRing) {
            const layerFiveRadius = this.layerFiveRing.getRadius();
            if (layerFiveRadius) {
                layerFiveRadius.value = outerRadius;
            }
        }
        
        this.debugLog(`Updated radius settings: outerRadius=${outerRadius}, singleCutRadius=${singleCutRadius}, scaleFactor=${scaleFactor}`);
    }
} 