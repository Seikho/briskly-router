import match = require('../src/match/route');
import chai = require('chai');
import parse = require('../src/parsers/route');
import route = require('../src/route');
import routes = require('../src/routes');
var expect = chai.expect;


describe('ambiguous route tests', () => {
    
    // Empty routes before starting
    it('will start with no routes in route table', () => {
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

    it('will match on string type', () => {
        add('/{param: string}');
        find('/{diffParam: string}', true);
    });

    it('will match on number type', curryAdd('/{param: number}'));

    it('will match on array type', curryAdd('/{param: array}'));

    it('will match on object type', curryAdd('/{param: object}'));

    it('will match on wildcard type', curryAdd('/{...}'));

    it('will match on any type', curryAdd('/{param: any}'));

    it('will match on Multi with prefix only', () => {
        add('/pre{param}');
        find('/pre{diffParam: any}', true);
    });

    it('will not mtach when Multi prefix differs', curryFind('/pro{param}', false));

    it('will match on Multi with suffix only', () => {
        add('/{param}post');
        find('/{diffParam: any}post', true);
    });

    it('will not mtach when Multi suffix differs', curryFind('/{param}past', false));

    it('will match on Multi with prefix and suffix', () => {
        add('/pre{param}post');
        find('/{diffParam: any}post', true);
    });
    
    it('will not match when Multi type differs', curryFind('/pre{param: string}post', false))
    
    it('will match on Multi string, prefix and suffix', () => {
       add('/pre{param:string}post');
       find('/pre{diff:string}post', true);
    });
    
    it('will match on Multi number', curryAdd('/pre{param:number}post'));
    
    it('will match on Multi array', curryAdd('/pre{param:array}post'));
    
    it('will match on Multi object', curryAdd('/pre{param:object}post'));
    
    it('will throw when adding an ambiguous route', () => {
       expect(add.bind(add, '/abcdef')).to.throw();
    });
});

function curryAdd(path: string) {
    return () => {
        add(path);
        find(path, true);
    };
}

function curryFind(path: string, expected: boolean) {
    return () => find(path, expected);
}

function find(path: string, expected: boolean) {
    let route = parse(path);
    var matches = match(route);

    if (expected) expect(matches).to.not.be.empty
    else {
        if (matches.length > 0)
            console.log(matches[0]); // Diagnostic purposes
            
        expect(matches).to.be.empty;
    }
}

function add(path: string) {
    route({
        method: 'GET',
        path,
        handler: () => { }
    });
}