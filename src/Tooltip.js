/** @format */

'use strict';

var PropTypes = require('prop-types');

var React = require('react');
var shallowCompare = require('react-addons-shallow-compare');

class Tooltip extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    var children = this.props.children;
    var className = this.props.className || '';

    return <div className={'regexr regexr-react-tooltip ' + className}>{children}</div>;
  }
}

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

module.exports = Tooltip;
