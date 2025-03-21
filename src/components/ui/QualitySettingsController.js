import { SceneOptimizer, SceneOptimizerOptions } from '@babylonjs/core';

/**
 * Controller for adjusting quality settings based on device capabilities
 * or user preferences
 */
export class QualitySettingsController {
    constructor(scene, engine) {
        this.scene = scene;
        this.engine = engine;
        this.currentQuality = 'auto';
        
        // Define quality levels
        this.qualityLevels = {
            low: {
                hardwareScalingLevel: 2.0,  // 50% resolution
                particlesEnabled: false,
                shadowsEnabled: false,
                postProcessesEnabled: false,
                tessellation: 8,
                antialias: false
            },
            medium: {
                hardwareScalingLevel: 1.5,  // 67% resolution
                particlesEnabled: true,
                shadowsEnabled: false,
                postProcessesEnabled: true,
                tessellation: 12,
                antialias: false
            },
            high: {
                hardwareScalingLevel: 1.0,  // 100% resolution
                particlesEnabled: true,
                shadowsEnabled: true,
                postProcessesEnabled: true,
                tessellation: 24,
                antialias: true
            }
        };
        
        // Auto-detect quality on initialization
        this.detectAndSetQuality();
    }
    
    /**
     * Detect appropriate quality level based on device capabilities
     */
    detectAndSetQuality() {
        // Default to medium quality
        let detectedQuality = 'medium';
        
        // Get capability info
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const hasLowMemory = navigator.deviceMemory !== undefined && navigator.deviceMemory < 4;
        const isOlderHardware = window.navigator.hardwareConcurrency !== undefined && 
                             window.navigator.hardwareConcurrency < 4;
        const caps = this.engine.getCaps();
        const maxTextureSize = caps.maxTextureSize || 0;
        
        // Determine quality based on hardware
        if (isMobile || hasLowMemory || isOlderHardware || maxTextureSize < 4096) {
            detectedQuality = 'low';
        } else if (maxTextureSize >= 8192 && !isMobile && !hasLowMemory && !isOlderHardware) {
            detectedQuality = 'high';
        }
        
        console.log(`Auto-detected quality level: ${detectedQuality}`);
        
        // Set the detected quality level
        this.setQuality(detectedQuality);
    }
    
    /**
     * Set a specific quality level
     * @param {string} level - Quality level ('low', 'medium', 'high', or 'auto')
     */
    setQuality(level) {
        if (level === 'auto') {
            this.detectAndSetQuality();
            return;
        }
        
        if (!this.qualityLevels[level]) {
            console.error(`Unknown quality level: ${level}`);
            return;
        }
        
        const settings = this.qualityLevels[level];
        this.currentQuality = level;
        
        console.log(`Setting quality to ${level}`, settings);
        
        // Apply the quality settings
        this.engine.setHardwareScalingLevel(settings.hardwareScalingLevel);
        
        // Scene settings
        this.scene.particlesEnabled = settings.particlesEnabled;
        this.scene.shadowsEnabled = settings.shadowsEnabled;
        this.scene.postProcessesEnabled = settings.postProcessesEnabled;
        
        // Note: tessellation changes would require recreating meshes
        // This setting would be used when creating new meshes
        
        // Optimize scene based on quality
        this.optimizeScene(level);
        
        return level;
    }
    
    /**
     * Optimize scene based on quality level
     * @param {string} level - Quality level
     */
    optimizeScene(level) {
        // Get target framerate based on quality
        const targetFPS = {
            low: 30,
            medium: 45,
            high: 60
        }[level] || 30;
        
        // Create optimizer options
        const options = new SceneOptimizerOptions(targetFPS);
        
        // Clear default optimizations and configure our own
        options.optimizations.length = 0;
        
        if (level === 'low') {
            // Add more aggressive optimizations for low quality
            options.hardwareScalingLevel = 2.0;
            options.trackerDuration = 1000; // Check every second
        }
        
        // Apply the optimizer
        if (this.scene.optimizer) {
            this.scene.optimizer.dispose();
        }
        this.scene.optimizer = new SceneOptimizer(this.scene, options);
    }
    
    /**
     * Get current quality level
     * @returns {string} Current quality level
     */
    getQualityLevel() {
        return this.currentQuality;
    }
} 