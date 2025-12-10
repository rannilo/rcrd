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
    const $curiosityToggle = document.getElementById('curiosity-toggle');
    const $starModal = document.getElementById('star-modal');
    const $fallingModal = document.getElementById('falling-star-modal');

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
        // Use viewport dimensions with minimum sizes
        const minWidth = 900;
        const minHeight = 700;
        
        config.universeWidth = Math.max(window.innerWidth, minWidth);
        config.universeHeight = Math.max(window.innerHeight, minHeight);
        
        const universe = document.getElementById('universe');
        universe.style.width = config.universeWidth + 'px';
        universe.style.height = config.universeHeight + 'px';
        
        [$cloudsLayer, $starsLayer, $fallingStarsLayer].forEach(layer => {
            layer.style.width = config.universeWidth + 'px';
            layer.style.height = config.universeHeight + 'px';
        });
        
        // Handle resize
        window.addEventListener('resize', () => {
            config.universeWidth = Math.max(window.innerWidth, minWidth);
            config.universeHeight = Math.max(window.innerHeight, minHeight);
            
            universe.style.width = config.universeWidth + 'px';
            universe.style.height = config.universeHeight + 'px';
            
            [$cloudsLayer, $starsLayer, $fallingStarsLayer].forEach(layer => {
                layer.style.width = config.universeWidth + 'px';
                layer.style.height = config.universeHeight + 'px';
            });
        });
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
       Event Bindings
       ───────────────────────────────────────────────────────────── */
    
    function bindEvents() {
        // Curiosity toggle
        $curiosityToggle.addEventListener('click', toggleCuriosityMode);
        
        // Star modal close
        $starModal.querySelector('.modal-close').addEventListener('click', closeStarModal);
        $starModal.querySelector('.modal-backdrop').addEventListener('click', closeStarModal);
        
        // Falling star modal close on backdrop click
        $fallingModal.querySelector('.modal-backdrop').addEventListener('click', closeFallingStarModal);
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeStarModal();
                closeFallingStarModal();
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


