var router = require('../src');
var log = require('ls-logger');
router.start(function () { return log.info('Server started'); });
router.route({
    method: 'GET',
    path: '/{...}',
    handler: {
        directory: './'
    }
});
router.route({
    method: 'GET',
    path: '/',
    handler: {
        file: 'debug/index.html'
    }
});
router.route({
    method: 'GET',
    path: '/users/{id: number}',
    handler: function (req, reply) { return reply("User id: " + req.params.id); }
});
router.route({
    method: 'GET',
    path: '/users/{name: string}',
    handler: function (req, reply) { return reply("Username: " + req.params.name); }
});
router.route({
    method: 'GET',
    path: '/users/create/{name: string}/{email: string}',
    handler: function (req, reply) { return reply("Name: " + req.params.name + ", Email: " + req.params.email); }
});
//# sourceMappingURL=index.js.map