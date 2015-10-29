import requestParser = require('../parsers/request');
export = toRequest;

function toRequest(path: string, method: string): Types.Request {
	var parts = requestParser(path);
	method = method.toUpperCase();
    
	return {
		parts,
		path,
        method
	};
}