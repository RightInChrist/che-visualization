import * as BABYLON from '@babylonjs/core';
import '@babylonjs/gui';
import { ModelConfigHelper } from './ModelConfigHelper';

/**
 * Creates slider controls for adjusting the radius parameters of multiple models
 */
export class RadiusControls {
    /**
     * Create a new RadiusControls instance
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
        
        // Create the UI for the radius controls
        this.createUI();
        
        console.log("RadiusControls initialized with", this.models.length, "models");
    }
    
    /**
     * Create the UI components for the radius controls
     */
    createUI() {
        try {
            console.log("Creating RadiusControls UI");
            
            // Find the control panels container
            this.controlPanels = document.getElementById('controlPanels');
            if (!this.controlPanels) {
                console.error("Control panels container not found");
                return;
            }
            
            // Create HTML panel for radius controls
            this.panel = document.createElement('div');
            this.panel.id = 'radiusControlPanel';
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
            title.textContent = 'Radius Controls';
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
            
            console.log("RadiusControls UI created successfully");
        } catch (error) {
            console.error("Error creating RadiusControls UI:", error);
        }
    }
    
    /**
     * Creates a model section in the controls panel
     * @param {Object} config - The model configuration
     * @param {number} modelIndex - Index of the model in the array
     * @param {number} level - Nesting level for indentation
     * @returns {HTMLElement} - The created model section
     */
    createModelSection(config, modelIndex, level) {
        // Create model section container
        const modelSection = document.createElement('div');
        modelSection.className = 'model-radius-section';
        modelSection.dataset.modelIndex = modelIndex;
        modelSection.dataset.level = level;
        
        // Add model type data attribute if available
        if (config.model && config.model.constructor) {
            modelSection.dataset.modelType = config.model.constructor.name;
        }
        
        // Store model index in the model's options for reference
        if (config.model && config.model.options) {
            config.model.options.modelIndex = modelIndex;
        }
        
        // Apply indentation based on level
        if (level > 0) {
            modelSection.style.paddingLeft = (this.options.defaultIndentation * level) + 'px';
            modelSection.style.borderLeft = '2px solid #555';
            modelSection.style.marginLeft = '10px';
        }
        
        if (modelIndex > 0 && level === 0) {
            modelSection.style.marginTop = '20px';
            modelSection.style.borderTop = '1px solid #444';
            modelSection.style.paddingTop = '15px';
        }
        
        // Create model name header
        const modelNameHeader = document.createElement('h4');
        modelNameHeader.textContent = config.name;
        modelNameHeader.style.margin = '0 0 10px 0';
        modelSection.appendChild(modelNameHeader);

        const model = config.model;
        
        // Add radius control using getRadius if available
        if (model && typeof model.getRadius === 'function') {
            const radius = model.getRadius();
            
            // Create radius slider
            const radiusContainer = this.createSliderRow(
                "Radius",
                radius.min,
                radius.max,
                radius.value,
                (value) => {
                    radius.value = value;
                    // Update panel distance display if available
                    this.updatePanelDistanceDisplay(model);
                },
                0.01 // Allow hundredths precision
            );
            modelSection.appendChild(radiusContainer);
            
            // Create panel distance indicator
            this.createPanelDistanceIndicator(modelSection, model);
        }
        // Create outer radius control for models with updateRadiusSettings
        else if (model && typeof model.updateRadiusSettings === 'function') {
            // Get current values or defaults
            let outerRadius = 42; // Default
            let singleCutRadius = 21; // Default
            
            if (model.options) {
                outerRadius = model.options.outerRadius || outerRadius;
                singleCutRadius = model.options.singleCutRadius || singleCutRadius;
            }
            
            // Create outer radius slider
            const outerRadiusContainer = this.createSliderRow(
                "Outer Radius",
                30,
                100,
                outerRadius,
                (value) => this.onOuterRadiusChange(model, value),
                0.01 // Allow hundredths precision
            );
            modelSection.appendChild(outerRadiusContainer);
            
            // Create SingleCut radius control
            const hasSingleCutControl = model && (
                (model.constructor.name === 'SingleCutModel') ||
                (model.children && model.children.some(child => 
                    child.constructor.name === 'SingleCutModel'))
            );
            
            if (hasSingleCutControl) {
                const singleCutRadiusContainer = this.createSliderRow(
                    "SingleCUT Radius",
                    10,
                    40,
                    singleCutRadius,
                    (value) => this.onSingleCutRadiusChange(model, value),
                    0.01 // Allow hundredths precision
                );
                
                // Style the SingleCut radius control differently
                singleCutRadiusContainer.style.paddingLeft = '10px';
                singleCutRadiusContainer.style.borderLeft = '3px solid #3399ff';
                singleCutRadiusContainer.style.backgroundColor = 'rgba(51, 153, 255, 0.1)';
                
                modelSection.appendChild(singleCutRadiusContainer);
                
                // Create panel distance indicator
                this.createPanelDistanceIndicator(modelSection, model);
            }
        }
        // Add direct radius control for models with updateRadius
        else if (model && typeof model.updateRadius === 'function') {
            // Get current radius value
            let radius = model.options && model.options.radius !== undefined ? 
                model.options.radius : 21;
            
            // Create radius slider
            const radiusContainer = this.createSliderRow(
                "Radius",
                10,
                40,
                radius,
                (value) => {
                    if (model && typeof model.updateRadius === 'function') {
                        model.updateRadius(value);
                        
                        // Update panel distance display if available
                        if (typeof this.updatePanelDistanceDisplay === 'function') {
                            this.updatePanelDistanceDisplay(model);
                        }
                    }
                },
                0.01 // Allow hundredths precision
            );
            
            modelSection.appendChild(radiusContainer);
            
            // Create panel distance indicator
            this.createPanelDistanceIndicator(modelSection, model);
        }
        
        // Recursively create sections for children if enabled
        if (this.options.recursive && config.children && config.children.length > 0) {
            // Only create child sections for non-SingleCutModel children
            const childrenToShow = config.children.filter(child => 
                child.name !== 'SingleCutModel'
            );
            
            if (childrenToShow.length > 0) {
                const childrenContainer = document.createElement('div');
                childrenContainer.className = 'children-container';
                childrenContainer.style.marginTop = '15px';
                
                childrenToShow.forEach((childConfig, childIndex) => {
                    const childSection = this.createModelSection(childConfig, childIndex, level + 1);
                    childrenContainer.appendChild(childSection);
                });
                
                modelSection.appendChild(childrenContainer);
            }
        }
        
        return modelSection;
    }
    
    /**
     * Creates a slider row with label, value display, and precise input
     * @param {string} label - Label for the slider
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @param {number} value - Initial value
     * @param {Function} onChange - Callback for value changes
     * @param {number} [step=1] - Step size for the slider and input
     * @returns {HTMLElement} - The slider row container
     */
    createSliderRow(label, min, max, value, onChange, step = 1) {
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
        
        // Format display value based on step precision
        const formatValue = (v) => {
            if (step < 1) {
                const decimals = String(step).split('.')[1].length;
                return Number(v).toFixed(decimals);
            }
            return Math.round(v);
        };
        
        // Create slider
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = min;
        slider.max = max;
        slider.step = step;
        slider.value = formatValue(value);
        slider.style.flex = '1';
        slider.style.height = '20px';
        slider.style.accentColor = '#00aaff';
        
        // Create value display
        const valueDisplay = document.createElement('span');
        valueDisplay.textContent = formatValue(value);
        valueDisplay.style.minWidth = '50px';
        valueDisplay.style.textAlign = 'right';
        valueDisplay.style.fontWeight = 'bold';
        valueDisplay.style.fontSize = '14px';
        
        // Create precise input field
        const preciseInput = document.createElement('input');
        preciseInput.type = 'number';
        preciseInput.min = min;
        preciseInput.max = max;
        preciseInput.step = step;
        preciseInput.value = formatValue(value);
        preciseInput.style.width = '60px';
        preciseInput.style.padding = '3px 5px';
        preciseInput.style.marginLeft = '5px';
        preciseInput.style.borderRadius = '3px';
        preciseInput.style.border = '1px solid #555';
        preciseInput.style.backgroundColor = '#333';
        preciseInput.style.color = '#fff';
        
        // Add event listener for slider
        slider.addEventListener('input', () => {
            const newValue = parseFloat(slider.value);
            valueDisplay.textContent = formatValue(newValue);
            preciseInput.value = formatValue(newValue);
            if (onChange) {
                onChange(newValue);
            }
        });
        
        // Add event listener for precise input
        preciseInput.addEventListener('change', () => {
            let newValue = parseFloat(preciseInput.value);
            
            // Enforce min/max bounds
            if (newValue < min) newValue = min;
            if (newValue > max) newValue = max;
            
            // Format the value 
            const formattedValue = formatValue(newValue);
            
            // Update the precise input to the bounded value
            preciseInput.value = formattedValue;
            
            // Update slider and value display
            slider.value = newValue;
            valueDisplay.textContent = formattedValue;
            
            // Call the callback with the precise value
            if (onChange) {
                onChange(newValue);
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
     * Create an indicator showing the distance between opposite panels
     * @param {HTMLElement} container - The container to add the indicator to
     * @param {Object} model - The model
     */
    createPanelDistanceIndicator(container, model) {
        // Create container
        const indicatorContainer = document.createElement('div');
        indicatorContainer.style.marginTop = '10px';
        indicatorContainer.style.padding = '8px';
        indicatorContainer.style.borderTop = '1px solid rgba(255,255,255,0.2)';
        indicatorContainer.style.fontSize = '12px'; // Smaller font size
        
        // Create a single row containing both label and value
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.alignItems = 'center';
        row.style.whiteSpace = 'nowrap'; // Prevent wrapping
        
        // Create label
        const label = document.createElement('span');
        label.textContent = 'Distance between panels:';
        label.style.marginRight = '8px';
        
        // Create value display
        const panelDistanceDisplay = document.createElement('span');
        panelDistanceDisplay.style.fontWeight = 'bold';
        panelDistanceDisplay.style.minWidth = '65px';
        panelDistanceDisplay.style.textAlign = 'right';
        
        // Get model type and index for more specific identification
        const modelType = model.constructor ? model.constructor.name : "unknown";
        const modelIndex = model.options && model.options.modelIndex !== undefined ? 
                          model.options.modelIndex : 
                          Math.random().toString(36).substring(2, 9);
        
        // Set specific identifiers
        panelDistanceDisplay.dataset.modelType = modelType;
        panelDistanceDisplay.dataset.modelIndex = modelIndex;
        
        // Create a unique ID that includes model type and index
        panelDistanceDisplay.id = `panel-distance-${modelType}-${modelIndex}`;
        
        // Add a specific class for easier selection
        panelDistanceDisplay.className = 'panel-distance-display';
        
        // Store original model reference as a data attribute for debugging
        panelDistanceDisplay.dataset.originalModel = model.rootNode ? model.rootNode.id : "none";
        
        // Log what we're creating
        console.log(`Creating panel distance display for ${modelType} (index: ${modelIndex})`);
        
        // Add label and value to the row
        row.appendChild(label);
        row.appendChild(panelDistanceDisplay);
        
        // Add the row to the container
        indicatorContainer.appendChild(row);
        container.appendChild(indicatorContainer);
        
        // Calculate and display initial value
        this.updatePanelDistanceDisplay(model);
    }
    
    /**
     * Update the panel distance display for a specific model
     * @param {Object} model - The model
     */
    updatePanelDistanceDisplay(model) {
        if (!model) return;
        
        // Calculate the panel distance for this model
        let panelDistance = 0;
        let calculationMethod = "unknown";
        
        // Get model type and index for precise targeting
        const modelType = model.constructor ? model.constructor.name : "unknown";
        const modelIndex = model.options && model.options.modelIndex !== undefined ? 
                          model.options.modelIndex : 
                          "unknown";
        
        console.log(`Calculating panel distance for ${modelType} (index: ${modelIndex})`);
        
        // Method 1: Check if model has a calculatePanelDistance method
        if (model && typeof model.calculatePanelDistance === 'function') {
            panelDistance = model.calculatePanelDistance();
            calculationMethod = "model.calculatePanelDistance()";
            console.log(`Using model's calculatePanelDistance method: ${panelDistance}`);
        }
        // Method 2: Use child models' calculatePanelDistance if they exist
        else if (model && typeof model.getChildren === 'function' && model.getChildren().length > 0) {
            const childModel = model.getChildren()[0]; // Get first child
            if (childModel && typeof childModel.calculatePanelDistance === 'function') {
                panelDistance = childModel.calculatePanelDistance();
                calculationMethod = "childModel.calculatePanelDistance()";
                console.log(`Using child model's calculatePanelDistance method: ${panelDistance}`);
            }
        }
        // Method 3: Fallback calculation for any model with outerRadius
        else if (model && model.options && model.options.outerRadius !== undefined) {
            // Use the standard formula for hexagons: distance = radius * √3
            panelDistance = model.options.outerRadius * Math.sqrt(3);
            calculationMethod = "outerRadius * Math.sqrt(3)";
            console.log(`Using formula calculation: ${model.options.outerRadius} * √3 = ${panelDistance}`);
        }
        
        // Try to find the specific display element for this model
        // First try with ID that includes model type and index
        let displayElement = document.getElementById(`panel-distance-${modelType}-${modelIndex}`);
        
        if (displayElement) {
            console.log(`Found panel distance display by ID for ${modelType} (index: ${modelIndex})`);
        } else {
            // If not found by ID, try by data attributes
            console.log(`Trying to find panel distance display by data attributes for ${modelType} (index: ${modelIndex})`);
            const elements = document.querySelectorAll(`[data-model-type="${modelType}"][data-model-index="${modelIndex}"]`);
            
            if (elements.length > 0) {
                displayElement = elements[0];
                console.log(`Found ${elements.length} panel distance display(s) by data attributes`);
            } else {
                // Last attempt: find any element with matching model type in matching section
                console.warn(`No display found by ID or data attributes for ${modelType} (index: ${modelIndex}), trying section lookup`);
                
                // Find the model section for this model index
                const modelSection = document.querySelector(`.model-radius-section[data-model-index="${modelIndex}"]`);
                
                if (modelSection) {
                    // Find any panel distance displays within this section
                    const sectionDisplays = modelSection.querySelectorAll('.panel-distance-display');
                    if (sectionDisplays.length > 0) {
                        displayElement = sectionDisplays[0];
                        console.log(`Found display in model section ${modelIndex}`);
                    }
                }
            }
        }
        
        // Update the display element if found
        if (displayElement) {
            displayElement.textContent = `${Math.round(panelDistance)} meters`;
            console.log(`Updated panel distance for ${modelType} (index: ${modelIndex}) to ${Math.round(panelDistance)} meters`);
        } else {
            console.warn(`⚠️ Failed to find panel distance display for ${modelType} (index: ${modelIndex})`);
            
            // Debug: list all distance displays
            const allDisplays = document.querySelectorAll('.panel-distance-display');
            console.log(`All panel distance displays (${allDisplays.length}):`);
            allDisplays.forEach(display => {
                console.log(`- Type: ${display.dataset.modelType}, Index: ${display.dataset.modelIndex}, ID: ${display.id}`);
            });
        }
    }
    
    /**
     * Handle changes to outer radius for a specific model
     * @param {Object} model - The model to update
     * @param {number} value - New outer radius value
     */
    onOuterRadiusChange(model, value) {
        if (!model) return;
        
        const modelType = model.constructor ? model.constructor.name : "unknown";
        const modelIndex = model.options && model.options.modelIndex !== undefined ? 
                          model.options.modelIndex : 
                          "unknown";
        
        console.log(`Outer radius change: model=${modelType} (index: ${modelIndex}), value=${value}`);
        
        // Get current singleCutRadius if available
        let singleCutRadius = 21; // Default
        if (model.options && model.options.singleCutRadius !== undefined) {
            singleCutRadius = model.options.singleCutRadius;
        }
        
        // Update the model's radius
        if (model && typeof model.updateRadiusSettings === 'function') {
            model.updateRadiusSettings(value, singleCutRadius);
            
            // Update the panel distance display
            this.updatePanelDistanceDisplay(model);
        }
    }
    
    /**
     * Handle changes to SingleCUT radius for a specific model
     * @param {Object} model - The model to update
     * @param {number} value - New SingleCUT radius value
     */
    onSingleCutRadiusChange(model, value) {
        if (!model) return;
        
        const modelType = model.constructor ? model.constructor.name : "unknown";
        const modelIndex = model.options && model.options.modelIndex !== undefined ? 
                          model.options.modelIndex : 
                          "unknown";
        
        console.log(`SingleCut radius change: model=${modelType} (index: ${modelIndex}), value=${value}`);
        
        // Get current outerRadius if available
        let outerRadius = 42; // Default
        if (model.options && model.options.outerRadius !== undefined) {
            outerRadius = model.options.outerRadius;
        }
        
        // Update the model's radius
        if (model && typeof model.updateRadiusSettings === 'function') {
            model.updateRadiusSettings(outerRadius, value);
            
            // Update only this model's panel distance display
            this.updatePanelDistanceDisplay(model);
        }
    }
    
    /**
     * Handle changes to inner radius for inner-outer radius models
     * @param {Object} model - The model to update
     * @param {Number} value - The new inner radius value
     */
    onInnerRadiusChange(model, value) {
        if (!model || typeof model.updateInnerRadius !== 'function') {
            console.warn('Model does not support inner radius updates');
            return;
        }
        
        // Format the value to have 2 decimal places for display consistency
        const formattedValue = parseFloat(value.toFixed(2));
        
        // Update the model with the new inner radius value
        console.log(`Updating inner radius to ${formattedValue}`);
        model.updateInnerRadius(formattedValue);
        
        // Update the panel distance display if needed
        this.updatePanelDistanceDisplay(model);
    }
    
    /**
     * Create the HTML toggle button
     */
    createHTMLToggleButton() {
        try {
            console.log("Creating radius controls toggle button");
            
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
            button.id = 'radiusToggle';
            button.textContent = 'Radius';
            button.className = 'control-button';
            button.style.backgroundColor = this.options.isVisible ? '#4CAF50' : '#444444';
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
                button.style.backgroundColor = this.options.isVisible ? '#4CAF50' : '#666666';
            });
            
            button.addEventListener('mouseout', () => {
                button.style.backgroundColor = this.options.isVisible ? '#4CAF50' : '#444444';
            });
            
            button.addEventListener('click', () => {
                console.log("Radius toggle button clicked");
                this.toggleVisible();
            });
            
            // Add the button to the container
            buttonContainer.appendChild(button);
            console.log("Added radius toggle button to container");
            
            // Store button reference
            this.toggleButton = button;
        } catch (error) {
            console.error("Error creating toggle button:", error);
        }
    }
    
    /**
     * Toggle panel visibility
     * @param {boolean} isVisible - Whether panel should be visible
     */
    togglePanel(isVisible) {
        this.panel.style.display = isVisible ? 'block' : 'none';
        this.options.isVisible = isVisible;
        
        // Update button active state
        if (this.toggleButton) {
            this.toggleButton.style.backgroundColor = isVisible ? '#4CAF50' : '#444444';
        }
        
        // Toggle radius lines visibility in the models
        this.models.forEach(model => {
            if (model && typeof model.setRadiusLinesVisible === 'function') {
                model.setRadiusLinesVisible(isVisible);
            }
        });
    }
    
    /**
     * Toggle visibility of the radius controls panel
     */
    toggleVisible() {
        console.log("Toggling radius controls visibility");
        
        const newVisibility = !this.isVisible();
        console.log(`Setting radius controls visibility to: ${newVisibility}`);
        
        if (this.panel) {
            this.panel.style.display = newVisibility ? 'block' : 'none';
        }
        
        if (this.toggleButton) {
            this.toggleButton.style.backgroundColor = newVisibility ? '#4CAF50' : '#444444';
        }
        
        // Store the visibility state
        this.options.isVisible = newVisibility;
        
        // Toggle radius lines visibility in the models
        this.models.forEach(model => {
            if (model && typeof model.setRadiusLinesVisible === 'function') {
                console.log(`Calling setRadiusLinesVisible(${newVisibility}) on model type: ${model.constructor.name}`);
                model.setRadiusLinesVisible(newVisibility);
            } else {
                console.warn(`Model does not have setRadiusLinesVisible method:`, model);
            }
        });
        
        console.log(`Radius controls visibility set to: ${this.isVisible()}`);
    }
    
    /**
     * Get visibility state of the controls
     * @returns {boolean} - Whether the controls are visible
     */
    isVisible() {
        return this.panel && this.panel.style.display === 'block';
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