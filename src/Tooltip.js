'use strict';

var React = require('react');
var shallowCompare = require('react-addons-shallow-compare');

var Tooltip = React.createClass({
  propTypes: {
    children: React.PropTypes.node.isRequired,
    className: React.PropTypes.string,
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },

  render: function() {
    var children = this.props.children;
    var className = this.props.className || '';

    return (
      <div className={'regexr regexr-react-tooltip ' + className}>
        {children}
      </div>
    );
  },
});

module.exports = Tooltip;
