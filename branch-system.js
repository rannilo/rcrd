class BranchSystem {
    constructor(canvas, data) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.data = data;
        this.nodes = [];
        this.branches = [];
        this.hoveredNode = null;
        this.selectedNode = null;
        this.physicsEnabled = true;
        this.time = 0;
        this.hiddenTypes = new Set();
        
        // Panning
        this.isPanning = false;
        this.panX = 0;
        this.panY = 0;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        
        // Zooming
        this.scale = 1;
        this.minScale = 0.3;
        this.maxScale = 3;
        
        this.resize();
        this.initializeNodes();
        this.initializeBranches();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }
    
    initializeNodes() {
        // First pass: create all nodes
        this.data.nodes.forEach(nodeData => {
            let radius = 14;
            if (nodeData.type === 'root') radius = 25;
            if (nodeData.id === 'ea') radius = 20; // Make EA node larger
            if (nodeData.type === 'branch') radius = 18; // Branch nodes slightly larger
            
            const node = {
                ...nodeData,
                vx: 0,
                vy: 0,
                radius: radius,
                mass: nodeData.type === 'root' ? 10 : 1,
                children: []
            };
            this.nodes.push(node);
        });
        
        // Build hierarchy
        this.nodes.forEach(node => {
            if (node.parent) {
                const parentNode = this.nodes.find(n => n.id === node.parent);
                if (parentNode) {
                    parentNode.children.push(node);
                }
            }
        });
        
        // Position nodes using radial layout
        const root = this.nodes.find(n => n.type === 'root');
        root.x = this.centerX;
        root.y = this.centerY;
        root.fixed = true;
        root.depth = 0;
        
        // Get main branches (direct children of root)
        const mainBranches = this.nodes.filter(n => n.parent === 'root');
        
        // Custom angles for better spacing (EA gets more room)
        const customAngles = {
            'ea': -Math.PI * 0.3,           // Upper right with more space
            'utilitarianism': -Math.PI * 0.7,   // Upper left
            'consequentialism': -Math.PI * 0.9, // Left
            'rationality': 0,                    // Right (handled by EA's position)
            'meditation': Math.PI * 0.5,        // Bottom right
            'emotions': Math.PI * 0.8,          // Bottom left
        };
        
        mainBranches.forEach((branch, index) => {
            // Use custom angle if defined, otherwise distribute evenly
            let angle;
            let distance = 200;
            
            if (customAngles[branch.id]) {
                angle = customAngles[branch.id];
                // Give EA extra distance too
                if (branch.id === 'ea') {
                    distance = 250;
                }
            } else {
                // Fallback to even distribution
                const angleStep = (Math.PI * 2) / mainBranches.length;
                angle = index * angleStep - Math.PI / 2;
            }
            
            branch.x = this.centerX + Math.cos(angle) * distance;
            branch.y = this.centerY + Math.sin(angle) * distance;
            branch.angle = angle;
            branch.baseX = branch.x;
            branch.baseY = branch.y;
            branch.depth = 1;
            
            // Position children of this branch
            this.positionChildren(branch, angle, distance, 2);
        });
    }
    
    positionChildren(parentNode, parentAngle, parentDistance, depth = 1) {
        const children = parentNode.children;
        if (children.length === 0) return;
        
        // Special handling for nodes with many children (like EA)
        const isCrowded = children.length > 4;
        const isVeryDense = children.length > 6;
        
        // Calculate spread angle based on depth and number of children
        let spreadAngle;
        if (depth === 1) {
            // First level - already positioned radially
            spreadAngle = Math.PI / 3;
        } else if (isCrowded) {
            // Many children - use wider spread
            spreadAngle = Math.min(Math.PI * 0.8, Math.PI / 3 * (1 + children.length * 0.15));
        } else {
            // Few children - normal spread
            spreadAngle = Math.PI / 4 + (children.length * 0.1);
        }
        
        const startAngle = parentAngle - spreadAngle / 2;
        const angleStep = children.length > 1 ? spreadAngle / (children.length - 1) : 0;
        
        // Sort children by type to group similar nodes
        const sortedChildren = [...children].sort((a, b) => {
            const typeOrder = ['thinker', 'book', 'concept', 'experience', 'community'];
            return (typeOrder.indexOf(a.type) || 999) - (typeOrder.indexOf(b.type) || 999);
        });
        
        sortedChildren.forEach((child, index) => {
            const childAngle = children.length === 1 ? 
                parentAngle : 
                startAngle + index * angleStep;
            
            // Adaptive distance based on crowding and depth
            let distance;
            if (isVeryDense) {
                // Very crowded - use more distance and stagger
                distance = 180 + (index % 3) * 40 + depth * 20;
            } else if (isCrowded) {
                // Crowded - increase distance
                distance = 150 + (index % 2) * 30 + depth * 15;
            } else {
                // Normal spacing with slight variation
                distance = 120 + (index % 2) * 20 + depth * 10;
            }
            
            // Special positioning for specific nodes to avoid overlaps
            if (parentNode.id === 'ea') {
                // EA's children need special angles to avoid overlaps
                const specialAngles = {
                    'longtermism': parentNode.angle - 0.5,  // More upward
                    'rationality': parentNode.angle + 0.3,   // Slightly right
                    'singer': parentNode.angle - 0.2,        // Left
                    'macaskill': parentNode.angle,           // Center
                    'ord': parentNode.angle + 0.2            // Right
                };
                
                if (specialAngles[child.id]) {
                    const specialAngle = specialAngles[child.id];
                    distance += 60;
                    child.x = parentNode.x + Math.cos(specialAngle) * distance;
                    child.y = parentNode.y + Math.sin(specialAngle) * distance;
                    child.angle = specialAngle;
                } else {
                    distance += 40;
                    child.x = parentNode.x + Math.cos(childAngle) * distance;
                    child.y = parentNode.y + Math.sin(childAngle) * distance;
                    child.angle = childAngle;
                }
            } else if (parentNode.id === 'longtermism') {
                // Push AI Safety branch away from others
                if (child.id === 'ai-safety') {
                    const aiSafetyAngle = parentNode.angle - 0.6; // Push more upward/left
                    distance = 200; // Much more distance
                    child.x = parentNode.x + Math.cos(aiSafetyAngle) * distance;
                    child.y = parentNode.y + Math.sin(aiSafetyAngle) * distance;
                    child.angle = aiSafetyAngle;
                } else {
                    distance += 30;
                    child.x = parentNode.x + Math.cos(childAngle) * distance;
                    child.y = parentNode.y + Math.sin(childAngle) * distance;
                    child.angle = childAngle;
                }
            } else if (parentNode.id === 'rationality') {
                // Spread out rationality children to avoid AI Safety area
                const rationalityAngles = {
                    'lesswrong': parentNode.angle + 0.2,
                    'yudkowsky': parentNode.angle + 0.4,
                    'cfar': parentNode.angle + 0.6,      // Push CFAR more to the right
                    'post-rat': parentNode.angle + 0.8   // Push Post-rat even more right
                };
                
                if (rationalityAngles[child.id]) {
                    const specialAngle = rationalityAngles[child.id];
                    distance = child.id === 'post-rat' ? 180 : 140; // Post-rat further out
                    child.x = parentNode.x + Math.cos(specialAngle) * distance;
                    child.y = parentNode.y + Math.sin(specialAngle) * distance;
                    child.angle = specialAngle;
                } else {
                    child.x = parentNode.x + Math.cos(childAngle) * distance;
                    child.y = parentNode.y + Math.sin(childAngle) * distance;
                    child.angle = childAngle;
                }
            } else if (parentNode.id === 'ai-safety') {
                // AI Safety children in a clear vertical fan
                distance = 150 + (index * 20);
                const aiChildAngle = parentNode.angle - 0.3 + (index * 0.2);
                child.x = parentNode.x + Math.cos(aiChildAngle) * distance;
                child.y = parentNode.y + Math.sin(aiChildAngle) * distance;
                child.angle = aiChildAngle;
            } else {
                child.x = parentNode.x + Math.cos(childAngle) * distance;
                child.y = parentNode.y + Math.sin(childAngle) * distance;
                child.angle = childAngle;
            }
            
            child.baseX = child.x;
            child.baseY = child.y;
            child.depth = depth;
            
            // Recursively position children with depth tracking
            this.positionChildren(child, child.angle, distance, depth + 1);
        });
    }
    
    initializeBranches() {
        // Create branches from parent-child relationships
        this.nodes.forEach(node => {
            if (node.parent) {
                const parentNode = this.nodes.find(n => n.id === node.parent);
                if (parentNode) {
                    this.branches.push({
                        from: parentNode,
                        to: node,
                        strength: 1,
                        controlPoints: this.generateControlPoints(parentNode, node)
                    });
                }
            }
        });
        
        // Add cross-connections
        this.data.connections.forEach(conn => {
            const fromNode = this.nodes.find(n => n.id === conn.from);
            const toNode = this.nodes.find(n => n.id === conn.to);
            if (fromNode && toNode) {
                this.branches.push({
                    from: fromNode,
                    to: toNode,
                    strength: conn.strength,
                    isConnection: true,
                    controlPoints: this.generateControlPoints(fromNode, toNode)
                });
            }
        });
    }
    
    generateControlPoints(from, to) {
        // For straighter lines with minimal curve
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Check if this is a cross-connection (not parent-child)
        const isConnection = !this.data.nodes.find(n => 
            (n.id === to.id && n.parent === from.id) || 
            (n.id === from.id && n.parent === to.id)
        );
        
        if (isConnection) {
            // Cross-connections get more curve to avoid main branches
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;
            
            // Calculate unique offset based on node pair
            const hash = (from.id + to.id).split('').reduce((a, b) => {
                return ((a << 5) - a) + b.charCodeAt(0);
            }, 0);
            
            const curveDirection = hash % 2 === 0 ? 1 : -1;
            const curveAmount = 0.3 + (Math.abs(hash) % 3) * 0.1;
            
            const perpX = -(dy / distance) * distance * curveAmount * curveDirection;
            const perpY = (dx / distance) * distance * curveAmount * curveDirection;
            
            return [
                {
                    x: midX + perpX,
                    y: midY + perpY
                },
                {
                    x: midX + perpX * 0.5,
                    y: midY + perpY * 0.5
                }
            ];
        } else {
            // Parent-child connections with subtle organic curve
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;
            
            // Very subtle perpendicular offset for organic feel
            const perpX = -(dy / distance) * 15;
            const perpY = (dx / distance) * 15;
            
            return [
                {
                    x: midX + perpX * 0.3 + (Math.random() - 0.5) * 5,
                    y: midY + perpY * 0.3 + (Math.random() - 0.5) * 5
                },
                {
                    x: midX + perpX * 0.1 + (Math.random() - 0.5) * 5,
                    y: midY + perpY * 0.1 + (Math.random() - 0.5) * 5
                }
            ];
        }
    }
    
    update() {
        if (this.physicsEnabled) {
            this.time += 0.01;
            
            // Apply forces
            this.nodes.forEach(node => {
                if (node.fixed) return;
                
                // Keep nodes close to their base positions
                const dx = node.baseX - node.x;
                const dy = node.baseY - node.y;
                
                // Very gentle spring back to base
                node.vx += dx * 0.003;
                node.vy += dy * 0.003;
                
                // Minimal repulsion from very close nodes only
                this.nodes.forEach(other => {
                    if (node === other) return;
                    const dx = node.x - other.x;
                    const dy = node.y - other.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 35 && dist > 0) {  // Only very close nodes
                        const force = (35 - dist) / dist * 0.01;
                        node.vx += dx * force;
                        node.vy += dy * force;
                    }
                });
                
                // Repulsion from lines (line hitbox)
                this.branches.forEach(branch => {
                    // Get distance from node to line segment
                    const lineDist = this.getDistanceToLine(
                        node.x, node.y, 
                        branch.from.x, branch.from.y,
                        branch.to.x, branch.to.y
                    );
                    
                    if (lineDist < 30 && branch.from !== node && branch.to !== node) {
                        // Calculate perpendicular force away from line
                        const perpForce = this.getPerpendicularForce(
                            node.x, node.y,
                            branch.from.x, branch.from.y,
                            branch.to.x, branch.to.y
                        );
                        const strength = (30 - lineDist) / 30 * 0.03;
                        node.vx += perpForce.x * strength;
                        node.vy += perpForce.y * strength;
                    }
                });
                
                // Tiny organic motion (only for visible nodes)
                if (!this.isNodeHidden(node)) {
                    node.vx += Math.sin(this.time + node.x * 0.01) * 0.0005;
                    node.vy += Math.cos(this.time + node.y * 0.01) * 0.0005;
                }
                
                // Extra strong damping
                node.vx *= 0.3;
                node.vy *= 0.3;
                node.x += node.vx;
                node.y += node.vy;
            });
            
            // Update branch control points with line avoidance
            this.branches.forEach((branch, i) => {
                branch.controlPoints.forEach(cp => {
                    // Organic movement
                    let cpVx = Math.sin(this.time * 2 + cp.x * 0.01) * 0.005;
                    let cpVy = Math.cos(this.time * 2 + cp.y * 0.01) * 0.005;
                    
                    // Check distance to other branches
                    this.branches.forEach((otherBranch, j) => {
                        if (i === j) return;
                        
                        const dist = this.getDistanceToLine(
                            cp.x, cp.y,
                            otherBranch.from.x, otherBranch.from.y,
                            otherBranch.to.x, otherBranch.to.y
                        );
                        
                        if (dist < 40) {
                            const perpForce = this.getPerpendicularForce(
                                cp.x, cp.y,
                                otherBranch.from.x, otherBranch.from.y,
                                otherBranch.to.x, otherBranch.to.y
                            );
                            const strength = (40 - dist) / 40 * 0.02;
                            cpVx += perpForce.x * strength;
                            cpVy += perpForce.y * strength;
                        }
                    });
                    
                    cp.x += cpVx;
                    cp.y += cpVy;
                });
            });
        } else {
            // When physics is off, still allow nodes to settle back to base positions
            this.nodes.forEach(node => {
                if (node.fixed) return;
                
                const dx = node.baseX - node.x;
                const dy = node.baseY - node.y;
                
                // Smoothly return to base position
                node.x += dx * 0.1;
                node.y += dy * 0.1;
                
                // Reset velocities
                node.vx = 0;
                node.vy = 0;
            });
        }
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Apply transformations
        this.ctx.save();
        this.ctx.translate(this.panX, this.panY);
        this.ctx.scale(this.scale, this.scale);
        
        // Draw connections first (behind branches)
        this.branches.filter(b => b.isConnection).forEach(branch => {
            if (!this.isNodeHidden(branch.from) && !this.isNodeHidden(branch.to)) {
                this.drawBranch(branch, true);
            }
        });
        
        // Draw main branches
        this.branches.filter(b => !b.isConnection).forEach(branch => {
            if (!this.isNodeHidden(branch.from) && !this.isNodeHidden(branch.to)) {
                this.drawBranch(branch, false);
            }
        });
        
        // Draw nodes
        this.nodes.forEach(node => {
            if (!this.isNodeHidden(node)) {
                this.drawNode(node);
            }
        });
        
        // Draw labels (all visible)
        this.nodes.forEach(node => {
            if (!this.isNodeHidden(node)) {
                this.drawLabel(node);
            }
        });
        
        this.ctx.restore();
    }
    
    isNodeHidden(node) {
        return this.hiddenTypes.has(node.type);
    }
    
    toggleNodeType(type) {
        if (this.hiddenTypes.has(type)) {
            this.hiddenTypes.delete(type);
        } else {
            this.hiddenTypes.add(type);
        }
    }
    
    drawBranch(branch, isConnection) {
        const gradient = this.ctx.createLinearGradient(
            branch.from.x, branch.from.y,
            branch.to.x, branch.to.y
        );
        
        if (isConnection) {
            gradient.addColorStop(0, 'rgba(126, 179, 70, 0.08)');
            gradient.addColorStop(1, 'rgba(74, 124, 46, 0.05)');
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 0.5 * branch.strength;
            this.ctx.setLineDash([3, 12]);
        } else {
            // Parent-child connections
            gradient.addColorStop(0, 'rgba(126, 179, 70, 0.6)');
            gradient.addColorStop(1, 'rgba(74, 124, 46, 0.3)');
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 3;
            this.ctx.setLineDash([]);
        }
        
        this.ctx.beginPath();
        this.ctx.moveTo(branch.from.x, branch.from.y);
        
        // Draw organic curve with consistent control points
        const cp1 = branch.controlPoints[0];
        const cp2 = branch.controlPoints[1];
        this.ctx.bezierCurveTo(
            cp1.x, cp1.y,
            cp2.x, cp2.y,
            branch.to.x, branch.to.y
        );
        
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }
    
    drawNode(node) {
        const color = nodeColors[node.type] || nodeColors.default;
        const isHovered = this.hoveredNode === node;
        const isSelected = this.selectedNode === node;
        const isPoetryNode = node.id === 'poetry';
        const isMindNode = node.type === 'root';
        
        // Special pulsing glow for poetry node
        if (isPoetryNode) {
            const baseIntensity = 0.2 + 0.15 * Math.sin(this.time * 1.5);
            const baseGlowSize = 30 + 8 * Math.sin(this.time * 1.2);
            
            // Go crazy on hover!
            const pulseIntensity = isHovered ? 
                0.6 + 0.4 * Math.sin(this.time * 8) + 0.2 * Math.sin(this.time * 12) :
                baseIntensity;
            const glowSize = isHovered ?
                50 + 25 * Math.sin(this.time * 6) + 10 * Math.sin(this.time * 15) :
                baseGlowSize;
                
            const gradient = this.ctx.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, glowSize
            );
            
            if (isHovered) {
                gradient.addColorStop(0, `rgba(255, 215, 0, ${pulseIntensity * 0.8})`);
                gradient.addColorStop(0.2, `rgba(255, 165, 0, ${pulseIntensity * 0.6})`);
                gradient.addColorStop(0.5, `rgba(255, 105, 180, ${pulseIntensity * 0.4})`);
                gradient.addColorStop(0.8, `rgba(126, 179, 70, ${pulseIntensity * 0.2})`);
                gradient.addColorStop(1, 'rgba(126, 179, 70, 0)');
            } else {
                gradient.addColorStop(0, `rgba(255, 215, 0, ${pulseIntensity * 0.3})`);
                gradient.addColorStop(0.4, `rgba(255, 165, 0, ${pulseIntensity * 0.2})`);
                gradient.addColorStop(0.8, `rgba(126, 179, 70, ${pulseIntensity * 0.1})`);
                gradient.addColorStop(1, 'rgba(126, 179, 70, 0)');
            }
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(node.x - glowSize, node.y - glowSize, glowSize * 2, glowSize * 2);
        }
        
        // Special pulsing glow for mind (root) node
        if (isMindNode && !isPoetryNode) {
            const baseIntensity = 0.25 + 0.12 * Math.sin(this.time * 1.3);
            const baseGlowSize = 40 + 10 * Math.sin(this.time * 0.9);
            
            // Mind gets excited on hover too!
            const pulseIntensity = isHovered ?
                0.7 + 0.3 * Math.sin(this.time * 7) + 0.15 * Math.sin(this.time * 11) :
                baseIntensity;
            const glowSize = isHovered ?
                60 + 30 * Math.sin(this.time * 5) + 15 * Math.sin(this.time * 13) :
                baseGlowSize;
                
            const gradient = this.ctx.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, glowSize
            );
            
            if (isHovered) {
                gradient.addColorStop(0, `rgba(70, 130, 180, ${pulseIntensity * 0.7})`);
                gradient.addColorStop(0.2, `rgba(100, 149, 237, ${pulseIntensity * 0.5})`);
                gradient.addColorStop(0.4, `rgba(138, 43, 226, ${pulseIntensity * 0.4})`);
                gradient.addColorStop(0.7, `rgba(126, 179, 70, ${pulseIntensity * 0.2})`);
                gradient.addColorStop(1, 'rgba(126, 179, 70, 0)');
            } else {
                gradient.addColorStop(0, `rgba(70, 130, 180, ${pulseIntensity * 0.25})`);
                gradient.addColorStop(0.3, `rgba(100, 149, 237, ${pulseIntensity * 0.18})`);
                gradient.addColorStop(0.7, `rgba(126, 179, 70, ${pulseIntensity * 0.12})`);
                gradient.addColorStop(1, 'rgba(126, 179, 70, 0)');
            }
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(node.x - glowSize, node.y - glowSize, glowSize * 2, glowSize * 2);
        }
        
        // Regular glow effect for hovered/selected nodes
        if ((isHovered || isSelected) && !isPoetryNode && !isMindNode) {
            const glowSize = isSelected ? 40 : 30;
            const gradient = this.ctx.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, glowSize
            );
            gradient.addColorStop(0, 'rgba(126, 179, 70, 0.3)');
            gradient.addColorStop(1, 'rgba(126, 179, 70, 0)');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(node.x - glowSize, node.y - glowSize, glowSize * 2, glowSize * 2);
        }
        
        // Node circle with special poetry styling
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        
        // Border with poetry and mind enhancement
        if (isPoetryNode) {
            const pulseWidth = isHovered ?
                3 + 2.5 * Math.sin(this.time * 10) + 1 * Math.sin(this.time * 18) :
                2 + 0.8 * Math.sin(this.time * 2.5);
            const opacity = isHovered ?
                0.9 + 0.1 * Math.sin(this.time * 8) :
                0.6 + 0.15 * Math.sin(this.time * 2);
            this.ctx.strokeStyle = `rgba(255, 215, 0, ${opacity})`;
            this.ctx.lineWidth = pulseWidth;
        } else if (isMindNode) {
            const pulseWidth = isHovered ?
                3 + 2 * Math.sin(this.time * 9) + 1 * Math.sin(this.time * 16) :
                2 + 0.6 * Math.sin(this.time * 1.8);
            const opacity = isHovered ?
                0.95 + 0.05 * Math.sin(this.time * 7) :
                0.7 + 0.12 * Math.sin(this.time * 1.6);
            this.ctx.strokeStyle = `rgba(70, 130, 180, ${opacity})`;
            this.ctx.lineWidth = pulseWidth;
        } else {
            this.ctx.strokeStyle = isHovered ? '#ffffff' : 'rgba(143, 188, 143, 0.5)';
            this.ctx.lineWidth = isHovered ? 3 : 2;
        }
        this.ctx.stroke();
        
        // Inner detail
        if (isMindNode && !isPoetryNode) {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius * 0.6, 0, Math.PI * 2);
            this.ctx.strokeStyle = `rgba(70, 130, 180, ${0.5 + 0.08 * Math.sin(this.time * 2.2)})`;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        }
        
        // Special inner glow for poetry node
        if (isPoetryNode) {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius * 0.7, 0, Math.PI * 2);
            const innerOpacity = isHovered ?
                0.8 + 0.2 * Math.sin(this.time * 12) :
                0.3 + 0.1 * Math.sin(this.time * 3);
            this.ctx.strokeStyle = `rgba(255, 215, 0, ${innerOpacity})`;
            this.ctx.lineWidth = isHovered ? 2 : 1;
            this.ctx.stroke();
        }
    }
    
    drawLabel(node) {
        const isHovered = this.hoveredNode === node;
        const fontSize = node.type === 'root' ? 10 : 8;
        const hoveredSize = fontSize + 2;
        this.ctx.font = isHovered ? `bold ${hoveredSize}px Courier New` : `bold ${fontSize}px Courier New`;
        
        // Find optimal label position
        const labelPosition = this.findBestLabelPosition(node);
        
        // Add text background for better readability
        const textWidth = this.ctx.measureText(node.label).width;
        this.ctx.fillStyle = 'rgba(13, 31, 13, 0.85)';
        this.ctx.fillRect(
            labelPosition.x - textWidth/2 - 3, 
            labelPosition.y - 10, 
            textWidth + 6, 
            14
        );
        
        // Draw text with depth-based opacity
        const baseOpacity = node.depth ? Math.max(0.5, 1 - node.depth * 0.15) : 0.8;
        const opacity = isHovered ? 1 : baseOpacity;
        this.ctx.fillStyle = `rgba(143, 188, 143, ${opacity})`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(node.label, labelPosition.x, labelPosition.y);
    }
    
    findBestLabelPosition(node) {
        // Try different positions around the node
        const positions = [
            { x: node.x, y: node.y - node.radius - 12, score: 0 }, // Top
            { x: node.x, y: node.y + node.radius + 18, score: 0 }, // Bottom
            { x: node.x - node.radius - 30, y: node.y, score: 0 }, // Left
            { x: node.x + node.radius + 30, y: node.y, score: 0 }, // Right
            { x: node.x - node.radius * 0.7, y: node.y - node.radius * 0.7 - 10, score: 0 }, // Top-left
            { x: node.x + node.radius * 0.7, y: node.y - node.radius * 0.7 - 10, score: 0 }, // Top-right
        ];
        
        const textWidth = this.ctx.measureText(node.label).width;
        const textHeight = 14;
        
        // Score each position based on overlap with other labels and nodes
        positions.forEach(pos => {
            this.nodes.forEach(other => {
                if (node === other || this.isNodeHidden(other)) return;
                
                // Check overlap with other nodes
                const nodeDist = Math.sqrt(
                    Math.pow(pos.x - other.x, 2) + 
                    Math.pow(pos.y - other.y, 2)
                );
                
                if (nodeDist < other.radius + 20) {
                    pos.score += 100; // Heavy penalty for overlapping nodes
                }
                
                // Check overlap with other labels (approximate)
                const labelDist = Math.sqrt(
                    Math.pow(pos.x - other.x, 2) + 
                    Math.pow(pos.y - (other.y - other.radius - 12), 2)
                );
                
                if (labelDist < textWidth/2 + 20) {
                    pos.score += 50; // Penalty for overlapping labels
                }
                
                // Penalty for being too close to branches
                this.branches.forEach(branch => {
                    const branchDist = this.getDistanceToLine(
                        pos.x, pos.y,
                        branch.from.x, branch.from.y,
                        branch.to.x, branch.to.y
                    );
                    if (branchDist < 15) {
                        pos.score += 30;
                    }
                });
            });
            
            // Prefer positions based on node's angle from center
            if (node.angle !== undefined) {
                const preferredX = node.x + Math.cos(node.angle) * (node.radius + 20);
                const preferredY = node.y + Math.sin(node.angle) * (node.radius + 20);
                const distFromPreferred = Math.sqrt(
                    Math.pow(pos.x - preferredX, 2) + 
                    Math.pow(pos.y - preferredY, 2)
                );
                pos.score += distFromPreferred * 0.1;
            }
        });
        
        // Return position with lowest score (least overlap)
        return positions.reduce((best, pos) => 
            pos.score < best.score ? pos : best
        );
    }
    
    getNodeAt(x, y) {
        // Adjust for pan and scale
        const adjustedX = (x - this.panX) / this.scale;
        const adjustedY = (y - this.panY) / this.scale;
        
        for (let node of this.nodes) {
            const dx = adjustedX - node.x;
            const dy = adjustedY - node.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist <= node.radius + 5) {
                return node;
            }
        }
        return null;
    }
    
    zoom(deltaY, mouseX, mouseY) {
        const scaleFactor = deltaY > 0 ? 0.9 : 1.1;
        const newScale = this.scale * scaleFactor;
        
        // Clamp scale
        if (newScale < this.minScale || newScale > this.maxScale) return;
        
        // Calculate mouse position in world coordinates before zoom
        const worldX = (mouseX - this.panX) / this.scale;
        const worldY = (mouseY - this.panY) / this.scale;
        
        // Apply new scale
        this.scale = newScale;
        
        // Calculate new pan to keep mouse position fixed
        this.panX = mouseX - worldX * this.scale;
        this.panY = mouseY - worldY * this.scale;
    }
    
    startPan(x, y) {
        this.isPanning = true;
        this.lastMouseX = x;
        this.lastMouseY = y;
    }
    
    updatePan(x, y) {
        if (this.isPanning) {
            const dx = x - this.lastMouseX;
            const dy = y - this.lastMouseY;
            this.panX += dx;
            this.panY += dy;
            this.lastMouseX = x;
            this.lastMouseY = y;
        }
    }
    
    endPan() {
        this.isPanning = false;
    }
    
    setHoveredNode(node) {
        this.hoveredNode = node;
    }
    
    setSelectedNode(node) {
        this.selectedNode = node;
    }
    
    togglePhysics() {
        this.physicsEnabled = !this.physicsEnabled;
    }
    
    reset() {
        this.panX = 0;
        this.panY = 0;
        this.scale = 1;
        this.nodes.forEach(node => {
            if (!node.fixed) {
                node.x = node.baseX;
                node.y = node.baseY;
                node.vx = 0;
                node.vy = 0;
            }
        });
        this.branches.forEach(branch => {
            branch.controlPoints = this.generateControlPoints(branch.from, branch.to);
        });
    }
    
    // Calculate distance from point to line segment
    getDistanceToLine(px, py, x1, y1, x2, y2) {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;
        
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;
        
        if (lenSq !== 0) {
            param = dot / lenSq;
        }
        
        let xx, yy;
        
        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }
        
        const dx = px - xx;
        const dy = py - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    // Get perpendicular force away from line
    getPerpendicularForce(px, py, x1, y1, x2, y2) {
        // Line direction vector
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.sqrt(dx * dx + dy * dy);
        
        if (len === 0) return { x: 0, y: 0 };
        
        // Normalized perpendicular vector
        const perpX = -dy / len;
        const perpY = dx / len;
        
        // Determine which side of the line the point is on
        const side = ((px - x1) * perpX + (py - y1) * perpY) > 0 ? 1 : -1;
        
        return {
            x: perpX * side,
            y: perpY * side
        };
    }
}