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
            isVisible: false,        // Initially hidden to avoid clutter
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
        
        console.log("DebugInfoView initialized - minimal version");
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
        // No-op for minimal implementation
    }
} 