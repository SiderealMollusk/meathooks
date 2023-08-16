const fs = require('fs');
const path = require('path');
const projectsDir = './meathooks/tests/projects'; 

function emptyDirectory(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
      console.error(`Directory '${directoryPath}' does not exist.`);
      return;
  }

  const contents = fs.readdirSync(directoryPath);

  contents.forEach(item => {
      const itemPath = path.join(directoryPath, item);
      if (fs.lstatSync(itemPath).isDirectory()) {
          emptyDirectory(itemPath); // Recursively empty subdirectories
          fs.rmdirSync(itemPath); // Remove the subdirectory
      } else {
          fs.unlinkSync(itemPath); // Remove the file
      }
  });
}

module.exports = {
  projectsDir,
  emptyDirectory
};
