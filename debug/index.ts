import router = require('../src');
import log = require('ls-logger');

router.start(() => log.info('Server started'));