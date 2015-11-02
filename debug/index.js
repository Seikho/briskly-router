var router = require('../src');
var log = require('ls-logger');
var users = [
    { id: 1, name: 'seikho' },
    { id: 2, name: 'lorezzed' },
    { id: 3, name: 'dayson' }
];
var getId = function (id) { return users.filter(function (u) { return u.id === id; })[0]; };
var getName = function (name) { return users.filter(function (u) { return u.name === name; })[0]; };
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
    path: '/users',
    handler: function (req, reply) { return reply(users); }
});
router.route({
    method: 'GET',
    path: '/users/{id: number}',
    handler: function (req, reply) { return reply(getId(req.params.id)); }
});
router.route({
    method: 'GET',
    path: '/users/{name: string}',
    handler: function (req, reply) { return reply(getName(req.params.name)); }
});
router.route({
    method: 'GET',
    path: '/users/create/{name: string}/{email: string}',
    handler: function (req, reply) { return reply("Name: " + req.params.name + ", Email: " + req.params.email); }
});
//# sourceMappingURL=index.js.map