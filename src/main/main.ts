import * as path from 'path'
import { format } from 'url'
import { app, BrowserWindow, Menu } from 'electron'
import { is } from 'electron-util'
import { ConnectToWebSocketServer, SetupWindowState } from './wsClient'
import './fetch'

export let window: BrowserWindow | null = null

process.on('uncaughtException', (error) => {
  console.log(error)
  window.webContents.send('error', error)
})
async function createWindow() {
  window = new BrowserWindow({
    width: 1165,
    height: 555,
    frame: false,
    minHeight: 600,
    minWidth: 650,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
      // preload: path.join(__dirname, 'preload.js'),
    },
    show: false,
  })

  ConnectToWebSocketServer();
  SetupWindowState()
  const isDev = is.development

  // if (isDev) Menu.setApplicationMenu(null)


  if (isDev) {
    // this is the default port electron-esbuild is using
    window.loadURL('http://localhost:9080')
  } else {
    window.loadURL(
      format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true,
      }),
    )
  }

  window.on('closed', () => {
    window = null
  })

  window.webContents.on('devtools-opened', () => {
    // window!.focus()
    // window.focus()
  })

  window.once('ready-to-show', () => {
    window.show()
    // window!.focus()
    // window.blur()

    if (isDev) {
      // window!.webContents.openDevTools()/
    }
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (!is.macos) {
    app.quit()
  }
})

app.on('activate', () => {
  if (window === null && app.isReady()) {
    createWindow()
  }
})
