// Rotating Cube Animation
let angle = 0;
let innerColorCycle = 0;
let cubeAlpha = 0;
const isBlackTheme = Math.random() < 0.5;
let cubeVisible = false;

new p5((p) => {
    function resizeCanvasToContainer() {
        const container = document.getElementById('cube-container');
        const size = Math.min(container.offsetWidth, container.offsetHeight, 300);
        p.resizeCanvas(size, size);
    }

    p.setup = function () {
        const container = document.getElementById('cube-container');
        const size = Math.min(container.offsetWidth, container.offsetHeight, 300);
        p.createCanvas(size, size, p.WEBGL).parent(container);
        p.noFill();
        p.strokeWeight(1.5);
    };

    p.windowResized = resizeCanvasToContainer;

    p.keyPressed = function () {
        if (p.key === 's' || p.key === 'S') p.saveCanvas('screenshot', 'png');
    };

    p.draw = function () {
        const bgColor = isBlackTheme ? 0 : 80; // Even lighter space-age grey (80) instead of white (255)
        if (cubeVisible && cubeAlpha < 255) cubeAlpha += 2;
        p.background(bgColor); // Proper background color

        const camRadius = 850;
        const camX = p.cos(angle * 0.3) * camRadius;
        const camY = -100;
        const camZ = p.sin(angle * 0.3) * camRadius;
        p.camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);

        // Only draw cubes if cube is visible
        if (cubeVisible) {
            // Outer cube
            p.push();
            p.noFill();
            p.stroke(isBlackTheme ? p.color(255,255,255,cubeAlpha) : p.color(0,0,0,cubeAlpha));
            p.rotateX(angle * 0.5);
            p.rotateY(angle);
            p.box(360);
            p.pop();

            // Inner cube
            p.push();
            p.noFill();
            p.rotateX(-angle*0.8);
            p.rotateZ(angle*0.3);
            innerColorCycle += 0.01;
            if (innerColorCycle > p.TWO_PI) innerColorCycle = 0;

            let rC,gC,bC;
            const phase = innerColorCycle;
            if (isBlackTheme) {
                if (phase < p.TWO_PI/3){ const t = phase/(p.TWO_PI/3); rC=255; gC=255*(1-t); bC=255*(1-t); }
                else if (phase<(2*p.TWO_PI/3)){ const t=(phase-p.TWO_PI/3)/(p.TWO_PI/3); rC=255*(1-t); gC=0; bC=255*t; }
                else{ const t=(phase-2*p.TWO_PI/3)/(p.TWO_PI/3); rC=255*t; gC=255*t; bC=255; }
            } else {
                const yellow={r:255,g:248,b:34}, blue={r:34,g:136,b:255};
                if (phase<p.TWO_PI/3){ const t=phase/(p.TWO_PI/3); rC=yellow.r*t; gC=yellow.g*t; bC=yellow.b*t; }
                else if (phase<(2*p.TWO_PI/3)){ const t=(phase-p.TWO_PI/3)/(p.TWO_PI/3); rC=yellow.r+(blue.r-yellow.r)*t; gC=yellow.g+(blue.g-yellow.g)*t; bC=yellow.b+(blue.b-yellow.b)*t; }
                else{ const t=(phase-2*p.TWO_PI/3)/(p.TWO_PI/3); rC=blue.r*(1-t); gC=blue.g*(1-t); bC=blue.b*(1-t); }
            }
            p.stroke(p.color(rC,gC,bC,cubeAlpha));
            p.box(144);
            p.pop();
        }

        angle += 0.0065;
    };
}, document.getElementById('cube-container'));

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all sections and project cards
    const elementsToAnimate = document.querySelectorAll('section, .project-card');
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    // Header background on scroll
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    });
    
    // Enhanced hover effects to project cards
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.08)';
        });
    });
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
    
    // Enhanced click effects to project cards
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            // Add a subtle click animation
            this.style.transform = 'translateY(-8px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            }, 150);
        });
    });
    
    // Staggered animation sequence
    function startAnimationSequence() {
        // 1. First, set up the three words to start completely hidden
        const heroTitle = document.querySelector('.hero h1');
        if (heroTitle) {
            // Make container visible but keep words hidden initially
            heroTitle.style.opacity = '1';
            
            const movingTexts = heroTitle.querySelectorAll('.moving-text');
            movingTexts.forEach((text, index) => {
                // Set initial state for all words - completely hidden
                text.style.opacity = '0';
                text.style.transform = 'translateX(-30px)';
                text.style.transition = 'all 1.2s ease';
            });
        }
        
        // 2. Then animate each word individually (faster timing)
        setTimeout(() => {
            const movingTexts = document.querySelectorAll('.moving-text');
            movingTexts.forEach((text, index) => {
                setTimeout(() => {
                    text.style.opacity = '1';
                    text.style.transform = 'translateX(0)';
                }, 200 + (index * 400)); // 400ms delay between each word (faster)
            });
        }, 500);
        
        // 3. Show the cube and subtitle (Creative Technology & Complex Systems) immediately after "Antifragile" appears
        setTimeout(() => {
            // Show the cube
            cubeVisible = true;
            
            // Show the subtitle (Creative Technology & Complex Systems)
            const heroSubtitle = document.querySelector('.hero .subtitle');
            
            if (heroSubtitle) {
                heroSubtitle.style.opacity = '0';
                heroSubtitle.style.transform = 'translateX(-20px)';
                heroSubtitle.style.transition = 'all 1.2s ease';
                
                setTimeout(() => {
                    heroSubtitle.style.opacity = '1';
                    heroSubtitle.style.transform = 'translateX(0)';
                }, 200);
            }
        }, 1500); // Immediately after "Antifragile" appears (500 + 2*400 + 200ms)
        
        // 4. Then show the description (Certified by Santa Fe) coming up from the bottom slowly
        setTimeout(() => {
            const heroDescription = document.querySelector('.hero .description');
            
            if (heroDescription) {
                heroDescription.style.opacity = '0';
                heroDescription.style.transform = 'translateY(100px)';
                heroDescription.style.transition = 'all 2s ease';
                
                setTimeout(() => {
                    heroDescription.style.opacity = '1';
                    heroDescription.style.transform = 'translateY(0)';
                }, 200);
            }
        }, 3000); // A bit later after cube and subtitle appear
        
        // 5. Then show sections below
        setTimeout(() => {
            const sections = document.querySelectorAll('section:not(.hero)');
            sections.forEach((section, index) => {
                section.style.opacity = '0';
                section.style.transform = 'translateY(30px)';
                section.style.transition = 'all 1.2s ease';
                
                setTimeout(() => {
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                }, index * 400);
            });
        }, 5000); // After subtitle appears
        
        // 6. Finally show the rest of the content
        setTimeout(() => {
            const projectCards = document.querySelectorAll('.project-card');
            projectCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'all 0.8s ease';
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 150);
            });
        }, 10000); // After sections appear
    }
    
    // Start the animation sequence
    startAnimationSequence();
});

// Add some interactive elements
document.addEventListener('DOMContentLoaded', function() {
    // Enhanced hover effects for moving text
    const movingTexts = document.querySelectorAll('.moving-text');
    
    movingTexts.forEach((text, index) => {
        // Remove floating effects - keep text static initially
        text.style.transform = 'none';
        
        // Add enhanced hover effects
        text.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
            this.style.color = '#6366f1';
            this.style.textShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
        });
        
        text.addEventListener('mouseleave', function() {
            this.style.transform = 'none';
            this.style.color = '';
            this.style.textShadow = '';
        });
    });
    
    // Add subtle cursor trail effect (optional)
    let mouseX = 0, mouseY = 0;
    let ballX = 0, ballY = 0;
    const speed = 0.1;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animate() {
        ballX += (mouseX - ballX) * speed;
        ballY += (mouseY - ballY) * speed;
        
        // Create a subtle cursor trail effect
        const trail = document.createElement('div');
        trail.style.position = 'fixed';
        trail.style.left = ballX + 'px';
        trail.style.top = ballY + 'px';
        trail.style.width = '4px';
        trail.style.height = '4px';
        trail.style.background = 'rgba(0, 0, 0, 0.1)';
        trail.style.borderRadius = '50%';
        trail.style.pointerEvents = 'none';
        trail.style.zIndex = '9999';
        trail.style.transition = 'opacity 0.5s ease';
        
        document.body.appendChild(trail);
        
        setTimeout(() => {
            trail.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(trail);
            }, 500);
        }, 100);
        
        requestAnimationFrame(animate);
    }
    
    // Uncomment the line below to enable cursor trail effect
    // animate();
});