var PEG = require('pegjs');
var grammar = require('./route.peg');
var parser = PEG.buildParser(grammar);
module.exports = parser;
//# sourceMappingURL=route.js.map