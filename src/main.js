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
import { RadiusControls } from './components/ui/RadiusControls';
import { RotationControls } from './components/ui/RotationControls';
import { DebugInfoView } from './components/ui/DebugInfoView';

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
            // Get canvas element
            this.canvas = document.getElementById('renderCanvas');
            
            if (!this.canvas) {
                console.error('Canvas element not found');
                this.showError('Canvas element not found. Please check your HTML.');
                return;
            }
            
            // Initialize the Babylon engine
            this.engine = await initializeEngine(this.canvas);
            
            // Create scene
            const { scene, shadowGenerator, axesViewer } = createScene(this.engine);
            this.scene = scene;
            this.shadowGenerator = shadowGenerator;
            
            // Create ground
            this.ground = new GroundModel(scene, 5000);
            
            // Create Ring Model
            this.ringModel = new RingModel(scene, new Vector3(0, 0, 0));
            
            // Create Star Model
            this.starModel = new StarModel(scene, new Vector3(0, 0, 0));
            
            // Make sure all models are visible
            this.ringModel.setVisible(true);
            this.starModel.setVisible(true);
            
            // Add shadows to all pipes in the scene
            // For Ring Model
            if (this.ringModel && typeof this.ringModel.getAllPipes === 'function') {
                const allRingPipes = this.ringModel.getAllPipes() || [];
                allRingPipes.forEach(pipe => {
                    shadowGenerator.addShadowCaster(pipe.pipeMesh);
                });
            }
            
            // For Star Model
            if (this.starModel && typeof this.starModel.getAllPipes === 'function') {
                const allStarPipes = this.starModel.getAllPipes() || [];
                allStarPipes.forEach(pipe => {
                    shadowGenerator.addShadowCaster(pipe.pipeMesh);
                });
            }
            
            // Combine all pipe meshes for collision detection
            const ringPipeMeshes = this.ringModel && typeof this.ringModel.getAllPipes === 'function'
                ? (this.ringModel.getAllPipes() || []).map(pipe => pipe.pipeMesh)
                : [];
                
            const starPipeMeshes = this.starModel && typeof this.starModel.getAllPipes === 'function'
                ? (this.starModel.getAllPipes() || []).map(pipe => pipe.pipeMesh)
                : [];
                
            const pipeMeshes = [...ringPipeMeshes, ...starPipeMeshes];
            
            // Create camera controller
            this.cameraController = new CameraController(
                scene, 
                this.canvas, 
                this.ground.mesh, 
                pipeMeshes
            );
            
            // Now that cameras are set up, apply default panel rotations to ensure they're properly displayed
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
                    app: this,
                    controlClasses: {
                        RadiusControls: RadiusControls,
                        RotationControls: RotationControls,
                        DebugInfoView: DebugInfoView
                    }
                }
            );
            
            // Store references to UI components for easier access
            this.rotationControls = this.uiController.rotationControls;
            this.radiusControls = this.uiController.radiusControls;
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
                
                // Update debug info if needed
                if (this.debugInfoView) {
                    this.debugInfoView.update();
                }
            });
            
            // Start the render loop
            this.startRenderLoop();
            
            // Handle window resize events
            window.addEventListener('resize', () => {
                this.engine.resize();
            });
            
            console.log('CHE Visualization initialized successfully');
        } catch (error) {
            console.error('Error initializing application:', error);
            this.showError(`Error initializing: ${error.message}`);
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
                console.log("Getting model stats:");
                return {
                    ringModel: {
                        childCount: this.ringModel.childModels ? this.ringModel.childModels.length : 0,
                        radius: this.ringModel.options ? this.ringModel.options.outerRadius : 'unknown'
                    },
                    starModel: {
                        childCount: this.starModel.childModels ? this.starModel.childModels.length : 0,
                        radius: this.starModel.options ? this.starModel.options.outerRadius : 'unknown'
                    }
                };
            },
            // Force a complete recalculation and update of child positions
            forceUpdatePositions: () => {
                console.log("Forcing complete recalculation of all positions...");
                
                // Update Ring Model positions
                if (this.ringModel && typeof this.ringModel.updateRadiusSettings === 'function') {
                    const outerRadius = this.ringModel.options ? this.ringModel.options.outerRadius : 72.52;
                    const singleCutRadius = this.ringModel.options ? this.ringModel.options.singleCutRadius : 21;
                    this.ringModel.updateRadiusSettings(outerRadius, singleCutRadius);
                    console.log(`Updated Ring Model positions with radius=${outerRadius}`);
                }
                
                // Update Star Model positions
                if (this.starModel && typeof this.starModel.updateRadiusSettings === 'function') {
                    const outerRadius = this.starModel.options ? this.starModel.options.outerRadius : 72.52;
                    const singleCutRadius = this.starModel.options ? this.starModel.options.singleCutRadius : 21;
                    this.starModel.updateRadiusSettings(outerRadius, singleCutRadius);
                    console.log(`Updated Star Model positions with radius=${outerRadius}`);
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