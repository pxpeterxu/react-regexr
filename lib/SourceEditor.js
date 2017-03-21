'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
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
    pattern: React.PropTypes.string,
    flags: React.PropTypes.string,

    text: React.PropTypes.string.isRequired,
    onTextChange: React.PropTypes.func,
    // If omitted, text will be readOnly

    containerStyle: React.PropTypes.object,
    // Extra style for container div

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

    var cmElem = this._cmElem;

    // We need some way of styling width/height
    // of this for sizing the cmDiv to 100%
    var cmDiv = ReactDOM.findDOMNode(cmElem);
    cmDiv.style.width = this.props.width || '100%';
    cmDiv.style.height = this.props.height || 'auto';

    var cm = cmElem.getCodeMirror();
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
   * props.pattern and props.flags) and text
   * @param {String}   text   text to match against
   * @param {function} callback  callback that gets called with
   *                             (error, matches)
   */
  getMatches: function (text, callback) {
    // 1. Validate with lexing
    var pattern = this.props.pattern;
    var flags = this.props.flags;

    var regex = null;
    if (pattern) {
      // Don't allow empty regex: guaranteed infinite loop
      try {
        regex = new RegExp(pattern, flags);
      } catch (e) {
        console.error(e.stack);
      }
    }

    if (!regex) {
      callback('invalid');
    } else {
      // To prevent regex DDoS, RegExr offloads to a
      // Web Worker
      RegExJS.match(regex, text, callback);
    }
  },

  redraw: function (text) {
    text = text || this.props.text;

    // Redraw source highlights
    this.getMatches(text, function (error, matches) {
      if (error) {
        console.error(error);
      }

      var hoverX = this.state.hoverX;
      var hoverY = this.state.hoverY;
      var hoverMatch = null;

      if (!error && hoverX && hoverY) {
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
    var containerStyle = this.props.containerStyle;

    var width = this.props.width || '100%';
    var height = this.props.height || 'auto';
    var style = { width: width, height: height };

    return React.createElement(
      'div',
      { style: Object.assign(style, containerStyle) },
      React.createElement('canvas', { className: 'regexr-source-canvas', width: '1', height: '1',
        ref: function (elem) {
          this._sourceCanvas = elem;
        }.bind(this) }),
      React.createElement(
        'div',
        { className: 'regexr-source-measure',
          style: style,
          ref: function (elem) {
            this._sourceMeasure = elem;
          }.bind(this) },
        React.createElement(CodeMirror, {
          className: 'regexr-source-editor',
          onChange: this.handleCMChange,
          value: text,
          options: Object.assign({
            tabSize: 2,
            indentWithTabs: false,
            readOnly: !this.props.onTextChange
          }, options),
          onScroll: this.handleCMScroll,
          ref: function (elem) {
            this._cmElem = elem;
          }.bind(this) })
      )
    );
  }
});

module.exports = SourceEditor;