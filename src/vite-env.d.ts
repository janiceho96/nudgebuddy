/// <reference types="vite/client" />

interface Window {
  electronAPI?: {
    setIgnoreMouseEvents: (ignore: boolean, options?: { forward: boolean }) => void;
    resizeWindow: (width: number, height: number) => void;
    setAlwaysOnTop: (alwaysOnTop: boolean) => void;
  };
}
