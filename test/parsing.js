var chai = require('chai');
var request = require('../src/parsers/request');
var expect = chai.expect;
describe('request parsing', function () {
    it('will return a single string part', function () {
        var parts = request('/a-string');
        expect(parts.length).to.equal(1);
        testType(parts[0], 'string', 'a-string');
    });
    it('will return a single number part', function () {
        var parts = request('/12345');
        expect(parts.length).to.equal(1);
        testType(parts[0], 'number', 12345);
    });
    it('will return a single array part', function () {
        var parts = request('/[1,2,3]');
        expect(parts.length).to.equal(1);
        testType(parts[0], 'array', [1, 2, 3]);
    });
    it('will return a single object part', function () {
        var parts = request('/{ "a": true, "b": "blue" }');
        expect(parts.length).to.equal(1);
        testType(parts[0], 'object', { a: true, b: 'blue' });
    });
    it('will return two parts, string and string', function () {
        var parts = request('/first/second');
        expect(parts.length).to.equal(2);
        testType(parts[0], 'string', 'first');
        testType(parts[1], 'string', 'second');
    });
    it('will return two parts, string and number', function () {
        var parts = request('/first/12345');
        testType(parts[0], 'string', 'first');
        testType(parts[1], 'number', 12345);
    });
    it('will return two parts, string and array', function () {
        var parts = request('/first/[1,2,3]');
        testType(parts[0], 'string', 'first');
        testType(parts[1], 'array', [1, 2, 3]);
    });
    it('will return two parts, string and object', function () {
        var parts = request('/first/{ "foo": "bar", "baz": [1,2,3]}');
        testType(parts[0], 'string', 'first');
        testType(parts[1], 'object', { foo: 'bar', baz: [1, 2, 3] });
    });
});
function testType(part, type, value) {
    expect(part.type).to.equal(type);
    if (part.type === 'string' || part.type === 'number')
        expect(part.value).to.equal(value);
    if (type === 'array')
        expect(part.value).to.have.same.members(value);
    if (type === 'object')
        expect(part.value).to.deep.equal(value);
}
//# sourceMappingURL=parsing.js.map