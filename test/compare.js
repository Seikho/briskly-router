var request = require('../src/match/request');
var best = require('../src/match/best');
var add = require('../src/add');
var routes = require('../src/routes');
var chai = require('chai');
var expect = chai.expect;
describe('request/route comparison tests', function () {
    it('will add and remove a route', function () {
        addRoute('/sample');
        expect(routes.length).to.equal(1);
        clearRoutes();
        expect(routes.length).to.equal(0);
    });
    describe('single Part tests', function () {
        it('will return a single Part match', function () {
            addRoute('/a-part');
            var req = request('/a-part');
            var match = best(req);
            expect(match).to.exist;
            expect(match.options.path).to.equal('/a-part');
        });
        it('will not return a match when no exact match', function () {
            var req = request('/a-parta');
            var match = best(req);
            expect(match).to.not.exist;
        });
        it('will return a wildcard match', function () {
            addRoute('/{...}');
            var req = request('/a-parta');
            var match = best(req);
            expect(match).to.exist;
            expect(match.options.path).to.equal('/{...}');
        });
        it('will return a wildcard match for a long request', function () {
            var req = request('/a/really/long/request');
            var match = best(req);
            expect(match).to.exist;
            expect(match.options.path).to.equal('/{...}');
        });
    });
    describe('single string Type tests', function () {
        it('will return a match based on string type', function () {
            clearRoutes();
            addRoute('/a-part');
            addRoute('/{word: string}');
            var match = best(request('/a-sparta'));
            expect(match).to.exist;
            expect(match.options.path).to.equal('/{word: string}');
        });
        it('will return not return a match due to type mismatch', function () {
            var match = best(request('/12345'));
            expect(match).to.not.exist;
            match = best(request('/[1,2,3,4]'));
            expect(match).to.not.exist;
            match = best(request('/{"a":"foo", "b": "bar", "c": 123 }'));
            expect(match).to.not.exist;
        });
        it('will return a single Part match despite possible ambiguity', function () {
            var match = best(request('/a-part'));
            expect(match).to.exist;
            expect(match.options.path).to.equal('/a-part');
        });
        it('will not return a match when first part matches and second does not', function () {
            var match = best(request('/a-part/another-part'));
            expect(match).to.not.exist;
        });
    });
    describe('single number Type tests', function () {
        it('will return a Part match based on number type', function () {
            clearRoutes();
            addRoute('/12345');
            addRoute('/{param: number}');
            var match = best(request('/12345'));
            expect(match).to.exist;
            expect(match.options.path).to.equal('/12345');
        });
        it('will return not return a match due to type mismatch', function () {
            var match = best(request('/word'));
            expect(match).to.not.exist;
            match = best(request('/[1,2,3,4]'));
            expect(match).to.not.exist;
            match = best(request('/{"a":"foo", "b": "bar", "c": 123 }'));
            expect(match).to.not.exist;
        });
        it('will return a single Type match', function () {
            var match = best(request('/123456'));
            expect(match).to.exist;
            expect(match.options.path).to.equal('/{param: number}');
        });
        it('will not return a match when first part matches and second does not', function () {
            var match = best(request('/12345/another-part'));
            expect(match).to.not.exist;
        });
    });
    describe('wildcard tests', function () {
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
function clearRoutes() {
    while (routes.pop()) { }
}
//# sourceMappingURL=compare.js.map