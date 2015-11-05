var match = require('../src/match/route-part');
var chai = require('chai');
var rt = require('../src/parsers/route');
var expect = chai.expect;
describe('route part match tests', function () {
    describe('Part tests', function () {
        it('will match on Part', function () {
            compare('/abcd', '/abcd', 0 /* Part */);
        });
        it('will not match on Part when parts are dissimilar', function () {
            compare('/abcd', '/abcdef', 3 /* None */);
        });
        it('will not match Part with Type', function () {
            compare('/abcd', '/{param}', 3 /* None */);
            compare('/abcd', '/{param:string}', 3 /* None */);
            compare('/abcd', '/{param:number}', 3 /* None */);
            compare('/abcd', '/{param:array}', 3 /* None */);
            compare('/abcd', '/{param:object}', 3 /* None */);
        });
        it('will not match Part with Multi', function () {
            compare('/abcd', '/pre{param}post', 3 /* None */);
        });
        it('will not match Part with Wildcard', function () {
            compare('/abcd', '/{...}', 3 /* None */);
        });
    });
    describe('Multi tests', function () {
        it('will match when parameter names are equal', function () {
            compare('/pre{param}post', '/pre{param}post', 5 /* Multi */);
        });
        it('will match when parameter names differ', function () {
            compare('/pre{param}post', '/pre{anotherParam}post', 5 /* Multi */);
        });
        it('will match when only prefix is present', function () {
            compare('/pre{param}', '/pre{anotherParam}', 5 /* Multi */);
        });
        it('will match when only suffix is present', function () {
            compare('/{param}post', '/{anotherParam}post', 5 /* Multi */);
        });
        it('will not match prefix is on left and suffix is on right', function () {
            compare('/pre{param}', '/{param}post', 3 /* None */);
        });
        it('will not match prefix+suffix is on left and suffix is on right', function () {
            compare('/pre{param}post', '/{param}post', 3 /* None */);
        });
        it('will not match prefix is on left and none are on right', function () {
            compare('/pre{param}', '/{param}', 3 /* None */);
        });
        it('will not match suffix is on left and none are on right', function () {
            compare('/{param}post', '/{param}', 3 /* None */);
        });
    });
    describe('Type tests', function () {
        it('will match when Types are both equivalent', function () {
            compare('/{param}', '/{anotherParam}', 1 /* Type */);
            compare('/{param: string}', '/{anotherParam: string}', 1 /* Type */);
            compare('/{para: number}', '/{anotherParam:number}', 1 /* Type */);
            compare('/{param:array}', '/{anotherParam:array}', 1 /* Type */);
            compare('/{param:object}', '/{anotherParam:object}', 1 /* Type */);
            compare('/{param:any}', '/{anotherParam:any}', 1 /* Type */);
        });
        it('will not match when Types are dissimilar', function () {
            compare('/{param: string}', '/{param: number}', 3 /* None */);
            compare('/{param: string}', '/{param: any}', 3 /* None */);
            compare('/{param: string}', '/{param: array}', 3 /* None */);
            compare('/{param: string}', '/{param: object}', 3 /* None */);
        });
    });
    it('will match when parts are wildcards', function () {
        compare('/{...}', '/{...}', 4 /* Wildcard */);
    });
});
function compare(left, right, expected, index) {
    index = index || 0;
    var r1 = rt(left);
    var r2 = rt(right);
    var result = match(r1[index], r2[index]);
    expect(matchString(result)).to.equal(matchString(expected));
}
function matchString(match) {
    switch (match) {
        case 5 /* Multi */:
            return 'Multi';
        case 0 /* Part */:
            return 'Part';
        case 1 /* Type */:
            return 'Type';
        case 4 /* Wildcard */:
            return 'Wildcard';
        case 3 /* None */:
            return 'None';
        case 2 /* Any */:
            return 'Any';
    }
}
//# sourceMappingURL=route-match.js.map