var route = require('../src/parsers/route');
var request = require('../src/parsers/request');
var chai = require('chai');
var expect = chai.expect;
describe('request/route comparison tests', function () {
    it('will return a single Part match', function () {
        var rt = route('/a-part');
        var req = request('/a-part');
    });
});
function test(matches, expected) {
    expect(matches.length).to.equal(expected.length);
    matches.forEach(function (match, index) { return expect(match).to.equal(expected[index]); });
}
//# sourceMappingURL=compare.js.map