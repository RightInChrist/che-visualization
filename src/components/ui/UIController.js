/**
 * Controls the user interface interactions
 */
export class UIController {
    constructor(cameraController) {
        this.cameraController = cameraController;
        
        // Create camera info panel for controls
        this.createControlsInfoPanel();
        
        // Initialize UI elements and buttons
        this.initUI();
    }
    
    /**
     * Initializes UI elements and event listeners
     */
    initUI() {
        // Create the camera toggle button
        this.createCameraToggleButton();
        
        // Initialize help overlay toggle
        document.addEventListener('keydown', (event) => {
            if (event.code === 'KeyH') {
                document.body.classList.toggle('show-controls');
            }
        });
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
                if (this.cameraController) {
                    this.cameraController.toggleCameraMode();
                }
            });
            
            // Add the button to the container
            buttonContainer.appendChild(button);
        } catch (error) {
            console.error("Error creating camera toggle button:", error);
        }
    }
    
    /**
     * Updates UI elements with current application state
     */
    update() {
        // Any UI updates can be added here if needed in the future
    }
} 