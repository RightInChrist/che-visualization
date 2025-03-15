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
     * @param {Object} parent - Optional parent object
     * @returns {HTMLElement} - The created list item
     */
    createObjectListItem(name, object, parent) {
        // Store the full hierarchical path for the object
        const objectPath = name;
        
        // Create a short display name (without path)
        const displayName = name.includes('/') ? name.split('/').pop() : name;
        
        const objectItem = document.createElement('li');
        objectItem.style.margin = '5px 0';
        objectItem.id = `item-${objectPath.replace(/[\s#]/g, '-').replace(/\//g, '_')}`;
        
        const objectContainer = document.createElement('div');
        objectContainer.style.display = 'flex';
        objectContainer.style.alignItems = 'center';
        
        // Check if this is a permanently hidden pipe or panel
        const isPermanentlyHidden = this.isElementPermanentlyHidden(name, object);
        
        // Create visibility toggle checkbox
        const toggleCheckbox = document.createElement('input');
        toggleCheckbox.type = 'checkbox';
        toggleCheckbox.id = `checkbox-${objectPath.replace(/[\s#]/g, '-').replace(/\//g, '_')}`;
        
        // Store both the checkbox element and the parent reference
        this.checkboxElements[objectPath] = {
            element: toggleCheckbox,
            parent: parent,
            object: object,
            isPermanentlyHidden: isPermanentlyHidden
        };
        
        // Check if this is a toggleable object
        if (name === 'Ground #1' || 
            name === 'Layer One Ring' || 
            name === 'Central CUT' ||
            name.startsWith('Single CUT #') ||
            name.includes('Pipe #') || 
            name.includes('Panel #')) {
            
            // For permanently hidden elements, disable checkbox and mark it
            if (isPermanentlyHidden) {
                toggleCheckbox.disabled = true;
                toggleCheckbox.checked = false;
                
                // Add 'disabled' class to the object container for styling
                objectContainer.classList.add('disabled');
            } else {
                // Initialize checkbox state based on object visibility
                toggleCheckbox.checked = this.getObjectVisibility(object);
                
                // Add event listener
                toggleCheckbox.addEventListener('change', (e) => {
                    // Get the checked state directly from the event target
                    const isChecked = e.target.checked;
                    
                    // Toggle the object visibility
                    this.toggleObjectVisibility(objectPath, object, isChecked);
                    
                    // If this is a parent object, update all child checkboxes
                    if (name === 'Layer One Ring' || name === 'Central CUT' || name.startsWith('Single CUT #')) {
                        this.updateNestedCheckboxes(objectPath, isChecked);
                    }
                });
            }
        } else {
            // For non-toggleable objects, hide checkbox
            toggleCheckbox.style.display = 'none';
        }
        
        objectContainer.appendChild(toggleCheckbox);
        
        // Create label for the object
        const objectLabel = document.createElement('span');
        objectLabel.textContent = displayName;
        objectLabel.style.marginLeft = '5px';
        objectContainer.appendChild(objectLabel);
        
        // Add the object container to the list item
        objectItem.appendChild(objectContainer);
        
        // Add child items container if this object has children
        if (this.hasChildren(object)) {
            const childList = document.createElement('ul');
            childList.style.paddingLeft = '20px';
            childList.style.listStyle = 'none';
            
            // Special handling for specific model types
            if (name === 'Layer One Ring') {
                this.addLayerOneRingChildren(childList, object);
            } else if (name.startsWith('Single CUT #')) {
                this.addSingleCutChildren(childList, object, name);
            } else if (object.children) {
                this.addChildrenObjects(childList, object.children);
            }
            
            objectItem.appendChild(childList);
        }
        
        return objectItem;
    }
    
    /**
     * Check if an element is permanently hidden in the model
     * @param {string} path - Path of the element
     * @param {Object} object - The object to check
     * @returns {boolean} - Whether the element is permanently hidden
     */
    isElementPermanentlyHidden(path, object) {
        // Check if the object itself has an isPermanentlyHidden flag
        if (object && object.isPermanentlyHidden === true) {
            return true;
        }
        
        // Check if this is a pipe or panel in a Layer One Ring model
        if (path.includes('/Pipe #') || path.includes('/Panel #')) {
            // Parse the path to extract model index, type and element index
            const parts = path.split('/');
            if (parts.length >= 2) {
                const singleCutName = parts[0]; // e.g., "Single CUT #2"
                const elementName = parts[1];   // e.g., "Pipe #3" or "Panel #4"
                
                // Extract indices
                const modelIndex = parseInt(singleCutName.replace('Single CUT #', '')) - 1; // Convert to 0-based index
                const elementIndex = parseInt(elementName.replace(/^(Pipe|Panel) #/, '')) - 1;
                const elementType = elementName.startsWith('Pipe') ? 'pipe' : 'panel';
                
                // Get the Layer One Ring model
                const layerOneRing = this.sceneObjects['Layer One Ring'];
                if (layerOneRing && layerOneRing.model && 
                    typeof layerOneRing.model.isElementPermanentlyHidden === 'function') {
                    return layerOneRing.model.isElementPermanentlyHidden(modelIndex, elementType, elementIndex);
                }
            }
        }
        
        return false;
    }
    
    /**
     * Add children for the SingleCUT model
     * @param {HTMLElement} parentElement - Parent element to add to
     * @param {Object} cutModel - The SingleCUT model
     * @param {string} parentName - Name of the parent SingleCUT
     */
    addSingleCutChildren(parentElement, cutModel, parentName) {
        const parentIndex = parentName ? parentName.replace('Single CUT #', '') : '';
        
        // Add all pipes
        if (cutModel.pipes && cutModel.pipes.length > 0) {
            cutModel.pipes.forEach((pipe, index) => {
                // Use qualified name that includes parent reference
                const pipeName = parentName ? `${parentName}/Pipe #${index + 1}` : `Pipe #${index + 1}`;
                const pipeItem = this.createObjectListItem(pipeName, pipe, cutModel);
                parentElement.appendChild(pipeItem);
            });
        }
        
        // Add panels
        if (cutModel.panels && cutModel.panels.length > 0) {
            cutModel.panels.forEach((panel, index) => {
                // Use qualified name that includes parent reference
                const panelName = parentName ? `${parentName}/Panel #${index + 1}` : `Panel #${index + 1}`;
                const panelItem = this.createObjectListItem(panelName, panel, cutModel);
                parentElement.appendChild(panelItem);
            });
        }
    }
    
    /**
     * Add children for the Layer One Ring model
     * @param {HTMLElement} parentElement - Parent element to add to
     * @param {Object} layerOneRingModel - The Layer One Ring model
     */
    addLayerOneRingChildren(parentElement, layerOneRingModel) {
        // Add all SingleCUTs
        if (layerOneRingModel.model && layerOneRingModel.model.singleCuts && layerOneRingModel.model.singleCuts.length > 0) {
            layerOneRingModel.model.singleCuts.forEach((singleCut, index) => {
                const singleCutName = `Single CUT #${index + 1}`;
                const singleCutItem = this.createObjectListItem(singleCutName, singleCut, layerOneRingModel);
                parentElement.appendChild(singleCutItem);
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
     * Recursively set visibility on an object and all its children
     * @param {Object} object - The object to set visibility on
     * @param {boolean} isVisible - Whether the object should be visible
     * @param {string} path - Optional path to the object for checking permanent hidden status
     */
    setObjectVisibility(object, isVisible, path = '') {
        if (!object) return;
        
        // Skip if this is a permanently hidden element
        if (path && this.isElementPermanentlyHidden(path, object)) {
            console.log(`Skipping permanently hidden element: ${path}`);
            return;
        }
        
        // For panel debugging
        if (object.panelMesh) {
            console.log('Panel object found:', object);
            console.log('Before setting visibility:', object.panelMesh.isVisible);
        }
        
        // Set visibility on this object
        if (typeof object.setVisible === 'function') {
            // Use the object's setVisible method (BaseModel/CompositeModel)
            console.log(`Using setVisible method for ${object.constructor.name || 'object'}`, isVisible);
            object.setVisible(isVisible);
        } else if (object.rootNode && object.rootNode.setEnabled) {
            // Set enabled state on the root node
            console.log('Setting root node enabled state to', isVisible);
            object.rootNode.setEnabled(isVisible);
        } else if (object.mesh && object.mesh.isVisible !== undefined) {
            // Set visibility on the mesh
            console.log('Setting mesh visibility to', isVisible);
            object.mesh.isVisible = isVisible; 
        } else if (object.pipeMesh && object.pipeMesh.isVisible !== undefined) {
            // Set visibility on pipe mesh
            console.log('Setting pipe mesh visibility to', isVisible);
            object.pipeMesh.isVisible = isVisible;
        } else if (object.panelMesh && object.panelMesh.isVisible !== undefined) {
            // Set visibility on panel mesh
            console.log('Setting panel mesh visibility to', isVisible);
            object.panelMesh.isVisible = isVisible;
            
            // Ensure the parent node is also visible/invisible
            if (object.rootNode) {
                console.log('Setting panel root node enabled state to', isVisible);
                object.rootNode.setEnabled(isVisible);
            }
            
            // Force the panel mesh to update its visibility
            object.panelMesh.refreshBoundingInfo();
        }
        
        // For panel debugging
        if (object.panelMesh) {
            console.log('After setting visibility:', object.panelMesh.isVisible);
        }
        
        // Process children based on object type
        
        // 1. Handle LayerOneRing case
        if (object.model && object.model.singleCuts) {
            // Process all SingleCut models
            object.model.singleCuts.forEach((singleCut, index) => {
                // Build the path for the SingleCUT
                const singleCutPath = `Single CUT #${index + 1}`;
                this.setObjectVisibility(singleCut, isVisible, singleCutPath);
            });
        }
        
        // 2. Handle CompositeModel child models
        if (object.childModels && Array.isArray(object.childModels)) {
            object.childModels.forEach(childModel => {
                this.setObjectVisibility(childModel, isVisible);
            });
        }
        
        // 3. Handle SingleCutModel pipes and panels
        if (object.pipes && Array.isArray(object.pipes)) {
            object.pipes.forEach((pipe, index) => {
                // Build the path for the pipe
                const pipePath = path ? `${path}/Pipe #${index + 1}` : `Pipe #${index + 1}`;
                this.setObjectVisibility(pipe, isVisible, pipePath);
            });
        }
        
        if (object.panels && Array.isArray(object.panels)) {
            object.panels.forEach((panel, index) => {
                // Build the path for the panel
                const panelPath = path ? `${path}/Panel #${index + 1}` : `Panel #${index + 1}`;
                this.setObjectVisibility(panel, isVisible, panelPath);
            });
        }
        
        // 4. Handle generic children object
        if (object.children && typeof object.children === 'object') {
            Object.values(object.children).forEach(child => {
                this.setObjectVisibility(child, isVisible);
            });
        }
    }
    
    /**
     * Toggle the visibility of an object
     * @param {string} path - Path of the object
     * @param {Object} object - The object to toggle
     * @param {boolean} isVisible - Whether the object should be visible
     */
    toggleObjectVisibility(path, object, isVisible) {
        // Prevent multiple rapid toggles
        if (this.isTogglingVisibility) return;
        this.isTogglingVisibility = true;
        
        try {
            // Log for debugging
            console.log(`Toggling ${path} visibility to ${isVisible}`);
            
            // Store the desired state for this object
            if (!this.desiredVisibilityState) {
                this.desiredVisibilityState = {};
            }
            this.desiredVisibilityState[path] = isVisible;
            
            // Special handling for panel paths
            const isPanelPath = path.includes('/Panel #');
            if (isPanelPath) {
                console.log('Panel path detected:', path);
                console.log('Panel object:', object);
            }
            
            // Use recursive function to set visibility on the object and all its children
            this.setObjectVisibility(object, isVisible, path);
            
            // Force scene to update
            this.scene.render();
            
            // For panels, do an extra check to ensure visibility was updated
            if (isPanelPath && object.panelMesh) {
                console.log('Additional check for panel visibility:');
                console.log('Current panel mesh visibility:', object.panelMesh.isVisible);
                
                // Force visibility again directly
                object.panelMesh.isVisible = isVisible;
                if (object.rootNode) {
                    object.rootNode.setEnabled(isVisible);
                }
                
                // Force another render
                this.scene.render();
            }
            
            // Update nested checkboxes to match the visibility state
            this.updateNestedCheckboxes(path, isVisible);
            
            // Ensure the checkbox stays in the correct state 
            if (this.checkboxElements[path] && this.checkboxElements[path].element) {
                this.checkboxElements[path].element.checked = isVisible;
            }
        } finally {
            // Clear the flag after a short delay to prevent rapid toggling
            setTimeout(() => {
                this.isTogglingVisibility = false;
            }, 50);
        }
    }
    
    /**
     * Update all child checkboxes when a parent checkbox is toggled
     * @param {string} parentPath - Path of the parent object
     * @param {boolean} isChecked - Whether the parent checkbox is checked
     */
    updateNestedCheckboxes(parentPath, isChecked) {
        console.log(`Updating nested checkboxes for ${parentPath} to ${isChecked}`);
        
        // For Layer One Ring parent, collect all children paths
        if (parentPath === 'Layer One Ring') {
            for (const [path, checkboxInfo] of Object.entries(this.checkboxElements)) {
                // Skip permanently hidden elements
                if (checkboxInfo.isPermanentlyHidden) {
                    continue;
                }
                
                // Match any path that starts with a SingleCUT number
                // This will affect all SingleCUTs and their pipes/panels
                if (path.startsWith('Single CUT #')) {
                    console.log(`Setting child checkbox for ${path} to ${isChecked}`);
                    checkboxInfo.element.checked = isChecked;
                    
                    // Also update the actual object visibility
                    this.toggleObjectVisibility(path, checkboxInfo.object, isChecked);
                }
            }
        }
        // For SingleCUT parent, only update its pipes and panels
        else if (parentPath.startsWith('Single CUT #')) {
            for (const [path, checkboxInfo] of Object.entries(this.checkboxElements)) {
                // Skip permanently hidden elements
                if (checkboxInfo.isPermanentlyHidden) {
                    continue;
                }
                
                // Match only paths that are direct children (pipes/panels) of this SingleCUT
                if (path.startsWith(parentPath + '/')) {
                    console.log(`Setting child checkbox for ${path} to ${isChecked}`);
                    checkboxInfo.element.checked = isChecked;
                    
                    // Also update the actual object visibility
                    this.toggleObjectVisibility(path, checkboxInfo.object, isChecked);
                }
            }
        }
        // For Central CUT, update all its pipes and panels
        else if (parentPath === 'Central CUT') {
            for (const [path, checkboxInfo] of Object.entries(this.checkboxElements)) {
                // Skip permanently hidden elements
                if (checkboxInfo.isPermanentlyHidden) {
                    continue;
                }
                
                // Match only paths that are direct children (pipes/panels) of Central CUT
                if (path.startsWith(parentPath + '/')) {
                    console.log(`Setting child checkbox for ${path} to ${isChecked}`);
                    checkboxInfo.element.checked = isChecked;
                    
                    // Also update the actual object visibility
                    this.toggleObjectVisibility(path, checkboxInfo.object, isChecked);
                }
            }
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
            for (const [path, checkboxInfo] of Object.entries(this.checkboxElements)) {
                if (checkboxInfo.element && checkboxInfo.object) {
                    const isVisible = this.getObjectVisibility(checkboxInfo.object);
                    
                    // Only update if we don't have a desired state or if it matches
                    if (!this.desiredVisibilityState || this.desiredVisibilityState[path] === undefined) {
                        checkboxInfo.element.checked = isVisible;
                    } else {
                        // Otherwise, the desired state takes precedence
                        checkboxInfo.element.checked = this.desiredVisibilityState[path];
                    }
                }
            }
        } finally {
            this.isUpdating = false;
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