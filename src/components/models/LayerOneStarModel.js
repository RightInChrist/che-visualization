import { Vector3, Color3, MeshBuilder, StandardMaterial, Axis, Space, Mesh } from '@babylonjs/core';
import { SingleCutModel } from './SingleCutModel';
import { CompositeModel } from './CompositeModel';

/**
 * Creates a Layer One Star with 6 SingleCUT models arranged in a star-shaped hexagonal pattern
 * In this model, SingleCUTs only share pipes but maintain their individual panels
 */
export class LayerOneStarModel extends CompositeModel {
    constructor(scene, position = new Vector3(0, 0, 0), options = {}) {
        // Default options
        const defaultOptions = {
            outerRadius: 42,
            singleCutRadius: 21, // Radius for each individual SingleCUT
            debug: false, // Enable/disable debug logging
            showRadiusLines: false, // Whether to show radius lines on the ground
            rotationAngle: 60, // Default rotation angle in degrees
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
        this.debugLog(`Rotated Layer One Star by ${this.options.rotationAngle} degrees`);
    }
    
    /**
     * Create all the SingleCUT models
     */
    createModels() {
        this.debugLog('Creating Layer One Star model');
        
        // Track permanently hidden elements for scene editor
        this.permanentlyHiddenElements = [];
        
        // Create 6 SingleCUTs in a hexagonal pattern
        for (let i = 0; i < 6; i++) {
            const angle = (i * 2 * Math.PI) / 6;

            // Calculate the radius for this SingleCUT
            let radius = this.options.outerRadius;
            
            const x = radius * Math.cos(angle);
            const z = radius * Math.sin(angle);
            
            const position = new Vector3(x, 0, z);
            
            this.debugLog(`Creating SingleCUT #${i+1} at (${x.toFixed(2)}, 0, ${z.toFixed(2)}) with angle ${(angle * 180 / Math.PI).toFixed(2)}°`);
            
            const singleCut = new SingleCutModel(this.scene, position, {
                radius: this.options.singleCutRadius
            });
            
            this.addChild(singleCut);
            
            // Arrays of panels and pipes that would normally be hidden (for reference only)
            const panelsToHide = {
                1: [3, 4], // Cut 1: panels 3 and 4
                2: [4, 5], // Cut 2: panels 4 and 5
                3: [5, 6], // Cut 3: panels 5 and 6
                4: [6, 1], // Cut 4: panels 6 and 1
                5: [1, 2], // Cut 5: panels 1 and 2
                6: [2, 3]  // Cut 6: panels 2 and 3
            };
            
            const pipesToHide = {
                1: [5, 4, 3], // Cut 1: pipes 5, 4, 3
                2: [6, 5, 4], // Cut 2: pipes 6, 5, 4
                3: [1, 6, 5], // Cut 3: pipes 1, 6, 5
                4: [2, 1, 6], // Cut 4: pipes 2, 1, 6
                5: [3, 2, 1], // Cut 5: pipes 3, 2, 1
                6: [4, 3, 2]  // Cut 6: pipes 4, 3, 2
            };
            
            // Log panels for this cut (but don't hide them)
            const cutNumber = i + 1;
            if (panelsToHide[cutNumber]) {
                panelsToHide[cutNumber].forEach(panelNumber => {
                    // Convert from 1-indexed to 0-indexed
                    const panelIndex = panelNumber - 1;
                    
                    // No longer hiding panels
                    // singleCut.panels[panelIndex].setVisible(false);
                    // singleCut.panels[panelIndex].isPermanentlyHidden = true;
                    
                    this.debugLog(`NOT hiding panel ${panelNumber} for SingleCUT #${cutNumber} (all panels shown)`);
                });
            }
            
            // Log pipes for this cut (but don't hide them)
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
        
        this.debugLog('Layer One Star model creation complete');
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
        // Simply return the childModels array from CompositeModel
        return this.childModels;
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
        // Convert to radians
        const rotationAngle = (rotationAngleDegrees * Math.PI) / 180;
        
        // Update root node rotation
        this.rootNode.rotation = new Vector3(0, rotationAngle, 0);
        
        // Store the current angle
        this.options.rotationAngle = rotationAngleDegrees;
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
        return 30; // Minimum sensible radius for LayerOneStar
    }
    
    /**
     * Get the max outer radius value for this model
     * @returns {number} - Maximum outer radius
     */
    getMaxRadius() {
        return 60; // Maximum sensible radius for LayerOneStar
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
} 