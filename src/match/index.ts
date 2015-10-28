import Match = Types.Match;
import routes = require('../routes');
import log = require('ls-logger');
import toRequest = require('./request');
export = match;

function match(path: string): Types.RouteOptions {
    var request = toRequest(path);   
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