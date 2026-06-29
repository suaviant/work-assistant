require('dotenv').config()

const { askLLM } = require('./llm');
const { app, BrowserWindow, globalShortcut} = require('electron/main');
const { ipcMain } = require('electron');
const { spawn } = require('child_process');
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
	
	mainWindow.webContents.on('before-input-event', (event, input)=>{
		if (input.key === 'F11'){
			event.preventDefault();
		}
	});
	mainWindow.loadFile('index.html')
	mainWindow.webContents.openDevTools()
}

ipcMain.handle('user:start-browser-task', async()=> {
	spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', ['--new-window', "https://www.google.com/"], {
		detached: true,
		stdio: 'ignore'
	}).unref();

	return { ok: true };
})

ipcMain.handle('user:submit-text', async(_event, text) => {
	if (typeof text !== 'string' || text.trim() === ''){
		return {ok: false, error: 'Empty input'};
	}

	mainWindow.webContents.send('ui:set-working-enabled', true);
	mainWindow.webContents.send('ui:set-input-visible', false);

	try{
		const reply = await askLLM(text);

		mainWindow.webContents.send('ui:set-reply', reply);

		return { ok: true};
	} catch (error) {
		console.error(error);

		mainWindow.webContents.send('ui:set-reply', 'LLM request failed.');

		return { ok: false, error: error.message};
	} finally {
		mainWindow.webContents.send('ui:set-working-enabled', false);
		mainWindow.webContents.send('ui:set-input-visible', true);
	}
});

ipcMain.on('focus-mode', ()=>{
	focusManager.enterFocusMode();
	mainWindow.setAlwaysOnTop(true, "screen-saver");
	mainWindow.show();
	mainWindow.focus();
	mainWindow.moveTop();
	mainWindow.webContents.send('ui:set-input-visible', false);
})

function quitApp(){
	focusManager.exitFocusMode(true);
	app.quit();
}

app.whenReady().then(() => {
	globalShortcut.register('Escape', ()=>{
		mainWindow.webContents.send('ui:set-input-visible', true);
		focusManager.exitFocusMode(false, ()=>{
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