import { Vector3, Color3, MeshBuilder, StandardMaterial, Axis, Space, Mesh } from '@babylonjs/core';
import { SingleCutModel } from './SingleCutModel';
import { CompositeModel } from './CompositeModel';

/**
 * Creates a Seven CUTs model with 7 SingleCUT models arranged in a specific pattern
 * One central SingleCUT and 6 surrounding in a larger hexagonal pattern with overlap
 */
export class SevenCutsModel extends CompositeModel {
    constructor(scene, position = new Vector3(0, 0, 0), options = {}) {
        // Default options
        const defaultOptions = {
            outerRadius: 42,
            singleCutRadius: 21, // Radius for each individual SingleCUT
            debug: false, // Enable/disable debug logging,
            showRadiusLines: false, // Whether to show radius lines on the ground (changed to false by default)
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
    }
    
    /**
     * Create all the SingleCUT models
     */
    createModels() {
        this.debugLog('Creating Seven CUTs model');
        
        // Track permanently hidden elements for scene editor
        this.permanentlyHiddenElements = [];
        
        // Create center SingleCUT
        const centerCut = new SingleCutModel(this.scene, new Vector3(0, 0, 0), {
            radius: this.options.singleCutRadius
        });
        this.addChild(centerCut);
        
        this.debugLog('Created center SingleCUT at (0, 0, 0)');
        
        // Create 6 surrounding SingleCUTs in a hexagonal pattern
        for (let i = 0; i < 6; i++) {
            const angle = (i * 2 * Math.PI) / 6 - (Math.PI / 6);

            // Calculate the radius for this SingleCUT
            let radius = this.options.outerRadius;
            
            const x = radius * Math.cos(angle);
            const z = radius * Math.sin(angle);
            
            const position = new Vector3(x, 0, z);
            
            this.debugLog(`Creating SingleCUT #${i+2} at (${x.toFixed(2)}, 0, ${z.toFixed(2)}) with angle ${(angle * 180 / Math.PI).toFixed(2)}°`);
            console.log(`Creating SingleCUT #${i+2} at (${x.toFixed(2)}, 0, ${z.toFixed(2)}) with angle ${(angle * 180 / Math.PI).toFixed(2)}°`);
            
            const singleCut = new SingleCutModel(this.scene, position, {
                radius: this.options.singleCutRadius
            });
            
            this.addChild(singleCut);
            
            // Hide overlapping pipes and panels for outer SingleCUTs
            // Each outer SingleCUT needs to hide:
            // 1. The pipe facing the center
            // 2. The pipe clockwise to the center-facing pipe
            // 3. The panel connecting these two pipes
            // 4. The panel before the center-facing pipe
            
            // Calculate which pipe is pointing toward the center (opposite of the angle)
            const centerFacingIndex = this.getIndexFacingCenter(i, angle);
            
            // Permanently hide specific panels and pipes for each outer SingleCUT
            // Each panel/pipe index is adjusted from 1-based (user input) to 0-based (code)
            
            // Get the cut number (2-7, where i=0 means cut #2)
            const cutNumber = i + 2;
            
            // Arrays of panels and pipes to hide for each cut (specified as 1-indexed)
            const panelsToHide = {
                2: [3, 4], // Cut 2: panels 3 and 4
                3: [4, 5], // Cut 3: panels 4 and 5
                4: [5, 6], // Cut 4: panels 5 and 6
                5: [6, 1], // Cut 5: panels 6 and 1
                6: [1, 2], // Cut 6: panels 1 and 2
                7: [2, 3]  // Cut 7: panels 2 and 3
            };
            
            const pipesToHide = {
                2: [5, 4, 3], // Cut 2: pipes 5, 4, 3
                3: [6, 5, 4], // Cut 3: pipes 6, 5, 4
                4: [1, 6, 5], // Cut 4: pipes 1, 6, 5
                5: [2, 1, 6], // Cut 5: pipes 2, 1, 6
                6: [3, 2, 1], // Cut 6: pipes 3, 2, 1
                7: [4, 3, 2]  // Cut 7: pipes 4, 3, 2
            };
            
            // Hide panels for this cut
            if (panelsToHide[cutNumber]) {
                panelsToHide[cutNumber].forEach(panelNumber => {
                    // Convert from 1-indexed to 0-indexed
                    const panelIndex = panelNumber - 1;
                    
                    singleCut.panels[panelIndex].setVisible(false);
                    singleCut.panels[panelIndex].isPermanentlyHidden = true;
                    this.permanentlyHiddenElements.push({
                        modelIndex: i + 1,
                        type: 'panel',
                        index: panelIndex
                    });
                    this.debugLog(`Hiding panel ${panelNumber} for SingleCUT #${cutNumber}`);
                });
            }
            
            // Hide pipes for this cut
            if (pipesToHide[cutNumber]) {
                pipesToHide[cutNumber].forEach(pipeNumber => {
                    // Convert from 1-indexed to 0-indexed
                    const pipeIndex = pipeNumber - 1;
                    
                    singleCut.pipes[pipeIndex].setVisible(false);
                    singleCut.pipes[pipeIndex].isPermanentlyHidden = true;
                    this.permanentlyHiddenElements.push({
                        modelIndex: i + 1,
                        type: 'pipe',
                        index: pipeIndex
                    });
                    this.debugLog(`Hiding pipe ${pipeNumber} for SingleCUT #${cutNumber}`);
                });
            }
        }
        
        this.debugLog('Seven CUTs model creation complete');
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
        
        // Create material for SingleCUT #2 radius
        const specialRadiusMaterial = new StandardMaterial("specialRadiusMaterial", this.scene);
        specialRadiusMaterial.diffuseColor = new Color3(0, 0.7, 0.7);
        specialRadiusMaterial.alpha = 0.8;
        specialRadiusMaterial.specularColor = new Color3(0.2, 0.2, 0.2);
        specialRadiusMaterial.emissiveColor = new Color3(0, 0.4, 0.4);
        
        // Create material for SingleCUT internal radius
        const internalRadiusMaterial = new StandardMaterial("internalRadiusMaterial", this.scene);
        internalRadiusMaterial.diffuseColor = new Color3(0.7, 0, 0.7);
        internalRadiusMaterial.alpha = 0.8;
        internalRadiusMaterial.specularColor = new Color3(0.2, 0.2, 0.2);
        internalRadiusMaterial.emissiveColor = new Color3(0.4, 0, 0.4);
        
        // Create circle for the standard radius (250 units)
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
        
        // Create circle for SingleCUT #2 special radius (200 units)
        const specialCircle = MeshBuilder.CreateDisc("specialRadiusLine", {
            radius: 200, // Special radius for SingleCUT #2
            tessellation: 64,
            sideOrientation: Mesh.DOUBLESIDE
        }, this.scene);
        specialCircle.material = specialRadiusMaterial;
        specialCircle.position.y = heightOffset * 2; // Slightly above the standard circle
        specialCircle.rotation.x = Math.PI / 2; // Rotate to lie flat
        specialCircle.parent = this.rootNode;
        this.radiusLines.push(specialCircle);
        
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
            
            // Calculate the radius for this SingleCUT
            let radius = this.options.outerRadius;
            if (i === 0) {
                radius = 200; // Special case for SingleCUT #2
            }
            
            const x = radius * Math.cos(angle);
            const z = radius * Math.sin(angle);
            
            // Create a line from center to the SingleCUT position
            const line = MeshBuilder.CreateLines("radiusLine_" + i, {
                points: [
                    new Vector3(0, heightOffset * 4, 0),
                    new Vector3(x, heightOffset * 4, z)
                ]
            }, this.scene);
            
            // Set the line color based on whether it's the special case
            if (i === 0) {
                line.color = new Color3(0, 0.7, 0.7); // Cyan for special case
            } else {
                line.color = new Color3(0.7, 0.7, 0); // Yellow for standard cases
            }
            
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
     * @param {number} modelIndex - The index of the SingleCUT (1-7, where 1 is center)
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
     * Calculate the index of the pipe facing the center for an outer SingleCUT
     * @param {number} modelIndex - The index of the SingleCUT (0-5)
     * @param {number} modelAngle - The angle of the SingleCUT from the center
     * @returns {number} - The index of the pipe facing the center (0-5)
     */
    getIndexFacingCenter(modelIndex, modelAngle) {
        // The pipe direction is opposite of the model's angle from center
        // Convert this to an index in the range 0-5 based on the closest pipe angle
        
        // Inverse angle (pointing toward center)
        const inverseAngle = (modelAngle + Math.PI) % (2 * Math.PI);
        
        // Convert angle to pipe index (finding closest pipe to this angle)
        // Each pipe is at 60° (π/3 radians) intervals
        const normalizedAngle = inverseAngle < 0 ? inverseAngle + 2 * Math.PI : inverseAngle;
        const pipeIndex = Math.round(normalizedAngle / (Math.PI / 3)) % 6;
        
        return pipeIndex;
    }
    
    /**
     * Collects all pipes from all SingleCUT models
     * @returns {Array} - Array of all pipe meshes
     */
    getAllPipes() {
        return this.getAllMeshes('pipes');
    }
    
    /**
     * Provides access to all SingleCUT models (for backward compatibility)
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
} 