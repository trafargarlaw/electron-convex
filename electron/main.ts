import { createContext } from "@shared/context";
import { appRouter } from "@shared/routers/_app";
import { BrowserWindow, app } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createIPCHandler } from "trpc-electron/main";

// Set your app as default protocol client (customize the protocol name)
// if (app.isDefaultProtocolClient("your-app-protocol")) {
//   app.setAsDefaultProtocolClient("your-app-protocol");
// }

// const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 360,
    height: 700,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
    titleBarStyle: "hiddenInset", // Use hiddenInset to show traffic lights
  });

  createIPCHandler({
    router: appRouter,
    windows: [mainWindow],
    createContext,
  });

  mainWindow.webContents.on("dom-ready", () => {
    mainWindow.show;
  });

  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(RENDERER_DIST, "index.html"));
  }

  // mainWindow.webContents.openDevTools({ mode: "bottom" });
};

app.whenReady().then(() => {
  createWindow();
});

app.once("window-all-closed", () => app.quit());
