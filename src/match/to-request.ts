import Types = require('../index.d.ts');
import requestParser = require('../parsers/request');
export = toRequest;

function toRequest(path: string, method?: string): Types.Request {
	var parts = requestParser(path);
	method = (method || 'GET').toUpperCase();
    
	return {
		parts,
		path,
        method
	};
}