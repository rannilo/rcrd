let branchSystem;
let animationId;

function init() {
    const canvas = document.getElementById('thought-canvas');
    branchSystem = new BranchSystem(canvas, thoughtsData);
    
    setupLegend();
    setupEventListeners();
    animate();
}

function setupLegend() {
    const filterOptions = document.getElementById('filter-options');
    const selectAll = document.getElementById('select-all');
    const selectNone = document.getElementById('select-none');
    
    // Get unique node types
    const nodeTypes = [...new Set(thoughtsData.nodes.map(n => n.type))];
    const checkboxes = [];
    
    nodeTypes.forEach(type => {
        const filterItem = document.createElement('div');
        filterItem.className = 'filter-item';
        
        const checkbox = document.createElement('div');
        checkbox.className = 'filter-checkbox checked';
        checkboxes.push({ checkbox, type });
        
        const colorBox = document.createElement('div');
        colorBox.className = 'filter-color';
        colorBox.style.background = nodeColors[type] || nodeColors.default;
        
        const label = document.createElement('div');
        label.className = 'filter-label';
        label.textContent = type.replace('-', ' ');
        
        filterItem.appendChild(checkbox);
        filterItem.appendChild(colorBox);
        filterItem.appendChild(label);
        
        filterItem.addEventListener('click', () => {
            branchSystem.toggleNodeType(type);
            checkbox.classList.toggle('checked');
        });
        
        filterOptions.appendChild(filterItem);
    });
    
    // Select all button
    selectAll.addEventListener('click', () => {
        checkboxes.forEach(({ checkbox, type }) => {
            if (!checkbox.classList.contains('checked')) {
                checkbox.classList.add('checked');
                if (branchSystem.hiddenTypes.has(type)) {
                    branchSystem.toggleNodeType(type);
                }
            }
        });
    });
    
    // Select none button
    selectNone.addEventListener('click', () => {
        checkboxes.forEach(({ checkbox, type }) => {
            if (checkbox.classList.contains('checked')) {
                checkbox.classList.remove('checked');
                if (!branchSystem.hiddenTypes.has(type)) {
                    branchSystem.toggleNodeType(type);
                }
            }
        });
    });
}

function setupEventListeners() {
    const canvas = document.getElementById('thought-canvas');
    const detailPanel = document.getElementById('thought-detail');
    const closeBtn = document.getElementById('close-detail');
    const resetBtn = document.getElementById('reset-view');
    const physicsBtn = document.getElementById('toggle-physics');
    
    // Mouse interactions
    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const node = branchSystem.getNodeAt(x, y);
        if (!node) {
            branchSystem.startPan(x, y);
            canvas.style.cursor = 'grabbing';
        }
    });
    
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (branchSystem.isPanning) {
            branchSystem.updatePan(x, y);
        } else {
            const node = branchSystem.getNodeAt(x, y);
            branchSystem.setHoveredNode(node);
            canvas.style.cursor = node ? 'pointer' : 'grab';
        }
    });
    
    canvas.addEventListener('mouseup', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (branchSystem.isPanning) {
            branchSystem.endPan();
            canvas.style.cursor = 'grab';
        } else {
            const node = branchSystem.getNodeAt(x, y);
            if (node) {
                showNodeDetail(node);
                branchSystem.setSelectedNode(node);
            }
        }
    });
    
    canvas.addEventListener('mouseleave', () => {
        branchSystem.endPan();
        canvas.style.cursor = 'grab';
    });
    
    // Zoom with mouse wheel
    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        branchSystem.zoom(e.deltaY, mouseX, mouseY);
    });
    
    // Close detail panel
    closeBtn.addEventListener('click', () => {
        detailPanel.classList.add('hidden');
        branchSystem.setSelectedNode(null);
    });
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            detailPanel.classList.add('hidden');
            branchSystem.setSelectedNode(null);
        }
    });
    
    // Control buttons
    resetBtn.addEventListener('click', () => {
        branchSystem.reset();
    });
    
    physicsBtn.addEventListener('click', () => {
        branchSystem.togglePhysics();
        physicsBtn.style.background = branchSystem.physicsEnabled ? 
            'var(--deep-green)' : 'var(--bark-brown)';
    });
    
    // Window resize
    window.addEventListener('resize', () => {
        branchSystem.resize();
    });
    
    // CV Panel toggle
    const cvPanel = document.getElementById('cv-panel');
    const showCvBtn = document.getElementById('show-cv');
    const closeCvBtn = document.getElementById('close-cv');
    
    showCvBtn.addEventListener('click', () => {
        cvPanel.classList.remove('panel-closed');
    });
    
    closeCvBtn.addEventListener('click', () => {
        cvPanel.classList.add('panel-closed');
    });
    
    // Filter panel toggle
    const filterBody = document.getElementById('filter-body');
    const toggleFilterBtn = document.getElementById('toggle-filter');
    
    toggleFilterBtn.addEventListener('click', () => {
        filterBody.classList.toggle('collapsed');
        toggleFilterBtn.textContent = filterBody.classList.contains('collapsed') ? '+' : '−';
    });
}

function showNodeDetail(node) {
    const detailPanel = document.getElementById('thought-detail');
    const titleEl = document.getElementById('detail-title');
    const descEl = document.getElementById('detail-description');
    const metaEl = document.getElementById('detail-meta');
    const actionsEl = document.getElementById('detail-actions');
    
    titleEl.textContent = node.label;
    descEl.textContent = node.description || 'No description available';
    
    // Clear and populate meta tags
    metaEl.innerHTML = '';
    if (node.tags) {
        node.tags.forEach(tag => {
            const tagEl = document.createElement('div');
            tagEl.className = 'meta-tag';
            tagEl.textContent = tag;
            metaEl.appendChild(tagEl);
        });
    }
    
    // Add node type as a tag
    const typeTag = document.createElement('div');
    typeTag.className = 'meta-tag';
    typeTag.textContent = node.type;
    typeTag.style.background = 'var(--bark-brown)';
    metaEl.appendChild(typeTag);
    
    // Clear actions
    actionsEl.innerHTML = '';
    
    // Add special button for Poetry node
    if (node.id === 'poetry') {
        const poetryBtn = document.createElement('button');
        poetryBtn.className = 'poetry-trigger';
        poetryBtn.textContent = '▶ ENTER POEMS';
        poetryBtn.addEventListener('click', () => {
            openPoetryViewer();
        });
        actionsEl.appendChild(poetryBtn);
    }
    
    // Add special button for MIND (root) node
    if (node.id === 'root') {
        const mindBtn = document.createElement('button');
        mindBtn.className = 'mind-trigger';
        mindBtn.textContent = '◉ VIEW PROFILE';
        mindBtn.addEventListener('click', () => {
            openMindProfile();
        });
        actionsEl.appendChild(mindBtn);
    }
    
    detailPanel.classList.remove('hidden');
}

function animate() {
    branchSystem.update();
    branchSystem.draw();
    animationId = requestAnimationFrame(animate);
}

// Poetry viewer functionality
let currentPoemIndex = 0;
let currentYearPoems = [];

function openPoetryViewer() {
    const viewer = document.getElementById('poetry-viewer');
    viewer.classList.remove('hidden');
    displayYearBoxes();
    setupPoetryEvents();
}

function displayYearBoxes() {
    const yearsContainer = document.getElementById('poetry-years');
    const poemDisplay = document.getElementById('poem-display');
    
    // Hide poem display, show years
    poemDisplay.classList.add('hidden');
    yearsContainer.classList.remove('hidden');
    
    // Group poems by year
    const poemsByYear = {};
    poemsData.forEach(poem => {
        const year = poem.date;
        if (!poemsByYear[year]) {
            poemsByYear[year] = [];
        }
        poemsByYear[year].push(poem);
    });
    
    // Sort years descending
    const years = Object.keys(poemsByYear).sort((a, b) => b - a);
    
    // Clear container
    yearsContainer.innerHTML = '';
    
    // Create year boxes
    years.forEach(year => {
        const yearBox = document.createElement('div');
        yearBox.className = 'year-box';
        
        const poemsList = poemsByYear[year].map(poem => {
            // Use first line for untitled poems
            let displayTitle = poem.title;
            if (poem.title === '*') {
                const firstLine = poem.text.split('\n')[0];
                displayTitle = firstLine.length > 40 ? firstLine.substring(0, 37) + '...' : firstLine;
            }
            return `<div class="year-poem-item" data-poem-id="${poem.id}">${displayTitle}</div>`;
        }).join('');
        
        yearBox.innerHTML = `
            <div class="year-label">${year}</div>
            <div class="year-count">[${poemsByYear[year].length} POEMS]</div>
            <div class="year-poems-list">
                ${poemsList}
            </div>
        `;
        
        // Add click handlers for poem items
        yearBox.querySelectorAll('.year-poem-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const poemId = item.dataset.poemId;
                const poemIndex = poemsData.findIndex(p => p.id === poemId);
                currentYearPoems = poemsByYear[year];
                displayPoem(poemIndex);
            });
        });
        
        yearsContainer.appendChild(yearBox);
    });
}

function setupPoetryEvents() {
    const closeBtn = document.getElementById('close-poetry');
    const prevBtn = document.getElementById('prev-poem');
    const nextBtn = document.getElementById('next-poem');
    const backBtn = document.getElementById('back-to-years');
    
    // Close button
    closeBtn.addEventListener('click', closePoetryViewer);
    
    // Back to years button
    backBtn.addEventListener('click', () => {
        displayYearBoxes();
    });
    
    // Navigation
    prevBtn.addEventListener('click', () => {
        if (currentPoemIndex > 0) {
            displayPoem(currentPoemIndex - 1);
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentPoemIndex < poemsData.length - 1) {
            displayPoem(currentPoemIndex + 1);
        }
    });
    
    // Keyboard navigation
    const handleKeyPress = (e) => {
        if (e.key === 'Escape') {
            const poemDisplay = document.getElementById('poem-display');
            if (!poemDisplay.classList.contains('hidden')) {
                displayYearBoxes();
            } else {
                closePoetryViewer();
            }
        } else if (e.key === 'ArrowLeft' && currentPoemIndex > 0) {
            displayPoem(currentPoemIndex - 1);
        } else if (e.key === 'ArrowRight' && currentPoemIndex < poemsData.length - 1) {
            displayPoem(currentPoemIndex + 1);
        }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    
    // Clean up on close
    viewer.cleanupHandler = handleKeyPress;
}

function closePoetryViewer() {
    const viewer = document.getElementById('poetry-viewer');
    viewer.classList.add('hidden');
    
    // Remove keyboard event listener
    if (viewer.cleanupHandler) {
        document.removeEventListener('keydown', viewer.cleanupHandler);
    }
}

function displayPoem(index) {
    currentPoemIndex = index;
    const poem = poemsData[index];
    
    // Show poem display, hide years
    const yearsContainer = document.getElementById('poetry-years');
    const poemDisplay = document.getElementById('poem-display');
    yearsContainer.classList.add('hidden');
    poemDisplay.classList.remove('hidden');
    
    // Update content with typewriter effect
    const titleEl = document.getElementById('poem-title');
    const dateEl = document.getElementById('poem-date');
    const textEl = document.getElementById('poem-text');
    const counterEl = document.getElementById('poem-counter');
    const prevBtn = document.getElementById('prev-poem');
    const nextBtn = document.getElementById('next-poem');
    
    // Reset animations
    titleEl.style.animation = 'none';
    textEl.style.animation = 'none';
    
    setTimeout(() => {
        titleEl.textContent = poem.title;
        dateEl.textContent = `[${poem.date}]`;
        textEl.textContent = poem.text;
        counterEl.textContent = `${index + 1} / ${poemsData.length}`;
        
        // Re-trigger animations
        titleEl.style.animation = 'typewriter 0.5s steps(20)';
        textEl.style.animation = 'fade-in 0.8s ease-in';
        
        // Update button states
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === poemsData.length - 1;
    }, 50);
}

// Mind Profile functionality
function openMindProfile() {
    const profile = document.getElementById('mind-profile');
    profile.classList.remove('hidden');
    setupProfileEvents();
}

function setupProfileEvents() {
    const closeBtn = document.getElementById('close-profile');
    const ancestorsBtn = document.getElementById('show-ancestors');
    const ancestorsPortal = document.getElementById('ancestors-portal');
    const exitPortalBtn = document.getElementById('exit-portal');
    
    closeBtn.addEventListener('click', () => {
        document.getElementById('mind-profile').classList.add('hidden');
    });
    
    ancestorsBtn.addEventListener('click', () => {
        // Show portal overlay on top of profile
        ancestorsPortal.classList.remove('hidden');
        populateAncestors();
    });
    
    exitPortalBtn.addEventListener('click', () => {
        // Close portal only
        ancestorsPortal.classList.add('hidden');
    });
    
    // ESC key to exit portal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !ancestorsPortal.classList.contains('hidden')) {
            ancestorsPortal.classList.add('hidden');
        }
    });
}

function populateAncestors() {
    const grid = document.querySelector('.ancestors-grid');
    grid.innerHTML = '';
    
    ancestorsData.previousGeneration.forEach(ancestor => {
        const card = document.createElement('div');
        card.className = 'ancestor-card';
        
        const interestsHTML = ancestor.interests.map(interest => 
            `<div class="ancestor-interest">• ${interest}</div>`
        ).join('');
        
        card.innerHTML = `
            <div class="ancestor-name">${ancestor.name}</div>
            <div class="ancestor-relation">${ancestor.relation}</div>
            <div class="ancestor-interests">
                ${interestsHTML}
            </div>
            ${ancestor.wiki ? `<a href="${ancestor.wiki}" target="_blank" class="ancestor-link">Wikipedia ↗</a>` : ''}
        `;
        
        grid.appendChild(card);
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);