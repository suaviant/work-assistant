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
            ipcRenderer.on('ui:set-input-enabled', (_event, visible) => {
                callback(visible);
            });
        }

    });

    console.log("EXPOSE SUCCEEDED");
}
catch (err) {
    console.error(err);
}