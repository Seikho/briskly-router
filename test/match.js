var request = require('../src/parsers/request');
var route = require('../src/parsers/route');
var match = require('../src/match/part');
var chai = require('chai');
var expect = chai.expect;
describe('request/part comparison tests', function () {
    describe('part tests', function () {
        it('will match route part with request part', function () {
            var req = request('/a-route');
            var rt = route('/a-route');
            testMatch(req[0], rt[0], 0 /* Part */);
        });
        it('will not match route part with misspelt request part', function () {
            var req = request('/b-route');
            var rt = route('/a-route');
            testMatch(req[0], rt[0], 3 /* None */);
        });
    });
    describe('string parameter tests', function () {
        it('will match route string parameter with request part', function () {
            var req = request('/a-string');
            var rt = route('/{param: string}');
            testMatch(req[0], rt[0], 1 /* Type */);
        });
        it('will not match route string parameter with request number part', function () {
            var req = request('/12345');
            var rt = route('/{param: string}');
            testMatch(req[0], rt[0], 3 /* None */);
        });
        it('will not match route string parameter with request array part', function () {
            var req = request('/[]');
            var rt = route('/{param: string}');
            testMatch(req[0], rt[0], 3 /* None */);
        });
        it('will not match route string parameter with request object part', function () {
            var req = request('/{}');
            var rt = route('/{param: string}');
            testMatch(req[0], rt[0], 3 /* None */);
        });
        it('will match route any parameter with request part', function () {
            var req = request('/a-string');
            var rt = route('/{param: any}');
            testMatch(req[0], rt[0], 2 /* Any */);
        });
    });
    describe('number parameter tests', function () {
        it('will match route number parameter with request number', function () {
            var req = request('/12345.789');
            var rt = route('/{param: number}');
            testMatch(req[0], rt[0], 1 /* Type */);
        });
        it('will not match route number parameter with request string', function () {
            var req = request('/a-string');
            var rt = route('/{param: number}');
            testMatch(req[0], rt[0], 3 /* None */);
        });
        it('will not match route number parameter with request array', function () {
            var req = request('/["a-string"]');
            var rt = route('/{param: number}');
            testMatch(req[0], rt[0], 3 /* None */);
        });
        it('will not match route number parameter with request object', function () {
            var req = request('/{}');
            var rt = route('/{param: number}');
            testMatch(req[0], rt[0], 3 /* None */);
        });
        it('will match route any parameter with request number', function () {
            var req = request('/1e7');
            var rt = route('/{param: any}');
            testMatch(req[0], rt[0], 2 /* Any */);
        });
    });
    describe('array parameter tests', function () {
        it('will match route array parameter with request array', function () {
            var req = request('/[1,"a",{"b": "foo"}]');
            var rt = route('/{param: array}');
            testMatch(req[0], rt[0], 1 /* Type */);
        });
        it('will not match route array parameter with request string', function () {
            var req = request('/a-string-route');
            var rt = route('/{param: array}');
            testMatch(req[0], rt[0], 3 /* None */);
        });
        it('will not match route array parameter with request number', function () {
            var req = request('/0');
            var rt = route('/{param: array}');
            testMatch(req[0], rt[0], 3 /* None */);
        });
        it('will not match route array parameter with request object', function () {
            var req = request('/{}');
            var rt = route('/{param: array}');
            testMatch(req[0], rt[0], 3 /* None */);
        });
        it('will match route any parameter with request array', function () {
            var req = request('/[ [1,2,3], [4,5,6], [7,8,9]]');
            var rt = route('/{param: any}');
            testMatch(req[0], rt[0], 2 /* Any */);
        });
    });
    describe('object parameter tests', function () {
        it('will match route object parameter with request object', function () {
            var req = request('/{ "a": [1,2,3], "b": { "c": 123, "d": [7,8,9] } }');
            var rt = route('/{param: object}');
            testMatch(req[0], rt[0], 1 /* Type */);
        });
        it('will not match route object parameter with request string', function () {
            var req = request('/a-string-route');
            var rt = route('/{param: object}');
            testMatch(req[0], rt[0], 3 /* None */);
        });
        it('will not match route object parameter with request number', function () {
            var req = request('/0');
            var rt = route('/{param: object}');
            testMatch(req[0], rt[0], 3 /* None */);
        });
        it('will not match route object parameter with request array', function () {
            var req = request('/[]');
            var rt = route('/{param: object}');
            testMatch(req[0], rt[0], 3 /* None */);
        });
        it('will match route any parameter with request array', function () {
            var req = request('/{}');
            var rt = route('/{param: any}');
            testMatch(req[0], rt[0], 2 /* Any */);
        });
    });
});
function testMatch(reqPart, routePart, expected) {
    var result = match(reqPart, routePart);
    expect(matchString(result)).to.equal(matchString(expected));
}
function matchString(match) {
    switch (match) {
        case 0 /* Part */:
            return 'Part';
        case 1 /* Type */:
            return 'Type';
        case 2 /* Any */:
            return 'Any';
        default:
            return 'None';
    }
    ;
}
//# sourceMappingURL=match.js.map