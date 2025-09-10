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
        
        const thoughtBtn = document.createElement('button');
        thoughtBtn.className = 'thought-trigger';
        thoughtBtn.textContent = '💭 RANDOM THOUGHT';
        thoughtBtn.addEventListener('click', () => {
            showRandomThought();
        });
        actionsEl.appendChild(thoughtBtn);
    }
    
    // Add special button for YouTube Depths node
    if (node.id === 'youtube-depths') {
        const youtubeBtn = document.createElement('button');
        youtubeBtn.className = 'youtube-trigger';
        youtubeBtn.textContent = '📺 RANDOM 2010s VIDEO';
        youtubeBtn.addEventListener('click', () => {
            openRandomYouTubeVideo();
        });
        actionsEl.appendChild(youtubeBtn);
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

// YouTube Depths functionality
function openRandomYouTubeVideo() {
    const videos2010s = [
        'https://www.youtube.com/watch?v=4UdEFmxRmNE', // Yogscast, shadow of israphel part 1
        'https://www.youtube.com/watch?v=B36Ehzf2cxE', // paulsoaresjr minecraft tutorial video
        'https://www.youtube.com/watch?v=Uw7e5PCbKgE', // smosh food battle 2011
        'https://www.youtube.com/watch?v=NTTJcz0rqco'  // jack and dean fac-e-book
    ];
    
    const randomVideo = videos2010s[Math.floor(Math.random() * videos2010s.length)];
    window.open(randomVideo, '_blank');
}

// Random thoughts functionality
function showRandomThought() {
    const thoughts = [
        "Maybe you can just say stuff. Say the uncomfortable thing. Even if you don't know how it's going to go. Jump into the void. Maybe you can be direct.",
        
        "Maybe you can just embrace the fact that you don't feel real. Maybe you don't need the crutch, maybe you can just let go.",
        
        "Remind yourself that you can mention the things that bring disconnect. And then they disappear. And connection emerges naturally.",
        
        "Kõik algab.",
        
        `"Stand still. The trees ahead and bushes beside you
Are not lost. Wherever you are is called Here,
And you must treat it as a powerful stranger,
Must ask permission to know it and be known.
The forest breathes. Listen. It answers,
I have made this place around you.
If you leave it, you may come back again, saying Here.
No two trees are the same to Raven.
No two branches are the same to Wren.
If what a tree or a bush does is lost on you,
You are surely lost. Stand still. The forest knows
Where you are. you must let it find you."

- David Wagoner`,
        
        "maybe death isn't so tragic. like a leaf falling down in autumn. it just is. all things must come to an end. maybe we would be a happier and healthier society if we took death as the natural occurance as it is -- we wouldn't cling so hard on life in our final moments - being able to let go better -- and we woudn't spend needless resources keeping people alive even through suffering",
        
        "pretty sure we can fix the school system by teaching people to listen to their wants and needs and going through that instead of teaching them obedience and sitting still. im sure places like waldorf school have learned this already. this should be mainstream"
    ];
    
    const randomThought = thoughts[Math.floor(Math.random() * thoughts.length)];
    
    // Create a modal overlay
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(13, 31, 13, 0.98), rgba(5, 10, 5, 0.95));
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(8px);
        animation: fadeIn 0.3s ease-out;
    `;
    
    const thoughtBox = document.createElement('div');
    thoughtBox.style.cssText = `
        background: linear-gradient(145deg, var(--deep-green), var(--mid-green));
        border: 4px solid var(--bright-green);
        border-radius: 12px;
        padding: 40px;
        max-width: 700px;
        max-height: 80vh;
        overflow-y: auto;
        color: var(--moss);
        font-family: 'Courier New', monospace;
        font-size: 18px;
        line-height: 1.8;
        white-space: pre-line;
        text-align: left;
        box-shadow: 
            8px 8px 0 var(--shadow),
            8px 8px 40px rgba(126, 179, 70, 0.3),
            inset 0 0 30px rgba(126, 179, 70, 0.1);
        position: relative;
        transform: scale(0.95);
        animation: thoughtPopIn 0.4s ease-out forwards;
    `;
    
    thoughtBox.textContent = randomThought;
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.cssText = `
        position: absolute;
        top: 15px;
        right: 20px;
        background: var(--bark-brown);
        border: 2px solid var(--bright-green);
        border-radius: 50%;
        width: 35px;
        height: 35px;
        color: var(--moss);
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Courier New', monospace;
    `;
    
    closeButton.addEventListener('mouseenter', () => {
        closeButton.style.background = '#2d5016';
        closeButton.style.transform = 'scale(1.1)';
    });
    
    closeButton.addEventListener('mouseleave', () => {
        closeButton.style.background = '#3e2723';
        closeButton.style.transform = 'scale(1)';
    });
    closeButton.addEventListener('click', () => modal.remove());
    
    thoughtBox.style.position = 'relative';
    thoughtBox.appendChild(closeButton);
    modal.appendChild(thoughtBox);
    
    // Close on click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    // Close on escape key
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', escapeHandler);
        }
    });
    
    document.body.appendChild(modal);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);