/** @format */

'use strict';

var PropTypes = require('prop-types');

var React = require('react');
var ReactDOM = require('react-dom');
var CodeMirror = require('react-codemirror');
var shallowCompare = require('react-addons-shallow-compare');

var SourceHighlighter = require('regexr-site/js/SourceHighlighter');
var RegExLexer = require('regexr-site/js/RegExLexer');
var RegExJS = require('regexr-site/js/RegExJS');
var Docs = require('regexr-site/js/utils/Docs');
var Tooltip = require('regexr-site/js/controls/Tooltip');
var CMUtils = require('regexr-site/js/utils/CMUtils');

var RegexUtils = require('./RegexUtils');

class SourceEditor extends React.Component {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.state = {
      hoverX: null,
      hoverY: null
    }, this.resizeCanvas = () => {
      var rect = this._sourceMeasure.getBoundingClientRect();
      this._sourceCanvas.width = rect.right - rect.left || 0;
      this._sourceCanvas.height = rect.bottom - rect.top || 0;

      this.redraw();
    }, this.getMatches = (text, callback) => {
      // 1. Validate with lexing
      var pattern = this.props.pattern;
      var flags = this.props.flags;

      var regex = null;
      if (pattern) {
        // Don't allow empty regex: guaranteed infinite loop
        try {
          regex = new RegExp(pattern, flags);
        } catch (e) {
          // Invalid regexp
        }
      }

      if (!regex) {
        callback('invalid');
      } else {
        // To prevent regex DDoS, RegExr offloads to a
        // Web Worker
        RegExJS.match(regex, text, callback);
      }
    }, this.redraw = text => {
      text = text || this.props.text;

      // Redraw source highlights
      this.getMatches(text, function (error, matches) {
        var hoverX = this.state.hoverX;
        var hoverY = this.state.hoverY;
        var hoverMatch = null;

        if (!error && hoverX && hoverY) {
          var cm = this._cmElem.getCodeMirror();
          // Check what index character we're hovering over
          var index = CMUtils.getCharIndexAt(cm, hoverX, hoverY);

          // See which match, if any, we're hovering over
          hoverMatch = index != null ? RegexUtils.getMatchAt(matches, index) : null;

          if (hoverMatch) {
            var rect = index != null && CMUtils.getCharRect(cm, index);
            if (rect) {
              rect.right = rect.left = hoverX;
            }
            this.sourceTooltip.show(Docs.forMatch(hoverMatch), rect);
          } else {
            this.sourceTooltip.hide();
          }
        }

        this.sourceHighlighter.draw(error ? null : matches, hoverMatch, null);

        this.sendOnViewportChange(matches);
      }.bind(this));
    }, this.sendOnViewportChange = matches => {
      if (!this.props.onViewportChange) return;

      var cm = this._cmElem.getCodeMirror();

      var viewport = cm.getScrollInfo();
      var left = viewport.left;
      var top = viewport.top;
      var right = viewport.left + viewport.clientWidth;
      var bottom = viewport.top + viewport.clientHeight;
      var firstChar = cm.indexFromPos(cm.coordsChar({ left: left, top: top }, 'local'));
      var lastChar = cm.indexFromPos(cm.coordsChar({ left: right, top: bottom }, 'local'));

      var processMatches = function processMatches(matches) {
        var prevMatch = null;
        var nextMatch = null;

        if (matches) {
          for (var i = 0; i !== matches.length; i++) {
            var match = matches[i];
            if (match.end < firstChar) {
              prevMatch = i;
            } else if (match.index > lastChar) {
              nextMatch = i;
              break;
            }
          }
        }

        var ret = {
          firstChar: firstChar,
          lastChar: lastChar,
          prevMatch: prevMatch,
          nextMatch: nextMatch
        };

        this.props.onViewportChange(ret);
      }.bind(this);

      if (matches) {
        processMatches(matches);
      } else {
        this.getMatches(this.props.text, function (error, matches) {
          processMatches(matches);
        });
      }
    }, this.handleCMChange = text => {
      this.props.onTextChange(text);
    }, this.handleCMScroll = () => {
      this.redraw();
    }, this.handleMouseMove = event => {
      this.setState({
        hoverX: event.clientX,
        hoverY: event.clientY
      });
    }, this.handleMouseOut = () => {
      this.setState({ hoverX: null, hoverY: null });
    }, this.scrollToMatch = matchIndex => {
      var cm = this._cmElem.getCodeMirror();
      this.getMatches(this.props.text, function (error, matches) {
        var match = matches[matchIndex];

        if (match) {
          cm.scrollIntoView({
            from: cm.posFromIndex(match.index),
            to: cm.posFromIndex(match.end)
          });
        }
      });
    }, _temp;
  }
  // Using this as a ref, you can also use:
  // - scrollToMatch: scrolls to the nth match

  componentDidMount() {
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
  }

  componentWillUnmount() {
    window.removeEventListener(this._resizeListener);
  }

  /**
   * Get the matches given the current regex (from
   * props.pattern and props.flags) and text
   * @param {String}   text   text to match against
   * @param {function} callback  callback that gets called with
   *                             (error, matches)
   *
   */


  /**
   * Send a call to the onViewportChange handler on scrolls,
   * changes in the content, etc.
   * @return { from, to, prevMatch, nextMatch }
   *         where from, to are both character counts, and
   *         prevMatch, nextMatch are the indexes of the
   *         first match before and after the visible section
   */


  componentDidUpdate() {
    // Redraw with slight delay so that it's
    // based on new content
    setTimeout(this.redraw, 1);
  }

  /**
   * Scrolls to the nth match
   * (does nothing if the nth match doesn't exist)
   * @param {int} matchIndex    index of the match
   */


  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    var text = this.props.text;
    var options = this.props.options;
    var containerStyle = this.props.containerStyle;

    var width = this.props.width || '100%';
    var height = this.props.height || 'auto';
    var style = { width: width, height: height };

    return React.createElement(
      'div',
      { style: Object.assign(style, containerStyle) },
      React.createElement('canvas', {
        className: 'regexr-source-canvas',
        width: '1',
        height: '1',
        ref: function (elem) {
          this._sourceCanvas = elem;
        }.bind(this)
      }),
      React.createElement(
        'div',
        {
          className: 'regexr-source-measure',
          style: style,
          ref: function (elem) {
            this._sourceMeasure = elem;
          }.bind(this)
        },
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
          }.bind(this)
        })
      )
    );
  }
}

SourceEditor.propTypes = {
  pattern: PropTypes.string,
  flags: PropTypes.string,

  text: PropTypes.string.isRequired,
  onTextChange: PropTypes.func,
  // If omitted, text will be readOnly

  containerStyle: PropTypes.object,
  // Extra style for container div

  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  options: PropTypes.object,
  // Additional options for the CodeMirror editor

  onViewportChange: PropTypes.func
  // A listener to see which matches are visible
};

module.exports = SourceEditor;