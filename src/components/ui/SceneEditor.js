/**
 * Scene Editor component for displaying scene objects and toggling visibility
 */
export class SceneEditor {
    constructor(scene, models) {
        this.scene = scene;
        
        // Convert array of models to sceneObjects format for backward compatibility
        this.sceneObjects = {};
        if (Array.isArray(models)) {
            models.forEach(model => {
                if (model) {
                    const name = model.getName ? model.getName() : 
                                (model.constructor ? model.constructor.name : 'Unknown Model');
                    
                    // Create entry in sceneObjects
                    this.sceneObjects[name] = {
                        model: model,
                        children: {}
                    };
                    
                    // Get children from model if it's a composite model or has getChildren method
                    if (model.getChildren && typeof model.getChildren === 'function') {
                        const children = model.getChildren();
                        
                        // Add each child to the hierarchy
                        children.forEach(child => {
                            if (child) {
                                const childName = child.getName ? child.getName() : 
                                            (child.constructor ? child.constructor.name : 'Unknown Child');
                                            
                                this.sceneObjects[name].children[childName] = {
                                    model: child
                                };
                            }
                        });
                    }
                }
            });
        } else {
            // If not an array, assume it's already in sceneObjects format
            this.sceneObjects = models || {};
        }
        
        this.isVisible = false;
        this.lastUpdateTime = 0;
        this.updateInterval = 500; // Update every 500ms when visible
        
        // Create UI elements
        this.createUI();
        
        // Store checkbox elements for updating
        this.checkboxElements = {};
        
        // Map to store object IDs for easier model reference
        this.objectIdMap = {};
        
        // Map to track duplicate model names for display purposes
        this.nameCountMap = {};

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
        const childContainers = this.container.querySelectorAll('.object-children');
        childContainers.forEach(container => {
            container.classList.remove('collapsed');
            
            // Find the associated collapse button and update its text
            const parentItem = container.parentElement;
            const collapseBtn = parentItem.querySelector('.collapse-btn');
            if (collapseBtn) {
                collapseBtn.textContent = '-';
            }
        });
    }
    
    /**
     * Collapse all collapsible sections
     */
    collapseAll() {
        const childContainers = this.container.querySelectorAll('.object-children');
        childContainers.forEach(container => {
            container.classList.add('collapsed');
            
            // Find the associated collapse button and update its text
            const parentItem = container.parentElement;
            const collapseBtn = parentItem.querySelector('.collapse-btn');
            if (collapseBtn) {
                collapseBtn.textContent = '+';
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
            
            // Apply initial visibility states based on isVisible property
            for (const [name, object] of Object.entries(this.sceneObjects)) {
                if (object.isVisible === false && this.checkboxElements[name]) {
                    this.checkboxElements[name].element.checked = false;
                    this.toggleObjectVisibility(name, object, false);
                }
            }
            
            // Start with all nodes collapsed for better usability
            this.collapseAll();
        }
    }
    
    /**
     * Render the scene objects in a hierarchical structure
     */
    renderSceneObjects() {
        this.objectListContainer.innerHTML = '';
        
        // Reset name counters for root level
        this.nameCountMap = {};
        
        // Create a tree of objects
        const objectTree = document.createElement('div');
        objectTree.className = 'scene-objects-tree';
        
        // Add each top-level object
        for (const [name, object] of Object.entries(this.sceneObjects)) {
            const objectItem = this.createObjectListItem(name, object);
            objectTree.appendChild(objectItem);
            
            // If the object has isVisible explicitly set to false, update checkbox
            if (object.isVisible === false && this.checkboxElements[name]) {
                this.checkboxElements[name].element.checked = false;
                this.toggleObjectVisibility(name, object, false);
            }
        }
        
        this.objectListContainer.appendChild(objectTree);
    }
    
    /**
     * Get a display name for an object
     * @param {string} defaultName - The default name for the object
     * @param {Object} object - The object to get a name for
     * @param {string} parentPath - Path of the parent object
     * @returns {string} A display name for the object
     */
    getDisplayName(defaultName, object, parentPath = '') {
        let displayName = defaultName;
        
        // If object has a getName method, use it
        if (object && typeof object.getName === 'function') {
            displayName = object.getName();
        } else if (object && object.model && typeof object.model.getName === 'function') {
            // If object has a model with getName method, use that
            displayName = object.model.getName();
        }
        
        // Skip numbering for top-level items or if there's no parent path
        if (!parentPath) {
            return displayName;
        }
        
        // Create a key combining parent path and display name to track duplicates within same parent
        const nameKey = `${parentPath}/${displayName}`;
        
        // Initialize counter for this name if it doesn't exist
        if (!this.nameCountMap[nameKey]) {
            this.nameCountMap[nameKey] = {
                count: 0,
                instances: []
            };
        }
        
        // Generate a unique instance key for this specific object
        const instanceKey = object.id || 
                          (object.model && object.model.id) || 
                          (object.uniqueId || Math.random().toString(36).substr(2, 9));
        
        // Check if we've already processed this exact object
        if (!this.nameCountMap[nameKey].instances.includes(instanceKey)) {
            // Increment counter for this name
            this.nameCountMap[nameKey].count++;
            
            // Add this instance to our tracking
            this.nameCountMap[nameKey].instances.push(instanceKey);
        }
        
        // Get the occurrence number for this specific instance
        const instanceIndex = this.nameCountMap[nameKey].instances.indexOf(instanceKey);
        const occurrenceNumber = instanceIndex + 1;
        
        // Only add a number if there are multiple items with this name at this level
        if (this.nameCountMap[nameKey].count > 1) {
            displayName = `${displayName} #${occurrenceNumber}`;
        }
        
        return displayName;
    }
    
    /**
     * Create an object list item, including children
     * @param {string} name - Name of the object
     * @param {Object} object - The object to create an item for
     * @param {Object} [parent] - Parent object (optional)
     * @param {string} [parentPath=''] - Path of the parent object
     * @returns {HTMLElement} - The created list item
     */
    createObjectListItem(name, object, parent = null, parentPath = '') {
        // Get a display name based on object type if it has getName method
        let displayName = this.getDisplayName(name, object, parentPath);
        
        // Keep the original path for ID purposes
        const objectPath = parentPath ? `${parentPath}/${name}` : name;
        
        const listItem = document.createElement('div');
        listItem.className = 'scene-object-item';
        listItem.style.marginLeft = '15px';
        listItem.style.marginBottom = '8px';
        
        const objectRow = document.createElement('div');
        objectRow.className = 'object-row';
        
        // Check if the object has children to determine if we need a collapse button
        const hasChildren = this.hasChildren(object);
        
        // Create collapse button for items with children
        if (hasChildren) {
            const collapseBtn = document.createElement('span');
            collapseBtn.className = 'collapse-btn';
            collapseBtn.textContent = '-';
            collapseBtn.title = 'Collapse/Expand';
            collapseBtn.onclick = (e) => {
                e.stopPropagation();
                const childContainer = listItem.querySelector(':scope > .object-children');
                if (childContainer) {
                    const isCollapsed = childContainer.classList.contains('collapsed');
                    childContainer.classList.toggle('collapsed');
                    collapseBtn.textContent = isCollapsed ? '-' : '+';
                }
            };
            objectRow.appendChild(collapseBtn);
        } else {
            // Add a spacer for items without a collapse button for proper alignment
            const spacer = document.createElement('span');
            spacer.style.display = 'inline-block';
            spacer.style.width = '16px';
            spacer.style.marginRight = '5px';
            objectRow.appendChild(spacer);
        }
        
        // Create checkbox for visibility toggle
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.style.marginRight = '5px';
        checkbox.checked = this.getObjectVisibility(object);
        
        // Handle special cases for visibility check
        if (typeof checkbox.checked !== 'boolean') {
            checkbox.checked = true;
        }
        
        // Get the object ID if available for more reliable identification
        const objectId = object.id || (object.model && object.model.id) || null;
        
        // Set data attributes for tracking
        checkbox.setAttribute('data-object-path', objectPath);
        if (objectId) {
            checkbox.setAttribute('data-object-id', objectId);
            // Store the object in our ID map
            this.objectIdMap[objectId] = object;
        }
        
        // Add an event listener to toggle visibility
        checkbox.addEventListener('change', () => {
            const isChecked = checkbox.checked;
            const path = checkbox.getAttribute('data-object-path');
            const objId = checkbox.getAttribute('data-object-id');
            
            // Store the checkbox for state tracking
            this.checkboxElements[path] = {
                element: checkbox,
                object: object,
                objectId: objId
            };
            
            // Toggle visibility
            this.toggleObjectVisibility(path, object, isChecked, objId);
            
            // Also update nested checkboxes
            this.updateNestedCheckboxes(path, isChecked);
        });
        
        // Store the checkbox for state tracking
        this.checkboxElements[objectPath] = {
            element: checkbox,
            object: object,
            objectId: objectId
        };
        
        objectRow.appendChild(checkbox);
        
        // Create label for the object with info button
        const labelContainer = document.createElement('span');
        labelContainer.style.display = 'flex';
        labelContainer.style.alignItems = 'center';
        labelContainer.style.flexGrow = '1';
        
        const label = document.createElement('span');
        label.className = 'object-label';
        label.textContent = displayName; // Use the display name here
        label.style.flexGrow = '1';
        
        // Truncate long names with ellipsis
        label.style.overflow = 'hidden';
        label.style.textOverflow = 'ellipsis';
        label.style.whiteSpace = 'nowrap';
        label.style.maxWidth = '200px';
        
        // Highlight permanently hidden elements
        if (this.isElementPermanentlyHidden(objectPath, object)) {
            label.style.color = '#999';
            label.style.textDecoration = 'line-through';
            label.title = 'This element is permanently hidden';
        }
        
        // Add ID as tooltip if available
        if (objectId) {
            label.title = `ID: ${objectId}\n${label.title || ''}`;
        }
        
        // Add info button for debugging
        const infoButton = document.createElement('button');
        infoButton.textContent = 'i';
        infoButton.style.marginLeft = '5px';
        infoButton.style.width = '16px';
        infoButton.style.height = '16px';
        infoButton.style.background = '#333';
        infoButton.style.color = '#fff';
        infoButton.style.border = '1px solid #555';
        infoButton.style.borderRadius = '50%';
        infoButton.style.cursor = 'pointer';
        infoButton.style.fontSize = '10px';
        infoButton.style.lineHeight = '1';
        infoButton.style.padding = '0';
        infoButton.title = 'Show info';
        
        // Info button click handler
        infoButton.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Invoke the logModelInfo function if it exists
            if (typeof this.logModelInfo === 'function') {
                console.group(`Info for "${displayName}"`);
                this.logModelInfo(object);
                console.groupEnd();
            } else {
                console.group(`Info for "${displayName}"`);
                console.log('Object:', object);
                if (object && object.constructor) {
                    console.log('Type:', object.constructor.name);
                }
                if (objectId) {
                    console.log('ID:', objectId);
                }
                console.groupEnd();
            }
        });
        
        labelContainer.appendChild(label);
        labelContainer.appendChild(infoButton);
        objectRow.appendChild(labelContainer);
        
        listItem.appendChild(objectRow);
        
        // Create container for children
        if (hasChildren) {
            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'object-children';
            childrenContainer.style.marginLeft = '15px';
            
            // Add panels and pipes if they exist
            if (object.pipes || object.panels) {
                this.addModelChildren(childrenContainer, object, objectPath);
            }
            
            // If the object is a composite model with SingleCUTs, add them
            if (object.model && object.model.singleCuts) {
                this.addCompositeModelChildren(childrenContainer, object, objectPath);
            }
            
            // Add regular children for objects with a children property
            if (object.children && Object.keys(object.children).length > 0) {
                this.addChildrenObjects(childrenContainer, object.children, objectPath);
            }
            
            listItem.appendChild(childrenContainer);
        }
        
        return listItem;
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
        
        // If the object has a method to determine if it's permanently hidden, use that
        if (object && typeof object.isPermanentlyHidden === 'function') {
            return object.isPermanentlyHidden();
        }
        
        // If object has a model with the method, use that
        if (object && object.model && typeof object.model.isPermanentlyHidden === 'function') {
            return object.model.isPermanentlyHidden();
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
     * @param {string} parentPath - Path of the parent model
     */
    addModelChildren(parentElement, model, parentPath) {
        // Check for pipes
        if (model.pipes && model.pipes.length > 0) {
            // Get all pipe names first to determine if we need numbering
            const pipeDisplayNames = model.pipes.map(pipe => {
                return pipe && typeof pipe.getName === 'function' ? pipe.getName() : "Pipe";
            });
            
            // Count occurrences of each name
            const pipeNameCounts = {};
            pipeDisplayNames.forEach(name => {
                pipeNameCounts[name] = (pipeNameCounts[name] || 0) + 1;
            });
            
            // Add all pipes
            model.pipes.forEach((pipe, index) => {
                const pipeName = `Pipe #${index + 1}`;
                const pipeItem = this.createObjectListItem(pipeName, pipe, model, parentPath);
                parentElement.appendChild(pipeItem);
            });
        }
        
        // Check for panels
        if (model.panels && model.panels.length > 0) {
            // Get all panel names first to determine if we need numbering
            const panelDisplayNames = model.panels.map(panel => {
                return panel && typeof panel.getName === 'function' ? panel.getName() : "Panel";
            });
            
            // Count occurrences of each name
            const panelNameCounts = {};
            panelDisplayNames.forEach(name => {
                panelNameCounts[name] = (panelNameCounts[name] || 0) + 1;
            });
            
            // Add all panels
            model.panels.forEach((panel, index) => {
                const panelName = `Panel #${index + 1}`;
                const panelItem = this.createObjectListItem(panelName, panel, model, parentPath);
                parentElement.appendChild(panelItem);
            });
        }
    }
    
    /**
     * Add children for a composite model with SingleCUTs
     * @param {HTMLElement} parentElement - Parent element to add to
     * @param {Object} compositeModel - The composite model
     * @param {string} parentPath - Path of the parent model
     */
    addCompositeModelChildren(parentElement, compositeModel, parentPath) {
        // Check if we have SingleCUTs to add
        if (!compositeModel.model || !compositeModel.model.singleCuts || !compositeModel.model.singleCuts.length) {
            return;
        }
        
        // Get all child names to determine if we need numbering
        const childModels = compositeModel.model.singleCuts;
        const displayNames = {};
        
        // First pass: collect names
        childModels.forEach(model => {
            const displayName = model && typeof model.getName === 'function' ? 
                model.getName() : "CUT";
            
            // Count occurrences
            displayNames[displayName] = (displayNames[displayName] || 0) + 1;
        });
        
        // Second pass: create items with appropriate naming
        childModels.forEach((singleCut, index) => {
            // Use qualified name with index for path
            const singleCutName = `Single CUT #${index + 1}`;
            const singleCutItem = this.createObjectListItem(singleCutName, singleCut, compositeModel, parentPath);
            parentElement.appendChild(singleCutItem);
        });
    }
    
    /**
     * Add generic children objects
     * @param {HTMLElement} parentElement - Parent element to add to
     * @param {Object} children - Children objects
     * @param {string} parentPath - Path of the parent model
     */
    addChildrenObjects(parentElement, children, parentPath) {
        // Get display names for all children to detect duplicates
        const displayNames = {};
        
        // First pass: collect names and count duplicates
        Object.entries(children).forEach(([key, value]) => {
            // Get the display name that would be used
            const childDisplayName = value && typeof value.getName === 'function' ? 
                value.getName() : 
                (value && value.model && typeof value.model.getName === 'function' ? 
                    value.model.getName() : key);
            
            // Count occurrences
            displayNames[childDisplayName] = (displayNames[childDisplayName] || 0) + 1;
        });
        
        // Second pass: create items with appropriate naming
        Object.entries(children).forEach(([key, value]) => {
            // Create item with the raw key (the display logic will handle the numbering if needed)
            const childItem = this.createObjectListItem(key, value, null, parentPath);
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
        
        // Check for explicit isVisible property (for object groups in our scene structure)
        if (object.isVisible === false) {
            log(`[SceneEditor] Object has explicit isVisible property set to false`);
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
     * Toggle visibility of an object by path
     * @param {string} path - Path to the object
     * @param {Object} object - The object to toggle
     * @param {boolean} isVisible - Whether the object should be visible
     * @param {string} objectId - Optional object ID for more reliable identification
     */
    toggleObjectVisibility(path, object, isVisible, objectId = null) {
        console.log(`[SceneEditor] Toggling visibility of "${path}" ${objectId ? `(ID: ${objectId})` : ''} to ${isVisible ? 'visible' : 'hidden'}`);
        
        // If we have an object ID, use it to verify the correct object
        if (objectId && this.objectIdMap[objectId]) {
            // Use the object from our ID map to ensure we're using the correct reference
            object = this.objectIdMap[objectId];
            console.log(`[SceneEditor] Using object from ID map for ${objectId}`);
        }
        
        // Set visibility on object using the standard approach
        this.setObjectVisibility(object, isVisible, path);
        
        // Update the checkbox state
        if (this.checkboxElements[path]) {
            this.checkboxElements[path].element.checked = isVisible;
        }
    }
    
    /**
     * Update all child checkboxes when a parent checkbox is toggled
     * @param {string} parentPath - Path of the parent object
     * @param {boolean} isChecked - Whether the parent checkbox is checked
     */
    updateNestedCheckboxes(parentPath, isChecked) {
        console.log(`Updating nested checkboxes for ${parentPath} to ${isChecked}`);
        
        // Find the parent object and ID
        const parentObj = this.checkboxElements[parentPath]?.object;
        const parentId = this.checkboxElements[parentPath]?.objectId;
        
        if (!parentObj) return;
        
        // Check if parent has children through its model property
        const hasModelWithChildren = parentObj.model && 
            ((parentObj.model.childModels && parentObj.model.childModels.length > 0) || 
             (parentObj.model.children && Object.keys(parentObj.model.children).length > 0));
        
        // For all cases, update any checkbox whose path starts with the parent path and a slash
        // This ensures we only select direct children of this parent
        for (const [path, checkboxInfo] of Object.entries(this.checkboxElements)) {
            // Skip permanently hidden elements
            if (checkboxInfo.isPermanentlyHidden) {
                continue;
            }
            
            // Match paths that are direct children of this parent
            if (path.startsWith(parentPath + '/')) {
                console.log(`Setting child checkbox for ${path} to ${isChecked}`);
                checkboxInfo.element.checked = isChecked;
                
                // Also update the actual object visibility
                // Use object ID if available for more reliable identification
                this.toggleObjectVisibility(
                    path, 
                    checkboxInfo.object, 
                    isChecked, 
                    checkboxInfo.objectId
                );
            }
            
            // Check for parent-child relationship using object IDs
            // This catches cases where path-based checks might miss due to restructuring
            if (parentId && parentObj.childModels) {
                const childObj = checkboxInfo.object;
                const isChild = childObj && parentObj.childModels.some(child => 
                    child.id === childObj.id || 
                    (childObj.model && child.id === childObj.model.id)
                );
                
                if (isChild) {
                    console.log(`Setting child checkbox for ${path} (matched by ID) to ${isChecked}`);
                    checkboxInfo.element.checked = isChecked;
                    
                    // Also update the actual object visibility
                    this.toggleObjectVisibility(
                        path, 
                        checkboxInfo.object, 
                        isChecked, 
                        checkboxInfo.objectId
                    );
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
                    // Use the ID map object if available for more consistent references
                    const objToCheck = (checkboxInfo.objectId && this.objectIdMap[checkboxInfo.objectId]) 
                        ? this.objectIdMap[checkboxInfo.objectId] 
                        : checkboxInfo.object;
                    
                    const isVisible = this.getObjectVisibility(objToCheck);
                    
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
        
        // Get object ID if available
        const objectId = object.id || (object.model && object.model.id);
        
        // Skip if this is a permanently hidden element
        if (path && this.isElementPermanentlyHidden(path, object)) {
            console.log(`[SceneEditor] Skipping permanently hidden element: ${path}${objectId ? ` (ID: ${objectId})` : ''}`);
            return;
        }
        
        console.log(`[SceneEditor] Setting visibility for ${path}${objectId ? ` (ID: ${objectId})` : ''} to ${isVisible ? 'visible' : 'hidden'}`);
        
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
        console.log(`[SceneEditor] Processing children of ${path}${objectId ? ` (ID: ${objectId})` : ''}`);
        
        // Process child models using IDs for more reliable identification
        if (object.childModels && Array.isArray(object.childModels)) {
            console.log(`[SceneEditor] Processing ${object.childModels.length} childModels for ${path}`);
            object.childModels.forEach((childModel, index) => {
                // Use ID in the child path for better identification
                const childPath = childModel.id 
                    ? `${path}/ChildModel_${childModel.id.substring(0, 8)}`
                    : `${path}/ChildModel #${index + 1}`;
                    
                this.setObjectVisibility(childModel, isVisible, childPath);
            });
        }
        
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
}