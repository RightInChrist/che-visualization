/**
 * Scene Editor component for displaying scene objects and toggling visibility
 */
export class SceneEditor {
    constructor(scene, sceneObjects) {
        this.scene = scene;
        this.sceneObjects = sceneObjects;
        this.isVisible = false;
        this.lastUpdateTime = 0;
        this.updateInterval = 500; // Update every 500ms when visible
        
        // Create UI elements
        this.createUI();
        
        // Initial render of scene objects
        this.renderSceneObjects();
        
        // Setup keyboard shortcut (E key)
        this.setupKeyboardShortcut();
    }
    
    /**
     * Create the UI container and elements for the scene editor
     */
    createUI() {
        // Create editor container
        this.container = document.createElement('div');
        this.container.id = 'sceneEditor';
        this.container.style.position = 'absolute';
        this.container.style.top = '50px';
        this.container.style.right = '10px';
        this.container.style.width = '300px';
        this.container.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        this.container.style.color = 'white';
        this.container.style.padding = '10px';
        this.container.style.borderRadius = '5px';
        this.container.style.maxHeight = '80vh';
        this.container.style.overflowY = 'auto';
        this.container.style.display = 'none';
        this.container.style.zIndex = '100';
        this.container.style.fontFamily = 'Arial, sans-serif';
        
        // Create header
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '10px';
        
        const title = document.createElement('h3');
        title.textContent = 'Scene Editor';
        title.style.margin = '0';
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'X';
        closeBtn.style.background = 'none';
        closeBtn.style.border = 'none';
        closeBtn.style.color = 'white';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.fontSize = '16px';
        closeBtn.addEventListener('click', () => this.toggle());
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        
        // Create object list container
        this.objectListContainer = document.createElement('div');
        this.objectListContainer.id = 'objectList';
        
        // Assemble container
        this.container.appendChild(header);
        this.container.appendChild(this.objectListContainer);
        
        // Add to DOM
        document.body.appendChild(this.container);
        
        // Create toggle button
        this.toggleButton = document.createElement('button');
        this.toggleButton.id = 'sceneEditorToggle';
        this.toggleButton.textContent = 'Scene Editor';
        this.toggleButton.style.position = 'absolute';
        this.toggleButton.style.top = '10px';
        this.toggleButton.style.right = '10px';
        this.toggleButton.style.padding = '5px 10px';
        this.toggleButton.style.borderRadius = '5px';
        this.toggleButton.style.cursor = 'pointer';
        this.toggleButton.addEventListener('click', () => this.toggle());
        
        document.body.appendChild(this.toggleButton);
    }
    
    /**
     * Toggle visibility of the scene editor
     */
    toggle() {
        this.isVisible = !this.isVisible;
        this.container.style.display = this.isVisible ? 'block' : 'none';
        
        // If showing, update immediately
        if (this.isVisible) {
            this.renderSceneObjects();
        }
    }
    
    /**
     * Render the scene objects in a hierarchical structure
     */
    renderSceneObjects() {
        // Clear existing content
        this.objectListContainer.innerHTML = '';
        
        // Create object list
        const objectTree = document.createElement('ul');
        objectTree.style.listStyleType = 'none';
        objectTree.style.paddingLeft = '0';
        
        // Process each top-level object
        Object.entries(this.sceneObjects).forEach(([key, value]) => {
            const objectItem = this.createObjectListItem(key, value);
            objectTree.appendChild(objectItem);
        });
        
        this.objectListContainer.appendChild(objectTree);
    }
    
    /**
     * Creates a list item for an object in the scene hierarchy
     * @param {string} name - Name of the object
     * @param {Object} object - The object to create a list item for
     * @returns {HTMLElement} - The created list item
     */
    createObjectListItem(name, object) {
        const objectItem = document.createElement('li');
        objectItem.style.margin = '5px 0';
        
        const objectContainer = document.createElement('div');
        objectContainer.style.display = 'flex';
        objectContainer.style.alignItems = 'center';
        
        // Create visibility toggle checkbox - ALL objects should have one
        const toggleCheckbox = document.createElement('input');
        toggleCheckbox.type = 'checkbox';
        
        // Determine if the object should be checked based on its type
        if (object.mesh) {
            toggleCheckbox.checked = object.mesh.isVisible;
        } else if (object.pipeMesh) {
            toggleCheckbox.checked = object.pipeMesh.isVisible;
        } else if (object.panelMesh) {
            toggleCheckbox.checked = object.panelMesh.isVisible;
        } else {
            // Default to checked for container objects
            toggleCheckbox.checked = true;
        }
        
        toggleCheckbox.addEventListener('change', (e) => {
            this.toggleObjectVisibility(object, e.target.checked);
        });
        
        objectContainer.appendChild(toggleCheckbox);
        
        // Create object label
        const objectLabel = document.createElement('span');
        objectLabel.textContent = name;
        objectLabel.style.marginLeft = '5px';
        objectContainer.appendChild(objectLabel);
        
        objectItem.appendChild(objectContainer);
        
        // Create child list for objects with children
        if (this.hasChildren(object)) {
            const childList = document.createElement('ul');
            childList.style.listStyleType = 'none';
            childList.style.paddingLeft = '20px';
            
            // Add nested objects
            this.addNestedObjects(childList, object);
            
            objectItem.appendChild(childList);
        }
        
        return objectItem;
    }
    
    /**
     * Check if an object has children
     * @param {Object} object - The object to check
     * @returns {boolean} - Whether the object has children
     */
    hasChildren(object) {
        return object.pipes || object.panels || object.children;
    }
    
    /**
     * Add nested objects to a parent element
     * @param {HTMLElement} parentElement - The parent element to add to
     * @param {Object} parentObject - The parent object
     */
    addNestedObjects(parentElement, parentObject) {
        // Add pipes if present
        if (parentObject.pipes) {
            parentObject.pipes.forEach((pipe, index) => {
                const pipeItem = this.createObjectListItem(`Pipe #${index + 1}`, pipe);
                parentElement.appendChild(pipeItem);
            });
        }
        
        // Add panels if present
        if (parentObject.panels) {
            parentObject.panels.forEach((panel, index) => {
                const panelItem = this.createObjectListItem(`Panel #${index + 1}`, panel);
                parentElement.appendChild(panelItem);
            });
        }
        
        // Add other children if present
        if (parentObject.children) {
            Object.entries(parentObject.children).forEach(([key, value]) => {
                const childItem = this.createObjectListItem(key, value);
                parentElement.appendChild(childItem);
            });
        }
    }
    
    /**
     * Toggle the visibility of an object
     * @param {Object} object - The object to toggle
     * @param {boolean} isVisible - Whether the object should be visible
     */
    toggleObjectVisibility(object, isVisible) {
        // Toggle this object's visibility
        if (object.mesh) {
            object.mesh.isVisible = isVisible;
        } else if (object.pipeMesh) {
            object.pipeMesh.isVisible = isVisible;
        } else if (object.panelMesh) {
            object.panelMesh.isVisible = isVisible;
        }
        
        // Toggle visibility of child objects
        if (object.pipes) {
            object.pipes.forEach(pipe => {
                this.toggleObjectVisibility(pipe, isVisible);
            });
        }
        
        if (object.panels) {
            object.panels.forEach(panel => {
                this.toggleObjectVisibility(panel, isVisible);
            });
        }
        
        if (object.children) {
            Object.values(object.children).forEach(child => {
                this.toggleObjectVisibility(child, isVisible);
            });
        }
        
        // Update the UI to reflect changes
        this.renderSceneObjects();
    }
    
    /**
     * Update the scene editor with the latest object status
     * Only updates periodically to avoid performance issues
     */
    update(currentTime) {
        if (!this.isVisible) return;
        
        // If currentTime is not provided, use Date.now()
        const now = currentTime || Date.now();
        
        // Only update periodically to avoid performance issues
        if (now - this.lastUpdateTime > this.updateInterval) {
            this.renderSceneObjects();
            this.lastUpdateTime = now;
        }
    }
    
    /**
     * Setup keyboard shortcut to toggle scene editor
     */
    setupKeyboardShortcut() {
        window.addEventListener('keydown', (event) => {
            // Toggle with 'E' key
            if (event.code === 'KeyE') {
                this.toggle();
            }
        });
    }
} 