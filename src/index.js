var route = require('./route');
var createServer = require('./server');
var Promise = require('bluebird');
var pkg = require('../package.json');
var Router = (function () {
    function Router(options) {
        this.server = createServer();
        this.port = 2189;
        this.host = null;
        this.routes = [];
        this.route = route(this);
        this.connection(options);
    }
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
    return Router;
})();
exports.Router = Router;
var version = pkg.version;
//# sourceMappingURL=index.js.map