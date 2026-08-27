/// <reference types="vite/client" />

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

interface Window {
  electronAPI?: {
    setIgnoreMouseEvents: (ignore: boolean, options?: { forward?: boolean }) => void;
    resizeWindow: (width: number, height: number) => void;
    setAlwaysOnTop: (alwaysOnTop: boolean) => void;
  };
}
