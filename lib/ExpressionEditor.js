'use strict';

var React = require('react');
var shallowCompare = require('react-addons-shallow-compare');

var PatternEditor = require('./PatternEditor');
var FlagsEditor = require('./FlagsEditor');

var ExpressionEditor = React.createClass({
  displayName: 'ExpressionEditor',

  propTypes: {
    pattern: React.PropTypes.string.isRequired,
    flags: React.PropTypes.string.isRequired,

    onPatternChange: React.PropTypes.func.isRequired,
    onFlagsChange: React.PropTypes.func.isRequired,

    width: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]), // Defaults to 100%
    height: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]) // Defaults to auto
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },

  render: function () {
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
          height: this.props.height })
      ),
      React.createElement(
        'div',
        { className: 'regexr-right' },
        React.createElement(FlagsEditor, {
          value: this.props.flags,
          onChange: this.props.onFlagsChange })
      )
    );
  }
});

module.exports = ExpressionEditor;