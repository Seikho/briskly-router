import Match = Types.Match;
import match = require('../src/match/route-part');
import chai = require('chai');
import rt = require('../src/parsers/route');
var expect = chai.expect;

describe('route part match tests', () => {

    describe('Part tests', () => {
        it('will match on Part', () => {
            compare('/abcd', '/abcd', Match.Part);
        });

        it('will not match on Part when parts are dissimilar', () => {
            compare('/abcd', '/abcdef', Match.None);
        });

        it('will not match Part with Type', () => {
            compare('/abcd', '/{param}', Match.None);
            compare('/abcd', '/{param:string}', Match.None);
            compare('/abcd', '/{param:number}', Match.None);
            compare('/abcd', '/{param:array}', Match.None);
            compare('/abcd', '/{param:object}', Match.None);
        });

        it('will not match Part with Multi', () => {
            compare('/abcd', '/pre{param}post', Match.None);
        });

        it('will not match Part with Wildcard', () => {
            compare('/abcd', '/{...}', Match.None);
        });
    });

    describe('Multi tests', () => {
        it('will match when parameter names are equal', () => {
            compare('/pre{param}post', '/pre{param}post', Match.Multi);
        });

        it('will match when parameter names differ', () => {
            compare('/pre{param}post', '/pre{anotherParam}post', Match.Multi);
        });

        it('will match when only prefix is present', () => {
            compare('/pre{param}', '/pre{anotherParam}', Match.Multi);
        });

        it('will match when only suffix is present', () => {
            compare('/{param}post', '/{anotherParam}post', Match.Multi);
        });

        it('will not match prefix is on left and suffix is on right', () => {
            compare('/pre{param}', '/{param}post', Match.None);
        });

        it('will not match prefix+suffix is on left and suffix is on right', () => {
            compare('/pre{param}post', '/{param}post', Match.None);
        });

        it('will not match prefix is on left and none are on right', () => {
            compare('/pre{param}', '/{param}', Match.None);
        });

        it('will not match suffix is on left and none are on right', () => {
            compare('/{param}post', '/{param}', Match.None);
        });
    });

    describe('Type tests', () => {
        it('will match when Types are both equivalent', () => {
            compare('/{param}', '/{anotherParam}', Match.Type);
            compare('/{param: string}', '/{anotherParam: string}', Match.Type);
            compare('/{para: number}', '/{anotherParam:number}', Match.Type);
            compare('/{param:array}', '/{anotherParam:array}', Match.Type);
            compare('/{param:object}', '/{anotherParam:object}', Match.Type);
            compare('/{param:any}', '/{anotherParam:any}', Match.Type);
        });

        it('will not match when Types are dissimilar', () => {
            compare('/{param: string}', '/{param: number}', Match.None);
            compare('/{param: string}', '/{param: any}', Match.None);
            compare('/{param: string}', '/{param: array}', Match.None);
            compare('/{param: string}', '/{param: object}', Match.None);
        });

    });

    it('will match when parts are wildcards', () => {
        compare('/{...}', '/{...}', Match.Wildcard);
    });    
});

function compare(left: string, right: string, expected: Match, index?: number) {
    index = index || 0;
    var r1 = rt(left);
    var r2 = rt(right);
    var result = match(r1[index], r2[index]);
    expect(matchString(result)).to.equal(matchString(expected));
}

function matchString(match: Match) {
    switch (match) {
        case Match.Multi:
            return 'Multi';
        case Match.Part:
            return 'Part';
        case Match.Type:
            return 'Type'
        case Match.Wildcard:
            return 'Wildcard';
        case Match.None:
            return 'None';
        case Match.Any:
            return 'Any';
    }
}
