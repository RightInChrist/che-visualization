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
            
            // Create Central CUT model separately
            this.centralCutModel = new SingleCutModel(scene, new Vector3(0, 0, 0));
            this.centralCutModel.friendlyName = "Central CUT";
            
            // Create Ring Model (contains Layer One Ring and Layer Two Ring)
            this.ringModel = new RingModel(scene, new Vector3(0, 0, 0), {
                visibility: {
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
            
            // Make sure both models are visible
            this.ringModel.setVisible(true);
            this.starModel.setVisible(true);
            this.centralCutModel.setVisible(true);
            
            // Apply a 30-degree global rotation to all SingleCUTs in the Star models for better appearance
            console.log('Applying 30-degree global rotation to all SingleCUTs in the Star models...');
            if (this.starModel.models.layerOneStar) {
                this.starModel.models.layerOneStar.updateAllSingleCutRotations(30);
                console.log('Applied 30-degree rotation to all SingleCUTs in LayerOneStar');
            }
            if (this.starModel.models.layerTwoStar) {
                this.starModel.models.layerTwoStar.updateAllSingleCutRotations(30);
                console.log('Applied 30-degree rotation to all SingleCUTs in LayerTwoStar');
            }
            
            // Force specific visibility checks on LayerTwoStar
            console.log('Ensuring LayerTwoStar is visible...');
            if (this.starModel.models.layerTwoStar) {
                this.starModel.models.layerTwoStar.setVisible(true);
                console.log('LayerTwoStar visibility forced:', this.starModel.models.layerTwoStar.isVisible());
            }
            
            // Add shadows to all pipes in the scene
            // For Central CUT
            if (this.centralCutModel && this.centralCutModel.pipes) {
                this.centralCutModel.pipes.forEach(pipe => {
                    shadowGenerator.addShadowCaster(pipe.pipeMesh);
                });
            }
            
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
            const centralCutPipeMeshes = this.centralCutModel.pipes ? this.centralCutModel.pipes.map(pipe => pipe.pipeMesh) : [];
            const ringPipeMeshes = allRingPipes.map(pipe => pipe.pipeMesh);
            const starPipeMeshes = allStarPipes.map(pipe => pipe.pipeMesh);
            const pipeMeshes = [...centralCutPipeMeshes, ...ringPipeMeshes, ...starPipeMeshes];
            
            // Create camera controller
            this.cameraController = new CameraController(
                scene, 
                this.canvas, 
                this.ground.mesh, 
                pipeMeshes
            );
            
            // Now that cameras are set up, apply default panel rotations to ensure they're properly displayed
            this.applyDefaultPanelRotations();
            
            // Create UI controller
            this.uiController = new UIController(this.cameraController);
            
            // Get all SingleCUT models for scene editor organization
            const ringModelSingleCuts = this.ringModel.getAllSingleCuts();
            const starModelSingleCuts = this.starModel.getAllSingleCuts();
            
            // Prepare SingleCUTs for the scene editor
            const ringCentralSingleCutObjects = {};
            const ringLayerOneSingleCutObjects = {};
            const ringLayerTwoSingleCutObjects = {};
            
            // Add Central CUT directly
            ringCentralSingleCutObjects['Central CUT'] = this.centralCutModel;
            
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
                            model: this.centralCutModel,
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
                        'Star Central CUT': {
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
            
            // Add debug function to SceneEditor
            this.sceneEditor.logModelInfo = (model) => {
                // Debug model info before processing
                console.log("logModelInfo called with model:", model);
                console.log("Model constructor:", model?.constructor?.name);
                
                if (!model) {
                    console.log("No model selected");
                    return;
                }
                
                // Use the new logModelDetails method if available
                if (typeof model.logModelDetails === 'function') {
                    console.log("Using model.logModelDetails() method");
                    model.logModelDetails();
                    return;
                }
                
                console.group("Selected Model Info");
                
                // Basic model info
                console.log("Model Type:", model.constructor ? model.constructor.name : "Unknown");
                console.log("BabylonJS ID:", model.rootNode ? model.rootNode.id : "No rootNode");
                console.log("Instance ID:", model.uniqueId || "N/A");
                console.log("Instance #:", model.instanceNumber || "N/A");
                console.log("Creation Time:", model.creationTime || "N/A");
                
                // Position info
                if (model.rootNode) {
                    const position = model.rootNode.getAbsolutePosition();
                    console.log("Position:", {
                        x: position.x.toFixed(2),
                        y: position.y.toFixed(2),
                        z: position.z.toFixed(2)
                    });
                }
                
                // Radius settings
                if (model.options) {
                    console.log("Radius Options:", {
                        radius: model.options.radius,
                        outerRadius: model.options.outerRadius,
                        innerRadius: model.options.innerRadius,
                        singleCutRadius: model.options.singleCutRadius
                    });
                }
                
                // Parent info
                if (model.options && model.options.parent) {
                    const parent = model.options.parent;
                    console.log("Parent Type:", parent.constructor ? parent.constructor.name : "Unknown");
                    console.log("Parent ID:", parent.rootNode ? parent.rootNode.id : "No rootNode");
                    
                    if (parent.options) {
                        console.log("Parent Radius Settings:", {
                            outerRadius: parent.options.outerRadius,
                            innerRadius: parent.options.innerRadius,
                            singleCutRadius: parent.options.singleCutRadius
                        });
                    }
                }
                
                console.groupEnd();
            };
            
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
                toggleButtons.style.bottom = '20px';
                toggleButtons.style.right = '20px';
                toggleButtons.style.display = 'flex';
                toggleButtons.style.flexDirection = 'row';
                toggleButtons.style.gap = '10px';
                toggleButtons.style.zIndex = '100';
                document.body.appendChild(toggleButtons);
            }
            
            // Get all layers from both models for radius and rotation controls
            const layerModels = [
                this.centralCutModel,
                this.ringModel.models.layerOneRing,
                this.ringModel.models.layerTwoRing,
                this.starModel.models.centralCut,
                this.starModel.models.layerOneStar,
                this.starModel.models.layerTwoStar
            ];
            
            // Create radius controls
            const radiusControls = new RadiusControls(
                scene, 
                layerModels,
                {
                    isVisible: false,
                    modelNames: ["Central CUT", "Layer One Ring", "Layer Two Ring", "Star Central CUT", "Layer One Star", "Layer Two Star"]
                }
            );
            
            // Create rotation controls
            const rotationControls = new RotationControls(
                scene, 
                layerModels, 
                {
                    isVisible: false,
                    modelNames: ["Central CUT", "Layer One Ring", "Layer Two Ring", "Star Central CUT", "Layer One Star", "Layer Two Star"]
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
            this.radiusControls = radiusControls;
            this.debugInfoView = debugInfoView;
            
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
                centralCutModel: this.centralCutModel,
                ringModel: this.ringModel,
                starModel: this.starModel,
                layerOneRing: this.ringModel?.models?.layerOneRing,
                layerTwoRing: this.ringModel?.models?.layerTwoRing,
                layerOneStar: this.starModel?.models?.layerOneStar,
                layerTwoStar: this.starModel?.models?.layerTwoStar,
            },
            // Helper functions
            getStats: () => {
                if (window.cheDebug.models.layerTwoRing) {
                    console.log("Getting LayerTwoRing stats:");
                    return window.cheDebug.models.layerTwoRing.getRepositionStats();
                } else {
                    console.error("LayerTwoRing model not accessible");
                    return null;
                }
            },
            repositionLayerTwo: () => {
                if (window.cheDebug.models.layerTwoRing) {
                    console.log("Manually triggering LayerTwoRing repositioning...");
                    window.cheDebug.models.layerTwoRing.updateChildPositions();
                    return "Repositioning complete";
                } else {
                    console.error("LayerTwoRing model not accessible");
                    return null;
                }
            },
            // Force a complete recalculation and update of child positions
            forceUpdatePositions: () => {
                if (window.cheDebug.models.layerTwoRing) {
                    console.log("Forcing complete recalculation of all positions...");
                    const count = window.cheDebug.models.layerTwoRing.forceUpdatePositions();
                    return `Force updated ${count} SingleCUT positions`;
                } else {
                    console.error("LayerTwoRing model not accessible");
                    return null;
                }
            },
            // Guaranteed refresh using radius trick
            guaranteedRefresh: () => {
                if (window.cheDebug.models.layerTwoRing) {
                    console.log("Executing guaranteed refresh method...");
                    return window.cheDebug.models.layerTwoRing.guaranteedRefresh();
                } else {
                    console.error("LayerTwoRing model not accessible");
                    return null;
                }
            },
            // Get a specific child model by index
            getSingleCut: (index) => {
                if (window.cheDebug.models.layerTwoRing && 
                    window.cheDebug.models.layerTwoRing.childModels && 
                    index < window.cheDebug.models.layerTwoRing.childModels.length) {
                    return window.cheDebug.models.layerTwoRing.childModels[index];
                } else {
                    console.error(`SingleCUT model at index ${index} not found`);
                    return null;
                }
            },
            // Helper to explain how to use debug functions
            help: () => {
                console.log(`
CHE Visualization Debug Console Commands:
----------------------------------------
cheDebug.getStats() - Get debugging statistics for LayerTwoRing
cheDebug.repositionLayerTwo() - Manually trigger repositioning
cheDebug.forceUpdatePositions() - Force complete recalculation and update of positions
cheDebug.guaranteedRefresh() - Force a visual refresh using the radius update trick (RECOMMENDED)
cheDebug.getSingleCut(index) - Get a specific SingleCUT model by index (0-11)
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
     * Apply default panel rotations to all models after scene is initialized
     * This ensures panels have the correct default rotations (60°, 0°, 120°)
     */
    applyDefaultPanelRotations() {
        console.log('Applying default panel rotations to all models after scene initialization');
        
        // Function to process a model and its children
        const processModel = (model) => {
            // Apply to this model if it has the method
            if (model && typeof model.applyPanelDefaultRotations === 'function') {
                model.applyPanelDefaultRotations();
            }
            
            // Apply to child models
            if (model && model.childModels && Array.isArray(model.childModels)) {
                model.childModels.forEach(childModel => {
                    processModel(childModel);
                });
            }
        };
        
        // Apply to Central CUT
        if (this.centralCutModel) {
            processModel(this.centralCutModel);
        }
        
        // Apply to Ring Model and all its children
        if (this.ringModel) {
            processModel(this.ringModel);
            
            // Also process each main component directly
            if (this.ringModel.models) {
                if (this.ringModel.models.layerOneRing) processModel(this.ringModel.models.layerOneRing);
                if (this.ringModel.models.layerTwoRing) processModel(this.ringModel.models.layerTwoRing);
            }
        }
        
        // Apply to Star Model and all its children
        if (this.starModel) {
            processModel(this.starModel);
            
            // Also process each main component directly
            if (this.starModel.models) {
                if (this.starModel.models.centralCut) processModel(this.starModel.models.centralCut);
                if (this.starModel.models.layerOneStar) processModel(this.starModel.models.layerOneStar);
                if (this.starModel.models.layerTwoStar) processModel(this.starModel.models.layerTwoStar);
            }
        }
        
        console.log('Default panel rotations successfully applied');
    }
}

// Initialize the application when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CHEVisualization();
}); 