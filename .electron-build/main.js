"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
// Use dynamic imports for ESM modules
let nextProcess = null;
let mainWindow = null;
const isDev = process.env.NODE_ENV === 'development';
const net = __importStar(require("net"));
const http = __importStar(require("http"));
function getFreePort() {
    return new Promise((resolve, reject) => {
        const srv = net.createServer();
        srv.listen(0, () => {
            const port = srv.address().port;
            srv.close((err) => {
                if (err)
                    reject(err);
                else
                    resolve(port);
            });
        });
        srv.on('error', reject);
    });
}
function waitForServer(port, timeout = 30000) {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        const interval = setInterval(() => {
            if (Date.now() - start > timeout) {
                clearInterval(interval);
                reject(new Error("Timeout waiting for server"));
                return;
            }
            const req = http.get(`http://127.0.0.1:${port}`, (res) => {
                clearInterval(interval);
                req.destroy();
                resolve();
            });
            req.on('error', () => { });
        }, 500);
    });
}
async function startNextJs() {
    if (isDev) {
        return 3000;
    }
    const port = await getFreePort();
    const nextPath = path.join(electron_1.app.getAppPath(), '.next', 'standalone', 'server.js');
    nextProcess = (0, child_process_1.fork)(nextPath, [], {
        env: {
            ...process.env,
            PORT: port.toString(),
            HOSTNAME: '127.0.0.1',
            NODE_ENV: 'production'
        },
        stdio: 'pipe'
    });
    nextProcess.stdout?.on('data', (data) => console.log(`Next.js: ${data}`));
    nextProcess.stderr?.on('data', (data) => console.error(`Next.js Error: ${data}`));
    await waitForServer(port);
    return port;
}
async function createWindow(port) {
    mainWindow = new electron_1.BrowserWindow({
        width: 1440,
        height: 900,
        minWidth: 900,
        minHeight: 650,
        backgroundColor: '#E6DFF1', // Inner Margins paper background
        titleBarStyle: 'hiddenInset',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });
    const url = `http://127.0.0.1:${port}`;
    await mainWindow.loadURL(url);
}
electron_1.app.whenReady().then(async () => {
    // Create native macOS application menu for shortcuts
    if (process.platform === 'darwin') {
        const template = [
            {
                label: electron_1.app.name,
                submenu: [
                    { role: 'about' },
                    { type: 'separator' },
                    { role: 'services' },
                    { type: 'separator' },
                    { role: 'hide' },
                    { role: 'hideOthers' },
                    { role: 'unhide' },
                    { type: 'separator' },
                    { role: 'quit' }
                ]
            },
            {
                label: 'Edit',
                submenu: [
                    { role: 'undo' },
                    { role: 'redo' },
                    { type: 'separator' },
                    { role: 'cut' },
                    { role: 'copy' },
                    { role: 'paste' },
                    { role: 'pasteAndMatchStyle' },
                    { role: 'delete' },
                    { role: 'selectAll' }
                ]
            },
            {
                label: 'View',
                submenu: [
                    { role: 'reload' },
                    { role: 'forceReload' },
                    { role: 'toggleDevTools' },
                    { type: 'separator' },
                    { role: 'resetZoom' },
                    { role: 'zoomIn' },
                    { role: 'zoomOut' },
                    { type: 'separator' },
                    { role: 'togglefullscreen' }
                ]
            },
            {
                label: 'Navigation',
                submenu: [
                    {
                        label: 'Home',
                        accelerator: 'CmdOrCtrl+1',
                        click: () => { mainWindow?.webContents.send('navigate', '/'); }
                    },
                    {
                        label: 'New Post',
                        accelerator: 'CmdOrCtrl+N',
                        click: () => { mainWindow?.webContents.send('navigate', '/write'); }
                    },
                    {
                        label: 'Journals',
                        accelerator: 'CmdOrCtrl+2',
                        click: () => { mainWindow?.webContents.send('navigate', '/journals'); }
                    },
                    {
                        label: 'Analysis',
                        accelerator: 'CmdOrCtrl+3',
                        click: () => { mainWindow?.webContents.send('navigate', '/analysis'); }
                    }
                ]
            },
            {
                label: 'Window',
                submenu: [
                    { role: 'minimize' },
                    { role: 'zoom' },
                    { type: 'separator' },
                    { role: 'front' }
                ]
            }
        ];
        electron_1.Menu.setApplicationMenu(electron_1.Menu.buildFromTemplate(template));
    }
    try {
        const port = await startNextJs();
        await createWindow(port);
    }
    catch (e) {
        console.error("Failed to start Inner Margins app", e);
        electron_1.app.quit();
    }
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            startNextJs().then(createWindow);
        }
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('before-quit', () => {
    if (nextProcess) {
        nextProcess.kill();
    }
});
