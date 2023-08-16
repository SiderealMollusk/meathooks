const assert = require('chai').assert;
const fs = require('fs');
const path = require('path');
const {Meathooks, MKResult} = require('../Meathooks.js'); 
const { emptyDirectory, projectsDir } = require('./TestHelpers.js'); 
let meathooks;

describe('Meathooks Tests: Project Functions', function () {
  //SETUP AND TEARDOWN
  before(function() {
    if (!fs.existsSync(projectsDir)) {
      fs.mkdirSync(projectsDir);
    }

    meathooks = new Meathooks(projectsDir);
  });

  beforeEach(function() {
    //emptyDirectory(projectsDir);
  });

  afterEach(function() {
  });

  after(function() {
    
  });

  // ACTUAL TESTS
  it('should create a new project', function() {
    const projectName = 'canCreateProject';
    meathooks.createProject(projectName);

    const projectDir = path.join(projectsDir, projectName);
    assert.isTrue(fs.existsSync(projectDir), 'Project directory should exist');
  });

  it('should create a new project with the correct subdirectories', function() {
    const projectName = 'canCreateProjectWithSubdirectories';
    meathooks.createProject(projectName);
    assert.isTrue(fs.existsSync(path.join(projectsDir, projectName, 'generators')), 'Generators directory should exist');
    assert.isTrue(fs.existsSync(path.join(projectsDir, projectName, 'assets')), 'Assets directory should exist');
    assert.isTrue(fs.existsSync(path.join(projectsDir, projectName, 'rules')), 'Rules directory should exist');
  });

  it('should not create an existing project', function() {
    emptyDirectory(projectsDir);
    const projectName = 'doesNotRecreateProject';

    // Create the project twice
    meathooks.createProject(projectName);
    meathooks.createProject(projectName);

    // Check that the project directory only exists once
    const projectDirs = fs.readdirSync(projectsDir);
    assert.equal(projectDirs.length, 1, 'Project directory should exist only once');
  });
});

// HELPER FUNCTIONS


