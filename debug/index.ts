import router = require('../src');
import log = require('ls-logger');

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
    path: '/users/{id: number}',
    handler: (req, reply) => reply(`User id: ${req.params.id}`)
});

router.route({
    method: 'GET',
    path: '/users/{name: string}',
    handler: (req, reply) => reply(`Username: ${req.params.name}`)
});

