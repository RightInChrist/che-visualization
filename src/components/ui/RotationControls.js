import * as BABYLON from '@babylonjs/core';
import '@babylonjs/gui';
import { AdvancedDynamicTexture, Grid, Rectangle, TextBlock, Slider, Button, Control } from '@babylonjs/gui';
import { ModelConfigHelper } from './ModelConfigHelper';

/**
 * Creates slider controls for adjusting the rotation parameters of multiple models
 */
export class RotationControls {
    /**
     * Create a new RotationControls instance
     * @param {BABYLON.Scene} scene - The scene
     * @param {Object} models - Single model or array of models to control
     * @param {Object} options - Additional options
     */
    constructor(scene, models, options = {}) {
        this.scene = scene;
        
        // Handle both single model and array of models
        this.models = Array.isArray(models) ? models : [models];
        
        // Default options
        const defaultOptions = {
            position: { x: 10, y: 350 }, // Position of the controls container
            width: 350,              // Width of the controls container
            height: 200,             // Height of the controls container
            backgroundColor: "#222222", // Background color
            textColor: "#ffffff",    // Text color
            sliderBarColor: "#444444", // Slider bar color
            sliderThumbColor: "#00aaff", // Slider thumb color
            isVisible: false,        // Initially hidden to avoid clutter
            modelNames: null,        // Array of names for models, or null for auto-naming
            recursive: true,         // Whether to recursively handle children
            defaultIndentation: 20   // Indentation per level for nested controls
        };
        
        this.options = { ...defaultOptions, ...options };
        
        // Get model configurations recursively
        this.modelConfigs = ModelConfigHelper.getModelsConfigs(this.models, this.options.modelNames);
        
        // Create the UI for the rotation controls
        this.createUI();
        
        console.log("RotationControls initialized with", this.models.length, "models");
    }
    
    /**
     * Create the UI components for the rotation controls
     */
    createUI() {
        try {
            console.log("Creating RotationControls UI");
            
            // Find the control panels container
            this.controlPanels = document.getElementById('controlPanels');
            if (!this.controlPanels) {
                console.error("Control panels container not found");
                return;
            }
            
            // Create HTML panel for rotation controls
            this.panel = document.createElement('div');
            this.panel.id = 'rotationControlPanel';
            this.panel.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            this.panel.style.padding = '10px';
            this.panel.style.borderRadius = '5px';
            this.panel.style.color = this.options.textColor;
            this.panel.style.display = this.options.isVisible ? 'block' : 'none';
            this.panel.style.pointerEvents = 'auto'; // Enable pointer events for sliders
            
            // Add scrolling capability
            this.panel.style.maxHeight = '70vh'; // 70% of viewport height
            this.panel.style.overflowY = 'auto'; // Add vertical scrollbar when needed
            this.panel.style.scrollBehavior = 'smooth'; // Smooth scrolling
            
            // Create title
            const title = document.createElement('h3');
            title.textContent = 'Rotation Controls';
            title.style.margin = '0 0 10px 0';
            this.panel.appendChild(title);
            
            // Create model sections for each model
            this.modelConfigs.forEach((config, index) => {
                const modelSection = this.createModelSection(config, index, 0);
                this.panel.appendChild(modelSection);
            });
            
            // Add the panel to the control panels container
            this.controlPanels.appendChild(this.panel);
            
            // Create HTML button for radius controls toggle
            this.createHTMLToggleButton();
            
            console.log("RotationControls UI created successfully");
        } catch (error) {
            console.error("Error creating RotationControls UI:", error);
        }
    }
    
    /**
     * Create a section for a model with all its rotation controls recursively
     * @param {Object} config - Model configuration
     * @param {number} modelIndex - Model index
     * @param {number} level - Nesting level (0 for top level)
     * @returns {HTMLElement} - The model section container
     */
    createModelSection(config, modelIndex, level) {
        // Create model section container
        const modelSection = document.createElement('div');
        modelSection.className = 'model-section';
        modelSection.style.marginBottom = '15px';
        modelSection.style.marginLeft = `${level * this.options.defaultIndentation}px`;
        modelSection.style.paddingLeft = level > 0 ? '10px' : '0';
        modelSection.style.borderLeft = level > 0 ? '1px solid #444' : 'none';
        
        // Create header with model name
        const header = document.createElement('div');
        header.className = 'model-header';
        header.style.marginBottom = '10px';
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        
        const modelName = document.createElement('h4');
        modelName.textContent = config.name;
        modelName.style.margin = '0';
        modelName.style.color = '#eee';
        
        header.appendChild(modelName);
        modelSection.appendChild(header);
        
        // Check if this model has child SingleCUT models (applies to LayerOne, LayerTwo, etc.)
        const model = config.model;
        const hasSingleCutChildren = model && model.childModels && 
            model.childModels.some(child => child && child.constructor.name === 'SingleCutModel');
        
        // Check if model supports global delta rotation control
        const supportsDeltaRotation = model && 
            typeof model.updateAllSingleCutRotations === 'function';
        
        // Special handling for models with SingleCUT children that support delta rotation
        if (hasSingleCutChildren && supportsDeltaRotation) {
            // Create container for the master delta control
            const masterDeltaContainer = document.createElement('div');
            masterDeltaContainer.className = 'master-delta-container';
            masterDeltaContainer.style.border = '1px solid #555';
            masterDeltaContainer.style.borderRadius = '5px';
            masterDeltaContainer.style.padding = '10px';
            masterDeltaContainer.style.marginBottom = '15px';
            masterDeltaContainer.style.backgroundColor = 'rgba(0, 50, 100, 0.2)';
            
            // Create header for master control
            const masterHeader = document.createElement('div');
            masterHeader.style.marginBottom = '8px';
            masterHeader.style.display = 'flex';
            masterHeader.style.justifyContent = 'space-between';
            masterHeader.style.alignItems = 'center';
            
            const modelTypeName = model.constructor.name.replace('Model', '');
            const masterTitle = document.createElement('h5');
            masterTitle.textContent = `${modelTypeName} Master Rotation Control`;
            masterTitle.style.margin = '0';
            masterTitle.style.color = '#4CAF50';
            masterTitle.style.fontWeight = 'bold';
            
            masterHeader.appendChild(masterTitle);
            masterDeltaContainer.appendChild(masterHeader);
            
            // Get min/max/default values using methods if available, otherwise use sensible defaults
            const min = typeof model.getMinSingleCutDeltaRotation === 'function' ? 
                model.getMinSingleCutDeltaRotation() : -180;
            const max = typeof model.getMaxSingleCutDeltaRotation === 'function' ? 
                model.getMaxSingleCutDeltaRotation() : 180;
            const defaultValue = typeof model.getDefaultSingleCutDeltaRotation === 'function' ? 
                model.getDefaultSingleCutDeltaRotation() : 0;
            const currentValue = typeof model.getCurrentSingleCutDeltaRotation === 'function' ? 
                model.getCurrentSingleCutDeltaRotation() : 0;
            
            // Create the global delta rotation slider
            const deltaSlider = this.createSliderRow(
                "Global SingleCUT Delta",
                min,
                max,
                currentValue || defaultValue,
                (value) => {
                    console.log(`Setting global delta rotation for ${model.constructor.name} to ${value}°`);
                    model.updateAllSingleCutRotations(value);
                }
            );
            
            // Add some styling to make it stand out
            deltaSlider.style.backgroundColor = 'rgba(0, 100, 0, 0.1)';
            deltaSlider.style.padding = '5px';
            deltaSlider.style.borderRadius = '3px';
            
            masterDeltaContainer.appendChild(deltaSlider);
            
            // Add dropdown to view all SingleCUT rotation values
            const dropdownContainer = document.createElement('div');
            dropdownContainer.style.marginTop = '10px';
            
            const dropdownToggle = document.createElement('button');
            dropdownToggle.textContent = 'Show SingleCUT Rotation Values ▼';
            dropdownToggle.style.backgroundColor = '#444';
            dropdownToggle.style.color = '#fff';
            dropdownToggle.style.border = '1px solid #555';
            dropdownToggle.style.borderRadius = '3px';
            dropdownToggle.style.padding = '5px 10px';
            dropdownToggle.style.cursor = 'pointer';
            dropdownToggle.style.width = '100%';
            dropdownToggle.style.textAlign = 'left';
            
            const rotationValuesList = document.createElement('div');
            rotationValuesList.style.display = 'none';
            rotationValuesList.style.marginTop = '5px';
            rotationValuesList.style.border = '1px solid #555';
            rotationValuesList.style.borderRadius = '3px';
            rotationValuesList.style.padding = '5px';
            rotationValuesList.style.backgroundColor = '#333';
            rotationValuesList.style.maxHeight = '200px';
            rotationValuesList.style.overflowY = 'auto';
            
            // Function to update rotation values in the dropdown
            const updateRotationValues = () => {
                rotationValuesList.innerHTML = '';
                
                if (model && model.childModels) {
                    // Only include SingleCutModel children
                    const singleCutChildren = model.childModels.filter(
                        child => child && child.constructor.name === 'SingleCutModel'
                    );
                    
                    singleCutChildren.forEach((singleCut, index) => {
                        if (singleCut) {
                            const valueRow = document.createElement('div');
                            valueRow.style.display = 'flex';
                            valueRow.style.justifyContent = 'space-between';
                            valueRow.style.padding = '3px 0';
                            valueRow.style.borderBottom = index < singleCutChildren.length - 1 ? 
                                '1px solid #444' : 'none';
                            
                            const label = document.createElement('span');
                            label.textContent = `CUT #${index + 1}:`;
                            label.style.fontWeight = 'bold';
                            
                            const value = document.createElement('span');
                            const rotation = singleCut.options?.rotationAngle || 0;
                            
                            // Show original rotation if available
                            if (typeof singleCut.originalRotation !== 'undefined') {
                                value.textContent = `${rotation.toFixed(0)}° (Base: ${singleCut.originalRotation.toFixed(0)}°)`;
                            } else {
                                value.textContent = `${rotation.toFixed(0)}°`;
                            }
                            
                            valueRow.appendChild(label);
                            valueRow.appendChild(value);
                            rotationValuesList.appendChild(valueRow);
                        }
                    });
                }
            };
            
            // Toggle dropdown visibility
            dropdownToggle.addEventListener('click', () => {
                const isVisible = rotationValuesList.style.display !== 'none';
                rotationValuesList.style.display = isVisible ? 'none' : 'block';
                dropdownToggle.textContent = isVisible ? 
                    'Show SingleCUT Rotation Values ▼' : 'Hide SingleCUT Rotation Values ▲';
                
                if (!isVisible) {
                    // Update values when showing
                    updateRotationValues();
                }
            });
            
            dropdownContainer.appendChild(dropdownToggle);
            dropdownContainer.appendChild(rotationValuesList);
            masterDeltaContainer.appendChild(dropdownContainer);
            
            // Add the master container to the model section
            modelSection.appendChild(masterDeltaContainer);
        }
        
        // Create X rotation control if available
        if (config.rotation.x !== undefined) {
            const xRotationContainer = this.createSliderRow(
                "X Rotation",
                0,
                360,
                config.rotation.x.default,
                (value) => this.onRotationChange(config.model, 'x', value)
            );
            modelSection.appendChild(xRotationContainer);
        }
        
        // Create Y rotation control if available
        if (config.rotation.y !== undefined) {
            console.log(`Creating Y rotation slider for ${config.name} with value ${config.rotation.y.default}`);
            const yRotationContainer = this.createSliderRow(
                "Y Rotation",
                config.rotation.y.min,
                config.rotation.y.max,
                config.rotation.y.default,
                (value) => this.onRotationChange(config.model, 'y', value)
            );
            modelSection.appendChild(yRotationContainer);
        } else if (config.rotation.default !== undefined) {
            // Fallback for models that only have default rotation defined
            console.log(`Creating default Y rotation slider for ${config.name} with value ${config.rotation.default}`);
            const yRotationContainer = this.createSliderRow(
                "Y Rotation",
                config.rotation.min,
                config.rotation.max,
                config.rotation.default,
                (value) => this.onRotationChange(config.model, 'y', value)
            );
            modelSection.appendChild(yRotationContainer);
        }
        
        // Create Z rotation control if available
        if (config.rotation.z !== undefined) {
            const zRotationContainer = this.createSliderRow(
                "Z Rotation",
                0,
                360,
                config.rotation.z.default,
                (value) => this.onRotationChange(config.model, 'z', value)
            );
            modelSection.appendChild(zRotationContainer);
        }
        
        // If model has children and recursive option is true, create sections for child models
        if (config.children && config.children.length > 0 && this.options.recursive) {
            // Create container for child models
            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'children-container';
            childrenContainer.style.marginTop = '10px';
            childrenContainer.style.marginLeft = `${this.options.defaultIndentation}px`;
            
            // Skip showing child SingleCUTs if we already have the master rotation control
            const shouldHideChildren = hasSingleCutChildren && supportsDeltaRotation;
            
            if (!shouldHideChildren) {
                // Create sections for each child model
                config.children.forEach((childConfig, childIndex) => {
                    const childSection = this.createModelSection(childConfig, childIndex, level + 1);
                    childrenContainer.appendChild(childSection);
                });
                
                modelSection.appendChild(childrenContainer);
            }
        }
        
        return modelSection;
    }
    
    /**
     * Create a slider row with label and value display
     * @param {string} label - Label for the slider
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @param {number} value - Initial value
     * @param {Function} onValueChange - Callback for value changes
     * @returns {HTMLElement} - The slider row container
     */
    createSliderRow(label, min, max, value, onValueChange) {
        console.log(`Creating slider for ${label} with min=${min}, max=${max}, value=${value}`);
        
        const container = document.createElement('div');
        container.style.marginBottom = '15px';
        container.style.padding = '8px';
        container.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
        container.style.borderRadius = '4px';
        
        // Create label
        const labelElement = document.createElement('div');
        labelElement.textContent = label;
        labelElement.style.marginBottom = '8px';
        labelElement.style.fontWeight = 'bold';
        container.appendChild(labelElement);
        
        // Create slider row
        const sliderRow = document.createElement('div');
        sliderRow.style.display = 'flex';
        sliderRow.style.alignItems = 'center';
        sliderRow.style.gap = '10px';
        
        // Create slider
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = min;
        slider.max = max;
        slider.value = value;
        slider.style.flex = '1';
        slider.style.height = '20px';
        slider.style.accentColor = '#00aaff';
        
        // Create value display
        const valueDisplay = document.createElement('span');
        valueDisplay.textContent = `${value}°`;
        valueDisplay.style.minWidth = '50px';
        valueDisplay.style.textAlign = 'right';
        valueDisplay.style.fontWeight = 'bold';
        valueDisplay.style.fontSize = '14px';
        
        // Create precise input field
        const preciseInput = document.createElement('input');
        preciseInput.type = 'number';
        preciseInput.min = min;
        preciseInput.max = max;
        preciseInput.step = '1';
        preciseInput.value = value;
        preciseInput.style.width = '60px';
        preciseInput.style.padding = '3px 5px';
        preciseInput.style.marginLeft = '5px';
        preciseInput.style.borderRadius = '3px';
        preciseInput.style.border = '1px solid #555';
        preciseInput.style.backgroundColor = '#333';
        preciseInput.style.color = '#fff';
        
        // Add event listener for slider
        slider.addEventListener('input', () => {
            const newValue = parseInt(slider.value);
            valueDisplay.textContent = `${newValue}°`;
            preciseInput.value = newValue;
            if (onValueChange) {
                onValueChange(newValue);
            }
        });
        
        // Add event listener for precise input
        preciseInput.addEventListener('change', () => {
            let newValue = parseInt(preciseInput.value);
            
            // Enforce min/max bounds
            if (newValue < min) newValue = min;
            if (newValue > max) newValue = max;
            
            // Update values
            preciseInput.value = newValue;
            slider.value = newValue;
            valueDisplay.textContent = `${newValue}°`;
            
            if (onValueChange) {
                onValueChange(newValue);
            }
        });
        
        // Add elements to the row
        sliderRow.appendChild(slider);
        sliderRow.appendChild(valueDisplay);
        sliderRow.appendChild(preciseInput);
        container.appendChild(sliderRow);
        
        return container;
    }
    
    /**
     * Create the HTML toggle button
     */
    createHTMLToggleButton() {
        try {
            console.log("Creating rotation controls toggle button");
            
            // First look for the controlButtons container (newer UI layout)
            let buttonContainer = document.getElementById('controlButtons');
            
            // If not found, look for the legacy container
            if (!buttonContainer) {
                buttonContainer = document.querySelector('.control-buttons-container');
            }
            
            // If still not found, create a new container
            if (!buttonContainer) {
                buttonContainer = document.createElement('div');
                buttonContainer.id = 'controlButtons';
                buttonContainer.className = 'control-buttons-container';
                buttonContainer.style.position = 'absolute';
                buttonContainer.style.top = '10px';
                buttonContainer.style.right = '20px';
                buttonContainer.style.display = 'flex';
                buttonContainer.style.flexDirection = 'row';
                buttonContainer.style.gap = '10px';
                buttonContainer.style.zIndex = '100';
                document.body.appendChild(buttonContainer);
                console.log("Created new control buttons container");
            }
            
            // Create button
            const button = document.createElement('button');
            button.id = 'rotationToggle';
            button.textContent = 'Rotation';
            button.className = 'control-button';
            button.style.backgroundColor = this.options.isVisible ? '#FF9800' : '#444444';
            button.style.color = '#fff';
            button.style.border = 'none';
            button.style.padding = '8px 16px';
            button.style.borderRadius = '4px';
            button.style.cursor = 'pointer';
            button.style.fontWeight = 'bold';
            button.style.width = '120px';
            button.style.textAlign = 'center';
            button.style.transition = 'background-color 0.3s';
            button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
            
            button.addEventListener('mouseover', () => {
                button.style.backgroundColor = this.options.isVisible ? '#FF9800' : '#666666';
            });
            
            button.addEventListener('mouseout', () => {
                button.style.backgroundColor = this.options.isVisible ? '#FF9800' : '#444444';
            });
            
            button.addEventListener('click', () => {
                console.log("Rotation toggle button clicked");
                this.toggleVisible();
            });
            
            // Add the button to the container
            buttonContainer.appendChild(button);
            console.log("Added rotation toggle button to container");
            
            // Store button reference
            this.toggleButton = button;
        } catch (error) {
            console.error("Error creating toggle button:", error);
        }
    }
    
    /**
     * Toggle visibility of the rotation controls panel
     */
    toggleVisible() {
        console.log("Toggling rotation controls visibility");
        
        const newVisibility = !this.isVisible();
        console.log(`Setting rotation controls visibility to: ${newVisibility}`);
        
        if (this.panel) {
            this.panel.style.display = newVisibility ? 'block' : 'none';
        }
        
        if (this.toggleButton) {
            this.toggleButton.style.backgroundColor = newVisibility ? '#FF9800' : '#444444';
        }
        
        // Store the visibility state
        this.options.isVisible = newVisibility;
        
        console.log(`Rotation controls visibility set to: ${this.isVisible()}`);
    }
    
    /**
     * Get visibility state of the controls
     * @returns {boolean} - Whether the controls are visible
     */
    isVisible() {
        return this.panel && this.panel.style.display === 'block';
    }
    
    /**
     * Handle changes to rotation for a specific model and axis
     * @param {Object} model - The model to update
     * @param {string} axis - The rotation axis ('x', 'y', or 'z')
     * @param {number} value - New rotation value in degrees
     */
    onRotationChange(model, axis, value) {
        if (!model) return;
        
        console.log(`Rotation change: model=${model.constructor.name}, axis=${axis}, value=${value}`);
        
        // First, check if this is a model that only supports Y-axis rotation with a single parameter
        // like LayerOneModel or LayerOneStarModel
        if (axis === 'y' && typeof model.updateRotation === 'function' && 
            typeof model.getDefaultRotation === 'function' && 
            typeof model.getMinRotation === 'function' && 
            typeof model.getMaxRotation === 'function') {
            
            console.log(`Using single-parameter updateRotation for ${model.constructor.name}`);
            
            // This appears to be a model that uses the single parameter rotation pattern
            // Call it with degrees directly
            model.updateRotation(value);
            
            // The parent model's updateRotation method should handle updating child SingleCutModels properly
            return;
        }
        
        // Handle rotation specifically for SingleCutModel
        if (model.constructor.name === 'SingleCutModel') {
            console.log(`Updating SingleCutModel rotation to ${value} degrees`);
            
            // Call the updateRotation method directly with the degree value
            if (typeof model.updateRotation === 'function') {
                model.updateRotation(value);
            }
            return;
        }
        
        // For models that support multi-axis rotation with radians
        // Convert from degrees to radians
        const valueInRadians = (value * Math.PI) / 180;
        
        // Update the model's rotation
        if (model && typeof model.updateRotation === 'function') {
            model.updateRotation(axis, valueInRadians);
        }
    }
    
    /**
     * Handle changes to all SingleCut rotations for a parent model
     * @param {Object} model - The parent model
     * @param {number} value - New rotation value in degrees for all SingleCUTs
     */
    onSingleCutRotationChange(model, value) {
        if (!model) return;
        
        console.log(`All SingleCUTs rotation change: model=${model.constructor.name}, value=${value}`);
        
        // Call the updateAllSingleCutRotations method if available
        if (typeof model.updateAllSingleCutRotations === 'function') {
            model.updateAllSingleCutRotations(value);
        }
    }
    
    /**
     * Destroy and clean up resources
     */
    dispose() {
        if (this.panel && this.panel.parentNode) {
            this.panel.parentNode.removeChild(this.panel);
        }
        
        if (this.toggleButton && this.toggleButton.parentNode) {
            this.toggleButton.parentNode.removeChild(this.toggleButton);
        }
    }
} 