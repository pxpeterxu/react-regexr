'use strict';

var PropTypes = require('prop-types');

var React = require('react');
var shallowCompare = require('react-addons-shallow-compare');

var Tooltip = React.createClass({
  displayName: 'Tooltip',

  propTypes: {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },

  render: function () {
    var children = this.props.children;
    var className = this.props.className || '';

    return React.createElement(
      'div',
      { className: 'regexr regexr-react-tooltip ' + className },
      children
    );
  }
});

module.exports = Tooltip;