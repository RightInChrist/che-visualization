import * as BABYLON from '@babylonjs/core';
import '@babylonjs/gui';
import { AdvancedDynamicTexture, Rectangle, Grid, TextBlock, Slider, Button, Control } from '@babylonjs/gui';

/**
 * Creates slider controls for adjusting the radius parameters of the Layer One Ring model
 */
export class RadiusControls {
    /**
     * Create a new RadiusControls instance
     * @param {BABYLON.Scene} scene - The scene
     * @param {Object} layerOneRingModel - The Layer One Ring model to control
     * @param {Object} options - Additional options
     */
    constructor(scene, layerOneRingModel, options = {}) {
        this.scene = scene;
        this.layerOneRingModel = layerOneRingModel;
        
        // Default options
        const defaultOptions = {
            outerRadiusMin: 10,     // Minimum radius for outer SingleCUTs (changed from 150 to 10)
            outerRadiusMax: 100,    // Maximum radius for outer SingleCUTs (changed from 400 to 100)
            outerRadiusDefault: 42, // Default radius for outer SingleCUTs (changed from 250 to 42)
            singleCutRadiusMin: 10,  // Minimum radius for SingleCUT internal structure
            singleCutRadiusMax: 100, // Maximum radius for SingleCUT internal structure
            singleCutRadiusDefault: 21, // Default radius for SingleCUT internal structure (updated to 21)
            position: { x: 10, y: 140 }, // Position of the controls container, moved down to avoid overlap
            width: 350,              // Width of the controls container
            height: 150,             // Height of the controls container
            backgroundColor: "#222222", // Background color
            textColor: "#ffffff",    // Text color
            sliderBarColor: "#444444", // Slider bar color
            sliderThumbColor: "#00aaff", // Slider thumb color
            special2RadiousDefault: 32, // Default radius for SingleCUT #2 (changed from 200 to 32)
            isVisible: false          // Initially hidden to avoid clutter
        };
        
        this.options = { ...defaultOptions, ...options };
        
        // Current values
        this.currentOuterRadius = this.options.outerRadiusDefault;
        this.currentSingleCutRadius = this.options.singleCutRadiusDefault;
        this.currentSpecial2Radius = this.options.special2RadiousDefault;
        
        // Create the UI for the radius controls
        this.createUI();
        
        // Set initial radius lines visibility to match panel visibility
        if (this.layerOneRingModel && typeof this.layerOneRingModel.setRadiusLinesVisible === 'function') {
            this.layerOneRingModel.setRadiusLinesVisible(this.options.isVisible);
        }
        
        console.log("RadiusControls initialized");
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
            
            // Create outer radius control
            const outerRadiusContainer = this.createSliderRow(
                "Layer One Ring Radius",
                this.options.outerRadiusMin,
                this.options.outerRadiusMax,
                this.currentOuterRadius,
                (value) => this.onOuterRadiusChange(value)
            );
            this.panel.appendChild(outerRadiusContainer);
            
            // Create SingleCUT radius control
            const singleCutRadiusContainer = this.createSliderRow(
                "SingleCUT Radius",
                this.options.singleCutRadiusMin,
                this.options.singleCutRadiusMax,
                this.currentSingleCutRadius,
                (value) => this.onSingleCutRadiusChange(value)
            );
            this.panel.appendChild(singleCutRadiusContainer);
            
            // Create panel distance indicator
            this.createPanelDistanceIndicator();
            
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
     */
    createPanelDistanceIndicator() {
        // Create container
        const container = document.createElement('div');
        container.style.marginTop = '15px';
        container.style.padding = '8px';
        container.style.borderTop = '1px solid rgba(255,255,255,0.2)';
        
        // Create label
        const label = document.createElement('div');
        label.textContent = 'Distance between opposite panels:';
        label.style.marginBottom = '5px';
        container.appendChild(label);
        
        // Create value display
        this.panelDistanceDisplay = document.createElement('div');
        this.panelDistanceDisplay.style.fontSize = '16px';
        this.panelDistanceDisplay.style.fontWeight = 'bold';
        
        // Calculate and display initial value
        this.updatePanelDistanceDisplay();
        
        container.appendChild(this.panelDistanceDisplay);
        this.panel.appendChild(container);
    }
    
    /**
     * Update the panel distance display with current value
     */
    updatePanelDistanceDisplay() {
        // Get pipe radius from the model (default is 5 if not accessible)
        const pipeRadius = (this.layerOneRingModel && 
                          this.layerOneRingModel.singleCuts && 
                          this.layerOneRingModel.singleCuts[0] && 
                          this.layerOneRingModel.singleCuts[0].options) 
                          ? this.layerOneRingModel.singleCuts[0].options.pipeRadius || 5 
                          : 5;
        
        // Calculate distance between pipe centers
        const pipeCentersDistance = 2 * this.currentSingleCutRadius;
        
        // Calculate actual panel distance (subtract diameter of pipes)
        const panelDistance = pipeCentersDistance - (2 * pipeRadius);
        
        // Display both values with 2 decimal places
        this.panelDistanceDisplay.innerHTML = 
            `<div>Between pipe centers: ${pipeCentersDistance.toFixed(2)} units</div>
             <div>Between panel edges: ${panelDistance.toFixed(2)} units</div>`;
    }
    
    /**
     * Handle changes to outer radius
     */
    onOuterRadiusChange(value) {
        this.currentOuterRadius = value;
        
        // Update the model
        if (this.layerOneRingModel && typeof this.layerOneRingModel.updateRadiusSettings === 'function') {
            this.layerOneRingModel.updateRadiusSettings(value, this.currentSingleCutRadius);
        }
        
        // Update the panel distance display
        this.updatePanelDistanceDisplay();
    }
    
    /**
     * Handle changes to SingleCUT radius
     */
    onSingleCutRadiusChange(value) {
        this.currentSingleCutRadius = value;
        
        // Update the model
        if (this.layerOneRingModel && typeof this.layerOneRingModel.updateRadiusSettings === 'function') {
            this.layerOneRingModel.updateRadiusSettings(this.currentOuterRadius, value);
        }
        
        // Update the panel distance display
        this.updatePanelDistanceDisplay();
    }
    
    /**
     * Show the controls panel
     */
    show() {
        if (this.panel) {
            this.panel.style.display = 'block';
        }
    }
    
    /**
     * Hide the controls panel
     */
    hide() {
        if (this.panel) {
            this.panel.style.display = 'none';
        }
    }
    
    /**
     * Toggle the visibility of the controls panel
     */
    toggle() {
        if (this.panel) {
            const isVisible = this.panel.style.display !== 'none';
            this.panel.style.display = isVisible ? 'none' : 'block';
            
            // Toggle radius lines visibility in the model
            if (this.layerOneRingModel && typeof this.layerOneRingModel.setRadiusLinesVisible === 'function') {
                this.layerOneRingModel.setRadiusLinesVisible(!isVisible);
            }
            
            // Update button active state if available
            if (this.htmlToggleButton) {
                if (!isVisible) {
                    this.htmlToggleButton.classList.add('active');
                } else {
                    this.htmlToggleButton.classList.remove('active');
                }
            }
        }
    }
    
    /**
     * Create an HTML toggle button that matches the style of other UI controls
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
        button.style.backgroundColor = '#9C27B0'; // Purple
        
        // Add click event
        button.addEventListener('click', () => {
            const newVisible = this.panel.style.display === 'none';
            this.panel.style.display = newVisible ? 'block' : 'none';
            
            // Toggle radius lines visibility in the model
            if (this.layerOneRingModel && typeof this.layerOneRingModel.setRadiusLinesVisible === 'function') {
                this.layerOneRingModel.setRadiusLinesVisible(newVisible);
            }
            
            // Update button active state
            if (newVisible) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
            
            console.log("Panel visibility toggled:", newVisible);
        });
        
        // Add to container
        controlButtonsContainer.appendChild(button);
        
        // Store reference
        this.htmlToggleButton = button;
        
        console.log("HTML toggle button created for radius controls");
    }
    
    /**
     * Dispose of all resources
     */
    dispose() {
        if (this.advancedTexture) {
            this.advancedTexture.dispose();
        }
        
        // Remove HTML button if it exists
        if (this.htmlToggleButton && this.htmlToggleButton.parentNode) {
            this.htmlToggleButton.parentNode.removeChild(this.htmlToggleButton);
        }
    }
} 