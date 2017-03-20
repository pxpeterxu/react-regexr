react-regexr
============

`react-regexr` is an implementation of the excellent RegExr's interface in a reusable React component.

Usage
-----

`react-regexr` exports two different React components:

1. **ExpressionEditor**: this is the "Expression" top bar from regexr.com, which allows you to edit a regular expression with syntax highlighting and hover tooltips.

2. **SourceEditor**: this is the "Text" field, which, when given the flags and an expression, will highlight the matches

Basic usage:

```
// CommonJS require
var ExpressionEditor = require('react-regexr').ExpressionEditor;
// or ES6 modules
import { ExpressionEditor } from 'react-regexr';

...
  render: function() {
    var { expression, text } = this.state;

    return (<div>
      <ExpressionEditor
        expression={expression}
        onChange={this.handleExpressionChange}
      />
      <SourceEditor
        expression={expression}
        text={text}
        onTextChange={this.handleTextChange}
      />
    </div>);
  }
```
