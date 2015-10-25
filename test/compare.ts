import compare = require('../src/match/compare');
import route = require('../src/parsers/route');
import request = require('../src/parsers/request');
import * as chai from 'chai'
import Match = Types.Match;
var expect = chai.expect;

describe('request/route comparison tests', () => {
	
	it('will return a single Part match', () => {
		var rt = route('/a-part');
		var req = request('/a-part');
	});
	
	
});

function test(matches: Array<Match>, expected: Array<Match>) {
	expect(matches.length).to.equal(expected.length);
	
	matches.forEach((match, index) => expect(match).to.equal(expected[index]));
}