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
            panelHeight: 930, // meters - changed from 1000 to 930
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
        
        // Initialize panel rotation state with good values
        this.initializePanelRotations();
        
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
     * Initialize panel rotations with correct values
     */
    initializePanelRotations() {
        const cornerCount = this.options.cornerCount || 6;
        
        // Create an array of rotation data objects that will be passed by reference
        this.rotations = [];
        
        // Create legacy structures for backward compatibility
        this.panelRotations = {
            currentDelta: 0,
            defaultAngles: [],
            currentAngles: []
        };
        
        // Initialize rotations for each panel
        for (let i = 0; i < cornerCount; i++) {
            // Calculate default angle in radians and convert to degrees
            const defaultAngle = this.getDefaultPanelRotation(i);  // In radians
            const defaultAngleDegrees = defaultAngle * 180 / Math.PI;
            
            // Create a rotation object that will be passed by reference to the panel
            const rotation = {
                id: `panel-${i}`,
                name: `Panel ${i + 1}`,
                index: i,
                baseRotation: defaultAngleDegrees,  // The base/default rotation
                value: defaultAngleDegrees,         // The current rotation value (will be modified)
                delta: 0                           // The delta from base rotation
            };
            
            // Add to our rotations array
            this.rotations.push(rotation);
            
            // Store in legacy formats for compatibility
            this.panelRotations.defaultAngles[i] = defaultAngleDegrees;
            this.panelRotations.currentAngles[i] = defaultAngleDegrees;
        }
        
        this.debugLog('Panel rotations initialized:');
        this.debugLog(`- Created ${this.rotations.length} rotation entries`);
        this.debugLog(`- Default angles: ${this.rotations.map(r => r.value.toFixed(1) + '°').join(', ')}`);
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
        
        // Verify that panel rotation data is initialized
        if (!this.rotations || this.rotations.length === 0) {
            this.debugLog('Panel rotation data not initialized, doing it now');
            this.initializePanelRotations();
        }
        
        for (let i = 0; i < cornerCount; i++) {
            const nextIndex = (i + 1) % cornerCount;
            
            this.debugLog(`Creating panel ${i+1} between pipes ${i+1} and ${nextIndex+1}`);
            
            // Get positions from cornerNodes and calculate panel transform
            const currentPipePos = this.cornerNodes[i].position.clone();
            const nextPipePos = this.cornerNodes[nextIndex].position.clone();
            
            // Calculate position and orientation for the panel
            const transform = this.calculatePanelTransform(i, currentPipePos, nextPipePos);
            
            // Get rotation data for this panel
            const panelData = this.rotations[i];
            
            this.debugLog(`Panel #${i+1} default angle: ${panelData.baseRotation.toFixed(1)}°`);
            
            // Create panel with calculated transform
            const panel = this.createPanel(transform.position, transform.rotation, transform.width, i);
            
            // Share rotation state with the panel
            panel.rotationState = this.panelRotations;
            panel.panelIndex = i;
            panel.rotationData = panelData;  // Link the specific panel data
            
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
        
        // Set Y position to 70 meters (panel starts 70m above ground)
        position.y = 70;
        
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
        // Get the rotation object for this panel
        const rotationObj = this.rotations[index];
        
        const panel = new PanelModel(this.scene, position, {
            height: this.options.panelHeight,
            width: width,
            depth: this.options.panelDepth,
            color: this.options.pipeColor,
            rotation: rotationObj // Pass the rotation object by reference
        });
        
        // Apply base rotation from the angle between pipes
        panel.rootNode.rotation = rotation.clone();
        
        this.debugLog(`Panel ${index+1}: Initial pipe-to-pipe rotation: ` +
                     `X: ${this.radToDeg(rotation.x)}, Y: ${this.radToDeg(rotation.y)}, Z: ${this.radToDeg(rotation.z)}`);
        
        // Store the rotation object directly on the panel for easy access
        panel.rotation = rotationObj;
        
        // Legacy references for backward compatibility
        panel.rotationState = this.panelRotations;
        panel.panelIndex = index;
        
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
        
        // Apply rotations to all panels
        this.panels.forEach((panel, i) => {
            if (panel && panel.rootNode) {
                // Store initial rotation if not already stored
                if (!panel.initialRotation && panel.storeInitialRotation) {
                    panel.storeInitialRotation();
                }
                
                // Get the rotation object for this panel - it's a reference
                const rotation = this.rotations[i];
                
                // Apply delta to the rotation value
                if (currentDelta !== 0) {
                    rotation.delta = currentDelta;
                    rotation.value = rotation.baseRotation + currentDelta;
                }
                
                this.debugLog(`Panel #${i+1}: Applying rotation of ${rotation.value.toFixed(1)}° (base: ${rotation.baseRotation.toFixed(1)}°, delta: ${rotation.delta}°)`);
                
                // Apply rotation to the panel's rootNode
                const totalAngleRad = rotation.value * Math.PI / 180;
                panel.rootNode.rotation.y = totalAngleRad;
                
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
     * Gets the rotation information for all children (panels)
     * Implementation simply returns the rotation objects array by reference
     * @returns {Array} - Array of rotation objects that are passed by reference
     */
    getChildrenRotations() {
        return this.rotations;
    }

    /**
     * Apply the rotation to the model's physical representation
     * @param {number} rotationAngle - The rotation angle in degrees
     */
    applyModelRotation(rotationAngle) {
        // Convert to radians
        const rotationAngleRadians = (rotationAngle * Math.PI) / 180;
        
        // Update root node rotation around Y axis
        if (this.rootNode) {
            this.rootNode.rotation.y = rotationAngleRadians;
        }
        
        // Store the current angle in options for backward compatibility
        this.options.rotationAngle = rotationAngle;
        
        this.debugLog(`Applied ${this.getName()} rotation: ${rotationAngle}°`);
    }
    
    /**
     * Gets or sets rotation information for this model
     * @returns {Object} - The rotation object that can be modified by reference
     */
    getRotation() {
        // Initialize a rotation object if it doesn't exist
        if (!this._rotation) {
            this._rotation = {
                angle: this.options.rotationAngle || 0,  // Current rotation angle in degrees
                min: 0,                                  // Minimum rotation angle
                max: 360,                                // Maximum rotation angle
                default: this.options.rotationAngle || 0 // Default rotation angle
            };
            
            // Define a setter for the angle property that applies the rotation when changed
            Object.defineProperty(this._rotation, 'angle', {
                get: () => this._rotationAngle || 0,
                set: (value) => {
                    this._rotationAngle = value;
                    this.applyModelRotation(value);
                }
            });
        }
        
        return this._rotation;
    }

    /**
     * Override getName to return "CUT"
     * @returns {string} The display name for this model
     */
    getName() {
        return "CUT";
    }
} 