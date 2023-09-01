const { alphaChoices, alphabate, PromptAndApprove } = require("./meathooks-cli-utils.js");
console.log({ alphaChoices, alphabate, PromptAndApprove });

async function mainMenu(ctx) {
    let choices = {
        a: {label: "quickload", fn: stub},
        b: {label: "Start a new project", fn: startNewProject},
        c: {label: "Load an existing project", fn: loadExistProject},
        d: {label: "Exit", fn: this.exitApp}
    }
    const choice = await alphaChoices(ctx,choices);
    return choices[choice].fn;
}
async function exitApp(ctx){
    console.log("Exiting");
    process.exit(0);
}
function stub(){
    console.log("Our stub means death");
    exitApp();
}
async function startNewProject(ctx){
    let nameApproved = false;
    let projectName = "";
    while(!nameApproved){
        projectName = await new Promise((resolve, reject) => {
            ctx.rl.question('What is the name of your project? ', (answer) => {
                resolve(answer);
            });
        });
        nameApproved = await PromptAndApprove("You entered "+projectName+". Is this correct?");
    }
    let res = ctx.meathooks.createProject(projectName);
    console.log(res.message);
    if(res.message.includes("already exists")){
        let shouldSwitch = await PromptAndApprove("Would you like to set "+projectName + " as your active project?");
        if(shouldSwitch){ 
            res = ctx.meathooks.setActiveProject(projectName);
            console.log(res.message);
        }
    }
    //fall through to main menu
    return mainMenu;
}
async function loadExistProject(ctx) {
    return new Promise(async (resolve) => {
        let res = ctx.meathooks.listProjects();
        if (!res.success) {
            console.log(res.message);
            resolve(mainMenu);
            return
        }

        const projectNames = res.data.projects;
        const labels = projectNames.map((name) => {
            return { label: name };
        });

        let choices = alphabate(labels);
        choices["z"] = { label: "Back" };

        const choice = await alphaChoices(ctx, choices);
        if(choice === "z"){
            resolve(mainMenu);
            return;
        }
        const projectName = choices[choice].label;
        res = ctx.meathooks.setActiveProject(projectName);
        console.log(res.message);
        if(!res.success){
            
            resolve(mainMenu);
            return;
        }
        exitApp();
    });
}
async function projectActivated(ctx) {
    return new Promise(async (resolve) => {
        let approval = await PromptAndApprove("Enter Playmode?");
        resolve(approval ? playmode : mainMenu);
    });
}

module.exports = {
    mainMenu,
    exitApp,
    stub,
    startNewProject,
    loadExistProject,
    projectActivated
}
