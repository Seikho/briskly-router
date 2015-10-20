import Types = require('../index.d.ts');
import chai = require('chai');
import request = require('../src/parsers/request');
var expect = chai.expect;

describe('request parsing', () => {

    it('will return a single string part', () => {       
        var parts = request('/a-string');
        expect(parts.length).to.equal(1);
        expect(testType(parts[0], 'string', 'a-string')).to.be.true;
    });

    it('will return a single number part', () => {
        var parts = request('/12345');
        expect(parts.length).to.equal(1);
        expect(testType(parts[0], 'number', 12345)).to.be.true;
    });
    
    it('will return a single array part', () => {
       var parts = request('/[1,2,3]');
       expect(parts.length).to.equal(1);
       expect(testType(parts[0], 'array', [1,2,3])).to.be.true; 
    });
    
    it('will return a single object part', () => {
       var parts = request('/{ "a": true, "b": "blue" }');
       expect(parts.length).to.equal(1);
       expect(testType(parts[0], 'object', { a: true, b: 'blue'})).to.be.true; 
    });
});

function testType(part: Types.Part, type: string, value: any): boolean {
    if (part.type !== type) {
        console.log(`Expected type '${type}'. Actual: '${part.type}'`);
        return false;
    }

    if (type === 'string' || type === 'number') {
        if (part.value !== value) {
            console.log(`Expected value '${value}'. Actual: '${part.value}'`);
            return false;
        }
        return true;
    }

    if (type === 'array') {
        if (!arraysEqual(part.value, value)) {
            console.log(`Expected value: ${JSON.stringify(value) }`);
            console.log(`Actual value: ${JSON.stringify(part.value) }`);
            return false;
        }
        return true;
    }

    if (!objectsEqual(part.value, value)) {
        console.log(`Expected value: ${JSON.stringify(value) }`);
        console.log(`Actual value: ${JSON.stringify(part.value) }`);
        return false;
    }


    return true;
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