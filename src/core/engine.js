import { Engine } from '@babylonjs/core/Engines/engine';

/**
 * Initializes the Babylon.js engine
 * @param {HTMLCanvasElement} canvas - The canvas element to render to
 * @returns {Promise<Engine>} - The initialized Babylon.js engine
 */
export const initializeEngine = async (canvas) => {
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
    
    return engine;
}; 