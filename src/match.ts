import Types = require('../index.d.ts');
import Match = Types.Match;
import routes = require('./routes');
import log = require('ls-logger');
import requestParser = require('./parsers/request');
export = match;

function match(path: string): Types.RouteOptions {
    var parts = requestParser(path);

    // TODO: find matching routes
        
    var options: Types.RouteOptions = {
        method: 'GET',
        path: path,
        handler: (req, reply) => {
            console.log(req);
            reply('success');
        }
    }

    return options;
}

