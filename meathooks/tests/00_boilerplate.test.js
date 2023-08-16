const assert = require('chai').assert;
const fs = require('fs');
const path = require('path');
const {Meathooks, MKResult} = require('../Meathooks.js');
const { emptyDirectory, projectsDir } = require('./TestHelpers.js'); 

let meathooks;

function createProjectAndAssert(projectName) {
  // Insert create project logic here
}

describe('Meathooks Tests: Test Boilerplate', function () {
  // SETUP AND TEARDOWN
  before(function() {
    if (!fs.existsSync(projectsDir)) {
      fs.mkdirSync(projectsDir);
    }

    meathooks = new Meathooks(projectsDir);
  });;

  beforeEach(function() {
    emptyDirectory(projectsDir);
  });

  afterEach(function () {
    // Insert afterEach teardown here
  });

  after(function () {
    // Insert after all tests teardown here
  });

  // ACTUAL TESTS
  it('should have a boilerplate test', function () {
    assert.isTrue(true, 'Boilerplate test should pass');
  });
});
