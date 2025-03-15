import * as BABYLON from '@babylonjs/core';
import '@babylonjs/gui';
import { AdvancedDynamicTexture, Rectangle, Grid, TextBlock, Slider, Button, Control } from '@babylonjs/gui';

/**
 * Creates slider controls for adjusting the radius parameters of the Seven CUTs model
 */
export class RadiusControls {
    /**
     * Create a new RadiusControls instance
     * @param {BABYLON.Scene} scene - The scene
     * @param {Object} sevenCutsModel - The Seven CUTs model to control
     * @param {Object} options - Additional options
     */
    constructor(scene, sevenCutsModel, options = {}) {
        this.scene = scene;
        this.sevenCutsModel = sevenCutsModel;
        
        // Default options
        const defaultOptions = {
            outerRadiusMin: 150,    // Minimum radius for outer SingleCUTs
            outerRadiusMax: 400,    // Maximum radius for outer SingleCUTs
            outerRadiusDefault: 250, // Default radius for outer SingleCUTs
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
            special2RadiousDefault: 200, // Default radius for SingleCUT #2
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
        if (this.sevenCutsModel && typeof this.sevenCutsModel.setRadiusLinesVisible === 'function') {
            this.sevenCutsModel.setRadiusLinesVisible(this.options.isVisible);
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
                "Seven CUTs Radius",
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
        
        // Add event listener
        slider.addEventListener('input', (event) => {
            const value = parseInt(event.target.value);
            valueDisplay.textContent = value;
            onChange(value);
        });
        
        // Add elements to the row
        sliderRow.appendChild(slider);
        sliderRow.appendChild(valueDisplay);
        container.appendChild(sliderRow);
        
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
        const pipeRadius = (this.sevenCutsModel && 
                          this.sevenCutsModel.singleCuts && 
                          this.sevenCutsModel.singleCuts[0] && 
                          this.sevenCutsModel.singleCuts[0].options) 
                          ? this.sevenCutsModel.singleCuts[0].options.pipeRadius || 5 
                          : 5;
        
        // Calculate distance between pipe centers
        const pipeCentersDistance = 2 * this.currentSingleCutRadius;
        
        // Calculate actual panel distance (subtract diameter of pipes)
        const panelDistance = pipeCentersDistance - (2 * pipeRadius);
        
        // Display both values
        this.panelDistanceDisplay.innerHTML = 
            `<div>Between pipe centers: ${pipeCentersDistance} units</div>
             <div>Between panel edges: ${panelDistance} units</div>`;
    }
    
    /**
     * Handle changes to the outer radius slider
     * @param {number} value - The new value
     */
    onOuterRadiusChange(value) {
        // Round to integer
        const newValue = Math.round(value);
        console.log(`Outer radius changed to ${newValue}`);
        this.currentOuterRadius = newValue;
        
        // Update the model with new radius values
        this.sevenCutsModel.updateRadiusSettings(newValue, this.currentSingleCutRadius);
    }
    
    /**
     * Handle changes to the SingleCUT radius slider
     * @param {number} value - The new value
     */
    onSingleCutRadiusChange(value) {
        // Round to integer
        const newValue = Math.round(value);
        console.log(`SingleCUT radius changed to ${newValue}`);
        this.currentSingleCutRadius = newValue;
        
        // Update the panel distance display
        this.updatePanelDistanceDisplay();
        
        // Update the model with new radius values
        this.sevenCutsModel.updateRadiusSettings(this.currentOuterRadius, newValue);
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
            if (this.sevenCutsModel && typeof this.sevenCutsModel.setRadiusLinesVisible === 'function') {
                this.sevenCutsModel.setRadiusLinesVisible(!isVisible);
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
            if (this.sevenCutsModel && typeof this.sevenCutsModel.setRadiusLinesVisible === 'function') {
                this.sevenCutsModel.setRadiusLinesVisible(newVisible);
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