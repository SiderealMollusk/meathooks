const fs = require('fs');
const path = require('path');

const currentDirectory = __dirname;

function getCommandFiles() {
  const files = fs.readdirSync(currentDirectory);
  result = files.filter(file => {
    const isFile = fs.statSync(path.join(currentDirectory, file)).isFile();
    const isCommandFile = file.startsWith('command.') && file.endsWith('.js');
    return isFile && isCommandFile;
  });
  return result;
}

function createCommandObject(commandFiles) {
  const commandObject = {};

  commandFiles.forEach(filename => {
    const commandName = filename.replace(/^command\.(.*?)\.js$/, '$1');
    const filePath = path.join(currentDirectory, filename);
    const commandModule = require(filePath); // Load the module
    commandObject[commandModule.name] = commandModule; // Add the exported object
  });

  return commandObject;
}

module.exports = function(){
  const commandFiles = getCommandFiles();
  const commandObject = createCommandObject(commandFiles);
  return commandObject;
};
