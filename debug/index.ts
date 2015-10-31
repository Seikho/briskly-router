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
    path: '/home',
    handler: {
        file: 'debug/index.html'
    }
})