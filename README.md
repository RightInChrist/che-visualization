# Convective Heat Engine Visualization

A 3D visualization of a Convective Heat Engine (CHE) featuring 1000-meter-tall pipes and panels arranged in hexagonal patterns.

## Features

- 3D visualization of CHE components with proper scale and measurements
- Height markers every 100m with special markers at 500m increments
- Three camera modes:
  - Orbit mode: For exploring from a distance
  - First-person mode: WASD + mouse look with collision detection
  - Flight mode: Similar to first-person but with vertical movement
- Debug overlays showing position and height information
- Optimized for performance with level-of-detail (LOD) system
- Smooth transitions between camera modes
- Compatible with static site deployment

## Technologies Used

- [Babylon.js](https://www.babylonjs.com/) - 3D rendering engine
- [Vite](https://vitejs.dev/) - Build tool and development server

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/che-visualization.git
   cd che-visualization
   ```

2. Install dependencies:
   ```
   npm install
   ```

### Development

Run the development server:
```
npm run dev
```

This will start a local development server at http://localhost:5173 (or another port if 5173 is in use).

### Building for Production

Build the project for production:
```
npm run build
```

This will create a `dist` directory with optimized files ready for deployment.

### Preview Production Build

To preview the production build locally:
```
npm run preview
```

## Usage

### Camera Controls

- **Orbit Mode**:
  - Left-click drag: Rotate camera
  - Right-click drag: Pan camera
  - Scroll wheel: Zoom in/out

- **First-Person Mode**:
  - W/A/S/D: Move forward/left/backward/right
  - Mouse: Look around

- **Flight Mode**:
  - W/A/S/D: Move forward/left/backward/right
  - Space: Move up
  - Shift: Move down
  - Mouse: Look around

### Keyboard Shortcuts

- **M**: Toggle between camera modes
- **H**: Toggle help overlay
- **Esc**: Exit pointer lock (in first-person or flight mode)

## Deployment

This application can be deployed to any static site hosting service:

1. Build the project: `npm run build`
2. Upload the contents of the `dist` directory to your hosting provider

Popular static hosting options include:
- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting
- AWS S3 + CloudFront

## Browser Compatibility

The application works best in modern browsers with good WebGL support:
- Chrome (recommended)
- Firefox
- Edge
- Safari

For older browsers, a WebGL compatibility check is included with helpful error messages.

## License

[MIT](LICENSE)

## Acknowledgments

- Babylon.js Team for the excellent 3D engine
- Vite Team for the fast build tool 