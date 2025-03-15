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
        
        // Add CSS styles for collapsible lists
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .collapse-btn {
                cursor: pointer;
                user-select: none;
                margin-right: 5px;
                display: inline-block;
                width: 16px;
                height: 16px;
                text-align: center;
                line-height: 14px;
                border: 1px solid #555;
                border-radius: 2px;
                background-color: #333;
            }
            .collapse-btn:hover {
                background-color: #444;
            }
            .collapsed {
                display: none !important;
            }
            .object-label {
                cursor: pointer;
            }
            .object-row {
                display: flex;
                align-items: center;
            }
        `;
        document.head.appendChild(styleElement);
        
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
        
        // Add expand/collapse all buttons
        const actionBtns = document.createElement('div');
        actionBtns.style.display = 'flex';
        actionBtns.style.gap = '10px';
        
        const expandAllBtn = document.createElement('button');
        expandAllBtn.textContent = 'Expand All';
        expandAllBtn.style.fontSize = '11px';
        expandAllBtn.style.padding = '2px 5px';
        expandAllBtn.style.backgroundColor = '#333';
        expandAllBtn.style.color = 'white';
        expandAllBtn.style.border = '1px solid #555';
        expandAllBtn.style.borderRadius = '3px';
        expandAllBtn.style.cursor = 'pointer';
        expandAllBtn.addEventListener('click', () => this.expandAll());
        
        const collapseAllBtn = document.createElement('button');
        collapseAllBtn.textContent = 'Collapse All';
        collapseAllBtn.style.fontSize = '11px';
        collapseAllBtn.style.padding = '2px 5px';
        collapseAllBtn.style.backgroundColor = '#333';
        collapseAllBtn.style.color = 'white';
        collapseAllBtn.style.border = '1px solid #555';
        collapseAllBtn.style.borderRadius = '3px';
        collapseAllBtn.style.cursor = 'pointer';
        collapseAllBtn.addEventListener('click', () => this.collapseAll());
        
        actionBtns.appendChild(expandAllBtn);
        actionBtns.appendChild(collapseAllBtn);
        
        header.appendChild(title);
        header.appendChild(actionBtns);
        
        const closeBtnWrapper = document.createElement('div');
        closeBtnWrapper.appendChild(closeBtn);
        
        const headerRow = document.createElement('div');
        headerRow.style.display = 'flex';
        headerRow.style.justifyContent = 'space-between';
        headerRow.style.alignItems = 'center';
        headerRow.style.marginBottom = '10px';
        
        headerRow.appendChild(header);
        headerRow.appendChild(closeBtnWrapper);
        
        // Create object list container
        this.objectListContainer = document.createElement('div');
        this.objectListContainer.id = 'objectList';
        
        // Assemble container
        this.container.appendChild(headerRow);
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
     * Expand all collapsible sections
     */
    expandAll() {
        const collapseBtns = this.container.querySelectorAll('.collapse-btn');
        collapseBtns.forEach(btn => {
            const targetId = btn.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            if (targetElement && targetElement.classList.contains('collapsed')) {
                targetElement.classList.remove('collapsed');
                btn.textContent = '-';
            }
        });
    }
    
    /**
     * Collapse all collapsible sections
     */
    collapseAll() {
        const collapseBtns = this.container.querySelectorAll('.collapse-btn');
        collapseBtns.forEach(btn => {
            const targetId = btn.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            if (targetElement && !targetElement.classList.contains('collapsed')) {
                targetElement.classList.add('collapsed');
                btn.textContent = '+';
            }
        });
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
        objectContainer.className = 'object-row';
        
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
        
        // Check if this is a toggleable object by checking its properties
        // Ground objects, models with pipes/panels, pipes, and panels are toggleable
        const isModel = object && (object.pipes || object.panels || 
                                   (object.model && (object.model.singleCuts || object.model.pipes || object.model.panels)) ||
                                   (object.constructor && object.constructor.name && 
                                    (object.constructor.name.includes('Model') || object.constructor.name.includes('Ground'))));
        
        const isPipe = object && object.pipeMesh;
        const isPanel = object && object.panelMesh;
        const isToggable = isModel || isPipe || isPanel || name.includes('Pipe #') || name.includes('Panel #');
        
        // Determine if this object has children for collapse button
        const hasChildElements = this.hasChildren(object);
        
        // Add collapse button if the object has children
        if (hasChildElements) {
            const collapseBtn = document.createElement('span');
            collapseBtn.className = 'collapse-btn';
            collapseBtn.textContent = '+'; // Closed by default
            
            const childListId = `childList-${objectPath.replace(/[\s#]/g, '-').replace(/\//g, '_')}`;
            collapseBtn.setAttribute('data-target', childListId);
            
            collapseBtn.addEventListener('click', () => {
                const targetElement = document.getElementById(childListId);
                if (targetElement) {
                    const isCollapsed = targetElement.classList.contains('collapsed');
                    if (isCollapsed) {
                        targetElement.classList.remove('collapsed');
                        collapseBtn.textContent = '-';
                    } else {
                        targetElement.classList.add('collapsed');
                        collapseBtn.textContent = '+';
                    }
                }
            });
            
            objectContainer.appendChild(collapseBtn);
        } else {
            // Add spacing for alignment if no collapse button
            const spacer = document.createElement('span');
            spacer.style.width = '16px';
            spacer.style.display = 'inline-block';
            spacer.innerHTML = '&nbsp;';
            objectContainer.appendChild(spacer);
        }
        
        if (isToggable) {
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
                    
                    // If this is a parent object with children, update all child checkboxes
                    const hasChildModels = object && (
                        (object.model && object.model.singleCuts) || // For composite models with child SingleCUTs
                        (object.pipes || object.panels) || // For single models with pipes/panels
                        (object.childModels && object.childModels.length > 0) // For any composite model
                    );
                    
                    if (hasChildModels) {
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
        objectLabel.className = 'object-label';
        
        // Make the label also toggle collapse if the object has children
        if (hasChildElements) {
            objectLabel.addEventListener('click', () => {
                const collapseBtn = objectContainer.querySelector('.collapse-btn');
                if (collapseBtn) {
                    collapseBtn.click();
                }
            });
        }
        
        objectContainer.appendChild(objectLabel);
        
        // Add the object container to the list item
        objectItem.appendChild(objectContainer);
        
        // Add child items container if this object has children
        if (hasChildElements) {
            const childList = document.createElement('ul');
            childList.style.paddingLeft = '20px';
            childList.style.listStyle = 'none';
            
            // Assign an ID to the child list for collapse functionality
            childList.id = `childList-${objectPath.replace(/[\s#]/g, '-').replace(/\//g, '_')}`;
            
            // Set the child list to be collapsed by default
            childList.classList.add('collapsed');
            
            // Determine the appropriate way to add children based on object properties
            if (object.model && object.model.singleCuts && object.model.singleCuts.length > 0) {
                // For composite models with SingleCUTs (like LayerOneRing)
                this.addCompositeModelChildren(childList, object, name);
            } else if (object.pipes || object.panels) {
                // For SingleCUT models with pipes and panels
                this.addModelChildren(childList, object, name);
            } else if (object.children) {
                // For generic objects with children
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
        
        // Check if this is a pipe or panel in a composite model
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
                
                // For any parent that contains singleCuts array, check if element is permanently hidden
                const parent = path.includes('/') ? this.findParentObject(path) : null;
                
                if (parent && parent.model && typeof parent.model.isElementPermanentlyHidden === 'function') {
                    return parent.model.isElementPermanentlyHidden(modelIndex, elementType, elementIndex);
                }
            }
        }
        
        return false;
    }
    
    /**
     * Find the parent object for a given path
     * @param {string} path - Path to find parent for
     * @returns {Object} - The parent object or null
     */
    findParentObject(path) {
        if (!path.includes('/')) return null;
        
        const parentPath = path.substring(0, path.lastIndexOf('/'));
        return this.sceneObjects[parentPath] || 
               Object.values(this.sceneObjects).find(obj => 
                  obj.model && obj.model.singleCuts && obj.model.singleCuts.length > 0);
    }
    
    /**
     * Add children for any model with pipes and panels
     * @param {HTMLElement} parentElement - Parent element to add to
     * @param {Object} model - The model with pipes and panels
     * @param {string} parentName - Name of the parent model
     */
    addModelChildren(parentElement, model, parentName) {
        // Add all pipes
        if (model.pipes && model.pipes.length > 0) {
            model.pipes.forEach((pipe, index) => {
                // Use qualified name that includes parent reference
                const pipeName = parentName ? `${parentName}/Pipe #${index + 1}` : `Pipe #${index + 1}`;
                const pipeItem = this.createObjectListItem(pipeName, pipe, model);
                parentElement.appendChild(pipeItem);
            });
        }
        
        // Add panels
        if (model.panels && model.panels.length > 0) {
            model.panels.forEach((panel, index) => {
                // Use qualified name that includes parent reference
                const panelName = parentName ? `${parentName}/Panel #${index + 1}` : `Panel #${index + 1}`;
                const panelItem = this.createObjectListItem(panelName, panel, model);
                parentElement.appendChild(panelItem);
            });
        }
    }
    
    /**
     * Add children for a composite model with SingleCUTs
     * @param {HTMLElement} parentElement - Parent element to add to
     * @param {Object} compositeModel - The composite model
     * @param {string} parentName - Name of the parent model
     */
    addCompositeModelChildren(parentElement, compositeModel, parentName) {
        // Add all SingleCUTs
        if (compositeModel.model && compositeModel.model.singleCuts && compositeModel.model.singleCuts.length > 0) {
            compositeModel.model.singleCuts.forEach((singleCut, index) => {
                const singleCutName = `Single CUT #${index + 1}`;
                const singleCutItem = this.createObjectListItem(singleCutName, singleCut, compositeModel);
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
        // Set this to true only when debugging SceneEditor visibility issues
        const DEBUG_VISIBILITY = false;
        
        const log = (message) => {
            if (DEBUG_VISIBILITY) {
                console.log(message);
            }
        };
        
        if (!object) {
            log(`[SceneEditor] Object is null or undefined`);
            return false;
        }

        // Priority 1: Check if the object is a model with an isVisible method
        if (typeof object.isVisible === 'function') {
            const visibility = object.isVisible();
            log(`[SceneEditor] Object has isVisible() method: ${visibility}`);
            return visibility;
        }
        
        // Priority 2: Check if the object has a model property with an isVisible method
        if (object.model && typeof object.model.isVisible === 'function') {
            const visibility = object.model.isVisible();
            log(`[SceneEditor] Object.model has isVisible() method: ${visibility}`);
            return visibility;
        }
        
        // Priority 3: Check if the object has a rootNode with an isEnabled method
        if (object.rootNode && typeof object.rootNode.isEnabled === 'function') {
            const enabled = object.rootNode.isEnabled();
            log(`[SceneEditor] Object has rootNode with isEnabled method: ${enabled}`);
            return enabled;
        }
        
        // Priority 4: For direct mesh access
        if (object.mesh && typeof object.mesh.isVisible === 'boolean') {
            const visibility = object.mesh.isVisible;
            log(`[SceneEditor] Object has mesh with isVisible property: ${visibility}`);
            return visibility;
        }
        
        // Priority 5: For PipeModel
        if (object.pipeMesh && typeof object.pipeMesh.isVisible === 'boolean') {
            const visibility = object.pipeMesh.isVisible;
            log(`[SceneEditor] Object has pipeMesh with isVisible property: ${visibility}`);
            return visibility;
        }
        
        // Priority 6: For PanelModel
        if (object.panelMesh && typeof object.panelMesh.isVisible === 'boolean') {
            const visibility = object.panelMesh.isVisible;
            log(`[SceneEditor] Object has panelMesh with isVisible property: ${visibility}`);
            return visibility;
        }
        
        // If we can't determine visibility, default to true
        log(`[SceneEditor] Unable to determine visibility, defaulting to true`);
        return true;
    }
    
    /**
     * Recursively set visibility on an object and all its children
     * @param {Object} object - The object to set visibility on
     * @param {boolean} isVisible - Whether the object should be visible
     * @param {string} path - Optional path to the object for checking permanent hidden status
     */
    setObjectVisibility(object, isVisible, path = '') {
        if (!object) {
            console.log(`[SceneEditor] Object is null or undefined for path: ${path}`);
            return;
        }
        
        // Skip if this is a permanently hidden element
        if (path && this.isElementPermanentlyHidden(path, object)) {
            console.log(`[SceneEditor] Skipping permanently hidden element: ${path}`);
            return;
        }
        
        console.log(`[SceneEditor] Setting visibility for ${path} to ${isVisible ? 'visible' : 'hidden'}`);
        
        // For composite objects with model property
        if (object.model && typeof object.model.setVisible === 'function') {
            console.log(`[SceneEditor] Setting visibility via object.model.setVisible for ${path}`);
            object.model.setVisible(isVisible);
            
            // Verify visibility was set correctly
            if (typeof object.model.isVisible === 'function') {
                console.log(`[SceneEditor] After setting, object.model.isVisible(): ${object.model.isVisible()}`);
            }
            
            return; // Return early as we've handled this object
        }
        
        // Set visibility on this object
        if (typeof object.setVisible === 'function') {
            // Use the object's setVisible method (BaseModel/CompositeModel)
            console.log(`[SceneEditor] Using setVisible method for ${object.constructor ? object.constructor.name : 'object'}`, isVisible);
            object.setVisible(isVisible);
            
            // Verify visibility was set correctly
            if (typeof object.isVisible === 'function') {
                console.log(`[SceneEditor] After setting, object.isVisible(): ${object.isVisible()}`);
            }
        } else if (object.rootNode && object.rootNode.setEnabled) {
            // Set enabled state on the root node
            console.log(`[SceneEditor] Setting root node enabled state to ${isVisible}`);
            object.rootNode.setEnabled(isVisible);
            
            // Verify enabled state was set correctly
            if (object.rootNode.isEnabled) {
                console.log(`[SceneEditor] After setting, rootNode.isEnabled(): ${object.rootNode.isEnabled()}`);
            }
        } else if (object.mesh && object.mesh.isVisible !== undefined) {
            // Set visibility on the mesh
            console.log(`[SceneEditor] Setting mesh visibility to ${isVisible}`);
            object.mesh.isVisible = isVisible;
            
            // Verify visibility was set correctly
            console.log(`[SceneEditor] After setting, mesh.isVisible: ${object.mesh.isVisible}`);
        } else if (object.pipeMesh && object.pipeMesh.isVisible !== undefined) {
            // Set visibility on pipe mesh
            console.log(`[SceneEditor] Setting pipe mesh visibility to ${isVisible}`);
            object.pipeMesh.isVisible = isVisible;
            
            // Verify visibility was set correctly
            console.log(`[SceneEditor] After setting, pipeMesh.isVisible: ${object.pipeMesh.isVisible}`);
        } else if (object.panelMesh && object.panelMesh.isVisible !== undefined) {
            // Set visibility on panel mesh
            console.log(`[SceneEditor] Setting panel mesh visibility to ${isVisible}`);
            object.panelMesh.isVisible = isVisible;
            
            // Ensure the parent node is also visible/invisible
            if (object.rootNode) {
                console.log(`[SceneEditor] Setting panel root node enabled state to ${isVisible}`);
                object.rootNode.setEnabled(isVisible);
            }
            
            // Force the panel mesh to update its visibility
            object.panelMesh.refreshBoundingInfo();
            
            // Verify visibility was set correctly
            console.log(`[SceneEditor] After setting, panelMesh.isVisible: ${object.panelMesh.isVisible}`);
        } else {
            console.log(`[SceneEditor] No visibility method found for object at path: ${path}`);
            console.log(`[SceneEditor] Object:`, object);
        }
        
        // Process children based on object type
        console.log(`[SceneEditor] Processing children of ${path}`);
        
        // 1. Handle LayerOneRing/LayerOneStarModel case
        if (object.model && object.model.singleCuts) {
            // Process all SingleCut models
            console.log(`[SceneEditor] Processing ${object.model.singleCuts.length} singleCuts for ${path}`);
            object.model.singleCuts.forEach((singleCut, index) => {
                // Build the path for the SingleCUT
                const singleCutPath = path ? `${path}/Single CUT #${index + 1}` : `Single CUT #${index + 1}`;
                this.setObjectVisibility(singleCut, isVisible, singleCutPath);
            });
        }
        
        // 2. Handle CompositeModel child models
        if (object.childModels && Array.isArray(object.childModels)) {
            console.log(`[SceneEditor] Processing ${object.childModels.length} childModels for ${path}`);
            object.childModels.forEach((childModel, index) => {
                const childPath = path ? `${path}/ChildModel #${index + 1}` : `ChildModel #${index + 1}`;
                this.setObjectVisibility(childModel, isVisible, childPath);
            });
        }
        
        // 3. Handle SingleCutModel pipes and panels
        if (object.pipes && Array.isArray(object.pipes)) {
            console.log(`[SceneEditor] Processing ${object.pipes.length} pipes for ${path}`);
            object.pipes.forEach((pipe, index) => {
                // Build the path for the pipe
                const pipePath = path ? `${path}/Pipe #${index + 1}` : `Pipe #${index + 1}`;
                this.setObjectVisibility(pipe, isVisible, pipePath);
            });
        }
        
        if (object.panels && Array.isArray(object.panels)) {
            console.log(`[SceneEditor] Processing ${object.panels.length} panels for ${path}`);
            object.panels.forEach((panel, index) => {
                // Build the path for the panel
                const panelPath = path ? `${path}/Panel #${index + 1}` : `Panel #${index + 1}`;
                this.setObjectVisibility(panel, isVisible, panelPath);
            });
        }
        
        // 4. Handle generic children object
        if (object.children && typeof object.children === 'object') {
            const childCount = Object.keys(object.children).length;
            console.log(`[SceneEditor] Processing ${childCount} generic children for ${path}`);
            Object.entries(object.children).forEach(([key, child]) => {
                const childPath = path ? `${path}/${key}` : key;
                this.setObjectVisibility(child, isVisible, childPath);
            });
        }
    }
    
    /**
     * Toggle visibility of an object by path
     * @param {string} path - Path to the object
     * @param {Object} object - The object to toggle
     * @param {boolean} isVisible - Whether the object should be visible
     */
    toggleObjectVisibility(path, object, isVisible) {
        console.log(`[SceneEditor] Toggling visibility of "${path}" to ${isVisible ? 'visible' : 'hidden'}`);
        
        // Handle the special case for 'Layer One Star' explicitly
        if (path === 'Layer One Star' || path.startsWith('Layer One Star/')) {
            console.log(`[SceneEditor] Special handling for Layer One Star object: `, object);
            
            // Log more details about the object
            if (object.model) {
                console.log(`[SceneEditor] Layer One Star model type: ${object.model.constructor.name}`);
                console.log(`[SceneEditor] Initial visibility state: ${object.model.isVisible()}`);
            }
        }
        
        // Set visibility on object
        this.setObjectVisibility(object, isVisible, path);
        
        // Update the checkbox state
        if (this.checkboxElements[path]) {
            this.checkboxElements[path].element.checked = isVisible;
        }
        
        // Now check the visibility state to verify it was set correctly
        if (path === 'Layer One Star' || path.startsWith('Layer One Star/')) {
            let currentVisibility = this.getObjectVisibility(object);
            console.log(`[SceneEditor] After toggle, Layer One Star visibility: ${currentVisibility}`);
            
            // Also check the visibility of the model property if it exists
            if (object.model) {
                console.log(`[SceneEditor] After toggle, model.isVisible(): ${object.model.isVisible()}`);
                // Check if the rootNode is enabled
                if (object.model.rootNode) {
                    console.log(`[SceneEditor] After toggle, model.rootNode.isEnabled(): ${object.model.rootNode.isEnabled()}`);
                }
            }
        }
    }
    
    /**
     * Update all child checkboxes when a parent checkbox is toggled
     * @param {string} parentPath - Path of the parent object
     * @param {boolean} isChecked - Whether the parent checkbox is checked
     */
    updateNestedCheckboxes(parentPath, isChecked) {
        console.log(`Updating nested checkboxes for ${parentPath} to ${isChecked}`);
        
        // Find the parent object
        const parentObj = this.checkboxElements[parentPath]?.object;
        
        if (!parentObj) return;
        
        // Check if parent has SingleCUTs (composite model like Layer One Ring)
        const hasChildModels = parentObj.model && parentObj.model.singleCuts && parentObj.model.singleCuts.length > 0;
        
        // For composite models with SingleCUTs
        if (hasChildModels) {
            for (const [path, checkboxInfo] of Object.entries(this.checkboxElements)) {
                // Skip permanently hidden elements
                if (checkboxInfo.isPermanentlyHidden) {
                    continue;
                }
                
                // Match any path that starts with "Single CUT #" (indicates it's part of a composite model)
                if (path.startsWith('Single CUT #')) {
                    console.log(`Setting child checkbox for ${path} to ${isChecked}`);
                    checkboxInfo.element.checked = isChecked;
                    
                    // Also update the actual object visibility
                    this.toggleObjectVisibility(path, checkboxInfo.object, isChecked);
                }
            }
        }
        // For SingleCUT model or other model with direct pipes/panels
        else if (parentObj.pipes || parentObj.panels) {
            for (const [path, checkboxInfo] of Object.entries(this.checkboxElements)) {
                // Skip permanently hidden elements
                if (checkboxInfo.isPermanentlyHidden) {
                    continue;
                }
                
                // Match only paths that are direct children (pipes/panels) of this parent
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