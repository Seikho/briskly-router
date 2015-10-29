var request = require('../src/match/request');
var best = require('../src/match/best');
var add = require('../src/add');
var chai = require('chai');
var expect = chai.expect;
describe('request/route comparison tests', function () {
    it('will return a single Part match', function () {
        addRoute('/a-part');
        var req = request('/a-part');
        var match = best(req);
        expect(match).to.exist;
        expect(match.options.path).to.equal('/a-part');
    });
    it('will not return a match', function () {
        var req = request('/a-sparta');
        var match = best(req);
        expect(match).to.not.exist;
    });
    it('will return a match based on string type', function () {
        addRoute('/{word: string}');
        var match = best(request('/a-sparta'));
        expect(match).to.exist;
        expect(match.options.path).to.equal('/{word: string}');
    });
    it('will return not return a match due to type mismatch', function () {
        var match = best(request('/12345'));
        expect(match).to.not.exist;
    });
    it('will return a match single match despite possible ambiguity', function () {
        var match = best(request('/a-part'));
        expect(match).to.exist;
        expect(match.options.path).to.equal('/a-part');
    });
    it('will not return a match when first part matches and second does not', function () {
        var match = best(request('/a-part/another-part'));
        expect(match).to.not.exist;
    });
});
function addRoute(path, method) {
    method = method || 'get';
    add({
        method: method,
        path: path,
        handler: function () { }
    });
}
function test(matches, expected) {
    expect(matches.length).to.equal(expected.length);
    matches.forEach(function (match, index) { return expect(match).to.equal(expected[index]); });
}
//# sourceMappingURL=compare.js.map