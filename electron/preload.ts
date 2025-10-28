import { contextBridge, ipcRenderer } from "electron";
import { exposeElectronTRPC } from "trpc-electron/main";

process.once("loaded", () => {
  exposeElectronTRPC();
  contextBridge.exposeInMainWorld("ipc", {
    send: (channel: string, data?: unknown) => ipcRenderer.send(channel, data),
    on: (channel: string, listener: (event: unknown, data: any) => void) =>
      ipcRenderer.on(channel, listener as any),
    removeListener: (
      channel: string,
      listener: (event: unknown, data: any) => void
    ) => ipcRenderer.removeListener(channel, listener as any),
  });
});
