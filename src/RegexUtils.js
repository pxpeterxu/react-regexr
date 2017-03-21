'use strict';

var RegExLexer = require('regexr-site/js/RegExLexer');
var lexer = new RegExLexer();

/**
 * Ported from regexr/js/DocView.js; given a list of matches
 * (from RegExJS.match), see if any of them contains the
 * character at the given `index`
 * @param {Array}   matches    list of matches from RegExJS.match
 * @param {int}     index      index at which to find match
 * @param {boolean} inclusive  whether to include char at end
 * @return {Object} match if found, undefined if not
 */
function getMatchAt(matches, index, inclusive) {
  var match, offset = inclusive ? -1 : 0;
  for (var i = 0, l = matches.length; i < l; i++) {
    match = matches[i];
    if (match.end < index + offset) {
      continue;
    }
    if (match.index > index) {
      break;
    }
    return match;
  }

  return undefined;
}

/**
 * Parse only the pattern part of a regex using RegExr's
 * RegExLexer
 * @param {String} pattern    pattern part of regx to lex
 * @return object with:
 *         - tree: the parsed tree
 *         - errors: list of errors, if any
 *         - token: the token
 */
function parsePattern(pattern) {
  var ret = lexer.parse(pattern, 'pattern');
  return {
    tree: ret,
    errors: lexer.errors,
    token: lexer.token
  };
}

module.exports = {
  getMatchAt: getMatchAt,
  parsePattern: parsePattern
};
