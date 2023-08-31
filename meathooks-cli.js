const { exit } = require('process');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const {Meathooks, MKResult} = require('./meathooks/Meathooks');
const projectsDir = './projects';
const meathooks = new Meathooks(projectsDir);
console.log(meathooks);

const ctx = {rl, meathooks};

async function mainLoop() {
  console.log("Welcome to the Meathooks CLI!");
  let fn = await mainMenu(ctx);
  while (fn){
    fn = await fn(ctx);
  }
}
mainLoop();

async function mainMenu(ctx) {
    let choices = {
        a: {label: "quickload", fn: stub},
        b: {label: "Start a new project", fn: startNewProject},
        c: {label: "Load an existing project", fn: stub},
        d: {label: "Exit", fn: exitApp}
    }
    const res = await alphaChoices(ctx,choices);
    return res;
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


function YesNoPromise(question) {
    return new Promise((resolve, reject) => {
      ctx.rl.question(`${question} (y/n) `, userInput => {
        if (userInput === 'y') {
          resolve(true);
        } else if (userInput === 'n') {
          resolve(false);
        } else {
          resolve(null); // You can handle unrecognized input as needed
        }
      });
    });
  }
  
  async function PromptAndApprove(question) {
    while (true) {
      const userChoice = await YesNoPromise(question);
      
      if (userChoice !== null) {
        return userChoice;
      }
      // For unrecognized input, the loop will continue and prompt again
    }
  }

async function exitApp(ctx){
    console.log("Exiting");
    process.exit(0);
}



function stub(){
    console.log("stub");
    exitApp();
};
//returns an object that has a, b,c,d etc for keys and array as values. Preserves order of array
function alphabate(array){
let obj = {};
for(let i = 0; i < array.length; i++){
    obj[String.fromCharCode(97 + i)] = array[i];
}
return obj;
}

//for each key in object, print key and value print on a new line
function printChoices(choices){
for(let key in choices){
    console.log(key + ": " + choices[key].label);
}
}
async function alphaChoices(ctx,choices,question){
    const letterChoices = Object.keys(choices);
    let q = question || "Enter your choice:" ;
    while (true) {
        const userChoice = await AlphaChoicePromise(ctx,choices,q);
        if (letterChoices.includes(userChoice)) {
          return choices[userChoice].fn;
        }
        // For unrecognized input, the loop will continue and prompt again
      }
}

async function AlphaChoicePromise(ctx,choices,question) {
    const letterChoices = Object.keys(choices);
    console.log(question); 
    printChoices(choices);
    return new Promise((resolve, reject) => {
        ctx.rl.question('Enter your choice: ', userInput => {
            const valid = letterChoices.includes(userInput);
            if (!valid) {
                resolve(null);
                return;
            }
            const res = userInput;
            resolve(res);
        });
    });
}
