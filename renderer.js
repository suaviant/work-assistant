console.log("RENDERER RUNNING");
console.log(window.electronAPI);


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

const focusButton = document.getElementById("focusButton");
focusButton.addEventListener("click", ()=>{
    console.log("FOCUS BUTTON CLICKED")
    window.electronAPI.focusMode();
})

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
