const assert = require('chai').assert;
const fs = require('fs');
const path = require('path');
const {Meathooks, MKResult} = require('../Meathooks.js');
const { emptyDirectory, projectsDir } = require('./TestHelpers.js'); 
const { v4: uuidv4 } = require('uuid');

let meathooks;

function createProjectAndAssert(projectName) {
  // Insert create project logic here
}

describe('Meathooks Tests: Active Project Behavior', function () {
  // SETUP AND TEARDOWN
  before(function() {
    if (!fs.existsSync(projectsDir)) {
      fs.mkdirSync(projectsDir);
    }

    meathooks = new Meathooks(projectsDir);
  });

  beforeEach(function () {
    // Insert beforeEach setup here
  });

  afterEach(function () {
    // Insert afterEach teardown here
  });

  after(function () {
    // Insert after all tests teardown here
  });

  // ACTUAL TESTS
  it('should not have an active project at start', function () {
    meathooks = new Meathooks(projectsDir);
    assert.isNull(meathooks.activeProject, 'Active project should be null');
  });

  it('should activate newly create project', function () {
    const projectName = 'activeProjectTest';
    meathooks.createProject(projectName);
    assert.equal(meathooks.activeProject, projectName, 'Active project should be the newly created project');
  });

  it('should not activate non-existent project', function () {
    const oldActiveProject = meathooks.activeProject;
    const projectName = 'nonExistentProject' + uuidv4();
    meathooks.setActiveProject(projectName);
    assert.equal(meathooks.activeProject, oldActiveProject, 'Active project should not change');
  });

  it('shouldbe able to switch projects', function () {
    const projectName1 = 'switchProject1';
    const projectName2 = 'switchProject2';
    meathooks.createProject(projectName1);
    meathooks.createProject(projectName2);
    assert.equal(meathooks.activeProject, projectName2, 'Project2 should be the active project because it was just created');
    
    meathooks.setActiveProject(projectName1);
    assert.equal(meathooks.activeProject, projectName1, 'Project1 should be the active project because it was just switched to');
  });
});
