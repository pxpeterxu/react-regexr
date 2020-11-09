/** @format */

'use strict';

var PropTypes = require('prop-types');

var React = require('react');
var shallowCompare = require('react-addons-shallow-compare');

var Overlay = require('react-bootstrap/lib/Overlay');
var Tooltip = require('./Tooltip');

class FlagsEditor extends React.Component {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.state = { showMenu: false }, this.toggleFlag = (flag, e) => {
      if (e) e.preventDefault();
      var flags = this.props.value;

      if (flags.indexOf(flag) === -1) {
        flags += flag;
      } else {
        flags = flags.replace(new RegExp(flag, 'g'), '');
      }

      this.props.onChange(flags);
    }, this.toggleShowMenu = e => {
      e.preventDefault();
      this.setState({ showMenu: !this.state.showMenu });
    }, this.hideMenu = () => {
      this.setState({ showMenu: false });
    }, this.handleKeyDown = e => {
      if (this.state.showMenu) {
        if (e.key && 'gim'.indexOf(e.key) !== -1) {
          this.toggleFlag(e.key);
        }
      }
    }, _temp;
  }

  componentDidMount() {
    this._keydownListener = document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this._keydownListener);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    var flags = this.props.value;
    var showMenu = this.state.showMenu;

    function hasFlag(char) {
      return flags.indexOf(char) !== -1;
    }

    var tooltip = React.createElement(
      Tooltip,
      { id: 'regexr-flags-menu' },
      React.createElement(
        'div',
        { className: 'regexr regexr-menu' },
        React.createElement(
          'header',
          null,
          'Expression Flags'
        ),
        React.createElement('hr', null),
        React.createElement(
          'a',
          { href: '#ignoreCase', className: 'check', onClick: this.toggleFlag.bind(this, 'i') },
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
          { href: '#global', className: 'check', onClick: this.toggleFlag.bind(this, 'g') },
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
          { href: '#multiLine', className: 'check', onClick: this.toggleFlag.bind(this, 'm') },
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

    return React.createElement(
      'div',
      { className: 'regexr' },
      React.createElement(
        'a',
        {
          className: 'regexr-flag-link',
          ref: function (elem) {
            this._flagsButton = elem;
          }.bind(this),
          onClick: this.toggleShowMenu
        },
        '/',
        (flags + '\u00a0\u00a0\u00a0').substr(0, 3),
        ' \u25BC'
      ),
      React.createElement(
        Overlay,
        {
          rootClose: true,
          show: showMenu,
          onHide: this.hideMenu,
          placement: 'left',
          container: this,
          target: function () {
            return this._flagsButton;
          }.bind(this)
        },
        tooltip
      )
    );
  }
}

FlagsEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

module.exports = FlagsEditor;