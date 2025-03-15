import * as BABYLON from '@babylonjs/core';
import '@babylonjs/gui';

/**
 * Creates slider controls for adjusting the rotation of the Layer One Ring model
 */
export class LayerRotationControl {
    /**
     * Create a new LayerRotationControl instance
     * @param {BABYLON.Scene} scene - The scene
     * @param {Object} layerOneRingModel - The Layer One Ring model to control
     * @param {number} rotationAngle - The current rotation angle in degrees
     * @param {Object} options - Additional options
     */
    constructor(scene, layerOneRingModel, rotationAngle, options = {}) {
        this.scene = scene;
        this.layerOneRingModel = layerOneRingModel;
        
        // Default options
        const defaultOptions = {
            rotationMin: 0,          // Minimum rotation angle in degrees
            rotationMax: 360,        // Maximum rotation angle in degrees
            rotationDefault: rotationAngle || 60, // Default rotation angle in degrees
            position: { x: 10, y: 240 }, // Position of the controls container, below radius controls
            width: 350,              // Width of the controls container
            height: 100,             // Height of the controls container
            backgroundColor: "#222222", // Background color
            textColor: "#ffffff",    // Text color
            sliderBarColor: "#444444", // Slider bar color
            sliderThumbColor: "#00aaff", // Slider thumb color
            isVisible: false          // Initially hidden to avoid clutter
        };
        
        this.options = { ...defaultOptions, ...options };
        
        // Current rotation value in degrees
        this.currentRotation = this.options.rotationDefault;
        
        // Create the UI for the rotation controls
        this.createUI();
        
        console.log("LayerRotationControl initialized with rotation", this.currentRotation);
    }
    
    /**
     * Create the UI components for the rotation controls
     */
    createUI() {
        try {
            console.log("Creating LayerRotationControl UI");
            
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
            
            // Create rotation angle control
            const rotationContainer = this.createSliderRow(
                "Layer One Ring Rotation",
                this.options.rotationMin,
                this.options.rotationMax,
                this.currentRotation,
                (value) => this.onRotationChange(value)
            );
            this.panel.appendChild(rotationContainer);
            
            // Add the panel to the control panels container
            this.controlPanels.appendChild(this.panel);
            
            // Create HTML button for rotation controls toggle
            this.createHTMLToggleButton();
            
            console.log("LayerRotationControl UI created successfully");
        } catch (error) {
            console.error("Error creating LayerRotationControl UI:", error);
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
     * Handle changes to rotation angle
     * @param {number} value - New rotation angle value in degrees
     */
    onRotationChange(value) {
        this.currentRotation = value;
        
        // Update the model rotation
        if (this.layerOneRingModel && typeof this.layerOneRingModel.updateRotation === 'function') {
            this.layerOneRingModel.updateRotation(value);
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