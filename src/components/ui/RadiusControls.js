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
            singleCutRadiusMin: 50,  // Minimum radius for SingleCUT internal structure
            singleCutRadiusMax: 200, // Maximum radius for SingleCUT internal structure
            singleCutRadiusDefault: 150, // Default radius for SingleCUT internal structure
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
        
        console.log("RadiusControls initialized");
    }
    
    /**
     * Create the UI components for the radius controls
     */
    createUI() {
        try {
            console.log("Creating RadiusControls UI");
            
            // Create AdvancedDynamicTexture for UI
            this.advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("RadiusControlsUI", true, this.scene);
            console.log("AdvancedDynamicTexture created:", this.advancedTexture);
            
            // Create a panel to hold the controls
            this.panel = new Rectangle();
            this.panel.width = this.options.width + "px";
            this.panel.height = this.options.height + "px";
            this.panel.cornerRadius = 10;
            this.panel.color = "#666666";
            this.panel.thickness = 2;
            this.panel.background = this.options.backgroundColor;
            this.panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
            this.panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
            this.panel.left = this.options.position.x + "px";
            this.panel.top = this.options.position.y + "px";
            this.panel.zIndex = 10;
            this.panel.isVisible = this.options.isVisible;
            this.advancedTexture.addControl(this.panel);
            console.log("Panel created and added to texture");
            
            // Create a grid for organizing the controls
            this.grid = new Grid();
            this.grid.addRowDefinition(0.1, true); // Title
            this.grid.addRowDefinition(0.4, true); // Seven CUTs radius
            this.grid.addRowDefinition(0.4, true); // SingleCUT radius
            this.grid.addRowDefinition(0.1, true); // Bottom spacing
            this.grid.addColumnDefinition(1); // Full width
            this.panel.addControl(this.grid);
            
            // Title text
            const titleText = new TextBlock();
            titleText.text = "Radius Controls";
            titleText.color = this.options.textColor;
            titleText.fontSize = 16;
            titleText.height = "30px";
            this.grid.addControl(titleText, 0, 0);
            
            // Create containers for each slider row
            const outerRadiusRow = this.createSliderRow(
                "Seven CUTs Radius",
                this.options.outerRadiusMin,
                this.options.outerRadiusMax,
                this.currentOuterRadius,
                (value) => this.onOuterRadiusChange(value)
            );
            this.grid.addControl(outerRadiusRow, 1, 0);
            
            const singleCutRadiusRow = this.createSliderRow(
                "SingleCUT Radius",
                this.options.singleCutRadiusMin,
                this.options.singleCutRadiusMax,
                this.currentSingleCutRadius,
                (value) => this.onSingleCutRadiusChange(value)
            );
            this.grid.addControl(singleCutRadiusRow, 2, 0);
            
            // Create close button
            const closeButton = Button.CreateSimpleButton("closeButton", "X");
            closeButton.width = "24px";
            closeButton.height = "24px";
            closeButton.color = this.options.textColor;
            closeButton.background = "#aa0000";
            closeButton.cornerRadius = 12;
            closeButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
            closeButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
            closeButton.top = "5px";
            closeButton.left = "-5px";
            closeButton.onPointerClickObservable.add(() => {
                this.panel.isVisible = false;
            });
            this.panel.addControl(closeButton);
            
            // Create HTML button for radius controls toggle (instead of using GUI)
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
     * @returns {BABYLON.GUI.Container} - The container with the row controls
     */
    createSliderRow(label, min, max, initial, onChange) {
        const container = new Grid();
        container.addRowDefinition(1);
        container.addColumnDefinition(0.3); // Label
        container.addColumnDefinition(0.5); // Slider
        container.addColumnDefinition(0.2); // Value
        
        // Label
        const labelText = new TextBlock();
        labelText.text = label;
        labelText.color = this.options.textColor;
        labelText.fontSize = 14;
        labelText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        labelText.paddingLeft = "10px";
        container.addControl(labelText, 0, 0);
        
        // Slider
        const slider = new Slider();
        slider.minimum = min;
        slider.maximum = max;
        slider.value = initial;
        slider.height = "20px";
        slider.width = "100%";
        slider.color = this.options.sliderBarColor;
        slider.background = this.options.backgroundColor;
        slider.borderColor = this.options.sliderBarColor;
        slider.isThumbCircle = true;
        slider.thumbWidth = 15;
        slider.barOffset = 0;
        
        // Value display
        const valueText = new TextBlock();
        valueText.text = Math.round(initial).toString();
        valueText.color = this.options.textColor;
        valueText.fontSize = 14;
        valueText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        valueText.width = "100%";
        valueText.paddingRight = "10px";
        container.addControl(valueText, 0, 2);
        
        // Add the slider to the container after creating value text
        container.addControl(slider, 0, 1);
        
        // Set up the observable for value changes
        slider.onValueChangedObservable.add((value) => {
            // Update the value display
            valueText.text = Math.round(value).toString();
            // Call the change handler
            onChange(value);
        });
        
        return container;
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
        
        // Update the model with new radius values
        this.sevenCutsModel.updateRadiusSettings(this.currentOuterRadius, newValue);
    }
    
    /**
     * Show the controls panel
     */
    show() {
        this.panel.isVisible = true;
    }
    
    /**
     * Hide the controls panel
     */
    hide() {
        this.panel.isVisible = false;
    }
    
    /**
     * Toggle the visibility of the controls panel
     */
    toggle() {
        this.panel.isVisible = !this.panel.isVisible;
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
            this.panel.isVisible = !this.panel.isVisible;
            
            // Update button active state
            if (this.panel.isVisible) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
            
            console.log("Panel visibility toggled:", this.panel.isVisible);
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