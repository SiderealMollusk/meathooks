// This is not a real app.
// It exists to call the meathooks functions easy from the commandline.
const {Meathooks, MKResult} = require('./meathooks/Meathooks');
const projectsDir = './projects'; // Replace with your projects directory
const meathooks = new Meathooks(projectsDir);
let res;

async function generateCat() {
  let res;

  // Create a new project
  res = meathooks.setActiveProject('SaveTheCats');
  console.log(res.message);
  
  res = meathooks.loadGenerator('cats');
  console.log(res.message);
  const catFactory = res.data;
  
  res = await catFactory.Generate(2); // Use await here
  console.log(res);
}

// res = meathooks.setActiveProject('SaveTheCats');
// meathooks.createGenerator('dogs');


async function generateDog() {
  let res;

  // Create a new project
  res = meathooks.setActiveProject('SaveTheCats');
  console.log(res.message);
  
  res = meathooks.loadGenerator('dogs');
  console.log(res.message);
  const dogFactory = res.data;
  
  res = await dogFactory.Generate(2); // Use await here
  console.log(res);
}

generateCat();
//generateDog();