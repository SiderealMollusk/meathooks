// This is not a real app.
// It exists to call the meathooks functions easy from the commandline.
const {Meathooks, MKResult} = require('./meathooks/Meathooks');
const projectsDir = './projects'; // Replace with your projects directory
const meathooks = new Meathooks(projectsDir);
let res;

// Create a new project
res = meathooks.createProject('HelloEcho');
console.log(res.message);

// OR Set the active project, ( and comment out the createProject line above )
//res = meathooks.setActiveProject('HelloEcho');
console.log(res.message);

// Create a new generator, then comment out the createGenerator line below
res = meathooks.createGenerator('musicians');
console.log(res.message);

//MANTUALLY EDIT THE GENERATOR FILE TO ADD STUFF YOU LIKE

//Load a generator from a file to instantiate object and use it
res = meathooks.loadGenerator('musicians');
console.log(res.message);

// Generate some stuff
async function generateMusician() {
  let res;
  res = meathooks.setActiveProject('HelloEcho');
  console.log(res.message);
  
  res = meathooks.loadGenerator('musicians');
  console.log(res.message);
  const musicianFactory = res.data;
  
  res = await musicianFactory.Generate(2); // Use await here
  console.log(res);
}

//generateMusician(); // Uncomment this line after filing things in



