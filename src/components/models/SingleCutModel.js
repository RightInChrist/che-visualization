import { Vector3, TransformNode, Color3 } from '@babylonjs/core';
import { PipeModel } from './PipeModel';
import { PanelModel } from './PanelModel';

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
            hexRadius: 150, // Distance from center to each pipe in hexagonal pattern
            ...options
        };
        
        // Create parent node
        this.rootNode = new TransformNode('singleCut', this.scene);
        this.rootNode.position = this.position;
        
        // Create models
        this.createModels();
    }
    
    /**
     * Creates pipes and panels in a hexagonal pattern (without center pipe)
     */
    createModels() {
        this.pipes = [];
        this.panels = [];
        
        // Create pipes and panels in a hexagonal pattern
        // No center pipe - only create the hexagon vertices
        const angleStep = (2 * Math.PI) / 6; // 60 degrees in radians
        
        // Store pipe positions for panel placement
        const pipePositions = [];
            
        // Create pipes first
        for (let i = 0; i < 6; i++) {
            const angle = i * angleStep;
            const x = Math.sin(angle) * this.options.hexRadius;
            const z = Math.cos(angle) * this.options.hexRadius;
            
            // Create pipe at hexagon vertex
            const pipe = new PipeModel(this.scene, new Vector3(x, 0, z), {
                height: this.options.pipeHeight,
                radius: this.options.pipeRadius,
                color: this.options.pipeColor
            });
            
            pipe.rootNode.parent = this.rootNode;
            this.pipes.push(pipe);
            
            // Store the position for later use with panels
            pipePositions.push(new Vector3(x, 0, z));
        }
        
        // Now create panels between pipes
        for (let i = 0; i < 6; i++) {
            const currentPipePos = pipePositions[i];
            const nextPipePos = pipePositions[(i + 1) % 6];
            
            // Calculate vector from current pipe to next pipe
            const pipeToNextPipe = nextPipePos.subtract(currentPipePos).normalize();
            
            // Calculate panel position (midpoint between pipes)
            const panelPos = currentPipePos.add(nextPipePos).scale(0.5);
            
            // Calculate panel rotation to face correctly between pipes
            // We want the panel's width to be perpendicular to the line between pipes
            const panelRotationY = Math.atan2(pipeToNextPipe.x, pipeToNextPipe.z);
            
            // Create panel
            const panel = new PanelModel(this.scene, new Vector3(panelPos.x, 0, panelPos.z), {
                height: this.options.panelHeight,
                width: this.options.panelWidth,
                depth: this.options.panelDepth,
                color: this.options.panelColor
            });
            
            // Rotate panel to face correctly
            panel.rootNode.rotation.y = panelRotationY;
            
            panel.rootNode.parent = this.rootNode;
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
            panel.setVisible(distanceToCenter < farDistance);
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