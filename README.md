# EditorJS Parser

EditorJS Parser is a small tool used to format blocks created from Editor.js

## Installation

Use the package manager npm

```bash
npm install @mattnick/editorjsparser
```

## Usage

```javascript
const EditorJsParser = require('@mattnick/editorjsparser');
const parser = new EditorJsParser();

var blocks = [{
    type: "paragraph",
    data: {
        "text": "hello world"
    }
}];

blocks.forEach((row)=>{
    var formatted_block = parser.parse(row,"my-custom-class");
    console.log(formatted_block);
})

// formatted_block
/*

    {

        is_empty: false,
        text: "hello world",
        html: '<p class="my-custom-class">hello world</p>'

    }

*/


```

## Available Types for Parsing

- paragraph
- header
- list
- image
- embed
- quote
- delimiter
- poll

If a block does not match one of these types then it will pass straight through untouched.



## License
[MIT](https://choosealicense.com/licenses/mit/)