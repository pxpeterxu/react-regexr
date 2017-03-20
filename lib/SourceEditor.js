'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var PureRenderMixin = require('react-addons-pure-render-mixin');
var CodeMirror = require('react-codemirror');

var SourceHighlighter = require('regexr/js/SourceHighlighter');
var RegExLexer = require('regexr/js/RegExLexer');
var RegExJS = require('regexr/js/RegExJS');
var Docs = require('regexr/js/utils/Docs');
var Tooltip = require('regexr/js/controls/Tooltip');
var CMUtils = require('regexr/js/utils/CMUtils');

var RegexUtils = require('./RegexUtils');

var SourceEditor = React.createClass({
  displayName: 'SourceEditor',

  mixins: [PureRenderMixin],

  propTypes: {
    expression: React.PropTypes.string,
    text: React.PropTypes.string.isRequired,
    onTextChange: React.PropTypes.func.isRequired,
    containerProps: React.PropTypes.object,
    // Extra props for container div
    codeMirrorProps: React.PropTypes.object,
    // Extra props for <CodeMirror>
    width: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
    height: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),

    options: React.PropTypes.object
  },

  getInitialState: function () {
    return {
      hoverX: null,
      hoverY: null
    };
  },

  componentDidMount: function () {
    this._exprLexer = new RegExLexer();

    var cm = this._cmElem.getCodeMirror();
    cm.setSize(this.props.width, this.props.height);

    var options = this.props.options || {};
    var themeColor = options.themeColor || '#6CF';

    // Initialize source highlighter, tooltips
    this.sourceHighlighter = new SourceHighlighter(cm, this._sourceCanvas, themeColor);
    this.sourceTooltip = Tooltip.add(cm.display.lineDiv);
    this.sourceTooltip.on('mousemove', this.handleMouseMove, this);
    this.sourceTooltip.on('mouseout', this.handleMouseOut, this);

    this.resizeCanvas();

    this._resizeListener = window.addEventListener('resize', this.resizeCanvas);
  },

  componentWillUnmount: function () {
    window.removeEventListener(this._resizeListener);
  },

  resizeCanvas: function () {
    var rect = this._sourceMeasure.getBoundingClientRect();
    this._sourceCanvas.width = rect.right - rect.left || 0;
    this._sourceCanvas.height = rect.bottom - rect.top || 0;

    this.redraw();
  },

  /**
   * Get the matches given the current regex (from
   * props.expression) and text
   * @param {String}   text   text to match against
   * @param {function} callback  callback that gets called with
   *                             (error, matches)
   */
  getMatches: function (expression, text, callback) {
    // 1. Validate with lexing
    var lexer = this._exprLexer;
    lexer.parse(expression);

    var regex = RegexUtils.getRegex(expression);
    if (!regex) {
      callback('invalid');
    } else if (lexer.errors.length !== 0) {
      callback(lexer.errors.join('; '));
    } else {
      // To prevent regex DDoS, RegExr offloads to a
      // Web Worker
      RegExJS.match(regex, text, callback);
    }
  },

  redraw: function (text) {
    text = text || this.props.text;
    var expression = this.props.expression;

    // Redraw source highlights
    this.getMatches(expression, text, function (error, matches) {
      if (error) {
        console.error(error);
      }

      var hoverX = this.state.hoverX;
      var hoverY = this.state.hoverY;
      var hoverMatch = null;

      if (hoverX && hoverY) {
        var cm = this._cmElem.getCodeMirror();
        // Check what index character we're hovering over
        var index = CMUtils.getCharIndexAt(cm, hoverX, hoverY + window.pageYOffset);

        // See which match, if any, we're hovering over
        hoverMatch = index != null ? RegexUtils.getMatchAt(matches, index) : null;

        if (hoverMatch) {
          var rect = index != null && CMUtils.getCharRect(cm, index);
          if (rect) {
            rect.right = rect.left = event.clientX;
          }
          this.sourceTooltip.show(Docs.forMatch(hoverMatch), rect);
        } else {
          this.sourceTooltip.hide();
        }
      }

      this.sourceHighlighter.draw(error ? null : matches, hoverMatch, null);
    }.bind(this));
  },

  handleCMChange: function (text) {
    this.props.onTextChange(text);
  },

  handleCMScroll: function () {
    this.redraw();
  },

  componentDidUpdate: function () {
    this.redraw();
  },

  handleMouseMove: function (event) {
    this.setState({
      hoverX: event.clientX,
      hoverY: event.clientY
    });
  },

  handleMouseOut: function () {
    this.setState({ hoverX: null, hoverY: null });
  },

  render: function () {
    var text = this.props.text;
    var options = this.props.options;
    var containerProps = this.props.containerProps;
    var codeMirrorProps = this.props.codeMirrorProps;

    return React.createElement(
      'div',
      containerProps,
      React.createElement('canvas', { className: 'regexr-source-canvas', width: '1', height: '1',
        ref: function (elem) {
          this._sourceCanvas = elem;
        }.bind(this) }),
      React.createElement(
        'div',
        { className: 'regexr-source-measure',
          ref: function (elem) {
            this._sourceMeasure = elem;
          }.bind(this) },
        React.createElement(CodeMirror, _extends({
          className: 'regexr-source-editor',
          onChange: this.handleCMChange,
          value: text,
          options: Object.assign({
            tabSize: 2,
            indentWithTabs: false
          }, options),
          onScroll: this.handleCMScroll,
          ref: function (elem) {
            this._cmElem = elem;
          }.bind(this)
        }, codeMirrorProps))
      )
    );
  }
});

module.exports = SourceEditor;