import compare = require('../src/match/compare');
import route = require('../src/parsers/route');
import request = require('../src/match/request');
import best = require('../src/match/best');
import add = require('../src/add');
import routes = require('../src/routes');
import * as chai from 'chai'
import Match = Types.Match;
var expect = chai.expect;

describe('request/route comparison tests', () => {

    it('will add and remove a route', () => {
        addRoute('/sample');
        expect(routes.length).to.equal(1);
        clearRoutes();
        expect(routes.length).to.equal(0);
    });

    describe('single Part tests', () => {
        it('will return a single Part match', () => {
            addRoute('/a-part');
            var req = request('/a-part');
            var match = best(req);
            expect(match).to.exist;
            expect(match.options.path).to.equal('/a-part');
        });

        it('will not return a match when no exact match', () => {
            var req = request('/a-parta');
            var match = best(req);
            expect(match).to.not.exist;
        });

        it('will return a wildcard match', () => {
            addRoute('/{...}');
            var req = request('/a-parta');
            var match = best(req);
            expect(match).to.exist;
            expect(match.options.path).to.equal('/{...}');
        });

        it('will return a wildcard match for a long request', () => {
            var req = request('/a/really/long/request');
            var match = best(req);
            expect(match).to.exist;
            expect(match.options.path).to.equal('/{...}');
        });
    });

    describe('single string Type tests', () => {

        it('will return a match based on string type', () => {
            clearRoutes();
            addRoute('/a-part');
            addRoute('/{word: string}');
            var match = best(request('/a-sparta'));
            expect(match).to.exist;
            expect(match.options.path).to.equal('/{word: string}');
        });

        it('will return not return a match due to type mismatch', () => {
            var match = best(request('/12345'));
            expect(match).to.not.exist;

            match = best(request('/[1,2,3,4]'));
            expect(match).to.not.exist;

            match = best(request('/{"a":"foo", "b": "bar", "c": 123 }'));
            expect(match).to.not.exist;
        });

        it('will return a single Part match despite possible ambiguity', () => {
            var match = best(request('/a-part'));
            expect(match).to.exist;
            expect(match.options.path).to.equal('/a-part');
        });

        it('will not return a match when first part matches and second does not', () => {
            var match = best(request('/a-part/another-part'));
            expect(match).to.not.exist;
        });

    });

    describe('single number Type tests', () => {
        it('will return a Part match based on number type', () => {
            clearRoutes();
            addRoute('/12345');
            addRoute('/{param: number}');
            var match = best(request('/12345'));
            expect(match).to.exist;
            expect(match.options.path).to.equal('/12345');
        });

        it('will return not return a match due to type mismatch', () => {
            var match = best(request('/word'));
            expect(match).to.not.exist;

            match = best(request('/[1,2,3,4]'));
            expect(match).to.not.exist;

            match = best(request('/{"a":"foo", "b": "bar", "c": 123 }'));
            expect(match).to.not.exist;
        });

        it('will return a single Type match', () => {
            var match = best(request('/123456'));
            expect(match).to.exist;
            expect(match.options.path).to.equal('/{param: number}');
        });

        it('will not return a match when first part matches and second does not', () => {
            var match = best(request('/12345/another-part'));
            expect(match).to.not.exist;
        });
    });
    
    describe('wildcard tests', () => {
        
    });

});

function addRoute(path: string, method?: string) {
    method = method || 'get';
    add({
        method,
        path,
        handler: () => { }
    });
}

function test(matches: Array<Match>, expected: Array<Match>) {
    expect(matches.length).to.equal(expected.length);

    matches.forEach((match, index) => expect(match).to.equal(expected[index]));
}

function clearRoutes() {
    while (routes.pop()) { }
}