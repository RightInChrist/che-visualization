import { Vector3, Color3, MeshBuilder, StandardMaterial, Axis, Space, Mesh } from '@babylonjs/core';
import { SingleCutModel } from './SingleCutModel';
import { CompositeModel } from './CompositeModel';

/**
 * Creates a Layer Two Ring with 12 SingleCUT models arranged in a dodecagonal (12-sided) pattern
 * This model has shared panels between adjacent SingleCUTs, with an alternating distance pattern
 */
export class LayerTwoModel extends CompositeModel {
    constructor(scene, position = new Vector3(0, 0, 0), options = {}) {
        // Default options
        const defaultOptions = {
            outerRadius: 72.52, // Updated to 72.7 as requested
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
        this.options.outerRadius = parseFloat(this.options.outerRadius.toFixed(2));
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
        
        // Rotate the entire model by the specified angle around the Y axis
        this.updateRotation(this.options.rotationAngle);
        this.debugLog(`Rotated Layer Two Ring by ${this.options.rotationAngle} degrees`);
        
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
        const outerRadius = parseFloat(this.options.outerRadius.toFixed(2));
        const innerRadius = parseFloat(this.options.innerRadius.toFixed(2));
        const singleCutRadius = parseFloat(this.options.singleCutRadius.toFixed(2));
        
        this.debugLog(`Using outer radius: ${outerRadius.toFixed(2)}, inner radius: ${innerRadius.toFixed(2)}, SingleCUT radius: ${singleCutRadius.toFixed(2)}`);

        // Store positions for verification
        const positions = [];
        const distances = [];
        
        // Create 12 SingleCUTs in an alternating pattern
        const numModels = 12;
        
        // Store calculated positions for resetting
        this.calculatedPositions = [];
        
        // IMPORTANT: Setup hidden elements BEFORE creating child models
        this.setupHiddenElements();
        
        // Create a dodecagon with alternating distances from center
        for (let i = 0; i < numModels; i++) {
            // Calculate angle with consistent precision
            const angle = parseFloat(((i * 2 * Math.PI) / numModels).toFixed(6));
            
            // Alternate between inner and outer radius
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            
            // Calculate the position with consistent precision
            const x = exactMultiply(radius, Math.cos(angle));
            const z = exactMultiply(radius, Math.sin(angle));
            
            const position = new Vector3(x, 0, z);
            positions.push(position);
            this.calculatedPositions.push(position.clone()); // Clone to avoid reference issues
            
            // Verify distance from center with consistent precision
            const distanceFromCenter = parseFloat(Math.sqrt(x * x + z * z).toFixed(2));
            distances.push(distanceFromCenter);
            
            this.debugLog(`SingleCUT #${i+1}: angle=${(angle * 180 / Math.PI).toFixed(2)}°, ` +
                         `radius=${radius.toFixed(2)}, ` +
                         `position=(${x.toFixed(2)}, 0, ${z.toFixed(2)}), ` +
                         `distance=${distanceFromCenter.toFixed(2)}`);
            
            // Calculate additional rotation for this SingleCUT based on its position
            // Rotate by 60 degrees per position to ensure the hidden pipes/panels are correctly positioned
            const additionalRotation = i * 60;
            const totalRotation = (this.options.singleCutRotationAngle + additionalRotation) % 360;
            
            this.debugLog(`SingleCUT #${i+1}: base rotation=${this.options.singleCutRotationAngle}°, ` +
                         `additional rotation=${additionalRotation}°, ` +
                         `total rotation=${totalRotation}°`);
            
            // Create a SingleCUT with its own panels and rotation angle
            const singleCut = new SingleCutModel(this.scene, position, {
                radius: singleCutRadius,
                rotationAngle: totalRotation, // Apply the calculated rotation
                parent: this
            });
            
            // Add to the model children
            this.addChild(singleCut);
        }
        
        // Apply the hiding after all models are created to ensure everything is properly set up
        this.applyHiddenElements();
        
        // Verify that distances match the expected pattern
        this.verifyDistances(distances);
        
        this.debugLog('Layer Two Ring model creation complete with alternating distances');
    }
    
    /**
     * Setup which elements (pipes and panels) should be permanently hidden for each SingleCUT
     * This defines the pattern of hidden elements to create a clean aesthetic
     */
    setupHiddenElements() {
        this.debugLog('Setting up permanently hidden elements for SingleCUTs');
        
        // Define hidden elements mapping
        // Format: modelIndex (0-based) => { pipes: [indices to hide], panels: [indices to hide] }
        this.hiddenElementsMap = {};
        
        // Simplified approach: hide the same pipes (1,2,3) and panels (1,2) for all SingleCUTs
        // The rotation of each SingleCUT will create the visual pattern
        
        // Convert to 0-based indices for internal use
        const hiddenPipes = [0, 1, 2]; // Pipes 1, 2, 3 (0-indexed)
        const hiddenPanels = [0, 1];   // Panels 1, 2 (0-indexed)
        
        // Apply the same hiding pattern to all SingleCUTs
        for (let i = 0; i < 12; i++) {
            this.hiddenElementsMap[i] = {
                pipes: hiddenPipes,
                panels: hiddenPanels
            };
            
            this.debugLog(`SingleCUT #${i+1}: Hidden pipes: 1, 2, 3, Hidden panels: 1, 2`);
        }
    }
    
    /**
     * Forcefully apply hiding to all child model elements based on hidden elements map
     * This ensures all elements are properly hidden even if the initial hiding didn't work
     */
    applyHiddenElements() {
        if (!this.childModels || !this.hiddenElementsMap) {
            return;
        }
        
        console.log("Forcefully applying hidden elements to all SingleCUTs");
        
        // For each SingleCUT model
        this.childModels.forEach((singleCut, modelIndex) => {
            const hiddenElements = this.hiddenElementsMap[modelIndex];
            if (!hiddenElements) return;
            
            // Hide pipes
            hiddenElements.pipes.forEach(pipeIndex => {
                if (singleCut.pipes && singleCut.pipes[pipeIndex]) {
                    const pipe = singleCut.pipes[pipeIndex];
                    pipe.pipeMesh.isVisible = false;
                    pipe.rootNode.setEnabled(false);
                    // Mark the pipe as permanently hidden for SceneEditor
                    pipe.isPermanentlyHidden = true;
                    console.log(`Hiding SingleCUT #${modelIndex+1} Pipe #${pipeIndex+1}`);
                }
            });
            
            // Hide panels
            hiddenElements.panels.forEach(panelIndex => {
                if (singleCut.panels && singleCut.panels[panelIndex]) {
                    const panel = singleCut.panels[panelIndex];
                    panel.panelMesh.isVisible = false;
                    panel.rootNode.setEnabled(false);
                    // Mark the panel as permanently hidden for SceneEditor
                    panel.isPermanentlyHidden = true;
                    console.log(`Hiding SingleCUT #${modelIndex+1} Panel #${panelIndex+1}`);
                }
            });
        });
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
        
        // Need to recalculate the positions for each SingleCUT
        this.calculatedPositions = this.calculateChildPositions();
        
        // Check if we have existing children to update
        if (this.childModels && this.childModels.length > 0) {
            // Update positions of existing children instead of recreating them
            this.updateChildPositions();
            
            // Update SingleCUT radius for all children
            this.childModels.forEach(singleCut => {
                if (singleCut && typeof singleCut.updateRadius === 'function') {
                    singleCut.updateRadius(this.options.singleCutRadius);
                }
            });
        } else {
            // No existing children, create them from scratch
            this.createModels();
        }
        
        // Clear and redraw radius lines
        this.clearRadiusLines();
        if (this.options.showRadiusLines) {
            this.drawRadiusLines();
        }
        
        // Log a summary after updates
        this.logLayerTwoSummary();
        
        this.debugLog('Radius settings updated');
    }
    
    /**
     * Calculate the positions for all child models based on current radius settings
     * Returns an array of Vector3 positions
     */
    calculateChildPositions() {
        const positions = [];
        const numModels = 12; // Always 12 SingleCUTs in this model
        
        // Use consistent precision for all calculations
        const outerRadius = parseFloat(this.options.outerRadius.toFixed(2));
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
  - Outer Radius: ${this.options.outerRadius.toFixed(2)}
  - Inner Radius: ${this.options.innerRadius.toFixed(2)} (${(100 * this.options.innerRadius / this.options.outerRadius).toFixed(1)}% of outer)
  - SingleCUT Radius: ${this.options.singleCutRadius.toFixed(2)}
  - Rotation Angle: ${this.options.rotationAngle.toFixed(2)}°
  - SingleCUT Rotation Angle: ${this.options.singleCutRotationAngle.toFixed(2)}°

Child Models: ${this.childModels ? this.childModels.length : 0} SingleCUTs
Position Pattern: Alternating at ${this.options.outerRadius.toFixed(2)} and ${this.options.innerRadius.toFixed(2)} units
Radius Difference: ${(this.options.outerRadius - this.options.innerRadius).toFixed(2)} units
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
        const currentOuterRadius = this.options.outerRadius;
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
        
        this.debugLog(`Updating inner radius to ${preciseInnerRadius} (outer: ${this.options.outerRadius})`);
        
        // Call the main update method with current outer radius and singleCutRadius
        this.updateRadiusSettings(
            this.options.outerRadius,
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
        // This is necessary for when SingleCUT controls are used separately
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