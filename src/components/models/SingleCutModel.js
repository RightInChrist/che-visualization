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
            ...options
        };
        
        // Create parent node
        this.rootNode = new TransformNode('singleCut', this.scene);
        this.rootNode.position = this.position;
        
        // Create models
        this.createModels();
    }
    
    /**
     * Calculate panel position and rotation for connecting pipes
     * @param {Vector3} pipePos - Current pipe position
     * @param {Vector3} nextPipePos - Next pipe position
     * @returns {Object} - Position, rotation, and width for the panel
     */
    calculatePanelTransform(pipePos, nextPipePos) {
        // Calculate midpoint between pipes for panel position
        const position = pipePos.add(nextPipePos).scale(0.5);
        
        // Calculate direction vector from current pipe to next pipe
        const direction = nextPipePos.subtract(pipePos).normalize();
        
        // Calculate base rotation from angle between pipes
        // No additional rotation here - we'll handle all rotations in createPanel
        const angle = Math.atan2(direction.z, direction.x);
        const rotation = new BABYLON.Vector3(0, angle, 0);
        
        // Calculate distance between pipes for panel width
        const distance = BABYLON.Vector3.Distance(pipePos, nextPipePos);
        
        // Adjust panel width to account for pipe radius on both ends
        const pipeRadius = this.options.pipeRadius || 0.5;
        const width = distance - (2 * pipeRadius);
        
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
        
        // Apply panel-specific rotations
        // For most panels, a 90-degree rotation works
        // For panels 2 and 5, we need a different rotation
        let rotationAngle;
        
        if (index === 1 || index === 4) { // Panels 2 and 5
            rotationAngle = 0; // No additional rotation for these panels
            console.log(`Panel ${index+1}: No additional rotation (panel 2 or 5)`);
        } else {
            rotationAngle = Math.PI/2; // 90-degree rotation for other panels
            console.log(`Panel ${index+1}: Applied 90-degree rotation`);
        }
        
        // Apply the rotation
        panel.rootNode.rotate(BABYLON.Axis.Y, rotationAngle, BABYLON.Space.LOCAL);
        
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
            
            // Get the transform for the panel (position, rotation, width)
            const transform = this.calculatePanelTransform(
                pipePositions[i], 
                pipePositions[nextIndex]
            );
            
            // Create panel with calculated transform and store the full panel object
            const panel = this.createPanel(transform.position, transform.rotation, transform.width, i);
            
            this.panels.push(panel);
        }
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