// ========================================
// PWA MANAGER
// - Service Worker Registration
// - App Installation
// - Update Detection & Notifications
// ========================================

// ===================================
// SERVICE WORKER REGISTRATION
// ===================================

let deferredInstallPrompt = null;

function updateInstallButtonVisibility(isReady) {
    const btn = document.getElementById('installAppBtn');
    if (!btn) return;
    if (isReady) {
        btn.classList.add('ready');
        btn.classList.remove('hidden');
    } else {
        btn.classList.remove('ready');
        btn.classList.add('hidden');
    }
}

function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.register('./service-worker.js').catch(err => {
        console.error('[PWA] Service worker registration failed:', err);
    });
}

function setupInstallPrompt() {
    const btn = document.getElementById('installAppBtn');
    if (!btn) return;

    btn.addEventListener('click', async () => {
        if (!deferredInstallPrompt) return;
        deferredInstallPrompt.prompt();
        const { outcome } = await deferredInstallPrompt.userChoice;
        console.log('[PWA] User response to install prompt:', outcome);
        deferredInstallPrompt = null;
        updateInstallButtonVisibility(false);
    });

    window.addEventListener('beforeinstallprompt', (event) => {
        event.preventDefault();
        deferredInstallPrompt = event;
        updateInstallButtonVisibility(true);
    });

    // Hide button if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) {
        updateInstallButtonVisibility(false);
    }

    window.addEventListener('appinstalled', () => {
        deferredInstallPrompt = null;
        updateInstallButtonVisibility(false);
        console.log('[PWA] App installed');
    });
}

// ===================================
// UPDATE DETECTION
// ===================================

if ('serviceWorker' in navigator) {
    // Listen for service worker updates
    navigator.serviceWorker.addEventListener('message', event => {
        if (event.data.type === 'CACHE_UPDATED') {
            console.log('[App] New version detected:', event.data.version);
            showUpdateNotification(event.data.version);
        }
    });

    navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
    });
    
    // Check for updates on page load
    navigator.serviceWorker.ready.then(registration => {
        registration.update();
    });
    
    // Check for updates every 60 seconds
    setInterval(() => {
        navigator.serviceWorker.ready.then(registration => {
            registration.update();
        });
    }, 60000);
}

function showUpdateNotification(version) {
    const lastVersion = localStorage.getItem('lastSeenVersion');
    if (lastVersion !== String(version)) {
        localStorage.removeItem('updateDismissed');
        localStorage.setItem('lastSeenVersion', String(version));
    }

    if (localStorage.getItem('updateDismissed') === 'true') return;
    if (document.getElementById('updateBanner')) return;

    const banner = document.createElement('div');
    banner.id = 'updateBanner';

    banner.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 20px;
        text-align: center;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideDown 0.3s ease;
    `;
    
    banner.innerHTML = `
        <div style="max-width: 800px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 15px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 200px;">
                <strong style="font-size: 16px;">🎉 New version available (v${version})</strong>
                <p style="margin: 5px 0 0 0; font-size: 13px; opacity: 0.9;">Update now to get the latest features and improvements!</p>
            </div>
            <div style="display: flex; gap: 10px;">
                <button onclick="reloadApp()" style="background: white; color: #667eea; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px;">
                    🔄 Update Now
                </button>
                <button onclick="dismissUpdateBanner()" style="background: rgba(255,255,255,0.2); color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px;">
                    Later
                </button>
            </div>
        </div>
    `;
    
    // Add slide animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from { transform: translateY(-100%); }
            to { transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(banner);
}

function reloadApp() {
    dismissUpdateBanner();
    // Clear service worker cache and reload
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
            for (let registration of registrations) {
                registration.unregister();
            }
        });
        
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => caches.delete(cacheName))
            );
        }).then(() => {
            window.location.reload(true);
        });
    } else {
        window.location.reload(true);
    }
}

function dismissUpdateBanner() {
    const banner = document.getElementById('updateBanner');
    if (!banner) return;
    localStorage.setItem('updateDismissed', 'true');
    banner.style.animation = 'slideUp 0.3s ease';
    setTimeout(() => banner.remove(), 300);
    const btn = document.getElementById('manualUpdateBtn');
    if (btn) btn.style.display = 'flex';
}

async function manualUpdateCheck() {
    // allow banner to show again
    localStorage.removeItem('updateDismissed');

    // hide the manual button while checking
    const btn = document.getElementById('manualUpdateBtn');
    if (btn) btn.style.display = 'none';

    if (!('serviceWorker' in navigator)) {
        window.location.reload();
        return;
    }

    const reg = await navigator.serviceWorker.ready;

    // If there's already a waiting SW, activate it now
    if (reg.waiting) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        return;
    }

    // Ask browser to re-check the SW file
    await reg.update();

    // After update(), you might now have a waiting SW
    if (reg.waiting) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        return;
    }

    alert('✅ You are already on the latest version.');
}

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    registerServiceWorker();
    setupInstallPrompt();
    
    const btn = document.getElementById('manualUpdateBtn');
    if (!btn) return;

    btn.style.display = (localStorage.getItem('updateDismissed') === 'true')
        ? 'flex'
        : 'none';
});

console.log('✅ PWA Manager loaded!');
