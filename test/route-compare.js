var match = require('../src/match/route');
var chai = require('chai');
var parse = require('../src/parsers/route');
var route = require('../src/route');
var routes = require('../src/routes');
var expect = chai.expect;
describe('ambiguous route tests', function () {
    // Empty routes before starting
    it('will start with no routes in route table', function () {
        while (routes.pop()) { }
        expect(routes.length).to.equal(0);
    });
    it('will not match on Part (no routes)', curryFind('/no-route', false));
    it('will match on Part', curryAdd('/abcdef'));
    it('will not match on Part (dissimilar)', curryFind('/foobar', false));
    it('will not match on Type any (none expected)', curryFind('/{param:any}', false));
    it('will not match on Type string (none expected)', curryFind('/{param:string}', false));
    it('will not match on Type number (none expected)', curryFind('/{param:number}', false));
    it('will not match on Type array (none expected)', curryFind('/{param:array}', false));
    it('will not match on Type object (none expected)', curryFind('/{param:object}', false));
    it('will not match on Wildcard (none expected)', curryFind('/{...}', false));
    it('will not match on Multi w/ prefix only (none expected)', curryFind('/pre{param}', false));
    it('will not match on Multi w/ suffix only (none expected)', curryFind('/{param}post', false));
    it('will not match on Multi w/ prefix and suffix (none expected)', curryFind('/pre{param}post', false));
    it('will match on string type', function () {
        add('/{param: string}');
        find('/{diffParam: string}', true);
    });
    it('will match on number type', curryAdd('/{param: number}'));
    it('will match on array type', curryAdd('/{param: array}'));
    it('will match on object type', curryAdd('/{param: object}'));
    it('will match on wildcard type', curryAdd('/{...}'));
    it('will match on any type', curryAdd('/{param: any}'));
    it('will match on Multi with prefix only', function () {
        add('/pre{param}');
        find('/pre{diffParam: any}', true);
    });
    it('will not mtach when Multi prefix differs', curryFind('/pro{param}', false));
    it('will match on Multi with suffix only', function () {
        add('/{param}post');
        find('/{diffParam: any}post', true);
    });
    it('will not mtach when Multi suffix differs', curryFind('/{param}past', false));
    it('will match on Multi with prefix and suffix', function () {
        add('/pre{param}post');
        find('/{diffParam: any}post', true);
    });
    it('will not match when Multi type differs', curryFind('/pre{param: string}post', false));
    it('will match on Multi string, prefix and suffix', function () {
        add('/pre{param:string}post');
        find('/pre{diff:string}post', true);
    });
    it('will match on Multi number', curryAdd('/pre{param:number}post'));
    it('will match on Multi array', curryAdd('/pre{param:array}post'));
    it('will match on Multi object', curryAdd('/pre{param:object}post'));
    it('will throw when adding an ambiguous route', function () {
        expect(add.bind(add, '/abcdef')).to.throw();
    });
});
function curryAdd(path) {
    return function () {
        add(path);
        find(path, true);
    };
}
function curryFind(path, expected) {
    return function () { return find(path, expected); };
}
function find(path, expected) {
    var route = parse(path);
    var matches = match(route);
    if (expected)
        expect(matches).to.not.be.empty;
    else {
        if (matches.length > 0)
            console.log(matches[0]); // Diagnostic purposes
        expect(matches).to.be.empty;
    }
}
function add(path) {
    route({
        method: 'GET',
        path: path,
        handler: function () { }
    });
}
//# sourceMappingURL=route-compare.js.map