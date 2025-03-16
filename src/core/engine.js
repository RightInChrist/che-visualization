import { Engine } from '@babylonjs/core/Engines/engine';

/**
 * Initializes the Babylon.js engine
 * @returns {Promise<Object>} - Object containing the initialized engine and canvas
 */
export const initializeEngine = async () => {
    // Create canvas element if not already in the DOM
    let canvas = document.getElementById('renderCanvas');
    
    if (!canvas) {
        console.log("Creating new canvas element");
        canvas = document.createElement('canvas');
        canvas.id = 'renderCanvas';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.touchAction = 'none';
        canvas.style.outline = 'none';
        document.body.appendChild(canvas);
    }
    
    // Create WebGL engine
    const engine = new Engine(canvas, true, { 
        preserveDrawingBuffer: true,
        stencil: true,
        disableWebGL2Support: false,
        powerPreference: "high-performance"
    });
    console.log("Using WebGL engine");
    
    // Handle window resize
    window.addEventListener('resize', () => {
        engine.resize();
    });
    
    // Check for WebGL context loss
    canvas.addEventListener('webglcontextlost', (event) => {
        console.error('WebGL context lost. Trying to restore...');
        event.preventDefault();
        
        // Try to restore context
        setTimeout(() => {
            engine.engineInstrumentation.isDirty = false;
            engine.engineInstrumentation.lastStartDispatch = engine.timeStep;
            engine.engineInstrumentation.lastDispatch = engine.timeStep;
            engine.engineInstrumentation.lastClear = engine.timeStep;
            
            // Force a full-refresh
            window.location.reload();
        }, 1000);
    });
    
    return { engine, canvas };
}; 