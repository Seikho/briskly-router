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
    path: '/home',
    handler: {
        file: 'debug/index.html'
    }
});
//# sourceMappingURL=index.js.map