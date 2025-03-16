import { Scene, Color3, Color4, Vector3, HemisphericLight, DirectionalLight } from '@babylonjs/core';
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
    scene.clearColor = new Color4(0.5, 0.75, 0.95, 1.0);
    
    // Add simple ambient light for general illumination
    const hemisphericLight = new HemisphericLight('hemisphericLight', new Vector3(0, 1, 0), scene);
    hemisphericLight.intensity = 0.8;
    hemisphericLight.diffuse = new Color3(1, 1, 1);
    hemisphericLight.groundColor = new Color3(0.5, 0.5, 0.5);
    
    // Simple directional light
    const directionalLight = new DirectionalLight('directionalLight', new Vector3(0.5, -1, 0.5), scene);
    directionalLight.intensity = 0.6;
    directionalLight.diffuse = new Color3(1, 1, 1);
    
    // Create a dummy shadow generator that does nothing
    // This is to maintain compatibility with code that expects a shadowGenerator object
    const shadowGenerator = {
        getShadowMap: () => ({ renderList: [] }),
        addShadowCaster: () => {},
        dispose: () => {}
    };
    
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