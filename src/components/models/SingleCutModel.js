import { Vector3, Color3 } from '@babylonjs/core';
import { PipeModel } from './PipeModel';
import { PanelModel } from './PanelModel';
import * as BABYLON from '@babylonjs/core';
import { BaseModel } from './BaseModel';

/**
 * Creates a Single CUT model (Convective Heat Engine) with pipes and panels arranged in a hexagonal pattern
 */
export class SingleCutModel extends BaseModel {
    constructor(scene, position = new Vector3(0, 0, 0), options = {}) {
        // Default options
        const defaultOptions = {
            pipesCount: 6, // Number of pipes in the hexagonal arrangement (only the outer ring)
            pipeRadius: 1, // meters (changed from 5 to 1)
            pipeHeight: 1000, // meters
            pipeColor: new Color3(0.7, 0.7, 0.7),
            panelWidth: 50, // meters
            panelHeight: 1000, // meters
            panelDepth: 0.1, // meters (changed from 2 to 0.1 for thinner panels)
            panelColor: new Color3(0.2, 0.6, 0.8),
            radius: 21, // Distance from center to each pipe in hexagonal pattern (changed from 150 to 21)
            debug: false, // Enable/disable debug logging
            skipPanels: false, // New option to skip creating panels, for models that share panels across SingleCUTs
            rotationAngle: 0, // Default rotation angle in degrees
            parent: null, // Reference to parent model (if any)
        };

        // Call parent constructor with merged options
        super(scene, position, { ...defaultOptions, ...options });
        
        // Create the models
        this.createModels();
        
        // Apply initial rotation if specified
        if (this.options.rotationAngle !== 0) {
            this.updateRotation(this.options.rotationAngle);
        }
    }
    
    /**
     * Helper function to convert radians to degrees and format for display
     * @param {number} radians - Angle in radians
     * @returns {string} - Formatted string with angle in degrees
     */
    radToDeg(radians) {
        return (radians * 180 / Math.PI).toFixed(2) + '°';
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

        const angle = 0; // don't care about angle between pipes for now

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
     * Create the model with pipes and panels
     */
    createModels() {
        this.pipes = [];
        this.panels = [];
        
        // Debug log
        this.debugLog('Creating SingleCUT model with', this.options.pipesCount, 'pipes and panels');
        
        // Create an array to store pipe positions for panel connections
        const pipePositions = [];
        
        // Create pipes at hexagon vertices
        for (let i = 0; i < this.options.pipesCount; i++) {
            const angle = (i * 2 * Math.PI) / this.options.pipesCount;
            const x = this.options.radius * Math.cos(angle);
            const z = this.options.radius * Math.sin(angle);
            
            // Create pipe at current position
            const position = new BABYLON.Vector3(x, 0, z);
            pipePositions.push(position); // Store position for panel creation
            
            this.debugLog(`Pipe ${i+1}: Position (${x.toFixed(2)}, 0, ${z.toFixed(2)}), Angle: ${this.radToDeg(angle)}`);
            
            const pipe = new PipeModel(this.scene, position, {
                height: this.options.pipeHeight,
                radius: this.options.pipeRadius,
                color: this.options.pipeColor
            });
            
            pipe.rootNode.parent = this.rootNode;
            this.pipes.push(pipe);
        }
        
        // Only create panels if not skipping them
        if (!this.options.skipPanels) {
            // Create panels connecting pipes
            for (let i = 0; i < this.options.pipesCount; i++) {
                const nextIndex = (i + 1) % this.options.pipesCount;
                
                this.debugLog(`Creating panel ${i+1} between pipes ${i+1} and ${nextIndex+1}`);
                
                // Get the transform for the panel (position, rotation, width)
                const transform = this.calculatePanelTransform(
                    i,
                    pipePositions[i], 
                    pipePositions[nextIndex]
                );
                
                // Create panel with calculated transform and store the full panel object
                const panel = this.createPanel(transform.position, transform.rotation, transform.width, i);
                
                this.panels.push(panel);
            }
        } else {
            this.debugLog('Skipping panel creation as requested by skipPanels option');
        }
        
        this.debugLog('SingleCUT model creation complete');
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
     * Disposes of all resources
     */
    dispose() {
        this.pipes.forEach(pipe => pipe.dispose());
        this.panels.forEach(panel => panel.dispose());
        super.dispose();
    }
    
    /**
     * Update rotation of this SingleCUT model
     * @param {number} rotationAngleDegrees - Rotation angle in degrees
     */
    updateRotation(rotationAngleDegrees) {
        // Convert to radians
        const rotationAngle = (rotationAngleDegrees * Math.PI) / 180;
        
        // Update root node rotation around Y axis
        this.rootNode.rotation.y = rotationAngle;
        
        // Store the current angle
        this.options.rotationAngle = rotationAngleDegrees;
        
        this.debugLog(`Updated SingleCUT rotation to ${rotationAngleDegrees} degrees`);
        
        // If this model is part of a collection in a parent model, 
        // update the parent's reference to this model's rotation
        if (this.options.parent) {
            // The parent handles updating its own rotation independently
            // This just ensures we update our local rotation value
        }
    }
    
    /**
     * Get the default radius value for this model
     * @returns {number} - Default radius
     */
    getDefaultRadius() {
        return this.options.radius;
    }
    
    /**
     * Get the min radius value for this model
     * @returns {number} - Minimum radius
     */
    getMinRadius() {
        return 10; // Minimum sensible radius for a SingleCUT
    }
    
    /**
     * Get the max radius value for this model
     * @returns {number} - Maximum radius
     */
    getMaxRadius() {
        return 30; // Maximum sensible radius for a SingleCUT
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
     * Calculate the distance between opposite panels
     * This is useful for displaying in UI controls
     * @returns {number} - Distance in meters
     */
    calculatePanelDistance() {
        // For a regular hexagon, the distance between opposite panels (sides)
        // is radius * √3, not radius * 2 (which would be the distance between opposite corners)
        const distanceBetweenPanels = this.options.radius * Math.sqrt(3);
        return distanceBetweenPanels;
    }
    
    /**
     * Get child models (none for SingleCUTModel since it's a leaf node)
     * @returns {Array} - Empty array since SingleCUTModel has no child models
     */
    getChildren() {
        return [];
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