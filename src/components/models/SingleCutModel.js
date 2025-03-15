import { Vector3, TransformNode, Color3 } from '@babylonjs/core';
import { PipeModel } from './PipeModel';
import { PanelModel } from './PanelModel';
import * as BABYLON from '@babylonjs/core';

/**
 * Creates a Single CUT model (Convective Heat Engine) with pipes and panels arranged in a hexagonal pattern
 */
export class SingleCutModel {
    constructor(scene, position = new Vector3(0, 0, 0), options = {}) {
        this.scene = scene;
        this.position = position;
        
        // Default options
        this.options = {
            pipesCount: 6, // Number of pipes in the hexagonal arrangement (only the outer ring)
            pipeRadius: 5, // meters
            pipeHeight: 1000, // meters
            pipeColor: new Color3(0.7, 0.7, 0.7),
            panelWidth: 50, // meters
            panelHeight: 1000, // meters
            panelDepth: 2, // meters
            panelColor: new Color3(0.2, 0.6, 0.8),
            radius: 150, // Distance from center to each pipe in hexagonal pattern
            debug: true, // Enable/disable debug logging
            ...options
        };
        
        // Create parent node
        this.rootNode = new TransformNode('singleCut', this.scene);
        this.rootNode.position = this.position;
        
        // Create models
        this.createModels();
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
     * Debug logging function that only logs when debug is enabled
     * @param {...any} args - Arguments to log
     */
    debugLog(...args) {
        if (this.options.debug) {
            console.log('[SingleCUT Debug]', ...args);
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
        this.rootNode.dispose();
    }
} 