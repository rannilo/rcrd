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
    let isInsideBlackHole = false;
    let manifestoScrollInterval = null;
    let isAdminMode = false;
    let adminDragState = null;

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
        renderBlackHole();
        generatePortalStarfield();
        resolveOverlaps();
        applySavedPositions();
        bindEvents();
        setupKonamiListener();
        setupAdminDragging();
        scheduleFallingStar();
    }

    function setUniverseSize() {
        // Content area bounds - the stars/clouds are always positioned within this
        const minWidth = 900;
        const minHeight = 700;
        const maxWidth = 1400;
        const maxHeight = 900;

        const isMobile = window.innerWidth < 768;

        // On mobile, use actual viewport; on desktop, clamp between min and max
        if (isMobile) {
            config.universeWidth = window.innerWidth;
            config.universeHeight = window.innerHeight;
        } else {
            config.universeWidth = Math.min(Math.max(window.innerWidth, minWidth), maxWidth);
            config.universeHeight = Math.min(Math.max(window.innerHeight, minHeight), maxHeight);
        }
        
        const universe = document.getElementById('universe');
        universe.style.width = config.universeWidth + 'px';
        universe.style.height = config.universeHeight + 'px';
        
        // On mobile, fill viewport; on desktop, center
        if (isMobile) {
            universe.style.left = '0';
            universe.style.top = '0';
            universe.style.transform = 'none';
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
            const isMobile = window.innerWidth < 768;

            if (isMobile) {
                config.universeWidth = window.innerWidth;
                config.universeHeight = window.innerHeight;
            } else {
                config.universeWidth = Math.min(Math.max(window.innerWidth, minWidth), maxWidth);
                config.universeHeight = Math.min(Math.max(window.innerHeight, minHeight), maxHeight);
            }
            
            universe.style.width = config.universeWidth + 'px';
            universe.style.height = config.universeHeight + 'px';
            
            // On mobile, fill viewport; on desktop, center
            if (isMobile) {
                universe.style.left = '0';
                universe.style.top = '0';
                universe.style.transform = 'none';
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

        // Calculate black hole position in viewport % to clear particles near it
        const uLeft = Math.max(0, (window.innerWidth - config.universeWidth) / 2);
        const uTop = Math.max(0, (window.innerHeight - config.universeHeight) / 2);
        const bhVpX = (uLeft + (blackHole.x / 100) * config.universeWidth) / window.innerWidth * 100;
        const bhVpY = (uTop + (blackHole.y / 100) * config.universeHeight) / window.innerHeight * 100;
        // Exclusion radius — covers the visual black hole area (core + lensing + disk)
        const bhRadiusPx = blackHole.size * 4;
        const exRadX = bhRadiusPx / window.innerWidth * 100;
        const exRadY = bhRadiusPx / window.innerHeight * 100;

        for (let i = 0; i < config.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            const size = Math.random() * 3 + 1;
            const color = colors[Math.floor(Math.random() * colors.length)];

            // Keep generating positions until outside the black hole zone
            let posX, posY;
            do {
                posX = Math.random() * 100;
                posY = Math.random() * 100;
            } while (
                Math.pow((posX - bhVpX) / exRadX, 2) +
                Math.pow((posY - bhVpY) / exRadY, 2) < 1
            );

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
            $cloud.dataset.cloudId = cloud.id;
            
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
            $label.dataset.cloudId = cloud.id;
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
            if (['tpot', 'meditation', 'folklore', 'post-capitalism', 'embodiment'].includes(cloud.id)) {
                $label.classList.add('curiosity-highlight');
            }
            
            $cloudsLayer.appendChild($label);
        });
    }
    
    function openCloudModal(cloud) {
        if (isAdminMode) return;
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

    /* ─────────────────────────────────────────────────────────────
       Black Hole
       ───────────────────────────────────────────────────────────── */

    function renderBlackHole() {
        const $bh = document.createElement('div');
        $bh.className = 'black-hole';
        $bh.id = 'black-hole';

        const x = (blackHole.x / 100) * config.universeWidth;
        const y = (blackHole.y / 100) * config.universeHeight;
        const s = blackHole.size;

        $bh.style.cssText = `
            left: ${x - s}px;
            top: ${y - s}px;
            width: ${s * 2}px;
            height: ${s * 2}px;
        `;

        const $core = document.createElement('div');
        $core.className = 'black-hole-core';
        $bh.appendChild($core);

        const $disk = document.createElement('div');
        $disk.className = 'black-hole-disk';
        $bh.appendChild($disk);

        const $label = document.createElement('span');
        $label.className = 'black-hole-label';
        $label.textContent = '';
        $bh.appendChild($label);

        $bh.addEventListener('click', () => enterBlackHole());

        $starsLayer.appendChild($bh);

        // Store position for suck-in animation origin
        document.documentElement.style.setProperty('--bh-x', (blackHole.x) + '%');
        document.documentElement.style.setProperty('--bh-y', (blackHole.y) + '%');
    }

    function generatePortalStarfield() {
        const $portal = document.getElementById('black-hole-portal');
        const count = 120;
        const colors = [
            'rgba(255,255,255,',
            'rgba(255,220,180,',
            'rgba(200,180,255,',
            'rgba(255,200,150,'
        ];

        for (let i = 0; i < count; i++) {
            const $s = document.createElement('div');
            $s.className = 'portal-star';
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const size = Math.random() * 1.5 + 0.5;
            const opacity = Math.random() * 0.5 + 0.1;
            const color = colors[Math.floor(Math.random() * colors.length)];

            $s.style.cssText = `
                left: ${x}%;
                top: ${y}%;
                width: ${size}px;
                height: ${size}px;
                background: ${color}${opacity});
            `;

            if (Math.random() < 0.25) {
                $s.classList.add('twinkle');
                const dur = (3 + Math.random() * 5).toFixed(1);
                $s.style.setProperty('--twinkle-dur', dur + 's');
                $s.style.setProperty('--op-min', Math.max(opacity - 0.15, 0.05).toFixed(2));
                $s.style.setProperty('--op-max', Math.min(opacity + 0.2, 0.7).toFixed(2));
            }

            $portal.appendChild($s);
        }
    }

    /* ── Audio helpers ── */

    function fadeInAudio(duration) {
        duration = duration || 3000;
        const $audio = document.getElementById('portal-audio');
        if (!$audio) return;
        $audio.volume = 0;
        $audio.currentTime = 0;
        $audio.play().catch(function() {}); // silently fail if blocked
        var steps = 30;
        var stepTime = duration / steps;
        var step = 0;
        var fade = setInterval(function() {
            step++;
            $audio.volume = Math.min(step / steps * 0.55, 0.55);
            if (step >= steps) clearInterval(fade);
        }, stepTime);
    }

    function fadeOutAudio(duration) {
        duration = duration || 2000;
        var $audio = document.getElementById('portal-audio');
        if (!$audio || $audio.paused) return;
        var startVol = $audio.volume;
        var steps = 25;
        var stepTime = duration / steps;
        var step = 0;
        var fade = setInterval(function() {
            step++;
            $audio.volume = Math.max(startVol - (step / steps) * startVol, 0);
            if (step >= steps) {
                clearInterval(fade);
                $audio.pause();
            }
        }, stepTime);
    }

    /* ── Black hole enter/exit ── */

    function enterBlackHole() {
        if (isInsideBlackHole) return;
        if (isAdminMode) return;
        isInsideBlackHole = true;

        // Immediately fade out any active falling stars
        document.querySelectorAll('.falling-star').forEach(function($fs) {
            $fs.style.transition = 'opacity 0.5s ease-out';
            $fs.style.opacity = '0';
            setTimeout(function() { if ($fs.parentNode) $fs.remove(); }, 600);
        });
        // Stop scheduling new falling stars
        if (fallingStarTimeout) {
            clearTimeout(fallingStarTimeout);
            fallingStarTimeout = null;
        }

        // Trigger suck-in animation
        document.body.classList.add('black-hole-active');

        // After suck-in animation (4.5s) + brief pause, show portal
        setTimeout(function() {
            var $portal = document.getElementById('black-hole-portal');
            $portal.setAttribute('aria-hidden', 'false');

            // Start music once inside the portal
            fadeInAudio(4000);

            var $scroll = document.getElementById('manifesto-scroll');
            $scroll.scrollTop = 0;

            var manualScrollTimeout = null;

            function startAutoScroll() {
                clearInterval(manifestoScrollInterval);
                manifestoScrollInterval = setInterval(function() {
                    if ($scroll.scrollTop >= $scroll.scrollHeight - $scroll.clientHeight - 2) {
                        clearInterval(manifestoScrollInterval);
                        // Auto-exit after reaching the end
                        setTimeout(function() { exitBlackHole(); }, 2500);
                    } else {
                        $scroll.scrollTop += 0.6;
                    }
                }, 16);
            }

            function onManualScroll() {
                clearInterval(manifestoScrollInterval);
                clearTimeout(manualScrollTimeout);
                // Resume auto-scroll 2s after user stops scrolling
                manualScrollTimeout = setTimeout(function() {
                    if (isInsideBlackHole) startAutoScroll();
                }, 2000);
            }

            $scroll.addEventListener('wheel', onManualScroll);
            $scroll.addEventListener('touchstart', onManualScroll);

            // Start auto-scroll after a pause
            setTimeout(function() { startAutoScroll(); }, 2000);
        }, 5000);
    }

    function exitBlackHole() {
        if (!isInsideBlackHole) return;

        clearInterval(manifestoScrollInterval);

        // Fade out audio
        fadeOutAudio(2000);

        var $portal = document.getElementById('black-hole-portal');
        $portal.setAttribute('aria-hidden', 'true');

        document.body.classList.remove('black-hole-active');
        isInsideBlackHole = false;

        // Resume falling stars
        scheduleFallingStar();
    }

    /* ─────────────────────────────────────────────────────────────
       Label Overlap Prevention
       ───────────────────────────────────────────────────────────── */

    function resolveOverlaps() {
        // Collect ALL visible labels: star labels + cloud labels
        const starLabels = $starsLayer.querySelectorAll('.regular-star .star-label');
        const cloudLabels = $cloudsLayer.querySelectorAll('.cloud-label');
        const items = [];

        starLabels.forEach(label => {
            if (label.classList.contains('label-bottom')) return;
            const rect = label.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                items.push({ el: label, rect: rect, type: 'star' });
            }
        });

        cloudLabels.forEach(label => {
            const rect = label.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                items.push({ el: label, rect: rect, type: 'cloud' });
            }
        });

        // Multiple passes of pairwise overlap resolution
        for (let pass = 0; pass < 5; pass++) {
            for (let i = 0; i < items.length; i++) {
                for (let j = i + 1; j < items.length; j++) {
                    const a = items[i].rect;
                    const b = items[j].rect;

                    const overlapX = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
                    const overlapY = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));

                    if (overlapX > 0 && overlapY > 0) {
                        // Prefer nudging the star label (keep cloud labels fixed)
                        const target = items[j].type === 'cloud' ? items[i] : items[j];

                        // Nudge in the direction that requires least movement
                        if (overlapY <= overlapX) {
                            const nudge = overlapY + 3;
                            const dir = (target.rect.top > items[i === target ? j : i].rect.top) ? 1 : -1;
                            target.el.style.transform += ` translateY(${nudge * dir}px)`;
                        } else {
                            const nudge = overlapX + 3;
                            const dir = (target.rect.left > items[i === target ? j : i].rect.left) ? 1 : -1;
                            target.el.style.transform += ` translateX(${nudge * dir}px)`;
                        }
                        target.rect = target.el.getBoundingClientRect();
                    }
                }
            }
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
        if (isAdminMode) return;
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
       Admin Mode — Konami Code (↑↑↓↓←→←→BA)
       ───────────────────────────────────────────────────────────── */

    var konamiSequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    var konamiIndex = 0;

    function setupKonamiListener() {
        document.addEventListener('keydown', function(e) {
            if (e.key === konamiSequence[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === konamiSequence.length) {
                    konamiIndex = 0;
                    toggleAdminMode();
                }
            } else {
                konamiIndex = 0;
            }
        });
    }

    function toggleAdminMode() {
        isAdminMode = !isAdminMode;
        document.body.classList.toggle('admin-mode', isAdminMode);
        var $coords = document.getElementById('admin-coords');
        if (isAdminMode) {
            console.log('%c🔧 Admin mode ON — drag stars to reposition, coords logged to console', 'color: #ff0; font-size: 14px');
            if ($coords) $coords.textContent = '🔧 admin mode — drag stars';
            showAdminPanel();
        } else {
            console.log('%c🔧 Admin mode OFF', 'color: #888');
            if ($coords) $coords.textContent = '';
            hideAdminPanel();
        }
    }

    function applySavedPositions() {
        var saved = {};
        try { saved = JSON.parse(localStorage.getItem('rcrd-admin-positions') || '{}'); } catch(e) { return; }
        if (Object.keys(saved).length === 0) return;

        // Apply star positions
        var allStars = $starsLayer.querySelectorAll('.star');
        allStars.forEach(function($star) {
            var id = $star.dataset.starId;
            if (saved[id]) {
                var leftPx = saved[id].x / 100 * config.universeWidth - $star.offsetWidth / 2;
                var topPx = saved[id].y / 100 * config.universeHeight - $star.offsetHeight / 2;
                $star.style.left = leftPx + 'px';
                $star.style.top = topPx + 'px';
            }
        });

        // Apply black hole position
        if (saved['black-hole']) {
            var $bh = document.getElementById('black-hole');
            if ($bh) {
                var s = blackHole.size;
                var leftPx = saved['black-hole'].x / 100 * config.universeWidth - s;
                var topPx = saved['black-hole'].y / 100 * config.universeHeight - s;
                $bh.style.left = leftPx + 'px';
                $bh.style.top = topPx + 'px';
                // Update CSS custom properties for suck-in animation
                document.documentElement.style.setProperty('--bh-x', saved['black-hole'].x + '%');
                document.documentElement.style.setProperty('--bh-y', saved['black-hole'].y + '%');
            }
        }

        // Apply cloud positions
        gasClouds.forEach(function(cloud) {
            var key = 'cloud-' + cloud.id;
            if (!saved[key]) return;
            var newX = saved[key].x / 100 * config.universeWidth;
            var newY = saved[key].y / 100 * config.universeHeight;
            var $glow = $cloudsLayer.querySelector('.gas-cloud[data-cloud-id="' + cloud.id + '"]');
            var $label = $cloudsLayer.querySelector('.cloud-label[data-cloud-id="' + cloud.id + '"]');
            if ($glow) {
                $glow.style.left = (newX - cloud.size / 2) + 'px';
                $glow.style.top = (newY - cloud.size / 2) + 'px';
            }
            if ($label) {
                $label.style.left = newX + 'px';
                $label.style.top = newY + 'px';
            }
        });
    }

    function showAdminPanel() {
        if (document.getElementById('admin-panel')) return;
        var panel = document.createElement('div');
        panel.id = 'admin-panel';
        panel.innerHTML = '<button id="admin-copy">copy all positions</button><button id="admin-reset">reset positions</button>';
        document.body.appendChild(panel);

        document.getElementById('admin-copy').addEventListener('click', function() {
            var saved = {};
            try { saved = JSON.parse(localStorage.getItem('rcrd-admin-positions') || '{}'); } catch(e) {}
            if (Object.keys(saved).length === 0) {
                alert('No positions saved yet. Drag some stars first!');
                return;
            }
            var lines = Object.keys(saved).map(function(id) {
                return "'" + id + "': { x: " + saved[id].x + ", y: " + saved[id].y + " }";
            });
            var text = lines.join('\n');
            navigator.clipboard.writeText(text).then(function() {
                alert('Copied ' + Object.keys(saved).length + ' position(s) to clipboard!');
            }).catch(function() {
                // Fallback: log to console
                console.log('Admin positions:\n' + text);
                alert('Logged to console (clipboard not available)');
            });
        });

        document.getElementById('admin-reset').addEventListener('click', function() {
            localStorage.removeItem('rcrd-admin-positions');
            // Re-render to restore original positions
            $starsLayer.innerHTML = '';
            $cloudsLayer.innerHTML = '';
            renderGasClouds();
            renderStars();
            renderCuriosityStars();
            renderBlackHole();
            resolveOverlaps();
            alert('Positions reset to defaults.');
        });
    }

    function hideAdminPanel() {
        var panel = document.getElementById('admin-panel');
        if (panel) panel.remove();
    }

    function setupAdminDragging() {
        var $coords = document.getElementById('admin-coords');

        // Star dragging
        $starsLayer.addEventListener('mousedown', function(e) {
            if (!isAdminMode) return;
            var $star = e.target.closest('.star');
            if (!$star) return;
            e.preventDefault();
            e.stopPropagation();

            var starRect = $star.getBoundingClientRect();
            var layerRect = $starsLayer.getBoundingClientRect();
            adminDragState = {
                type: 'star',
                el: $star,
                offsetX: e.clientX - starRect.left,
                offsetY: e.clientY - starRect.top,
                layerLeft: layerRect.left,
                layerTop: layerRect.top
            };
            $star.style.zIndex = '100';
        }, true);

        // Cloud dragging (label or glow)
        $cloudsLayer.addEventListener('mousedown', function(e) {
            if (!isAdminMode) return;
            var $label = e.target.closest('.cloud-label');
            var $glow = e.target.closest('.gas-cloud');
            if (!$label && !$glow) return;
            e.preventDefault();
            e.stopPropagation();

            var cloudId = $label ? $label.dataset.cloudId : $glow.dataset.cloudId;
            // Find both the label and glow for this cloud
            var $theLabel = $cloudsLayer.querySelector('.cloud-label[data-cloud-id="' + cloudId + '"]');
            var $theGlow = $cloudsLayer.querySelector('.gas-cloud[data-cloud-id="' + cloudId + '"]');

            var layerRect = $cloudsLayer.getBoundingClientRect();
            var grabRect = ($label || $glow).getBoundingClientRect();

            adminDragState = {
                type: 'cloud',
                cloudId: cloudId,
                label: $theLabel,
                glow: $theGlow,
                offsetX: e.clientX - grabRect.left,
                offsetY: e.clientY - grabRect.top,
                layerLeft: layerRect.left,
                layerTop: layerRect.top,
                // Store initial positions for both elements
                labelStartLeft: parseFloat($theLabel.style.left),
                labelStartTop: parseFloat($theLabel.style.top),
                glowStartLeft: parseFloat($theGlow.style.left),
                glowStartTop: parseFloat($theGlow.style.top),
                startClientX: e.clientX,
                startClientY: e.clientY
            };
            if ($theGlow) $theGlow.style.zIndex = '100';
            if ($theLabel) $theLabel.style.zIndex = '100';
        }, true);

        // Black hole dragging
        $starsLayer.addEventListener('mousedown', function(e) {
            if (!isAdminMode) return;
            var $bh = e.target.closest('.black-hole');
            if (!$bh) return;
            e.preventDefault();
            e.stopPropagation();

            var bhRect = $bh.getBoundingClientRect();
            var layerRect = $starsLayer.getBoundingClientRect();
            adminDragState = {
                type: 'blackhole',
                el: $bh,
                offsetX: e.clientX - bhRect.left,
                offsetY: e.clientY - bhRect.top,
                layerLeft: layerRect.left,
                layerTop: layerRect.top
            };
            $bh.style.zIndex = '100';
        }, true);

        document.addEventListener('mousemove', function(e) {
            if (!adminDragState) return;
            e.preventDefault();

            if (adminDragState.type === 'star') {
                var newLeft = e.clientX - adminDragState.layerLeft - adminDragState.offsetX;
                var newTop = e.clientY - adminDragState.layerTop - adminDragState.offsetY;
                adminDragState.el.style.left = newLeft + 'px';
                adminDragState.el.style.top = newTop + 'px';

                var centerX = newLeft + adminDragState.el.offsetWidth / 2;
                var centerY = newTop + adminDragState.el.offsetHeight / 2;
                var pctX = Math.round(centerX / config.universeWidth * 100);
                var pctY = Math.round(centerY / config.universeHeight * 100);
                if ($coords) {
                    $coords.textContent = adminDragState.el.dataset.starId + ': x: ' + pctX + ', y: ' + pctY;
                }
            } else if (adminDragState.type === 'cloud') {
                var dx = e.clientX - adminDragState.startClientX;
                var dy = e.clientY - adminDragState.startClientY;

                // Move both label and glow together
                if (adminDragState.label) {
                    adminDragState.label.style.left = (adminDragState.labelStartLeft + dx) + 'px';
                    adminDragState.label.style.top = (adminDragState.labelStartTop + dy) + 'px';
                }
                if (adminDragState.glow) {
                    adminDragState.glow.style.left = (adminDragState.glowStartLeft + dx) + 'px';
                    adminDragState.glow.style.top = (adminDragState.glowStartTop + dy) + 'px';
                }

                // Show percentage coords based on label center
                var labelLeft = adminDragState.labelStartLeft + dx;
                var pctX = Math.round(labelLeft / config.universeWidth * 100);
                var labelTop = adminDragState.labelStartTop + dy;
                var pctY = Math.round(labelTop / config.universeHeight * 100);
                if ($coords) {
                    $coords.textContent = 'cloud-' + adminDragState.cloudId + ': x: ' + pctX + ', y: ' + pctY;
                }
            } else if (adminDragState.type === 'blackhole') {
                var newLeft = e.clientX - adminDragState.layerLeft - adminDragState.offsetX;
                var newTop = e.clientY - adminDragState.layerTop - adminDragState.offsetY;
                adminDragState.el.style.left = newLeft + 'px';
                adminDragState.el.style.top = newTop + 'px';

                var s = blackHole.size;
                var centerX = newLeft + s;
                var centerY = newTop + s;
                var pctX = Math.round(centerX / config.universeWidth * 100);
                var pctY = Math.round(centerY / config.universeHeight * 100);
                if ($coords) {
                    $coords.textContent = 'black-hole: x: ' + pctX + ', y: ' + pctY;
                }
            }
        });

        document.addEventListener('mouseup', function() {
            if (!adminDragState) return;

            if (adminDragState.type === 'star') {
                var el = adminDragState.el;
                var centerX = parseFloat(el.style.left) + el.offsetWidth / 2;
                var centerY = parseFloat(el.style.top) + el.offsetHeight / 2;
                var pctX = Math.round(centerX / config.universeWidth * 100);
                var pctY = Math.round(centerY / config.universeHeight * 100);
                console.log("'" + el.dataset.starId + "': x: " + pctX + ", y: " + pctY);
                el.style.zIndex = '';

                // Save to localStorage
                var saved = {};
                try { saved = JSON.parse(localStorage.getItem('rcrd-admin-positions') || '{}'); } catch(e) {}
                saved[el.dataset.starId] = { x: pctX, y: pctY };
                localStorage.setItem('rcrd-admin-positions', JSON.stringify(saved));
            } else if (adminDragState.type === 'cloud') {
                var labelLeft = parseFloat(adminDragState.label.style.left);
                var labelTop = parseFloat(adminDragState.label.style.top);
                var pctX = Math.round(labelLeft / config.universeWidth * 100);
                var pctY = Math.round(labelTop / config.universeHeight * 100);
                console.log("cloud '" + adminDragState.cloudId + "': x: " + pctX + ", y: " + pctY);
                if (adminDragState.glow) adminDragState.glow.style.zIndex = '';
                if (adminDragState.label) adminDragState.label.style.zIndex = '';

                // Save cloud position to localStorage
                var saved = {};
                try { saved = JSON.parse(localStorage.getItem('rcrd-admin-positions') || '{}'); } catch(e) {}
                saved['cloud-' + adminDragState.cloudId] = { x: pctX, y: pctY };
                localStorage.setItem('rcrd-admin-positions', JSON.stringify(saved));
            } else if (adminDragState.type === 'blackhole') {
                var el = adminDragState.el;
                var s = blackHole.size;
                var centerX = parseFloat(el.style.left) + s;
                var centerY = parseFloat(el.style.top) + s;
                var pctX = Math.round(centerX / config.universeWidth * 100);
                var pctY = Math.round(centerY / config.universeHeight * 100);
                console.log("'black-hole': x: " + pctX + ", y: " + pctY);
                el.style.zIndex = '';

                // Save to localStorage
                var saved = {};
                try { saved = JSON.parse(localStorage.getItem('rcrd-admin-positions') || '{}'); } catch(e) {}
                saved['black-hole'] = { x: pctX, y: pctY };
                localStorage.setItem('rcrd-admin-positions', JSON.stringify(saved));
            }

            adminDragState = null;
        });

        // Prevent star/cloud modal from opening during drag
        $starsLayer.addEventListener('click', function(e) {
            if (isAdminMode) {
                e.stopPropagation();
            }
        }, true);
        $cloudsLayer.addEventListener('click', function(e) {
            if (isAdminMode) {
                e.stopPropagation();
            }
        }, true);
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

        // Black hole portal exit
        document.getElementById('portal-exit').addEventListener('click', exitBlackHole);

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (isInsideBlackHole) {
                    exitBlackHole();
                } else if ($tutorialOverlay.getAttribute('aria-hidden') === 'false') {
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


