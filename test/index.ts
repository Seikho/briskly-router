import BR = require('../src');
import chai = require('chai');
var expect = chai.expect;
var pkg = require('../package.json');

describe('non-functional tests', () => {
   it(`will export the correct version (${pkg.version}) from package.json`, () => {
      expect(pkg.version).to.equal(BR.version); 
   });
});