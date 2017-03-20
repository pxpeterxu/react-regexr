'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var MainPage = require('./MainPage');

document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(
    React.createElement(MainPage),
    document.getElementById('react-main')
  );
});
