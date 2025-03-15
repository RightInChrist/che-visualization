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
        modelSection.className = 'model-rotation-section';
        modelSection.dataset.modelIndex = modelIndex;
        modelSection.dataset.level = level;
        
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
        
        // Create X rotation control
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
        
        // Create Y rotation control
        if (config.rotation.y !== undefined) {
            const yRotationContainer = this.createSliderRow(
                "Y Rotation",
                0,
                360,
                config.rotation.y.default,
                (value) => this.onRotationChange(config.model, 'y', value)
            );
            modelSection.appendChild(yRotationContainer);
        }
        
        // Create Z rotation control
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
        
        // Recursively create sections for children if enabled
        if (this.options.recursive && config.children && config.children.length > 0) {
            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'children-container';
            childrenContainer.style.marginTop = '15px';
            
            config.children.forEach((childConfig, childIndex) => {
                const childSection = this.createModelSection(childConfig, childIndex, level + 1);
                childrenContainer.appendChild(childSection);
            });
            
            modelSection.appendChild(childrenContainer);
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
        const container = document.createElement('div');
        container.style.marginBottom = '10px';
        
        // Create label
        const labelElement = document.createElement('div');
        labelElement.textContent = label;
        labelElement.style.marginBottom = '5px';
        container.appendChild(labelElement);
        
        // Create slider row
        const sliderRow = document.createElement('div');
        sliderRow.style.display = 'flex';
        sliderRow.style.alignItems = 'center';
        
        // Create slider
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = min;
        slider.max = max;
        slider.value = value;
        slider.style.flex = '1';
        slider.style.marginRight = '10px';
        
        // Create value display
        const valueDisplay = document.createElement('span');
        valueDisplay.textContent = value;
        valueDisplay.style.minWidth = '30px';
        valueDisplay.style.textAlign = 'right';
        
        // Add event listener
        slider.addEventListener('input', () => {
            const newValue = parseFloat(slider.value);
            valueDisplay.textContent = newValue;
            if (onValueChange) {
                onValueChange(newValue);
            }
        });
        
        sliderRow.appendChild(slider);
        sliderRow.appendChild(valueDisplay);
        container.appendChild(sliderRow);
        
        return container;
    }
    
    /**
     * Create the HTML toggle button
     */
    createHTMLToggleButton() {
        // Find the toggleButtons container
        const toggleButtons = document.getElementById('toggleButtons');
        if (!toggleButtons) {
            console.error("Toggle buttons container not found");
            return;
        }
        
        // Create button
        const button = document.createElement('button');
        button.textContent = 'Rotation';
        button.className = 'control-toggle-button';
        button.style.backgroundColor = this.options.isVisible ? '#555' : '#333';
        button.addEventListener('click', () => this.toggleVisible());
        
        // Add the button to the toggle buttons container
        toggleButtons.appendChild(button);
        
        // Store button reference
        this.toggleButton = button;
    }
    
    /**
     * Toggle visibility of the rotation controls panel
     */
    toggleVisible() {
        const newVisibility = !this.isVisible();
        
        if (this.panel) {
            this.panel.style.display = newVisibility ? 'block' : 'none';
        }
        
        if (this.toggleButton) {
            this.toggleButton.style.backgroundColor = newVisibility ? '#555' : '#333';
        }
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
        
        // Convert from degrees to radians
        const valueInRadians = (value * Math.PI) / 180;
        
        // Update the model's rotation
        if (model && typeof model.updateRotation === 'function') {
            model.updateRotation(axis, valueInRadians);
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