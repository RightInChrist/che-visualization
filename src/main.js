import { Vector3 } from '@babylonjs/core';
import '@babylonjs/core/Debug/debugLayer';
import '@babylonjs/loaders/glTF';
import '@babylonjs/gui';
import { initializeEngine } from './core/engine';
import { createScene } from './core/scene';
import { GroundModel } from './components/models/GroundModel';
import { SingleCutModel } from './components/models/SingleCutModel';
import { LayerOneModel } from './components/models/LayerOneModel';
import { LayerOneStarModel } from './components/models/LayerOneStarModel';
import { CameraController } from './components/controllers/CameraController';
import { UIController } from './components/ui/UIController';
import { SceneEditor } from './components/ui/SceneEditor';
import { RadiusControls } from './components/ui/RadiusControls';
import { RotationControl } from './components/ui/RotationControl';

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
            this.layerOneRadius = 42;
            this.singleCutRadius = 21;
            this.layerRotationAngle = 60; // Layer rotation angle in degrees
            
            // Create Central CUT model
            this.centralCut = new SingleCutModel(scene, new Vector3(0, 0, 0), {
                radius: this.singleCutRadius
            });
            
            // Create Layer One Ring model (with shared panels)
            this.layerOneRing = new LayerOneModel(scene, new Vector3(0, 0, 0), {
                outerRadius: this.layerOneRadius,
                singleCutRadius: this.singleCutRadius,
                rotationAngle: this.layerRotationAngle
            });
            
            // Create Layer One Star model (with separate panels)
            this.layerOneStar = new LayerOneStarModel(scene, new Vector3(0, 0, 0), {
                outerRadius: this.layerOneRadius,
                singleCutRadius: this.singleCutRadius,
                rotationAngle: this.layerRotationAngle
            });
            
            // Hide the Layer One Star model initially
            this.layerOneStar.setVisible(false);
            
            // Add shadows to all pipes in the scene
            const allCentralPipes = this.centralCut.pipes;
            allCentralPipes.forEach(pipe => {
                shadowGenerator.addShadowCaster(pipe.pipeMesh);
            });
            
            const allLayerOnePipes = this.layerOneRing.getAllPipes();
            allLayerOnePipes.forEach(pipe => {
                shadowGenerator.addShadowCaster(pipe.pipeMesh);
            });
            
            const allLayerOneStarPipes = this.layerOneStar.getAllPipes();
            allLayerOneStarPipes.forEach(pipe => {
                shadowGenerator.addShadowCaster(pipe.pipeMesh);
            });
            
            // Combine all pipe meshes for collision detection
            const centralPipeMeshes = allCentralPipes.map(pipe => pipe.pipeMesh);
            const layerOnePipeMeshes = allLayerOnePipes.map(pipe => pipe.pipeMesh);
            const layerOneStarPipeMeshes = allLayerOneStarPipes.map(pipe => pipe.pipeMesh);
            const pipeMeshes = [...centralPipeMeshes, ...layerOnePipeMeshes, ...layerOneStarPipeMeshes];
            
            // Create camera controller
            this.cameraController = new CameraController(
                scene, 
                this.canvas, 
                this.ground.mesh, 
                pipeMeshes
            );
            
            // Create UI controller
            this.uiController = new UIController(this.cameraController);
            
            // Create a nested structure for the scene editor
            const layerOneSingleCutsObjects = {};
            const layerOneStarSingleCutsObjects = {};
            
            // Add each LayerOne SingleCUT model to the scene editor
            this.layerOneRing.singleCuts.forEach((singleCut, index) => {
                layerOneSingleCutsObjects[`Single CUT #${index + 1}`] = singleCut;
            });
            
            // Add each LayerOneStar SingleCUT model to the scene editor
            this.layerOneStar.singleCuts.forEach((singleCut, index) => {
                layerOneStarSingleCutsObjects[`Single CUT #${index + 1}`] = singleCut;
            });
            
            // Organize scene objects for the scene editor
            const sceneObjects = {
                'Ground #1': this.ground,
                'Central CUT': this.centralCut,
                'Layer One Ring': {
                    model: this.layerOneRing,
                    children: layerOneSingleCutsObjects
                },
                'Layer One Star': {
                    model: this.layerOneStar,
                    children: layerOneStarSingleCutsObjects
                },
                'Camera Controller': {
                    children: {
                        'Orbit Camera': this.cameraController.orbitCamera,
                        'First Person Camera': this.cameraController.firstPersonCamera,
                        'Flight Camera': this.cameraController.flightCamera
                    }
                },
                'Lights': {
                    children: {
                        'Hemispheric Light': scene.getLightByName('hemisphericLight'),
                        'Directional Light': scene.getLightByName('directionalLight')
                    }
                },
                'Axes': axesViewer
            };
            
            // Create scene editor
            this.sceneEditor = new SceneEditor(scene, sceneObjects);
            
            // Create the radius controls for Layer One Ring
            const radiusControls = new RadiusControls(scene, this.layerOneRing, {
                position: { x: 10, y: 10 },
                outerRadiusMin: 30,
                outerRadiusMax: 50,
                outerRadiusDefault: this.layerOneRadius,
                isVisible: false
            });
            
            // Create the rotation controls for Layer One Ring
            const rotationControls = new RotationControl(
                scene, 
                this.layerOneRing, 
                this.layerRotationAngle,
                {
                    position: { x: 10, y: 170 },
                    rotationMin: 0,
                    rotationMax: 360,
                    rotationDefault: this.layerRotationAngle,
                    isVisible: false,
                    modelName: "Layer One Ring"
                }
            );
            
            // Create control panels container if it doesn't exist
            if (!document.getElementById('controlPanels')) {
                const controlPanels = document.createElement('div');
                controlPanels.id = 'controlPanels';
                controlPanels.style.position = 'absolute';
                controlPanels.style.top = '50px';
                controlPanels.style.left = '10px';
                controlPanels.style.display = 'flex';
                controlPanels.style.flexDirection = 'column';
                controlPanels.style.gap = '10px';
                controlPanels.style.zIndex = '100';
                document.body.appendChild(controlPanels);
            }
            
            // Register before render callback for LOD updates
            scene.registerBeforeRender(() => {
                const cameraPosition = this.scene.activeCamera.position;
                this.centralCut.updateLOD(cameraPosition);
                this.layerOneRing.updateLOD(cameraPosition);
                this.layerOneStar.updateLOD(cameraPosition);
                
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