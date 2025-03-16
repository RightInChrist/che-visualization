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

/**
 * Main application entry point
 */
class CHEVisualization {
    constructor() {
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
            
            // Create scene with camera and lights
            const { scene, shadowGenerator, axesViewer } = createScene(engine);
            this.scene = scene;
            this.shadowGenerator = shadowGenerator;
            this.axesViewer = axesViewer;
            
            // Create camera controller
            this.cameraController = new CameraController(
                scene, 
                canvas, 
                { 
                    initialPosition: new Vector3(0, 1000, 200),
                    zoomScaling: 5,
                    minDistance: 20,
                    maxDistance: 1500
                }
            );
            
            // Create ground model
            this.groundModel = new GroundModel(scene, 2000);
            
            // Create Ring model (visible by default)
            this.ringModel = new RingModel(scene, new Vector3(0, 0, 0), {
                debug: true
            });
            
            // Create Star model (invisible by default)
            this.starModel = new StarModel(scene, new Vector3(0, 0, 0), {
                debug: true
            });
            
            // Apply initializations that require a fully set up scene
            this.onRender();
            
            // Create an array of models for the scene editor
            const models = [this.ringModel, this.starModel];
            
            // Create scene editor
            this.sceneEditor = new SceneEditor(scene, models);
            
            // Create UI controller with enhanced capabilities
            this.uiController = new UIController(
                this.cameraController,
                {
                    scene: this.scene,
                    models: [this.ringModel, this.starModel],
                    sceneEditor: this.sceneEditor,
                    showDebugInfo: true,
                    showRadiusControl: true,
                    app: this,
                    controlClasses: {
                        DebugInfoView: DebugInfoView,
                        RadiusControl: RadiusControl
                    },
                    // Only show debug toggle in bottom right
                    showOnlyDebugToggle: true
                }
            );
            
            // Store references to UI components for easier access
            this.debugInfoView = this.uiController.debugInfoView;
            
            // Register before render callback for LOD updates
            scene.registerBeforeRender(() => {
                const cameraPosition = this.scene.activeCamera.position;
                
                // Update LOD for both models
                this.ringModel.updateLOD(cameraPosition);
                this.starModel.updateLOD(cameraPosition);
                
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
            
            console.log('Initialization complete');
            
        } catch (error) {
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
                starModel: this.starModel
            },
            // Helper functions
            getStats: () => {
                if (!this.ringModel || !this.starModel) {
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
                    starModel: {
                        childCount: this.starModel.childModels ? this.starModel.childModels.length : 0,
                        radius: this.starModel.options ? this.starModel.options.outerRadius : 'unknown',
                        layerOneRadius: this.starModel.layerOneStar && this.starModel.layerOneStar.options ? 
                            this.starModel.layerOneStar.options.radius.toFixed(1) : 'unknown',
                        layerTwoRadius: this.starModel.layerTwoStar && this.starModel.layerTwoStar.options ? 
                            this.starModel.layerTwoStar.options.radius.toFixed(1) : 'unknown',
                        layerThreeRadius: this.starModel.layerThreeStar && this.starModel.layerThreeStar.options ? 
                            this.starModel.layerThreeStar.options.radius.toFixed(1) : 'unknown',
                        layerFourRadius: this.starModel.layerFourStar && this.starModel.layerFourStar.options ? 
                            this.starModel.layerFourStar.options.radius.toFixed(1) : 'unknown'
                    }
                };
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
                
                // Update Star Model positions
                if (this.starModel && typeof this.starModel.updateRadiusSettings === 'function') {
                    const outerRadius = this.starModel.options ? this.starModel.options.outerRadius : 72.52;
                    const singleCutRadius = this.starModel.options ? this.starModel.options.singleCutRadius : 21;
                    this.starModel.updateRadiusSettings(outerRadius, singleCutRadius);
                    console.log(`Updated Star Model positions with outer radius=${outerRadius}`);
                }
                
                return "Force updated all model positions";
            },
            
            // Helper to explain how to use debug functions
            help: () => {
                console.log(`
CHE Visualization Debug Console Commands:
----------------------------------------
cheDebug.getStats() - Get basic statistics about models
cheDebug.forceUpdatePositions() - Force complete recalculation and update of positions
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
        
        // Apply to Star Model and all its children
        if (this.starModel) {
            processModel(this.starModel);
        }
        
        console.log('Model initialization complete');
    }
}

// Initialize the application when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CHEVisualization();
}); 