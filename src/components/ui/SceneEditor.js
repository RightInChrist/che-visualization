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
        
        // Store checkbox elements for updating
        this.checkboxElements = {};

        // Flag to prevent update loops
        this.isUpdating = false;
        
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
            this.updateCheckboxStates();
        }
    }
    
    /**
     * Render the scene objects in a hierarchical structure
     */
    renderSceneObjects() {
        // Clear existing content
        this.objectListContainer.innerHTML = '';
        this.checkboxElements = {};
        
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
        objectItem.id = `item-${name.replace(/[\s#]/g, '-')}`;
        
        const objectContainer = document.createElement('div');
        objectContainer.style.display = 'flex';
        objectContainer.style.alignItems = 'center';
        
        // Create visibility toggle checkbox
        const toggleCheckbox = document.createElement('input');
        toggleCheckbox.type = 'checkbox';
        toggleCheckbox.id = `checkbox-${name.replace(/[\s#]/g, '-')}`;
        
        // Store checkbox element for later updates
        this.checkboxElements[name] = toggleCheckbox;
        
        // Check if this is a toggleable object
        if (name === 'Ground #1' || 
            name === 'Seven CUTs #1' || 
            name.startsWith('Single CUT #') ||
            name.startsWith('Pipe #') || 
            name.startsWith('Panel #')) {
            
            // Initialize checkbox state based on object visibility
            toggleCheckbox.checked = this.getObjectVisibility(object);
            
            // Add event listener
            toggleCheckbox.addEventListener('change', (e) => {
                // Get the checked state directly from the event target
                const isChecked = e.target.checked;
                
                // Toggle the object visibility
                this.toggleObjectVisibility(name, object, isChecked);
                
                // If this is a parent object, update all child checkboxes
                if (name === 'Seven CUTs #1' || name.startsWith('Single CUT #')) {
                    this.updateNestedCheckboxes(name, isChecked);
                }
            });
        } else {
            // Non-toggleable objects
            toggleCheckbox.disabled = true;
            toggleCheckbox.checked = true;
        }
        
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
            childList.id = `children-${name.replace(/[\s#]/g, '-')}`;
            
            if (name === 'Seven CUTs #1') {
                this.addSevenCutsChildren(childList, object);
            } else if (name.startsWith('Single CUT #')) {
                this.addSingleCutChildren(childList, object);
            } else if (object.children) {
                this.addChildrenObjects(childList, object.children);
            }
            
            objectItem.appendChild(childList);
        }
        
        return objectItem;
    }
    
    /**
     * Add children for the SevenCUTs model
     * @param {HTMLElement} parentElement - Parent element to add to
     * @param {Object} sevenCutsModel - The SevenCUTs model
     */
    addSevenCutsChildren(parentElement, sevenCutsModel) {
        // Add all SingleCUTs
        if (sevenCutsModel.model && sevenCutsModel.model.singleCuts && sevenCutsModel.model.singleCuts.length > 0) {
            sevenCutsModel.model.singleCuts.forEach((singleCut, index) => {
                const singleCutItem = this.createObjectListItem(`Single CUT #${index + 1}`, singleCut);
                parentElement.appendChild(singleCutItem);
            });
        }
    }
    
    /**
     * Add children for the SingleCUT model
     * @param {HTMLElement} parentElement - Parent element to add to
     * @param {Object} cutModel - The SingleCUT model
     */
    addSingleCutChildren(parentElement, cutModel) {
        // Add all pipes
        if (cutModel.pipes && cutModel.pipes.length > 0) {
            cutModel.pipes.forEach((pipe, index) => {
                const pipeItem = this.createObjectListItem(`Pipe #${index + 1}`, pipe);
                parentElement.appendChild(pipeItem);
            });
        }
        
        // Add panels
        if (cutModel.panels && cutModel.panels.length > 0) {
            cutModel.panels.forEach((panel, index) => {
                const panelItem = this.createObjectListItem(`Panel #${index + 1}`, panel);
                parentElement.appendChild(panelItem);
            });
        }
    }
    
    /**
     * Add generic children objects
     * @param {HTMLElement} parentElement - Parent element to add to
     * @param {Object} children - Children objects
     */
    addChildrenObjects(parentElement, children) {
        Object.entries(children).forEach(([key, value]) => {
            const childItem = this.createObjectListItem(key, value);
            parentElement.appendChild(childItem);
        });
    }
    
    /**
     * Check if an object has children
     * @param {Object} object - The object to check
     * @returns {boolean} - Whether the object has children
     */
    hasChildren(object) {
        return (
            (object.pipes && object.pipes.length > 0) ||
            (object.panels && object.panels.length > 0) || 
            (object.children && Object.keys(object.children).length > 0) ||
            (object.model && object.model.singleCuts && object.model.singleCuts.length > 0) ||
            (object.model && object.model.childModels && object.model.childModels.length > 0)
        );
    }
    
    /**
     * Helper method to get the current visibility state of an object
     * @param {Object} object - The object to check
     * @returns {boolean} - Whether the object is visible
     */
    getObjectVisibility(object) {
        // For BaseModel or CompositeModel objects
        if (object.isVisible && typeof object.isVisible === 'function') {
            return object.isVisible();
        }
        
        // For model property containing BaseModel or CompositeModel
        if (object.model && object.model.isVisible && typeof object.model.isVisible === 'function') {
            return object.model.isVisible();
        }
        
        // For direct mesh access
        if (object.mesh && object.mesh.isVisible !== undefined) {
            return object.mesh.isVisible;
        }
        
        // For PipeModel
        if (object.pipeMesh && object.pipeMesh.isVisible !== undefined) {
            return object.pipeMesh.isVisible;
        }
        
        // For PanelModel
        if (object.panelMesh && object.panelMesh.isVisible !== undefined) {
            return object.panelMesh.isVisible;
        }
        
        // For root node enabled state
        if (object.rootNode && object.rootNode.isEnabled !== undefined) {
            return object.rootNode.isEnabled();
        }
        
        // If we can't determine visibility, default to true
        return true;
    }
    
    /**
     * Update all nested checkboxes under a parent
     * @param {string} parentName - Name of the parent object
     * @param {boolean} isChecked - Whether the checkboxes should be checked
     */
    updateNestedCheckboxes(parentName, isChecked) {
        // Update parent checkbox first
        if (this.checkboxElements[parentName]) {
            this.checkboxElements[parentName].checked = isChecked;
        }
        
        if (parentName === 'Seven CUTs #1') {
            const sevenCuts = this.sceneObjects['Seven CUTs #1'];
            
            // Update all SingleCUT checkboxes
            if (sevenCuts && sevenCuts.model && sevenCuts.model.singleCuts) {
                sevenCuts.model.singleCuts.forEach((singleCut, index) => {
                    const singleCutName = `Single CUT #${index + 1}`;
                    if (this.checkboxElements[singleCutName]) {
                        this.checkboxElements[singleCutName].checked = isChecked;
                    }
                    
                    // Update pipes and panels checkboxes under this SingleCUT
                    this.updatePipeAndPanelCheckboxes(singleCut, isChecked);
                });
            }
        } else if (parentName.startsWith('Single CUT #')) {
            // Extract index from name
            const indexStr = parentName.replace('Single CUT #', '');
            const index = parseInt(indexStr) - 1;
            
            // Get the SingleCUT object
            let singleCut = null;
            if (this.sceneObjects['Seven CUTs #1'] && 
                this.sceneObjects['Seven CUTs #1'].model && 
                this.sceneObjects['Seven CUTs #1'].model.singleCuts) {
                singleCut = this.sceneObjects['Seven CUTs #1'].model.singleCuts[index];
            } else if (this.sceneObjects[parentName]) {
                singleCut = this.sceneObjects[parentName];
            }
            
            if (singleCut) {
                // Update pipe and panel checkboxes
                this.updatePipeAndPanelCheckboxes(singleCut, isChecked);
            }
        }
        
        // Force UI update
        this.scene.render();
    }
    
    /**
     * Helper to update pipe and panel checkboxes for a SingleCUT
     * @param {Object} singleCut - The SingleCUT object
     * @param {boolean} isChecked - Whether the checkboxes should be checked
     */
    updatePipeAndPanelCheckboxes(singleCut, isChecked) {
        if (!singleCut) return;
        
        // Update pipe checkboxes
        if (singleCut.pipes) {
            singleCut.pipes.forEach((pipe, index) => {
                const pipeName = `Pipe #${index + 1}`;
                if (this.checkboxElements[pipeName]) {
                    this.checkboxElements[pipeName].checked = isChecked;
                }
            });
        }
        
        // Update panel checkboxes
        if (singleCut.panels) {
            singleCut.panels.forEach((panel, index) => {
                const panelName = `Panel #${index + 1}`;
                if (this.checkboxElements[panelName]) {
                    this.checkboxElements[panelName].checked = isChecked;
                }
            });
        }
    }
    
    /**
     * Update all checkbox states based on actual object visibility
     */
    updateCheckboxStates() {
        if (this.isUpdating) return;
        this.isUpdating = true;
        
        try {
            // Update the state of all checkboxes based on the actual visibility of objects
            for (const [name, checkbox] of Object.entries(this.checkboxElements)) {
                if (name === 'Ground #1') {
                    const ground = this.sceneObjects['Ground #1'];
                    if (ground) {
                        checkbox.checked = this.getObjectVisibility(ground);
                    }
                } else if (name === 'Seven CUTs #1') {
                    const sevenCuts = this.sceneObjects['Seven CUTs #1'];
                    if (sevenCuts) {
                        checkbox.checked = this.getObjectVisibility(sevenCuts);
                    }
                } else if (name.startsWith('Single CUT #')) {
                    // Extract index from name
                    const indexStr = name.replace('Single CUT #', '');
                    const index = parseInt(indexStr) - 1;
                    
                    // Get the SingleCUT object from SevenCUTs model
                    if (this.sceneObjects['Seven CUTs #1'] && 
                        this.sceneObjects['Seven CUTs #1'].model && 
                        this.sceneObjects['Seven CUTs #1'].model.singleCuts &&
                        index >= 0 && index < this.sceneObjects['Seven CUTs #1'].model.singleCuts.length) {
                        
                        const singleCut = this.sceneObjects['Seven CUTs #1'].model.singleCuts[index];
                        checkbox.checked = this.getObjectVisibility(singleCut);
                    }
                } else if (name.startsWith('Pipe #') || name.startsWith('Panel #')) {
                    // Handle these as needed - we update their states in updateNestedCheckboxes
                    // This would need more complex logic to match the pipe/panel to its parent
                }
            }
        } finally {
            this.isUpdating = false;
        }
    }
    
    /**
     * Toggle the visibility of an object
     * @param {string} name - Name of the object
     * @param {Object} object - The object to toggle
     * @param {boolean} isVisible - Whether the object should be visible
     */
    toggleObjectVisibility(name, object, isVisible) {
        // Log for debugging
        console.log(`Toggling ${name} visibility to ${isVisible}`);
        
        // Toggle visibility based on the object type
        if (name === 'Ground #1') {
            // For ground model
            if (typeof object.setVisible === 'function') {
                object.setVisible(isVisible);
            } else if (object.mesh) {
                object.mesh.isVisible = isVisible;
            }
        } else if (name === 'Seven CUTs #1') {
            // For composite SevenCUTs model
            if (object.model && typeof object.model.setVisible === 'function') {
                // Use the CompositeModel's setVisible method which propagates to children
                object.model.setVisible(isVisible);
            }
        } else if (name.startsWith('Single CUT #')) {
            // For SingleCUT model
            if (typeof object.setVisible === 'function') {
                object.setVisible(isVisible);
            } else if (object.rootNode) {
                object.rootNode.setEnabled(isVisible);
                
                // Also update all children visibility
                if (object.pipes) {
                    object.pipes.forEach(pipe => {
                        if (typeof pipe.setVisible === 'function') {
                            pipe.setVisible(isVisible);
                        } else if (pipe.pipeMesh) {
                            pipe.pipeMesh.isVisible = isVisible;
                        }
                    });
                }
                
                if (object.panels) {
                    object.panels.forEach(panel => {
                        if (typeof panel.setVisible === 'function') {
                            panel.setVisible(isVisible);
                        } else if (panel.panelMesh) {
                            panel.panelMesh.isVisible = isVisible;
                        }
                    });
                }
            }
        } else if (name.startsWith('Pipe #')) {
            // For individual pipe
            if (typeof object.setVisible === 'function') {
                object.setVisible(isVisible);
            } else if (object.pipeMesh) {
                object.pipeMesh.isVisible = isVisible;
            }
        } else if (name.startsWith('Panel #')) {
            // For individual panel
            if (typeof object.setVisible === 'function') {
                object.setVisible(isVisible);
            } else if (object.panelMesh) {
                object.panelMesh.isVisible = isVisible;
            }
        }
        
        // Force scene to update
        this.scene.render();
        
        // Update nested checkboxes to match the visibility state
        this.updateNestedCheckboxes(name, isVisible);
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
            this.updateCheckboxStates();
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