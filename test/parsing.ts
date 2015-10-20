import Types = require('../index.d.ts');
import chai = require('chai');
import request = require('../src/parsers/request');
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
});

function testType(part: Types.Part, type: string, value: any): void {
    expect(part.type).to.equal(type);
    if (part.type === 'string' || part.type === 'number')
        expect(part.value).to.equal(value);

    if (type === 'array')
        expect(part.value).to.have.same.members(value);

    if (type === 'object')
        expect(part.value).to.deep.equal(value);
}

function arraysEqual(left: any[], right: any[]) {
    return left.every((value, index) => right[index] === value);
}

function objectsEqual(left: any, right: any) {
    var leftEqual = Object.keys(left)
        .every(key => left[key] === right[key]);

    var rightEqual = Object.keys(right)
        .every(key => right[key] === left[key]);

    return leftEqual && rightEqual;
}