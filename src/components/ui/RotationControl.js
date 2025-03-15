import * as BABYLON from '@babylonjs/core';
import '@babylonjs/gui';

/**
 * Creates slider controls for adjusting the rotation of multiple models
 */
export class RotationControl {
    /**
     * Create a new RotationControl instance that can handle multiple models
     * @param {BABYLON.Scene} scene - The scene
     * @param {Object} models - Single model or array of models to control
     * @param {number} rotationAngle - The current rotation angle in degrees (for legacy support)
     * @param {Object} options - Additional options
     */
    constructor(scene, models, rotationAngle, options = {}) {
        this.scene = scene;
        
        // Handle both single model and array of models
        this.models = Array.isArray(models) ? models : [models];
        this.modelConfigs = [];
        
        // Default options
        const defaultOptions = {
            rotationMin: 0,          // Minimum rotation angle in degrees
            rotationMax: 360,        // Maximum rotation angle in degrees
            rotationDefault: rotationAngle || 60, // Default rotation angle in degrees
            singleCutRotationMin: 0, // Minimum rotation angle for SingleCUT models in degrees
            singleCutRotationMax: 360, // Maximum rotation angle for SingleCUT models in degrees
            singleCutRotationDefault: 0, // Default rotation angle for SingleCUT models in degrees
            position: { x: 10, y: 240 }, // Position of the controls container, below radius controls
            width: 350,              // Width of the controls container
            height: 100,             // Height of the controls container
            backgroundColor: "#222222", // Background color
            textColor: "#ffffff",    // Text color
            sliderBarColor: "#444444", // Slider bar color
            sliderThumbColor: "#00aaff", // Slider thumb color
            isVisible: false,         // Initially hidden to avoid clutter
            modelNames: null,        // Array of names for models, or null for auto-naming
            includeSingleCuts: true, // Whether to include controls for SingleCUT models within composite models
        };
        
        this.options = { ...defaultOptions, ...options };
        
        // Set up model configurations
        this.setupModelConfigs();
        
        // Create the UI for the rotation controls
        this.createUI();
        
        console.log("RotationControl initialized with", this.models.length, "models");
    }
    
    /**
     * Set up model configurations with names and rotation values
     */
    setupModelConfigs() {
        // If only one model but modelNames is not provided, use legacy modelName option
        if (this.models.length === 1 && !this.options.modelNames && this.options.modelName) {
            this.modelConfigs.push({
                model: this.models[0],
                name: this.options.modelName,
                currentRotation: this.options.rotationDefault,
                hasSingleCuts: this.hasSingleCuts(this.models[0]),
                singleCutsRotation: this.options.singleCutRotationDefault
            });
            return;
        }
        
        // Process each model with its name
        this.models.forEach((model, index) => {
            // Determine model name
            let modelName;
            if (this.options.modelNames && this.options.modelNames[index]) {
                modelName = this.options.modelNames[index];
            } else if (model.constructor && model.constructor.name) {
                modelName = model.constructor.name;
            } else {
                modelName = `Model ${index + 1}`;
            }
            
            // Get current rotation for this model if available
            let currentRotation = this.options.rotationDefault;
            if (model.options && model.options.rotationAngle !== undefined) {
                currentRotation = model.options.rotationAngle;
            }
            
            // Check if this model has SingleCUT models
            const hasSingleCuts = this.hasSingleCuts(model);
            
            // Get current rotation for SingleCUTs if any (use the first one's value)
            let singleCutsRotation = this.options.singleCutRotationDefault;
            if (hasSingleCuts && model.singleCuts && model.singleCuts.length > 0 && 
                model.singleCuts[0].options && model.singleCuts[0].options.rotationAngle !== undefined) {
                singleCutsRotation = model.singleCuts[0].options.rotationAngle;
            }
            
            this.modelConfigs.push({
                model,
                name: modelName,
                currentRotation,
                hasSingleCuts,
                singleCutsRotation
            });
        });
    }
    
    /**
     * Check if a model has SingleCUT models
     * @param {Object} model - The model to check
     * @returns {boolean} - Whether the model has SingleCUT models
     */
    hasSingleCuts(model) {
        if (!this.options.includeSingleCuts) {
            return false;
        }
        
        return !!(model && model.singleCuts && Array.isArray(model.singleCuts) && model.singleCuts.length > 0);
    }
    
    /**
     * Create the UI components for the rotation controls
     */
    createUI() {
        try {
            console.log("Creating RotationControl UI");
            
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
            
            // Create title
            const title = document.createElement('h3');
            title.textContent = 'Rotation Controls';
            title.style.margin = '0 0 10px 0';
            this.panel.appendChild(title);
            
            // Create rotation angle control for each model
            this.modelConfigs.forEach((config, modelIndex) => {
                // Create model section container
                const modelSection = document.createElement('div');
                modelSection.className = 'model-rotation-section';
                
                if (modelIndex > 0) {
                    modelSection.style.marginTop = '20px';
                    modelSection.style.borderTop = '1px solid #444';
                    modelSection.style.paddingTop = '15px';
                }
                
                // Create model name header
                const modelNameHeader = document.createElement('h4');
                modelNameHeader.textContent = config.name;
                modelNameHeader.style.margin = '0 0 10px 0';
                modelSection.appendChild(modelNameHeader);
                
                // Create main model rotation control
                const rotationContainer = this.createSliderRow(
                    `Model Rotation`,
                    this.options.rotationMin,
                    this.options.rotationMax,
                    config.currentRotation,
                    (value) => this.onRotationChange(modelIndex, 'model', value)
                );
                modelSection.appendChild(rotationContainer);
                
                // Create a single rotation control for all SingleCUT models if available
                if (config.hasSingleCuts) {
                    // Create a separator
                    const separator = document.createElement('div');
                    separator.style.margin = '15px 0';
                    separator.style.borderTop = '1px dashed #444';
                    modelSection.appendChild(separator);
                    
                    // Create a single rotation control for all SingleCUTs
                    const singleCutRotationContainer = this.createSliderRow(
                        `All SingleCUTs Rotation`,
                        this.options.singleCutRotationMin,
                        this.options.singleCutRotationMax,
                        config.singleCutsRotation,
                        (value) => this.onRotationChange(modelIndex, 'singleCuts', value)
                    );
                    
                    // Add smaller indentation to show it's a child control
                    singleCutRotationContainer.style.paddingLeft = '10px';
                    singleCutRotationContainer.style.borderLeft = '2px solid #555';
                    singleCutRotationContainer.style.marginBottom = '10px';
                    
                    modelSection.appendChild(singleCutRotationContainer);
                }
                
                // Add model section to the panel
                this.panel.appendChild(modelSection);
            });
            
            // Add the panel to the control panels container
            this.controlPanels.appendChild(this.panel);
            
            // Create HTML button for rotation controls toggle
            this.createHTMLToggleButton();
            
            console.log("RotationControl UI created successfully");
        } catch (error) {
            console.error("Error creating RotationControl UI:", error);
        }
    }
    
    /**
     * Create a row with a label, slider, and value display
     * @param {string} label - The label text
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @param {number} initial - Initial value
     * @param {Function} onChange - Callback when value changes
     * @returns {HTMLElement} - The container with the row controls
     */
    createSliderRow(label, min, max, initial, onChange) {
        // Create container
        const container = document.createElement('div');
        container.style.marginBottom = '15px';
        
        // Create label
        const labelElement = document.createElement('div');
        labelElement.textContent = label;
        labelElement.style.marginBottom = '5px';
        container.appendChild(labelElement);
        
        // Create slider row (slider and value display)
        const sliderRow = document.createElement('div');
        sliderRow.style.display = 'flex';
        sliderRow.style.alignItems = 'center';
        sliderRow.style.gap = '10px';
        
        // Create slider
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = min;
        slider.max = max;
        slider.value = initial;
        slider.style.flex = '1';
        
        // Create value display
        const valueDisplay = document.createElement('span');
        valueDisplay.textContent = Math.round(initial) + '°';
        valueDisplay.style.minWidth = '40px';
        valueDisplay.style.textAlign = 'right';
        
        // Create precise input field
        const preciseInput = document.createElement('input');
        preciseInput.type = 'number';
        preciseInput.min = min;
        preciseInput.max = max;
        preciseInput.step = '1'; // Allow whole degrees
        preciseInput.value = initial;
        preciseInput.style.width = '80px';
        preciseInput.style.padding = '2px 5px';
        preciseInput.style.borderRadius = '3px';
        preciseInput.style.border = '1px solid #555';
        preciseInput.style.backgroundColor = '#333';
        preciseInput.style.color = '#fff';
        
        // Add event listener for slider
        slider.addEventListener('input', (event) => {
            const value = parseInt(event.target.value);
            valueDisplay.textContent = value + '°';
            preciseInput.value = value; // Update the precise input when slider changes
            onChange(value);
        });
        
        // Add event listener for precise input
        preciseInput.addEventListener('change', (event) => {
            let value = parseFloat(event.target.value);
            
            // Enforce min/max bounds
            if (value < min) value = min;
            if (value > max) value = max;
            
            // Update the precise input to the bounded value
            preciseInput.value = value;
            
            // Update slider and value display
            slider.value = Math.round(value);
            valueDisplay.textContent = Math.round(value) + '°';
            
            // Call the callback with the precise value
            onChange(value);
        });
        
        // Add elements to the row
        sliderRow.appendChild(slider);
        sliderRow.appendChild(valueDisplay);
        
        // Create a new row for the precise input
        const preciseRow = document.createElement('div');
        preciseRow.style.display = 'flex';
        preciseRow.style.alignItems = 'center';
        preciseRow.style.justifyContent = 'flex-end';
        preciseRow.style.marginTop = '5px';
        
        const preciseLabel = document.createElement('span');
        preciseLabel.textContent = 'Precise angle:';
        preciseLabel.style.marginRight = '10px';
        preciseLabel.style.fontSize = '12px';
        
        preciseRow.appendChild(preciseLabel);
        preciseRow.appendChild(preciseInput);
        
        // Add all rows to the container
        container.appendChild(sliderRow);
        container.appendChild(preciseRow);
        
        return container;
    }
    
    /**
     * Create HTML button for toggling controls
     */
    createHTMLToggleButton() {
        // Find the control buttons container
        const controlButtonsContainer = document.getElementById('controlButtons');
        if (!controlButtonsContainer) {
            console.error("Control buttons container not found");
            return;
        }
        
        // Create button element
        const button = document.createElement('button');
        button.id = 'rotationToggle';
        button.className = 'control-button tooltip';
        button.setAttribute('data-tooltip', 'Toggle Rotation Controls');
        button.textContent = 'O';
        button.style.backgroundColor = '#FF9800'; // Orange
        
        // Add click event
        button.addEventListener('click', () => {
            const isVisible = this.panel.style.display !== 'none';
            this.togglePanel(!isVisible);
        });
        
        // Add to container
        controlButtonsContainer.appendChild(button);
        
        // Store reference
        this.htmlToggleButton = button;
    }
    
    /**
     * Handle changes to rotation angle for a model or all of its SingleCUTs
     * @param {number} modelIndex - Index of the model to update
     * @param {string} target - Target to update ('model' or 'singleCuts')
     * @param {number} value - New rotation angle value in degrees
     */
    onRotationChange(modelIndex, target, value) {
        if (modelIndex < 0 || modelIndex >= this.modelConfigs.length) {
            console.error(`Invalid model index: ${modelIndex}`);
            return;
        }
        
        const config = this.modelConfigs[modelIndex];
        
        if (target === 'model') {
            // Update main model rotation
            config.currentRotation = value;
            
            // Update the model rotation
            const model = config.model;
            if (model && typeof model.updateRotation === 'function') {
                model.updateRotation(value);
            }
        } else if (target === 'singleCuts') {
            // Update rotation for all SingleCUTs
            config.singleCutsRotation = value;
            
            // Update all SingleCUT rotations
            const model = config.model;
            if (model && model.singleCuts && Array.isArray(model.singleCuts)) {
                model.singleCuts.forEach(singleCut => {
                    if (singleCut && typeof singleCut.updateRotation === 'function') {
                        singleCut.updateRotation(value);
                    }
                });
            }
        } else {
            console.error(`Invalid rotation target: ${target}`);
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
        if (this.htmlToggleButton) {
            if (isVisible) {
                this.htmlToggleButton.classList.add('active');
            } else {
                this.htmlToggleButton.classList.remove('active');
            }
        }
    }
} 