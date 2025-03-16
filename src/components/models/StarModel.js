import { Vector3 } from '@babylonjs/core';
import { CompositeModel } from './CompositeModel';
import { SingleCutModel } from './SingleCutModel';

/**
 * StarModel - A simplified model with just a central CUT
 */
export class StarModel extends CompositeModel {
    constructor(scene, position = new Vector3(0, 0, 0), options = {}) {
        // Default options
        const defaultOptions = {
            debug: false,
            singleCutRadius: 21,      // Radius for the SingleCUT
            rotationAngle: 30,        // Default rotation angle
            visibility: {
                centralCut: false
            }
        };
        
        // Call parent constructor with merged options
        super(scene, position, { ...defaultOptions, ...options });
        
        // Create the central CUT
        this.createModels();
        
        // Initialize as invisible by default
        this._isVisible = false;
        if (this.rootNode) {
            this.rootNode.setEnabled(false);
        }
    }
    
    /**
     * Create the central SingleCUT model
     */
    createModels() {
        this.debugLog('Creating Star Model with central CUT');
        
        const { singleCutRadius, rotationAngle } = this.options;
        
        // Create the central SingleCUT
        const centralCut = new SingleCutModel(this.scene, new Vector3(0, 0, 0), {
            radius: singleCutRadius,
            rotationAngle: rotationAngle,
            parent: this
        });
        
        // Store reference to the central cut for direct access
        this.centralCut = centralCut;
        this.addChild(centralCut);
        
        // Ensure the central cut is also hidden by default
        centralCut.setVisible(false);
        
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
        
        // Propagate to children - especially important for the central cut
        if (this.centralCut && typeof this.centralCut.onRender === 'function') {
            this.centralCut.onRender();
        }
        
        this.debugLog('Star Model initialization complete');
    }
} 