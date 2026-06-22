const { app, BrowserWindow} = require('electron/main');
const { ipcMain } = require('electron');
const path = require('node:path');
const focusManager = require('./focusManager');

console.log('Hello from Electron')


ipcMain.on('focus-mode', ()=>{
	focusManager.enterFocusMode();
})

console.log(__dirname);
console.log(path.join(__dirname, 'preload.js'));

const createWindow = () => {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences:{
			preload: path.join(__dirname, 'preload.js')
		}
	})
	
	win.loadFile('index.html')
	win.webContents.openDevTools()
}

app.whenReady().then(() => {
	createWindow()
	
	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0){
			createWindow()
		}
	})
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin'){
		app.quit()
	}
})