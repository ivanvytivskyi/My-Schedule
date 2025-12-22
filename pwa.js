+// ========================================
+// PWA INSTALL & SERVICE WORKER HANDLER
+// ========================================
+
+let deferredInstallPrompt = null;
+
+function updateInstallButtonVisibility(isReady) {
+    const btn = document.getElementById('installAppBtn');
+    if (!btn) return;
+    if (isReady) {
+        btn.classList.add('ready');
+        btn.classList.remove('hidden');
+    } else {
+        btn.classList.remove('ready');
+        btn.classList.add('hidden');
+    }
+}
+
+function registerServiceWorker() {
+    if (!('serviceWorker' in navigator)) return;
+
+    navigator.serviceWorker.register('/service-worker.js').catch(err => {
+        console.error('[PWA] Service worker registration failed:', err);
+    });
+}
+
+function setupInstallPrompt() {
+    const btn = document.getElementById('installAppBtn');
+    if (!btn) return;
+
+    btn.addEventListener('click', async () => {
+        if (!deferredInstallPrompt) return;
+        deferredInstallPrompt.prompt();
+        const { outcome } = await deferredInstallPrompt.userChoice;
+        console.log('[PWA] User response to install prompt:', outcome);
+        deferredInstallPrompt = null;
+        updateInstallButtonVisibility(false);
+    });
+
+    window.addEventListener('beforeinstallprompt', (event) => {
+        event.preventDefault();
+        deferredInstallPrompt = event;
+        updateInstallButtonVisibility(true);
+    });
+
+    // Hide button if already installed
+    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
+    if (isStandalone) {
+        updateInstallButtonVisibility(false);
+    }
+
+    window.addEventListener('appinstalled', () => {
+        deferredInstallPrompt = null;
+        updateInstallButtonVisibility(false);
+        console.log('[PWA] App installed');
+    });
+}
+
+document.addEventListener('DOMContentLoaded', () => {
+    registerServiceWorker();
+    setupInstallPrompt();
+});
