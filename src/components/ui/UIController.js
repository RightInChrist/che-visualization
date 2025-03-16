/**
 * Controls the user interface interactions
 */
export class UIController {
    constructor(cameraController, options = {}) {
        this.cameraController = cameraController;
        this.options = options;
        this.models = options.models || [];
        
        // Create containers for UI elements
        this.createContainers();
        
        // Create camera info panel for controls
        this.createControlsInfoPanel();
        
        // Initialize UI elements and buttons
        this.initUI();
        
        // Add model-specific controls if models are provided
        if (this.models && this.models.length > 0) {
            this.createModelControls();
        }
        
        // Create debug info view if needed
        if (options.showDebugInfo) {
            this.createDebugInfoView();
        }
    }
    
    /**
     * Initializes UI elements and event listeners
     */
    initUI() {
        // Create the camera toggle button
        this.createCameraToggleButton();
        
        // Create scene editor button (if not already created)
        if (this.options.sceneEditor) {
            // SceneEditor already has its own toggle button
            this.sceneEditor = this.options.sceneEditor;
        }
        
        // Initialize help overlay toggle
        document.addEventListener('keydown', (event) => {
            if (event.code === 'KeyH') {
                document.body.classList.toggle('show-controls');
            }
        });
    }
    
    /**
     * Creates containers for UI elements
     */
    createContainers() {
        // Create control panels container if it doesn't exist
        if (!document.getElementById('controlPanels')) {
            const controlPanels = document.createElement('div');
            controlPanels.id = 'controlPanels';
            controlPanels.style.position = 'absolute';
            controlPanels.style.top = '50px';
            controlPanels.style.left = '10px';
            controlPanels.style.display = 'flex';
            controlPanels.style.flexDirection = 'column';
            controlPanels.style.gap = '10px';
            controlPanels.style.zIndex = '100';
            document.body.appendChild(controlPanels);
            this.controlPanelsContainer = controlPanels;
        } else {
            this.controlPanelsContainer = document.getElementById('controlPanels');
        }
        
        // Create toggle buttons container if it doesn't exist
        if (!document.getElementById('toggleButtons')) {
            const toggleButtons = document.createElement('div');
            toggleButtons.id = 'toggleButtons';
            toggleButtons.style.position = 'absolute';
            toggleButtons.style.bottom = '20px';
            toggleButtons.style.right = '20px';
            toggleButtons.style.display = 'flex';
            toggleButtons.style.flexDirection = 'row';
            toggleButtons.style.gap = '10px';
            toggleButtons.style.zIndex = '100';
            document.body.appendChild(toggleButtons);
            this.toggleButtonsContainer = toggleButtons;
        } else {
            this.toggleButtonsContainer = document.getElementById('toggleButtons');
        }
    }
    
    /**
     * Creates model-specific controls (radius and rotation)
     */
    createModelControls() {
        const { RadiusControls, RotationControls } = this.options.controlClasses || {};
        
        // Create radius controls if the class is available
        if (RadiusControls) {
            this.radiusControls = new RadiusControls(
                this.options.scene,
                this.models,
                {
                    isVisible: false,
                    modelNames: this.models.map(model => model.getName ? model.getName() : model.constructor.name)
                }
            );
        }
        
        // Create rotation controls if the class is available
        if (RotationControls) {
            this.rotationControls = new RotationControls(
                this.options.scene,
                this.models,
                {
                    isVisible: false,
                    modelNames: this.models.map(model => model.getName ? model.getName() : model.constructor.name)
                }
            );
        }
    }
    
    /**
     * Creates debug info view
     */
    createDebugInfoView() {
        const { DebugInfoView } = this.options.controlClasses || {};
        
        if (DebugInfoView) {
            this.debugInfoView = new DebugInfoView({
                isVisible: true,
                cameraController: this.cameraController,
                app: this.options.app
            });
        }
    }
    
    /**
     * Creates the controls info panel
     */
    createControlsInfoPanel() {
        // Find the control panels container
        const controlPanels = this.controlPanelsContainer || document.getElementById('controlPanels');
        if (!controlPanels) {
            console.error("Control panels container not found");
            return;
        }
        
        // Create controls info panel
        this.controlsInfo = document.createElement('div');
        this.controlsInfo.id = 'controlsInfo';
        this.controlsInfo.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        this.controlsInfo.style.padding = '10px';
        this.controlsInfo.style.borderRadius = '5px';
        this.controlsInfo.style.color = '#ffffff';
        this.controlsInfo.style.display = 'none';  // Hidden by default
        this.controlsInfo.style.zIndex = '100';
        this.controlsInfo.style.position = 'absolute';
        this.controlsInfo.style.top = '10px';
        this.controlsInfo.style.left = '10px';
        this.controlsInfo.style.maxWidth = '400px';
        
        // Add controls info content
        this.controlsInfo.innerHTML = `
            <h3 style="margin-top: 0; margin-bottom: 10px;">Controls</h3>
            <p><strong>Show/Hide Controls:</strong> Press H</p>
            <p><strong>Camera Mode:</strong> Press Tab</p>
            <p><strong>Movement (First Person/Flight):</strong> WASD</p>
            <p><strong>Up/Down (Flight):</strong> Space/Shift</p>
            <p><strong>Look Around:</strong> Click and Drag</p>
            <p><strong>Zoom (Orbit):</strong> Mouse Wheel</p>
            <p><strong>Scene Editor:</strong> Press E</p>
        `;
        
        // Add to control panels
        controlPanels.appendChild(this.controlsInfo);
    }
    
    /**
     * Creates the camera toggle button
     */
    createCameraToggleButton() {
        try {
            // Use the toggle buttons container
            const buttonContainer = this.toggleButtonsContainer || document.getElementById('toggleButtons');
            if (!buttonContainer) {
                console.error("Toggle buttons container not found");
                return;
            }
            
            // Create button
            const button = document.createElement('button');
            button.textContent = 'Camera';
            button.className = 'control-button';
            button.style.backgroundColor = '#333';
            button.style.color = '#fff';
            button.style.border = 'none';
            button.style.padding = '8px 16px';
            button.style.borderRadius = '4px';
            button.style.cursor = 'pointer';
            button.style.fontWeight = 'bold';
            button.style.fontSize = '14px';
            button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
            
            // Add hover effect
            button.addEventListener('mouseenter', () => {
                button.style.backgroundColor = '#444';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.backgroundColor = '#333';
            });
            
            // Add click handler
            button.addEventListener('click', () => {
                if (this.cameraController) {
                    this.cameraController.toggleCameraMode();
                    button.textContent = `Camera: ${this.cameraController.getCurrentCameraName()}`;
                }
            });
            
            // Update button text based on current camera
            if (this.cameraController) {
                button.textContent = `Camera: ${this.cameraController.getCurrentCameraName()}`;
            }
            
            // Add to container
            buttonContainer.appendChild(button);
            
            // Save reference
            this.cameraButton = button;
        } catch (error) {
            console.error("Error creating camera toggle button:", error);
        }
    }
    
    /**
     * Updates UI elements
     */
    update() {
        // Update camera button text if camera mode changes
        if (this.cameraButton && this.cameraController) {
            this.cameraButton.textContent = `Camera: ${this.cameraController.getCurrentCameraName()}`;
        }
        
        // Update debug info if available
        if (this.debugInfoView) {
            this.debugInfoView.update();
        }
    }
} 