/**
 * Controls the user interface interactions
 */
export class UIController {
    constructor(cameraController) {
        this.cameraController = cameraController;
        this.showDebug = false;
        
        // Create debug and camera info panels
        this.createDebugPanel();
        this.createControlsInfoPanel();
        
        // Initialize UI elements and buttons
        this.initUI();
    }
    
    /**
     * Initializes UI elements and event listeners
     */
    initUI() {
        // Create the camera and debug toggle buttons
        this.createCameraToggleButton();
        this.createDebugToggleButton();
        
        // Initialize help overlay toggle
        document.addEventListener('keydown', (event) => {
            if (event.code === 'KeyH') {
                document.body.classList.toggle('show-controls');
            }
        });
        
        // Initialize with camera info hidden by default
        if (this.cameraInfo) {
            this.cameraInfo.style.display = this.showDebug ? 'block' : 'none';
        }
    }
    
    /**
     * Creates the debug info panel
     */
    createDebugPanel() {
        // Find the control panels container
        const controlPanels = document.getElementById('controlPanels');
        if (!controlPanels) {
            console.error("Control panels container not found");
            return;
        }
        
        // Create camera info panel
        this.cameraInfo = document.createElement('div');
        this.cameraInfo.id = 'cameraInfo';
        this.cameraInfo.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        this.cameraInfo.style.padding = '10px';
        this.cameraInfo.style.borderRadius = '5px';
        this.cameraInfo.style.color = '#ffffff';
        this.cameraInfo.style.display = 'none';  // Hidden by default
        this.cameraInfo.style.zIndex = '100';
        this.cameraInfo.style.position = 'absolute';
        this.cameraInfo.style.top = '10px';
        this.cameraInfo.style.left = '10px';
        
        // Add camera info content
        const positionDiv = document.createElement('div');
        positionDiv.innerHTML = 'Position: <span id="positionText">0, 0, 0</span>';
        
        const heightDiv = document.createElement('div');
        heightDiv.innerHTML = 'Height: <span id="heightText">0m</span> (<span id="heightPercentText">0%</span>)';
        
        const cameraModeDiv = document.createElement('div');
        cameraModeDiv.innerHTML = 'Camera Mode: <span id="cameraModeText">Orbit</span>';
        
        this.cameraInfo.appendChild(positionDiv);
        this.cameraInfo.appendChild(heightDiv);
        this.cameraInfo.appendChild(cameraModeDiv);
        
        // Add to control panels
        controlPanels.appendChild(this.cameraInfo);
    }
    
    /**
     * Creates the controls info panel
     */
    createControlsInfoPanel() {
        // Find the control panels container
        const controlPanels = document.getElementById('controlPanels');
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
        this.controlsInfo.style.top = '150px';
        this.controlsInfo.style.left = '10px';
        this.controlsInfo.style.maxWidth = '400px';
        
        // Add controls info content
        this.controlsInfo.innerHTML = `
            <h3>Controls</h3>
            <p>Orbit Mode: Left-click drag to rotate, right-click drag to pan, scroll to zoom</p>
            <p>First-Person Mode: WASD to move, mouse to look</p>
            <p>Flight Mode: WASD to move, space/shift for up/down, mouse to look</p>
            <p>Press H to toggle this help</p>
            <p>Press M to toggle camera mode</p>
            <p>Press E to toggle Scene Editor</p>
            <h3>Scene Editor</h3>
            <p>Use the Scene Editor to toggle visibility of scene objects</p>
            <p>Objects are organized hierarchically, with pipes and panels nested under the SingleCUT model</p>
        `;
        
        // Add to control panels
        controlPanels.appendChild(this.controlsInfo);
    }
    
    /**
     * Creates the camera toggle button
     */
    createCameraToggleButton() {
        try {
            // Create button container if it doesn't exist
            let buttonContainer = document.querySelector('.control-buttons-container');
            if (!buttonContainer) {
                buttonContainer = document.createElement('div');
                buttonContainer.className = 'control-buttons-container';
                buttonContainer.style.position = 'absolute';
                buttonContainer.style.bottom = '20px';
                buttonContainer.style.right = '20px';
                buttonContainer.style.display = 'flex';
                buttonContainer.style.flexDirection = 'column';
                buttonContainer.style.gap = '10px';
                buttonContainer.style.zIndex = '100';
                document.body.appendChild(buttonContainer);
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
            button.style.width = '120px';
            button.style.textAlign = 'center';
            button.style.transition = 'background-color 0.3s';
            
            button.addEventListener('mouseover', () => {
                button.style.backgroundColor = '#444';
            });
            
            button.addEventListener('mouseout', () => {
                button.style.backgroundColor = '#333';
            });
            
            button.addEventListener('click', () => {
                this.cameraController.toggleCameraMode();
                this.update();
            });
            
            // Add the button to the container
            buttonContainer.appendChild(button);
            
            // Store button reference
            this.cameraToggleButton = button;
        } catch (error) {
            console.error("Error creating camera toggle button:", error);
        }
    }
    
    /**
     * Creates the debug toggle button
     */
    createDebugToggleButton() {
        try {
            // Create button container if it doesn't exist
            let buttonContainer = document.querySelector('.control-buttons-container');
            if (!buttonContainer) {
                buttonContainer = document.createElement('div');
                buttonContainer.className = 'control-buttons-container';
                buttonContainer.style.position = 'absolute';
                buttonContainer.style.bottom = '20px';
                buttonContainer.style.right = '20px';
                buttonContainer.style.display = 'flex';
                buttonContainer.style.flexDirection = 'column';
                buttonContainer.style.gap = '10px';
                buttonContainer.style.zIndex = '100';
                document.body.appendChild(buttonContainer);
            }
            
            // Create button
            const button = document.createElement('button');
            button.textContent = 'Debug';
            button.className = 'control-button';
            button.style.backgroundColor = this.showDebug ? '#555' : '#333';
            button.style.color = '#fff';
            button.style.border = 'none';
            button.style.padding = '8px 16px';
            button.style.borderRadius = '4px';
            button.style.cursor = 'pointer';
            button.style.fontWeight = 'bold';
            button.style.width = '120px';
            button.style.textAlign = 'center';
            button.style.transition = 'background-color 0.3s';
            
            button.addEventListener('mouseover', () => {
                button.style.backgroundColor = this.showDebug ? '#666' : '#444';
            });
            
            button.addEventListener('mouseout', () => {
                button.style.backgroundColor = this.showDebug ? '#555' : '#333';
            });
            
            button.addEventListener('click', () => this.toggleDebugInfo());
            
            // Add the button to the container
            buttonContainer.appendChild(button);
            
            // Store button reference
            this.debugToggleButton = button;
        } catch (error) {
            console.error("Error creating debug toggle button:", error);
        }
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
        
        // Update button state
        if (this.debugToggleButton) {
            this.debugToggleButton.style.backgroundColor = this.showDebug ? '#555' : '#333';
        }
        
        // Update camera info visibility
        if (this.cameraInfo) {
            this.cameraInfo.style.display = this.showDebug ? 'block' : 'none';
        }
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