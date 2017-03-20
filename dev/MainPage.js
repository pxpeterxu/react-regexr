'use strict';

var React = require('react');
var PureRenderMixin = require('react-addons-pure-render-mixin');

var ExpressionEditor = require('../src/ExpressionEditor');
var SourceEditor = require('../src/SourceEditor');

var MainPage = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState: function() {
    return {
      expression: '/([A-Z])\\w+/g',
      text: [
        'Welcome to RegExr v2.1 by gskinner.com, proudly hosted by Media Temple!',
        '',
        'Edit the Expression & Text to see matches. Roll over matches or the expression for details. Undo mistakes with ctrl-z. Save Favorites & Share expressions with friends or the Community. Explore your results with Tools. A full Reference & Help is available in the Library, or watch the video Tutorial.',
        '',
        'Sample text for testing:',
        'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        '0123456789 _+-.,!@#$%^&*();\\/|<>"\'',
        '12345 -98.7 3.141 .6180 9,000 +42',
        '555.123.4567	+1-(800)-555-2468',
        'foo@demo.net	bar.ba@test.co.uk',
        'www.demo.com	http://foo.co.uk/',
        'http://regexr.com/foo.html?q=bar',
        'https://mediatemple.net'
      ].join('\n')
    };
  },

  handleExpressionChange: function(e) {
    var value = e.target ? e.target.value : e;
    this.setState({ expression: value });
  },

  handleTextChange: function(e) {
    var value = e.target ? e.target.value : e;
    this.setState({ text: value });
  },

  render: function() {
    var expression = this.state.expression;
    var text = this.state.text;

    return (<div>
      <ExpressionEditor expression={expression}
          onChange={this.handleExpressionChange} />
      <SourceEditor expression={expression}
          onTextChange={this.handleTextChange}
          text={text}
          options={{
            lineWrapping: true
          }} />
    </div>);
  }
});

module.exports = MainPage;
