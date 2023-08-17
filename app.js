// This is not a real app.
// It exists to call the meathooks functions easy from the commandline.
const {Meathooks, MKResult} = require('./meathooks/Meathooks');
const projectsDir = './projects'; // Replace with your projects directory
const meathooks = new Meathooks(projectsDir);
let res;
res = meathooks.setActiveProject('SaveTheCatApp');
res = meathooks.loadGenerator('cats');
let catGen;
if (res.success) { catGen = res.data; } else { console.log(res.message); return; }

catGen.Generate().then(result => {
    console.log('Cat generation result');
    console.log(result.data.choices[0]);
  }).catch(error => {
    console.error('Cat generation error:', error);

});
