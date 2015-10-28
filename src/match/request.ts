import requestParser = require('../parsers/request');
export = toRequest;

function toRequest(path: string): Types.Request {
	var parts = requestParser(path);
	
	return {
		parts,
		path
	}
}