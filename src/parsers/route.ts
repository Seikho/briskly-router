import Types = require('../index.d.ts');
import fs = require('fs');
import path = require('path');
var PEG = require('pegjs');

export = parser.parse;

var grammar = fs.readFileSync(path.join(__dirname, 'route.peg')).toString();
var parser: { parse: (input: string) => Types.RoutePart[] } = PEG.buildParser(grammar);