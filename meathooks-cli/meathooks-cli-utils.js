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
async function killApp(ctx){
  console.log("Exiting");
  process.exit(0);
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
        return userChoice;
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

module.exports = {
  YesNoPromise,
  PromptAndApprove,
  alphabate,
  printChoices,
  alphaChoices,
  AlphaChoicePromise,
  killApp
}