import { CapacitorUpdater } from '@capgo/capacitor-updater';
import { App } from '@capacitor/app';

const VERSION_CHECK_URL = 'https://credu-app.vercel.app/version.json';

export const LiveUpdateService = {
  async init() {
    console.log('[LiveUpdate] Initializing OTA Service...');
    
    // Always notify Capacitor Updater that the app has successfully started
    // This prevents automatic rollbacks if a new version crashes
    try {
      await CapacitorUpdater.notifyAppReady();
      console.log('[LiveUpdate] App marked as ready.');
    } catch (e) {
      console.warn('[LiveUpdate] notifyAppReady failed (likely not on mobile):', e);
    }

    // Listener for when the app returns from background
    App.addListener('appStateChange', ({ isActive }) => {
      if (isActive) {
        this.checkForUpdates();
      }
    });

    // Initial check on startup
    this.checkForUpdates();
  },

  async checkForUpdates() {
    try {
      console.log('[LiveUpdate] Checking for updates at:', VERSION_CHECK_URL);
      
      const response = await fetch(`${VERSION_CHECK_URL}?t=${Date.now()}`);
      if (!response.ok) throw new Error('Failed to fetch version.json');
      
      const remote = await response.json();
      const current = await CapacitorUpdater.getLatest();
      
      console.log(`[LiveUpdate] Current Version: ${current.version}, Remote Version: ${remote.version}`);

      // Compare versions (simple string comparison for now, can be semver)
      if (remote.version !== current.version) {
        console.log('[LiveUpdate] New version detected, downloading...');
        this.downloadUpdate(remote.url, remote.version);
      } else {
        console.log('[LiveUpdate] App is up to date.');
      }
    } catch (error) {
      console.error('[LiveUpdate] Check failed:', error);
    }
  },

  async downloadUpdate(url, version) {
    try {
      const update = await CapacitorUpdater.download({
        url: url,
        version: version,
      });
      
      console.log('[LiveUpdate] Update downloaded, will be applied on next restart.');
      
      // Optionally notify the user or set the update to be applied immediately
      // await CapacitorUpdater.set(update); 
    } catch (error) {
      console.error('[LiveUpdate] Download failed:', error);
    }
  }
};
