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
        
        this.debugLog('SingleCUT model created with ID:', this.id);
    }
    
    /**
     * Create the model with pipes and panels
     */
    createModels() {
        this.pipes = [];
        this.panels = [];
        
        // Initialize panel rotation state that can be shared by reference
        this.panelRotations = {
            currentDelta: 0,
            defaultAngles: [],
            currentAngles: []
        };
        
        // Debug log
        this.debugLog('Creating SingleCUT model with', this.options.cornerCount, 'pipes and panels');
        
        // Create pipes at each corner of the hexagon
        this.createPipes();
        
        // Only create panels if not skipping them
        if (!this.options.skipPanels) {
            this.createPanels();
            
            // We'll defer actual panel rotation application until the scene is ready
            // The default rotations are already stored in panelRotations
        } else {
            this.debugLog('Skipping panel creation as requested by skipPanels option');
        }
        
        this.debugLog('SingleCUT model creation complete');
        
        // Log the rotation state after initialization
        this.debugLog('Panel rotation state after initialization:', JSON.stringify(this.panelRotations));
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
        
        // Initialize default and current angle arrays if they don't exist
        if (!this.panelRotations.defaultAngles) {
            this.panelRotations.defaultAngles = [];
        }
        if (!this.panelRotations.currentAngles) {
            this.panelRotations.currentAngles = [];
        }
        
        for (let i = 0; i < cornerCount; i++) {
            const nextIndex = (i + 1) % cornerCount;
            
            this.debugLog(`Creating panel ${i+1} between pipes ${i+1} and ${nextIndex+1}`);
            
            // Get positions from cornerNodes and calculate panel transform
            const currentPipePos = this.cornerNodes[i].position.clone();
            const nextPipePos = this.cornerNodes[nextIndex].position.clone();
            
            // Calculate position and orientation for the panel
            const transform = this.calculatePanelTransform(i, currentPipePos, nextPipePos);
            
            // Get default rotation angle for this panel
            const defaultAngle = this.getDefaultPanelRotation(i);
            const defaultAngleDegrees = defaultAngle * 180 / Math.PI; // Convert to degrees
            
            // Store default and current angles in the shared state
            this.panelRotations.defaultAngles[i] = defaultAngleDegrees;
            this.panelRotations.currentAngles[i] = defaultAngleDegrees; // Initialize current to default
            
            this.debugLog(`Panel #${i+1} default angle: ${defaultAngleDegrees.toFixed(1)}°`);
            
            // Create panel with calculated transform
            const panel = this.createPanel(transform.position, transform.rotation, transform.width, i);
            
            // Share rotation state with the panel
            panel.rotationState = this.panelRotations;
            panel.panelIndex = i;
            
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
        
        // Verify rotation state after panel creation
        this.debugLog('Panel rotation state after panel creation:');
        this.debugLog('  Default angles:', this.panelRotations.defaultAngles.map(a => a.toFixed(1) + '°').join(', '));
        this.debugLog('  Current angles:', this.panelRotations.currentAngles.map(a => a.toFixed(1) + '°').join(', '));
        this.debugLog('  Current delta:', this.panelRotations.currentDelta + '°');
        
        // DO NOT call scene.render() here - it's too early in initialization
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
        panel.rootNode.rotation = rotation.clone();
        
        this.debugLog(`Panel ${index+1}: Initial pipe-to-pipe rotation: ` +
                     `X: ${this.radToDeg(rotation.x)}, Y: ${this.radToDeg(rotation.y)}, Z: ${this.radToDeg(rotation.z)}`);
        
        // We now use the applyPanelDefaultRotations method for applying the specific rotations
        // during initialization, rather than applying them here.
        
        // Log final rotation
        const finalRotation = panel.rootNode.rotation;
        this.debugLog(`Panel ${index+1}: Position (${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)}), ` +
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
        
        this.debugLog(`SingleCut ${this.id}: Updated radius from ${oldRadius.toFixed(2)} to ${newRadius.toFixed(2)} (initial: ${this.initialValues.radius.toFixed(2)}, total delta: ${(newRadius - this.initialValues.radius).toFixed(2)})`);
        
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
     * Get the default rotation angle for a specific panel
     * @param {number} index - Panel index (0-based)
     * @returns {number} - Default rotation angle in radians
     */
    getDefaultPanelRotation(index) {
        // Default angles in radians
        // Panel indices 0 and 3: 60 degrees (π/3)
        // Panel indices 1 and 4: 0 degrees (0)
        // Panel indices 2 and 5: 120 degrees (2π/3)
        const cornerCount = this.options.cornerCount || 6;
        
        if (cornerCount === 6) {
            // For standard hexagon
            const normIndex = index % cornerCount;
            if (normIndex === 0 || normIndex === 3) {
                return Math.PI / 3; // 60 degrees
            } else if (normIndex === 1 || normIndex === 4) {
                return 0; // 0 degrees
            } else if (normIndex === 2 || normIndex === 5) {
                return 2 * Math.PI / 3; // 120 degrees
            }
        }
        
        // Default fallback based on position
        return (index * 2 * Math.PI) / cornerCount;
    }
    
    /**
     * Model initialization method called after scene setup
     * Applies default rotations to all panels and handles any necessary setup
     * @param {boolean} [safeMode=true] - When true, skips scene rendering during setup
     */
    onRender(safeMode = true) {
        if (!this.panels || this.panels.length === 0) {
            this.debugLog('No panels to initialize');
            return;
        }
        
        this.debugLog('Initializing panels with default rotations');
        
        // Current delta rotation (if any)
        const currentDelta = this.panelRotations.currentDelta || 0;
        
        // Apply to each panel individually
        this.panels.forEach((panel, i) => {
            if (panel && panel.rootNode) {
                // Store initial rotation if not already stored
                if (!panel.initialRotation && panel.storeInitialRotation) {
                    panel.storeInitialRotation();
                }
                
                // Get the default rotation angle for this panel
                const defaultAngle = this.getDefaultPanelRotation(i);
                const defaultAngleDegrees = defaultAngle * 180 / Math.PI;
                
                this.debugLog(`Panel #${i+1}: Applying default angle of ${defaultAngleDegrees.toFixed(1)}°`);
                
                // Apply rotation directly to panel's rotation property
                if (panel.setRotation) {
                    panel.setRotation(defaultAngle + currentDelta);
                }
                
                // Apply visibility if needed
                if (panel.setVisible) {
                    panel.setVisible(true);
                }
                
                // Apply any default material settings or other properties
                if (panel.panelMesh) {
                    // Ensure the panel is visible
                    panel.panelMesh.isVisible = true;
                }
                
                // Handle safe mode to prevent rendering during bulk operations
                if (safeMode && this.scene && panel.rootNode) {
                    // Temporarily disable rendering updates for this node
                    panel.rootNode.freezeWorldMatrix();
                }
            }
        });
        
        // If in safe mode, unfreeze all matrices after all operations are complete
        if (safeMode && this.scene) {
            // Schedule an unfreeze operation for next frame
            this.scene.onBeforeRenderObservable.addOnce(() => {
                this.panels.forEach((panel) => {
                    if (panel && panel.rootNode) {
                        panel.rootNode.unfreezeWorldMatrix();
                    }
                });
            });
        }
        
        this.debugLog('Panel initialization complete');
    }
    
    /**
     * @deprecated Use onRender() instead
     * Legacy method for backward compatibility
     */
    applyPanelDefaultRotations(safeMode = true) {
        return this.onRender(safeMode);
    }
    
    /**
     * Get current panel rotation values for all panels
     * This can be accessed by the RotationControl component
     * @returns {Object} - Object containing panel rotation information
     */
    getPanelRotations() {
        return this.panelRotations;
    }
    
    /**
     * Gets or sets the rotation information for all children (panels)
     * Implementation for SingleCutModel returns panel rotations
     * @param {number|null} deltaRotation - When provided, applies this delta rotation to all panels
     * @returns {Object} - Rotation information for panels
     */
    getChildrenRotations(deltaRotation = null) {
        // If deltaRotation is provided, apply it first
        if (deltaRotation !== null) {
            if (!this.panels || this.panels.length === 0) {
                this.debugLog(`No panels to update rotations for in ${this.getName()}`);
                return null;
            }
            
            // Update the shared rotation state
            this.panelRotations.currentDelta = deltaRotation;
            
            this.debugLog(`Updating all panels in ${this.getName()} with rotation: ${deltaRotation}°`);
            
            // Update each panel using its direct rotation methods
            this.panels.forEach((panel, i) => {
                if (panel) {
                    // Use the panel's own rotation method to handle the delta
                    if (typeof panel.applyRotationDelta === 'function') {
                        panel.applyRotationDelta(deltaRotation);
                    } else {
                        // Fallback if panel doesn't have applyRotationDelta method
                        const defaultAngle = this.getDefaultPanelRotation(i);
                        const totalAngle = defaultAngle + (deltaRotation * Math.PI / 180);
                        
                        if (panel.rootNode) {
                            panel.rootNode.rotation.y = totalAngle;
                        }
                    }
                }
            });
        }
        
        // For SingleCutModel, children are the panels
        const panelRotations = [];
        
        // Gather rotation information from each panel
        if (this.panels && this.panels.length > 0) {
            this.panels.forEach((panel, index) => {
                if (panel && panel.rootNode) {
                    const rotation = panel.rootNode.rotation.y * 180 / Math.PI; // Convert to degrees
                    const defaultAngle = this.getDefaultPanelRotation(index) * 180 / Math.PI; // Convert to degrees
                    
                    panelRotations.push({
                        id: `panel-${index}`,
                        name: `Panel ${index + 1}`,
                        rotation: rotation,
                        baseRotation: defaultAngle,
                        delta: this.panelRotations.currentDelta || 0
                    });
                }
            });
        }
        
        return {
            type: 'panels',
            currentDelta: this.panelRotations.currentDelta || 0,
            children: panelRotations
        };
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
        return this.panelRotations?.currentDelta || 0;
    }
    
    /**
     * Updates the rotation of this model
     * @param {number} rotationAngle - The rotation angle in degrees
     */
    updateRotation(rotationAngle) {
        // Convert to radians
        const rotationAngleRadians = (rotationAngle * Math.PI) / 180;
        
        // Update root node rotation around Y axis
        this.rootNode.rotation.y = rotationAngleRadians;
        
        // Store the current angle
        this.options.rotationAngle = rotationAngle;
        
        this.debugLog(`Updated ${this.getName()} rotation to ${rotationAngle}°`);
    }
    
    /**
     * @deprecated Use getChildrenRotations(deltaRotation) instead
     * Updates the rotation of all children of this model
     * @param {number} rotationAngle - The rotation angle in degrees for all children
     */
    updateChildrenRotation(rotationAngle) {
        return this.getChildrenRotations(rotationAngle);
    }
    
    /**
     * @deprecated Use updateChildrenRotation() instead
     * Updates all panel rotations with a delta value applied to their base positions
     * @param {number} deltaRotation - The delta rotation in degrees (-180 to 180)
     */
    updateAllPanelRotations(deltaRotation) {
        return this.updateChildrenRotation(deltaRotation);
    }
    
    /**
     * Override getName to return "CUT"
     * @returns {string} The display name for this model
     */
    getName() {
        return "CUT";
    }
} 