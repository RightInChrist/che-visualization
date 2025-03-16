/**
 * DebugInfoView provides a panel that displays debug information about the scene and models
 */
export class DebugInfoView {
    /**
     * Create a new DebugInfoView instance
     * @param {Object} options - Additional options
     */
    constructor(options = {}) {
        // Default options
        const defaultOptions = {
            isVisible: true,         // Initially visible by default
            maxLogEntries: 50,       // Maximum log entries to keep
            textColor: "#ffffff",    // Text color
            backgroundColor: "rgba(0, 0, 0, 0.7)", // Background color
            position: "top",         // Position in the control panels stack
            cameraController: null   // Reference to the camera controller
        };
        
        this.options = { ...defaultOptions, ...options };
        
        // Store reference to camera controller if provided
        this.cameraController = this.options.cameraController;
        this.app = options.app || null;
        
        // Initialize logs array
        this.logs = [];
        
        // Create the UI components
        this.createPanel();
        this.createHTMLToggleButton();
        
        console.log("DebugInfoView initialized - simple version");
    }
    
    /**
     * Create the debug info panel
     */
    createPanel() {
        try {
            console.log("Creating DebugInfoView panel");
            
            // Find the control panels container
            this.controlPanels = document.getElementById('controlPanels');
            if (!this.controlPanels) {
                console.error("Control panels container not found");
                return;
            }
            
            // Create HTML panel for debug info
            this.panel = document.createElement('div');
            this.panel.id = 'debugInfoPanel';
            this.panel.style.backgroundColor = this.options.backgroundColor;
            this.panel.style.padding = '10px';
            this.panel.style.borderRadius = '5px';
            this.panel.style.color = this.options.textColor;
            this.panel.style.display = this.options.isVisible ? 'block' : 'none';
            this.panel.style.pointerEvents = 'auto'; // Enable pointer events
            this.panel.style.maxWidth = '400px';
            this.panel.style.maxHeight = '300px';
            this.panel.style.overflowY = 'auto';
            
            // Add order property to ensure it's displayed at the top
            this.panel.style.order = '-1'; // Negative value puts it at the top in flexbox
            
            // Create camera info content
            this.updateCameraInfo();
            
            // Add the panel to the control panels container as the first child
            if (this.controlPanels.firstChild) {
                this.controlPanels.insertBefore(this.panel, this.controlPanels.firstChild);
            } else {
                this.controlPanels.appendChild(this.panel);
            }
            
            console.log("DebugInfoView panel created successfully");
        } catch (error) {
            console.error("Error creating DebugInfoView panel:", error);
        }
    }
    
    /**
     * Update camera info in the panel
     */
    updateCameraInfo() {
        if (!this.panel || !this.cameraController) return;
        
        // Clear the panel
        this.panel.innerHTML = '';
        
        // Create header
        const header = document.createElement('div');
        header.style.marginBottom = '10px';
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        
        const title = document.createElement('h3');
        title.textContent = 'Camera Debug Info';
        title.style.margin = '0';
        title.style.fontSize = '16px';
        
        header.appendChild(title);
        this.panel.appendChild(header);
        
        // Camera info section
        try {
            const infoContainer = document.createElement('div');
            infoContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
            infoContainer.style.padding = '10px';
            infoContainer.style.borderRadius = '4px';
            infoContainer.style.marginBottom = '10px';
            
            // Get camera info from controller
            const camera = this.cameraController.currentCamera;
            const cameraMode = this.cameraController.currentMode;
            const position = camera.position;
            const height = position.y;
            const heightPercent = (height / this.cameraController.maxPipeHeight) * 100;
            
            // Create camera info HTML
            infoContainer.innerHTML = `
                <div style="font-weight: bold; font-size: 14px; margin-bottom: 5px;">
                    ${cameraMode}
                </div>
                <div style="margin-bottom: 5px;">
                    Position: X: ${position.x.toFixed(1)}, Y: ${position.y.toFixed(1)}, Z: ${position.z.toFixed(1)}
                </div>
                <div>
                    Height: ${height.toFixed(1)}m (${heightPercent.toFixed(1)}%)
                </div>
            `;
            
            this.panel.appendChild(infoContainer);
        } catch (error) {
            const errorMsg = document.createElement('div');
            errorMsg.style.color = '#ff5555';
            errorMsg.textContent = `Error getting camera info: ${error.message}`;
            this.panel.appendChild(errorMsg);
        }
    }
    
    /**
     * Create the HTML toggle button
     */
    createHTMLToggleButton() {
        try {
            console.log("Creating debug info toggle button");
            
            // Find the control buttons container that other toggles use
            let buttonContainer = document.getElementById('controlButtons');
            
            // If not found, try the older class-based selector
            if (!buttonContainer) {
                buttonContainer = document.querySelector('.control-buttons-container');
            }
            
            // If still not found, create a new container
            if (!buttonContainer) {
                console.error("Control buttons container not found, creating new one");
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
            }
            
            // Create toggle button with same styling as other buttons
            const button = document.createElement('button');
            button.id = 'debugInfoToggle';
            button.textContent = 'Debug';
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
            
            console.log("Debug info toggle button created successfully");
        } catch (error) {
            console.error("Error creating debug info toggle button:", error);
        }
    }
    
    /**
     * Toggle visibility of the debug info panel
     */
    toggleVisible() {
        this.options.isVisible = !this.options.isVisible;
        
        // Update button appearance
        if (this.toggleButton) {
            this.toggleButton.style.backgroundColor = this.options.isVisible ? '#4CAF50' : '#444444';
        }
        
        // Show/hide panel
        if (this.panel) {
            this.panel.style.display = this.options.isVisible ? 'block' : 'none';
        }
        
        console.log(`Debug info visibility toggled: ${this.options.isVisible}`);
    }
    
    /**
     * Update method that can be called from main render loop
     */
    update() {
        if (this.options.isVisible && this.panel) {
            this.updateCameraInfo();
        }
    }
    
    /**
     * Dispose and clean up resources
     */
    dispose() {
        // Clean up the toggle button
        if (this.toggleButton && this.toggleButton.parentNode) {
            this.toggleButton.parentNode.removeChild(this.toggleButton);
        }
        
        // Clean up the panel
        if (this.panel && this.panel.parentNode) {
            this.panel.parentNode.removeChild(this.panel);
        }
    }
} 