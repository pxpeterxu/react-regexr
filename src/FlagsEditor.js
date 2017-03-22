'use strict';

var React = require('react');
var PureRenderMixin = require('react-addons-pure-render-mixin');

var Overlay = require('react-bootstrap/lib/Overlay');
var Tooltip = require('./Tooltip');

var FlagsEditor = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    value: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return { showMenu: false };
  },

  componentDidMount: function() {
    this._keydownListener = document.addEventListener('keydown', this.handleKeyDown);
  },

  componentWillUnmount: function() {
    document.removeEventListener('keydown', this._keydownListener);
  },

  toggleFlag: function(flag, e) {
    if (e) e.preventDefault();
    var flags = this.props.value;

    if (flags.indexOf(flag) === -1) {
      flags += flag;
    } else {
      flags = flags.replace(new RegExp(flag, 'g'), '');
    }

    this.props.onChange(flags);
  },

  toggleShowMenu: function(e) {
    e.preventDefault();
    this.setState({ showMenu: !this.state.showMenu });
  },

  hideMenu: function() {
    this.setState({ showMenu: false });
  },

  handleKeyDown: function(e) {
    if (this.state.showMenu) {
      if (e.key && 'gim'.indexOf(e.key) !== -1) {
        this.toggleFlag(e.key);
      }
    }
  },

  render: function() {
    var flags = this.props.value;
    var showMenu = this.state.showMenu;

    function hasFlag(char) {
      return flags.indexOf(char) !== -1;
    }

    var tooltip = (<Tooltip id="regexr-flags-menu">
      <div className="regexr regexr-menu">
        <header>
          Expression Flags
        </header>
        <hr />
        <a href="#ignoreCase" className="check"
            onClick={this.toggleFlag.bind(this, 'i')}>
          {hasFlag('i') ? '☑' : '☐'} ignore case <code>(i)</code>
        </a>
        <br />
        <a href="#global" className="check"
            onClick={this.toggleFlag.bind(this, 'g')}>
          {hasFlag('g') ? '☑' : '☐'} global (get all matches) <code>(g)</code>
        </a>
        <br />
        <a href="#multiLine" className="check"
            onClick={this.toggleFlag.bind(this, 'm')}>
          {hasFlag('m') ? '☑' : '☐'} multiline <code>(m)</code>
        </a>
      </div>
    </Tooltip>);

    return (<div className="regexr">
      <a className="regexr-flag-link"
          ref={function(elem) { this._flagsButton = elem; }.bind(this)}
          onClick={this.toggleShowMenu}>
        /{(flags + '\u00a0\u00a0\u00a0').substr(0, 3)} ▼
      </a>

      <Overlay rootClose
          show={showMenu}
          onHide={this.hideMenu}
          placement="left"
          container={this}
          target={function() { return this._flagsButton; }.bind(this)}>
        {tooltip}
      </Overlay>
    </div>);
  }
});

module.exports = FlagsEditor;
