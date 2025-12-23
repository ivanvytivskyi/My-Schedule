// ========================================
// SERVICE WORKER UPDATE DETECTION
// ========================================

if ('serviceWorker' in navigator) {
    // Listen for service worker updates
    navigator.serviceWorker.addEventListener('message', event => {
        if (event.data.type === 'CACHE_UPDATED') {
            console.log('[App] New version detected:', event.data.version);
            showUpdateNotification(event.data.version);
        }
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
    }
async function manualUpdateCheck() {
  // allow the banner to show again
  localStorage.removeItem('updateDismissed');

  if (!('serviceWorker' in navigator)) {
    window.location.reload();
    return;
  }

  const reg = await navigator.serviceWorker.ready;
  await reg.update(); // this should trigger your CACHE_UPDATED message if a new SW activates
}

console.log('✅ Service Worker update detection loaded!');


