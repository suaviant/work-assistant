const { windowManager } = require('node-window-manager');
const { screen } = require('electron');
const { BrowserWindow} = require('electron/main');

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

FADE_TIME_MAX = 1000;
FADE_PERIOD = 1000/60;

blockers = [];
fade_time = 0;
fading_blockers = false;
let fading_blockers_intervalId = null;

function easeOutCubic(x){
    return 1.0 - Math.pow(1.0 - x, 3);
}

function minimizeOtherWindows(){
    const windows = windowManager.getWindows();

    console.log("Found", windows.length, "windows");

    windows.forEach(win => {
        try {
            const path = win.path;

            if (win.isVisible() &&
                path && 
                !(path.includes("explorer.exe") || path.includes("electron.exe"))
            ){
                console.log("minizing", win.getTitle());
                win.minimize();
            }

        } catch (err){}
    });

}

function enterFocusMode() {
    if (blockers.length > 0)
    {
        console.log("Blockers exist already...")
        return
    }

    //minimizeOtherWindows();
    const displays = screen.getAllDisplays();
    displays.forEach(display => {
        console.log(display.bounds);
        console.log(display.workArea);
        console.log(display.scaleFactor);
        const blocker = new BrowserWindow({
            frame: false,
            titleBarStyle: 'hidden',
            transparent: false,
            backgroundColor: '#140e2c',

            thickFrame: false,
            focusable: false,
            skipTaskbar: true,
            movable: false,
            resizable: false
        });

        //blocker.setKiosk(true);
        blocker.show();
        blocker.setOpacity(0.0);
        //blocker.setAlwaysOnTop(true, "floating");
        blocker.moveTop();
        blocker.setBounds(display.bounds);
        blockers.push(blocker);

        console.log("blocker getbounds:", blocker.getBounds());
        console.log("blocker getcontentbounds:", blocker.getContentBounds());
    })

    fadeBlockers(0.0, 1.0, FADE_TIME_MAX, null);
}

function fadeBlockers(src, dst, time, callback){
    if (fading_blockers){
        return;
    }

    src = clamp(src, 0.0, 1.0);
    dst = clamp(dst, 0.0, 1.0);

    fade_time = 0;
    fading_blockers = true;
    fading_blockers_intervalId = setInterval(() => {
        fade_time += FADE_PERIOD;

        t = fade_time / time;
        if (fade_time >= time){
            t = 1.0;
            clearInterval(fading_blockers_intervalId);
            fading_blockers_intervalId = null;
            fading_blockers = false;
            callback?.();
        }

        t = easeOutCubic(t);
        opacity = src + (dst - src) * t;
        blockers.forEach(blocker =>{
            blocker.setOpacity(opacity);
        })


    }, FADE_PERIOD);
}

function destroyBlockers(){
    if (fading_blockers){
        fading_blockers = false;
        clearInterval(fading_blockers_intervalId);
    }
    blockers.forEach(blocker =>{
        blocker.destroy()
    });
    blockers = [];
}

function exitFocusMode(immediate, onFinishedCallback){
    if (blockers.length == 0){
        return;
    }

    if (immediate){
        destroyBlockers();
        return;
    }

    fadeBlockers(1.0, 0.0, FADE_TIME_MAX, ()=>{
        destroyBlockers();
        onFinishedCallback?.();
    });
}


module.exports = {
    enterFocusMode,
    exitFocusMode
}