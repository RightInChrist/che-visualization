import { Vector3 } from '@babylonjs/core';
import '@babylonjs/core/Debug/debugLayer';
import '@babylonjs/loaders/glTF';
import '@babylonjs/gui';
import { initializeEngine } from './core/engine';
import { createScene } from './core/scene';
import { GroundModel } from './components/models/GroundModel';
import { StarModel } from './components/models/StarModel';
import { RingModel } from './components/models/RingModel';
import { CameraController } from './components/controllers/CameraController';
import { UIController } from './components/ui/UIController';
import { SceneEditor } from './components/ui/SceneEditor';
import { DebugInfoView } from './components/ui/DebugInfoView';
import { RadiusControl } from './components/ui/RadiusControl';
import { QualitySettingsController } from './components/ui/QualitySettingsController';

/**
 * Performance metrics tracker for measuring load times
 */
class PerformanceTracker {
    constructor() {
        this.startTime = performance.now();
        this.markers = {
            'start': this.startTime
        };
        this.durations = {};
        
        console.log(`[PERF] Starting performance measurement at ${new Date().toISOString()}`);
    }
    
    /**
     * Mark a timing point
     * @param {string} name - The name of the timing marker
     */
    mark(name) {
        const time = performance.now();
        this.markers[name] = time;
        
        // Calculate duration from start
        const durationFromStart = time - this.startTime;
        this.durations[name] = durationFromStart;
        
        console.log(`[PERF] ${name}: ${durationFromStart.toFixed(2)}ms`);
    }
    
    /**
     * Get the summary of all timings
     * @returns {Object} - Object containing all timing information
     */
    getSummary() {
        return {
            markers: this.markers,
            durations: this.durations,
            totalTime: this.durations['complete'] || (performance.now() - this.startTime)
        };
    }
    
    /**
     * Log a full performance summary to console
     */
    logSummary() {
        const totalTime = this.durations['complete'] || (performance.now() - this.startTime);
        
        console.group('%c[PERFORMANCE SUMMARY]', 'color: #4CAF50; font-weight: bold;');
        console.log(`%cTotal load time: ${totalTime.toFixed(2)}ms`, 'font-weight: bold;');
        
        // Log individual timings
        Object.keys(this.durations).forEach(key => {
            const percentage = ((this.durations[key] / totalTime) * 100).toFixed(1);
            console.log(`${key}: ${this.durations[key].toFixed(2)}ms (${percentage}%)`);
        });
        
        // Log browser and performance info
        console.log('\nEnvironment:');
        console.log(`User Agent: ${navigator.userAgent}`);
        console.log(`CPU Cores: ${navigator.hardwareConcurrency || 'unknown'}`);
        console.log(`Memory: ${navigator.deviceMemory ? navigator.deviceMemory + 'GB' : 'unknown'}`);
        console.log(`Date: ${new Date().toISOString()}`);
        console.log(`Quality Level: ${window.cheDebug?.app?.qualityController?.currentQuality || 'unknown'}`);
        
        console.groupEnd();
        
        return totalTime;
    }
}

/**
 * Main application entry point
 */
class CHEVisualization {
    constructor() {
        // Create performance tracker
        this.performanceTracker = new PerformanceTracker();
        
        // Initialize application
        this.init();
    }
    
    /**
     * Initialize the application
     */
    async init() {
        try {
            // Initialize engine and create scene
            const { engine, canvas } = await initializeEngine();
            this.engine = engine;
            this.canvas = canvas;
            
            this.performanceTracker.mark('engineInitialized');
            
            // Create scene with camera and lights
            const { scene, shadowGenerator, axesViewer } = createScene(engine);
            this.scene = scene;
            this.shadowGenerator = shadowGenerator;
            this.axesViewer = axesViewer;
            
            this.performanceTracker.mark('sceneCreated');
            
            // Create camera controller
            this.cameraController = new CameraController(
                scene, 
                canvas, 
                { 
                    initialPosition: new Vector3(0, 1000, 200),
                    zoomScaling: 5,
                    minDistance: 20,
                    maxDistance: 3000
                }
            );
            
            this.performanceTracker.mark('cameraCreated');
            
            // Create ground model
            this.groundModel = new GroundModel(scene, 2000);
            
            // Create Ring model (visible by default)
            this.ringModel = new RingModel(scene, new Vector3(0, 0, 0), {
                debug: true
            });
            
            this.performanceTracker.mark('ringModelCreated');
            
            // Create Star model but don't add it to the scene
            // Keep the reference for compatibility with existing code
            this.starModel = null; // Set to null instead of creating the model
            
            this.performanceTracker.mark('starModelCreated');
            
            // Apply initializations that require a fully set up scene
            this.onRender();
            
            this.performanceTracker.mark('modelsInitialized');
            
            // Create an array of models for the scene editor - exclude starModel
            const models = [this.ringModel];
            
            // Create scene editor
            this.sceneEditor = new SceneEditor(scene, models);
            
            // Create UI controller with enhanced capabilities
            this.uiController = new UIController(
                this.cameraController,
                {
                    scene: this.scene,
                    models: [this.ringModel], // Only include ringModel
                    sceneEditor: this.sceneEditor,
                    showDebugInfo: false, // Disable debug info by default
                    showRadiusControl: false, // Disable radius control by default
                    app: this,
                    controlClasses: {
                        DebugInfoView: DebugInfoView,
                        RadiusControl: RadiusControl
                    },
                    // Only show debug toggle in bottom right
                    showOnlyDebugToggle: false // Hide debug toggle by default
                }
            );
            
            this.performanceTracker.mark('uiCreated');
            
            // Store references to UI components for easier access
            this.debugInfoView = this.uiController.debugInfoView;
            
            // Setup quality settings controller
            this.qualityController = new QualitySettingsController(this.scene, this.engine);
            
            // Register before render callback for LOD updates
            scene.registerBeforeRender(() => {
                const cameraPosition = this.scene.activeCamera.position;
                
                // Update LOD for ringModel only
                this.ringModel.updateLOD(cameraPosition);
                // Don't update starModel's LOD since it's not created
                
                // Update scene editor if needed
                if (this.sceneEditor) {
                    this.sceneEditor.update();
                }
                
                // Update UI controller if needed
                if (this.uiController) {
                    this.uiController.update();
                }
            });
            
            // Create render loop
            this.startRenderLoop();
            
            this.performanceTracker.mark('renderLoopStarted');
            
            // First frame rendered - mark as complete
            // We use requestAnimationFrame to ensure we've actually rendered a frame
            requestAnimationFrame(() => {
                this.performanceTracker.mark('firstFrameRendered');
                
                // Wait for a second frame to ensure stability
                requestAnimationFrame(() => {
                    this.performanceTracker.mark('complete');
                    
                    // Log the performance summary
                    const totalTime = this.performanceTracker.logSummary();
                    console.log(`%cCHE Visualization loaded in ${totalTime.toFixed(2)}ms`, 'color: #4CAF50; font-size: 14px; font-weight: bold;');
                });
            });
            
            console.log('Initialization complete');
            
        } catch (error) {
            this.performanceTracker.mark('error');
            console.error('Initialization error:', error);
            this.showError(`Initialization error: ${error.message}`);
        }
    }
    
    /**
     * Start the render loop
     */
    startRenderLoop() {
        // Run the render loop
        this.engine.runRenderLoop(() => {
            if (this.scene) {
                this.scene.render();
            }
        });
        
        // Add global access to models for console debugging
        window.cheDebug = {
            app: this,
            models: {
                ringModel: this.ringModel,
                // Still include reference for debugging API compatibility
                starModel: null
            },
            // Helper functions
            getStats: () => {
                if (!this.ringModel) {
                    return "Models not initialized yet";
                }
                
                return {
                    cameraMode: this.cameraController ? this.cameraController.currentMode : 'unknown',
                    fps: this.engine ? this.engine.getFps().toFixed() : 'unknown',
                    ringModel: {
                        childCount: this.ringModel.childModels ? this.ringModel.childModels.length : 0,
                        layerOneRadius: this.ringModel.layerOneRing && this.ringModel.layerOneRing.options ? 
                            this.ringModel.layerOneRing.options.radius.toFixed(1) : 'unknown',
                        layerTwoRadius: this.ringModel.layerTwoRing && this.ringModel.layerTwoRing.options ? 
                            this.ringModel.layerTwoRing.options.radius.toFixed(1) : 'unknown',
                        layerThreeRadius: this.ringModel.layerThreeRing && this.ringModel.layerThreeRing.options ? 
                            this.ringModel.layerThreeRing.options.radius.toFixed(1) : 'unknown',
                        layerFourRadius: this.ringModel.layerFourRing && this.ringModel.layerFourRing.options ? 
                            this.ringModel.layerFourRing.options.radius.toFixed(1) : 'unknown',
                        layerFiveRadius: this.ringModel.layerFiveRing && this.ringModel.layerFiveRing.options ? 
                            this.ringModel.layerFiveRing.options.radius.toFixed(1) : 'unknown'
                    },
                    starModel: 'Not loaded' // Simplified output for star model
                };
            },
            // Get performance data
            getPerformance: () => {
                return this.performanceTracker ? this.performanceTracker.getSummary() : 'Performance tracking not available';
            },
            // Force a complete recalculation and update of child positions
            forceUpdatePositions: () => {
                    console.log("Forcing complete recalculation of all positions...");
                
                // Update Ring Model positions
                if (this.ringModel && typeof this.ringModel.updateRadiusSettings === 'function') {
                    const outerRadius = this.ringModel.layerFiveRing && this.ringModel.layerFiveRing.options ? 
                        this.ringModel.layerFiveRing.options.radius : 182.0;
                    const singleCutRadius = this.ringModel.options ? this.ringModel.options.singleCutRadius : 21;
                    this.ringModel.updateRadiusSettings(outerRadius, singleCutRadius);
                    console.log(`Updated Ring Model positions with outer radius=${outerRadius}`);
                }
                
                // Star model is not loaded, so no update needed
                
                return "Force updated all model positions";
            },
            // Add quality control to global debug
            setQuality: (level) => {
                if (this.qualityController) {
                    this.qualityController.setQuality(level);
                    return `Quality set to: ${level}`;
                }
                return "Quality controller not initialized";
            },
            
            // Helper to explain how to use debug functions
            help: () => {
                console.log(`
CHE Visualization Debug Console Commands:
----------------------------------------
cheDebug.getStats() - Get basic statistics about models
cheDebug.getPerformance() - Get performance timing data
cheDebug.forceUpdatePositions() - Force complete recalculation and update of positions
cheDebug.setQuality(level) - Set quality level ('low', 'medium', 'high', 'auto')
cheDebug.models - Access all models directly
cheDebug.app - Access the main application instance
`);
            }
        };
        
        // Log help information in console for debugging
        console.log("%c CHE Visualization Debug Tools Available", "background: #222; color: #bada55; font-size: 14px; padding: 5px;");
        console.log("%c Use cheDebug.help() for available commands", "color: #bada55;");
    }
    
    /**
     * Show an error message to the user
     * @param {string} message - The error message to display
     */
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.position = 'absolute';
        errorDiv.style.top = '50%';
        errorDiv.style.left = '50%';
        errorDiv.style.transform = 'translate(-50%, -50%)';
        errorDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
        errorDiv.style.color = 'white';
        errorDiv.style.padding = '20px';
        errorDiv.style.borderRadius = '5px';
        errorDiv.style.zIndex = '1000';
        errorDiv.innerHTML = `
            <h3>Error</h3>
            <p>${message}</p>
            <p>Please check your browser console for more details.</p>
            <div id="webglInfo"></div>
        `;
        
        document.body.appendChild(errorDiv);
        
        // Add WebGL info if applicable
        const webglInfo = document.getElementById('webglInfo');
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown';
                webglInfo.innerHTML = `<p>WebGL Renderer: ${renderer}</p>`;
            } else {
                webglInfo.innerHTML = `<p>WebGL not available in your browser</p>`;
            }
        } catch (e) {
            webglInfo.innerHTML = `<p>Could not get WebGL information: ${e.message}</p>`;
        }
    }
    
    /**
     * Execute render initialization for all models in the scene
     * This ensures all models are properly initialized after scene setup
     */
    onRender() {
        console.log('Initializing models after scene setup');
        
        // Function to process a model and its children
        const processModel = (model) => {
            // Apply to this model if it has the method
            if (model && typeof model.onRender === 'function') {
                model.onRender();
            }
            
            // Apply to child models
            if (model && model.childModels && Array.isArray(model.childModels)) {
                model.childModels.forEach(childModel => {
                    processModel(childModel);
                });
            }
        };
        
        // Apply to Ring Model and all its children
        if (this.ringModel) {
            processModel(this.ringModel);
        }
        
        // Star model is not created, so no need to initialize it
        
        console.log('Model initialization complete');
    }
}

// Initialize the application when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CHEVisualization();
}); 