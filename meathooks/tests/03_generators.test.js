const { assert, expect } = require('chai');
const fs = require('fs');
const path = require('path');
const {Meathooks, MKResult, Generator} = require('../Meathooks.js');
const { emptyDirectory, projectsDir } = require('./TestHelpers.js'); 

let meathooks;

describe('Meathooks Tests: Create Generators', function () {
    // SETUP AND TEARDOWN
    before(function() {
      if (!fs.existsSync(projectsDir)) {
        fs.mkdirSync(projectsDir);
      }
      emptyDirectory(projectsDir);
      meathooks = new Meathooks(projectsDir);
    });;
  
    beforeEach(function() {
      emptyDirectory(projectsDir);
    });
  
    afterEach(function () {
      // Insert afterEach teardown here
    });
  
    after(function () {
      emptyDirectory(projectsDir);
    });

    it('Can Create Generators: Creates Generator Directory', function () {
        const projectName = 'canCreateGenerator';
        const generatorName = 'Foo';
        meathooks.createProject(projectName);
        meathooks.createGenerator(generatorName);
        assert.isTrue(fs.existsSync(path.join(projectsDir, projectName, 'generators', generatorName)), 'Generator directory should exist');
      });
    
      it('Can Create Generators: Creates File, file is JSON, JSON has correct properties', function () {
        const projectName = 'canCreateProperGenerators';
        const generatorName = 'Foo';
        meathooks.createProject(projectName);
        meathooks.createGenerator(generatorName);
        const fileContents = fs.readFileSync(path.join(projectsDir, projectName, 'generators', generatorName, `${generatorName}.generator.json`), 'utf8');
        const generator = JSON.parse(fileContents);
        
        // Assert that the generator has the instructions and template properties that are empty objects
        expect(generator.instructions).to.have.property('includes').that.is.an('array').that.is.empty;
        expect(generator.instructions).to.have.property('description').that.is.an('string').that.is.empty;
        expect(generator).to.have.property('template').that.is.an('object').that.is.empty;
    
        // Assert that the generator does not have any other properties
        const allowedProperties = ['instructions', 'template'];
        for (const prop in generator) {
            if (generator.hasOwnProperty(prop) && !allowedProperties.includes(prop)) {
            expect.fail(`Unexpected property: ${prop}`);
            }
        }
      });
});

describe('Meathooks Tests: Validate Generator Behaviors', function () {
  // SETUP AND TEARDOWN
  before(function() {
    if (!fs.existsSync(projectsDir)) {
      fs.mkdirSync(projectsDir);
    }
    emptyDirectory(projectsDir);
    meathooks = new Meathooks(projectsDir);
  });;

  beforeEach(function() {
    emptyDirectory(projectsDir);
  });

  afterEach(function () {
    // Insert afterEach teardown here
  });

  after(function () {
    emptyDirectory(projectsDir);
  });

  // Test no active project (working)
  it('Can Validate Generators: Catch ActiveProject is null', function () {
    const projectName = 'canValidateGenerators';
    const generatorName = 'FooGen';
    meathooks = new Meathooks(projectsDir);
    //meathooks.createProject(projectName); // Commented out to test null activeProject
    //meathooks.createGenerator(generatorName);
    const actual = meathooks.validateGenerator(generatorName);
    const expected = new MKResult({
        action: 'validateGenerator',
        success: false,
        message: `No active project.`
        });
    assert.deepEqual(actual, expected, 'Validate generator should fail if there is no active project');
  });

  // Test no generator directory (working)
  it('Can Validate Generators: Catch Missing Generator Directory', function () {
    const projectName = 'canValidateGenerators';
    const generatorName = 'FooGen';
    meathooks = new Meathooks(projectsDir);
    meathooks.createProject(projectName);
    //meathooks.createGenerator(generatorName); // Commented out to test null generator directory
    const actual = meathooks.validateGenerator(generatorName);
    const expected = new MKResult({
        action: 'validateGenerator',
        success: false,
        message: `Generator '${generatorName}' directory does not exist.`
      });
    assert.deepEqual(actual, expected, 'Validate generator should fail if there is no generator directory');
  });

  // Test no generator file (working)
  it('Can Validate Generators: Catch Missing Generator File', function () {
    const projectName = 'canValidateGenerators';
    const generatorName = 'FooGen';
    meathooks = new Meathooks(projectsDir);
    meathooks.createProject(projectName);
    meathooks.createGenerator(generatorName);
    //Delete generator file
    fs.unlinkSync(path.join(projectsDir, projectName, 'generators', generatorName, `${generatorName}.generator.json`));
    const actual = meathooks.validateGenerator(generatorName);
    const expected = new MKResult({
        action: 'validateGenerator',
        success: false,
        message: `Generator '${generatorName}' file does not exist.`
      });
    assert.deepEqual(actual, expected, 'Validate generator should fail if there is no generator file');
  });

  // Test invalid JSON in generator file (working)
  it('Can Validate Generators: Catch Broken JSON', function () {
    const projectName = 'canValidateGenerators';
    const generatorName = 'FooGen';
    meathooks = new Meathooks(projectsDir);
    meathooks.createProject(projectName);
    meathooks.createGenerator(generatorName);
    //Break JSON in generator file

    fs.writeFileSync(path.join(projectsDir, projectName, 'generators', generatorName, `${generatorName}.generator.json`), 'This is not JSON');
    const actual = meathooks.validateGenerator(generatorName);
    const expected = new MKResult({
        action: 'validateGenerator',
        success: false,
        message: `Generator '${generatorName}' file is not valid JSON.`
      });
    assert.deepEqual(actual, expected, 'Validate generator should fail if there is no generator file');
  });

  // Test invalid generator format
  it('Can Validate Generators: Catch Missing Properties in JSON', function () {
    const projectName = 'canValidateGenerators';
    const generatorName = 'FooGen';
    meathooks = new Meathooks(projectsDir);
    meathooks.createProject(projectName);
    meathooks.createGenerator(generatorName);
    //Break generator format
    const generatorContent = {};
    fs.writeFileSync(path.join(projectsDir, projectName, 'generators', generatorName, `${generatorName}.generator.json`), JSON.stringify(generatorContent, null, 2));
    const actual = meathooks.validateGenerator(generatorName);
    const expected = new MKResult({
        action: 'validateGenerator',
        success: false,
        message: `Generator '${generatorName}' file must have instructions and template properties.`
      });
    assert.deepEqual(actual, expected, 'Validate generator should fail if there is no active project');
  });

  // Test Validate Includes
it('Can Validate Generators: Catch Missing Includes', function () {
    //Set up
    const projectName = 'canValidateGenerators';
    const generatorName = 'FooGen';
    const include = 'Bar.txt';
    meathooks = new Meathooks(projectsDir);
    meathooks.createProject(projectName);
    meathooks.createGenerator(generatorName);
    //Load generator object
    const generatorFile = path.join(projectsDir, projectName, 'generators', generatorName, `${generatorName}.generator.json`);
    const generatorContent = JSON.parse(fs.readFileSync(generatorFile));

    //Make add a missing include
    generatorContent.instructions.includes = [include];
    fs.writeFileSync(generatorFile, JSON.stringify(generatorContent, null, 2));

    //Test
    const actual = meathooks.validateGenerator(generatorName);
    const expected = new MKResult({ action: 'validateGenerator', success: false, message: `Generator '${generatorName}' includes '${include}' which does not exist.` });
    assert.deepEqual(actual, expected, 'Validate generator should fail if there is no active project');
})

  // Test the success case --- THIS ONE SAYS AT THE END
  it('Can Validate Generators: Correctly Report Valid Generator', function () {
    const projectName = 'canValidateGenerators';
    const generatorName = 'FooGen';
    meathooks = new Meathooks(projectsDir);
    meathooks.createProject(projectName);
    meathooks.createGenerator(generatorName);
    const actual = meathooks.validateGenerator(generatorName);
    const expected = new MKResult({
      action: 'validateGenerator',
      success: true,
      message: `Generator '${generatorName}' is valid.`
    });
    assert.deepEqual(actual, expected, 'Validate generator should fail if there is no active project');
  });
});


describe('Meathooks Tests: Generator Class', function () {
    // SETUP AND TEARDOWN
    before(function() {
    if (!fs.existsSync(projectsDir)) {
        fs.mkdirSync(projectsDir);
    }
    emptyDirectory(projectsDir);
    meathooks = new Meathooks(projectsDir);
    });;

    beforeEach(function() {
        emptyDirectory(projectsDir);
    });

    afterEach(function () {
    // Insert afterEach teardown here
    });

    after(function () {
    emptyDirectory(projectsDir);
    });
    it('Load a generator from disk', function () {
        const projectName = 'canCreateGenerator';
        const generatorName = 'Foo';
        meathooks.createProject(projectName);
        meathooks.createGenerator(generatorName);
        
        const result = meathooks.loadGenerator(generatorName);
        assert.isTrue(result.success, 'loadGenerator should return success');
        
        const generator = result.data;
        assert.instanceOf(generator, Generator, 'Generator should be an instance of Generator class');
      });
});
