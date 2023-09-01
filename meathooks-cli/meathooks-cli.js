const { exit } = require('process');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const {Meathooks, MKResult} = require('../meathooks/Meathooks');
const projectsDir = '../projects';
const meathooks = new Meathooks(projectsDir);
const {mainMenu} = require('./meathooks-cli-mainMenu.js');
const ctx = {rl, meathooks};

async function mainLoop() {
  console.log("Welcome to the Meathooks CLI!");
  let fn = await mainMenu(ctx);
  while (fn){
    fn = await fn(ctx);
  }
}
mainLoop();
