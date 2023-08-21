import * as path from 'path'
import { format } from 'url'
import { app, BrowserWindow, Menu } from 'electron'
import { is } from 'electron-util'
import {ConnectToWebSocketServer} from './wsClient'

export let win: BrowserWindow | null = null

process.on('uncaughtException',(error)=>{
console.log(error)
})
async function createWindow() {
  win = new BrowserWindow({
    width: 1165, 
    height: 555,
    frame:false,
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

  const isDev = is.development

  // if (isDev) Menu.setApplicationMenu(null)
  

  if (isDev) {
    // this is the default port electron-esbuild is using
    win.loadURL('http://localhost:9080')
  } else {
    win.loadURL(
      format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true,
      }),
    )
  }

  win.on('closed', () => {
    win = null
  })

  win.webContents.on('devtools-opened', () => {
    // win!.focus()
    // win.focus()
  })

  win.once('ready-to-show', () => {
    win.show() 
    // win!.focus()
    // win.blur()

    if (isDev) { 
      // win!.webContents.openDevTools()/
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
  if (win === null && app.isReady()) {
    createWindow()
  }
})
