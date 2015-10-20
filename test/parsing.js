var chai = require('chai');
var request = require('../src/parsers/request');
var expect = chai.expect;
describe('request parsing', function () {
    it('will return a single string part', function () {
        var parts = request('/a-string');
        expect(parts.length).to.equal(1);
        expect(testType(parts[0], 'string', 'a-string')).to.be.true;
    });
    it('will return a single number part', function () {
        var parts = request('/12345');
        expect(parts.length).to.equal(1);
        expect(testType(parts[0], 'number', 12345)).to.be.true;
    });
    it('will return a single array part', function () {
        var parts = request('/[1,2,3]');
        expect(parts.length).to.equal(1);
        expect(testType(parts[0], 'array', [1, 2, 3])).to.be.true;
    });
    it('will return a single object part', function () {
        var parts = request('/{ "a": true, "b": "blue" }');
        expect(parts.length).to.equal(1);
        expect(testType(parts[0], 'object', { a: true, b: 'blue' })).to.be.true;
    });
});
function testType(part, type, value) {
    if (part.type !== type) {
        console.log("Expected type '" + type + "'. Actual: '" + part.type + "'");
        return false;
    }
    if (type === 'string' || type === 'number') {
        if (part.value !== value) {
            console.log("Expected value '" + value + "'. Actual: '" + part.value + "'");
            return false;
        }
    }
    if (type === 'array') {
        if (!arraysEqual(part.value, value)) {
            console.log("Expected value: " + JSON.stringify(value));
            console.log("Actual value: " + JSON.stringify(part.value));
            return false;
        }
    }
    if (!objectsEqual(part.value, value)) {
        console.log("Expected value: " + JSON.stringify(value));
        console.log("Actual value: " + JSON.stringify(part.value));
        return false;
    }
    return true;
}
function arraysEqual(left, right) {
    return left.every(function (value, index) { return right[index] === value; });
}
function objectsEqual(left, right) {
    var leftEqual = Object.keys(left)
        .every(function (key) { return left[key] === right[key]; });
    var rightEqual = Object.keys(right)
        .every(function (key) { return right[key] === left[key]; });
    return leftEqual && rightEqual;
}
//# sourceMappingURL=parsing.js.map