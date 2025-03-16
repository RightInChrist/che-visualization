import { Vector3, Color3, MeshBuilder, StandardMaterial, Axis, Space, Mesh } from '@babylonjs/core';
import { SingleCutModel } from './SingleCutModel';
import { HexagonModel } from './HexagonModel';

/**
 * Creates a Layer Two Ring with 12 SingleCUT models arranged in a dodecagonal (12-sided) pattern
 * This model has shared panels between adjacent SingleCUTs, with an alternating distance pattern
 */
export class LayerTwoModel extends HexagonModel {
    constructor(scene, position = new Vector3(0, 0, 0), options = {}) {
        // Default options
        const defaultOptions = {
            cornerCount: 12, // 12-sided polygon
            radius: 72.52, // Using outerRadius as the hexagon radius (updated to 72.7 as requested)
            innerRadius: 63.02, // Inner radius for alternating pattern
            singleCutRadius: 21, // Radius for each individual SingleCUT
            debug: false, // Enable/disable debug logging
            showRadiusLines: false, // Whether to show radius lines on the ground
            rotationAngle: 30, // Default rotation angle in degrees
            singleCutRotationAngle: 30, // Default rotation angle for all SingleCUT models
        };

        // Call parent constructor
        super(scene, position, { ...defaultOptions, ...options });
        
        // Ensure precision is handled consistently for radius values
        this.options.innerRadius = parseFloat(this.options.innerRadius.toFixed(2));
        this.options.singleCutRadius = parseFloat(this.options.singleCutRadius.toFixed(2));
        
        // Store references to radius visualization elements
        this.radiusLines = [];
        
        // Debugging state for reposition tracking
        this.repositionAttempts = 0;
        this.firstRepositionTime = null;
        this.lastRepositionTime = null;
        this.successfulRepositions = 0;
        this.positionChangeThreshold = 0.001; // Minimum change to consider a reposition "worked"
        this.positionChangeHistory = []; // Track changes over time
        
        // Track if initial creation phase is complete
        this.initializationComplete = false;
        
        // Create the models
        this.createModels();
        
        // Ensure consistent positioning using the same logic as radius updates
        // This guarantees that all model positions use the exact same calculation
        this.updateChildPositions();
        
        // Draw radius lines if enabled
        if (this.options.showRadiusLines) {
            this.drawRadiusLines();
        }
        
        // Rotation is now handled by the HexagonModel parent class
        this.debugLog(`Layer Two Ring model created with radius: ${this.options.radius}, inner radius: ${this.options.innerRadius}`);
        
        // Mark initialization as complete
        this.initializationComplete = true;
        this.debugLog('LayerTwoModel initialization complete');
        
        // Use guaranteedRefresh to ensure all visual elements are properly positioned at startup
        // This forces Babylon.js to properly update the scene
        setTimeout(() => {
            console.log("Applying guaranteed refresh during initialization...");
            this.guaranteedRefresh();
        }, 100);
    }
    
    /**
     * Create all the SingleCUT models
     */
    createModels() {
        this.debugLog('Creating Layer Two Ring model with alternating distances');
        
        // Track permanently hidden elements for scene editor
        this.permanentlyHiddenElements = [];
        
        // Use consistent precision for radius values
        const outerRadius = parseFloat(this.options.radius.toFixed(2));
        const innerRadius = parseFloat(this.options.innerRadius.toFixed(2));
        const singleCutRadius = parseFloat(this.options.singleCutRadius.toFixed(2));
        
        this.debugLog(`Using outer radius: ${outerRadius.toFixed(2)}, inner radius: ${innerRadius.toFixed(2)}, SingleCUT radius: ${singleCutRadius.toFixed(2)}`);

        // Store distances for verification
        const distances = [];
        
        // Create 12 SingleCUTs in an alternating pattern
        const numModels = this.options.cornerCount;
        
        // IMPORTANT: Setup hidden elements BEFORE creating child models
        this.setupHiddenElements();
        
        // Define initial rotation values for each model in a 12-unit circle
        // These are angles relative to each position, specific to each SingleCUT
        // Note: These are now calculated based on the position rather than hardcoded
        this.initialRotations = Array(numModels).fill(0).map((_, i) => {
            // Calculate rotation based on position around the circle
            // For 12-sided polygon, each position is 30 degrees apart (360/12)
            // To have models face outward, they should face 90 degrees offset from their angle
            const positionAngle = i * (360 / numModels);
            const rotationAngle = (positionAngle + 90) % 360;
            return rotationAngle;
        });
        
        // Store the current rotation delta (will be applied on top of initial rotations)
        this.rotationDelta = 0;
        
        // Create models at positions alternating between outer and inner radius
        for (let i = 0; i < numModels; i++) {
            // Use cornerNodes positions as reference points
            const basePosition = this.cornerNodes[i].position.clone();
            
            // Decide radius based on alternating pattern
            const useInnerRadius = i % 2 === 1; // Odd indices use inner radius
            const currentRadius = useInnerRadius ? innerRadius : outerRadius;
            
            // Scale the position to the desired radius
            // We'll calculate a normalized direction vector from origin to the corner
            // Then multiply by the desired radius
            const direction = basePosition.normalize();
            const position = direction.scale(currentRadius);
            
            // Verify distance from center with consistent precision
            const distanceFromCenter = parseFloat(Vector3.Distance(position, Vector3.Zero()).toFixed(2));
            distances.push(distanceFromCenter);
            
            this.debugLog(`SingleCUT #${i+1}: Using ${useInnerRadius ? 'inner' : 'outer'} radius position=(${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)}), ` +
                         `distance=${distanceFromCenter.toFixed(2)}`);
            
            // Get the initial rotation for this SingleCUT from the calculated array
            const initialRotation = this.initialRotations[i];
            
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
        
        this.debugLog('Layer Two Ring model creation complete');
    }
    
    /**
     * Setup which elements (pipes and panels) should be permanently hidden for each SingleCUT
     * This defines the pattern of hidden elements to create a clean aesthetic
     */
    setupHiddenElements() {
        this.debugLog('Setting up hidden elements map (no elements will be hidden)');
        
        // Define hidden elements mapping
        // Format: modelIndex (0-based) => { pipes: [indices to hide], panels: [indices to hide] }
        this.hiddenElementsMap = {};
        
        // Empty arrays since we don't want to hide any pipes or panels
        const hiddenPipes = [];  // No pipes to hide
        const hiddenPanels = []; // No panels to hide
        
        // Apply empty hiding pattern to all SingleCUTs
        for (let i = 0; i < 12; i++) {
            this.hiddenElementsMap[i] = {
                pipes: hiddenPipes,
                panels: hiddenPanels
            };
            
            this.debugLog(`SingleCUT #${i+1}: No hidden pipes or panels`);
        }
    }
    
    /**
     * Apply hiding to elements based on hidden elements map
     * This method is now configured to not hide any elements since we want to show all pipes and panels
     */
    applyHiddenElements() {
        if (!this.childModels || !this.hiddenElementsMap) {
            return;
        }
        
        console.log("No elements are being hidden - all pipes and panels will be visible");
        
        // Since we're not hiding any elements, this is mostly a placeholder method
        // The hiddenElementsMap now contains empty arrays for pipes and panels
        
        // In case any elements were previously hidden, we could re-enable them here
        // But for now, we'll just log that all elements should be visible
        this.debugLog('All pipes and panels are set to be visible');
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
            radius: this.options.radius,
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
            const radius = i % 2 === 0 ? this.options.radius : this.options.innerRadius;
            
            // Calculate exact position
            const x = exactMultiply(radius, Math.cos(angle));
            const z = exactMultiply(radius, Math.sin(angle));
            
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
     * @param {number} innerRadius - Optional new inner radius for alternating pattern
     */
    updateRadiusSettings(outerRadius, singleCutRadius, innerRadius) {
        // Store the new settings with precision to two decimal places
        this.options.singleCutRadius = parseFloat(singleCutRadius.toFixed(2));
        
        // Use provided innerRadius or calculate it from outerRadius
        if (innerRadius !== undefined) {
            this.options.innerRadius = parseFloat(innerRadius.toFixed(2));
            this.debugLog(`Updating radius settings - outer: ${outerRadius}, inner: ${this.options.innerRadius}, singleCut: ${this.options.singleCutRadius}`);
        } else {
            // Calculate new inner radius proportional to outer radius
            this.options.innerRadius = parseFloat((outerRadius * 0.866).toFixed(2)); // Approximately cos(30°)
            this.debugLog(`Updating radius settings - outer: ${outerRadius}, calculated inner: ${this.options.innerRadius}, singleCut: ${this.options.singleCutRadius}`);
        }
        
        // Use the parent HexagonModel's updateRadius method to update the main radius
        // This will reposition all cornerNodes
        super.updateRadius(outerRadius);
        
        // Only update positions if we're not in the initialization phase
        if (this.initializationComplete) {
            // First dispose of all existing children
            this.disposeChildren();
            this.clearRadiusLines();
            
            // Recreate all models with new settings
            this.createModels();
            
            // Update child positions consistently
            this.updateChildPositions();
            
            // Redraw radius lines
            if (this.options.showRadiusLines) {
                this.drawRadiusLines();
            }
            
            // Log success
            this.debugLog('Radius settings updated and models recreated');
            
            // Update the stats
            this.logLayerTwoSummary();
        } else {
            this.debugLog('Skipping repositioning during initialization phase');
        }
    }
    
    /**
     * Calculate the positions for all child models based on current radius settings
     * Returns an array of Vector3 positions
     */
    calculateChildPositions() {
        const positions = [];
        const numModels = 12; // Always 12 SingleCUTs in this model
        
        // Use consistent precision for all calculations
        const outerRadius = parseFloat(this.options.radius.toFixed(2));
        const innerRadius = parseFloat(this.options.innerRadius.toFixed(2));
        
        for (let i = 0; i < numModels; i++) {
            // Calculate angle with consistent precision
            const angle = parseFloat(((i * 2 * Math.PI) / numModels).toFixed(6));
            
            // Alternate between inner and outer radius
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            
            // Calculate the position with consistent precision
            const x = exactMultiply(radius, Math.cos(angle));
            const z = exactMultiply(radius, Math.sin(angle));
            
            positions.push(new Vector3(x, 0, z));
        }
        
        return positions;
    }
    
    /**
     * Force update of SingleCUT initial positions to match current positions
     * This helps with position drift and ensures future repositioning works correctly
     */
    resetInitialPositions() {
        if (!this.childModels || this.childModels.length === 0) {
            this.debugLog('No child models to reset initial positions for');
            return;
        }
        
        this.debugLog('Resetting SingleCUT initial positions to match current positions');
        
        // Update each child model's initial positions
        this.childModels.forEach((singleCut, i) => {
            if (singleCut && singleCut.initialValues) {
                // Reset the initial position to match current position
                singleCut.initialValues.position = singleCut.rootNode.position.clone();
                this.debugLog(`Reset initial position for SingleCUT #${i+1} to (${singleCut.initialValues.position.x.toFixed(2)}, ${singleCut.initialValues.position.y.toFixed(2)}, ${singleCut.initialValues.position.z.toFixed(2)})`);
            }
        });
    }
    
    /**
     * Update positions of existing SingleCUT model instances
     * This avoids recreating the models when only their positions need to change
     */
    updateChildPositions() {
        // Track reposition attempts
        this.repositionAttempts++;
        const currentTime = performance.now();
        if (!this.firstRepositionTime) {
            this.firstRepositionTime = currentTime;
        }
        const elapsed = currentTime - (this.firstRepositionTime || currentTime);
        this.lastRepositionTime = currentTime;
        
        console.log(`LayerTwo reposition attempt #${this.repositionAttempts} (elapsed: ${elapsed.toFixed(2)}ms)`);
        
        this.debugLog('Updating positions of existing SingleCUT models');
        
        if (!this.childModels || this.childModels.length === 0) {
            this.debugLog('No child models to update positions for');
            return;
        }
        
        // Re-calculate positions if they haven't been calculated yet
        if (!this.calculatedPositions || this.calculatedPositions.length !== this.childModels.length) {
            this.calculatedPositions = this.calculateChildPositions();
        }
        
        // Track position changes for this update
        const positionChanges = [];
        let successfulChangesThisAttempt = 0;
        
        // Update the position of each child model
        for (let i = 0; i < this.childModels.length; i++) {
            const singleCut = this.childModels[i];
            const targetPosition = this.calculatedPositions[i];
            
            if (singleCut && singleCut.rootNode && targetPosition) {
                // Store the previous position for logging
                const prevPos = singleCut.rootNode.position.clone();
                
                // Update the position directly on the Babylon.js node
                singleCut.rootNode.position = targetPosition.clone();
                
                // Calculate the actual change
                const actualChange = Vector3.Distance(prevPos, targetPosition);
                positionChanges.push(actualChange);
                
                // Determine if this was a significant position change
                const isSignificantChange = actualChange > this.positionChangeThreshold;
                if (isSignificantChange) {
                    successfulChangesThisAttempt++;
                    this.successfulRepositions++;
                }
                
                this.debugLog(`SingleCUT #${i+1}: Updated position from (${prevPos.x.toFixed(2)}, ${prevPos.y.toFixed(2)}, ${prevPos.z.toFixed(2)}) ` +
                             `to (${targetPosition.x.toFixed(2)}, ${targetPosition.y.toFixed(2)}, ${targetPosition.z.toFixed(2)}) - ` +
                             `Change: ${actualChange.toFixed(4)} - ${isSignificantChange ? 'SIGNIFICANT' : 'minimal'}`);
                
                // Log comprehensive details about the updated SingleCUT
                if (typeof singleCut.logModelDetails === 'function') {
                    singleCut.logModelDetails();
                }
            } else {
                this.debugLog(`Warning: Could not update position for SingleCUT #${i+1} - model or rootNode missing`);
            }
        }
        
        // If this wasn't the initial positioning, reset initial positions
        // This ensures future position updates work correctly
        if (this.initializationComplete && this.repositionAttempts > 1) {
            this.resetInitialPositions();
        }
        
        // Calculate stats for this reposition attempt
        const avgChange = positionChanges.length > 0 ? 
            positionChanges.reduce((sum, val) => sum + val, 0) / positionChanges.length : 0;
            
        // Track the changes in history for analysis
        this.positionChangeHistory.push({
            attempt: this.repositionAttempts,
            timestamp: currentTime,
            elapsed: elapsed,
            changes: positionChanges,
            avgChange: avgChange,
            successfulChanges: successfulChangesThisAttempt
        });
        
        // Log summary for this reposition attempt
        console.log(`LayerTwo reposition summary #${this.repositionAttempts}:
  - Changed models: ${successfulChangesThisAttempt}/${positionChanges.length}
  - Average change distance: ${avgChange.toFixed(4)}
  - Total successful repositions: ${this.successfulRepositions}
  - Time since first attempt: ${elapsed.toFixed(2)}ms`);
        
        // Log a summary of the update
        this.logLayerTwoSummary();
        
        this.debugLog('Position update complete for all SingleCUT models');
    }
    
    /**
     * Get debugging statistics about repositioning attempts
     * Can be called from the console to analyze performance
     */
    getRepositionStats() {
        // Return comprehensive stats about repositioning
        const now = performance.now();
        const stats = {
            attempts: this.repositionAttempts,
            successfulRepositions: this.successfulRepositions,
            timeElapsed: this.firstRepositionTime ? (now - this.firstRepositionTime) : 0,
            firstAttempt: this.firstRepositionTime,
            lastAttempt: this.lastRepositionTime,
            history: this.positionChangeHistory,
            
            // Calculate success rate
            successRate: this.repositionAttempts > 0 ? 
                (this.successfulRepositions / (this.repositionAttempts * this.childModels?.length || 1)) : 0,
                
            // Find when positions stabilized (all changes minimal)
            stabilizedAtAttempt: this.positionChangeHistory.findIndex(record => 
                record.successfulChanges === 0 && record.attempt > 1),
                
            // Average change per attempt
            averageChangePerAttempt: this.positionChangeHistory.map(record => record.avgChange)
        };
        
        console.log("LayerTwo Reposition Statistics:", stats);
        return stats;
    }
    
    /**
     * Log a summary of the LayerTwo model's configuration
     * Useful for debugging
     */
    logLayerTwoSummary() {
        console.log(`
========== LayerTwo Model Summary ==========
Configuration:
  - Outer Radius: ${this.options.radius.toFixed(2)}
  - Inner Radius: ${this.options.innerRadius.toFixed(2)} (${(100 * this.options.innerRadius / this.options.radius).toFixed(1)}% of outer)
  - SingleCUT Radius: ${this.options.singleCutRadius.toFixed(2)}
  - Rotation Angle: ${this.options.rotationAngle.toFixed(2)}°
  - SingleCUT Rotation Angle: ${this.options.singleCutRotationAngle.toFixed(2)}°

Child Models: ${this.childModels ? this.childModels.length : 0} SingleCUTs
Position Pattern: Alternating at ${this.options.radius.toFixed(2)} and ${this.options.innerRadius.toFixed(2)} units
Radius Difference: ${(this.options.radius - this.options.innerRadius).toFixed(2)} units
==============================================
`);
    }
    
    /**
     * Force recalculation and update of all child positions
     * Useful for debugging and recovery from position drift
     */
    forceUpdatePositions() {
        this.debugLog('Forcing update of all SingleCUT positions');
        
        // Recalculate positions based on current radius settings
        this.calculatedPositions = this.calculateChildPositions();
        
        // Update child positions
        this.updateChildPositions();
        
        // Reset initial positions to match current positions
        this.resetInitialPositions();
        
        return this.childModels.length;
    }
    
    /**
     * Guaranteed refresh method that forces Babylon.js to update visuals
     * Uses the radius update trick to ensure changes are reflected in the canvas
     */
    guaranteedRefresh() {
        console.log("Performing guaranteed position refresh with radius trick...");
        
        // Store current radius values
        const currentOuterRadius = this.options.radius;
        const currentSingleCutRadius = this.options.singleCutRadius;
        
        // Make a tiny change to force update
        this.updateRadiusSettings(currentOuterRadius + 0.01, currentSingleCutRadius);
        
        // Set a timeout to revert back to original values
        setTimeout(() => {
            this.updateRadiusSettings(currentOuterRadius, currentSingleCutRadius);
            console.log("Guaranteed refresh complete - visual update should now be visible");
        }, 50);
        
        return "Guaranteed refresh initiated";
    }
    
    /**
     * Update just the inner radius setting
     * @param {number} innerRadius - New radius for inner SingleCUTs
     */
    updateInnerRadius(innerRadius) {
        // Set inner radius with precision to two decimal places
        const preciseInnerRadius = parseFloat(innerRadius.toFixed(2));
        
        this.debugLog(`Updating inner radius to ${preciseInnerRadius} (outer: ${this.options.radius})`);
        
        // Call the main update method with current outer radius and singleCutRadius
        this.updateRadiusSettings(
            this.options.radius,
            this.options.singleCutRadius,
            preciseInnerRadius
        );
        
        // No need to call logLayerTwoSummary() here as updateRadiusSettings will do it
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
        // Quick validation
        if (modelIndex < 0 || modelIndex >= (this.childModels?.length || 0)) {
            return false;
        }
        
        // Get the map entry for this model
        const hiddenElements = this.hiddenElementsMap?.[modelIndex];
        if (!hiddenElements) {
            return false;
        }
        
        // Check if the specific element is in the hidden list
        if (type === 'pipe' && hiddenElements.pipes) {
            return hiddenElements.pipes.includes(index);
        }
        else if (type === 'panel' && hiddenElements.panels) {
            return hiddenElements.panels.includes(index);
        }
        
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
        return 60; // Minimum sensible radius for LayerTwo
    }
    
    /**
     * Get the max outer radius value for this model
     * @returns {number} - Maximum outer radius
     */
    getMaxRadius() {
        return 120; // Maximum sensible radius for LayerTwo
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
    updateAllSingleCutDeltaRotations(deltaRotation) {
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
     * Get the minimum delta rotation value for SingleCUTs
     * @returns {number} - Minimum delta rotation in degrees
     */
    getMinSingleCutDeltaRotation() {
        return -180;
    }
    
    /**
     * Get the maximum delta rotation value for SingleCUTs
     * @returns {number} - Maximum delta rotation in degrees
     */
    getMaxSingleCutDeltaRotation() {
        return 180;
    }
    
    /**
     * Get the default delta rotation value for SingleCUTs
     * @returns {number} - Default delta rotation in degrees
     */
    getDefaultSingleCutDeltaRotation() {
        return 0;
    }
    
    /**
     * Get the current delta rotation value for SingleCUTs
     * @returns {number} - Current delta rotation in degrees
     */
    getCurrentSingleCutDeltaRotation() {
        return this.rotationDelta || 0;
    }
    
    /**
     * Calculate the distance between opposite panels for the full model
     * @returns {number} - Distance in meters
     */
    calculatePanelDistance() {
        if (this.childModels && this.childModels.length > 0) {
            return this.childModels[0].calculatePanelDistance();
        }
        // For a regular dodecagon, the distance between opposite panels (sides)
        // is outerRadius * 2 * cos(π/12)
        const distanceBetweenPanels = this.options.radius * 2 * Math.cos(Math.PI / 12);
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
        return 50; // Minimum sensible inner radius for LayerTwo
    }
    
    /**
     * Get the max inner radius value for this model
     * @returns {number} - Maximum inner radius
     */
    getMaxInnerRadius() {
        return 100; // Maximum sensible inner radius for LayerTwo
    }
    
    /**
     * Update all SingleCUT rotations to a specific angle (absolute angle, not delta)
     * @param {number} rotationAngleDegrees - The absolute rotation angle in degrees
     */
    updateAllSingleCutRotations(rotationAngleDegrees) {
        if (!this.childModels || this.childModels.length === 0) {
            this.debugLog('No SingleCUT models to update rotations for');
            return;
        }
        
        this.debugLog(`Updating all SingleCUT rotations to absolute angle: ${rotationAngleDegrees}°`);
        
        // Update each child model to the same absolute rotation
        this.childModels.forEach(singleCut => {
            if (singleCut && typeof singleCut.updateRotation === 'function') {
                singleCut.updateRotation(rotationAngleDegrees);
            }
        });
        
        // Store the new rotation
        this.options.singleCutRotationAngle = rotationAngleDegrees;
        
        this.debugLog(`All SingleCUT rotations updated to ${rotationAngleDegrees}°`);
    }
}

/**
 * Helper function to compute a*b with higher precision
 * to minimize floating point errors
 */
function exactMultiply(a, b) {
    // Ensure input values have consistent precision first
    const preciseA = parseFloat(a.toFixed(2));
    const preciseB = parseFloat(b.toFixed(2));
    
    // Perform the multiplication with high precision 
    const result = preciseA * preciseB;
    
    // Return with consistent precision (15 significant digits, then rounded to 2 decimal places)
    return parseFloat(result.toFixed(2));
} 