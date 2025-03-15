import { BaseModel } from './BaseModel';

/**
 * Composite model class for managing hierarchies of models
 * Provides standard methods for working with child models
 */
export class CompositeModel extends BaseModel {
    constructor(scene, position, options = {}) {
        super(scene, position, options);
        
        // Initialize empty array for child models
        this.childModels = [];
    }
    
    /**
     * Adds a child model to this composite model
     * @param {BaseModel} model - The model to add as a child
     */
    addChild(model) {
        if (model && model.rootNode) {
            // Parent the child's root node to this model's root node
            model.rootNode.parent = this.rootNode;
            
            // Add to our child models array
            this.childModels.push(model);
            
            this.debugLog(`Added child model: ${model.constructor.name}`);
        }
    }
    
    /**
     * Adds multiple child models at once
     * @param {Array<BaseModel>} models - Array of models to add as children
     */
    addChildren(models) {
        if (Array.isArray(models)) {
            models.forEach(model => this.addChild(model));
        }
    }
    
    /**
     * Gets all child models
     * @returns {Array<BaseModel>} - Array of child models
     */
    getChildren() {
        return [...this.childModels];
    }
    
    /**
     * Sets visibility for this model and all its children
     * @param {boolean} isVisible - Whether models should be visible
     */
    setVisible(isVisible) {
        // Set visibility for this model's root node
        super.setVisible(isVisible);
        
        // Set visibility for all child models
        this.childModels.forEach(child => {
            child.setVisible(isVisible);
        });
    }
    
    /**
     * Updates LOD for this model and all child models
     * @param {Vector3} cameraPosition - The camera position
     */
    updateLOD(cameraPosition) {
        // Update LOD for each child model
        this.childModels.forEach(child => {
            child.updateLOD(cameraPosition);
        });
    }
    
    /**
     * Gets all meshes from all child models recursively
     * @param {string} propertyName - Optional property name to filter (e.g., 'pipes')
     * @returns {Array} - Array of all meshes
     */
    getAllMeshes(propertyName = null) {
        const allMeshes = [];
        
        this.childModels.forEach(child => {
            // If child has the specified property and it's an array
            if (propertyName && child[propertyName] && Array.isArray(child[propertyName])) {
                allMeshes.push(...child[propertyName]);
            } 
            // If child is a CompositeModel, recursively get its meshes
            else if (child instanceof CompositeModel) {
                allMeshes.push(...child.getAllMeshes(propertyName));
            }
        });
        
        return allMeshes;
    }
    
    /**
     * Disposes this model and all child models
     */
    dispose() {
        // Dispose all child models
        this.childModels.forEach(child => {
            child.dispose();
        });
        
        // Clear the array
        this.childModels = [];
        
        // Dispose this model's resources
        super.dispose();
    }
} 