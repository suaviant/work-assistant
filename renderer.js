console.log("RENDERER RUNNING");
console.log(window.electronAPI);

const inputArea = document.getElementById('inputArea');
const userInput = document.getElementById('userInput');
const submitButton = document.getElementById('submitButton');
const focusButton = document.getElementById("focusButton");
const workingIndicator = document.getElementById('workingIndicator');
const replyArea = document.getElementById('replyArea');
const startBrowserTaskButton = document.getElementById('startBrowserTaskButton');


focusButton.addEventListener("click", ()=>{
    console.log("FOCUS BUTTON CLICKED")
    window.electronAPI.focusMode();
})

submitButton.addEventListener('click', handleSubmit);
userInput.addEventListener('keydown', (event)=>{
    if (event.key === 'Enter'){
        handleSubmit();
    }
});

startBrowserTaskButton.addEventListener('click', ()=> {
    window.appApi.startBrowserTask();
});

window.appApi.onSetInputVisible((visible) => {
    setInputVisible(visible);
});
window.appApi.onSetInputEnabled((enabled) => {
    setInputEnabled(enabled);
});
window.appApi.onSetWorkingEnabled((enabled) => {
    setWorkingEnabled(enabled);
});
window.appApi.onSetReply((reply) => {
    replyArea.textContent = reply;
});
window.appApi.onSetTaskInfo((taskInfo) => {
    setTaskInfo(taskInfo);
})


let goal = "Buy present for Dad.";
let currentStep = 0;
let steps = [
    { title:"Determine budget", detailed_instruction:"" },
    { title:"Identify interests", detailed_instruction:"" },
    { title:"Shortlist three gifts", detailed_instruction:"" },
    { title:"Compare prices", detailed_instruction:"" },
    { title:"Purchase", detailed_instruction:"" },
];


async function handleSubmit() {
    const text = userInput.value.trim();
    if(!text) return;

    userInput.value = '';

    const result = await window.appApi.submitUserText(text);

    console.log(result);
}

function setTaskInfo(taskInfo){
    goal = taskInfo.goal;
    steps = taskInfo.steps;
    currentStep = 0;
    updateUI();
}

function setInputVisible(visible){
    inputArea.hidden = !visible;
}

function setInputEnabled(enabled){
    userInput.disabled = !enabled;
    submitButton.disabled = !enabled;
}
function setWorkingEnabled(isWorking){
    workingIndicator.hidden = !isWorking;
}

function updateUI(){
    document.getElementById("objective").innerText = steps[currentStep].title;

    document.getElementById("progress").innerText = 
    `Progress ${currentStep+1}/${steps.length}`;
}

updateUI();

document.getElementById("doneButton")
.addEventListener("click", ()=> {
    if (currentStep < steps.length -1){
        currentStep++;
    }
    updateUI();
})

