console.log("PRELOAD RUNNING")


try{
    const { contextBridge, ipcRenderer } = require('electron')


    contextBridge.exposeInMainWorld(
        'electronAPI',
        {
            focusMode:()=>{
                console.log("PRELOAD GOT focusMode()")
                ipcRenderer.send('focus-mode')

            }
        }
    )

    console.log("EXPOSE SUCCEEDED")
}
catch (err) {
    console.error(err)
}