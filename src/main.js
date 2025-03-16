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
import { LayerTwoModel } from './components/models/LayerTwoModel';
import { LayerTwoStarModel } from './components/models/LayerTwoStarModel';
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
            
            // Create Ring Model (contains Central CUT, Layer One Ring, and Layer Two Ring)
            this.ringModel = new RingModel(scene, new Vector3(0, 0, 0), {
                visibility: {
                    centralCut: true,
                    layerOne: true,
                    layerTwo: true  // Layer Two Ring visible at startup
                }
            });
            
            // Create Star Model (contains Central CUT, Layer One Star, and Layer Two Star)
            this.starModel = new StarModel(scene, new Vector3(0, 0, 0), {
                visibility: {
                    centralCut: true,
                    layerOne: true,
                    layerTwo: true  // Layer Two Star visible at startup
                }
            });
            
            // Hide the Star model initially (will be reflected in the SceneEditor)
            this.starModel.setVisible(false);
            
            // Add shadows to all pipes in the scene
            // For Ring Model
            const allRingPipes = this.ringModel.getAllPipes();
            allRingPipes.forEach(pipe => {
                shadowGenerator.addShadowCaster(pipe.pipeMesh);
            });
            
            // For Star Model
            const allStarPipes = this.starModel.getAllPipes();
            allStarPipes.forEach(pipe => {
                shadowGenerator.addShadowCaster(pipe.pipeMesh);
            });
            
            // Combine all pipe meshes for collision detection
            const ringPipeMeshes = allRingPipes.map(pipe => pipe.pipeMesh);
            const starPipeMeshes = allStarPipes.map(pipe => pipe.pipeMesh);
            const pipeMeshes = [...ringPipeMeshes, ...starPipeMeshes];
            
            // Create camera controller
            this.cameraController = new CameraController(
                scene, 
                this.canvas, 
                this.ground.mesh, 
                pipeMeshes
            );
            
            // Create UI controller
            this.uiController = new UIController(this.cameraController);
            
            // Get all SingleCUT models for scene editor organization
            const ringModelSingleCuts = this.ringModel.getAllSingleCuts();
            const starModelSingleCuts = this.starModel.getAllSingleCuts();
            
            // Prepare SingleCUTs for the scene editor
            const ringCentralSingleCutObjects = {};
            const ringLayerOneSingleCutObjects = {};
            const ringLayerTwoSingleCutObjects = {};
            
            // Add Central CUT from Ring Model
            if (ringModelSingleCuts.central.length > 0) {
                ringModelSingleCuts.central.forEach((singleCut, index) => {
                    ringCentralSingleCutObjects['Central CUT'] = singleCut;
                });
            }
            
            // Add each Layer One SingleCUT from Ring Model
            ringModelSingleCuts.layerOne.forEach((singleCut, index) => {
                ringLayerOneSingleCutObjects[`Single CUT #${index + 1}`] = singleCut;
            });
            
            // Add each Layer Two SingleCUT from Ring Model
            ringModelSingleCuts.layerTwo.forEach((singleCut, index) => {
                ringLayerTwoSingleCutObjects[`Single CUT #${index + 1}`] = singleCut;
            });
            
            // Prepare Star Model SingleCUTs for the scene editor
            const starCentralSingleCutObjects = {};
            const starLayerOneSingleCutObjects = {};
            const starLayerTwoSingleCutObjects = {};
            
            // Add Central CUT from Star Model
            if (starModelSingleCuts.central.length > 0) {
                starModelSingleCuts.central.forEach((singleCut, index) => {
                    starCentralSingleCutObjects['Central CUT'] = singleCut;
                });
            }
            
            // Add each Layer One SingleCUT from Star Model
            starModelSingleCuts.layerOne.forEach((singleCut, index) => {
                starLayerOneSingleCutObjects[`Single CUT #${index + 1}`] = singleCut;
            });
            
            // Add each Layer Two SingleCUT from Star Model
            starModelSingleCuts.layerTwo.forEach((singleCut, index) => {
                starLayerTwoSingleCutObjects[`Single CUT #${index + 1}`] = singleCut;
            });
            
            // Organize scene objects for the scene editor
            const sceneObjects = {
                'Ground #1': this.ground,
                'Ring Model': {
                    model: this.ringModel,
                    children: {
                        'Central CUT': {
                            model: this.ringModel.models.centralCut,
                            children: ringCentralSingleCutObjects
                        },
                        'Layer One Ring': {
                            model: this.ringModel.models.layerOneRing,
                            children: ringLayerOneSingleCutObjects
                        },
                        'Layer Two Ring': {
                            model: this.ringModel.models.layerTwoRing,
                            children: ringLayerTwoSingleCutObjects
                        }
                    }
                },
                'Star Model': {
                    model: this.starModel,
                    children: {
                        'Central CUT': {
                            model: this.starModel.models.centralCut,
                            children: starCentralSingleCutObjects
                        },
                        'Layer One Star': {
                            model: this.starModel.models.layerOneStar,
                            children: starLayerOneSingleCutObjects
                        },
                        'Layer Two Star': {
                            model: this.starModel.models.layerTwoStar,
                            children: starLayerTwoSingleCutObjects
                        }
                    }
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
            
            // Create toggle buttons container if it doesn't exist
            if (!document.getElementById('toggleButtons')) {
                const toggleButtons = document.createElement('div');
                toggleButtons.id = 'toggleButtons';
                toggleButtons.style.position = 'absolute';
                toggleButtons.style.top = '10px';
                toggleButtons.style.left = '10px';
                toggleButtons.style.display = 'flex';
                toggleButtons.style.flexDirection = 'row';
                toggleButtons.style.gap = '10px';
                toggleButtons.style.zIndex = '100';
                document.body.appendChild(toggleButtons);
            }
            
            // Get all layers from both models for radius and rotation controls
            const layerModels = [
                this.ringModel.models.layerOneRing,
                this.ringModel.models.layerTwoRing,
                this.starModel.models.layerOneStar,
                this.starModel.models.layerTwoStar
            ];
            
            // Create radius controls
            const radiusControls = new RadiusControls(
                scene, 
                layerModels,
                {
                    isVisible: false,
                    modelNames: ["Layer One Ring", "Layer Two Ring", "Layer One Star", "Layer Two Star"]
                }
            );
            
            // Create rotation controls
            const rotationControls = new RotationControls(
                scene, 
                layerModels, 
                {
                    isVisible: false,
                    modelNames: ["Layer One Ring", "Layer Two Ring", "Layer One Star", "Layer Two Star"]
                }
            );
            
            // Create debug info view (positioned at the top of control panels)
            const debugInfoView = new DebugInfoView({
                isVisible: true,
                cameraController: this.cameraController,
                app: this
            });
            
            // Store the controls in class properties for later access
            this.rotationControls = rotationControls;
            this.debugInfoView = debugInfoView;
            
            // Add click handler for model inspection
            this.setupModelClickHandler();
            
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
     * Set up click handler to inspect models
     */
    setupModelClickHandler() {
        // Create the info panel
        const infoPanel = document.createElement('div');
        infoPanel.id = 'modelInfoPanel';
        infoPanel.style.position = 'absolute';
        infoPanel.style.bottom = '10px';
        infoPanel.style.left = '10px';
        infoPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        infoPanel.style.color = '#fff';
        infoPanel.style.padding = '10px';
        infoPanel.style.borderRadius = '5px';
        infoPanel.style.fontFamily = 'monospace';
        infoPanel.style.fontSize = '14px';
        infoPanel.style.zIndex = '1000';
        infoPanel.style.maxWidth = '400px';
        infoPanel.style.display = 'none';
        infoPanel.style.pointerEvents = 'none'; // Don't interfere with other UI elements
        document.body.appendChild(infoPanel);
        
        // Store reference
        this.modelInfoPanel = infoPanel;
        
        // Add click handler to the scene
        this.scene.onPointerDown = (evt, pickResult) => {
            // Only handle left clicks
            if (evt.button !== 0) return;
            
            if (pickResult.hit) {
                const mesh = pickResult.pickedMesh;
                if (!mesh) return;
                
                // Try to find the parent model
                let model = null;
                let modelType = null;
                
                // Start by looking for pipe meshes
                if (mesh.name.includes('pipe')) {
                    // Find the parent PipeModel
                    const pipe = this.findParentPipe(mesh);
                    if (pipe) {
                        // Try to find parent SingleCutModel of this pipe
                        model = this.findParentModel(pipe.rootNode);
                        if (model) {
                            modelType = 'SingleCutModel';
                        }
                    }
                }
                
                // Check if we found a model to display info for
                if (model && model instanceof SingleCutModel) {
                    this.showModelInfo(model, modelType, pickResult.pickedPoint);
                } else {
                    this.hideModelInfo();
                }
            } else {
                this.hideModelInfo();
            }
        };
    }
    
    /**
     * Find the parent PipeModel of a mesh
     * @param {BABYLON.Mesh} mesh - The mesh to find the parent for
     * @returns {PipeModel|null} - The parent PipeModel or null if not found
     */
    findParentPipe(mesh) {
        // Get all pipes from ring and star models
        const allPipes = [...this.ringModel.getAllPipes(), ...this.starModel.getAllPipes()];
        
        // Find the pipe that owns this mesh
        return allPipes.find(pipe => 
            pipe.pipeMesh === mesh || pipe.pipeMesh.id === mesh.id
        );
    }
    
    /**
     * Find the parent SingleCutModel of a node
     * @param {BABYLON.TransformNode} node - The node to find the parent for
     * @returns {SingleCutModel|null} - The parent SingleCutModel or null if not found
     */
    findParentModel(node) {
        // Get all SingleCUTs from ring and star models
        const ringCuts = this.ringModel.getAllSingleCuts();
        const starCuts = this.starModel.getAllSingleCuts();
        
        // Combine all SingleCUT models
        const allCuts = [
            ...ringCuts.central,
            ...ringCuts.layerOne,
            ...ringCuts.layerTwo,
            ...starCuts.central,
            ...starCuts.layerOne,
            ...starCuts.layerTwo
        ];
        
        // Find the SingleCUT model that contains this node
        return allCuts.find(model => {
            return (model.rootNode === node || model.rootNode.id === node.id || 
                   (node.parent && (model.rootNode === node.parent || model.rootNode.id === node.parent.id)));
        });
    }
    
    /**
     * Show information about a picked model
     * @param {Object} model - The model to show info for
     * @param {string} modelType - The type of model
     * @param {BABYLON.Vector3} pickedPoint - The point where the pick occurred
     */
    showModelInfo(model, modelType, pickedPoint) {
        if (!this.modelInfoPanel) return;
        
        // Get absolute world position of the model
        const worldPosition = model.rootNode.getAbsolutePosition();
        
        // Determine parent model info
        let parentInfo = "None";
        let parentType = "None";
        let layerType = "Unknown";
        
        if (model.options && model.options.parent) {
            const parent = model.options.parent;
            parentType = parent.constructor.name;
            
            if (parent.constructor.name.includes("LayerOne")) {
                layerType = "Layer One";
            } else if (parent.constructor.name.includes("LayerTwo")) {
                layerType = "Layer Two";
            } else if (parent.constructor.name.includes("Central")) {
                layerType = "Central";
            }
            
            parentInfo = `${parentType} (${parent.rootNode ? parent.rootNode.id : 'No ID'})`;
        }
        
        // Create info HTML
        let infoHTML = `
            <h4 style="margin: 0 0 8px 0; color: #00aaff;">SingleCUT Model Info</h4>
            <div style="margin-bottom: 5px;"><strong>Instance ID:</strong> ${model.uniqueId || 'Unknown'}</div>
            <div style="margin-bottom: 5px;"><strong>Instance #:</strong> ${model.instanceNumber || 'Unknown'}</div>
            <div style="margin-bottom: 5px;"><strong>Created:</strong> ${model.creationTime ? model.creationTime.split('T')[1].substring(0, 12) : 'Unknown'}</div>
            <div style="margin-bottom: 5px;"><strong>BabylonJS ID:</strong> ${model.rootNode ? model.rootNode.id : 'Unknown'}</div>
            <div style="margin-bottom: 5px;"><strong>Layer:</strong> ${layerType}</div>
            <div style="margin-bottom: 5px;"><strong>Parent:</strong> ${parentInfo}</div>
            <div style="margin-bottom: 8px;"><strong>Position:</strong> 
                <div style="padding-left: 10px;">
                    X: ${worldPosition.x.toFixed(2)}<br>
                    Y: ${worldPosition.y.toFixed(2)}<br>
                    Z: ${worldPosition.z.toFixed(2)}
                </div>
            </div>
            <div style="margin-bottom: 8px;"><strong>Radius Settings:</strong> 
                <div style="padding-left: 10px;">
                    Model Radius: ${model.options.radius.toFixed(2)}<br>
                    Parent Outer Radius: ${model.options.parent ? model.options.parent.options.outerRadius.toFixed(2) : 'N/A'}<br>
                    Parent Inner Radius: ${model.options.parent && model.options.parent.options.innerRadius ? model.options.parent.options.innerRadius.toFixed(2) : 'N/A'}
                </div>
            </div>
            <div style="font-size: 12px; color: #aaa;">(Click anywhere else to dismiss)</div>
        `;
        
        // Update and show panel
        this.modelInfoPanel.innerHTML = infoHTML;
        this.modelInfoPanel.style.display = 'block';
    }
    
    /**
     * Hide the model info panel
     */
    hideModelInfo() {
        if (this.modelInfoPanel) {
            this.modelInfoPanel.style.display = 'none';
        }
    }
}

// Initialize the application when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CHEVisualization();
}); 