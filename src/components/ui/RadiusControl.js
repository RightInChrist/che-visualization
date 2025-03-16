/**
 * RadiusControl provides a panel that allows adjusting the radius of models
 * that implement the getRadius() method.
 */
export class RadiusControl {
    /**
     * Create a new RadiusControl instance
     * @param {Array} models - Array of models to check for radius control
     * @param {Object} options - Additional options
     */
    constructor(models = [], options = {}) {
        // Default options
        const defaultOptions = {
            isVisible: true,         // Initially visible by default
            textColor: "#ffffff",    // Text color
            backgroundColor: "rgba(0, 0, 0, 0.7)", // Background color
            position: "top",         // Position in the control panels stack
            sliderWidth: "200px",    // Width of the slider
            inputWidth: "60px",      // Width of the input field
            includeChildren: true    // Include children of models
        };
        
        this.options = { ...defaultOptions, ...options };
        this.models = models;
        
        // Array to store models that have a getRadius method
        this.radiusModels = [];
        
        // Find models with getRadius method
        this.findRadiusModels();
        
        // Create the UI components
        this.createPanel();
        this.createHTMLToggleButton();
        
        console.log("RadiusControl initialized with", this.radiusModels.length, "radius-controllable models");
    }
    
    /**
     * Find models that have a getRadius method
     */
    findRadiusModels() {
        // Start with empty array
        this.radiusModels = [];
        
        // Look for models that have a getRadius method
        if (Array.isArray(this.models)) {
            this.models.forEach(model => {
                // Add the model itself if it has a getRadius method
                this.addModelIfHasRadius(model);
                
                // If includeChildren is true and the model has children, check them too
                if (this.options.includeChildren && model && typeof model.getChildren === 'function') {
                    try {
                        const children = model.getChildren();
                        if (Array.isArray(children)) {
                            children.forEach(child => {
                                this.addModelIfHasRadius(child);
                            });
                        }
                    } catch (error) {
                        console.error("Error getting children for model:", error);
                    }
                }
            });
        }
        
        console.log("Found", this.radiusModels.length, "models with radius controls");
    }
    
    /**
     * Add a model to radiusModels if it has a valid getRadius method
     * @param {Object} model - The model to check
     */
    addModelIfHasRadius(model) {
        if (model && typeof model.getRadius === 'function') {
            try {
                // Test if getRadius returns a valid object with a value property
                const radius = model.getRadius();
                if (radius && typeof radius.value !== 'undefined') {
                    this.radiusModels.push({
                        model: model,
                        name: model.getName ? model.getName() : model.constructor.name,
                        radius: radius
                    });
                }
            } catch (error) {
                console.error("Error checking radius for model:", error);
            }
        }
    }
    
    /**
     * Create the radius control panel
     */
    createPanel() {
        try {
            console.log("Creating RadiusControl panel");
            
            // Find the control panels container
            this.controlPanels = document.getElementById('controlPanels');
            if (!this.controlPanels) {
                console.error("Control panels container not found");
                return;
            }
            
            // Create HTML panel for radius control
            this.panel = document.createElement('div');
            this.panel.id = 'radiusControlPanel';
            this.panel.style.backgroundColor = this.options.backgroundColor;
            this.panel.style.padding = '10px';
            this.panel.style.borderRadius = '5px';
            this.panel.style.color = this.options.textColor;
            this.panel.style.display = this.options.isVisible ? 'block' : 'none';
            this.panel.style.pointerEvents = 'auto'; // Enable pointer events
            this.panel.style.maxWidth = '400px';
            this.panel.style.maxHeight = '400px';
            this.panel.style.overflowY = 'auto';
            
            // Create header
            const header = document.createElement('div');
            header.style.marginBottom = '10px';
            header.style.display = 'flex';
            header.style.justifyContent = 'space-between';
            header.style.alignItems = 'center';
            
            const title = document.createElement('h3');
            title.textContent = 'Radius Control';
            title.style.margin = '0';
            header.appendChild(title);
            
            this.panel.appendChild(header);
            
            // Create model selector dropdown if we have more than one model
            if (this.radiusModels.length > 1) {
                this.createModelSelector();
            }
            
            // Create radius control elements
            this.createRadiusControls();
            
            // Add the panel to the control panels container
            this.controlPanels.appendChild(this.panel);
            
            console.log("RadiusControl panel created successfully");
        } catch (error) {
            console.error("Error creating RadiusControl panel:", error);
        }
    }
    
    /**
     * Create model selector dropdown
     */
    createModelSelector() {
        // Create container for the selector
        const selectorContainer = document.createElement('div');
        selectorContainer.style.marginBottom = '15px';
        
        // Add label
        const label = document.createElement('label');
        label.textContent = 'Select Model: ';
        label.style.marginRight = '10px';
        selectorContainer.appendChild(label);
        
        // Create select element
        this.modelSelector = document.createElement('select');
        this.modelSelector.style.padding = '5px';
        this.modelSelector.style.backgroundColor = '#333';
        this.modelSelector.style.color = '#fff';
        this.modelSelector.style.border = '1px solid #555';
        this.modelSelector.style.borderRadius = '4px';
        
        // Add options for each model
        this.radiusModels.forEach((modelInfo, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = modelInfo.name;
            this.modelSelector.appendChild(option);
        });
        
        // Add change listener
        this.modelSelector.addEventListener('change', () => {
            this.updateRadiusControls();
        });
        
        selectorContainer.appendChild(this.modelSelector);
        this.panel.appendChild(selectorContainer);
    }
    
    /**
     * Create radius slider and input controls
     */
    createRadiusControls() {
        // Create container for the radius controls
        const controlsContainer = document.createElement('div');
        controlsContainer.id = 'radiusControlsContainer';
        
        // Create elements if we have models
        if (this.radiusModels.length > 0) {
            // Create value display
            this.radiusValueContainer = document.createElement('div');
            this.radiusValueContainer.style.marginBottom = '10px';
            
            // Create slider container with label and value
            const sliderContainer = document.createElement('div');
            sliderContainer.style.display = 'flex';
            sliderContainer.style.alignItems = 'center';
            sliderContainer.style.marginBottom = '15px';
            
            // Add label
            const sliderLabel = document.createElement('label');
            sliderLabel.textContent = 'Radius: ';
            sliderLabel.style.marginRight = '10px';
            sliderLabel.style.minWidth = '60px';
            sliderContainer.appendChild(sliderLabel);
            
            // Create slider
            this.radiusSlider = document.createElement('input');
            this.radiusSlider.type = 'range';
            this.radiusSlider.min = 0;
            this.radiusSlider.max = 100;
            this.radiusSlider.step = 0.01; // Match the input step for hundredth precision
            this.radiusSlider.style.width = this.options.sliderWidth;
            this.radiusSlider.style.marginRight = '10px';
            sliderContainer.appendChild(this.radiusSlider);
            
            // Create input field
            this.radiusInput = document.createElement('input');
            this.radiusInput.type = 'number';
            this.radiusInput.style.width = this.options.inputWidth;
            this.radiusInput.style.padding = '5px';
            this.radiusInput.style.backgroundColor = '#333';
            this.radiusInput.style.color = '#fff';
            this.radiusInput.style.border = '1px solid #555';
            this.radiusInput.style.borderRadius = '4px';
            this.radiusInput.step = 0.01; // Allow hundredth place precision
            sliderContainer.appendChild(this.radiusInput);
            
            // Add event listeners for slider
            this.radiusSlider.addEventListener('input', (event) => {
                this.onSliderChange(parseFloat(event.target.value));
            });
            
            // Add event listener for input field
            this.radiusInput.addEventListener('change', (event) => {
                this.onInputChange(parseFloat(event.target.value));
            });
            
            // Add to container
            controlsContainer.appendChild(this.radiusValueContainer);
            controlsContainer.appendChild(sliderContainer);
            
            // Initialize the controls with the first model
            this.selectedModelIndex = 0;
            this.updateRadiusControls();
        } else {
            // Display message if no models found
            const noModelsMessage = document.createElement('p');
            noModelsMessage.textContent = 'No models with radius controls found.';
            controlsContainer.appendChild(noModelsMessage);
        }
        
        this.panel.appendChild(controlsContainer);
    }
    
    /**
     * Update radius controls to show the currently selected model's values
     */
    updateRadiusControls() {
        // Get the selected model index
        const index = this.modelSelector ? parseInt(this.modelSelector.value) : 0;
        this.selectedModelIndex = index;
        
        if (index >= 0 && index < this.radiusModels.length) {
            const modelInfo = this.radiusModels[index];
            const radius = modelInfo.radius;
            
            // Update value display with precision to 2 decimal places
            this.radiusValueContainer.textContent = `Model: ${modelInfo.name} (${parseFloat(radius.value.toFixed(2))})`;
            
            // Update slider values
            this.radiusSlider.min = radius.min || 0;
            this.radiusSlider.max = radius.max || 100;
            this.radiusSlider.value = radius.value;
            
            // Update input value (keep precision)
            this.radiusInput.min = radius.min || 0;
            this.radiusInput.max = radius.max || 100;
            this.radiusInput.value = parseFloat(radius.value.toFixed(2));
        }
    }
    
    /**
     * Handle slider value change
     * @param {number} value - New slider value
     */
    onSliderChange(value) {
        if (this.selectedModelIndex >= 0 && this.selectedModelIndex < this.radiusModels.length) {
            const modelInfo = this.radiusModels[this.selectedModelIndex];
            const radius = modelInfo.radius;
            
            // Update the model's radius with precision to 2 decimal places
            const preciseValue = parseFloat(value.toFixed(2));
            radius.value = preciseValue;
            
            // Update the input field with the precise value
            this.radiusInput.value = preciseValue;
        }
    }
    
    /**
     * Handle input value change
     * @param {number} value - New input value
     */
    onInputChange(value) {
        if (this.selectedModelIndex >= 0 && this.selectedModelIndex < this.radiusModels.length) {
            const modelInfo = this.radiusModels[this.selectedModelIndex];
            const radius = modelInfo.radius;
            
            // Clamp value to min/max
            const min = parseFloat(this.radiusSlider.min);
            const max = parseFloat(this.radiusSlider.max);
            const clampedValue = Math.max(min, Math.min(max, value));
            
            // Ensure precision to 2 decimal places
            const preciseValue = parseFloat(clampedValue.toFixed(2));
            
            // Update the model's radius
            radius.value = preciseValue;
            
            // Update the slider
            this.radiusSlider.value = preciseValue;
            
            // Update the input if value was clamped
            if (preciseValue !== value) {
                this.radiusInput.value = preciseValue;
            }
        }
    }
    
    /**
     * Create the HTML toggle button
     */
    createHTMLToggleButton() {
        try {
            console.log("Creating radius control toggle button");
            
            // Find the toggle buttons container
            let buttonContainer = document.getElementById('toggleButtons');
            
            // If not found, try alternates
            if (!buttonContainer) {
                buttonContainer = document.getElementById('controlButtons');
            }
            
            // If still not found, find by class
            if (!buttonContainer) {
                buttonContainer = document.querySelector('.control-buttons-container');
            }
            
            // If still not found, create a new container
            if (!buttonContainer) {
                console.error("Toggle buttons container not found, creating new one");
                buttonContainer = document.createElement('div');
                buttonContainer.id = 'toggleButtons';
                buttonContainer.style.position = 'absolute';
                buttonContainer.style.bottom = '20px';
                buttonContainer.style.right = '20px';
                buttonContainer.style.display = 'flex';
                buttonContainer.style.flexDirection = 'row';
                buttonContainer.style.gap = '10px';
                buttonContainer.style.zIndex = '100';
                document.body.appendChild(buttonContainer);
            }
            
            // Create toggle button with matching style to the debug button
            const button = document.createElement('button');
            button.id = 'radiusControlToggle';
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
            
            // Add hover effects
            button.addEventListener('mouseover', () => {
                button.style.backgroundColor = this.options.isVisible ? '#45a049' : '#555555';
            });
            
            button.addEventListener('mouseout', () => {
                button.style.backgroundColor = this.options.isVisible ? '#4CAF50' : '#444444';
            });
            
            // Add click handler
            button.addEventListener('click', () => {
                this.toggleVisible();
            });
            
            // Add to container
            buttonContainer.appendChild(button);
            
            // Store reference
            this.toggleButton = button;
            
            console.log("Radius control toggle button created successfully");
        } catch (error) {
            console.error("Error creating radius control toggle button:", error);
        }
    }
    
    /**
     * Toggle visibility of the radius control panel
     */
    toggleVisible() {
        this.options.isVisible = !this.options.isVisible;
        
        // Update button appearance
        if (this.toggleButton) {
            this.toggleButton.style.backgroundColor = this.options.isVisible ? '#4CAF50' : '#444444';
        }
        
        // Update panel visibility
        if (this.panel) {
            this.panel.style.display = this.options.isVisible ? 'block' : 'none';
        }
    }
    
    /**
     * Update the radius control (called on each frame)
     */
    update() {
        // This would typically be used to update any dynamic information,
        // but for the radius control it's not strictly necessary since
        // we're working directly with the model's radius object by reference.
        
        // However, we could update the control values if the models' radius
        // was changed externally (by another control or programmatically)
        if (this.options.isVisible && this.selectedModelIndex !== undefined) {
            this.updateRadiusControls();
        }
    }
} 