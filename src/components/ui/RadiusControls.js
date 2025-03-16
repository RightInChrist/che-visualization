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
            this.panel.style.padding = '6px';  // Reduced from 10px to match RotationControls
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
            title.style.margin = '0 0 5px 0'; // Reduced from 10px to match RotationControls
            title.style.fontSize = '14px'; // Reduced font size to match RotationControls
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
        
        // Apply indentation and styling to match RotationControls
        modelSection.style.marginBottom = '8px'; // Reduced from 15px
        modelSection.style.marginLeft = `${level * (this.options.defaultIndentation - 5)}px`; // Reduced indentation
        modelSection.style.paddingLeft = level > 0 ? '5px' : '0'; // Reduced padding
        modelSection.style.borderLeft = level > 0 ? '1px solid #444' : 'none';
        
        // Create model name header with reduced size
        const modelNameHeader = document.createElement('h4');
        modelNameHeader.textContent = config.name;
        modelNameHeader.style.margin = '0 0 5px 0'; // Reduced from 10px
        modelNameHeader.style.fontSize = '13px'; // Reduced font size to match RotationControls
        modelNameHeader.style.color = '#eee';
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
                    // Update distance indicators if needed
                    this.updateDistanceDisplay(model);
                },
                0.01 // Allow hundredths precision
            );
            modelSection.appendChild(radiusContainer);
            
            // Add child element controls if model supports getChildrenRadii
            if (model && typeof model.getChildrenRadii === 'function') {
                // Get child radii objects - this returns an array of objects by reference
                const childRadii = model.getChildrenRadii();
                
                if (childRadii && childRadii.length > 0) {
                    // Create a container for element width controls - more compact styling
                    const elemWidthsContainer = document.createElement('div');
                    elemWidthsContainer.className = 'element-widths-container';
                    elemWidthsContainer.style.marginTop = '5px'; // Reduced from 15px
                    elemWidthsContainer.style.padding = '5px'; // Reduced from 10px
                    elemWidthsContainer.style.backgroundColor = 'rgba(0, 0, 100, 0.1)';
                    elemWidthsContainer.style.borderLeft = '2px solid #5599ff'; // Reduced from 3px
                    
                    // Add header for element widths section - smaller font
                    const elemWidthsHeader = document.createElement('h5');
                    elemWidthsHeader.textContent = 'Element Widths';
                    elemWidthsHeader.style.margin = '0 0 5px 0'; // Reduced from 10px
                    elemWidthsHeader.style.fontWeight = 'bold';
                    elemWidthsHeader.style.fontSize = '11px'; // Reduced font size
                    elemWidthsContainer.appendChild(elemWidthsHeader);
                    
                    // Add a global control to adjust all element widths
                    const allElemsContainer = this.createSliderRow(
                        "All Elements",
                        5, // Min width
                        30, // Max width
                        childRadii[0].value, // Use first element's width as default
                        (value) => {
                            // Apply this width to all elements
                            model.getChildrenRadii(value);
                        },
                        0.1 // Allow tenths precision
                    );
                    
                    // Style the global control - reduced spacing
                    allElemsContainer.style.borderBottom = '1px solid rgba(255, 255, 255, 0.2)';
                    allElemsContainer.style.paddingBottom = '5px'; // Reduced from 10px
                    allElemsContainer.style.marginBottom = '5px'; // Reduced from 10px
                    
                    elemWidthsContainer.appendChild(allElemsContainer);
                    
                    // Add individual element width controls
                    childRadii.forEach((elemRadius, index) => {
                        const elemContainer = this.createSliderRow(
                            `Element ${index + 1}`,
                            elemRadius.min,
                            elemRadius.max,
                            elemRadius.value,
                            (value) => {
                                // Update just this element's width
                                elemRadius.value = value;
                            },
                            0.1 // Allow tenths precision
                        );
                        
                        // Style individual element controls - reduced padding
                        elemContainer.style.paddingLeft = '8px'; // Reduced from 15px
                        elemContainer.style.fontSize = '0.9em';
                        
                        elemWidthsContainer.appendChild(elemContainer);
                    });
                    
                    modelSection.appendChild(elemWidthsContainer);
                }
            }
            
            // Create distance indicator with compact styling
            this.createDistanceIndicator(modelSection, model);
        }
        // Create outer radius control for models with updateRadiusSettings
        else if (model && typeof model.updateRadiusSettings === 'function') {
            // Get current radius value or default
            let radius = model.options && model.options.radius !== undefined ? 
                model.options.radius : 21;
            
            // Create a standard radius slider - simplified to use just one radius control
            const radiusContainer = this.createSliderRow(
                "Radius",
                10,
                100,
                radius,
                (value) => {
                    if (model && typeof model.updateRadius === 'function') {
                        model.updateRadius(value);
                    } else if (model && typeof model.updateRadiusSettings === 'function') {
                        // Fall back to updateRadiusSettings with same value for both parameters
                        model.updateRadiusSettings(value, value/2);
                    }
                    
                    // Update distance display
                    this.updateDistanceDisplay(model);
                },
                0.01 // Allow hundredths precision
            );
            
            modelSection.appendChild(radiusContainer);
            
            // Create distance indicator
            this.createDistanceIndicator(modelSection, model);
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
                        
                        // Update distance display if available
                        if (typeof this.updateDistanceDisplay === 'function') {
                            this.updateDistanceDisplay(model);
                        }
                    }
                },
                0.01 // Allow hundredths precision
            );
            
            modelSection.appendChild(radiusContainer);
            
            // Create distance indicator
            this.createDistanceIndicator(modelSection, model);
        }
        
        // Recursively create sections for children if enabled
        if (this.options.recursive && config.children && config.children.length > 0) {
            // Only create child sections for non-SingleCutModel children
            const childrenToShow = config.children;
            
            if (childrenToShow.length > 0) {
                const childrenContainer = document.createElement('div');
                childrenContainer.className = 'children-container';
                childrenContainer.style.marginTop = '5px'; // Reduced from 15px
                
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
        container.style.marginBottom = '8px'; // Reduced from 15px to match RotationControls
        container.style.padding = '5px'; // Reduced from 8px to match RotationControls
        container.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
        container.style.borderRadius = '3px'; // Reduced from 4px to match RotationControls
        
        // Create label with smaller font
        const labelElement = document.createElement('div');
        labelElement.textContent = label;
        labelElement.style.marginBottom = '4px'; // Reduced from 8px to match RotationControls
        labelElement.style.fontWeight = 'bold';
        labelElement.style.fontSize = '11px'; // Reduced font size to match RotationControls
        container.appendChild(labelElement);
        
        // Create slider row with reduced spacing
        const sliderRow = document.createElement('div');
        sliderRow.style.display = 'flex';
        sliderRow.style.alignItems = 'center';
        sliderRow.style.gap = '5px'; // Reduced from 10px to match RotationControls
        
        // Format display value based on step precision
        const formatValue = (v) => {
            if (step < 1) {
                const decimals = String(step).split('.')[1].length;
                return Number(v).toFixed(decimals);
            }
            return Math.round(v);
        };
        
        // Create slider with reduced height
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = min;
        slider.max = max;
        slider.step = step;
        slider.value = formatValue(value);
        slider.style.flex = '1';
        slider.style.height = '16px'; // Reduced from 20px to match RotationControls
        slider.style.accentColor = '#00aaff';
        
        // Create value display with smaller size
        const valueDisplay = document.createElement('span');
        valueDisplay.textContent = formatValue(value);
        valueDisplay.style.minWidth = '40px'; // Reduced from 50px to match RotationControls
        valueDisplay.style.textAlign = 'right';
        valueDisplay.style.fontWeight = 'bold';
        valueDisplay.style.fontSize = '11px'; // Reduced from 14px to match RotationControls
        
        // Create precise input field with smaller size
        const preciseInput = document.createElement('input');
        preciseInput.type = 'number';
        preciseInput.min = min;
        preciseInput.max = max;
        preciseInput.step = step;
        preciseInput.value = formatValue(value);
        preciseInput.style.width = '45px'; // Reduced from 60px to match RotationControls
        preciseInput.style.padding = '2px 3px'; // Reduced from 3px 5px to match RotationControls
        preciseInput.style.marginLeft = '3px'; // Reduced from 5px to match RotationControls
        preciseInput.style.borderRadius = '2px'; // Reduced from 3px to match RotationControls
        preciseInput.style.border = '1px solid #555';
        preciseInput.style.backgroundColor = '#333';
        preciseInput.style.color = '#fff';
        preciseInput.style.fontSize = '10px'; // Reduced font size to match RotationControls
        
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
     * Create an indicator showing the distance across the model
     * @param {HTMLElement} container - The container to add the indicator to
     * @param {Object} model - The model
     */
    createDistanceIndicator(container, model) {
        // Create container with reduced spacing
        const indicatorContainer = document.createElement('div');
        indicatorContainer.style.marginTop = '5px'; // Reduced from 10px
        indicatorContainer.style.padding = '4px'; // Reduced from 8px
        indicatorContainer.style.borderTop = '1px solid rgba(255,255,255,0.2)';
        indicatorContainer.style.fontSize = '10px'; // Reduced from 12px to match RotationControls style
        
        // Create a single row containing both label and value
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.alignItems = 'center';
        row.style.whiteSpace = 'nowrap'; // Prevent wrapping
        
        // Create label with smaller font
        const label = document.createElement('span');
        label.textContent = 'Distance across model:';
        label.style.marginRight = '5px'; // Reduced from 8px
        
        // Create value display with smaller size
        const distanceDisplay = document.createElement('span');
        distanceDisplay.style.fontWeight = 'bold';
        distanceDisplay.style.minWidth = '50px'; // Reduced from 65px
        distanceDisplay.style.textAlign = 'right';
        distanceDisplay.style.fontSize = '10px'; // Reduced font size
        
        // Get model type and index for more specific identification
        const modelType = model.constructor ? model.constructor.name : "unknown";
        const modelIndex = model.options && model.options.modelIndex !== undefined ? 
                          model.options.modelIndex : 
                          Math.random().toString(36).substring(2, 9);
        
        // Set specific identifiers
        distanceDisplay.dataset.modelType = modelType;
        distanceDisplay.dataset.modelIndex = modelIndex;
        
        // Create a unique ID that includes model type and index
        distanceDisplay.id = `distance-${modelType}-${modelIndex}`;
        
        // Add a specific class for easier selection
        distanceDisplay.className = 'distance-display';
        
        // Store original model reference as a data attribute for debugging
        distanceDisplay.dataset.originalModel = model.rootNode ? model.rootNode.id : "none";
        
        // Add label and value to the row
        row.appendChild(label);
        row.appendChild(distanceDisplay);
        
        // Add the row to the container
        indicatorContainer.appendChild(row);
        container.appendChild(indicatorContainer);
        
        // Calculate and display initial value
        this.updateDistanceDisplay(model);
    }
    
    /**
     * Update the distance display for a specific model
     * @param {Object} model - The model
     */
    updateDistanceDisplay(model) {
        if (!model) return;
        
        // Calculate the distance for this model
        let distance = 0;
        let calculationMethod = "unknown";
        
        // Get model type and index for precise targeting
        const modelType = model.constructor ? model.constructor.name : "unknown";
        const modelIndex = model.options && model.options.modelIndex !== undefined ? 
                          model.options.modelIndex : 
                          "unknown";
        
        // Method 1: Check if model has a calculateSideDistance method
        if (model && typeof model.calculateSideDistance === 'function') {
            distance = model.calculateSideDistance();
        }
        // Method 2: Use child models' calculateSideDistance if they exist
        else if (model && typeof model.getChildren === 'function' && model.getChildren().length > 0) {
            const childModel = model.getChildren()[0]; // Get first child
            if (childModel && typeof childModel.calculateSideDistance === 'function') {
                distance = childModel.calculateSideDistance();
            }
        }
        // Method 3: Fallback calculation for any model with radius
        else if (model && model.options) {
            // Try to use any radius value we can find
            let radius = model.options.radius || model.options.outerRadius || 21;
            // Use the standard formula for hexagons: distance = radius * √3
            distance = radius * Math.sqrt(3);
        }
        
        // Try to find the specific display element for this model
        // First try with ID that includes model type and index
        let displayElement = document.getElementById(`distance-${modelType}-${modelIndex}`);
        
        if (!displayElement) {
            // If not found by ID, try by data attributes
            const elements = document.querySelectorAll(`[data-model-type="${modelType}"][data-model-index="${modelIndex}"]`);
            
            if (elements.length > 0) {
                displayElement = elements[0];
            } else {
                // Last attempt: find any element with matching model type in matching section
                const modelSection = document.querySelector(`.model-radius-section[data-model-index="${modelIndex}"]`);
                
                if (modelSection) {
                    // Find any distance displays within this section
                    const sectionDisplays = modelSection.querySelectorAll('.distance-display');
                    if (sectionDisplays.length > 0) {
                        displayElement = sectionDisplays[0];
                    }
                }
            }
        }
        
        // Update the display element if found
        if (displayElement) {
            displayElement.textContent = `${Math.round(distance)} meters`;
        }
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
            button.style.padding = '6px 12px'; // Reduced from 8px 16px
            button.style.borderRadius = '3px'; // Reduced from 4px
            button.style.cursor = 'pointer';
            button.style.fontWeight = 'bold';
            button.style.width = '100px'; // Reduced from 120px
            button.style.fontSize = '12px'; // Add smaller font size
            button.style.textAlign = 'center';
            button.style.transition = 'background-color 0.3s';
            button.style.boxShadow = '0 1px 3px rgba(0,0,0,0.3)'; // Reduced shadow
            
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
                model.setRadiusLinesVisible(newVisibility);
            }
        });
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