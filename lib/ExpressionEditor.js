'use strict';

var React = require('react');
var PureRenderMixin = require('react-addons-pure-render-mixin');
var CodeMirror = require('react-codemirror');

var ExpressionHighlighter = require('regexr/js/ExpressionHighlighter');
var ExpressionHover = require('regexr/js/ExpressionHover');
var RegExLexer = require('regexr/js/RegExLexer');
var CMUtils = require('regexr/js/utils/CMUtils');

var ExpressionEditor = React.createClass({
  displayName: 'ExpressionEditor',

  mixins: [PureRenderMixin],

  propTypes: {
    expression: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired
  },

  initializeCM: function (elem) {
    var cm = elem.getCodeMirror();
    cm.setSize('100%', 'auto');

    // Copied from regexr code:
    // Hacky method to disable overwrite mode on expressions to avoid overwriting flags
    cm.toggleOverwrite = function () {};

    // Require regex to be a single line
    cm.on('beforeChange', CMUtils.enforceSingleLine);

    this._cmElem = elem;
    this._expressionHighlighter = new ExpressionHighlighter(cm);
    this._expressionHover = new ExpressionHover(cm, this._expressionHighlighter);
    this._exprLexer = new RegExLexer();

    this.updateCodeMirror(this.props.expression);
  },

  updateCodeMirror: function (expr) {
    var cm = this._cmElem.getCodeMirror();

    this._expressionHighlighter.draw(this._exprLexer.parse(expr));
    this._expressionHover.token = this._exprLexer.token;

    var doc = cm.getDoc();

    // Make the left and right slashes uneditable
    doc.markText({ line: 0, ch: 0 }, { line: 0, ch: 1 }, {
      className: 'exp-decorator',
      readOnly: true,
      atomic: true,
      inclusiveLeft: true
    });

    var lastSlashPos = expr.lastIndexOf('/');

    doc.markText({ line: 0, ch: lastSlashPos }, { line: 0, ch: expr.length }, {
      className: 'exp-decorator',
      readOnly: false,
      atomic: true,
      inclusiveRight: true
    });
  },

  handleCMChange: function (expr) {
    // Remove newlines
    expr = expr.replace(/[\r\n]/g, '');
    this.updateCodeMirror(expr);
    this.props.onChange(expr);
  },

  render: function () {
    var expression = this.props.expression;

    return React.createElement(CodeMirror, {
      className: 'regexr-expression-editor',
      onChange: this.handleCMChange,
      value: expression,
      options: {
        lineNumbers: false,
        tabSize: 2,
        indentWithTabs: false
      },
      ref: this.initializeCM });
  }
});

module.exports = ExpressionEditor;