import { Vector3, Color3, TransformNode } from '@babylonjs/core';
import { CompositeModel } from './CompositeModel';

/**
 * Base class for hexagonal structures that provides consistent hexagon geometry
 * calculations and positioning of elements at corners and sides.
 * 
 * This is designed to be a common base for both SingleCutModel (where pipes are corners
 * and panels are sides) and larger layer models (where SingleCutModels are positioned
 * at corners and/or sides of larger hexagonal structures).
 */
export class HexagonModel extends CompositeModel {
    /**
     * @param {BABYLON.Scene} scene - The Babylon.js scene
     * @param {BABYLON.Vector3} position - The position of the model
     * @param {Object} options - Configuration options
     */
    constructor(scene, position = new Vector3(0, 0, 0), options = {}) {
        // Default options for hexagonal structures
        const defaultOptions = {
            cornerCount: 6, // Number of corners in the hexagon (default is 6 for a regular hexagon)
            radius: 21, // Distance from center to each corner
            debug: false, // Enable/disable debug logging
            rotationAngle: 0, // Default rotation angle in degrees
            parent: null, // Reference to parent model (if any)
        };

        // Call parent constructor with merged options
        super(scene, position, { ...defaultOptions, ...options });
        
        // Store initial radius and rotation values for tracking changes
        this.initialValues = {
            ...this.initialValues,
            radius: this.options.radius,
            rotationAngle: this.options.rotationAngle
        };
        
        // Create transform nodes for corners and sides to manage positioning
        this.setupTransformNodes();
        
        // Apply initial rotation if specified
        if (this.options.rotationAngle !== 0) {
            this.updateRotation(this.options.rotationAngle);
        }
    }
    
    /**
     * Setup transform nodes for corners and sides of the hexagon
     * These nodes will be used to position elements in child classes
     */
    setupTransformNodes() {
        this.cornerNodes = [];
        this.sideNodes = [];
        
        const cornerCount = this.options.cornerCount;
        
        // Create a node for each corner of the hexagon
        for (let i = 0; i < cornerCount; i++) {
            const position = this.calculateCornerPosition(i);
            const nodeName = `${this.uniqueId}_corner_${i}`;
            
            const cornerNode = new TransformNode(nodeName, this.scene);
            cornerNode.position = position;
            cornerNode.parent = this.rootNode;
            
            this.cornerNodes.push(cornerNode);
            this.debugLog(`Created corner node ${i} at position (${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)})`);
        }
        
        // Create a node for each side (between corners) of the hexagon
        for (let i = 0; i < cornerCount; i++) {
            const nextIndex = (i + 1) % cornerCount;
            const current = this.cornerNodes[i].position;
            const next = this.cornerNodes[nextIndex].position;
            
            // Position at the midpoint between corners
            const position = current.add(next).scale(0.5);
            const nodeName = `${this.uniqueId}_side_${i}`;
            
            const sideNode = new TransformNode(nodeName, this.scene);
            sideNode.position = position;
            sideNode.parent = this.rootNode;
            
            // Calculate rotation to face outward from center
            const direction = position.normalize();
            const angle = Math.atan2(direction.z, direction.x);
            sideNode.rotation = new Vector3(0, angle, 0);
            
            this.sideNodes.push(sideNode);
            this.debugLog(`Created side node ${i} at position (${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)})`);
        }
    }
    
    /**
     * Calculate the position of a corner in the hexagon
     * @param {number} index - Index of the corner (0-based)
     * @returns {Vector3} - Position of the corner
     */
    calculateCornerPosition(index) {
        const cornerCount = this.options.cornerCount;
        const angle = (index * 2 * Math.PI) / cornerCount;
        
        const x = this.options.radius * Math.cos(angle);
        const z = this.options.radius * Math.sin(angle);
        
        return new Vector3(x, 0, z);
    }
    
    /**
     * Calculate the position of a side (between two corners) in the hexagon
     * @param {number} index - Index of the side (0-based)
     * @returns {Vector3} - Position of the side's midpoint
     */
    calculateSidePosition(index) {
        const cornerCount = this.options.cornerCount;
        const currentIndex = index;
        const nextIndex = (index + 1) % cornerCount;
        
        const current = this.calculateCornerPosition(currentIndex);
        const next = this.calculateCornerPosition(nextIndex);
        
        // Return the midpoint between corners
        return current.add(next).scale(0.5);
    }
    
    /**
     * Calculate the direction vector for a side (pointing outward)
     * @param {number} index - Index of the side (0-based)
     * @returns {Vector3} - Direction vector for the side
     */
    calculateSideDirection(index) {
        const position = this.calculateSidePosition(index);
        // Calculate direction from center to side midpoint
        return position.normalize();
    }
    
    /**
     * Calculate the angle between two corners
     * @param {number} index1 - Index of the first corner
     * @param {number} index2 - Index of the second corner
     * @returns {number} - Angle in radians
     */
    calculateCornerAngle(index1, index2) {
        const cornerCount = this.options.cornerCount;
        const angle1 = (index1 * 2 * Math.PI) / cornerCount;
        const angle2 = (index2 * 2 * Math.PI) / cornerCount;
        
        return Math.abs(angle2 - angle1);
    }
    
    /**
     * Calculate the distance between two corners
     * @param {number} index1 - Index of the first corner
     * @param {number} index2 - Index of the second corner
     * @returns {number} - Distance between corners
     */
    calculateCornerDistance(index1, index2) {
        const pos1 = this.calculateCornerPosition(index1);
        const pos2 = this.calculateCornerPosition(index2);
        
        return Vector3.Distance(pos1, pos2);
    }
    
    /**
     * Get the side length of the hexagon (distance between adjacent corners)
     * @returns {number} - Side length of the hexagon
     */
    getSideLength() {
        return this.calculateCornerDistance(0, 1);
    }
    
    /**
     * Get the distance across the hexagon (distance between opposite corners)
     * @returns {number} - Distance across the hexagon (corner to corner)
     */
    getCornerToCornerDistance() {
        const cornerCount = this.options.cornerCount;
        const oppositeIndex = cornerCount / 2;
        
        // For odd numbers of corners, there's no true opposite
        if (oppositeIndex % 1 !== 0) {
            return this.options.radius * 2;
        }
        
        return this.calculateCornerDistance(0, oppositeIndex);
    }
    
    /**
     * Get the distance between opposite sides of the hexagon
     * @returns {number} - Distance across the hexagon (side to side)
     */
    getSideToSideDistance() {
        // For a regular hexagon, distance between opposite sides is:
        // 2 * radius * cos(π/6) = √3 * radius
        return this.options.radius * Math.sqrt(3);
    }
    
    /**
     * Update the radius of the hexagon and reposition all elements
     * @param {number} newRadius - New radius value
     */
    updateRadius(newRadius) {
        if (this.options.radius === newRadius) {
            return; // No change needed
        }
        
        const oldRadius = this.options.radius;
        this.options.radius = newRadius;
        
        this.debugLog(`Updating radius from ${oldRadius.toFixed(2)} to ${newRadius.toFixed(2)}`);
        
        // Update positions of corner and side nodes
        this.updateNodePositions();
        
        // Child classes should override this and call super.updateRadius() first
        // to update any additional elements
    }
    
    /**
     * Update positions of corner and side nodes based on current radius
     */
    updateNodePositions() {
        const cornerCount = this.options.cornerCount;
        
        // Update corner positions
        for (let i = 0; i < cornerCount; i++) {
            if (this.cornerNodes[i]) {
                const position = this.calculateCornerPosition(i);
                this.cornerNodes[i].position = position;
            }
        }
        
        // Update side positions
        for (let i = 0; i < cornerCount; i++) {
            if (this.sideNodes[i]) {
                const nextIndex = (i + 1) % cornerCount;
                const current = this.cornerNodes[i].position;
                const next = this.cornerNodes[nextIndex].position;
                
                // Position at the midpoint between corners
                const position = current.add(next).scale(0.5);
                this.sideNodes[i].position = position;
                
                // Update rotation to face outward from center
                const direction = position.normalize();
                const angle = Math.atan2(direction.z, direction.x);
                this.sideNodes[i].rotation = new Vector3(0, angle, 0);
            }
        }
    }
    
    /**
     * Updates the rotation of this model. Base implementation does nothing.
     * Child classes should override this if they need rotation functionality.
     * @param {number} rotationAngle - The rotation angle in degrees
     * @deprecated Use getRotation() to get a reference to the rotation object and modify it directly
     */
    updateRotation(rotationAngle) {
        // Base implementation does nothing
        // Subclasses should override this if they need rotation functionality
    }
    
    /**
     * Gets or sets rotation information for this model
     * @returns {Object} - The rotation object that can be modified by reference
     */
    getRotation() {
        // Initialize a rotation object if it doesn't exist
        if (!this._rotation) {
            this._rotation = {
                angle: 0,      // Current rotation angle in degrees
                min: 0,        // Minimum rotation angle
                max: 360,      // Maximum rotation angle
                default: 0     // Default rotation angle
            };
        }
        
        return this._rotation;
    }
    
    /**
     * Gets or sets the rotation information for all children
     * Base implementation that returns null, to be overridden by subclasses
     * @param {number|null} deltaRotation - When provided, applies this delta rotation to children
     * @returns {Object|null} - Rotation information for child elements, or null if not supported
     */
    getChildrenRotations(deltaRotation = null) {
        return null; // Base implementation returns null
    }
    
    /**
     * Get the default radius value for this model
     * @returns {number} - Default radius
     */
    getDefaultRadius() {
        return this.options.radius;
    }
    
    /**
     * Get the min radius value for this model
     * @returns {number} - Minimum radius
     */
    getMinRadius() {
        return 10; // Minimum sensible radius for a hexagon
    }
    
    /**
     * Get the max radius value for this model
     * @returns {number} - Maximum radius
     */
    getMaxRadius() {
        return 100; // Maximum sensible radius for a hexagon
    }
    
    /**
     * Get the default rotation value for this model
     * @returns {number} - Default rotation in degrees
     */
    getDefaultRotation() {
        return this.options.rotationAngle;
    }
    
    /**
     * Get the min rotation value for this model
     * @returns {number} - Minimum rotation in degrees
     */
    getMinRotation() {
        return 0;
    }
    
    /**
     * Get the max rotation value for this model
     * @returns {number} - Maximum rotation in degrees
     */
    getMaxRotation() {
        return 360;
    }
    
    /**
     * Helper function to convert radians to degrees and format for display
     * @param {number} radians - Angle in radians
     * @returns {string} - Formatted string with angle in degrees
     */
    radToDeg(radians) {
        return (radians * 180 / Math.PI).toFixed(2) + '°';
    }
    
    /**
     * Helper function to convert degrees to radians
     * @param {number} degrees - Angle in degrees
     * @returns {number} - Angle in radians
     */
    degToRad(degrees) {
        return degrees * Math.PI / 180;
    }
    
    /**
     * Calculate the distance between opposite sides
     * This is useful for displaying in UI controls
     * @returns {number} - Distance in meters
     */
    calculateSideDistance() {
        // For a regular hexagon, the distance between opposite sides
        // is radius * √3, not radius * 2 (which is corner to corner)
        return this.options.radius * Math.sqrt(3);
    }
    
    /**
     * Disposes of the resources used by this model
     */
    dispose() {
        // Dispose corner and side nodes
        if (this.cornerNodes) {
            this.cornerNodes.forEach(node => {
                if (node) node.dispose();
            });
            this.cornerNodes = [];
        }
        
        if (this.sideNodes) {
            this.sideNodes.forEach(node => {
                if (node) node.dispose();
            });
            this.sideNodes = [];
        }
        
        // Call parent dispose method
        super.dispose();
    }
} 