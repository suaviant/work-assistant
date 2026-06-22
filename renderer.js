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
