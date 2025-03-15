/**
 * Controls the user interface interactions
 */
export class UIController {
    constructor(cameraController) {
        this.cameraController = cameraController;
        this.showDebug = false;
        
        // Initialize UI elements
        this.initUI();
    }
    
    /**
     * Initializes UI elements and event listeners
     */
    initUI() {
        // Get UI elements
        this.modeToggle = document.getElementById('modeToggle');
        this.debugToggle = document.getElementById('debugToggle');
        this.cameraInfo = document.getElementById('cameraInfo');
        this.controlsInfo = document.getElementById('controlsInfo');
        
        // Add event listeners
        this.modeToggle.addEventListener('click', () => {
            this.cameraController.toggleCameraMode();
        });
        
        this.debugToggle.addEventListener('click', () => {
            this.toggleDebugInfo();
        });
        
        // Initialize help overlay toggle
        document.addEventListener('keydown', (event) => {
            if (event.code === 'KeyH') {
                document.body.classList.toggle('show-controls');
            }
        });
    }
    
    /**
     * Toggles the display of debug information
     */
    toggleDebugInfo() {
        this.showDebug = !this.showDebug;
        
        // Toggle debug ray visualization
        if (this.cameraController) {
            this.cameraController.showCollisionRays = this.showDebug;
        }
        
        // Update button text
        this.debugToggle.textContent = this.showDebug ? 'Hide Debug Info' : 'Show Debug Info';
        
        // Update camera info visibility
        this.cameraInfo.style.display = this.showDebug ? 'block' : 'none';
    }
    
    /**
     * Updates UI elements with current application state
     */
    update() {
        // Update camera mode text
        const cameraModeText = document.getElementById('cameraModeText');
        if (cameraModeText) {
            cameraModeText.textContent = this.cameraController.currentMode;
        }
    }
} 