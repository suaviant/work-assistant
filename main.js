const { app, BrowserWindow, globalShortcut} = require('electron/main');
const { ipcMain } = require('electron');
const path = require('node:path');
const focusManager = require('./focusManager');
//const renderer = require('./renderer')

console.log('Hello from Electron')



console.log(__dirname);
console.log(path.join(__dirname, 'preload.js'));

let mainWindow;

const createWindow = () => {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences:{
			preload: path.join(__dirname, 'preload.js')
		},

		frame: false,
		titleBarStyle: 'hidden',
		transparent: false,

		skipTaskbar: false,
		resizable: false

	})
	
	mainWindow.loadFile('index.html')
	mainWindow.webContents.openDevTools()
}

ipcMain.on('focus-mode', ()=>{
	focusManager.enterFocusMode();
	mainWindow.setAlwaysOnTop(true, "screen-saver");
	mainWindow.show();
	mainWindow.focus();
	mainWindow.moveTop();
	mainWindow.webContents.send('ui:set-input-visible', false);
})

function quitApp(){
	focusManager.exitFocusMode();
	app.quit();
}

app.whenReady().then(() => {
	globalShortcut.register('Escape', ()=>{
		mainWindow.webContents.send('ui:set-input-visible', true);
		focusManager.exitFocusMode(()=>{
			mainWindow.setAlwaysOnTop(false);
		});
	});

	globalShortcut.register('Ctrl+Shift+Q', () => {
		quitApp();
	})

	createWindow()
	
	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0){
			createWindow()
		}
	})
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin'){
		quitApp();
	}
})