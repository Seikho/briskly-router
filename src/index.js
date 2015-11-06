var route = require('./route');
var createServer = require('./server');
var Promise = require('bluebird');
var handler = require('./server/handler');
var pkg = require('../package.json');
var Router = (function () {
    function Router(options) {
        this.routes = [];
        this.server = createServer(this.routes);
        this.port = 2189;
        this.host = null;
        this.connection(options);
    }
    Router.prototype.handle = function (message, response) {
        handler(message, response, this.routes);
    };
    Router.prototype.start = function (callback) {
        var _this = this;
        var p = new Promise(function (resolve, reject) {
            var promiseCb = function (err) {
                if (err)
                    reject(err);
                else
                    resolve(void 0);
                if (callback)
                    callback(err);
            };
            _this.server.listen(_this.port, _this.host, promiseCb);
        });
        return p;
    };
    ;
    Router.prototype.stop = function (callback) {
        var _this = this;
        var p = new Promise(function (resolve) {
            var promiseCb = function () {
                resolve(void 0);
                if (callback)
                    callback();
            };
            _this.server.close(promiseCb);
        });
        return p;
    };
    Router.prototype.connection = function (options) {
        if (!options)
            return;
        if (options.host)
            this.host = options.host;
        if (options.port)
            this.port = options.port;
    };
    Router.prototype.route = function (options) {
        route(options, this.routes);
    };
    return Router;
})();
exports.Router = Router;
exports.version = pkg.version;
//# sourceMappingURL=index.js.map