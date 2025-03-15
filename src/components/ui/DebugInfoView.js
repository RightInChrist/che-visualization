/**
 * DebugInfoView provides a panel that displays debug information about the scene and models
 */
export class DebugInfoView {
    /**
     * Create a new DebugInfoView instance
     * @param {Object} options - Additional options
     */
    constructor(options = {}) {
        this.options = Object.assign({
            maxLogEntries: 100,        // Maximum number of log entries to keep
            isVisible: false,          // Whether the panel is initially visible
            position: 'top-right',     // Position of the panel: 'top-right', 'top-left', 'bottom-right', 'bottom-left'
            width: '350px',            // Width of the panel
            zIndex: 1000,              // z-index of the panel
        }, options);
        
        // Store main app and controllers if provided
        this.app = options.app || null;
        this.cameraController = options.cameraController || null;
        
        // Initialize log storage
        this.logs = [];
        this.createUI();
        this.createLogContainer();
        this.createShowButton();
        this.createTabs();
        
        // Intercept console methods
        this.interceptConsoleMethods();
        
        // Set up a timer to update the camera info regularly
        this.setupCameraUpdateInterval();
        
        console.log("DebugInfoView initialized");
    }
    
    /**
     * Set the camera controller reference
     * @param {Object} cameraController - Reference to the camera controller
     */
    setCameraController(cameraController) {
        this.cameraController = cameraController;
        console.log("Camera controller set in DebugInfoView");
    }
    
    /**
     * Create the UI components for the debug info view
     */
    createUI() {
        try {
            console.log("Creating DebugInfoView UI");
            
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
            this.panel.style.order = '-1'; // Position at the top of flex container
            
            // Add scrolling capability
            this.panel.style.maxHeight = '30vh'; // 30% of viewport height
            this.panel.style.overflowY = 'auto'; // Add vertical scrollbar when needed
            this.panel.style.scrollBehavior = 'smooth'; // Smooth scrolling
            
            // Create title with stats
            const titleContainer = document.createElement('div');
            titleContainer.style.display = 'flex';
            titleContainer.style.justifyContent = 'space-between';
            titleContainer.style.alignItems = 'center';
            titleContainer.style.marginBottom = '10px';
            
            const title = document.createElement('h3');
            title.textContent = 'Debug Info';
            title.style.margin = '0';
            
            this.statsSpan = document.createElement('span');
            this.statsSpan.style.fontSize = '12px';
            this.statsSpan.textContent = 'FPS: -- | Models: --';
            
            // Clear button
            const clearButton = document.createElement('button');
            clearButton.textContent = 'Clear';
            clearButton.style.fontSize = '11px';
            clearButton.style.padding = '2px 6px';
            clearButton.style.marginLeft = '10px';
            clearButton.style.backgroundColor = '#555';
            clearButton.style.color = '#fff';
            clearButton.style.border = 'none';
            clearButton.style.borderRadius = '3px';
            clearButton.style.cursor = 'pointer';
            
            clearButton.addEventListener('click', () => {
                this.clearLogs();
            });
            
            titleContainer.appendChild(title);
            titleContainer.appendChild(this.statsSpan);
            titleContainer.appendChild(clearButton);
            this.panel.appendChild(titleContainer);
            
            // Create log container
            this.logContainer = document.createElement('div');
            this.logContainer.style.fontFamily = 'monospace';
            this.logContainer.style.fontSize = '12px';
            this.logContainer.style.paddingTop = '5px';
            this.logContainer.style.borderTop = '1px solid rgba(255, 255, 255, 0.3)';
            this.panel.appendChild(this.logContainer);
            
            // Add tabs for different types of information
            this.createTabs();
            
            // Add the panel to the control panels container
            // Insert at the beginning to be at the top
            if (this.controlPanels.firstChild) {
                this.controlPanels.insertBefore(this.panel, this.controlPanels.firstChild);
            } else {
                this.controlPanels.appendChild(this.panel);
            }
            
            // Create HTML button for debug info toggle
            this.createHTMLToggleButton();
            
            console.log("DebugInfoView UI created successfully");
        } catch (error) {
            console.error("Error creating DebugInfoView UI:", error);
        }
    }
    
    /**
     * Create tabs for different types of debug information
     */
    createTabs() {
        // Create tab container
        const tabContainer = document.createElement('div');
        tabContainer.style.display = 'flex';
        tabContainer.style.marginBottom = '10px';
        tabContainer.style.borderBottom = '1px solid rgba(255, 255, 255, 0.3)';
        
        // Define tabs - reorder to put Camera first
        const tabs = [
            { id: 'camera', label: 'Camera' },
            { id: 'log', label: 'Console' },
            { id: 'models', label: 'Models' }
        ];
        
        // Store the default tab
        const defaultTab = 'camera';
        
        // Create tab buttons
        tabs.forEach(tab => {
            const tabButton = document.createElement('button');
            tabButton.textContent = tab.label;
            tabButton.dataset.tabId = tab.id;
            tabButton.style.background = 'transparent';
            tabButton.style.border = 'none';
            tabButton.style.borderBottom = tab.id === defaultTab ? '2px solid #4CAF50' : '2px solid transparent';
            tabButton.style.color = tab.id === defaultTab ? '#4CAF50' : '#aaa';
            tabButton.style.padding = '5px 10px';
            tabButton.style.cursor = 'pointer';
            tabButton.style.margin = '0 5px 0 0';
            
            tabButton.addEventListener('click', () => {
                this.switchTab(tab.id);
                
                // Update all tab button styles
                tabContainer.querySelectorAll('button').forEach(btn => {
                    btn.style.borderBottom = btn.dataset.tabId === tab.id ? '2px solid #4CAF50' : '2px solid transparent';
                    btn.style.color = btn.dataset.tabId === tab.id ? '#4CAF50' : '#aaa';
                });
            });
            
            tabContainer.appendChild(tabButton);
        });
        
        // Insert tab container before the log container
        this.panel.insertBefore(tabContainer, this.logContainer);
        
        // Create content containers for each tab
        this.tabContents = {};
        
        tabs.forEach(tab => {
            const contentDiv = document.createElement('div');
            contentDiv.id = `tab-content-${tab.id}`;
            contentDiv.style.display = tab.id === defaultTab ? 'block' : 'none';
            contentDiv.style.overflow = 'auto';
            contentDiv.style.maxHeight = '20vh';
            
            this.tabContents[tab.id] = contentDiv;
            this.panel.appendChild(contentDiv);
        });
        
        // Move log container into the log tab
        this.tabContents.log.appendChild(this.logContainer);
        
        // Immediately initialize the camera tab content
        this.updateCameraInfo();
    }
    
    /**
     * Switch between tabs
     * @param {string} tabId - ID of the tab to switch to
     */
    switchTab(tabId) {
        // Hide all tab contents
        Object.values(this.tabContents).forEach(content => {
            content.style.display = 'none';
        });
        
        // Show the selected tab content
        if (this.tabContents[tabId]) {
            this.tabContents[tabId].style.display = 'block';
        }
        
        // Update tab-specific information
        if (tabId === 'models') {
            this.updateModelsInfo();
        } else if (tabId === 'camera') {
            this.updateCameraInfo();
        }
    }
    
    /**
     * Update models tab with information about scene models
     */
    updateModelsInfo() {
        if (!this.tabContents.models) return;
        
        // Clear current content
        this.tabContents.models.innerHTML = '';
        
        // Create info content
        const modelsInfo = document.createElement('div');
        modelsInfo.style.padding = '5px';
        
        // Try to find models in the scene
        try {
            // This would need to be expanded to actually find models in your app
            // For now, we'll add placeholder content
            modelsInfo.innerHTML = `
                <div style="margin-bottom: 8px;">
                    <strong>LayerOneModel:</strong> 
                    <span>visible: true, outerRadius: 36.4, SingleCUTs: 6</span>
                </div>
                <div style="margin-bottom: 8px;">
                    <strong>LayerOneStarModel:</strong> 
                    <span>visible: true, outerRadius: 42, SingleCUTs: 6</span>
                </div>
                <div style="margin-bottom: 8px;">
                    <strong>SingleCutModel (Central):</strong> 
                    <span>visible: true, radius: 21</span>
                </div>
                <div style="font-style: italic; color: #aaa; margin-top: 15px;">
                    Click the tab again to refresh model information
                </div>
            `;
        } catch (error) {
            modelsInfo.innerHTML = `<div style="color: #ff5555;">Error getting model info: ${error.message}</div>`;
        }
        
        this.tabContents.models.appendChild(modelsInfo);
    }
    
    /**
     * Update camera tab with information about the scene camera
     */
    updateCameraInfo() {
        if (!this.tabContents.camera) return;
        
        // Clear current content
        this.tabContents.camera.innerHTML = '';
        
        // Create info content
        const cameraInfo = document.createElement('div');
        cameraInfo.style.padding = '5px';
        
        // Try to find camera in the scene
        try {
            const scene = window.BABYLON && window.BABYLON.Engine.Instances.length > 0 ? 
                        window.BABYLON.Engine.Instances[0].scenes[0] : null;
            
            if (scene && scene.activeCamera) {
                const camera = scene.activeCamera;
                const pos = camera.position;
                
                // Format compact camera information header
                let cameraHTML = `
                    <div style="background-color: rgba(50, 50, 50, 0.6); padding: 8px; border-radius: 4px; margin-bottom: 10px;">
                        <div style="font-size: 16px; font-weight: bold; margin-bottom: 5px;">
                            ${this.cameraController ? this.cameraController.currentMode : camera.getClassName()}
                        </div>
                        <div>
                            Position: X: ${pos.x.toFixed(1)}, Y: ${pos.y.toFixed(1)}, Z: ${pos.z.toFixed(1)}
                        </div>
                `;
                
                // Add height information if available
                if (this.cameraController) {
                    const height = pos.y;
                    const maxPipeHeight = this.cameraController.maxPipeHeight || 1000;
                    const heightPercent = (height / maxPipeHeight) * 100;
                    
                    cameraHTML += `
                        <div>
                            Height: ${height.toFixed(1)}m (${heightPercent.toFixed(1)}%)
                        </div>
                    </div>
                    `;
                } else {
                    cameraHTML += `</div>`;
                }
                
                // Add additional camera details in separate section
                cameraHTML += `
                    <div style="margin-top: 15px; border-top: 1px solid rgba(255, 255, 255, 0.2); padding-top: 10px;">
                        <h4 style="margin-top: 0; margin-bottom: 10px; color: #aaa; font-size: 14px;">Additional Camera Details</h4>
                `;
                
                // Add camera controller specific information if available
                if (this.cameraController) {
                    cameraHTML += `
                        <div style="margin-bottom: 5px;">
                            <strong>Min Ground Height:</strong> 
                            <span>${this.cameraController.minHeightAboveGround || 0}m</span>
                        </div>
                        <div style="margin-bottom: 5px;">
                            <strong>Collision Distance:</strong> 
                            <span>${this.cameraController.collisionDistance || 0}m</span>
                        </div>
                        <div style="margin-bottom: 5px;">
                            <strong>Show Collision Rays:</strong> 
                            <span>${this.cameraController.showCollisionRays ? "Yes" : "No"}</span>
                        </div>
                    `;
                }
                
                // Add camera type information
                cameraHTML += `
                    <div style="margin-bottom: 5px;">
                        <strong>Camera Type:</strong> 
                        <span>${camera.getClassName()}</span>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <strong>FOV:</strong> 
                        <span>${(camera.fov * 180 / Math.PI).toFixed(1)}°</span>
                    </div>
                </div>
                `;
                
                cameraInfo.innerHTML = cameraHTML;
                
                // Add toggle button for collision rays if camera controller is available
                if (this.cameraController) {
                    const toggleRaysButton = document.createElement('button');
                    toggleRaysButton.textContent = this.cameraController.showCollisionRays ? 
                        "Hide Collision Rays" : "Show Collision Rays";
                    toggleRaysButton.style.padding = '6px 12px';
                    toggleRaysButton.style.margin = '10px 0';
                    toggleRaysButton.style.backgroundColor = '#555';
                    toggleRaysButton.style.color = '#fff';
                    toggleRaysButton.style.border = 'none';
                    toggleRaysButton.style.borderRadius = '3px';
                    toggleRaysButton.style.cursor = 'pointer';
                    
                    toggleRaysButton.addEventListener('click', () => {
                        if (this.cameraController) {
                            this.cameraController.showCollisionRays = !this.cameraController.showCollisionRays;
                            toggleRaysButton.textContent = this.cameraController.showCollisionRays ? 
                                "Hide Collision Rays" : "Show Collision Rays";
                            
                            // Update button style based on state
                            toggleRaysButton.style.backgroundColor = this.cameraController.showCollisionRays ? 
                                '#4CAF50' : '#555';
                        }
                    });
                    
                    cameraInfo.appendChild(toggleRaysButton);
                }
            } else {
                cameraInfo.innerHTML = `<div style="color: #ffaa55; padding: 10px;">No active camera found</div>`;
            }
        } catch (error) {
            cameraInfo.innerHTML = `<div style="color: #ff5555; padding: 10px;">Error getting camera info: ${error.message}</div>`;
        }
        
        this.tabContents.camera.appendChild(cameraInfo);
    }
    
    /**
     * Set up interception of console logs to display in the debug panel
     */
    setupConsoleInterception() {
        // Store original console methods
        this.originalConsoleMethods = {
            log: console.log,
            warn: console.warn,
            error: console.error,
            info: console.info
        };
        
        // Override console.log
        console.log = (...args) => {
            this.originalConsoleMethods.log(...args);
            this.addLogEntry('log', args);
        };
        
        // Override console.warn
        console.warn = (...args) => {
            this.originalConsoleMethods.warn(...args);
            this.addLogEntry('warn', args);
        };
        
        // Override console.error
        console.error = (...args) => {
            this.originalConsoleMethods.error(...args);
            this.addLogEntry('error', args);
        };
        
        // Override console.info
        console.info = (...args) => {
            this.originalConsoleMethods.info(...args);
            this.addLogEntry('info', args);
        };
    }
    
    /**
     * Add a log entry to the debug panel
     * @param {string} type - Log type ('log', 'warn', 'error', 'info')
     * @param {Array} args - Log arguments
     */
    addLogEntry(type, args) {
        const timestamp = new Date().toTimeString().split(' ')[0];
        const message = args.map(arg => {
            if (typeof arg === 'object') {
                try {
                    return JSON.stringify(arg);
                } catch (e) {
                    return String(arg);
                }
            }
            return String(arg);
        }).join(' ');
        
        // Create log entry
        this.logs.push({ type, message, timestamp });
        
        // Limit the number of logs
        if (this.logs.length > this.options.maxLogEntries) {
            this.logs.shift();
        }
        
        // Update the display
        this.updateLogDisplay();
    }
    
    /**
     * Update the log display with current logs
     */
    updateLogDisplay() {
        if (!this.logContainer) return;
        
        // Clear existing content
        this.logContainer.innerHTML = '';
        
        // Add each log entry
        this.logs.forEach(log => {
            const logEntry = document.createElement('div');
            logEntry.style.marginBottom = '4px';
            logEntry.style.wordBreak = 'break-word';
            logEntry.style.borderLeft = '3px solid';
            logEntry.style.paddingLeft = '8px';
            
            // Set colors based on log type
            switch (log.type) {
                case 'warn':
                    logEntry.style.borderLeftColor = '#FFCC00';
                    logEntry.style.color = '#FFCC00';
                    break;
                case 'error':
                    logEntry.style.borderLeftColor = '#FF5555';
                    logEntry.style.color = '#FF5555';
                    break;
                case 'info':
                    logEntry.style.borderLeftColor = '#55AAFF';
                    logEntry.style.color = '#55AAFF';
                    break;
                default:
                    logEntry.style.borderLeftColor = '#AAAAAA';
                    logEntry.style.color = '#FFFFFF';
            }
            
            // Add timestamp
            const timestamp = document.createElement('span');
            timestamp.style.color = '#888888';
            timestamp.style.marginRight = '8px';
            timestamp.style.fontSize = '11px';
            timestamp.textContent = log.timestamp;
            
            // Add message
            const message = document.createElement('span');
            message.textContent = log.message;
            
            logEntry.appendChild(timestamp);
            logEntry.appendChild(message);
            this.logContainer.appendChild(logEntry);
        });
        
        // Scroll to bottom
        this.logContainer.scrollTop = this.logContainer.scrollHeight;
    }
    
    /**
     * Clear all log entries
     */
    clearLogs() {
        this.logs = [];
        this.updateLogDisplay();
    }
    
    /**
     * Create the HTML toggle button
     */
    createHTMLToggleButton() {
        try {
            console.log("Creating debug info toggle button");
            
            // First look for the controlButtons container (newer UI layout)
            let buttonContainer = document.getElementById('controlButtons');
            
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
            button.id = 'debugInfoToggle';
            button.textContent = 'Debug Info';
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
            
            button.addEventListener('mouseover', () => {
                button.style.backgroundColor = this.options.isVisible ? '#45a049' : '#555555';
            });
            
            button.addEventListener('mouseout', () => {
                button.style.backgroundColor = this.options.isVisible ? '#4CAF50' : '#444444';
            });
            
            button.addEventListener('click', () => {
                console.log("Debug info toggle button clicked");
                this.toggleVisible();
            });
            
            // Add the button to the container
            buttonContainer.appendChild(button);
            console.log("Added debug info toggle button to container");
            
            // Store button reference
            this.showButton = button;
        } catch (error) {
            console.error("Error creating debug info toggle button:", error);
        }
    }
    
    /**
     * Toggle visibility of the debug info panel
     */
    toggleVisible() {
        console.log("Toggling debug info visibility");
        
        const newVisibility = !this.isVisible();
        console.log(`Setting debug info visibility to: ${newVisibility}`);
        
        if (this.panel) {
            this.panel.style.display = newVisibility ? 'block' : 'none';
        }
        
        if (this.showButton) {
            this.showButton.style.backgroundColor = newVisibility ? '#4CAF50' : '#444444';
        }
        
        // Store the visibility state
        this.options.isVisible = newVisibility;
        
        console.log(`Debug info visibility set to: ${this.isVisible()}`);
    }
    
    /**
     * Get visibility state of the debug info
     * @returns {boolean} - Whether the debug info is visible
     */
    isVisible() {
        return this.panel && this.panel.style.display === 'block';
    }
    
    /**
     * Update the stats display (FPS, etc.)
     * @param {Object} stats - Statistics to display
     */
    updateStats(stats = {}) {
        if (!this.statsSpan) return;
        
        const fps = stats.fps || '--';
        const modelCount = stats.modelCount || '--';
        
        this.statsSpan.textContent = `FPS: ${fps} | Models: ${modelCount}`;
    }
    
    /**
     * Update and refresh the debug info
     * Called regularly to update dynamic content
     */
    update() {
        // Update stats if available
        try {
            const fps = window.BABYLON && window.BABYLON.Engine.Instances.length > 0 ? 
                      Math.round(window.BABYLON.Engine.Instances[0].getFps()) : '--';
            
            this.updateStats({ fps });
            
            // Update camera tab content if it's visible
            if (this.tabContents && this.tabContents.camera && 
                this.tabContents.camera.style.display === 'block') {
                this.updateCameraInfo();
            }
        } catch (e) {
            // Silently fail if we can't get FPS
        }
    }
    
    /**
     * Restore original console methods and clean up resources
     */
    dispose() {
        // Restore original console methods
        if (this.originalConsoleMethods) {
            Object.keys(this.originalConsoleMethods).forEach(method => {
                console[method] = this.originalConsoleMethods[method];
            });
        }
        
        // Remove panel
        if (this.panel && this.panel.parentNode) {
            this.panel.parentNode.removeChild(this.panel);
        }
        
        // Remove button
        if (this.showButton && this.showButton.parentNode) {
            this.showButton.parentNode.removeChild(this.showButton);
        }
    }
    
    /**
     * Set up a timer to update camera information regularly
     */
    setupCameraUpdateInterval() {
        // Update camera info immediately
        this.updateCameraInfo();
        
        // Set up an interval to update camera information every 500ms
        this.cameraUpdateInterval = setInterval(() => {
            if (this.panel && this.panel.style.display !== 'none' && 
                this.tabContents && this.tabContents.camera && 
                this.tabContents.camera.style.display !== 'none') {
                this.updateCameraInfo();
            }
        }, 500);
    }
    
    /**
     * Clean up any intervals or listeners when destroying the view
     */
    destroy() {
        // Clear the camera update interval if it exists
        if (this.cameraUpdateInterval) {
            clearInterval(this.cameraUpdateInterval);
        }
        
        // Remove the panel from the DOM if it exists
        if (this.panel && this.panel.parentNode) {
            this.panel.parentNode.removeChild(this.panel);
        }
        
        // Remove the show button from the DOM if it exists
        if (this.showButton && this.showButton.parentNode) {
            this.showButton.parentNode.removeChild(this.showButton);
        }
        
        // Restore original console methods
        if (this.originalConsoleMethods) {
            Object.keys(this.originalConsoleMethods).forEach(method => {
                console[method] = this.originalConsoleMethods[method];
            });
        }
    }
} 