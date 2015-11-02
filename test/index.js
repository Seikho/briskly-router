var BR = require('../src');
var chai = require('chai');
var expect = chai.expect;
var pkg = require('../package.json');
describe('non-functional tests', function () {
    it("will export the correct version (" + pkg.version + ") from package.json", function () {
        expect(pkg.version).to.equal(BR.version);
    });
});
//# sourceMappingURL=index.js.map