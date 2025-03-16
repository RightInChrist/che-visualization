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
            innerRadius: 74, // Add inner radius for alternating pattern
            singleCutRadius: 21, // Radius for each individual SingleCUT
            debug: false, // Enable/disable debug logging
            showRadiusLines: false, // Whether to show radius lines on the ground
            rotationAngle: 60, // Default rotation angle in degrees
            singleCutRotationAngle: 0, // Default rotation angle for all SingleCUT models
        };

        // Call parent constructor
        super(scene, position, { ...defaultOptions, ...options });
        
        // Ensure precision is handled consistently for radius values
        this.options.outerRadius = parseFloat(this.options.outerRadius.toFixed(2));
        this.options.innerRadius = parseFloat(this.options.innerRadius.toFixed(2));
        this.options.singleCutRadius = parseFloat(this.options.singleCutRadius.toFixed(2));
        
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
        this.debugLog('Creating Layer Two Star model with alternating distances');
        
        // Use consistent precision for radius values
        const outerRadius = parseFloat(this.options.outerRadius.toFixed(2));
        const innerRadius = parseFloat(this.options.innerRadius.toFixed(2));
        const singleCutRadius = parseFloat(this.options.singleCutRadius.toFixed(2));
        
        this.debugLog(`Using outer radius: ${outerRadius.toFixed(2)}, inner radius: ${innerRadius.toFixed(2)}, SingleCUT radius: ${singleCutRadius.toFixed(2)}`);

        // Store positions for verification
        const positions = [];
        const distances = [];
        
        // Create 12 SingleCUTs in a regular dodecagon with alternating distances
        const numModels = 12;
        
        // Define initial rotation values for each model based on the provided pattern
        // These are the base rotations for each model
        this.initialRotations = [
            210, // Cut 1
            150, // Cut 2
            150, // Cut 3
            90,  // Cut 4
            90,  // Cut 5
            30,  // Cut 6
            30,  // Cut 7
            330, // Cut 8
            330, // Cut 9
            270, // Cut 10
            270, // Cut 11
            210  // Cut 12
        ];
        
        // Store the current rotation delta (will be applied on top of initial rotations)
        this.rotationDelta = 0;
        
        // Create a dodecagon with alternating distances from center
        for (let i = 0; i < numModels; i++) {
            // Calculate angle with consistent precision
            const angle = parseFloat(((i * 2 * Math.PI) / numModels).toFixed(6));
            
            // Alternate between inner and outer radius
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            
            // Calculate the position with consistent precision
            const x = this.exactMultiply(radius, Math.cos(angle));
            const z = this.exactMultiply(radius, Math.sin(angle));
            
            const position = new Vector3(x, 0, z);
            positions.push(position);
            
            // Verify distance from center with consistent precision
            const distanceFromCenter = parseFloat(Math.sqrt(x * x + z * z).toFixed(2));
            distances.push(distanceFromCenter);
            
            this.debugLog(`SingleCUT #${i+1}: angle=${(angle * 180 / Math.PI).toFixed(2)}°, ` +
                         `radius=${radius.toFixed(2)}, ` +
                         `position=(${x.toFixed(2)}, 0, ${z.toFixed(2)}), ` +
                         `distance=${distanceFromCenter.toFixed(2)}`);
            
            // Get the initial rotation for this SingleCUT
            // Use modulo 12 to handle case where we might have less than 12 models
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
        
        // Verify that distances match the expected pattern
        this.verifyDistances(distances);
        
        this.debugLog('Layer Two Star model creation complete with alternating distances');
    }
    
    /**
     * Verify that the distances follow the expected alternating pattern
     * @param {Array} distances - Array of distances from center
     */
    verifyDistances(distances) {
        // Group distances by inner and outer
        const innerDistances = [];
        const outerDistances = [];
        
        distances.forEach((distance, i) => {
            if (i % 2 === 0) {
                outerDistances.push(distance);
            } else {
                innerDistances.push(distance);
            }
        });
        
        // Calculate average for each group with consistent precision
        const avgInner = parseFloat((innerDistances.reduce((sum, d) => sum + d, 0) / innerDistances.length).toFixed(2));
        const avgOuter = parseFloat((outerDistances.reduce((sum, d) => sum + d, 0) / outerDistances.length).toFixed(2));
        
        let maxInnerDeviation = 0;
        let maxOuterDeviation = 0;
        
        // Check deviations within each group
        innerDistances.forEach((distance, i) => {
            const deviation = parseFloat(Math.abs(distance - avgInner).toFixed(2));
            maxInnerDeviation = Math.max(maxInnerDeviation, deviation);
            
            if (deviation > 0.01) { // Use a threshold that matches our precision (0.01)
                this.debugLog(`WARNING: Inner SingleCUT #${i*2+2} has distance deviation of ${deviation.toFixed(2)} units from average ${avgInner.toFixed(2)}`);
            }
        });
        
        outerDistances.forEach((distance, i) => {
            const deviation = parseFloat(Math.abs(distance - avgOuter).toFixed(2));
            maxOuterDeviation = Math.max(maxOuterDeviation, deviation);
            
            if (deviation > 0.01) { // Use a threshold that matches our precision (0.01)
                this.debugLog(`WARNING: Outer SingleCUT #${i*2+1} has distance deviation of ${deviation.toFixed(2)} units from average ${avgOuter.toFixed(2)}`);
            }
        });
        
        this.debugLog(`Outer SingleCUTs: average distance ${avgOuter.toFixed(2)}, max deviation ${maxOuterDeviation.toFixed(2)}`);
        this.debugLog(`Inner SingleCUTs: average distance ${avgInner.toFixed(2)}, max deviation ${maxInnerDeviation.toFixed(2)}`);
        this.debugLog(`Difference between inner and outer: ${(avgOuter - avgInner).toFixed(2)} units`);
    }
    
    /**
     * Helper function to compute a*b with higher precision
     * to minimize floating point errors
     */
    exactMultiply(a, b) {
        // Ensure input values have consistent precision first
        const preciseA = parseFloat(a.toFixed(2));
        const preciseB = parseFloat(b.toFixed(2));
        
        // Perform the multiplication with high precision 
        const result = preciseA * preciseB;
        
        // Return with consistent precision (15 significant digits, then rounded to 2 decimal places)
        return parseFloat(result.toFixed(2));
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
        
        // Create material for outer radius
        const outerRadiusMaterial = new StandardMaterial("outerRadiusMaterial", this.scene);
        outerRadiusMaterial.diffuseColor = new Color3(0.7, 0.7, 0);
        outerRadiusMaterial.alpha = 0.8;
        outerRadiusMaterial.specularColor = new Color3(0.2, 0.2, 0.2);
        outerRadiusMaterial.emissiveColor = new Color3(0.4, 0.4, 0);
        
        // Create material for inner radius
        const innerRadiusMaterial = new StandardMaterial("innerRadiusMaterial", this.scene);
        innerRadiusMaterial.diffuseColor = new Color3(0.0, 0.7, 0.7);
        innerRadiusMaterial.alpha = 0.8;
        innerRadiusMaterial.specularColor = new Color3(0.2, 0.2, 0.2);
        innerRadiusMaterial.emissiveColor = new Color3(0.0, 0.4, 0.4);
        
        // Create material for SingleCUT internal radius
        const singleCutRadiusMaterial = new StandardMaterial("singleCutRadiusMaterial", this.scene);
        singleCutRadiusMaterial.diffuseColor = new Color3(0.7, 0, 0.7);
        singleCutRadiusMaterial.alpha = 0.8;
        singleCutRadiusMaterial.specularColor = new Color3(0.2, 0.2, 0.2);
        singleCutRadiusMaterial.emissiveColor = new Color3(0.4, 0, 0.4);
        
        // Create circle for the outer radius
        const outerCircle = MeshBuilder.CreateDisc("outerRadiusLine", {
            radius: this.options.outerRadius,
            tessellation: 96,
            sideOrientation: Mesh.DOUBLESIDE
        }, this.scene);
        outerCircle.material = outerRadiusMaterial;
        outerCircle.position.y = heightOffset;
        outerCircle.rotation.x = Math.PI / 2; // Rotate to lie flat
        outerCircle.parent = this.rootNode;
        this.radiusLines.push(outerCircle);
        
        // Create circle for the inner radius
        const innerCircle = MeshBuilder.CreateDisc("innerRadiusLine", {
            radius: this.options.innerRadius,
            tessellation: 96,
            sideOrientation: Mesh.DOUBLESIDE
        }, this.scene);
        innerCircle.material = innerRadiusMaterial;
        innerCircle.position.y = heightOffset * 2;
        innerCircle.rotation.x = Math.PI / 2; // Rotate to lie flat
        innerCircle.parent = this.rootNode;
        this.radiusLines.push(innerCircle);
        
        // Create circle for SingleCUT internal radius
        const singleCutCircle = MeshBuilder.CreateDisc("singleCutRadiusLine", {
            radius: this.options.singleCutRadius,
            tessellation: 96,
            sideOrientation: Mesh.DOUBLESIDE
        }, this.scene);
        singleCutCircle.material = singleCutRadiusMaterial;
        singleCutCircle.position.y = heightOffset * 3; // Slightly above the other circles
        singleCutCircle.rotation.x = Math.PI / 2; // Rotate to lie flat
        singleCutCircle.parent = this.rootNode;
        this.radiusLines.push(singleCutCircle);
        
        // Create radius lines from center to each SingleCUT using exact model positions
        const numModels = 12;
        for (let i = 0; i < numModels; i++) {
            const angle = (i * 2 * Math.PI) / numModels;
            
            // Alternate between inner and outer radius for line color
            const radius = i % 2 === 0 ? this.options.outerRadius : this.options.innerRadius;
            
            // Calculate exact position
            const x = this.exactMultiply(radius, Math.cos(angle));
            const z = this.exactMultiply(radius, Math.sin(angle));
            
            // Create a line from center to the SingleCUT position
            const line = MeshBuilder.CreateLines("radiusLine_" + i, {
                points: [
                    new Vector3(0, heightOffset * 4, 0),
                    new Vector3(x, heightOffset * 4, z)
                ]
            }, this.scene);
            
            // Color based on whether it's inner or outer
            line.color = i % 2 === 0 ? 
                new Color3(0.7, 0.7, 0) :  // Yellow for outer
                new Color3(0.0, 0.7, 0.7); // Cyan for inner
            
            line.parent = this.rootNode;
            this.radiusLines.push(line);
        }
        
        this.debugLog('Radius lines created');
    }
    
    /**
     * Update the model with new radius settings
     * @param {number} outerRadius - New radius for outer SingleCUTs
     * @param {number} singleCutRadius - New radius for each SingleCUT's internal structure
     * @param {number} [innerRadius] - Optional. New radius for inner SingleCUTs. If not provided, 
     *                               it will be calculated as 0.866 * outerRadius.
     */
    updateRadiusSettings(outerRadius, singleCutRadius, innerRadius) {
        // Store the new settings with precision to two decimal places
        this.options.outerRadius = parseFloat(outerRadius.toFixed(2));
        this.options.singleCutRadius = parseFloat(singleCutRadius.toFixed(2));
        
        // Use provided innerRadius or calculate it from outerRadius
        if (innerRadius !== undefined) {
            this.options.innerRadius = parseFloat(innerRadius.toFixed(2));
            this.debugLog(`Updating radius settings - outer: ${this.options.outerRadius}, inner: ${this.options.innerRadius}, singleCut: ${this.options.singleCutRadius}`);
        } else {
            // Calculate new inner radius proportional to outer radius
            this.options.innerRadius = parseFloat((outerRadius * 0.866).toFixed(2)); // Approximately cos(30°)
            this.debugLog(`Updating radius settings - outer: ${this.options.outerRadius}, calculated inner: ${this.options.innerRadius}, singleCut: ${this.options.singleCutRadius}`);
        }
        
        // Recreate model to update positions
        this.disposeChildren();
        this.createModels();
        
        // Clear and redraw radius lines
        this.clearRadiusLines();
        if (this.options.showRadiusLines) {
            this.drawRadiusLines();
        }
        
        this.debugLog('Radius settings updated');
    }
    
    /**
     * Get the default inner radius value for this model
     * @returns {number} - Default inner radius
     */
    getDefaultInnerRadius() {
        return this.options.innerRadius;
    }
    
    /**
     * Get the min inner radius value for this model
     * @returns {number} - Minimum inner radius
     */
    getMinInnerRadius() {
        return 65; // Minimum sensible inner radius for LayerTwoStar
    }
    
    /**
     * Get the max inner radius value for this model
     * @returns {number} - Maximum inner radius
     */
    getMaxInnerRadius() {
        return 100; // Maximum sensible inner radius for LayerTwoStar
    }
    
    /**
     * Update just the inner radius setting
     * @param {number} innerRadius - New radius for inner SingleCUTs
     */
    updateInnerRadius(innerRadius) {
        // Set inner radius with precision to two decimal places
        const preciseInnerRadius = parseFloat(innerRadius.toFixed(2));
        
        this.debugLog(`Updating inner radius to ${preciseInnerRadius} (outer: ${this.options.outerRadius})`);
        
        // Call the main update method with current outer radius and singleCutRadius
        this.updateRadiusSettings(
            this.options.outerRadius,
            this.options.singleCutRadius,
            preciseInnerRadius
        );
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
} 