const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  setIgnoreMouseEvents: (ignore, options) => {
    ipcRenderer.send('set-ignore-mouse-events', ignore, options);
  },
  resizeWindow: (width, height) => {
    ipcRenderer.send('resize-window', width, height);
  },
  setAlwaysOnTop: (alwaysOnTop) => {
    ipcRenderer.send('set-always-on-top', alwaysOnTop);
  }
});
