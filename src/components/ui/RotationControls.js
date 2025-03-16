import * as BABYLON from '@babylonjs/core';
import '@babylonjs/gui';
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
        
        // Get the model
        const model = config.model;
        
        // Add Y rotation control if model supports updateRotation
        if (model && typeof model.updateRotation === 'function') {
            const yRotationContainer = this.createSliderRow(
                "Y Rotation",
                0,
                360,
                model.options?.rotationAngle || 0,
                (value) => {
                    console.log(`Setting rotation for ${model.getName?.() || model.constructor.name} to ${value}°`);
                    model.updateRotation(value);
                }
            );
            modelSection.appendChild(yRotationContainer);
        }
        
        // Add child rotation control if model supports getChildrenRotations
        if (model && typeof model.getChildrenRotations === 'function') {
            // Get current child rotations - this returns an array of rotation objects by reference
            const rotations = model.getChildrenRotations();
            
            if (rotations && rotations.length > 0) {
                const childRotationContainer = document.createElement('div');
                childRotationContainer.className = 'child-rotation-container';
                childRotationContainer.style.border = '1px solid #555';
                childRotationContainer.style.borderRadius = '5px';
                childRotationContainer.style.padding = '10px';
                childRotationContainer.style.marginBottom = '15px';
                childRotationContainer.style.backgroundColor = 'rgba(0, 50, 100, 0.2)';
                
                // Create header for control
                const headerContainer = document.createElement('div');
                headerContainer.style.marginBottom = '8px';
                headerContainer.style.display = 'flex';
                headerContainer.style.justifyContent = 'space-between';
                headerContainer.style.alignItems = 'center';
                
                const title = document.createElement('h5');
                title.textContent = `${model.getName?.() || 'Child'} Rotations`;
                title.style.margin = '0';
                title.style.color = '#4CAF50';
                title.style.fontWeight = 'bold';
                
                headerContainer.appendChild(title);
                childRotationContainer.appendChild(headerContainer);
                
                // Calculate current delta (if any)
                const currentDelta = rotations.length > 0 ? rotations[0].delta : 0;
                
                // Create rotation values dropdown and get the update function
                const { container: rotationValuesDropdown, update: updateRotationValuesDisplay } = 
                    this.addChildRotationValuesDropdown(childRotationContainer, model);
                
                // Create slider for global delta
                const deltaSlider = this.createSliderRow(
                    "Delta Rotation",
                    -180,
                    180,
                    currentDelta,
                    (value) => {
                        // Apply the delta directly to all rotation objects
                        rotations.forEach(rotation => {
                            rotation.delta = value;
                            rotation.value = rotation.baseRotation + value;
                        });
                        
                        // Apply rotations to the actual panels
                        this.applyRotationsToModel(model, rotations);
                        
                        // Update the rotation values display
                        updateRotationValuesDisplay();
                    }
                );
                childRotationContainer.appendChild(deltaSlider);
                
                // Add the rotation values dropdown to the container
                childRotationContainer.appendChild(rotationValuesDropdown);
                
                modelSection.appendChild(childRotationContainer);
            }
        }
        
        // If model has children and recursive option is true, create sections for child models
        if (config.children && config.children.length > 0 && this.options.recursive) {
            // Create container for child models
            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'children-container';
            childrenContainer.style.marginTop = '10px';
            childrenContainer.style.marginLeft = `${this.options.defaultIndentation}px`;
            
            // Create sections for each child model
            config.children.forEach((childConfig, childIndex) => {
                const childSection = this.createModelSection(childConfig, childIndex, level + 1);
                childrenContainer.appendChild(childSection);
            });
            
            modelSection.appendChild(childrenContainer);
        }
        
        return modelSection;
    }
    
    /**
     * Apply the rotations from the rotation objects to the actual model panels
     * @param {Object} model - The model containing panels
     * @param {Array} rotations - Array of rotation objects
     */
    applyRotationsToModel(model, rotations) {
        if (!model || !model.panels || !rotations) return;
        
        // For each panel, apply the rotation from the corresponding rotation object
        for (let i = 0; i < Math.min(model.panels.length, rotations.length); i++) {
            const panel = model.panels[i];
            const rotation = rotations[i];
            
            if (panel && panel.rootNode && rotation) {
                // Convert rotation value from degrees to radians
                const angle = rotation.value * Math.PI / 180;
                
                // Apply to panel root node
                panel.rootNode.rotation.y = angle;
            }
        }
        
        // Update scene if needed
        if (this.scene) {
            this.scene.render();
        }
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
            
            // First look for the toggleButtons container (created in main.js)
            let buttonContainer = document.getElementById('toggleButtons');
            
            // If not found, try controlButtons container (newer UI layout)
            if (!buttonContainer) {
                buttonContainer = document.getElementById('controlButtons');
            }
            
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
     * Handle changes to all child rotations for a parent model
     * @param {Object} model - The parent model
     * @param {number} value - New rotation value in degrees for all children
     */
    onChildrenRotationChange(model, value) {
        if (!model) return;
        
        console.log(`Children rotation change: model=${model.getName?.() || model.constructor.name}, value=${value}`);
        
        // Get the rotation objects array
        if (typeof model.getChildrenRotations === 'function') {
            const rotations = model.getChildrenRotations();
            
            // Apply the delta directly to all rotation objects
            rotations.forEach(rotation => {
                rotation.delta = value;
                rotation.value = rotation.baseRotation + value;
            });
            
            // Apply the rotations to the model panels
            this.applyRotationsToModel(model, rotations);
            
            // Force update of any rotation values dropdowns that might be visible
            this.updateRotationDisplays();
        }
    }
    
    /**
     * Update all visible rotation value displays
     * This is useful when rotation changes happen outside of the direct UI interactions
     */
    updateRotationDisplays() {
        // Find all visible rotation value lists and update them
        const rotationLists = document.querySelectorAll('.child-rotation-container .rotation-values-list');
        rotationLists.forEach(list => {
            if (list.style.display !== 'none' && list.updateFunction) {
                list.updateFunction();
            }
        });
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
    
    /**
     * Add a dropdown to show all child rotation values
     * @param {HTMLElement} container - The container to add the dropdown to
     * @param {Object} model - The model to get child rotations from
     * @returns {Object} - An object containing the dropdown container and update function
     */
    addChildRotationValuesDropdown(container, model) {
        // Get child rotations - this is an array of rotation objects passed by reference
        const rotations = model.getChildrenRotations();
        
        if (!rotations || rotations.length === 0) {
            return { container: document.createElement('div'), update: () => {} };
        }
        
        // Add dropdown to view all rotation values
        const dropdownContainer = document.createElement('div');
        dropdownContainer.className = 'rotation-dropdown-container';
        dropdownContainer.style.marginTop = '10px';
        
        const dropdownToggle = document.createElement('button');
        dropdownToggle.textContent = `Show Child Rotation Values ▼`;
        dropdownToggle.style.backgroundColor = '#444';
        dropdownToggle.style.color = '#fff';
        dropdownToggle.style.border = '1px solid #555';
        dropdownToggle.style.borderRadius = '3px';
        dropdownToggle.style.padding = '5px 10px';
        dropdownToggle.style.cursor = 'pointer';
        dropdownToggle.style.width = '100%';
        dropdownToggle.style.textAlign = 'left';
        
        const rotationValuesList = document.createElement('div');
        rotationValuesList.className = 'rotation-values-list';
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
            // Only update if the list is visible
            if (rotationValuesList.style.display === 'none') return;
            
            rotationValuesList.innerHTML = '';
            
            // Display information for each rotation object
            rotations.forEach((rotation, index) => {
                const valueRow = document.createElement('div');
                valueRow.style.display = 'flex';
                valueRow.style.justifyContent = 'space-between';
                valueRow.style.padding = '3px 0';
                valueRow.style.borderBottom = index < rotations.length - 1 ? 
                    '1px solid #444' : 'none';
                
                const label = document.createElement('span');
                label.textContent = rotation.name || `Child ${index + 1}`;
                label.style.fontWeight = 'bold';
                label.title = `ID: ${rotation.id || index}`;
                
                const value = document.createElement('span');
                value.textContent = `${rotation.value.toFixed(0)}° (Base: ${rotation.baseRotation.toFixed(0)}°, Delta: ${rotation.delta}°)`;
                
                valueRow.appendChild(label);
                valueRow.appendChild(value);
                rotationValuesList.appendChild(valueRow);
            });
        };
        
        // Store update function directly on the element for later access
        rotationValuesList.updateFunction = updateRotationValues;
        
        // Toggle dropdown visibility
        dropdownToggle.addEventListener('click', () => {
            const isVisible = rotationValuesList.style.display !== 'none';
            rotationValuesList.style.display = isVisible ? 'none' : 'block';
            dropdownToggle.textContent = isVisible ? 
                `Show Child Rotation Values ▼` : `Hide Child Rotation Values ▲`;
            
            if (!isVisible) {
                // Update values when showing
                updateRotationValues();
            }
        });
        
        dropdownContainer.appendChild(dropdownToggle);
        dropdownContainer.appendChild(rotationValuesList);
        
        // Return both the container and the update function
        return { 
            container: dropdownContainer, 
            update: updateRotationValues 
        };
    }
} 