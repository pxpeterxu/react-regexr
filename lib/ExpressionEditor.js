/** @format */

'use strict';

var PropTypes = require('prop-types');

var React = require('react');
var shallowCompare = require('react-addons-shallow-compare');

var PatternEditor = require('./PatternEditor');
var FlagsEditor = require('./FlagsEditor');

class ExpressionEditor extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    return React.createElement(
      'div',
      { className: 'regexr regexr-expression' },
      React.createElement(
        'div',
        { className: 'regexr-left' },
        '/'
      ),
      React.createElement(
        'div',
        null,
        React.createElement(PatternEditor, {
          value: this.props.pattern,
          onChange: this.props.onPatternChange,
          width: this.props.width,
          height: this.props.height
        })
      ),
      React.createElement(
        'div',
        { className: 'regexr-right' },
        React.createElement(FlagsEditor, { value: this.props.flags, onChange: this.props.onFlagsChange })
      )
    );
  }
}

ExpressionEditor.propTypes = {
  pattern: PropTypes.string.isRequired,
  flags: PropTypes.string.isRequired,

  onPatternChange: PropTypes.func.isRequired,
  onFlagsChange: PropTypes.func.isRequired,

  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Defaults to 100%
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]) // Defaults to auto
};

module.exports = ExpressionEditor;