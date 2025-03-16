import { Vector3, Color3 } from '@babylonjs/core';
import { PipeModel } from './PipeModel';
import { PanelModel } from './PanelModel';
import * as BABYLON from '@babylonjs/core';
import { HexagonModel } from './HexagonModel';

/**
 * Creates a Single CUT model (Convective Heat Engine) with pipes and panels arranged in a hexagonal pattern
 * Extends HexagonModel to use consistent hexagonal geometry
 */
export class SingleCutModel extends HexagonModel {
    constructor(scene, position = new Vector3(0, 0, 0), options = {}) {
        // Default options
        const defaultOptions = {
            pipeRadius: 1, // meters
            pipeHeight: 1000, // meters
            pipeColor: new Color3(0.7, 0.7, 0.7),
            panelWidth: 50, // meters
            panelHeight: 1000, // meters
            panelDepth: 0.1, // meters (thin panels)
            panelColor: new Color3(0.2, 0.6, 0.8),
            skipPanels: false, // Option to skip creating panels, for models that share panels across SingleCUTs
        };

        // Call parent constructor with merged options
        // Note: cornerCount and radius are handled by HexagonModel
        super(scene, position, { ...defaultOptions, ...options });
        
        // Create the pipes and panels
        this.createModels();
        
        this.debugLog('SingleCUT model created');
    }
    
    /**
     * Create the model with pipes and panels
     */
    createModels() {
        this.pipes = [];
        this.panels = [];
        
        // Debug log
        this.debugLog('Creating SingleCUT model with', this.options.cornerCount, 'pipes and panels');
        
        // Create pipes at each corner of the hexagon
        this.createPipes();
        
        // Only create panels if not skipping them
        if (!this.options.skipPanels) {
            this.createPanels();
        } else {
            this.debugLog('Skipping panel creation as requested by skipPanels option');
        }
        
        this.debugLog('SingleCUT model creation complete');
    }
    
    /**
     * Create pipes at each corner of the hexagon
     */
    createPipes() {
        const cornerCount = this.options.cornerCount;
        
        for (let i = 0; i < cornerCount; i++) {
            // Get the corner position from the cornerNodes array (already calculated)
            const position = this.cornerNodes[i].position.clone();
            
            this.debugLog(`Pipe ${i+1}: Position (${position.x.toFixed(2)}, 0, ${position.z.toFixed(2)})`);
            
            const pipe = new PipeModel(this.scene, position, {
                height: this.options.pipeHeight,
                radius: this.options.pipeRadius,
                color: this.options.pipeColor
            });
            
            pipe.rootNode.parent = this.rootNode;
            this.pipes.push(pipe);
            
            // Check if this pipe should be permanently hidden (based on parent model)
            if (this.options.parent && typeof this.options.parent.isElementPermanentlyHidden === 'function') {
                // Get our index in the parent's childModels array
                const ourIndex = this.options.parent.childModels ? 
                    this.options.parent.childModels.indexOf(this) : -1;
                    
                if (ourIndex !== -1 && this.options.parent.isElementPermanentlyHidden(ourIndex, 'pipe', i)) {
                    this.debugLog(`Permanently hiding Pipe #${i+1} as requested by parent model`);
                    pipe.pipeMesh.isVisible = false;
                    pipe.rootNode.setEnabled(false);
                }
            }
        }
    }
    
    /**
     * Create panels connecting the pipes
     */
    createPanels() {
        const cornerCount = this.options.cornerCount;
        
        for (let i = 0; i < cornerCount; i++) {
            const nextIndex = (i + 1) % cornerCount;
            
            this.debugLog(`Creating panel ${i+1} between pipes ${i+1} and ${nextIndex+1}`);
            
            // Get positions from cornerNodes and calculate panel transform
            const currentPipePos = this.cornerNodes[i].position.clone();
            const nextPipePos = this.cornerNodes[nextIndex].position.clone();
            
            // Calculate position and orientation for the panel
            const transform = this.calculatePanelTransform(i, currentPipePos, nextPipePos);
            
            // Create panel with calculated transform
            const panel = this.createPanel(transform.position, transform.rotation, transform.width, i);
            
            this.panels.push(panel);
            
            // Check if this panel should be permanently hidden (based on parent model)
            if (this.options.parent && typeof this.options.parent.isElementPermanentlyHidden === 'function') {
                // Get our index in the parent's childModels array
                const ourIndex = this.options.parent.childModels ? 
                    this.options.parent.childModels.indexOf(this) : -1;
                    
                if (ourIndex !== -1 && this.options.parent.isElementPermanentlyHidden(ourIndex, 'panel', i)) {
                    this.debugLog(`Permanently hiding Panel #${i+1} as requested by parent model`);
                    panel.panelMesh.isVisible = false;
                    panel.rootNode.setEnabled(false);
                }
            }
        }
    }
    
    /**
     * Calculate panel position and rotation for connecting pipes
     * @param {number} index - Index of the pipe
     * @param {Vector3} pipePos - Current pipe position
     * @param {Vector3} nextPipePos - Next pipe position
     * @returns {Object} - Position, rotation, and width for the panel
     */
    calculatePanelTransform(index, pipePos, nextPipePos) {
        // Calculate midpoint between pipes for panel position
        const position = pipePos.add(nextPipePos).scale(0.5);
        
        // Calculate direction vector from current pipe to next pipe
        const direction = nextPipePos.subtract(pipePos).normalize();

        // Calculate angle
        const angle = Math.atan2(direction.z, direction.x);
        
        const rotation = new BABYLON.Vector3(0, angle, 0);
        
        // Calculate distance between pipes for panel width
        const distance = BABYLON.Vector3.Distance(pipePos, nextPipePos);
        
        // Adjust panel width to account for pipe radius on both ends
        const pipeRadius = this.options.pipeRadius || 0.5;
        const width = distance - (2 * pipeRadius);
        
        // Debug log
        this.debugLog(`Panel Transform: Position (${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)}), ` + 
                      `Rotation Y: ${this.radToDeg(angle)}, Width: ${width.toFixed(2)}`);
        
        return { position, rotation, width };
    }
    
    /**
     * Create a panel mesh at the specified position and rotation
     * @param {BABYLON.Vector3} position - Position of the panel
     * @param {BABYLON.Vector3} rotation - Rotation of the panel
     * @param {number} width - Width of the panel
     * @param {number} index - Panel index (0-5)
     * @returns {Object} - The created panel object
     */
    createPanel(position, rotation, width, index) {
        const panel = new PanelModel(this.scene, position, {
            height: this.options.panelHeight,
            width: width,
            depth: this.options.panelDepth,
            color: this.options.panelColor
        });
        
        // Apply base rotation from the angle between pipes
        panel.rootNode.rotation = rotation;
        
        this.debugLog(`Panel ${index+1}: Initial rotation: ` +
                     `X: ${this.radToDeg(rotation.x)}, Y: ${this.radToDeg(rotation.y)}, Z: ${this.radToDeg(rotation.z)}`);
        
        // Apply panel-specific rotations
        // For most panels, a 90-degree rotation works
        // For panels 2 and 5, we need a different rotation
        let rotationAngle;
        
        if (index === 1 || index === 4) { // Panels 2 and 5
            rotationAngle = 0; // No additional rotation for these panels
            this.debugLog(`Panel ${index+1}: No additional rotation (panel 2 or 5)`);
        } else if (index === 2 || index === 5) {
            rotationAngle = 120 * Math.PI / 180; // radians
            this.debugLog(`Panel ${index+1}: Adding ${this.radToDeg(rotationAngle)} rotation`);
        } else {
            rotationAngle = 60 * Math.PI / 180; // radians
            this.debugLog(`Panel ${index+1}: Adding ${this.radToDeg(rotationAngle)} rotation`);
        }
        
        // Apply the rotation
        panel.rootNode.rotate(BABYLON.Axis.Y, rotationAngle, BABYLON.Space.LOCAL);
        
        // Log final rotation
        const finalRotation = panel.rootNode.rotation;
        this.debugLog(`Panel ${index+1}: Final position and rotation: ` +
                     `Position (${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)}), ` +
                     `Rotation X: ${this.radToDeg(finalRotation.x)}, ` + 
                     `Y: ${this.radToDeg(finalRotation.y)}, ` + 
                     `Z: ${this.radToDeg(finalRotation.z)}`);
        
        // Set parent to the root node
        panel.rootNode.parent = this.rootNode;
        
        // Return the entire panel object, not just the mesh
        return panel;
    }
    
    /**
     * Updates the level of detail based on camera distance
     * @param {Vector3} cameraPosition - The camera position
     */
    updateLOD(cameraPosition) {
        const distanceToCenter = Vector3.Distance(cameraPosition, this.rootNode.position);
        
        // Different LOD levels based on distance
        const farDistance = 2000;
        const mediumDistance = 1000;
        
        // Apply LOD to pipes and panels
        this.pipes.forEach(pipe => {
            const isVisible = distanceToCenter < farDistance;
            pipe.pipeMesh.isVisible = isVisible;
            
            // Only show markers when closer
            if (pipe.markers) {
                pipe.markers.forEach(marker => {
                    marker.isVisible = distanceToCenter < mediumDistance;
                });
            }
        });
        
        // Apply LOD to panels
        this.panels.forEach(panel => {
            if (panel.panelMesh) {
                panel.panelMesh.isVisible = distanceToCenter < farDistance;
            }
        });
    }
    
    /**
     * Override updateRadius to also update pipes and panels
     * @param {number} newRadius - New radius value for the model
     */
    updateRadius(newRadius) {
        if (this.options.radius === newRadius) {
            return; // No change needed
        }
        
        const oldRadius = this.options.radius;
        
        // First call the parent method to update base geometry
        super.updateRadius(newRadius);
        
        this.debugLog(`SingleCut ${this.uniqueId}: Updated radius from ${oldRadius.toFixed(2)} to ${newRadius.toFixed(2)} (initial: ${this.initialValues.radius.toFixed(2)}, total delta: ${(newRadius - this.initialValues.radius).toFixed(2)})`);
        
        // Now update our pipes and panels by recreating them
        // This ensures proper positioning and sizing
        this.dispose(false); // Dispose only the pipes and panels, not the base nodes
        this.createModels(); // Recreate pipes and panels
    }
    
    /**
     * Disposes of all resources
     * @param {boolean} fullDispose - If true, dispose everything including the base class. If false, only dispose pipes and panels.
     */
    dispose(fullDispose = true) {
        // Dispose pipes
        if (this.pipes) {
            this.pipes.forEach(pipe => pipe.dispose());
            this.pipes = [];
        }
        
        // Dispose panels
        if (this.panels) {
            this.panels.forEach(panel => panel.dispose());
            this.panels = [];
        }
        
        // If full dispose, call parent dispose
        if (fullDispose) {
            super.dispose();
        }
    }
    
    /**
     * Get child models (none for SingleCUTModel since it's a leaf node)
     * @returns {Array} - Empty array since SingleCUTModel has no child models
     */
    getChildren() {
        return [];
    }
    
    /**
     * Updates all panel rotations with a delta value applied to their original positions
     * @param {number} deltaRotation - The delta rotation in degrees (-180 to 180)
     */
    updateAllPanelRotations(deltaRotation) {
        if (!this.panels || this.panels.length === 0) {
            this.debugLog('No panels to update rotations for');
            return;
        }
        
        // Store the current panel rotation delta
        this.panelRotationDelta = deltaRotation;
        
        console.log(`Updating all panels with delta rotation: ${deltaRotation}°`);
        
        // Update each panel
        this.panels.forEach((panel, i) => {
            if (panel && panel.rootNode) {
                // Get original panel rotation - if not already stored, calculate and store it
                if (!panel.originalRotation) {
                    panel.originalRotation = panel.rootNode.rotation.clone();
                }
                
                // Calculate new Y rotation by adding delta
                const originalY = panel.originalRotation.y;
                let newY = originalY + (deltaRotation * Math.PI / 180); // Convert delta to radians
                
                // Apply the new rotation
                panel.rootNode.rotation.y = newY;
                
                console.log(`Panel #${i+1}: Updated rotation from ${(originalY * 180 / Math.PI).toFixed(0)}° to ${(newY * 180 / Math.PI).toFixed(0)}° (delta: ${deltaRotation}°)`);
            }
        });
    }
    
    /**
     * Get min delta rotation value for panels
     * @returns {number} - Minimum delta rotation in degrees
     */
    getMinPanelDeltaRotation() {
        return -180;
    }
    
    /**
     * Get max delta rotation value for panels
     * @returns {number} - Maximum delta rotation in degrees
     */
    getMaxPanelDeltaRotation() {
        return 180;
    }
    
    /**
     * Get default delta rotation value for panels
     * @returns {number} - Default delta rotation in degrees
     */
    getDefaultPanelDeltaRotation() {
        return 0;
    }
    
    /**
     * Get current delta rotation value for panels
     * @returns {number} - Current delta rotation in degrees
     */
    getCurrentPanelDeltaRotation() {
        return this.panelRotationDelta || 0;
    }
} 