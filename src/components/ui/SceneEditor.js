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

        // Store checkbox elements for updating
        this.checkboxElements = {};

        // Flag to prevent update loops
        this.isUpdating = false;
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
            // Determine the initial checked state
            if (name === 'Ground #1') {
                toggleCheckbox.checked = object.mesh && object.mesh.isVisible;
            } else if (name === 'Seven CUTs #1') {
                // Check if any SingleCUT is visible
                toggleCheckbox.checked = object.model && object.model.singleCuts && 
                                        object.model.singleCuts.length > 0 && 
                                        object.model.singleCuts[0].pipes && 
                                        object.model.singleCuts[0].pipes[0].pipeMesh && 
                                        object.model.singleCuts[0].pipes[0].pipeMesh.isVisible;
            } else if (name.startsWith('Single CUT #')) {
                // Check if the pipes are visible
                toggleCheckbox.checked = object.pipes && object.pipes.length > 0 && 
                                         object.pipes[0].pipeMesh && 
                                         object.pipes[0].pipeMesh.isVisible;
            } else if (name.startsWith('Pipe #')) {
                toggleCheckbox.checked = object.pipeMesh && object.pipeMesh.isVisible;
            } else if (name.startsWith('Panel #')) {
                toggleCheckbox.checked = object.panelMesh && object.panelMesh.isVisible;
            }
            
            // Add event listener
            toggleCheckbox.addEventListener('change', (e) => {
                this.toggleObjectVisibility(name, object, e.target.checked);
                
                // If this is a parent object, update all child checkboxes
                if (name === 'Seven CUTs #1') {
                    this.updateNestedCheckboxes(name, e.target.checked);
                } else if (name.startsWith('Single CUT #')) {
                    this.updateNestedCheckboxes(name, e.target.checked);
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
     * Add children for the SevenCuts model
     * @param {HTMLElement} parentElement - Parent element to add to
     * @param {Object} sevenCutsModel - The Seven CUTs model
     */
    addSevenCutsChildren(parentElement, sevenCutsModel) {
        // Add each SingleCUT as a child
        if (sevenCutsModel.model && sevenCutsModel.model.singleCuts) {
            sevenCutsModel.model.singleCuts.forEach((singleCut, index) => {
                const singleCutItem = this.createObjectListItem(`Single CUT #${index + 1}`, singleCut);
                parentElement.appendChild(singleCutItem);
            });
        } else if (sevenCutsModel.children) {
            // If children are already provided in the object structure
            this.addChildrenObjects(parentElement, sevenCutsModel.children);
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
            (object.model && object.model.singleCuts && object.model.singleCuts.length > 0)
        );
    }
    
    /**
     * Update all nested checkboxes under a parent
     * @param {string} parentName - Name of the parent object
     * @param {boolean} isChecked - Whether the checkboxes should be checked
     */
    updateNestedCheckboxes(parentName, isChecked) {
        if (parentName === 'Seven CUTs #1') {
            const sevenCuts = this.sceneObjects['Seven CUTs #1'];
            
            // Update all SingleCUT checkboxes
            if (sevenCuts) {
                sevenCuts.model.singleCuts.forEach((singleCut, index) => {
                    const singleCutName = `Single CUT #${index + 1}`;
                    if (this.checkboxElements[singleCutName]) {
                        this.checkboxElements[singleCutName].checked = isChecked;
                    }
                });
            }
        } else if (parentName.startsWith('Single CUT #')) {
            const singleCUT = this.sceneObjects[parentName];
            
            // Update all pipe and panel visibility directly
            if (singleCUT) {
                // Update pipes
                if (singleCUT.pipes) {
                    singleCUT.pipes.forEach((pipe, index) => {
                        if (pipe && pipe.pipeMesh) {
                            // Set custom property
                            pipe._isVisible = isChecked;
                            
                            // Set visibility on pipe
                            pipe.pipeMesh.isVisible = isChecked;
                            if (pipe.rootNode) {
                                pipe.rootNode.setEnabled(isChecked);
                            }
                            
                            // Set markers visibility
                            if (pipe.markers) {
                                pipe.markers.forEach(marker => {
                                    marker.isVisible = isChecked;
                                });
                            }
                        }
                    });
                }
                
                // Update panels
                if (singleCUT.panels) {
                    singleCUT.panels.forEach((panel, index) => {
                        if (panel) {
                            // Set custom property
                            panel._isVisible = isChecked;
                            
                            // Try different properties
                            if (panel.panelMesh) {
                                panel.panelMesh.isVisible = isChecked;
                                if (panel.rootNode) {
                                    panel.rootNode.setEnabled(isChecked);
                                }
                            } else if (typeof panel.setVisible === 'function') {
                                panel.setVisible(isChecked);
                            }
                        }
                    });
                }
            }
            
            // Update all pipe and panel checkboxes in UI
            for (const key in this.checkboxElements) {
                if (key.startsWith('Pipe #') || key.startsWith('Panel #')) {
                    if (this.checkboxElements[key]) {
                        this.checkboxElements[key].checked = isChecked;
                    }
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
            // Update Seven CUTs checkbox and its children
            if (this.sceneObjects['Seven CUTs #1'] && this.checkboxElements['Seven CUTs #1']) {
                const sevenCuts = this.sceneObjects['Seven CUTs #1'];
                
                // Check custom property first, then mesh visibility
                let isVisible = sevenCuts._isVisible;
                if (isVisible === undefined) {
                    isVisible = sevenCuts.model && sevenCuts.model.singleCuts && 
                                sevenCuts.model.singleCuts.length > 0 && 
                                sevenCuts.model.singleCuts[0].pipes && 
                                sevenCuts.model.singleCuts[0].pipes[0].pipeMesh && 
                                sevenCuts.model.singleCuts[0].pipes[0].pipeMesh.isVisible;
                }
                                
                this.checkboxElements['Seven CUTs #1'].checked = isVisible;
                
                // Update SingleCUT checkboxes
                if (sevenCuts.model && sevenCuts.model.singleCuts) {
                    sevenCuts.model.singleCuts.forEach((singleCut, index) => {
                        const singleCutName = `Single CUT #${index + 1}`;
                        if (this.checkboxElements[singleCutName]) {
                            // Check custom property first, then mesh visibility
                            let singleCutVisible = singleCut._isVisible;
                            if (singleCutVisible === undefined) {
                                singleCutVisible = singleCut.pipes && 
                                                    singleCut.pipes.length > 0 && 
                                                    singleCut.pipes[0].pipeMesh && 
                                                    singleCut.pipes[0].pipeMesh.isVisible;
                            }
                            this.checkboxElements[singleCutName].checked = singleCutVisible;
                        }
                    });
                }
            }
            
            // Update Ground checkbox
            if (this.sceneObjects['Ground #1'] && this.checkboxElements['Ground #1']) {
                const ground = this.sceneObjects['Ground #1'];
                
                // Check custom property first, then mesh visibility
                let groundVisible = ground._isVisible;
                if (groundVisible === undefined) {
                    groundVisible = ground.mesh && ground.mesh.isVisible;
                }
                this.checkboxElements['Ground #1'].checked = groundVisible;
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
        
        if (name === 'Ground #1') {
            // Toggle ground
            if (object.mesh) {
                object.mesh.isVisible = isVisible;
            }
        } else if (name === 'Seven CUTs #1') {
            // Toggle all SingleCUTs in the Seven CUTs model
            if (object.model && object.model.singleCuts) {
                object.model.singleCuts.forEach(singleCut => {
                    if (singleCut.rootNode) {
                        singleCut.rootNode.setEnabled(isVisible);
                    }
                    
                    if (singleCut.pipes) {
                        singleCut.pipes.forEach(pipe => {
                            if (pipe.pipeMesh) {
                                // Set visibility on both root node and pipe mesh
                                if (pipe.rootNode) {
                                    pipe.rootNode.setEnabled(isVisible);
                                }
                                pipe.pipeMesh.isVisible = isVisible;
                            }
                            if (pipe.markers) {
                                pipe.markers.forEach(marker => {
                                    marker.isVisible = isVisible;
                                });
                            }
                        });
                    }
                    
                    if (singleCut.panels) {
                        singleCut.panels.forEach(panel => {
                            // Try different properties that might exist on panels
                            if (panel.panelMesh) {
                                // Set visibility on both root node and panel mesh
                                if (panel.rootNode) {
                                    panel.rootNode.setEnabled(isVisible);
                                }
                                panel.panelMesh.isVisible = isVisible;
                            } else if (typeof panel.setVisible === 'function') {
                                // Use setVisible if available
                                panel.setVisible(isVisible);
                            }
                        });
                    }
                });
            }
            
            // Store the state in a custom property to ensure it's remembered
            object._isVisible = isVisible;
            
            // Force scene to update
            this.scene.render();
        } else if (name.startsWith('Single CUT #')) {
            // Toggle individual SingleCUT
            if (object.rootNode) {
                object.rootNode.setEnabled(isVisible);
            }
            
            if (object.pipes) {
                object.pipes.forEach(pipe => {
                    if (pipe.pipeMesh) {
                        // Set visibility on both root node and pipe mesh
                        if (pipe.rootNode) {
                            pipe.rootNode.setEnabled(isVisible);
                        }
                        pipe.pipeMesh.isVisible = isVisible;
                    }
                    
                    if (pipe.markers) {
                        pipe.markers.forEach(marker => {
                            marker.isVisible = isVisible;
                        });
                    }
                });
            }
            
            if (object.panels) {
                object.panels.forEach(panel => {
                    // Try different properties that might exist on panels
                    if (panel.panelMesh) {
                        // Set visibility on both root node and panel mesh
                        if (panel.rootNode) {
                            panel.rootNode.setEnabled(isVisible);
                        }
                        panel.panelMesh.isVisible = isVisible;
                    } else if (typeof panel.setVisible === 'function') {
                        // Use setVisible if available
                        panel.setVisible(isVisible);
                    }
                });
            }
            
            // Store the state in a custom property
            object._isVisible = isVisible;
            
            // Force scene to update
            this.scene.render();
        } else if (name.startsWith('Pipe #')) {
            // Extract the pipe index from the name
            const pipeIndex = parseInt(name.replace('Pipe #', '')) - 1;
            
            // Toggle individual pipe
            if (object.pipeMesh) {
                // Set visibility on both root node and pipe mesh
                if (object.rootNode) {
                    object.rootNode.setEnabled(isVisible);
                }
                object.pipeMesh.isVisible = isVisible;
                console.log(`Setting individual pipe visibility to ${isVisible}, result: ${object.pipeMesh.isVisible}, root enabled: ${object.rootNode ? object.rootNode.isEnabled() : 'N/A'}`);
                
                // Explicitly force mesh to update
                object.pipeMesh.refreshBoundingInfo();
            }
            
            if (object.markers) {
                object.markers.forEach(marker => {
                    marker.isVisible = isVisible;
                });
            }
            
            // Store the state in a custom property
            object._isVisible = isVisible;
            
            // Force scene to update
            this.scene.render();
        } else if (name.startsWith('Panel #')) {
            // Extract the panel index from the name
            const panelIndex = parseInt(name.replace('Panel #', '')) - 1;
            
            // Toggle individual panel
            if (object.panelMesh) {
                // Set visibility on both root node and panel mesh
                if (object.rootNode) {
                    object.rootNode.setEnabled(isVisible);
                }
                object.panelMesh.isVisible = isVisible;
                console.log(`Setting individual panel visibility to ${isVisible}, result: ${object.panelMesh.isVisible}, root enabled: ${object.rootNode ? object.rootNode.isEnabled() : 'N/A'}`);
                
                // Explicitly force mesh to update
                object.panelMesh.refreshBoundingInfo();
            } else if (typeof object.setVisible === 'function') {
                // Use setVisible if available
                object.setVisible(isVisible);
                console.log(`Using setVisible method for panel - ${isVisible}`);
            }
            
            // Store the state in a custom property
            object._isVisible = isVisible;
            
            // Force scene to update
            this.scene.render();
        }
        
        // Always update checkboxes to match the desired state
        this.updateNestedCheckboxes(name, isVisible);
        
        // Update the UI to reflect changes immediately
        this.updateCheckboxStates();
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