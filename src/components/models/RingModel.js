import { Vector3 } from '@babylonjs/core';
import { CompositeModel } from './CompositeModel';
import { SingleCutModel } from './SingleCutModel';
import { LayerOneRingModel } from './LayerOneRingModel';
import { LayerTwoRingModel } from './LayerTwoRingModel';

/**
 * RingModel - A model with a central CUT and two rings of SingleCUTs
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
        
        // Create the Layer One Ring with 6 SingleCUTs
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
        
        this.debugLog('Ring Model initialization complete');
    }
    
    /**
     * Update radius settings for the model and its children
     * @param {number} outerRadius - The outer radius for the ring
     * @param {number} singleCutRadius - The radius for individual SingleCUTs
     */
    updateRadiusSettings(outerRadius, singleCutRadius) {
        this.options.singleCutRadius = singleCutRadius;
        
        // Update layer one ring radius - keep default radius for layer one
        if (this.layerOneRing) {
            const layerOneRadius = this.layerOneRing.getRadius();
            if (layerOneRadius) {
                layerOneRadius.value = this.layerOneRing.getDefaultRadius();
            }
        }

        // Update layer two ring radius - use the provided outer radius
        if (this.layerTwoRing) {
            const layerTwoRadius = this.layerTwoRing.getRadius();
            if (layerTwoRadius) {
                layerTwoRadius.value = outerRadius;
            }
        }
        
        this.debugLog(`Updated radius settings: outerRadius=${outerRadius}, singleCutRadius=${singleCutRadius}`);
    }
} 