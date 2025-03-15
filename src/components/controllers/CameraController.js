import { 
    ArcRotateCamera, 
    UniversalCamera,
    Vector3,
    Quaternion,
    KeyboardEventTypes,
    Ray,
    Color3,
    MeshBuilder,
    StandardMaterial
} from '@babylonjs/core';

// Camera modes
export const CAMERA_MODES = {
    ORBIT: 'Orbit',
    FIRST_PERSON: 'First Person',
    FLIGHT: 'Flight'
};

/**
 * Controller for managing different camera modes
 */
export class CameraController {
    constructor(scene, canvas, ground, pipes) {
        this.scene = scene;
        this.canvas = canvas;
        this.ground = ground;
        this.pipes = pipes;
        this.currentMode = CAMERA_MODES.ORBIT;
        this.currentCamera = null;
        this.cameraMoveSpeed = 1.0;
        this.cameraRotationSpeed = 0.005;
        this.minHeightAboveGround = 2;
        this.collisionDistance = 4;
        this.transitionDuration = 1000; // ms
        this.isTransitioning = false;
        this.keys = { w: false, a: false, s: false, d: false, space: false, shift: false };
        this.maxPipeHeight = 1000; // height of pipes in meters
        
        // Debug settings
        this.showCollisionRays = false;
        this.useDebugUI = false; // Whether to use the old debug UI
        
        // Setup cameras
        this.setupCameras();
        
        // Set active camera
        this.setActiveCamera(this.currentMode);
        
        // Setup controls
        this.setupControls();
        
        // Debug settings
        this.collisionRayHelpers = [];
    }
    
    /**
     * Set up all camera types
     */
    setupCameras() {
        // Create orbit camera
        this.orbitCamera = new ArcRotateCamera('orbitCamera', -Math.PI / 2, Math.PI / 3, 500, new Vector3(0, 0, 0), this.scene);
        this.orbitCamera.lowerRadiusLimit = 10;
        this.orbitCamera.upperRadiusLimit = 2000;
        this.orbitCamera.wheelDeltaPercentage = 0.01;
        this.orbitCamera.panningSensibility = 50;
        this.orbitCamera.checkCollisions = true;
        
        // Create first person camera
        this.firstPersonCamera = new UniversalCamera('firstPersonCamera', new Vector3(0, this.minHeightAboveGround, -50), this.scene);
        this.firstPersonCamera.fov = 1.2;
        this.firstPersonCamera.minZ = 0.1;
        this.firstPersonCamera.checkCollisions = true;
        this.firstPersonCamera.ellipsoid = new Vector3(2, 2, 2);
        this.firstPersonCamera.applyGravity = true;
        this.firstPersonCamera.keysUp = []; // We'll handle movement manually
        this.firstPersonCamera.keysDown = [];
        this.firstPersonCamera.keysLeft = [];
        this.firstPersonCamera.keysRight = [];
        
        // Create flight camera (similar to first person but with different movement)
        this.flightCamera = new UniversalCamera('flightCamera', new Vector3(0, 100, -100), this.scene);
        this.flightCamera.fov = 1.2;
        this.flightCamera.minZ = 0.1;
        this.flightCamera.checkCollisions = true;
        this.flightCamera.ellipsoid = new Vector3(2, 2, 2);
        this.flightCamera.applyGravity = false;
        this.flightCamera.keysUp = [];
        this.flightCamera.keysDown = [];
        this.flightCamera.keysLeft = [];
        this.flightCamera.keysRight = [];
    }
    
    /**
     * Set up keyboard and mouse controls
     */
    setupControls() {
        // Handle keyboard input
        this.scene.onKeyboardObservable.add((kbInfo) => {
            const event = kbInfo.event;
            
            if (kbInfo.type === KeyboardEventTypes.KEYDOWN) {
                switch (event.code) {
                    case 'KeyW':
                        this.keys.w = true;
                        break;
                    case 'KeyA':
                        this.keys.a = true;
                        break;
                    case 'KeyS':
                        this.keys.s = true;
                        break;
                    case 'KeyD':
                        this.keys.d = true;
                        break;
                    case 'Space':
                        this.keys.space = true;
                        break;
                    case 'ShiftLeft':
                    case 'ShiftRight':
                        this.keys.shift = true;
                        break;
                    case 'KeyM':
                        // Toggle camera mode
                        this.toggleCameraMode();
                        break;
                    case 'KeyH':
                        // Toggle help overlay
                        document.body.classList.toggle('show-controls');
                        break;
                }
            } else if (kbInfo.type === KeyboardEventTypes.KEYUP) {
                switch (event.code) {
                    case 'KeyW':
                        this.keys.w = false;
                        break;
                    case 'KeyA':
                        this.keys.a = false;
                        break;
                    case 'KeyS':
                        this.keys.s = false;
                        break;
                    case 'KeyD':
                        this.keys.d = false;
                        break;
                    case 'Space':
                        this.keys.space = false;
                        break;
                    case 'ShiftLeft':
                    case 'ShiftRight':
                        this.keys.shift = false;
                        break;
                }
            }
        });
        
        // Set up pointer lock for first person and flight modes
        this.canvas.addEventListener('click', () => {
            if (this.currentMode === CAMERA_MODES.FIRST_PERSON || this.currentMode === CAMERA_MODES.FLIGHT) {
                this.canvas.requestPointerLock = 
                    this.canvas.requestPointerLock || 
                    this.canvas.msRequestPointerLock || 
                    this.canvas.mozRequestPointerLock || 
                    this.canvas.webkitRequestPointerLock;
                
                if (this.canvas.requestPointerLock) {
                    this.canvas.requestPointerLock();
                }
            }
        });
        
        // Update the UI with camera info only if useDebugUI is true
        if (this.useDebugUI) {
            this.scene.registerBeforeRender(() => this.updateCameraInfo());
        }
        
        // Register rendering loop to handle camera movement
        this.scene.registerBeforeRender(() => this.updateCameraMovement());
    }
    
    /**
     * Updates the UI with the current camera position and other info
     * This method is now optional and only runs if the old debug elements exist
     */
    updateCameraInfo() {
        // Skip if required elements don't exist
        if (!document.getElementById('positionText')) {
            // Old debug panel has been removed, no need to update
            return;
        }
        
        const camera = this.currentCamera;
        const position = camera.position;
        
        // Update position text
        const positionText = document.getElementById('positionText');
        if (positionText) {
            positionText.textContent = `${position.x.toFixed(1)}, ${position.y.toFixed(1)}, ${position.z.toFixed(1)}`;
        }
        
        // Update height text
        const height = position.y;
        const heightText = document.getElementById('heightText');
        if (heightText) {
            heightText.textContent = `${height.toFixed(1)}m`;
        }
        
        // Update height percentage text
        const heightPercent = (height / this.maxPipeHeight) * 100;
        const heightPercentText = document.getElementById('heightPercentText');
        if (heightPercentText) {
            heightPercentText.textContent = `${heightPercent.toFixed(1)}%`;
        }
        
        // Update camera mode text
        const cameraModeText = document.getElementById('cameraModeText');
        if (cameraModeText) {
            cameraModeText.textContent = this.currentMode;
        }
    }
    
    /**
     * Handles camera movement based on input
     */
    updateCameraMovement() {
        if (this.isTransitioning) return;
        
        if (this.currentMode === CAMERA_MODES.FIRST_PERSON || this.currentMode === CAMERA_MODES.FLIGHT) {
            const camera = this.currentCamera;
            
            // Get camera forward, right, and up directions
            const forward = camera.getDirection(Vector3.Forward());
            const right = camera.getDirection(Vector3.Right());
            const up = Vector3.Up();
            
            // Calculate movement vector
            const movement = new Vector3(0, 0, 0);
            
            // Forward/backward
            if (this.keys.w) {
                movement.addInPlace(forward.scale(this.cameraMoveSpeed));
            }
            if (this.keys.s) {
                movement.addInPlace(forward.scale(-this.cameraMoveSpeed));
            }
            
            // Left/right
            if (this.keys.a) {
                movement.addInPlace(right.scale(-this.cameraMoveSpeed));
            }
            if (this.keys.d) {
                movement.addInPlace(right.scale(this.cameraMoveSpeed));
            }
            
            // Up/down (flight mode only)
            if (this.currentMode === CAMERA_MODES.FLIGHT) {
                if (this.keys.space) {
                    movement.addInPlace(up.scale(this.cameraMoveSpeed));
                }
                if (this.keys.shift) {
                    movement.addInPlace(up.scale(-this.cameraMoveSpeed));
                }
            }
            
            // Apply collision detection
            const newPosition = camera.position.add(movement);
            
            // Check for collisions
            if (!this.checkCollisions(camera.position, newPosition)) {
                camera.position = newPosition;
            }
            
            // Ensure minimum height above ground
            const groundHeight = this.ground.position.y;
            if (camera.position.y < groundHeight + this.minHeightAboveGround) {
                camera.position.y = groundHeight + this.minHeightAboveGround;
            }
        }
    }
    
    /**
     * Check for collisions with objects
     * @param {Vector3} fromPosition - Starting position
     * @param {Vector3} toPosition - Ending position
     * @returns {boolean} - True if collision detected
     */
    checkCollisions(fromPosition, toPosition) {
        // Create direction vector
        const direction = toPosition.subtract(fromPosition).normalize();
        
        // Check for collisions with meshes
        const ray = new Ray(fromPosition, direction, this.collisionDistance);
        const hit = this.scene.pickWithRay(ray);
        
        // Visualize collision rays if debug mode is enabled
        if (this.showCollisionRays) {
            // Clean up old rays
            this.collisionRayHelpers.forEach(helper => helper.dispose());
            this.collisionRayHelpers = [];
            
            // Create new ray visualization
            const rayHelper = new MeshBuilder.CreateLines('rayHelper', {
                points: [fromPosition, fromPosition.add(direction.scale(this.collisionDistance))],
                updatable: false
            }, this.scene);
            
            const material = new StandardMaterial('rayMaterial', this.scene);
            material.emissiveColor = hit.hit ? Color3.Red() : Color3.Green();
            rayHelper.material = material;
            
            this.collisionRayHelpers.push(rayHelper);
        }
        
        return hit.hit;
    }
    
    /**
     * Sets the active camera based on mode
     * @param {string} mode - The camera mode to set
     */
    setActiveCamera(mode) {
        let camera;
        
        switch (mode) {
            case CAMERA_MODES.ORBIT:
                camera = this.orbitCamera;
                break;
            case CAMERA_MODES.FIRST_PERSON:
                camera = this.firstPersonCamera;
                break;
            case CAMERA_MODES.FLIGHT:
                camera = this.flightCamera;
                break;
            default:
                camera = this.orbitCamera;
                break;
        }
        
        this.currentCamera = camera;
        this.scene.activeCamera = camera;
        camera.attachControl(this.canvas, true);
    }
    
    /**
     * Toggles between camera modes
     */
    toggleCameraMode() {
        // Don't toggle if we're already transitioning
        if (this.isTransitioning) return;
        
        // Determine new mode
        let newMode;
        switch (this.currentMode) {
            case CAMERA_MODES.ORBIT:
                newMode = CAMERA_MODES.FIRST_PERSON;
                break;
            case CAMERA_MODES.FIRST_PERSON:
                newMode = CAMERA_MODES.FLIGHT;
                break;
            case CAMERA_MODES.FLIGHT:
                newMode = CAMERA_MODES.ORBIT;
                break;
            default:
                newMode = CAMERA_MODES.ORBIT;
                break;
        }
        
        // Set up transition
        this.transitionToMode(newMode);
    }
    
    /**
     * Transition smoothly to a new camera mode
     * @param {string} newMode - The mode to transition to
     */
    transitionToMode(newMode) {
        this.isTransitioning = true;
        const oldCamera = this.currentCamera;
        
        // Detach current camera control
        oldCamera.detachControl(this.canvas);
        
        // Set up destination camera
        let destCamera;
        
        switch (newMode) {
            case CAMERA_MODES.ORBIT:
                destCamera = this.orbitCamera;
                // Position orbit camera to look at the scene
                this.orbitCamera.setTarget(new Vector3(0, 0, 0));
                break;
            case CAMERA_MODES.FIRST_PERSON:
                destCamera = this.firstPersonCamera;
                // Position first person camera based on where the user was looking
                if (this.currentMode === CAMERA_MODES.ORBIT) {
                    const direction = this.orbitCamera.target.subtract(this.orbitCamera.position).normalize();
                    const position = this.orbitCamera.position.add(direction.scale(50));
                    position.y = Math.max(position.y, this.ground.position.y + this.minHeightAboveGround);
                    
                    this.firstPersonCamera.position = position;
                    this.firstPersonCamera.setTarget(position.add(direction));
                }
                break;
            case CAMERA_MODES.FLIGHT:
                destCamera = this.flightCamera;
                // Position flight camera at current position but higher
                if (this.currentMode === CAMERA_MODES.FIRST_PERSON) {
                    const direction = this.firstPersonCamera.getDirection(Vector3.Forward());
                    const position = this.firstPersonCamera.position.clone();
                    position.y += 50; // Start higher in flight mode
                    
                    this.flightCamera.position = position;
                    this.flightCamera.setTarget(position.add(direction));
                }
                break;
        }
        
        // Perform transition animation
        let startTime = performance.now();
        const startPos = oldCamera.position.clone();
        const startRot = oldCamera.rotationQuaternion ? oldCamera.rotationQuaternion.clone() : Quaternion.RotationYawPitchRoll(oldCamera.rotation.y, oldCamera.rotation.x, oldCamera.rotation.z);
        const destPos = destCamera.position.clone();
        const destRot = destCamera.rotationQuaternion ? destCamera.rotationQuaternion.clone() : Quaternion.RotationYawPitchRoll(destCamera.rotation.y, destCamera.rotation.x, destCamera.rotation.z);
        
        // Use a temporary camera for transition
        const transitionCamera = oldCamera.clone("transitionCamera");
        transitionCamera.position = startPos;
        transitionCamera.rotationQuaternion = startRot;
        this.scene.activeCamera = transitionCamera;
        
        const animateTransition = () => {
            const currentTime = performance.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.transitionDuration, 1);
            
            // Smooth easing function
            const ease = t => t<.5 ? 2*t*t : -1+(4-2*t)*t;
            const easedProgress = ease(progress);
            
            // Interpolate position and rotation
            const newPos = Vector3.Lerp(startPos, destPos, easedProgress);
            const newRot = Quaternion.Slerp(startRot, destRot, easedProgress);
            
            transitionCamera.position = newPos;
            transitionCamera.rotationQuaternion = newRot;
            
            if (progress < 1) {
                requestAnimationFrame(animateTransition);
            } else {
                // Transition complete
                this.currentMode = newMode;
                this.setActiveCamera(newMode);
                this.isTransitioning = false;
                transitionCamera.dispose();
            }
        };
        
        animateTransition();
    }
} 