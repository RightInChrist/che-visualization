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
    constructor(scene, canvas, options = {}) {
        this.scene = scene;
        this.canvas = canvas;
        
        // Initialize from options
        this.options = {
            initialPosition: new Vector3(0, 100, 200),
            zoomScaling: 5,
            minDistance: 20,
            maxDistance: 500,
            ...options
        };
        
        this.currentMode = CAMERA_MODES.ORBIT;
        this.currentCamera = null;
        this.cameraMoveSpeed = 1.0;
        this.cameraRotationSpeed = 0.005;
        this.minHeightAboveGround = 2;
        this.collisionDistance = 4;
        this.transitionDuration = 1000; // ms
        this.isTransitioning = false;
        this.keys = { w: false, a: false, s: false, d: false, space: false, shift: false };
        this.maxPipeHeight = 1500; // height of pipes in meters
        
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
        this.orbitCamera = new ArcRotateCamera(
            'orbitCamera', 
            -Math.PI / 2, 
            Math.PI / 3, 
            this.options.maxDistance / 2, 
            new Vector3(0, 0, 0), 
            this.scene
        );
        
        this.orbitCamera.lowerRadiusLimit = this.options.minDistance || 10;
        this.orbitCamera.upperRadiusLimit = this.options.maxDistance || 2000;
        this.orbitCamera.wheelDeltaPercentage = this.options.zoomScaling ? this.options.zoomScaling / 500 : 0.01;
        this.orbitCamera.panningSensibility = 50;
        this.orbitCamera.checkCollisions = false; // Turn off automatic collision
        
        // Create first person camera
        this.firstPersonCamera = new UniversalCamera(
            'firstPersonCamera', 
            this.options.initialPosition || new Vector3(0, this.minHeightAboveGround, -50), 
            this.scene
        );
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
     * Update camera movement for first person and flight modes
     */
    updateCameraMovement() {
        // Return if not in a movement-enabled camera mode
        if (this.currentMode === CAMERA_MODES.ORBIT || !this.currentCamera) {
            return;
        }
        
        // Get camera position
            const camera = this.currentCamera;
        const currentPosition = camera.position.clone();
        
        // Movement direction
        let direction = Vector3.Zero();
        
        // Forward/backward movement in camera direction
            if (this.keys.w) {
            const forward = this.currentCamera.getDirection(Vector3.Forward());
            direction.addInPlace(forward);
            }
            if (this.keys.s) {
            const backward = this.currentCamera.getDirection(Vector3.Backward());
            direction.addInPlace(backward);
            }
            
        // Left/right movement perpendicular to camera direction
            if (this.keys.a) {
            const left = this.currentCamera.getDirection(Vector3.Left());
            direction.addInPlace(left);
            }
            if (this.keys.d) {
            const right = this.currentCamera.getDirection(Vector3.Right());
            direction.addInPlace(right);
            }
            
        // Up/down movement
                if (this.keys.space) {
            direction.addInPlace(Vector3.Up());
                }
                if (this.keys.shift) {
            direction.addInPlace(Vector3.Down());
        }
        
        // Only move if there's a direction
        if (direction.length() > 0) {
            // Normalize and scale movement
            direction.normalize();
            direction.scaleInPlace(this.cameraMoveSpeed);
            
            // Calculate next position
            const nextPosition = currentPosition.add(direction);
            
            // Ensure we don't go below the ground
            if (nextPosition.y < this.minHeightAboveGround) {
                nextPosition.y = this.minHeightAboveGround;
            }
            
            // Check for collisions if collision objects exist
            const hasCollision = this.options.pipes && this.options.pipes.length > 0 ? 
                this.checkCollisions(currentPosition, nextPosition) : false;
            
            // Move camera if no collision
            if (!hasCollision) {
                camera.position = nextPosition;
            }
        }
    }
    
    /**
     * Check for collisions between camera and objects
     * @param {Vector3} fromPosition - Start position for ray
     * @param {Vector3} toPosition - End position for ray
     * @returns {boolean} - Whether a collision was detected
     */
    checkCollisions(fromPosition, toPosition) {
        // Skip collision check if no pipes are defined
        if (!this.options.pipes || this.options.pipes.length === 0) {
            return false;
        }
        
        // Get direction and distance
        const direction = toPosition.subtract(fromPosition);
        const distance = direction.length();
        const ray = new Ray(fromPosition, direction.normalize(), distance);
        
        // Store whether a collision was found
        let hasCollision = false;
        
        // Check for collisions with pipes
        const hits = this.options.pipes.some(mesh => {
            if (!mesh || !mesh.isEnabled() || !mesh.isPickable) return false;
            
            // Check for intersection
            const hit = ray.intersectsMesh(mesh);
            return hit.hit;
        });
        
        // Visualize rays for debugging
        if (this.showCollisionRays) {
            this.visualizeCollisionRay(ray, hits);
        }
        
        return hits;
    }
    
    /**
     * Visualize a collision ray for debugging
     * @param {Ray} ray - The ray to visualize
     * @param {boolean} hit - Whether the ray hit something
     */
    visualizeCollisionRay(ray, hit) {
            // Clean up old rays
            this.collisionRayHelpers.forEach(helper => helper.dispose());
            this.collisionRayHelpers = [];
            
            // Create new ray visualization
            const rayHelper = new MeshBuilder.CreateLines('rayHelper', {
            points: [
                ray.origin, 
                ray.origin.add(ray.direction.scale(ray.length))
            ],
                updatable: false
            }, this.scene);
            
            const material = new StandardMaterial('rayMaterial', this.scene);
        material.emissiveColor = hit ? Color3.Red() : Color3.Green();
            rayHelper.material = material;
            
            this.collisionRayHelpers.push(rayHelper);
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
    
    /**
     * Gets the name of the current camera mode
     * @returns {string} The name of the current camera mode
     */
    getCurrentCameraName() {
        return this.currentMode;
    }
} 