# 3D Convective Heat Engine Visualization Project Prompt

## Project Overview
I need to create a 3D visualization of a Convective Heat Engine (CHE) that includes 1000-meter-tall pipes and panels arranged in hexagonal patterns. The visualization should run smoothly in a static site environment while providing intuitive camera controls for exploring the 3D space.

## Current Implementation Issues
Our current implementation uses Three.js with React Three Fiber in a Next.js project, but we've encountered several issues:
- Difficulty with proper camera controls
- WebGL context loss when rendering complex overlays
- Challenges with positioning and scaling 1000m tall structures
- Static site deployment compatibility issues
- Camera disconnection from ground when flying at various elevations

## Requirements

### Core Visualization Features
- Render a set of 1000-meter tall pipes and panels arranged in a hexagonal pattern
- Include clear height markers every 100m with special markers at 500m increments
- Ensure models correctly position from ground-up (not center-origin)
- Provide visual references for scale and orientation
- Maintain the "Single CUT" model architecture from our existing codebase

### Camera & Controls
- Implement three camera modes:
  1. Orbit mode: Traditional orbit controls for exploring from a distance
  2. First-person mode: WASD + mouse look with proper collision detection
  3. Flight mode: Similar to first-person but with vertical movement using space/shift
- Maintain a minimum height above ground
- A ground model should appear to stay connected to the bottom of the pipe and panel models.
- Smooth camera transitions between modes

### UI & Debugging
- Display camera position information
- Show height as both absolute (meters) and relative (percentage of pipe height)
- Implement toggleable debug overlays showing key information
- Include on-screen controls help

### Static Site Requirements
- Must be deployable as a static site (no server-side dependencies)
- Efficient asset loading and code splitting
- Fast initial load with progressive enhancement
- Fallback for browsers without WebGL support

## Recommended Technology Stack

Please implement this project using:

1. **Game Engine**:
   - Babylon.js (recommended for its powerful camera system and static site compatibility)

2. **Build System**:
   - Use Vite or Parcel for fast builds and minimal configuration
   - Implement code splitting for efficient loading

3. **Project Structure**:
   ```
   src/
   ├── assets/           # Static assets, textures, etc.
   ├── components/
   │   ├── ui/           # 2D interface components
   │   ├── models/       # 3D model definitions
   │   │   ├── PipeModel.js
   │   │   ├── PanelModel.js
   │   │   └── SingleCutModel.js
   │   └── controllers/  # Camera and interaction controllers
   ├── core/             # Core engine setup
   │   ├── engine.js     # Game engine initialization
   │   ├── scene.js      # Scene management
   │   └── loader.js     # Asset loading
   ├── store/            # State management
   │   └── modelStore.js # Model instances
   ├── utils/            # Helper functions
   └── main.js           # Application entry point
   ```

## Implementation Guidelines

### Model Structure
- Define primitive models (pipes, panels, ground) with consistent parameter interfaces
- Implement a composite model system for assembling complex structures
- Use instancing for performance with multiple similar objects

### Camera System
- Implement a unified camera controller that can switch between modes
- Ensure first-person mode uses proper mouse-look controls with pointer lock
- Add collision detection to prevent going through models
- Calculate height from ground and adjust camera target accordingly

### Rendering Optimizations
- Use level-of-detail (LOD) for distant objects
- Implement frustum culling for objects outside the view
- Consider using instanced rendering for similar objects
- Separate DOM-based UI from WebGL rendering

### Debug Features
- Create a toggleable overlay showing camera position and height
- Add visual indicators for height on models (rings/markers at regular intervals)
- Implement performance monitoring options

## Code Examples

Here are some specific approaches I'd like to see implemented:

### Height Marker Example
```javascript
// Add height markers to cylindrical objects
function addHeightMarkers(model, height, radius) {
  const markers = [];
  const markerCount = Math.floor(height / 100) + 1;
  
  for (let i = 0; i < markerCount; i++) {
    const y = i * 100;
    const isMainMarker = i % 5 === 0;
    
    const marker = createRing(
      radius + 0.1,
      isMainMarker ? 0.2 : 0.1,
      isMainMarker ? "red" : "yellow"
    );
    
    marker.position.y = y;
    markers.push(marker);
  }
  
  return markers;
}
```

### Camera Height Adjustment
```javascript
// Adjust camera target based on height
function updateCameraTarget(camera, ground, targetObject) {
  const heightFromGround = camera.position.y - ground.position.y;
  
  // Different target heights based on camera elevation
  let targetHeight;
  if (heightFromGround < 50) {
    targetHeight = ground.position.y;
  } else if (heightFromGround < 200) {
    targetHeight = ground.position.y + heightFromGround * 0.1;
  } else {
    targetHeight = ground.position.y + heightFromGround * 0.2;
  }
  
  // Update target position
  targetObject.position.y = targetHeight;
}
```

## Delivery Expected
- A fully functional static site implementation with the described features
- Documented code with clear comments
- A README explaining how to build and deploy the project
- Performance optimizations for low-end devices
- Mobile touch support (as a bonus)

The success criteria will be a smooth, intuitive 3D visualization that allows users to explore the Convective Heat Engine model with clear height reference points, responsive controls, and compatibility with static site deployment. 