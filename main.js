/* ═══════════════════════════════════════════════════════════════
   RCRD — Main Application
   Orchestrates the universe
   ═══════════════════════════════════════════════════════════════ */

(function() {
    'use strict';

    /* ─────────────────────────────────────────────────────────────
       State
       ───────────────────────────────────────────────────────────── */
    
    let isCuriosityMode = false;
    let fallingStarTimeout = null;

    /* ─────────────────────────────────────────────────────────────
       DOM References
       ───────────────────────────────────────────────────────────── */
    
    const $particles = document.getElementById('particles');
    const $cloudsLayer = document.getElementById('clouds-layer');
    const $starsLayer = document.getElementById('stars-layer');
    const $fallingStarsLayer = document.getElementById('falling-stars-layer');
    const $curiosityBackgroundLayer = document.getElementById('curiosity-background-layer');
    const $curiosityToggle = document.getElementById('curiosity-toggle');
    const $starModal = document.getElementById('star-modal');
    const $fallingModal = document.getElementById('falling-star-modal');
    const $tipsToggle = document.getElementById('tips-toggle');
    const $tutorialOverlay = document.getElementById('tutorial-overlay');
    const $tutorialStep = $tutorialOverlay.querySelector('.tutorial-step');
    const $tutorialCounter = $tutorialOverlay.querySelector('.tutorial-counter');
    const $tutorialPrev = $tutorialOverlay.querySelector('.tutorial-prev');
    const $tutorialNext = $tutorialOverlay.querySelector('.tutorial-next');
    const $tutorialClose = $tutorialOverlay.querySelector('.tutorial-close');

    /* ─────────────────────────────────────────────────────────────
       Initialization
       ───────────────────────────────────────────────────────────── */
    
    function init() {
        setUniverseSize();
        createParticles();
        renderGasClouds();
        renderStars();
        renderCuriosityStars();
        bindEvents();
        scheduleFallingStar();
    }

    function setUniverseSize() {
        // Content area bounds - the stars/clouds are always positioned within this
        const minWidth = 900;
        const minHeight = 700;
        const maxWidth = 1400;
        const maxHeight = 900;
        
        const isMobile = window.innerWidth < 900 || window.innerHeight < 700;
        
        // On mobile, use viewport size; on desktop, clamp between min and max
        if (isMobile) {
            config.universeWidth = Math.max(window.innerWidth, minWidth);
            config.universeHeight = Math.max(window.innerHeight, minHeight);
        } else {
            config.universeWidth = Math.min(Math.max(window.innerWidth, minWidth), maxWidth);
            config.universeHeight = Math.min(Math.max(window.innerHeight, minHeight), maxHeight);
        }
        
        const universe = document.getElementById('universe');
        universe.style.width = config.universeWidth + 'px';
        universe.style.height = config.universeHeight + 'px';
        
        // On mobile, center the universe
        if (isMobile) {
            universe.style.left = '50%';
            universe.style.top = '50%';
            universe.style.transform = 'translate(-50%, -50%)';
        } else {
            // Desktop: center the universe if viewport is larger than content area
            if (window.innerWidth > config.universeWidth) {
                universe.style.left = '50%';
                universe.style.transform = 'translateX(-50%)';
            } else {
                universe.style.left = '0';
                universe.style.transform = 'none';
            }
            
            // For vertical: center if viewport is taller
            if (window.innerHeight > config.universeHeight) {
                universe.style.top = '50%';
                universe.style.transform = universe.style.transform === 'translateX(-50%)' 
                    ? 'translate(-50%, -50%)' 
                    : 'translateY(-50%)';
            } else {
                universe.style.top = '0';
                if (universe.style.transform === 'translate(-50%, -50%)') {
                    universe.style.transform = 'translateX(-50%)';
                } else if (universe.style.transform === 'translateY(-50%)') {
                    universe.style.transform = 'none';
                }
            }
        }
        
        [$cloudsLayer, $starsLayer, $fallingStarsLayer, $curiosityBackgroundLayer].forEach(layer => {
            layer.style.width = config.universeWidth + 'px';
            layer.style.height = config.universeHeight + 'px';
        });
        
        // Handle resize
        window.addEventListener('resize', debounce(() => {
            const isMobile = window.innerWidth < 900 || window.innerHeight < 700;
            
            if (isMobile) {
                config.universeWidth = Math.max(window.innerWidth, minWidth);
                config.universeHeight = Math.max(window.innerHeight, minHeight);
            } else {
                config.universeWidth = Math.min(Math.max(window.innerWidth, minWidth), maxWidth);
                config.universeHeight = Math.min(Math.max(window.innerHeight, minHeight), maxHeight);
            }
            
            universe.style.width = config.universeWidth + 'px';
            universe.style.height = config.universeHeight + 'px';
            
            // On mobile, always center
            if (isMobile) {
                universe.style.left = '50%';
                universe.style.top = '50%';
                universe.style.transform = 'translate(-50%, -50%)';
            } else {
                // Desktop: center horizontally
                if (window.innerWidth > config.universeWidth) {
                    universe.style.left = '50%';
                    universe.style.transform = 'translateX(-50%)';
                } else {
                    universe.style.left = '0';
                    universe.style.transform = 'none';
                }
                
                // Center vertically  
                if (window.innerHeight > config.universeHeight) {
                    universe.style.top = '50%';
                    universe.style.transform = universe.style.transform === 'translateX(-50%)' 
                        ? 'translate(-50%, -50%)' 
                        : 'translateY(-50%)';
                } else {
                    universe.style.top = '0';
                    if (universe.style.transform === 'translate(-50%, -50%)') {
                        universe.style.transform = 'translateX(-50%)';
                    } else if (universe.style.transform === 'translateY(-50%)') {
                        universe.style.transform = 'none';
                    }
                }
            }
            
            [$cloudsLayer, $starsLayer, $fallingStarsLayer].forEach(layer => {
                layer.style.width = config.universeWidth + 'px';
                layer.style.height = config.universeHeight + 'px';
            });
        }, 100));
    }
    
    // Simple debounce helper
    function debounce(fn, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    /* ─────────────────────────────────────────────────────────────
       Ambient Particles
       ───────────────────────────────────────────────────────────── */
    
    function createParticles() {
        const colors = [
            'rgba(167, 139, 250, 0.7)',  // purple
            'rgba(244, 114, 182, 0.6)',  // pink
            'rgba(96, 165, 250, 0.6)',   // blue
            'rgba(45, 212, 191, 0.5)',   // teal
            'rgba(255, 255, 255, 0.5)'   // white
        ];

        for (let i = 0; i < config.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 3 + 1;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const baseOpacity = Math.random() * 0.4 + 0.5;
            const twinkleDuration = Math.random() * 6 + 4; // 4-10 seconds
            const twinkleDelay = Math.random() * 5;
            
            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${posX}%;
                top: ${posY}%;
                background: ${color};
                box-shadow: 0 0 ${size * 2}px ${color};
                --base-opacity: ${baseOpacity};
                animation-duration: ${twinkleDuration}s;
                animation-delay: ${twinkleDelay}s;
            `;
            
            $particles.appendChild(particle);
        }
    }

    /* ─────────────────────────────────────────────────────────────
       Gas Clouds
       ───────────────────────────────────────────────────────────── */
    
    function renderGasClouds() {
        gasClouds.forEach(cloud => {
            // Create the cloud element
            const $cloud = document.createElement('div');
            $cloud.className = 'gas-cloud';
            $cloud.id = `cloud-${cloud.id}`;
            
            const x = (cloud.x / 100) * config.universeWidth;
            const y = (cloud.y / 100) * config.universeHeight;
            
            $cloud.style.cssText = `
                left: ${x - cloud.size / 2}px;
                top: ${y - cloud.size / 2}px;
                width: ${cloud.size}px;
                height: ${cloud.size}px;
                background: radial-gradient(ellipse at center, ${cloud.color} 0%, ${cloud.color.replace(/[\d.]+\)$/, '0.1)')} 50%, transparent 70%);
            `;
            
            $cloudsLayer.appendChild($cloud);
            
            // Create the label
            const $label = document.createElement('span');
            $label.className = 'cloud-label';
            $label.textContent = cloud.name;
            
            // Extract color for label (use a lighter version)
            const labelColor = cloud.color.replace(/[\d.]+\)$/, '0.8)');
            $label.style.cssText = `
                left: ${x}px;
                top: ${y}px;
                transform: translateX(-50%);
                color: ${labelColor};
            `;
            
            // Make label clickable if cloud has description
            if (cloud.description) {
                $label.classList.add('clickable');
                $label.addEventListener('click', () => openCloudModal(cloud));
            }
            
            // Highlight certain clouds in curiosity mode
            if (['tpot', 'meditation', 'folklore'].includes(cloud.id)) {
                $label.classList.add('curiosity-highlight');
            }
            
            $cloudsLayer.appendChild($label);
        });
    }
    
    function openCloudModal(cloud) {
        const $title = $starModal.querySelector('.modal-title');
        const $type = $starModal.querySelector('.modal-type');
        const $imageContainer = $starModal.querySelector('.modal-image-container');
        const $description = $starModal.querySelector('.modal-description');
        const $links = $starModal.querySelector('.modal-links');
        
        $title.textContent = cloud.name;
        $type.textContent = 'cluster';
        $description.textContent = cloud.description || '';
        
        $imageContainer.innerHTML = '';
        $imageContainer.style.display = 'none';
        
        // Handle links
        $links.innerHTML = '';
        if (cloud.links && cloud.links.length > 0) {
            cloud.links.forEach(link => {
                const $a = document.createElement('a');
                $a.href = link.url;
                $a.textContent = link.text;
                $a.target = '_blank';
                $a.rel = 'noopener noreferrer';
                $links.appendChild($a);
            });
        }
        
        $starModal.setAttribute('aria-hidden', 'false');
    }

    /* ─────────────────────────────────────────────────────────────
       Stars
       ───────────────────────────────────────────────────────────── */
    
    function renderStars() {
        stars.forEach(star => {
            const $star = createStarElement(star, 'regular-star', true);
            $starsLayer.appendChild($star);
        });
    }

    function renderCuriosityStars() {
        curiosityStars.forEach(star => {
            // Allow clickable if has description
            const hasDescription = star.description && star.description.trim() !== '';
            const $star = createStarElement(star, 'curiosity-star', hasDescription);
            
            // Add class for stars with no description (more muted)
            if (!hasDescription) {
                $star.classList.add('no-info');
            }
            
            $starsLayer.appendChild($star);
        });
    }

    function createCuriosityBackground() {
        // Background stars (dim, decorative)
        for (let i = 0; i < 40; i++) {
            const $bgStar = document.createElement('div');
            $bgStar.className = 'curiosity-bg-star';
            
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const size = Math.random() * 2 + 1;
            const opacity = Math.random() * 0.3 + 0.1;
            const delay = Math.random() * 5;
            
            $bgStar.style.cssText = `
                left: ${x}%;
                top: ${y}%;
                width: ${size}px;
                height: ${size}px;
                opacity: ${opacity};
                animation-delay: ${delay}s;
            `;
            
            $curiosityBackgroundLayer.appendChild($bgStar);
        }
        
        // Small galaxy-like spirals
        for (let i = 0; i < 8; i++) {
            const $galaxy = document.createElement('div');
            $galaxy.className = 'curiosity-bg-galaxy';
            
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const size = Math.random() * 150 + 100;
            const rotation = Math.random() * 360;
            const opacity = Math.random() * 0.15 + 0.05;
            
            $galaxy.style.cssText = `
                left: ${x}%;
                top: ${y}%;
                width: ${size}px;
                height: ${size}px;
                opacity: ${opacity};
                transform: translate(-50%, -50%) rotate(${rotation}deg);
            `;
            
            $curiosityBackgroundLayer.appendChild($galaxy);
        }
    }

    function createStarElement(star, className, allowClickable = true) {
        const $star = document.createElement('div');
        $star.className = `star ${className}`;
        $star.dataset.starId = star.id;
        
        const x = (star.x / 100) * config.universeWidth;
        const y = (star.y / 100) * config.universeHeight;
        
        $star.style.cssText = `
            left: ${x - star.size / 2}px;
            top: ${y - star.size / 2}px;
            width: ${star.size}px;
            height: ${star.size}px;
            --star-color: ${star.color || '#fff9f0'};
            --twinkle-duration: ${2 + Math.random() * 3}s;
            --twinkle-delay: ${Math.random() * 2}s;
        `;
        
        const $core = document.createElement('div');
        $core.className = 'star-core';
        
        // Only make clickable if allowed and star has description
        if (allowClickable && star.description && star.description.trim() !== '') {
            $core.classList.add('clickable');
            $core.addEventListener('click', () => openStarModal(star));
            
            // Mark first clickable star as hint (only if user hasn't clicked any star yet)
            const hasClickedStar = localStorage.getItem('rcrd-clicked-star');
            if (!hasClickedStar && star.id === 'ea-estonia') {
                $core.classList.add('hint-star');
            }
        }
        
        $star.appendChild($core);
        
        const $label = document.createElement('span');
        $label.className = 'star-label';
        $label.textContent = star.name;
        
        // Custom label positioning if specified
        if (star.labelPosition) {
            $label.classList.add('label-' + star.labelPosition);
        }
        
        $star.appendChild($label);
        
        return $star;
    }

    /* ─────────────────────────────────────────────────────────────
       Star Modal
       ───────────────────────────────────────────────────────────── */
    
    function openStarModal(star) {
        // Remove hint from hint star after first click
        localStorage.setItem('rcrd-clicked-star', 'true');
        document.querySelectorAll('.star-core.hint-star').forEach($hintStar => {
            $hintStar.classList.remove('hint-star');
        });
        
        const $title = $starModal.querySelector('.modal-title');
        const $type = $starModal.querySelector('.modal-type');
        const $imageContainer = $starModal.querySelector('.modal-image-container');
        const $description = $starModal.querySelector('.modal-description');
        const $links = $starModal.querySelector('.modal-links');
        
        $title.textContent = star.name;
        $type.textContent = star.type;
        $description.textContent = star.description || '';
        
        // Handle image
        if (star.image) {
            $imageContainer.innerHTML = `<img src="${star.image}" alt="${star.name}">`;
            $imageContainer.style.display = 'block';
        } else {
            $imageContainer.innerHTML = '';
            $imageContainer.style.display = 'none';
        }
        
        // Handle links
        $links.innerHTML = '';
        if (star.links && star.links.length > 0) {
            star.links.forEach(link => {
                const $a = document.createElement('a');
                $a.href = link.url;
                $a.textContent = link.text;
                $a.target = '_blank';
                $a.rel = 'noopener noreferrer';
                $links.appendChild($a);
            });
        }
        
        $starModal.setAttribute('aria-hidden', 'false');
    }

    function closeStarModal() {
        $starModal.setAttribute('aria-hidden', 'true');
    }

    /* ─────────────────────────────────────────────────────────────
       Falling Stars
       ───────────────────────────────────────────────────────────── */
    
    let isFirstFallingStar = true;
    
    function scheduleFallingStar() {
        const baseInterval = config.fallingStarInterval;
        const variance = config.fallingStarVariance;
        
        // First one comes after 5-15 seconds, rest are random
        const delay = isFirstFallingStar 
            ? 5000 + Math.random() * 10000
            : baseInterval + (Math.random() - 0.5) * 2 * variance;
        
        isFirstFallingStar = false;
        
        fallingStarTimeout = setTimeout(() => {
            spawnFallingStar();
            scheduleFallingStar();
        }, delay);
    }

    function spawnFallingStar() {
        if (fallingStars.length === 0) return;
        
        // Pick a random poem for this star
        const starData = fallingStars[Math.floor(Math.random() * fallingStars.length)];
        
        const $star = document.createElement('div');
        $star.className = 'falling-star';
        
        // Start from top-right of viewport, random position
        const startX = window.innerWidth + 50;
        const startY = Math.random() * window.innerHeight * 0.3 + 20;
        
        // End at bottom-left
        const endX = -180;
        const endY = window.innerHeight * 0.7 + Math.random() * window.innerHeight * 0.25;
        
        // Calculate angle for proper rotation
        const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
        
        $star.style.cssText = `
            left: ${startX}px;
            top: ${startY}px;
            transform: rotate(${angle}deg);
        `;
        
        // Large invisible hitbox for easy clicking
        const $hitbox = document.createElement('div');
        $hitbox.className = 'falling-star-hitbox';
        $star.appendChild($hitbox);
        
        const $body = document.createElement('div');
        $body.className = 'falling-star-body';
        $star.appendChild($body);
        
        // Show subtle hint on first falling star (one-time only)
        const hasSeenFallingStarHint = localStorage.getItem('rcrd-seen-falling-star-hint');
        if (!hasSeenFallingStarHint) {
            const $hint = document.createElement('div');
            $hint.className = 'falling-star-hint';
            $hint.textContent = 'click';
            // Counter-rotate to keep text upright
            $hint.style.transform = `translateX(-50%) rotate(${-angle}deg)`;
            $star.appendChild($hint);
            localStorage.setItem('rcrd-seen-falling-star-hint', 'true');
            
            // Fade out hint after 4 seconds
            setTimeout(() => {
                if ($hint.parentNode) {
                    $hint.style.opacity = '0';
                    $hint.style.transition = 'opacity 1s ease-out';
                    setTimeout(() => {
                        if ($hint.parentNode) $hint.remove();
                    }, 1000);
                }
            }, 4000);
        }
        
        function handleClick(e) {
            e.stopPropagation();
            
            // First click ever? Show the special "first" poem regardless of which star
            const hasClickedBefore = localStorage.getItem('rcrd-clicked-falling-star');
            let poemToShow = starData;
            
            if (!hasClickedBefore) {
                const firstPoem = fallingStars.find(s => s.first) || fallingStars[0];
                poemToShow = firstPoem;
            }
            
            localStorage.setItem('rcrd-clicked-falling-star', 'true');
            openFallingStarModal(poemToShow);
            $star.remove();
        }
        
        $star.addEventListener('click', handleClick);
        
        // Append to body for fixed positioning
        document.body.appendChild($star);
        
        // Animate using requestAnimationFrame for reliability
        const duration = 16000 + Math.random() * 6000; // 16-22 seconds
        let startTime = null;
        
        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentX = startX + (endX - startX) * progress;
            const currentY = startY + (endY - startY) * progress;
            
            // Fade in at start, fade out at end
            let opacity = 1;
            if (progress < 0.1) {
                opacity = progress / 0.1;
            } else if (progress > 0.85) {
                opacity = (1 - progress) / 0.15;
            }
            
            $star.style.left = currentX + 'px';
            $star.style.top = currentY + 'px';
            $star.style.opacity = opacity;
            
            if (progress < 1 && $star.parentNode) {
                requestAnimationFrame(animate);
            } else if ($star.parentNode) {
                $star.remove();
            }
        }
        
        requestAnimationFrame(animate);
    }

    function openFallingStarModal(starData) {
        const $text = $fallingModal.querySelector('.falling-text');
        const $timer = $fallingModal.querySelector('.falling-timer');
        const $translateBtn = $fallingModal.querySelector('.falling-translate-btn');
        
        let showingTranslation = false;
        const originalText = starData.text;
        const translationText = starData.translation;
        
        // Replace \n with <br> for display
        $text.innerHTML = originalText.replace(/\n/g, '<br>');
        $text.classList.remove('translated');
        
        // Show translate button if translation exists
        if (translationText) {
            $translateBtn.style.display = 'inline-block';
            $translateBtn.textContent = 'en';
            $translateBtn.onclick = () => {
                showingTranslation = !showingTranslation;
                if (showingTranslation) {
                    $text.innerHTML = translationText.replace(/\n/g, '<br>');
                    $text.classList.add('translated');
                    $translateBtn.textContent = 'est';
                } else {
                    $text.innerHTML = originalText.replace(/\n/g, '<br>');
                    $text.classList.remove('translated');
                    $translateBtn.textContent = 'en';
                }
            };
        } else {
            $translateBtn.style.display = 'none';
        }
        
        // Hide timer - no auto-close
        $timer.style.display = 'none';
        
        $fallingModal.setAttribute('aria-hidden', 'false');
    }

    function closeFallingStarModal() {
        $fallingModal.setAttribute('aria-hidden', 'true');
    }

    /* ─────────────────────────────────────────────────────────────
       Curiosity Mode Toggle
       ───────────────────────────────────────────────────────────── */
    
    function toggleCuriosityMode() {
        isCuriosityMode = !isCuriosityMode;
        document.body.classList.toggle('curiosity-mode', isCuriosityMode);
    }

    /* ─────────────────────────────────────────────────────────────
       Tutorial System
       ───────────────────────────────────────────────────────────── */
    
    const tutorialSteps = [
        {
            title: 'Welcome',
            text: 'This universe represents a person\'s mind. Stars are nodes—people, places, ideas. Clusters are categories. There is a layer of curiosities—things not yet explored, on the periphery. You are now inside his mind. Tread with care.',
            highlight: null
        },
        {
            title: 'Click on stars',
            text: 'The bright stars are clickable. Click them to learn more about people, places, and things.',
            highlight: null
        },
        {
            title: 'Shooting stars',
            text: 'Occasionally, shooting stars will cross the screen. Click them to read poems and messages.',
            highlight: null
        },
        {
            title: 'Curiosity mode',
            text: 'Press the "curiosity" button (or press "c") to reveal hidden stars—things to explore.',
            highlight: 'curiosity-toggle'
        },
        {
            title: 'Gas clouds',
            text: 'Some cloud labels are clickable too. They represent clusters and categories.',
            highlight: null
        },
        {
            title: 'Keyboard shortcuts',
            text: 'Press "c" to toggle curiosity mode. Press "f" to spawn a falling star. Press "Esc" to close modals.',
            highlight: null
        }
    ];
    
    let currentTutorialStep = 0;
    
    function showTutorial() {
        currentTutorialStep = 0;
        updateTutorialStep();
        $tutorialOverlay.setAttribute('aria-hidden', 'false');
    }
    
    function closeTutorial() {
        $tutorialOverlay.setAttribute('aria-hidden', 'true');
        // Remove any highlights
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
        });
    }
    
    function updateTutorialStep() {
        const step = tutorialSteps[currentTutorialStep];
        $tutorialStep.innerHTML = `
            <h3 class="tutorial-title">${step.title}</h3>
            <p class="tutorial-text">${step.text}</p>
        `;
        
        $tutorialCounter.textContent = `${currentTutorialStep + 1} / ${tutorialSteps.length}`;
        
        // Show/hide navigation buttons
        $tutorialPrev.style.display = currentTutorialStep === 0 ? 'none' : 'block';
        $tutorialNext.textContent = currentTutorialStep === tutorialSteps.length - 1 ? 'done' : '→';
        
        // Remove previous highlights
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
        });
        
        // Add highlight if specified
        if (step.highlight) {
            const $target = document.getElementById(step.highlight);
            if ($target) {
                $target.classList.add('tutorial-highlight');
            }
        }
    }
    
    function nextTutorialStep() {
        if (currentTutorialStep < tutorialSteps.length - 1) {
            currentTutorialStep++;
            updateTutorialStep();
        } else {
            closeTutorial();
        }
    }
    
    function prevTutorialStep() {
        if (currentTutorialStep > 0) {
            currentTutorialStep--;
            updateTutorialStep();
        }
    }

    /* ─────────────────────────────────────────────────────────────
       Event Bindings
       ───────────────────────────────────────────────────────────── */
    
    function bindEvents() {
        // Curiosity toggle
        $curiosityToggle.addEventListener('click', toggleCuriosityMode);
        
        // Tips toggle
        $tipsToggle.addEventListener('click', showTutorial);
        
        // Tutorial navigation
        $tutorialNext.addEventListener('click', nextTutorialStep);
        $tutorialPrev.addEventListener('click', prevTutorialStep);
        $tutorialClose.addEventListener('click', closeTutorial);
        $tutorialOverlay.querySelector('.tutorial-backdrop').addEventListener('click', closeTutorial);
        
        // Star modal close
        $starModal.querySelector('.modal-close').addEventListener('click', closeStarModal);
        $starModal.querySelector('.modal-backdrop').addEventListener('click', closeStarModal);
        
        // Falling star modal close on backdrop click
        $fallingModal.querySelector('.modal-backdrop').addEventListener('click', closeFallingStarModal);
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if ($tutorialOverlay.getAttribute('aria-hidden') === 'false') {
                    closeTutorial();
                } else {
                    closeStarModal();
                    closeFallingStarModal();
                }
            }
            
            // Tutorial navigation with arrow keys
            if ($tutorialOverlay.getAttribute('aria-hidden') === 'false') {
                if (e.key === 'ArrowRight') {
                    nextTutorialStep();
                } else if (e.key === 'ArrowLeft') {
                    prevTutorialStep();
                }
                return;
            }
            
            // Toggle curiosity with 'c' key
            if (e.key === 'c' && !e.ctrlKey && !e.metaKey) {
                const activeElement = document.activeElement;
                if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
                    toggleCuriosityMode();
                }
            }
            
            // Press 'f' to manually spawn a falling star (for testing)
            if (e.key === 'f' && !e.ctrlKey && !e.metaKey) {
                const activeElement = document.activeElement;
                if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
                    spawnFallingStar();
                }
            }
        });
    }

    /* ─────────────────────────────────────────────────────────────
       Bootstrap
       ───────────────────────────────────────────────────────────── */
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();


