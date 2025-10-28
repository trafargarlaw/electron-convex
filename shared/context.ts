import { BrowserWindow } from "electron";

export async function createContext() {
  const browserWindow = BrowserWindow.getFocusedWindow();

  return {
    window: browserWindow,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
