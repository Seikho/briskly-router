import router = require('../src');
import log = require('ls-logger');

var users = [
    { id: 1, name: 'seikho' },
    { id: 2, name: 'lorezzed' },
    { id: 3, name: 'dayson' }
];

var getId = (id: number) => users.filter(u => u.id === id)[0];
var getName = (name: string) => users.filter(u => u.name === name)[0];

router.start(() => log.info('Server started'));

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
    handler: (req, reply) => reply(users)
});

router.route({
    method: 'GET',
    path: '/users/{id: number}',
    handler: (req, reply) => reply(getId(req.params.id))
});

router.route({
    method: 'GET',
    path: '/users/{name: string}',
    handler: (req, reply) => reply(getName(req.params.name))
});

router.route({
    method: 'GET',
    path: '/users/create/{name: string}/{email: string}',
    handler: (req, reply) => reply(`Name: ${req.params.name}, Email: ${req.params.email}`)
});
