/**
 * Helper class for recursively collecting model configuration values
 * from a model hierarchy.
 */
export class ModelConfigHelper {
    /**
     * Get configuration for a model and its children recursively
     * @param {Object} model - The model to get configuration for
     * @returns {Object} - Model configuration including children
     */
    static getModelConfig(model) {
        if (!model) return null;
        
        // Check if this is a model with simple Y-axis rotation (like LayerOneModel)
        const isSimpleRotationModel = (
            typeof model.updateRotation === 'function' &&
            typeof model.getDefaultRotation === 'function' &&
            typeof model.getMinRotation === 'function' &&
            typeof model.getMaxRotation === 'function'
        );
        
        // Check if this is a SingleCutModel
        const isSingleCutModel = model.constructor && model.constructor.name === 'SingleCutModel';
        
        // Base configuration for the model
        const config = {
            name: model.constructor ? model.constructor.name : 'Unknown Model',
            model: model,
            radius: {
                default: this.getDefaultValue(model, 'getDefaultRadius', 42),
                min: this.getDefaultValue(model, 'getMinRadius', 10),
                max: this.getDefaultValue(model, 'getMaxRadius', 100)
            },
            singleCutRadius: {
                default: this.getDefaultValue(model, 'getDefaultSingleCutRadius', 21),
                min: this.getDefaultValue(model, 'getMinSingleCutRadius', 10),
                max: this.getDefaultValue(model, 'getMaxSingleCutRadius', 30)
            },
            rotation: {
                // For models with simple rotation (like LayerOneModel), only populate Y rotation
                y: isSimpleRotationModel || isSingleCutModel ? {
                    default: this.getDefaultValue(model, 'getDefaultRotation', 0),
                    min: this.getDefaultValue(model, 'getMinRotation', 0),
                    max: this.getDefaultValue(model, 'getMaxRotation', 360)
                } : undefined,
                
                // For backward compatibility, also store as rotation.default
                default: this.getDefaultValue(model, 'getDefaultRotation', 0),
                min: this.getDefaultValue(model, 'getMinRotation', 0),
                max: this.getDefaultValue(model, 'getMaxRotation', 360)
            },
            children: []
        };
        
        // Get children if available
        if (typeof model.getChildren === 'function') {
            const children = model.getChildren();
            
            if (children && Array.isArray(children) && children.length > 0) {
                // For each child, add its configuration
                children.forEach(childModel => {
                    const childConfig = this.getModelConfig(childModel);
                    if (childConfig) {
                        config.children.push(childConfig);
                    }
                });
            }
        } else if (model.childModels && Array.isArray(model.childModels) && model.childModels.length > 0) {
            // Alternative way to access children
            model.childModels.forEach(childModel => {
                const childConfig = this.getModelConfig(childModel);
                if (childConfig) {
                    config.children.push(childConfig);
                }
            });
        }
        
        return config;
    }
    
    /**
     * Get configurations for multiple models
     * @param {Array} models - Array of models
     * @param {Array} names - Optional array of names for the models
     * @returns {Array} - Array of model configurations
     */
    static getModelsConfigs(models, names = null) {
        if (!models || !Array.isArray(models)) return [];
        
        return models.map((model, index) => {
            const config = this.getModelConfig(model);
            
            // Override name if provided
            if (names && Array.isArray(names) && names[index]) {
                config.name = names[index];
            }
            
            return config;
        });
    }
    
    /**
     * Helper to safely get a default value from a model method
     * @param {Object} model - The model
     * @param {string} methodName - Name of the method to call
     * @param {*} defaultValue - Default value if method doesn't exist
     * @returns {*} - The value from the method or default
     */
    static getDefaultValue(model, methodName, defaultValue) {
        if (model && typeof model[methodName] === 'function') {
            try {
                return model[methodName]();
            } catch (error) {
                console.warn(`Error calling ${methodName} on model:`, error);
                return defaultValue;
            }
        }
        return defaultValue;
    }
} 