'use strict';

var React = require('react');
var PureRenderMixin = require('react-addons-pure-render-mixin');

var Tooltip = require('regexr/js/controls/Tooltip');

var FlagsEditor = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    value: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired
  },

  componentDidMount: function() {
    this.flagsTooltip = Tooltip.add(this._flagsButton,
      this._flagsMenu, { mode: 'press' });
  },

  toggleFlag: function(e) {
    e.preventDefault();
    var flag = e.target.getAttribute('data-flag');
    var flags = this.props.value;

    if (flags.indexOf(flag) === -1) {
      flags += flag;
    } else {
      flags = flags.replace(new RegExp(flag, 'g'), '');
    }

    this.props.onChange(flags);
  },

  render: function() {
    var flags = this.props.value;
    function hasFlag(char) {
      return flags.indexOf(char) !== -1;
    }

    return (<div>
      <div>
        <a className="regexr-flag-link"
            ref={function(elem) { this._flagsButton = elem; }.bind(this)}>
          /{(flags + '\u00a0\u00a0\u00a0').substr(0, 3)} ▼
        </a>
      </div>
      <div className="regexr-menu"
          ref={function(elem) { this._flagsMenu = elem; }.bind(this)}>
        <header>
          Expression Flags
        </header>
        <hr />
        <a href="#ignoreCase" className="check" data-flag="i"
            onClick={this.toggleFlag}>
          {hasFlag('i') ? '☑' : '☐'} ignore case <code>(i)</code>
        </a>
        <br />
        <a href="#global" className="check" data-flag="g"
            onClick={this.toggleFlag}>
          {hasFlag('g') ? '☑' : '☐'} global (get all matches) <code>(g)</code>
        </a>
        <br />
        <a href="#multiLine" className="check" data-flag="m"
            onClick={this.toggleFlag}>
          {hasFlag('m') ? '☑' : '☐'} multiline <code>(m)</code>
        </a>
      </div>
    </div>);
  }
});

module.exports = FlagsEditor;
