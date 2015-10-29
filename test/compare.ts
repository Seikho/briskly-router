import compare = require('../src/match/compare');
import route = require('../src/parsers/route');
import request = require('../src/match/request');
import best = require('../src/match/best');
import add = require('../src/add');
import * as chai from 'chai'
import Match = Types.Match;
var expect = chai.expect;

describe('request/route comparison tests', () => {
	
	it('will return a single Part match', () => {
		addRoute('/a-part');
        var req = request('/a-part');                
		var match = best(req);
        expect(match).to.exist;
        expect(match.options.path).to.equal('/a-part');        
	});
    
    it('will not return a match', () => {
       var req = request('/a-sparta');
       var match = best(req);
       expect(match).to.not.exist; 
    });
    
    it('will return a match based on string type', () => {
        addRoute('/{word: string}');
        var match = best(request('/a-sparta'));
        expect(match).to.exist;
        expect(match.options.path).to.equal('/{word: string}');
    });
    
    it('will return not return a match due to type mismatch', () => {
       var match = best(request('/12345'));
       expect(match).to.not.exist; 
    });
	
	
});

function addRoute(path: string, method?: string) {
    method = method || 'get';
    add({
        method,
        path,
        handler: () => {}
    });
}

function test(matches: Array<Match>, expected: Array<Match>) {
	expect(matches.length).to.equal(expected.length);
	
	matches.forEach((match, index) => expect(match).to.equal(expected[index]));
}