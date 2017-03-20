'use strict';

var React = require('react');
var PureRenderMixin = require('react-addons-pure-render-mixin');

var Tooltip = require('regexr/js/controls/Tooltip');

var FlagsEditor = React.createClass({
  displayName: 'FlagsEditor',

  mixins: [PureRenderMixin],

  propTypes: {
    value: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired
  },

  componentDidMount: function () {
    this.flagsTooltip = Tooltip.add(this._flagsButton, this._flagsMenu, { mode: 'press' });
  },

  toggleFlag: function (e) {
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

  render: function () {
    var flags = this.props.value;
    function hasFlag(char) {
      return flags.indexOf(char) !== -1;
    }

    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        null,
        React.createElement(
          'a',
          { className: 'regexr-flag-link',
            ref: function (elem) {
              this._flagsButton = elem;
            }.bind(this) },
          '/',
          (flags + '\u00a0\u00a0\u00a0').substr(0, 3),
          ' \u25BC'
        )
      ),
      React.createElement(
        'div',
        { className: 'regexr-menu',
          ref: function (elem) {
            this._flagsMenu = elem;
          }.bind(this) },
        React.createElement(
          'header',
          null,
          'Expression Flags'
        ),
        React.createElement('hr', null),
        React.createElement(
          'a',
          { href: '#ignoreCase', className: 'check', 'data-flag': 'i',
            onClick: this.toggleFlag },
          hasFlag('i') ? '☑' : '☐',
          ' ignore case ',
          React.createElement(
            'code',
            null,
            '(i)'
          )
        ),
        React.createElement('br', null),
        React.createElement(
          'a',
          { href: '#global', className: 'check', 'data-flag': 'g',
            onClick: this.toggleFlag },
          hasFlag('g') ? '☑' : '☐',
          ' global (get all matches) ',
          React.createElement(
            'code',
            null,
            '(g)'
          )
        ),
        React.createElement('br', null),
        React.createElement(
          'a',
          { href: '#multiLine', className: 'check', 'data-flag': 'm',
            onClick: this.toggleFlag },
          hasFlag('m') ? '☑' : '☐',
          ' multiline ',
          React.createElement(
            'code',
            null,
            '(m)'
          )
        )
      )
    );
  }
});

module.exports = FlagsEditor;