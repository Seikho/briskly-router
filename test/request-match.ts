import Types = require('../src/index.d.ts');
import Match = BR.Match;
import request = require('../src/parsers/request');
import route = require('../src/parsers/route');
import match = require('../src/match/request-part');
import chai = require('chai');
var expect = chai.expect;

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
            testMatch(req[0], rt[0], Match.Type);
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
            testMatch(req[0], rt[0], Match.Any);
        });

    });

    describe('number parameter tests', () => {
        it('will match route number parameter with request number', () => {
            var req = request('/12345.789');
            var rt = route('/{param: number}');
            testMatch(req[0], rt[0], Match.Type);
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
            testMatch(req[0], rt[0], Match.Any);
        });
    });

    describe('array parameter tests', () => {
        it('will match route array parameter with request array', () => {
            var req = request('/[1,"a",{"b": "foo"}]');
            var rt = route('/{param: array}');
            testMatch(req[0], rt[0], Match.Type);
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
            testMatch(req[0], rt[0], Match.Any);
        });

    });

    describe('object parameter tests', () => {
        it('will match route object parameter with request object', () => {
            var req = request('/{ "a": [1,2,3], "b": { "c": 123, "d": [7,8,9] } }');
            var rt = route('/{param: object}');
            testMatch(req[0], rt[0], Match.Type);
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
            testMatch(req[0], rt[0], Match.Any);
        });
    });

    describe('multi part tests', () => {
        it('will match a route multi (prefix and suffix) with request part', () => {
            var rt = route('/pre{param}post');
            var req = request('/preSOMEWORDSpost');
            testMatch(req[0], rt[0], Match.Multi);
        });

        it('will match a route multi (prefix only) with request part', () => {
            var rt = route('/pre{param: number}');
            var req = request('/pre1234');
            testMatch(req[0], rt[0], Match.Multi);
        });
        
        it('will match a route multi (suffix only) with request part', () => {
            var rt = route('/{param: number}post-word');
            var req = request('/1234post-word');
            testMatch(req[0], rt[0], Match.Multi);
        });

        it('will not match a route multi with a request part where prefix is not the same', () => {
            var rt = route('/pre{param}post');
            var req = request('/proSOMEWORDSpost');
            testMatch(req[0], rt[0], Match.None);
        });

        it('will not match a route multi with a request part where suffix is not the same', () => {
            var rt = route('/pre{param}post');
            var req = request('/preSOMEWORDSpast');
            testMatch(req[0], rt[0], Match.None);
        });

        it('will not match a route multi with a request part where prefix and suffix are not the same', () => {
            var rt = route('/pre{param}post');
            var req = request('/praSOMEWORDSpast');
            testMatch(req[0], rt[0], Match.None);
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
        case Match.Type:
            return 'Type';
        case Match.Any:
            return 'Any';
        default:
            return 'None';
    };
}
