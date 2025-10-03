// PWA Initialization Script for Miles Waite Portfolio
class PWAManager {
    constructor() {
        this.isInstalled = false;
        this.deferredPrompt = null;
        this.installButton = null;
        this.init();
    }
    
    init() {
        // Check if PWA is already installed
        this.checkInstallationStatus();
        
        // Register service worker
        this.registerServiceWorker();
        
        // Set up install prompt
        this.setupInstallPrompt();
        
        // Set up update notifications
        this.setupUpdateNotifications();
        
        // Add PWA meta tags
        this.addPWAMetaTags();
        
        // Initialize install button
        this.initInstallButton();
    }
    
    checkInstallationStatus() {
        // Check if running as PWA
        if (window.matchMedia('(display-mode: standalone)').matches || 
            window.navigator.standalone === true) {
            this.isInstalled = true;
            console.log('PWA: Running as installed app');
            this.onPWAInstalled();
        }
    }
    
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('PWA: Service Worker registered successfully:', registration);
                        this.onServiceWorkerRegistered(registration);
                    })
                    .catch(error => {
                        console.error('PWA: Service Worker registration failed:', error);
                    });
            });
        }
    }
    
    setupInstallPrompt() {
        // Listen for beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('PWA: Install prompt available');
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });
        
        // Listen for appinstalled event
        window.addEventListener('appinstalled', () => {
            console.log('PWA: App installed successfully');
            this.isInstalled = true;
            this.hideInstallButton();
            this.onPWAInstalled();
        });
    }
    
    setupUpdateNotifications() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                console.log('PWA: New service worker activated');
                this.showUpdateNotification();
            });
        }
    }
    
    addPWAMetaTags() {
        // Add theme color meta tag
        if (!document.querySelector('meta[name="theme-color"]')) {
            const themeColor = document.createElement('meta');
            themeColor.name = 'theme-color';
            themeColor.content = '#6366f1';
            document.head.appendChild(themeColor);
        }
        
        // Add mobile-web-app-capable (modern standard)
        if (!document.querySelector('meta[name="mobile-web-app-capable"]')) {
            const mobileCapable = document.createElement('meta');
            mobileCapable.name = 'mobile-web-app-capable';
            mobileCapable.content = 'yes';
            document.head.appendChild(mobileCapable);
        }
        
        // Add apple-mobile-web-app-status-bar-style
        if (!document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')) {
            const appleStatusBar = document.createElement('meta');
            appleStatusBar.name = 'apple-mobile-web-app-status-bar-style';
            appleStatusBar.content = 'default';
            document.head.appendChild(appleStatusBar);
        }
        
        // Add apple-mobile-web-app-title
        if (!document.querySelector('meta[name="apple-mobile-web-app-title"]')) {
            const appleTitle = document.createElement('meta');
            appleTitle.name = 'apple-mobile-web-app-title';
            appleTitle.content = 'Miles Waite';
            document.head.appendChild(appleTitle);
        }
    }
    
    initInstallButton() {
        // Create install button if it doesn't exist
        if (!document.getElementById('pwa-install-button')) {
            this.createInstallButton();
        }
        
        // Show button for testing (remove this later)
        setTimeout(() => {
            this.showInstallButton();
        }, 2000);
        
        // Debug: Check PWA status every 30 seconds
        setInterval(() => {
            console.log('PWA Status Check:');
            console.log('- Service Worker:', navigator.serviceWorker ? 'Supported' : 'Not supported');
            console.log('- Manifest:', document.querySelector('link[rel="manifest"]') ? 'Found' : 'Missing');
            console.log('- Deferred Prompt:', this.deferredPrompt ? 'Available' : 'Not available');
            console.log('- Already Installed:', this.isInstalled);
            console.log('- Display Mode:', window.matchMedia('(display-mode: standalone)').matches ? 'Standalone' : 'Browser');
        }, 30000);
        
        // Also add a manual trigger for testing
        window.showPWAButton = () => {
            this.showInstallButton();
        };
        
        // Debug: Log button creation
        console.log('PWA Manager initialized');
        console.log('Install button created:', !!this.installButton);
    }
    
    createInstallButton() {
        const installButton = document.createElement('button');
        installButton.id = 'pwa-install-button';
        installButton.className = 'pwa-install-btn';
        installButton.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            <span>Install App</span>
        `;
        
        // Add styles that match your site's aesthetic
        const style = document.createElement('style');
        style.textContent = `
            .pwa-install-btn {
                position: fixed;
                bottom: 30px;
                right: 30px;
                background: rgba(255, 255, 255, 0.95);
                color: #000;
                border: 1px solid rgba(0, 0, 0, 0.1);
                border-radius: 12px;
                padding: 12px 16px;
                font-size: 0.85rem;
                font-weight: 500;
                cursor: pointer;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                backdrop-filter: blur(10px);
                transition: all 0.3s ease;
                z-index: 999;
                display: none;
                align-items: center;
                gap: 8px;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                letter-spacing: -0.01em;
                min-width: 120px;
                justify-content: center;
                pointer-events: auto;
            }
            
            .pwa-install-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
                background: rgba(255, 255, 255, 1);
                border-color: rgba(0, 0, 0, 0.15);
            }
            
            .pwa-install-btn:active {
                transform: translateY(0);
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
            }
            
            .pwa-install-btn svg {
                width: 18px;
                height: 18px;
                opacity: 0.8;
            }
            
            .pwa-install-btn span {
                font-weight: 500;
            }
            
            /* Mobile responsive */
            @media (max-width: 768px) {
                .pwa-install-btn {
                    bottom: 20px;
                    right: 20px;
                    padding: 10px 14px;
                    font-size: 0.8rem;
                    min-width: 100px;
                }
                
                .pwa-install-btn svg {
                    width: 16px;
                    height: 16px;
                }
            }
            
            /* Hide on very small screens to avoid conflicts */
            @media (max-width: 480px) {
                .pwa-install-btn {
                    bottom: 15px;
                    right: 15px;
                    padding: 8px 12px;
                    font-size: 0.75rem;
                    min-width: 90px;
                }
            }
            
            /* Animation for when button appears */
            .pwa-install-btn.show {
                animation: slideInUp 0.4s ease-out;
            }
            
            @keyframes slideInUp {
                from {
                    transform: translateY(100px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(installButton);
        
        this.installButton = installButton;
        this.installButton.addEventListener('click', () => {
            console.log('PWA Install button clicked');
            this.installPWA();
        });
    }
    
    showInstallButton() {
        if (this.installButton && !this.isInstalled) {
            // Force the button to bottom-right position
            this.installButton.style.position = 'fixed';
            this.installButton.style.bottom = '30px';
            this.installButton.style.right = '30px';
            this.installButton.style.top = 'auto';
            this.installButton.style.left = 'auto';
            this.installButton.style.display = 'flex';
            this.installButton.classList.add('show');
            
            console.log('PWA Install button shown at bottom-right');
            
            // Auto-hide after 15 seconds
            setTimeout(() => {
                this.hideInstallButton();
            }, 15000);
        }
    }
    
    hideInstallButton() {
        if (this.installButton) {
            this.installButton.style.display = 'none';
        }
    }
    
    async installPWA() {
        if (this.deferredPrompt) {
            console.log('PWA: Showing install prompt');
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                console.log('PWA: User accepted install prompt');
                this.hideInstallButton();
            } else {
                console.log('PWA: User dismissed install prompt');
            }
            
            this.deferredPrompt = null;
        } else {
            console.log('PWA: No install prompt available');
            // Try alternative installation methods
            this.tryAlternativeInstall();
        }
    }
    
    tryAlternativeInstall() {
        // Check if we can install via other methods
        if (window.matchMedia('(display-mode: standalone)').matches) {
            alert('App is already installed!');
            return;
        }
        
        // Check PWA readiness
        const isReady = this.checkPWAReadiness();
        
        if (isReady) {
            const message = `PWA is ready! Try these methods:
            
1. Look for install icon (⊕) in address bar
2. Chrome menu (⋮) → "Install Miles Waite..."
3. Right-click → "Install app"

If still not available, try:
- Refresh the page 5-10 times
- Wait 2-3 minutes
- Keep the tab open`;
            alert(message);
        } else {
            const message = `PWA needs more engagement:
            
Current status:
- Service Worker: ${navigator.serviceWorker ? 'Active' : 'Not supported'}
- Manifest: ${document.querySelector('link[rel="manifest"]') ? 'Found' : 'Missing'}
- HTTPS/Localhost: ${location.protocol === 'https:' || location.hostname === 'localhost' ? 'Yes' : 'No'}

To get install options:
1. Refresh page 5-10 times
2. Wait 2-3 minutes  
3. Keep tab open
4. Interact with the site`;
            alert(message);
        }
    }
    
    checkPWAReadiness() {
        const hasServiceWorker = 'serviceWorker' in navigator;
        const hasManifest = document.querySelector('link[rel="manifest"]');
        const isSecure = location.protocol === 'https:' || location.hostname === 'localhost';
        
        return hasServiceWorker && hasManifest && isSecure;
    }
    
    showUpdateNotification() {
        // Create update notification
        const notification = document.createElement('div');
        notification.className = 'pwa-update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <h4>New Version Available</h4>
                <p>Refresh to get the latest updates</p>
                <button onclick="window.location.reload()" class="update-btn">Refresh</button>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .pwa-update-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border: 1px solid #e5e7eb;
                border-radius: 12px;
                padding: 1rem;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                z-index: 1001;
                max-width: 300px;
                animation: slideIn 0.3s ease;
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            .update-content h4 {
                margin: 0 0 0.5rem 0;
                color: #1f2937;
                font-size: 1rem;
            }
            
            .update-content p {
                margin: 0 0 1rem 0;
                color: #6b7280;
                font-size: 0.9rem;
            }
            
            .update-btn {
                background: #6366f1;
                color: white;
                border: none;
                border-radius: 6px;
                padding: 0.5rem 1rem;
                font-size: 0.9rem;
                cursor: pointer;
                transition: background 0.3s ease;
            }
            
            .update-btn:hover {
                background: #4f46e5;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(notification);
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            notification.remove();
        }, 10000);
    }
    
    onServiceWorkerRegistered(registration) {
        // Check for updates
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    this.showUpdateNotification();
                }
            });
        });
    }
    
    onPWAInstalled() {
        // Add installed class to body
        document.body.classList.add('pwa-installed');
        
        // Hide install button
        this.hideInstallButton();
        
        // Show welcome message
        this.showWelcomeMessage();
    }
    
    showWelcomeMessage() {
        const welcome = document.createElement('div');
        welcome.className = 'pwa-welcome';
        welcome.innerHTML = `
            <div class="welcome-content">
                <h3>🎉 Welcome to the App!</h3>
                <p>Your portfolio is now installed and ready to use offline.</p>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .pwa-welcome {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                color: white;
                border-radius: 12px;
                padding: 1rem 1.5rem;
                box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
                z-index: 1001;
                animation: slideDown 0.5s ease;
            }
            
            @keyframes slideDown {
                from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
            
            .welcome-content h3 {
                margin: 0 0 0.5rem 0;
                font-size: 1.1rem;
            }
            
            .welcome-content p {
                margin: 0;
                font-size: 0.9rem;
                opacity: 0.9;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(welcome);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            welcome.remove();
        }, 5000);
    }
    
    checkPWAInstallability() {
        // Check if PWA can be installed
        const manifest = document.querySelector('link[rel="manifest"]');
        const hasServiceWorker = 'serviceWorker' in navigator;
        const isHTTPS = location.protocol === 'https:' || location.hostname === 'localhost';
        
        let message = 'PWA Status Check:\n\n';
        message += `✅ Manifest: ${manifest ? 'Found' : 'Missing'}\n`;
        message += `✅ Service Worker: ${hasServiceWorker ? 'Supported' : 'Not Supported'}\n`;
        message += `✅ HTTPS/Localhost: ${isHTTPS ? 'Yes' : 'No'}\n`;
        message += `✅ Install Prompt: ${this.deferredPrompt ? 'Available' : 'Not Available'}\n`;
        message += `✅ Already Installed: ${this.isInstalled ? 'Yes' : 'No'}\n\n`;
        
        if (this.deferredPrompt) {
            message += 'Install prompt is available! Click OK to install.';
            if (confirm(message)) {
                this.installPWA();
            }
        } else if (this.isInstalled) {
            message += 'PWA is already installed!';
            alert(message);
        } else {
            message += 'Install prompt not ready yet. Try:\n';
            message += '1. Refresh the page\n';
            message += '2. Visit the site a few more times\n';
            message += '3. Wait a few minutes\n';
            message += '4. Check if already installed';
            alert(message);
        }
    }
    
    // Public methods
    getInstallationStatus() {
        return this.isInstalled;
    }
    
    requestInstall() {
        if (this.deferredPrompt) {
            this.installPWA();
        }
    }
}

// Initialize PWA when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.pwaManager = new PWAManager();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PWAManager;
}
