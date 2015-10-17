import Types = require('../index.d.ts');
import routes = require('./routes');
import log = require('ls-logger');
export = match;

function match(path: string): Types.RouteOptions {
    
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