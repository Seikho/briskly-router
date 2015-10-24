import Types = require('../index.d.ts');
import Match = Types.Match;
import chai = require('chai');
import request = require('../src/parsers/request');
import route = require('../src/parsers/route');
import match = require('../src/match/part');
var expect = chai.expect;

describe('request parsing', () => {

    it('will return a single string part', () => {
        var parts = request('/a-string');
        expect(parts.length).to.equal(1);
        testType(parts[0], 'string', 'a-string');
    });

    it('will return a single number part', () => {
        var parts = request('/12345');
        expect(parts.length).to.equal(1);
        testType(parts[0], 'number', 12345);
    });

    it('will return a single array part', () => {
        var parts = request('/[1,2,3]');
        expect(parts.length).to.equal(1);
        testType(parts[0], 'array', [1, 2, 3]);
    });

    it('will return a single object part', () => {
        var parts = request('/{ "a": true, "b": "blue" }');
        expect(parts.length).to.equal(1);
        testType(parts[0], 'object', { a: true, b: 'blue' });
    });

    it('will return two parts, string and string', () => {
        var parts = request('/first/second');
        expect(parts.length).to.equal(2);
        testType(parts[0], 'string', 'first');
        testType(parts[1], 'string', 'second');
    });

    it('will return two parts, string and number', () => {
        var parts = request('/first/12345');
        testType(parts[0], 'string', 'first');
        testType(parts[1], 'number', 12345);
    });

    it('will return two parts, string and array', () => {
        var parts = request('/first/[1,2,3]');
        testType(parts[0], 'string', 'first');
        testType(parts[1], 'array', [1, 2, 3]);
    });

    it('will return two parts, string and object', () => {
        var parts = request('/first/{ "foo": "bar", "baz": [1,2,3]}');
        testType(parts[0], 'string', 'first');
        testType(parts[1], 'object', { foo: 'bar', baz: [1, 2, 3] });
    });
});

describe('route parsing tests', () => {
    describe('single part routes', () => {
        it('will return a route type', () => {
            var r = route('/normal-route');
            testPart(r[0], 'route');
        });

        it('will return a string type', () => {
            var r = route('/{param: string}');
            testPart(r[0], 'parameter', 'string');
        });

        it('will return a number type', () => {
            var r = route('/{param: number}');
            testPart(r[0], 'parameter', 'number');
        });

        it('will return an array type', () => {
            var r = route('/{param: array}');
            testPart(r[0], 'parameter', 'array');
        });

        it('will return an object type', () => {
            var r = route('/{param: object}');
            testPart(r[0], 'parameter', 'object');
        });

        it('will return an any type', () => {
            var r = route('/{param:any}');
            testPart(r[0], 'parameter', 'any');
        });
    })

});

describe('request/part comparison tests', () => {

    describe('part tests', () => {
        it('will match route part with request part', () => {
            var req = request('/a-route');
            var rt = route('/a-route');
            testMatch(req[0], rt[0], Match.Part);
        });

        it('will not match route part with misspelt request part', () => {
            var req = request('/b-route');
            var rt = route('/a-route');
            testMatch(req[0], rt[0], Match.None);
        });
    })


    describe('string parameter tests', () => {
        it('will match route string parameter with request part', () => {
            var req = request('/a-string');
            var rt = route('/{param: string}');
            testMatch(req[0], rt[0], Match.Parameter);
        });

        it('will not match route string parameter with request number part', () => {
            var req = request('/12345');
            var rt = route('/{param: string}');
            testMatch(req[0], rt[0], Match.None);
        });

        it('will not match route string parameter with request array part', () => {
            var req = request('/[]');
            var rt = route('/{param: string}');
            testMatch(req[0], rt[0], Match.None);
        });

        it('will not match route string parameter with request object part', () => {
            var req = request('/{}');
            var rt = route('/{param: string}');
            testMatch(req[0], rt[0], Match.None);
        });

        it('will match route any parameter with request part', () => {
            var req = request('/a-string');
            var rt = route('/{param: any}');
            testMatch(req[0], rt[0], Match.Parameter);
        });

    });

    describe('number parameter tests', () => {
        it('will match route number parameter with request number', () => {
            var req = request('/12345.789');
            var rt = route('/{param: number}');
            testMatch(req[0], rt[0], Match.Parameter);
        });

        it('will not match route number parameter with request string', () => {
            var req = request('/a-string');
            var rt = route('/{param: number}');
            testMatch(req[0], rt[0], Match.None);
        });

        it('will not match route number parameter with request array', () => {
            var req = request('/["a-string"]');
            var rt = route('/{param: number}');
            testMatch(req[0], rt[0], Match.None);
        });

        it('will not match route number parameter with request object', () => {
            var req = request('/{}');
            var rt = route('/{param: number}');
            testMatch(req[0], rt[0], Match.None);
        });

        it('will match route any parameter with request number', () => {
            var req = request('/1e7');
            var rt = route('/{param: any}');
            testMatch(req[0], rt[0], Match.Parameter);
        });
    });

    describe('array parameter tests', () => {
        it('will match route array parameter with request array', () => {
            var req = request('/[1,"a",{"b": "foo"}]');
            var rt = route('/{param: array}');
            testMatch(req[0], rt[0], Match.Parameter);
        });

        it('will not match route array parameter with request string', () => {
            var req = request('/a-string-route');
            var rt = route('/{param: array}');
            testMatch(req[0], rt[0], Match.None);
        });

        it('will not match route array parameter with request number', () => {
            var req = request('/0');
            var rt = route('/{param: array}');
            testMatch(req[0], rt[0], Match.None);
        });

        it('will not match route array parameter with request object', () => {
            var req = request('/{}');
            var rt = route('/{param: array}');
            testMatch(req[0], rt[0], Match.None);
        });

        it('will match route any parameter with request array', () => {
            var req = request('/[ [1,2,3], [4,5,6], [7,8,9]]');
            var rt = route('/{param: any}');
            testMatch(req[0], rt[0], Match.Parameter);
        });

    });

    describe('object parameter tests', () => {
        it('will match route object parameter with request object', () => {
            var req = request('/{ "a": [1,2,3], "b": { "c": 123, "d": [7,8,9] } }');
            var rt = route('/{param: object}');
            testMatch(req[0], rt[0], Match.Parameter);
        });

        it('will not match route object parameter with request string', () => {
            var req = request('/a-string-route');
            var rt = route('/{param: object}');
            testMatch(req[0], rt[0], Match.None);
        });

        it('will not match route object parameter with request number', () => {
            var req = request('/0');
            var rt = route('/{param: object}');
            testMatch(req[0], rt[0], Match.None);
        });

        it('will not match route object parameter with request array', () => {
            var req = request('/[]');
            var rt = route('/{param: object}');
            testMatch(req[0], rt[0], Match.None);
        });

        it('will match route any parameter with request array', () => {
            var req = request('/{}');
            var rt = route('/{param: any}');
            testMatch(req[0], rt[0], Match.Parameter);
        });

    });



});

function testMatch(reqPart: Types.RequestPart, routePart: Types.RoutePart, expected: Match) {
    var result = match(reqPart, routePart);
    expect(matchString(result)).to.equal(matchString(expected));
}

function matchString(match: Match) {
    switch (match) {
        case Match.Part:
            return 'Part';
        case Match.Parameter:
            return 'Parameter';
        default:
            return 'None';
    };
}

function testPart(part: Types.RoutePart, type: string, cast?: string) {
    cast = cast || null;
    expect(part.type).to.equal(type);
    expect(part.cast).to.equal(cast);
}

function testType(part: Types.RequestPart, cast: string, value: any): void {
    expect(part.cast).to.equal(cast);
    if (part.cast === 'string' || part.cast === 'number')
        expect(part.value).to.equal(value);

    if (cast === 'array')
        expect(part.value).to.have.same.members(value);

    if (cast === 'object')
        expect(part.value).to.deep.equal(value);
}