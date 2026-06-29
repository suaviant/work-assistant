console.log("PRELOAD RUNNING")


try{
    const { contextBridge, ipcRenderer } = require('electron');


    contextBridge.exposeInMainWorld(
        'electronAPI',
        {
            focusMode:()=>{
                console.log("PRELOAD GOT focusMode()");
                ipcRenderer.send('focus-mode');
            }
        }
    );

    contextBridge.exposeInMainWorld('appApi', {
        onSetInputVisible: (callback) => {
            ipcRenderer.on('ui:set-input-visible', (_event, visible) =>{
                callback(visible);
            });
        },

        onSetInputEnabled: (callback) => {
            ipcRenderer.on('ui:set-input-enabled', (_event, enabled) => {
                callback(enabled);
            });
        },

        onSetWorkingEnabled: (callback) => {
            ipcRenderer.on('ui:set-working-enabled', (_event, enabled) => {
                callback(enabled);
            });
        },

        submitUserText:(text)=> ipcRenderer.invoke('user:submit-text', text)

    });

    console.log("EXPOSE SUCCEEDED");
}
catch (err) {
    console.error(err);
}