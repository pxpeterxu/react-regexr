'use strict';

var React = require('react');
var PureRenderMixin = require('react-addons-pure-render-mixin');

var Tooltip = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    children: React.PropTypes.node.isRequired,
    className: React.PropTypes.string,
  },

  render: function() {
    var children = this.props.children;
    var className = this.props.className || '';

    return (
      <div className={'regexr regexr-react-tooltip ' + className}>
        {children}
      </div>
    );
  }
});

module.exports = Tooltip;
