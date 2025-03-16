import { Scene, Color3, Color4, Vector3, HemisphericLight, DirectionalLight, ShadowGenerator, CascadedShadowGenerator, PointLight, SpotLight } from '@babylonjs/core';
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
    
    // Add ambient light for general illumination
    const hemisphericLight = new HemisphericLight('hemisphericLight', new Vector3(0, 1, 0), scene);
    hemisphericLight.intensity = 0.7; // Increased for better ambient lighting
    hemisphericLight.diffuse = new Color3(1, 1, 1);
    hemisphericLight.groundColor = new Color3(0.3, 0.3, 0.4); // Cooler ground reflection
    hemisphericLight.specular = new Color3(0.2, 0.2, 0.2); // Lower specular intensity
    
    // Main directional light (sun)
    const directionalLight = new DirectionalLight('directionalLight', new Vector3(0.3, -0.8, 0.5), scene);
    directionalLight.intensity = 0.6; // Reduced for softer shadows
    directionalLight.diffuse = new Color3(1, 0.97, 0.9); // Slightly warmer sunlight color
    directionalLight.specular = new Color3(0.9, 0.9, 0.9); // Bright specular highlights
    
    // Add a supplementary spotlight to create visual interest
    const spotLight = new SpotLight('spotLight', new Vector3(100, 100, -200), new Vector3(-0.5, -0.5, 1), Math.PI/4, 8, scene);
    spotLight.intensity = 0.3;
    spotLight.diffuse = new Color3(0.9, 0.95, 1); // Slightly blue-tinted fill light
    spotLight.specular = new Color3(0.8, 0.8, 1);
    
    // Create enhanced shadow generator
    // For better quality shadows, use CascadedShadowGenerator instead of standard ShadowGenerator
    const shadowGenerator = new CascadedShadowGenerator(2048, directionalLight);
    shadowGenerator.usePercentageCloserFiltering = true; // Enables PCF which gives softer shadow edges
    shadowGenerator.filteringQuality = ShadowGenerator.QUALITY_HIGH;
    shadowGenerator.numCascades = 4; // More cascades for better shadow detail at different distances
    shadowGenerator.lambda = 0.8; // Controls the split between cascades
    shadowGenerator.cascadeBlendPercentage = 0.2; // Smooth transition between cascades
    shadowGenerator.depthClamp = true; // Improve shadow quality
    shadowGenerator.shadowMaxZ = 5000; // Extended shadow range
    shadowGenerator.darkness = 0.6; // Make shadows less dark (0-1 scale, lower is lighter)
    shadowGenerator.transparencyShadow = true; // Better handling of transparent objects
    
    // Adjust bias to fix shadow acne and peter panning
    shadowGenerator.bias = 0.0001; // Helps prevent shadow acne
    shadowGenerator.normalBias = 0.02; // Helps prevent peter panning effect
    
    // Set better defaults for the scene
    scene.ambientColor = new Color3(0.1, 0.1, 0.15); // Subtle ambient color
    scene.clearColor = new Color4(0.5, 0.75, 0.95, 1.0); // Lighter sky blue
    
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