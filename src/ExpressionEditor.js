/** @format */

'use strict';

var PropTypes = require('prop-types');

var React = require('react');
var shallowCompare = require('react-addons-shallow-compare');

var PatternEditor = require('./PatternEditor');
var FlagsEditor = require('./FlagsEditor');

var ExpressionEditor = React.createClass({
  propTypes: {
    pattern: PropTypes.string.isRequired,
    flags: PropTypes.string.isRequired,

    onPatternChange: PropTypes.func.isRequired,
    onFlagsChange: PropTypes.func.isRequired,

    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Defaults to 100%
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Defaults to auto
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },

  render: function () {
    return (
      <div className="regexr regexr-expression">
        <div className="regexr-left">/</div>
        <div>
          <PatternEditor
            value={this.props.pattern}
            onChange={this.props.onPatternChange}
            width={this.props.width}
            height={this.props.height}
          />
        </div>
        <div className="regexr-right">
          <FlagsEditor value={this.props.flags} onChange={this.props.onFlagsChange} />
        </div>
      </div>
    );
  },
});

module.exports = ExpressionEditor;
