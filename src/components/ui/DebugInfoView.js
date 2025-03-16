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
        
        // Create the HTML toggle button
        this.createHTMLToggleButton();
        
        console.log("DebugInfoView initialized - simple version");
    }
    
    /**
     * Create the HTML toggle button in the bottom right corner
     */
    createHTMLToggleButton() {
        try {
            console.log("Creating debug info toggle button");
            
            // Create button container if it doesn't exist
            let buttonContainer = document.getElementById('debugButtons');
            if (!buttonContainer) {
                buttonContainer = document.createElement('div');
                buttonContainer.id = 'debugButtons';
                buttonContainer.style.position = 'absolute';
                buttonContainer.style.bottom = '20px';
                buttonContainer.style.right = '20px';
                buttonContainer.style.display = 'flex';
                buttonContainer.style.flexDirection = 'row';
                buttonContainer.style.gap = '10px';
                buttonContainer.style.zIndex = '1000';
                document.body.appendChild(buttonContainer);
            }
            
            // Create toggle button
            const button = document.createElement('button');
            button.id = 'debugInfoToggle';
            button.textContent = 'Debug Info';
            button.style.backgroundColor = this.options.isVisible ? '#4CAF50' : '#444444';
            button.style.color = '#fff';
            button.style.border = 'none';
            button.style.padding = '8px 16px';
            button.style.borderRadius = '4px';
            button.style.cursor = 'pointer';
            button.style.fontWeight = 'bold';
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
            
        } catch (error) {
            console.error("Error creating debug info toggle button:", error);
        }
    }
    
    /**
     * Toggle visibility of the debug info
     */
    toggleVisible() {
        this.options.isVisible = !this.options.isVisible;
        
        if (this.toggleButton) {
            this.toggleButton.style.backgroundColor = this.options.isVisible ? '#4CAF50' : '#444444';
        }
        
        console.log(`Debug info visibility toggled: ${this.options.isVisible}`);
    }
    
    /**
     * Update method that can be called from main render loop
     */
    update() {
        // No-op for minimal implementation
    }
    
    /**
     * Dispose and clean up resources
     */
    dispose() {
        // Clean up the toggle button
        if (this.toggleButton && this.toggleButton.parentNode) {
            this.toggleButton.parentNode.removeChild(this.toggleButton);
        }
    }
} 