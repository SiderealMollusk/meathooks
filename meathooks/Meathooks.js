require('dotenv').config();
const fs = require('fs');
const path = require('path');
const {MKResult, MKLLMQuest} = require('./DataClasses.js');
const extractJson = require('extract-json-from-string');
const MKOpenAI = require('./MKOpenAI.js');

/// <summary> Meathooks is the main class for interacting with the meathooks library. </summary>
/// <param name="projectsDir"> The directory where projects are stored. </param>
class Meathooks {
  constructor(projectsDir) {
    this.projectsDir = projectsDir;
    this.activeProject = null;
  }

  /// <summary> Creates a new project. </summary>
  /// <param name="projectName"> The name of the project to create. </param>
  createProject(projectName) {
    
    const projectDir = path.join(this.projectsDir, projectName);
    const generatorsDir = path.join(projectDir, 'generators');
    const assetsDir = path.join(projectDir, 'assets');
    const rulesDir = path.join(projectDir, 'includes');

    // Check if the project directory already exists
    if (fs.existsSync(projectDir)) {
      return new MKResult({
        action: 'createProject',
        success: false,
        message: 'Project not created because it all ready exists.'
      });
    }

    // Create project directories
    fs.mkdirSync(projectDir);
    fs.mkdirSync(generatorsDir);
    fs.mkdirSync(assetsDir);
    fs.mkdirSync(rulesDir);

    // Set the newly created project as the active project
    this.activeProject = projectName;
    return new MKResult({
      action: 'createProject',
      success: true,
      message: `Project '${projectName}' created successfully, and is now the active project.`
    });
  }

  /// <summary> Sets the active project. </summary>
  /// <param name="projectName"> The name of the project to set as active. </param>
  setActiveProject(projectName) {
    // Check if the requested project existsF
    const projectDir = path.join(this.projectsDir, projectName);
    if (!fs.existsSync(projectDir)) {
      return new MKResult({
        action: 'switchActiveProject',
        success: false,
        message: `Project '${projectName}' does not exist.`
      });
    }

    // Switch the active project
    this.activeProject = projectName;
    return new MKResult({
      action: 'switchActiveProject',
      success: true,
      message: `Project '${projectName}' is now the active project.`
    });
  }

  /// <summary> Lists all available projects in the projects directory. </summary>
  listProjects() {
    const projectNames = fs.readdirSync(this.projectsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    let data = {projectsDir: this.projectsDir,projects: projectNames, activeProject: this.activeProject};
    return new MKResult({
      action: 'listProjects',
      success: true,
      message: 'Available projects listed successfully.',
      data: data
    });
  }



  /// <summary> Creates a new generator. Generators are tools for making prompts</summary>
  /// <param name="generatorName"> The name of the generator to create. What sort of thing will this generator create? </param>
  createGenerator(generatorName) {
    const activeProjectDir = path.join(this.projectsDir, this.activeProject);
    const generatorDir = path.join(activeProjectDir, 'generators', generatorName);
    const generatorFile = path.join(generatorDir, `${generatorName}.generator.json`);
    // Check if the generator directory already exists
    if (fs.existsSync(generatorDir)) {
      console.log(`Generator '${generatorName}' already exists.`);
      return new MKResult({
        action: 'createGenerator',
        success: false,
        message: `Generator '${generatorName}' not created because it all ready exists.`
      });
    }

    // Create generator directory
    fs.mkdirSync(generatorDir);

    // Create generator file
    const generatorContent = {
      instructions: {
        includes: [],
        description: ""
      },
      template: {}
    };
    fs.writeFileSync(generatorFile, JSON.stringify(generatorContent, null, 2));
    return new MKResult({
      action: 'createGenerator',
      success: true,
      message: `Generator '${generatorName}' created successfully.`
    });
  }

  /// <summary> Makes sure that all files on disk assosiated with the generator are valid. This is important because we expect people to edit many of these files by hand. </summary>
  /// <param name="generatorName"> The name of the generator to validate. </param>
  validateGenerator(generatorName) {
    // Validate arguments
    if (!this.activeProject)
      return new MKResult({ action: 'validateGenerator', success: false, message: `No active project.` });
   
    // Validate generator directory
    const generatorDir = path.join(this.projectsDir, this.activeProject, 'generators', generatorName);
    if (!fs.existsSync(generatorDir))
      return new MKResult({ action: 'validateGenerator', success: false, message: `Generator '${generatorName}' directory does not exist.` });
  
    // Validate generator file
    const generatorFile = path.join(generatorDir, `${generatorName}.generator.json`);
    if (!fs.existsSync(generatorFile))
      return new MKResult({ action: 'validateGenerator', success: false, message: `Generator '${generatorName}' file does not exist.` });
  
    // Validate JSON
    let generatorContent;
    try {
      generatorContent = JSON.parse(fs.readFileSync(generatorFile));
    } catch (err) {
      return new MKResult({ action: 'validateGenerator', success: false, message: `Generator '${generatorName}' file is not valid JSON.` });
    }
  
    // Validate JSON contents
    if (!generatorContent.instructions || !generatorContent.template)
      return new MKResult({ action: 'validateGenerator', success: false, message: `Generator '${generatorName}' file must have instructions and template properties.` });
  
    // Validate includees if any. Includes come from the rules directory
    if (generatorContent.instructions.includes) {
      for (let include of generatorContent.instructions.includes) {
        const includeFile = path.join(this.projectsDir, this.activeProject, 'includes', include);
        if (!fs.existsSync(includeFile))
          return new MKResult({ action: 'validateGenerator', success: false, message: `Generator '${generatorName}' includes '${include}' which does not exist.` });
      }
    }

    // Valid. Return success
    return new MKResult({ action: 'validateGenerator', success: true, message: `Generator '${generatorName}' is valid.` });
  }

  /// <summary> Accepts the string name of a generator, validates it's file's on disk, and returns an in-memory object </summary>
  /// <param name="generatorName"> The name of the generator to use. </param>
  loadGenerator(generatorName){
    //Validate arguments
    if (!generatorName) return new MKResult({ action: 'generatorFactor', success: false, message: `No generator name provided.` });

    //Validate generator
    let result = this.validateGenerator(generatorName);
    if (!result.success) { return result; }

    //Load the file
    const generatorDir = path.join(this.projectsDir, this.activeProject, 'generators', generatorName);
    const generatorFile = path.join(generatorDir, `${generatorName}.generator.json`);
    let generatorContent;
    try {
      generatorContent = JSON.parse(fs.readFileSync(generatorFile));
    } catch (err) {
      return new MKResult({ action: 'loadGenerator', success: false, message: `Generator '${generatorName}' file is not valid JSON.`});
    }

    //Not covered by test below this line;
    let populatedIncludes = [];
    for(let include of generatorContent.instructions.includes){
      let includePath = path.join(this.projectsDir, this.activeProject, 'includes', include);
      let includeContent = fs.readFileSync(includePath, 'utf8');
      populatedIncludes.push(includeContent);
    }
    generatorContent.instructions.includes = populatedIncludes;
    let generator = new Generator(generatorContent, generatorName, generatorDir);
    return new MKResult({ action: 'loadGenerator', success: true, message: `Generator '${generatorName}' successfully created from disk.`, data: generator });
  }

}

class Generator {
  constructor(data, name, directory) {
    this.name = name;
    this.directory = directory;
    this.instructions = data.instructions;
    this.template = data.template;
  }

  /// <summary> Calls out to an LLM </summary>
  /// <param name="config"> The configuration object. </param>
  /// <typeparam name="config.api"> The api to use. </typeparam>
  /// <typeparam name="config.count"> The number of prompts to generate. </typeparam>
  async Generate(config = {}) {
    const api = config.api || 'openai';
    const count = config.count || 1;

    // someday we might have multiple apis
    if (api !== 'openai') {
      return Promise.resolve(new MKResult({ action: 'Generate', success: false, message: `No such API '${api}'` }));
    }

    const preamble = "The following contains JSON describing the proper format for generating " + this.name + ":\n\n";
    const postamble = "\n\nYour Task: follow the instructions and generate " + count + " instances of " + this.name + "\n\n";
    const imperative = "This is a machine-to-machine interaction. It is imperative you reply only with JSON.\n\n";
  
    const prompt = JSON.stringify(this);
    try {
      const generatedMessage = await MKOpenAI.Generate(preamble + prompt + postamble + imperative);
      if (typeof generatedMessage === 'string') {
        let generatedObject = extractJson(generatedMessage);
        let toAppend = this.FindObjectsWithExactKeys(generatedObject, this.template);
        this.AppendAssetsToDisk(toAppend);
        return new MKResult({ action: 'Generate', success: true, message: "Response From OpenAI", data: generatedObject });
      } else {
        return new MKResult({ action: 'Generate', success: false, message: "Response From MKOpenAI was not a string", data: generatedMessage });
      }
    } catch (error) {
      return new MKResult({ action: 'Generate', success: false, message: error.message });
    }
  }
  FindObjectsWithExactKeys(source, template) {
    const matches = [];

    function hasExactKeys(candidate, template) {
        const candidateKeys = Object.keys(candidate);
        const templateKeys = Object.keys(template);
        
        return candidateKeys.length === templateKeys.length &&
               candidateKeys.every(key => templateKeys.includes(key));
    }

    function search(obj) {
        if (typeof obj === 'object') {
            if (hasExactKeys(obj, template)) {
                matches.push(obj);
            }

            for (const key in obj) {
                search(obj[key]);
            }
        }
    }

    search(source);
    return matches;
}

  AppendAssetsToDisk(unsavedData) {
    const assetFilePath = path.join(this.directory, '..', '..', 'assets', this.name + '.assets.json');
    
    // Read existing asset data if the file exists, otherwise create an empty array
    let existingData = [];
    if (fs.existsSync(assetFilePath)) {
        const fileContent = fs.readFileSync(assetFilePath, 'utf8');
        try {
            existingData = JSON.parse(fileContent);
        } catch (error) {
            console.error('Error parsing existing asset data:', error);
        }
    }
    
    // Add unsaved data to the existing data
    if (Array.isArray(unsavedData)) {
        existingData = existingData.concat(unsavedData);
    } else if (typeof unsavedData === 'object') {
        existingData.push(unsavedData);
    } else {
        console.error('Invalid unsaved data format');
        return;
    }

    // Save the combined data back to the asset file
    const newDataJSON = JSON.stringify(existingData, null, 2);
    try {
        fs.writeFileSync(assetFilePath, newDataJSON, 'utf8');
        console.log('Asset data saved successfully');
    } catch (error) {
        console.error('Error saving asset data:', error);
    }
  }
}

module.exports = {Meathooks, MKResult, Generator};
