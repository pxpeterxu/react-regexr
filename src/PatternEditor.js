'use strict';

var React = require('react');
var PureRenderMixin = require('react-addons-pure-render-mixin');
var CodeMirror = require('react-codemirror');
require('codemirror/addon/display/placeholder');

var ExpressionHighlighter = require('regexr-site/js/ExpressionHighlighter');
var ExpressionHover = require('regexr-site/js/ExpressionHover');
var RegexUtils = require('./RegexUtils');

var PatternEditor = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    value: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,

    width: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),  // Defaults to 100%
    height: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ])   // Defaults to auto
  },

  componentDidMount: function() {
    var elem = this._cmElem;

    var cm = elem.getCodeMirror();
    var width = this.props.width || '100%';
    var height = this.props.height || 'auto';
    cm.setSize(width, height);

    // Copied from regexr code:
    // Hacky method to disable overwrite mode on expressions to avoid overwriting flags
    cm.toggleOverwrite = function() {};

    this._cmElem = elem;
    this._expressionHighlighter = new ExpressionHighlighter(cm);
    this._expressionHover = new ExpressionHover(cm, this._expressionHighlighter);

    this.updateCodeMirror(this.props.value);
  },

  updateCodeMirror: function(pattern) {
    var parsed = RegexUtils.parsePattern(pattern);

    this._expressionHighlighter.draw(parsed.tree);
    this._expressionHover.token = parsed.token;
  },

  componentDidUpdate: function() {
    this.updateCodeMirror(this.props.value);
  },

  render: function() {
    var value = this.props.value;

    return (
      <CodeMirror
          className="regexr regexr-expression-editor"
          value={value}
          onChange={this.props.onChange}
          options={{
            lineNumbers: false,
            tabSize: 2,
            indentWithTabs: false,
            placeholder: '(Type a regular expression)',
            lineWrapping: true
          }}
          ref={function(elem) { this._cmElem = elem; }.bind(this)} />
    );
  }
});

module.exports = PatternEditor;
