import { Vector3 } from '@babylonjs/core';
import { initializeEngine } from './core/engine';
import { createScene } from './core/scene';
import { GroundModel } from './components/models/GroundModel';
import { SingleCutModel } from './components/models/SingleCutModel';
import { CameraController } from './components/controllers/CameraController';
import { UIController } from './components/ui/UIController';
import { SceneEditor } from './components/ui/SceneEditor';

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
            
            // Create CHE model
            this.cheModel = new SingleCutModel(scene, new Vector3(0, 0, 0), {
                pipesCount: 7,
                hexRadius: 150
            });
            
            // Add shadows to models
            this.cheModel.pipes.forEach(pipe => {
                shadowGenerator.addShadowCaster(pipe.pipeMesh);
            });
            
            this.cheModel.panels.forEach(panel => {
                shadowGenerator.addShadowCaster(panel.panelMesh);
            });
            
            // Create camera controller
            this.cameraController = new CameraController(
                scene, 
                this.canvas, 
                this.ground.mesh, 
                this.cheModel.pipes.map(pipe => pipe.pipeMesh)
            );
            
            // Create UI controller
            this.uiController = new UIController(this.cameraController);
            
            // Organize scene objects for the scene editor
            const sceneObjects = {
                'Ground #1': this.ground,
                'Single CUT #1': this.cheModel,
                'Camera Controller': this.cameraController,
                'Lights': {
                    'Hemispheric Light': scene.getLightByName('hemisphericLight'),
                    'Directional Light': scene.getLightByName('directionalLight')
                },
                'Axes': axesViewer
            };
            
            // Create scene editor
            this.sceneEditor = new SceneEditor(scene, sceneObjects);
            
            // Register before render callback for LOD updates
            scene.registerBeforeRender(() => {
                const cameraPosition = this.scene.activeCamera.position;
                this.cheModel.updateLOD(cameraPosition);
                
                // Update scene editor if needed
                if (this.sceneEditor) {
                    this.sceneEditor.update();
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
}

// Initialize the application when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CHEVisualization();
}); 