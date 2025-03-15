import * as BABYLON from '@babylonjs/core';
import '@babylonjs/gui';
import { AdvancedDynamicTexture, Rectangle, Grid, TextBlock, Slider, Button, Control } from '@babylonjs/gui';

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
        this.modelConfigs = [];
        
        // Default options
        const defaultOptions = {
            outerRadiusMin: 10,     // Minimum radius for outer SingleCUTs
            outerRadiusMax: 100,    // Maximum radius for outer SingleCUTs
            outerRadiusDefault: 42, // Default radius for outer SingleCUTs
            singleCutRadiusMin: 10,  // Minimum radius for SingleCUT internal structure
            singleCutRadiusMax: 100, // Maximum radius for SingleCUT internal structure
            singleCutRadiusDefault: 21, // Default radius for SingleCUT internal structure
            position: { x: 10, y: 140 }, // Position of the controls container
            width: 350,              // Width of the controls container
            height: 150,             // Height of the controls container
            backgroundColor: "#222222", // Background color
            textColor: "#ffffff",    // Text color
            sliderBarColor: "#444444", // Slider bar color
            sliderThumbColor: "#00aaff", // Slider thumb color
            isVisible: false,        // Initially hidden to avoid clutter
            modelNames: null,        // Array of names for models, or null for auto-naming
            initialRadius: null,     // Array of initial outer radius values for each model
            initialSingleCutRadius: null // Array of initial SingleCutRadius values for each model
        };
        
        this.options = { ...defaultOptions, ...options };
        
        // Set up model configurations
        this.setupModelConfigs();
        
        // Create the UI for the radius controls
        this.createUI();
        
        // Set initial radius lines visibility to match panel visibility
        this.models.forEach(model => {
            if (model && typeof model.setRadiusLinesVisible === 'function') {
                model.setRadiusLinesVisible(this.options.isVisible);
            }
        });
        
        console.log("RadiusControls initialized with", this.models.length, "models");
    }
    
    /**
     * Set up model configurations with names and radius values
     */
    setupModelConfigs() {
        // If only one model but modelNames is not provided, use legacy modelName option
        if (this.models.length === 1 && !this.options.modelNames && this.options.modelName) {
            // Get initial radius values for this model
            let initialOuterRadius = this.options.outerRadiusDefault;
            let initialSingleCutRadius = this.options.singleCutRadiusDefault;
            
            // Use initialRadius if provided
            if (this.options.initialRadius && this.options.initialRadius.length > 0) {
                initialOuterRadius = this.options.initialRadius[0];
            }
            // Otherwise use model's own setting if available
            else if (this.models[0].options && this.models[0].options.outerRadius !== undefined) {
                initialOuterRadius = this.models[0].options.outerRadius;
            }
            
            // Use initialSingleCutRadius if provided
            if (this.options.initialSingleCutRadius && this.options.initialSingleCutRadius.length > 0) {
                initialSingleCutRadius = this.options.initialSingleCutRadius[0];
            }
            // Otherwise use model's own setting if available
            else if (this.models[0].options && this.models[0].options.singleCutRadius !== undefined) {
                initialSingleCutRadius = this.models[0].options.singleCutRadius;
            }
            
            this.modelConfigs.push({
                model: this.models[0],
                name: this.options.modelName,
                currentOuterRadius: initialOuterRadius,
                currentSingleCutRadius: initialSingleCutRadius
            });
            
            // Apply initial radius values to the model
            if (this.models[0] && typeof this.models[0].updateRadiusSettings === 'function') {
                this.models[0].updateRadiusSettings(initialOuterRadius, initialSingleCutRadius);
            }
            
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
            
            // Get initial radius values for this model
            let initialOuterRadius = this.options.outerRadiusDefault;
            let initialSingleCutRadius = this.options.singleCutRadiusDefault;
            
            // Use initialRadius if provided for this model
            if (this.options.initialRadius && this.options.initialRadius.length > index) {
                initialOuterRadius = this.options.initialRadius[index];
            }
            // Otherwise use model's own setting if available
            else if (model.options && model.options.outerRadius !== undefined) {
                initialOuterRadius = model.options.outerRadius;
            }
            
            // Use initialSingleCutRadius if provided for this model
            if (this.options.initialSingleCutRadius && this.options.initialSingleCutRadius.length > index) {
                initialSingleCutRadius = this.options.initialSingleCutRadius[index];
            }
            // Otherwise use model's own setting if available
            else if (model.options && model.options.singleCutRadius !== undefined) {
                initialSingleCutRadius = model.options.singleCutRadius;
            }
            
            this.modelConfigs.push({
                model,
                name: modelName,
                currentOuterRadius: initialOuterRadius,
                currentSingleCutRadius: initialSingleCutRadius
            });
            
            // Apply initial radius values to the model
            if (model && typeof model.updateRadiusSettings === 'function') {
                model.updateRadiusSettings(initialOuterRadius, initialSingleCutRadius);
            }
        });
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
            
            // Create title
            const title = document.createElement('h3');
            title.textContent = 'Radius Controls';
            title.style.margin = '0 0 10px 0';
            this.panel.appendChild(title);
            
            // Create radius controls for each model
            this.modelConfigs.forEach((config, modelIndex) => {
                // Create model section container
                const modelSection = document.createElement('div');
                modelSection.className = 'model-radius-section';
                
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
                
                // Create outer radius control
                const outerRadiusContainer = this.createSliderRow(
                    "Outer Radius",
                    this.options.outerRadiusMin,
                    this.options.outerRadiusMax,
                    config.currentOuterRadius,
                    (value) => this.onOuterRadiusChange(modelIndex, value)
                );
                modelSection.appendChild(outerRadiusContainer);
                
                // Create SingleCUT radius control
                const singleCutRadiusContainer = this.createSliderRow(
                    "SingleCUT Radius",
                    this.options.singleCutRadiusMin,
                    this.options.singleCutRadiusMax,
                    config.currentSingleCutRadius,
                    (value) => this.onSingleCutRadiusChange(modelIndex, value)
                );
                modelSection.appendChild(singleCutRadiusContainer);
                
                // Create panel distance indicator for this model
                this.createPanelDistanceIndicator(modelSection, modelIndex);
                
                // Add model section to the panel
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
        valueDisplay.textContent = Math.round(initial);
        valueDisplay.style.minWidth = '30px';
        valueDisplay.style.textAlign = 'right';
        
        // Create precise input field
        const preciseInput = document.createElement('input');
        preciseInput.type = 'number';
        preciseInput.min = min;
        preciseInput.max = max;
        preciseInput.step = '0.01'; // Allow hundredths place
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
            valueDisplay.textContent = value;
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
            
            // Update slider and value display (slider can only handle integers)
            slider.value = Math.round(value);
            valueDisplay.textContent = Math.round(value);
            
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
        preciseLabel.textContent = 'Precise value:';
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
     * Create an indicator showing the distance between opposite panels
     * @param {HTMLElement} container - The container to add the indicator to
     * @param {number} modelIndex - The index of the model in the modelConfigs array
     */
    createPanelDistanceIndicator(container, modelIndex) {
        // Create container
        const indicatorContainer = document.createElement('div');
        indicatorContainer.style.marginTop = '15px';
        indicatorContainer.style.padding = '8px';
        indicatorContainer.style.borderTop = '1px solid rgba(255,255,255,0.2)';
        
        // Create label
        const label = document.createElement('div');
        label.textContent = 'Distance between opposite panels:';
        label.style.marginBottom = '5px';
        indicatorContainer.appendChild(label);
        
        // Create value display
        const panelDistanceDisplay = document.createElement('div');
        panelDistanceDisplay.style.fontSize = '16px';
        panelDistanceDisplay.style.fontWeight = 'bold';
        
        // Set a unique id so we can update it later
        panelDistanceDisplay.id = `panel-distance-${modelIndex}`;
        
        // Calculate and display initial value
        this.updatePanelDistanceDisplay(modelIndex);
        
        indicatorContainer.appendChild(panelDistanceDisplay);
        container.appendChild(indicatorContainer);
    }
    
    /**
     * Update the panel distance display for a specific model
     * @param {number} modelIndex - The index of the model in the modelConfigs array
     */
    updatePanelDistanceDisplay(modelIndex) {
        if (modelIndex < 0 || modelIndex >= this.modelConfigs.length) return;
        
        const config = this.modelConfigs[modelIndex];
        const model = config.model;
        
        // Calculate the panel distance for this model
        let panelDistance = 0;
        
        if (model && model.options) {
            const outerRadius = config.currentOuterRadius;
            
            // Calculate panel distance (roughly 2 * outerRadius for hexagonal pattern)
            panelDistance = Math.round(outerRadius * 2);
        }
        
        // Find and update the display element
        const displayElement = document.getElementById(`panel-distance-${modelIndex}`);
        if (displayElement) {
            displayElement.textContent = `${panelDistance} meters`;
        }
    }
    
    /**
     * Handle changes to outer radius for a specific model
     * @param {number} modelIndex - The index of the model to update
     * @param {number} value - New outer radius value
     */
    onOuterRadiusChange(modelIndex, value) {
        if (modelIndex < 0 || modelIndex >= this.modelConfigs.length) return;
        
        const config = this.modelConfigs[modelIndex];
        config.currentOuterRadius = value;
        
        // Update the model's radius
        const model = config.model;
        if (model && typeof model.updateRadiusSettings === 'function') {
            model.updateRadiusSettings(value, config.currentSingleCutRadius);
            
            // Update the panel distance display
            this.updatePanelDistanceDisplay(modelIndex);
        }
    }
    
    /**
     * Handle changes to SingleCUT radius for a specific model
     * @param {number} modelIndex - The index of the model to update
     * @param {number} value - New SingleCUT radius value
     */
    onSingleCutRadiusChange(modelIndex, value) {
        if (modelIndex < 0 || modelIndex >= this.modelConfigs.length) return;
        
        const config = this.modelConfigs[modelIndex];
        config.currentSingleCutRadius = value;
        
        // Update the model's radius
        const model = config.model;
        if (model && typeof model.updateRadiusSettings === 'function') {
            model.updateRadiusSettings(config.currentOuterRadius, value);
        }
    }
    
    /**
     * Show the controls
     */
    show() {
        this.togglePanel(true);
    }
    
    /**
     * Hide the controls
     */
    hide() {
        this.togglePanel(false);
    }
    
    /**
     * Toggle visibility of the controls
     */
    toggle() {
        const isCurrentlyVisible = this.panel.style.display !== 'none';
        this.togglePanel(!isCurrentlyVisible);
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
        button.id = 'radiusToggle';
        button.className = 'control-button tooltip';
        button.setAttribute('data-tooltip', 'Toggle Radius Controls');
        button.textContent = 'R';
        button.style.backgroundColor = '#4CAF50'; // Green
        
        // Add click event
        button.addEventListener('click', () => {
            this.toggle();
        });
        
        // Add to container
        controlButtonsContainer.appendChild(button);
        
        // Store reference
        this.htmlToggleButton = button;
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
        
        // Toggle radius lines visibility in the models
        this.models.forEach(model => {
            if (model && typeof model.setRadiusLinesVisible === 'function') {
                model.setRadiusLinesVisible(isVisible);
            }
        });
    }
    
    /**
     * Dispose of all resources
     */
    dispose() {
        // Remove DOM elements
        if (this.panel && this.panel.parentNode) {
            this.panel.parentNode.removeChild(this.panel);
        }
        
        if (this.htmlToggleButton && this.htmlToggleButton.parentNode) {
            this.htmlToggleButton.parentNode.removeChild(this.htmlToggleButton);
        }
    }
} 