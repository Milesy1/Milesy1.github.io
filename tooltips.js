// Enhanced Tooltip Functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Add keyboard accessibility for tooltips
    const tooltips = document.querySelectorAll('.tooltip');
    
    tooltips.forEach(tooltip => {
        // Add ARIA attributes for accessibility
        tooltip.setAttribute('aria-describedby', tooltip.id || 'tooltip-' + Math.random().toString(36).substr(2, 9));
        tooltip.setAttribute('tabindex', '0');
        
        // Handle keyboard events
        tooltip.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTooltip(this);
            }
        });
        
        // Handle focus events for keyboard users
        tooltip.addEventListener('focus', function() {
            this.classList.add('tooltip-focus');
        });
        
        tooltip.addEventListener('blur', function() {
            this.classList.remove('tooltip-focus');
        });
    });
    
    // Mobile touch support
    if ('ontouchstart' in window) {
        tooltips.forEach(tooltip => {
            let touchTimer;
            
            tooltip.addEventListener('touchstart', function(e) {
                e.preventDefault();
                touchTimer = setTimeout(() => {
                    showTooltip(this);
                }, 500); // Show after 500ms hold
            });
            
            tooltip.addEventListener('touchend', function(e) {
                e.preventDefault();
                clearTimeout(touchTimer);
                hideTooltip(this);
            });
            
            tooltip.addEventListener('touchmove', function() {
                clearTimeout(touchTimer);
            });
        });
    }
    
    // Auto-hide tooltips when scrolling
    let scrollTimer;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            hideAllTooltips();
        }, 150);
    });
    
    // Hide tooltips when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.tooltip')) {
            hideAllTooltips();
        }
    });
    
    // Function to toggle tooltip visibility
    function toggleTooltip(tooltip) {
        const tooltipText = tooltip.querySelector('.tooltiptext');
        if (tooltipText) {
            const isVisible = tooltipText.style.visibility === 'visible';
            if (isVisible) {
                hideTooltip(tooltip);
            } else {
                showTooltip(tooltip);
            }
        }
    }
    
    // Function to show tooltip
    function showTooltip(tooltip) {
        const tooltipText = tooltip.querySelector('.tooltiptext');
        if (tooltipText) {
            hideAllTooltips(); // Hide other tooltips first
            tooltipText.style.visibility = 'visible';
            tooltipText.style.opacity = '1';
            tooltipText.style.transform = 'translateY(0)';
        }
    }
    
    // Function to hide tooltip
    function hideTooltip(tooltip) {
        const tooltipText = tooltip.querySelector('.tooltiptext');
        if (tooltipText) {
            tooltipText.style.visibility = 'hidden';
            tooltipText.style.opacity = '0';
            tooltipText.style.transform = 'translateY(10px)';
        }
    }
    
    // Function to hide all tooltips
    function hideAllTooltips() {
        tooltips.forEach(tooltip => {
            hideTooltip(tooltip);
        });
    }
    
    // Add tooltip analytics (optional)
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', function() {
            // Track tooltip usage for analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'tooltip_view', {
                    'tooltip_text': this.querySelector('.tooltiptext')?.textContent?.substring(0, 50) || 'unknown'
                });
            }
        });
    });
    
    // Dynamic tooltip positioning for edge cases
    function adjustTooltipPosition(tooltip) {
        const tooltipText = tooltip.querySelector('.tooltiptext');
        if (!tooltipText) return;
        
        const rect = tooltip.getBoundingClientRect();
        const tooltipRect = tooltipText.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Check if tooltip goes off screen and adjust position
        if (rect.left + tooltipRect.width > viewportWidth) {
            tooltip.classList.add('tooltip-left');
        } else if (rect.right - tooltipRect.width < 0) {
            tooltip.classList.add('tooltip-right');
        }
        
        if (rect.top - tooltipRect.height < 0) {
            tooltip.classList.add('tooltip-bottom');
        }
    }
    
    // Apply positioning adjustments on hover
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', function() {
            setTimeout(() => adjustTooltipPosition(this), 10);
        });
    });
});

// CSS for focus states and mobile enhancements
const additionalStyles = `
    .tooltip-focus {
        outline: 2px solid #6366f1;
        outline-offset: 2px;
    }
    
    .tooltip-bottom .tooltiptext {
        top: 125%;
        bottom: auto;
    }
    
    .tooltip-bottom .tooltiptext::after {
        top: -5px;
        bottom: auto;
        border-color: transparent transparent rgba(0, 0, 0, 0.9) transparent;
    }
    
    @media (max-width: 768px) {
        .tooltip {
            touch-action: manipulation;
        }
        
        .tooltip .tooltiptext {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90vw;
            max-width: 300px;
            z-index: 10000;
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
