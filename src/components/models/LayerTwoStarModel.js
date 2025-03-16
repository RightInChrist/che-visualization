import { Vector3, Color3, MeshBuilder, StandardMaterial, Axis, Space, Mesh } from '@babylonjs/core';
import { SingleCutModel } from './SingleCutModel';
import { CompositeModel } from './CompositeModel';

/**
 * Creates a Layer Two Star with 12 SingleCUT models arranged in a star-shaped dodecagonal pattern
 * In this model, SingleCUTs only share pipes but maintain their individual panels
 */
export class LayerTwoStarModel extends CompositeModel {
    constructor(scene, position = new Vector3(0, 0, 0), options = {}) {
        // Default options
        const defaultOptions = {
            outerRadius: 85,
            singleCutRadius: 21, // Radius for each individual SingleCUT
            debug: false, // Enable/disable debug logging
            showRadiusLines: false, // Whether to show radius lines on the ground
            rotationAngle: 60, // Default rotation angle in degrees
            singleCutRotationAngle: 0, // Default rotation angle for all SingleCUT models
        };

        // Call parent constructor
        super(scene, position, { ...defaultOptions, ...options });
        
        // Store references to radius visualization elements
        this.radiusLines = [];
        
        // Create the models
        this.createModels();
        
        // Draw radius lines if enabled
        if (this.options.showRadiusLines) {
            this.drawRadiusLines();
        }
        
        // Rotate the entire model by the specified angle around the Y axis
        this.updateRotation(this.options.rotationAngle);
        this.debugLog(`Rotated Layer Two Star by ${this.options.rotationAngle} degrees`);
    }
    
    /**
     * Create all the SingleCUT models
     */
    createModels() {
        this.debugLog('Creating Layer Two Star model');
        
        const starRadius = this.options.outerRadius;
        
        // Create 12 SingleCUTs in a star pattern
        for (let i = 0; i < 12; i++) {
            const angle = (i * 2 * Math.PI) / 12;
            
            // Calculate the position for this SingleCUT
            const x = starRadius * Math.cos(angle);
            const z = starRadius * Math.sin(angle);
            
            const position = new Vector3(x, 0, z);
            
            this.debugLog(`Creating SingleCUT #${i+1} at (${x.toFixed(2)}, 0, ${z.toFixed(2)}) with angle ${(angle * 180 / Math.PI).toFixed(2)}°`);
            
            // Create SingleCUT with rotation pointing outward from center
            // This is achieved by setting the rotation to the angle from the center plus 180 degrees (or Math.PI radians)
            // to make it point outward rather than inward
            const rotationAngle = this.options.singleCutRotationAngle;
            
            // Create the SingleCUT model
            const singleCut = new SingleCutModel(this.scene, position, {
                radius: this.options.singleCutRadius,
                rotationAngle: rotationAngle,
                skipPanels: false, // Star model has individual panels for each SingleCUT
                parent: this
            });
            
            // Add to the model children
            this.addChild(singleCut);
        }
        
        this.debugLog('Layer Two Star model creation complete');
    }
    
    /**
     * Draw lines on the ground to visualize the radius measurements
     */
    drawRadiusLines() {
        this.debugLog('Drawing radius lines on ground');
        
        // Clean up existing lines
        this.clearRadiusLines();
        
        // Height offset to place slightly above ground
        const heightOffset = 0.05;
        
        // Create material for standard radius
        const standardRadiusMaterial = new StandardMaterial("starRadiusMaterial", this.scene);
        standardRadiusMaterial.diffuseColor = new Color3(0.8, 0.4, 0);
        standardRadiusMaterial.alpha = 0.8;
        standardRadiusMaterial.specularColor = new Color3(0.2, 0.2, 0.2);
        standardRadiusMaterial.emissiveColor = new Color3(0.4, 0.2, 0);
        
        // Create material for SingleCUT internal radius
        const internalRadiusMaterial = new StandardMaterial("starInternalRadiusMaterial", this.scene);
        internalRadiusMaterial.diffuseColor = new Color3(0.7, 0, 0.7);
        internalRadiusMaterial.alpha = 0.8;
        internalRadiusMaterial.specularColor = new Color3(0.2, 0.2, 0.2);
        internalRadiusMaterial.emissiveColor = new Color3(0.4, 0, 0.4);
        
        // Create circle for the standard radius
        const standardCircle = MeshBuilder.CreateDisc("starRadiusLine", {
            radius: this.options.outerRadius,
            tessellation: 64,
            sideOrientation: Mesh.DOUBLESIDE
        }, this.scene);
        standardCircle.material = standardRadiusMaterial;
        standardCircle.position.y = heightOffset;
        standardCircle.rotation.x = Math.PI / 2; // Rotate to lie flat
        standardCircle.parent = this.rootNode;
        this.radiusLines.push(standardCircle);
        
        // Create circle for SingleCUT internal radius
        const internalCircle = MeshBuilder.CreateDisc("starInternalRadiusLine", {
            radius: this.options.singleCutRadius,
            tessellation: 64,
            sideOrientation: Mesh.DOUBLESIDE
        }, this.scene);
        internalCircle.material = internalRadiusMaterial;
        internalCircle.position.y = heightOffset * 3; // Slightly above the other circles
        internalCircle.rotation.x = Math.PI / 2; // Rotate to lie flat
        internalCircle.parent = this.rootNode;
        this.radiusLines.push(internalCircle);
        
        // Create radius lines from center to each SingleCUT
        for (let i = 0; i < 12; i++) {
            const angle = (i * 2 * Math.PI) / 12;
            
            const x = this.options.outerRadius * Math.cos(angle);
            const z = this.options.outerRadius * Math.sin(angle);
            
            // Create a line from center to the SingleCUT position
            const line = MeshBuilder.CreateLines("starRadiusLine_" + i, {
                points: [
                    new Vector3(0, heightOffset * 4, 0),
                    new Vector3(x, heightOffset * 4, z)
                ]
            }, this.scene);
            
            line.color = new Color3(0.8, 0.4, 0); // Orange for star cases
            
            line.parent = this.rootNode;
            this.radiusLines.push(line);
        }
        
        this.debugLog('Star radius lines created');
    }
    
    /**
     * Clear all radius visualization lines
     */
    clearRadiusLines() {
        if (this.radiusLines && this.radiusLines.length > 0) {
            this.radiusLines.forEach(line => {
                if (line && typeof line.dispose === 'function') {
                    line.dispose();
                }
            });
            this.radiusLines = [];
        }
    }
    
    /**
     * Update the model with new radius settings
     * @param {number} outerRadius - New radius for outer SingleCUTs
     * @param {number} singleCutRadius - New radius for each SingleCUT's internal structure
     */
    updateRadiusSettings(outerRadius, singleCutRadius) {
        this.debugLog(`Updating star radius settings - outer: ${outerRadius}, singleCut: ${singleCutRadius}`);
        
        // Store the new settings
        this.options.outerRadius = outerRadius;
        this.options.singleCutRadius = singleCutRadius;
        
        // First dispose of all existing children
        this.disposeChildren();
        this.clearRadiusLines();
        
        // Recreate all models with new settings
        this.createModels();
        
        // Redraw radius lines
        if (this.options.showRadiusLines) {
            this.drawRadiusLines();
        }
        
        this.debugLog('Star radius settings updated and models recreated');
    }
    
    /**
     * Dispose child models
     */
    disposeChildren() {
        // Dispose all child models directly
        if (this.childModels && Array.isArray(this.childModels)) {
            this.childModels.forEach(child => {
                if (child && typeof child.dispose === 'function') {
                    child.dispose();
                }
            });
        }
        
        // Reset child models array
        this.childModels = [];
    }
    
    /**
     * Check if a specific element is permanently hidden
     * @param {number} modelIndex - Index of the SingleCUT model
     * @param {string} type - Type of element ('pipe' or 'panel')
     * @param {number} index - Index of the element within the model
     * @returns {boolean} - Whether the element is permanently hidden
     */
    isElementPermanentlyHidden(modelIndex, type, index) {
        // No elements are permanently hidden in the star model
        return false;
    }
    
    /**
     * Gets all pipes from all SingleCUTs
     * @returns {Array} - Array of all pipes from all SingleCUTs
     */
    getAllPipes() {
        const allPipes = [];
        const singleCuts = this.getChildren();
        
        singleCuts.forEach(singleCut => {
            if (singleCut.pipes) {
                allPipes.push(...singleCut.pipes);
            }
        });
        
        return allPipes;
    }
    
    /**
     * Provides access to all SingleCUT models
     * @returns {Array} - Array of all SingleCUT models
     */
    get singleCuts() {
        // Simply return the childModels array from CompositeModel
        return this.childModels;
    }
    
    /**
     * Set visibility of radius lines
     * @param {boolean} visible - Whether to show the radius lines
     */
    setRadiusLinesVisible(visible) {
        this.debugLog(`Setting star radius lines visibility to ${visible}`);
        
        // Update options
        this.options.showRadiusLines = visible;
        
        // If visible, make sure lines exist
        if (visible && (!this.radiusLines || this.radiusLines.length === 0)) {
            this.drawRadiusLines();
        }
        
        // Set visibility
        if (this.radiusLines && this.radiusLines.length > 0) {
            this.radiusLines.forEach(line => {
                if (line) {
                    line.setEnabled(visible);
                    if (typeof line.setVisible === 'function') {
                        line.setVisible(visible);
                    } else if (line.isVisible !== undefined) {
                        line.isVisible = visible;
                    }
                }
            });
        }
        
        // If not visible, clean up lines to save memory
        if (!visible) {
            this.clearRadiusLines();
        }
    }
    
    /**
     * Update rotation of the entire model
     * @param {number} rotationAngleDegrees - Rotation angle in degrees
     */
    updateRotation(rotationAngleDegrees) {
        // Convert to radians
        const rotationAngle = (rotationAngleDegrees * Math.PI) / 180;
        
        // Update root node rotation
        this.rootNode.rotation = new Vector3(0, rotationAngle, 0);
        
        // Store the current angle
        this.options.rotationAngle = rotationAngleDegrees;
        
        // Update all SingleCUT rotations to match their own internal rotation
        if (this.childModels && this.childModels.length > 0) {
            this.childModels.forEach(singleCut => {
                if (singleCut && typeof singleCut.updateRotation === 'function') {
                    // Each SingleCut model maintains its own rotation, 
                    // independent of the parent model rotation
                    singleCut.updateRotation(singleCut.options.rotationAngle);
                }
            });
        }
    }
    
    /**
     * Get the default outer radius value for this model
     * @returns {number} - Default outer radius
     */
    getDefaultRadius() {
        return this.options.outerRadius;
    }
    
    /**
     * Get the min outer radius value for this model
     * @returns {number} - Minimum outer radius
     */
    getMinRadius() {
        return 60; // Minimum sensible radius for LayerTwo Star
    }
    
    /**
     * Get the max outer radius value for this model
     * @returns {number} - Maximum outer radius
     */
    getMaxRadius() {
        return 120; // Maximum sensible radius for LayerTwo Star
    }
    
    /**
     * Get the default SingleCut radius value for this model
     * @returns {number} - Default SingleCut radius
     */
    getDefaultSingleCutRadius() {
        return this.options.singleCutRadius;
    }
    
    /**
     * Get the min SingleCut radius value for this model
     * @returns {number} - Minimum SingleCut radius
     */
    getMinSingleCutRadius() {
        return 10; // Minimum sensible SingleCut radius
    }
    
    /**
     * Get the max SingleCut radius value for this model
     * @returns {number} - Maximum SingleCut radius
     */
    getMaxSingleCutRadius() {
        return 30; // Maximum sensible SingleCut radius
    }
    
    /**
     * Get the default rotation value for this model
     * @returns {number} - Default rotation in degrees
     */
    getDefaultRotation() {
        return this.options.rotationAngle;
    }
    
    /**
     * Get the min rotation value for this model
     * @returns {number} - Minimum rotation in degrees
     */
    getMinRotation() {
        return 0;
    }
    
    /**
     * Get the max rotation value for this model
     * @returns {number} - Maximum rotation in degrees
     */
    getMaxRotation() {
        return 360;
    }
    
    /**
     * Get all SingleCUT child models
     * @returns {Array} - Array of SingleCUT models
     */
    getChildren() {
        // Use the parent class implementation from CompositeModel
        return super.getChildren();
    }
    
    /**
     * Update the rotation of all child SingleCUT models to the same value
     * @param {number} rotationAngleDegrees - New rotation angle in degrees for all SingleCUTs
     */
    updateAllSingleCutRotations(rotationAngleDegrees) {
        this.debugLog(`Setting all SingleCUT rotations in Star model to ${rotationAngleDegrees} degrees`);
        
        // Store this as the common SingleCUT rotation value
        this.options.singleCutRotationAngle = rotationAngleDegrees;
        
        // Update all child SingleCUT models
        if (this.childModels && this.childModels.length > 0) {
            this.childModels.forEach(singleCut => {
                if (singleCut && typeof singleCut.updateRotation === 'function') {
                    singleCut.updateRotation(rotationAngleDegrees);
                }
            });
        }
    }
    
    /**
     * Get the default SingleCut rotation value for all child models
     * @returns {number} - Default SingleCut rotation in degrees
     */
    getDefaultSingleCutRotation() {
        return this.options.singleCutRotationAngle || 0;
    }
    
    /**
     * Get the min SingleCut rotation value
     * @returns {number} - Minimum SingleCut rotation in degrees
     */
    getMinSingleCutRotation() {
        return 0;
    }
    
    /**
     * Get the max SingleCut rotation value
     * @returns {number} - Maximum SingleCut rotation in degrees
     */
    getMaxSingleCutRotation() {
        return 360;
    }
    
    /**
     * Calculate the distance between opposite panels for the full model
     * Since this is a star model, we estimate the average panel distance
     * @returns {number} - Distance in meters
     */
    calculatePanelDistance() {
        // For a regular dodecagon, the distance between opposite panels (sides)
        // is outerRadius * 2 * cos(π/12)
        const distanceBetweenPanels = this.options.outerRadius * 2 * Math.cos(Math.PI / 12);
        return distanceBetweenPanels;
    }
    
    /**
     * Check if the model is visible
     * @returns {boolean} - Whether the model is visible
     */
    isVisible() {
        // Check root node visibility first
        if (this.rootNode) {
            return this.rootNode.isEnabled();
        }
        return false;
    }
} 