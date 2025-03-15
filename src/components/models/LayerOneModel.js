import { Vector3, Color3, MeshBuilder, StandardMaterial, Axis, Space, Mesh } from '@babylonjs/core';
import { SingleCutModel } from './SingleCutModel';
import { PanelModel } from './PanelModel';
import { CompositeModel } from './CompositeModel';

/**
 * Creates a Layer One Ring with 6 SingleCUT models arranged in a hexagonal pattern
 * This model has shared panels between adjacent SingleCUTs
 */
export class LayerOneModel extends CompositeModel {
    constructor(scene, position = new Vector3(0, 0, 0), options = {}) {
        // Default options
        const defaultOptions = {
            outerRadius: 42,
            singleCutRadius: 21, // Radius for each individual SingleCUT
            debug: false, // Enable/disable debug logging
            showRadiusLines: false, // Whether to show radius lines on the ground
            rotationAngle: 60, // Default rotation angle in degrees
            panelHeight: 1000, // Height of panels
            panelDepth: 0.1,  // Depth of panels
            panelColor: new Color3(0.2, 0.6, 0.8), // Color of panels
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
        this.debugLog(`Rotated Layer One Ring by ${this.options.rotationAngle} degrees`);
    }
    
    /**
     * Create all the SingleCUT models and shared panels
     */
    createModels() {
        this.debugLog('Creating Layer One Ring model');
        
        // Track permanently hidden elements for scene editor
        this.permanentlyHiddenElements = [];
        
        // Store SingleCUTs and shared panels
        this.panels = [];
        const singleCuts = [];
        const singleCutPositions = [];
        
        // Create 6 SingleCUTs in a hexagonal pattern without panels
        for (let i = 0; i < 6; i++) {
            const angle = (i * 2 * Math.PI) / 6;

            // Calculate the radius for this SingleCUT
            let radius = this.options.outerRadius;
            
            const x = radius * Math.cos(angle);
            const z = radius * Math.sin(angle);
            
            const position = new Vector3(x, 0, z);
            singleCutPositions.push(position);
            
            this.debugLog(`Creating SingleCUT #${i+1} at (${x.toFixed(2)}, 0, ${z.toFixed(2)}) with angle ${(angle * 180 / Math.PI).toFixed(2)}°`);
            
            // Create a SingleCUT without internal panels
            const singleCut = new SingleCutModel(this.scene, position, {
                radius: this.options.singleCutRadius,
                skipPanels: true // A flag to signal the SingleCUT not to create its own panels
            });
            
            this.addChild(singleCut);
            singleCuts.push(singleCut);
            
            // Arrays of pipes that would normally be hidden (for reference only)
            const pipesToHide = {
                1: [5, 4, 3], // Cut 1: pipes 5, 4, 3
                2: [6, 5, 4], // Cut 2: pipes 6, 5, 4
                3: [1, 6, 5], // Cut 3: pipes 1, 6, 5
                4: [2, 1, 6], // Cut 4: pipes 2, 1, 6
                5: [3, 2, 1], // Cut 5: pipes 3, 2, 1
                6: [4, 3, 2]  // Cut 6: pipes 4, 3, 2
            };
            
            // Log pipes for this cut (but don't hide them)
            const cutNumber = i + 1;
            if (pipesToHide[cutNumber]) {
                pipesToHide[cutNumber].forEach(pipeNumber => {
                    // Convert from 1-indexed to 0-indexed
                    const pipeIndex = pipeNumber - 1;
                    
                    // No longer hiding pipes
                    // singleCut.pipes[pipeIndex].setVisible(false);
                    // singleCut.pipes[pipeIndex].isPermanentlyHidden = true;
                    
                    this.debugLog(`NOT hiding pipe ${pipeNumber} for SingleCUT #${cutNumber} (all pipes shown)`);
                });
            }
        }
        
        // Now create shared panels between adjacent SingleCUTs
        for (let i = 0; i < 6; i++) {
            const nextIndex = (i + 1) % 6;
            
            // Get the positions of adjacent SingleCUTs
            const currentPos = singleCutPositions[i];
            const nextPos = singleCutPositions[nextIndex];
            
            // Get the pipe positions for panel connections
            const currentSingleCut = singleCuts[i];
            const nextSingleCut = singleCuts[nextIndex];
            
            // For each SingleCUT, find the pipe that faces the next SingleCUT
            // Let's assume pipe index k faces next SingleCUT when using a specific arrangement
            // For a hexagonal arrangement, the pipes should be consistently oriented
            // We need the position of the pipe that faces the next SingleCUT
            
            // In a hexagonal arrangement, if SingleCUTs are numbered 0-5 clockwise,
            // pipe 0 of SingleCUT i should face towards pipe 3 of SingleCUT (i+1)%6
            // pipe index to use from currentSingleCut
            const currentPipeIndex = (i + 2) % 6;  // Pipe facing next SingleCUT
            const nextPipeIndex = (currentPipeIndex + 3) % 6;  // Pipe on next SingleCUT facing back
            
            this.debugLog(`Creating shared panel between SingleCUT #${i+1} and SingleCUT #${nextIndex+1}`);
            this.debugLog(`Using pipe ${currentPipeIndex+1} from SingleCUT #${i+1} and pipe ${nextPipeIndex+1} from SingleCUT #${nextIndex+1}`);
            
            // Get the pipe positions
            const currentPipe = currentSingleCut.pipes[currentPipeIndex];
            const nextPipe = nextSingleCut.pipes[nextPipeIndex];
            
            if (!currentPipe || !nextPipe) {
                this.debugLog(`Warning: Could not find pipes to connect between SingleCUT #${i+1} and #${nextIndex+1}`);
                continue;
            }
            
            // Calculate panel position (midpoint between pipes)
            const panelPosition = currentPipe.rootNode.position.add(nextPipe.rootNode.position).scale(0.5);
            
            // Calculate panel width (distance between pipes minus pipe diameter)
            const pipeRadius = this.options.singleCutRadius / 10; // Assuming pipe radius is 1/10 of SingleCUT radius
            const distanceBetweenPipes = Vector3.Distance(
                currentPipe.rootNode.getAbsolutePosition(),
                nextPipe.rootNode.getAbsolutePosition()
            );
            const panelWidth = distanceBetweenPipes - (2 * pipeRadius);
            
            // Calculate panel rotation to face between pipes
            const direction = nextPipe.rootNode.position.subtract(currentPipe.rootNode.position).normalize();
            const angle = Math.atan2(direction.z, direction.x);
            
            // Create panel
            const panel = new PanelModel(this.scene, panelPosition, {
                height: this.options.panelHeight,
                width: panelWidth,
                depth: this.options.panelDepth,
                color: this.options.panelColor
            });
            
            // Rotate panel to face between pipes
            panel.rootNode.rotation = new Vector3(0, angle + Math.PI/2, 0);
            
            // Set parent to root node
            panel.rootNode.parent = this.rootNode;
            
            // Add to panels array
            this.panels.push(panel);
        }
        
        this.debugLog('Layer One Ring model creation complete with shared panels');
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
            
            const x = this.options.outerRadius * Math.cos(angle);
            const z = this.options.outerRadius * Math.sin(angle);
            
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
     * Clear all radius visualization elements
     */
    clearRadiusLines() {
        if (this.radiusLines && this.radiusLines.length > 0) {
            this.radiusLines.forEach(line => {
                if (line) {
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
        
        this.debugLog('Radius settings updated and models recreated');
    }
    
    /**
     * Dispose all child models
     */
    disposeChildren() {
        if (this.childModels && this.childModels.length > 0) {
            this.childModels.forEach(child => {
                if (child && typeof child.dispose === 'function') {
                    child.dispose();
                }
            });
            this.childModels = [];
        }
        
        // Dispose shared panels
        if (this.panels && this.panels.length > 0) {
            this.panels.forEach(panel => {
                if (panel && typeof panel.dispose === 'function') {
                    panel.dispose();
                }
            });
            this.panels = [];
        }
    }
    
    /**
     * Check if a pipe or panel is permanently hidden
     * @param {number} modelIndex - The index of the SingleCUT (0-5)
     * @param {string} type - 'pipe' or 'panel'
     * @param {number} index - The index of the pipe or panel
     * @returns {boolean} - Whether the element is permanently hidden
     */
    isElementPermanentlyHidden(modelIndex, type, index) {
        if (!this.permanentlyHiddenElements) return false;
        
        return this.permanentlyHiddenElements.some(element => 
            element.modelIndex === modelIndex && 
            element.type === type && 
            element.index === index);
    }
    
    /**
     * Collects all pipes from all SingleCUT models
     * @returns {Array} - Array of all pipe meshes
     */
    getAllPipes() {
        return this.getAllMeshes('pipes');
    }
    
    /**
     * Provides access to all SingleCUT models
     * @returns {Array} - Array of all SingleCUT models
     */
    get singleCuts() {
        return this.getChildren();
    }
    
    /**
     * Set the visibility of radius lines
     * @param {boolean} visible - Whether the radius lines should be visible
     */
    setRadiusLinesVisible(visible) {
        this.debugLog(`Setting radius lines visibility to ${visible}`);
        
        if (visible && this.options.showRadiusLines && this.radiusLines.length === 0) {
            // If lines should be visible but don't exist yet, create them
            this.drawRadiusLines();
        } else if (!visible && this.radiusLines.length > 0) {
            // If lines should be hidden but exist, hide them
            this.radiusLines.forEach(line => {
                if (line) {
                    line.isVisible = false;
                }
            });
        } else if (visible && this.radiusLines.length > 0) {
            // If lines should be visible and already exist, show them
            this.radiusLines.forEach(line => {
                if (line) {
                    line.isVisible = true;
                }
            });
        }
    }
    
    /**
     * Update the rotation of the model
     * @param {number} rotationAngleDegrees - New rotation angle in degrees
     */
    updateRotation(rotationAngleDegrees) {
        // First, reset rotation to zero
        this.rootNode.rotation = new Vector3(0, 0, 0);
        
        // Store the new rotation angle
        this.options.rotationAngle = rotationAngleDegrees;
        
        // Convert degrees to radians
        const rotationAngle = rotationAngleDegrees * (Math.PI / 180);
        
        // Apply the rotation around the Y axis
        this.rootNode.rotate(Axis.Y, rotationAngle, Space.WORLD);
        
        this.debugLog(`Updated Layer One Ring rotation to ${rotationAngleDegrees} degrees (${rotationAngle.toFixed(2)} radians)`);
    }
} 