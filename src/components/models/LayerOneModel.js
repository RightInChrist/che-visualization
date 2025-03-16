import { Vector3, Color3, MeshBuilder, StandardMaterial, Axis, Space, Mesh } from '@babylonjs/core';
import { SingleCutModel } from './SingleCutModel';
import { HexagonModel } from './HexagonModel';

/**
 * Creates a Layer One Ring with 6 SingleCUT models arranged in a hexagonal pattern
 * This model has shared panels between adjacent SingleCUTs
 */
export class LayerOneModel extends HexagonModel {
    constructor(scene, position = new Vector3(0, 0, 0), options = {}) {
        // Default options
        const defaultOptions = {
            cornerCount: 6, // Number of corners in the hexagon
            radius: 36.4, // Using outerRadius as the hexagon radius
            singleCutRadius: 21, // Radius for each individual SingleCUT
            debug: false, // Enable/disable debug logging
            showRadiusLines: false, // Whether to show radius lines on the ground
            rotationAngle: 30, // Default rotation angle in degrees (changed from 60 to 30)
            singleCutRotationAngle: 30, // Default rotation angle for all SingleCUT models
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
        
        // Rotation is now handled by the HexagonModel parent class
        this.debugLog(`Layer One Ring model created with radius: ${this.options.radius}, rotation: ${this.options.rotationAngle} degrees`);
    }
    
    /**
     * Create all the SingleCUT models
     */
    createModels() {
        this.debugLog('Creating Layer One Ring model');
        
        // Track permanently hidden elements for scene editor
        this.permanentlyHiddenElements = [];
        
        // Use consistent precision for radius values
        const radius = parseFloat(this.options.radius.toFixed(2));
        const singleCutRadius = parseFloat(this.options.singleCutRadius.toFixed(2));
        
        this.debugLog(`Using radius: ${radius.toFixed(2)}, SingleCUT radius: ${singleCutRadius.toFixed(2)}`);

        // Store distances for verification
        const distances = [];
        
        // Create 6 SingleCUTs in a regular hexagon
        const numModels = this.options.cornerCount;
        
        // IMPORTANT: Setup hidden elements BEFORE creating child models
        this.setupHiddenElements();
        
        // Define initial rotation values for each model based on the provided pattern
        // These are the base rotations for each model
        this.initialRotations = [
            150, // Cut 1
            90,  // Cut 2
            30,  // Cut 3
            330, // Cut 4
            270, // Cut 5
            210  // Cut 6
        ];
        
        // Store the current rotation delta (will be applied on top of initial rotations)
        this.rotationDelta = 0;
        
        // Create a SingleCUT at each corner node position
        for (let i = 0; i < numModels; i++) {
            // Get the position from the cornerNode
            const position = this.cornerNodes[i].position.clone();
            
            // Verify distance from center with consistent precision
            const distanceFromCenter = parseFloat(Vector3.Distance(position, Vector3.Zero()).toFixed(2));
            distances.push(distanceFromCenter);
            
            this.debugLog(`SingleCUT #${i+1}: Using corner node position=(${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)}), ` +
                         `distance=${distanceFromCenter.toFixed(2)}`);
            
            // Get the initial rotation for this SingleCUT
            // Use modulo to handle case where we might have less than 6 models
            const rotationIndex = i % this.initialRotations.length;
            const initialRotation = this.initialRotations[rotationIndex];
            
            this.debugLog(`SingleCUT #${i+1}: initial rotation=${initialRotation}°`);
            
            // Create a SingleCUT with its own panels and rotation angle
            const singleCut = new SingleCutModel(this.scene, position, {
                radius: singleCutRadius,
                rotationAngle: initialRotation,
                parent: this
            });
            
            // Store original rotation value for reference
            singleCut.originalRotation = initialRotation;
            
            // Add to the model children
            this.addChild(singleCut);
        }
        
        // Apply the hiding after all models are created to ensure everything is properly set up
        this.applyHiddenElements();
        
        // Verify that distances match the expected pattern
        this.verifyDistances(distances);
        
        this.debugLog('Layer One Ring model creation complete');
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
        const standardRadiusMaterial = new StandardMaterial("standardRadiusMaterial", this.scene);
        standardRadiusMaterial.diffuseColor = new Color3(0.7, 0.7, 0);
        standardRadiusMaterial.alpha = 0.8;
        standardRadiusMaterial.specularColor = new Color3(0.2, 0.2, 0.2);
        standardRadiusMaterial.emissiveColor = new Color3(0.4, 0.4, 0);
        
        // Create material for SingleCUT internal radius
        const internalRadiusMaterial = new StandardMaterial("internalRadiusMaterial", this.scene);
        internalRadiusMaterial.diffuseColor = new Color3(0.7, 0, 0.7);
        internalRadiusMaterial.alpha = 0.8;
        internalRadiusMaterial.specularColor = new Color3(0.2, 0.2, 0.2);
        internalRadiusMaterial.emissiveColor = new Color3(0.4, 0, 0.4);
        
        // Create circle for the standard radius
        const standardCircle = MeshBuilder.CreateDisc("standardRadiusLine", {
            radius: this.options.radius,
            tessellation: 64,
            sideOrientation: Mesh.DOUBLESIDE
        }, this.scene);
        standardCircle.material = standardRadiusMaterial;
        standardCircle.position.y = heightOffset;
        standardCircle.rotation.x = Math.PI / 2; // Rotate to lie flat
        standardCircle.parent = this.rootNode;
        this.radiusLines.push(standardCircle);
        
        // Create circle for SingleCUT internal radius
        const internalCircle = MeshBuilder.CreateDisc("internalRadiusLine", {
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
        for (let i = 0; i < 6; i++) {
            const angle = (i * 2 * Math.PI) / 6;
            
            const x = this.options.radius * Math.cos(angle);
            const z = this.options.radius * Math.sin(angle);
            
            // Create a line from center to the SingleCUT position
            const line = MeshBuilder.CreateLines("radiusLine_" + i, {
                points: [
                    new Vector3(0, heightOffset * 4, 0),
                    new Vector3(x, heightOffset * 4, z)
                ]
            }, this.scene);
            
            line.color = new Color3(0.7, 0.7, 0); // Yellow for standard cases
            
            line.parent = this.rootNode;
            this.radiusLines.push(line);
        }
        
        this.debugLog('Radius lines created');
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
        this.debugLog(`Updating radius settings - outer: ${outerRadius}, singleCut: ${singleCutRadius}`);
        
        // Store the singleCutRadius
        this.options.singleCutRadius = singleCutRadius;
        
        // Use the parent HexagonModel's updateRadius method to update the main radius
        // This will reposition all cornerNodes
        super.updateRadius(outerRadius);
        
        // First dispose of all existing children
        this.disposeChildren();
        this.clearRadiusLines();
        
        // Recreate all models with new settings
        this.createModels();
        
        // Redraw radius lines
        if (this.options.showRadiusLines) {
            this.drawRadiusLines();
        }
        
        this.debugLog('Radius settings updated and models recreated');
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
        // In the new implementation, we don't hide any elements permanently
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
        this.debugLog(`Setting radius lines visibility to ${visible}`);
        
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
     * Get the default outer radius value for this model
     * @returns {number} - Default outer radius
     */
    getDefaultRadius() {
        return this.options.radius;
    }
    
    /**
     * Get the min outer radius value for this model
     * @returns {number} - Minimum outer radius
     */
    getMinRadius() {
        return 30; // Minimum sensible radius for LayerOne
    }
    
    /**
     * Get the max outer radius value for this model
     * @returns {number} - Maximum outer radius
     */
    getMaxRadius() {
        return 60; // Maximum sensible radius for LayerOne
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
        this.debugLog(`Setting all SingleCUT rotations to ${rotationAngleDegrees} degrees`);
        
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
        // Use the stored value or fall back to a default
        return this.options.singleCutRotationAngle || 30;
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
     * @returns {number} - Distance in meters
     */
    calculatePanelDistance() {
        if (this.childModels && this.childModels.length > 0) {
            return this.childModels[0].calculatePanelDistance();
        }
        // For a regular hexagon, the distance between opposite panels (sides)
        // is outerRadius * √3, not outerRadius * 2 (which would be the distance between opposite corners)
        const distanceBetweenPanels = this.options.radius * Math.sqrt(3);
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

    /**
     * Update all SingleCUT rotations with a delta value applied to their initial rotations
     * @param {number} deltaRotation - The delta rotation in degrees (-180 to 180)
     */
    updateAllSingleCutRotations(deltaRotation) {
        if (!this.childModels || this.childModels.length === 0) {
            this.debugLog('No child models to update rotations for');
            return;
        }
        
        // Store the current rotation delta
        this.rotationDelta = deltaRotation;
        
        console.log(`Updating all SingleCUT rotations with delta: ${deltaRotation}°`);
        
        // Update each child model with its initial rotation + the delta
        this.childModels.forEach((singleCut, i) => {
            if (singleCut && typeof singleCut.updateRotation === 'function') {
                // Get the original rotation value (or use the initialRotations array as fallback)
                const originalRotation = singleCut.originalRotation || this.initialRotations[i % this.initialRotations.length];
                
                // Calculate new rotation by adding delta
                let newRotation = originalRotation + deltaRotation;
                
                // Normalize to 0-360 range
                newRotation = ((newRotation % 360) + 360) % 360;
                
                console.log(`SingleCUT #${i+1}: Updating rotation from ${originalRotation}° to ${newRotation}° (delta: ${deltaRotation}°)`);
                
                // Update the rotation
                singleCut.updateRotation(newRotation);
            }
        });
    }
    
    /**
     * Get min delta rotation value for SingleCUTs
     * @returns {number} - Minimum delta rotation in degrees
     */
    getMinSingleCutDeltaRotation() {
        return -180;
    }
    
    /**
     * Get max delta rotation value for SingleCUTs
     * @returns {number} - Maximum delta rotation in degrees
     */
    getMaxSingleCutDeltaRotation() {
        return 180;
    }
    
    /**
     * Get default delta rotation value for SingleCUTs
     * @returns {number} - Default delta rotation in degrees
     */
    getDefaultSingleCutDeltaRotation() {
        return 0;
    }
    
    /**
     * Get current delta rotation value for SingleCUTs
     * @returns {number} - Current delta rotation in degrees
     */
    getCurrentSingleCutDeltaRotation() {
        return this.rotationDelta || 0;
    }

    /**
     * Setup which elements (pipes and panels) should be permanently hidden for each SingleCUT
     * For LayerOneModel, nothing is permanently hidden by default
     */
    setupHiddenElements() {
        this.debugLog('Setting up permanently hidden elements for SingleCUTs in LayerOneModel');
        
        // Initialize empty hidden elements map
        this.hiddenElementsMap = {};
        
        // In LayerOneModel, we don't hide any elements by default
        // This is just an empty implementation to match the API of LayerTwoModel
    }

    /**
     * Apply hiding to all child model elements based on hidden elements map
     * For LayerOneModel, this is a no-op by default since nothing is hidden
     */
    applyHiddenElements() {
        if (!this.childModels || !this.hiddenElementsMap) {
            return;
        }
        
        this.debugLog('Applying hidden elements to SingleCUTs in LayerOneModel (none by default)');
        
        // This is just an empty implementation to match the API of LayerTwoModel
        // For LayerOneModel, we don't need to hide any elements by default
    }

    /**
     * Verify that the distances follow the expected pattern
     * @param {Array} distances - Array of distances from center
     */
    verifyDistances(distances) {
        if (!distances || distances.length === 0) {
            return;
        }
        
        // Calculate average distance with consistent precision
        const avgDistance = parseFloat((distances.reduce((sum, d) => sum + d, 0) / distances.length).toFixed(2));
        
        let maxDeviation = 0;
        
        // Check deviations from average
        distances.forEach((distance, i) => {
            const deviation = parseFloat(Math.abs(distance - avgDistance).toFixed(2));
            maxDeviation = Math.max(maxDeviation, deviation);
            
            if (deviation > 0.01) { // Use a threshold that matches our precision (0.01)
                this.debugLog(`WARNING: SingleCUT #${i+1} has distance deviation of ${deviation.toFixed(2)} units from average ${avgDistance.toFixed(2)}`);
            }
        });
        
        this.debugLog(`SingleCUTs: average distance ${avgDistance.toFixed(2)}, max deviation ${maxDeviation.toFixed(2)}`);
    }
}

/**
 * Helper function to compute a*b with higher precision
 * to minimize floating point errors
 */
function exactMultiply(a, b) {
    // Perform the multiplication with as much precision as possible
    return parseFloat((a * b).toPrecision(15));
}