var fs = require('fs');
var path = require('path');
var PEG = require('pegjs');
var grammar = fs.readFileSync(path.join(__dirname, 'route.peg')).toString();
var parser = PEG.buildParser(grammar);
module.exports = parser.parse;
//# sourceMappingURL=route.js.map