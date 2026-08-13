import { app, BrowserWindow, Menu } from 'electron';
import * as path from 'path';
import { fork, ChildProcess } from 'child_process';

// Use dynamic imports for ESM modules
let nextProcess: ChildProcess | null = null;
let mainWindow: BrowserWindow | null = null;

const isDev = process.env.NODE_ENV === 'development';

import * as net from 'net';
import * as http from 'http';

function getFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.listen(0, () => {
      const port = (srv.address() as net.AddressInfo).port;
      srv.close((err) => {
        if (err) reject(err);
        else resolve(port);
      });
    });
    srv.on('error', reject);
  });
}

function waitForServer(port: number, timeout = 30000): Promise<void> {
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
      req.on('error', () => { /* wait and retry */ });
    }, 500);
  });
}

async function startNextJs() {
  if (isDev) {
    return 3000;
  }

  const port = await getFreePort();
  const nextPath = path.join(app.getAppPath(), '.next', 'standalone', 'server.js');
  
  nextProcess = fork(nextPath, [], {
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

async function createWindow(port: number) {
  mainWindow = new BrowserWindow({
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

app.whenReady().then(async () => {
  // Create native macOS application menu for shortcuts
  if (process.platform === 'darwin') {
    const template: Electron.MenuItemConstructorOptions[] = [
      {
        label: app.name,
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
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  }

  try {
    const port = await startNextJs();
    await createWindow(port);
  } catch (e) {
    console.error("Failed to start Inner Margins app", e);
    app.quit();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      startNextJs().then(createWindow);
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (nextProcess) {
    nextProcess.kill();
  }
});
