import { contextBridge, ipcRenderer } from 'electron';

// Safe exposure of necessary native capabilities can be done here.
// For now, we expose an empty API to keep context isolation strict.
contextBridge.exposeInMainWorld('electronAPI', {
  // Add methods here when native functionality (e.g. menus, IPC) is needed.
  onNavigate: (callback: (path: string) => void) => {
    ipcRenderer.on('navigate', (_event, path) => callback(path));
  }
});
