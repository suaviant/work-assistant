console.log("RENDERER RUNNING");
console.log(window.electronAPI);

const inputArea = document.getElementById('inputArea');
const userInput = document.getElementById('userInput');
const submitButton = document.getElementById('submitButton');
const focusButton = document.getElementById("focusButton");
const workingIndicator = document.getElementById('workingIndicator');
const replyArea = document.getElementById('replyArea');

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


const task = {
    steps: [
        "Determine budget",
        "Identify interests",
        "Shortlist three gifts",
        "Compare prices",
        "Purchase"
    ],
    currentStep: 2
}


async function handleSubmit() {
    const text = userInput.value.trim();
    if(!text) return;

    userInput.value = '';

    const result = await window.appApi.submitUserText(text);

    console.log(result);
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
    document.getElementById("objective").innerText = task.steps[task.currentStep];

    document.getElementById("progress").innerText = 
    `Progress ${task.currentStep+1}/${task.steps.length}`;
}

updateUI();

document.getElementById("doneButton")
.addEventListener("click", ()=> {
    if (task.currentStep < task.steps.length -1){
        task.currentStep++;
    }
    updateUI();
})

