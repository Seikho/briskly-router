import Types = require('../index.d.ts');
import chai = require('chai');
import request = require('../src/parsers/request');
import route = require('../src/parsers/route');
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
        
        it('will return a array type', () => {
            var r = route('/{param: array}');
            testPart(r[0], 'parameter', 'array');
        });
        
        it('will return a object type', () => {
            var r = route('/{param: object}');
            testPart(r[0], 'parameter', 'object');
        });
    })
    
})

function testPart(part: Types.RoutePart, type: string, cast?: string) {
    cast = cast || null;
    expect(part.type).to.equal(type);
    expect(part.cast).to.equal(cast);
}

function testType(part: Types.RequestPart, cast: string, value: any): void {
    expect(part.cast).to.equal(cast);
    if (part.type === 'string' || part.type === 'number')
        expect(part.value).to.equal(value);

    if (cast === 'array')
        expect(part.value).to.have.same.members(value);

    if (cast === 'object')
        expect(part.value).to.deep.equal(value);
}