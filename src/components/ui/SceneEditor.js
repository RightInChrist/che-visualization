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
        
        // Add scene objects to the tree
        this.addTopLevelObjectsToTree(objectTree, this.sceneObjects);
        
        this.objectListContainer.appendChild(objectTree);
    }
    
    /**
     * Add top-level objects to the tree structure
     * @param {HTMLElement} parentElement - Parent DOM element to add to
     * @param {Object} objects - Objects to add to the tree
     */
    addTopLevelObjectsToTree(parentElement, objects) {
        // This method ensures we only add top-level objects and let the nested structure
        // be handled by addObjectsToTree
        Object.entries(objects).forEach(([key, value]) => {
            const objectItem = document.createElement('li');
            objectItem.style.margin = '5px 0';
            
            const objectContainer = document.createElement('div');
            objectContainer.style.display = 'flex';
            objectContainer.style.alignItems = 'center';
            
            // Create visibility toggle checkbox for items with a mesh
            if (value.mesh || (value.pipeMesh || value.panelMesh)) {
                const toggleCheckbox = document.createElement('input');
                toggleCheckbox.type = 'checkbox';
                toggleCheckbox.checked = value.mesh ? value.mesh.isVisible : 
                                        (value.pipeMesh ? value.pipeMesh.isVisible : 
                                        (value.panelMesh ? value.panelMesh.isVisible : true));
                                        
                toggleCheckbox.addEventListener('change', (e) => {
                    this.toggleObjectVisibility(value, e.target.checked);
                });
                
                objectContainer.appendChild(toggleCheckbox);
            } else {
                // Add a spacer for consistent alignment
                const spacer = document.createElement('div');
                spacer.style.width = '20px';
                objectContainer.appendChild(spacer);
            }
            
            // Create object label
            const objectLabel = document.createElement('span');
            objectLabel.textContent = key;
            objectLabel.style.marginLeft = '5px';
            objectContainer.appendChild(objectLabel);
            
            objectItem.appendChild(objectContainer);
            
            // Add child objects if this is a container
            if (value.pipes || value.panels || value.children) {
                const childList = document.createElement('ul');
                childList.style.listStyleType = 'none';
                childList.style.paddingLeft = '20px';
                
                // Handle pipes and panels for SingleCUT model
                if (key === 'Single CUT #1') {
                    if (value.pipes) {
                        value.pipes.forEach((pipe, index) => {
                            this.addNestedObject(childList, `Pipe #${index + 1}`, pipe);
                        });
                    }
                    
                    if (value.panels) {
                        value.panels.forEach((panel, index) => {
                            this.addNestedObject(childList, `Panel #${index + 1}`, panel);
                        });
                    }
                } else if (key === 'Lights' || key === 'Camera Controller' || value.children) {
                    // Handle any other nested objects
                    this.addNestedChildren(childList, value);
                }
                
                objectItem.appendChild(childList);
            }
            
            parentElement.appendChild(objectItem);
        });
    }
    
    /**
     * Add a nested object to the tree
     * @param {HTMLElement} parentElement - Parent element to add to
     * @param {string} name - Name of the object
     * @param {Object} object - The object to add
     */
    addNestedObject(parentElement, name, object) {
        const objectItem = document.createElement('li');
        objectItem.style.margin = '5px 0';
        
        const objectContainer = document.createElement('div');
        objectContainer.style.display = 'flex';
        objectContainer.style.alignItems = 'center';
        
        // Create visibility toggle checkbox
        if (object.mesh || object.pipeMesh || object.panelMesh) {
            const toggleCheckbox = document.createElement('input');
            toggleCheckbox.type = 'checkbox';
            toggleCheckbox.checked = object.mesh ? object.mesh.isVisible : 
                                    (object.pipeMesh ? object.pipeMesh.isVisible : 
                                    (object.panelMesh ? object.panelMesh.isVisible : true));
                                    
            toggleCheckbox.addEventListener('change', (e) => {
                this.toggleObjectVisibility(object, e.target.checked);
            });
            
            objectContainer.appendChild(toggleCheckbox);
        } else {
            // Add a spacer for consistent alignment
            const spacer = document.createElement('div');
            spacer.style.width = '20px';
            objectContainer.appendChild(spacer);
        }
        
        // Create object label
        const objectLabel = document.createElement('span');
        objectLabel.textContent = name;
        objectLabel.style.marginLeft = '5px';
        objectContainer.appendChild(objectLabel);
        
        objectItem.appendChild(objectContainer);
        parentElement.appendChild(objectItem);
    }
    
    /**
     * Add nested children to the tree from objects with 'children' property
     * @param {HTMLElement} parentElement - Parent element to add to
     * @param {Object} parentObject - Object containing the children
     */
    addNestedChildren(parentElement, parentObject) {
        // For objects like Lights that have named properties
        if (parentObject.children) {
            Object.entries(parentObject.children).forEach(([key, value]) => {
                this.addNestedObject(parentElement, key, value);
            });
        } else {
            // For objects that have properties directly
            for (const key in parentObject) {
                if (parentObject.hasOwnProperty(key) && key !== 'pipes' && key !== 'panels' && typeof parentObject[key] === 'object') {
                    this.addNestedObject(parentElement, key, parentObject[key]);
                }
            }
        }
    }
    
    /**
     * Toggle the visibility of an object
     * @param {Object} object - The object to toggle
     * @param {boolean} isVisible - Whether the object should be visible
     */
    toggleObjectVisibility(object, isVisible) {
        if (object.mesh) {
            object.mesh.isVisible = isVisible;
        } else if (object.pipeMesh) {
            object.pipeMesh.isVisible = isVisible;
        } else if (object.panelMesh) {
            object.panelMesh.isVisible = isVisible;
        } else if (object.setVisible) {
            object.setVisible(isVisible);
        }
        
        // Toggle children if needed
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