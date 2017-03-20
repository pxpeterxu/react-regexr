'use strict';

/**
 * Decompose a Javascript regex expression into its
 * parts (pattern and flags)
 * @param {String} expr   expression in the form of /blah/gi
 * @return object with { pattern, flags } key
 */

function decomposeExpression(expr) {
  var index = expr.lastIndexOf('/');
  return {
    pattern: expr.substring(1, index),
    flags: expr.substr(index + 1)
  };
}

/**
 * Builds a JS regular expression object from the given string
 * @param {String} expr   expression in the form of /blah/gi
 * @return {RegExp} Javascript RegExp object, or undefined if invalid
 */
function getRegex(expr) {
  var parts = decomposeExpression(expr);

  try {
    return new RegExp(parts.pattern, parts.flags);
  } catch (e) {
    return undefined;
  }
}

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
  var match,
      offset = inclusive ? -1 : 0;
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

module.exports = {
  decomposeExpression: decomposeExpression,
  getRegex: getRegex,
  getMatchAt: getMatchAt
};