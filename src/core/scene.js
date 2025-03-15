import { Scene, Color3, Color4, Vector3, HemisphericLight, DirectionalLight, ShadowGenerator } from '@babylonjs/core';
import { AxesViewer } from '@babylonjs/core/Debug/axesViewer';

/**
 * Creates and initializes a Babylon.js scene
 * @param {Engine} engine - The Babylon.js engine
 * @returns {Scene} - The initialized scene
 */
export const createScene = (engine) => {
    // Create a new scene
    const scene = new Scene(engine);
    
    // Set scene clear color (sky blue)
    scene.clearColor = new Color4(0.4, 0.6, 0.9, 1.0);
    
    // Enable physics - in Babylon 5.x, we need to use a different approach
    // For simplicity, we'll skip physics for now as it's not critical for the visualization
    
    // Add lights
    const hemisphericLight = new HemisphericLight('hemisphericLight', new Vector3(0, 1, 0), scene);
    hemisphericLight.intensity = 0.7;
    hemisphericLight.diffuse = new Color3(1, 1, 1);
    hemisphericLight.groundColor = new Color3(0.5, 0.5, 0.5);
    
    const directionalLight = new DirectionalLight('directionalLight', new Vector3(0.5, -1, 1), scene);
    directionalLight.intensity = 0.8;
    directionalLight.diffuse = new Color3(1, 1, 0.8);
    
    // Create shadow generator
    const shadowGenerator = new ShadowGenerator(1024, directionalLight);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurKernel = 32;
    
    // Create axes viewer (for debugging)
    const axesViewer = new AxesViewer(scene, 10);
    axesViewer.update(new Vector3(0, 0, 0), new Vector3(1, 0, 0), new Vector3(0, 1, 0), new Vector3(0, 0, 1));
    
    // In Babylon 5.x, we handle axes differently
    if (axesViewer.xAxis && axesViewer.xAxis.parent) {
        axesViewer.xAxis.parent = null;
        axesViewer.yAxis.parent = null;
        axesViewer.zAxis.parent = null;
    }
    
    return {
        scene, 
        shadowGenerator,
        axesViewer
    };
}; 