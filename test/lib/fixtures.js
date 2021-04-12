
/* FIXTURES */

const Fixtures = {
  errors: {
    comment: '// asd',
    empty: '',
    prefix: 'invalid 123',
    suffix: '123 invalid'
  },
  ast: {
    input: `
      // Example // Yes
      /* EXAMPLE */ /* YES */
      {
        "one": {},
        "two" :{},
        "three": {
          "one": null,
          "two" :true,
          "three": false,
          "four": "asd\\n\\u0022\\"",
          "five": -123.123e10,
          "six": [ 123, true, [],],
        },
      }
      // Example // Yes
      /* EXAMPLE */ /* YES */
    `,
    output: {
      type: 'Root',
      children: [
        {
          type: 'Newline',
          source: '\n'
        },
        {
          type: 'Whitespace',
          source: '      '
        },
        {
          type: 'CommentLine',
          source: '// Example // Yes'
        },
        {
          type: 'Newline',
          source: '\n'
        },
        {
          type: 'Whitespace',
          source: '      '
        },
        {
          type: 'CommentBlock',
          source: '/* EXAMPLE */'
        },
        {
          type: 'Whitespace',
          source: ' '
        },
        {
          type: 'CommentBlock',
          source: '/* YES */'
        },
        {
          type: 'Newline',
          source: '\n'
        },
        {
          type: 'Whitespace',
          source: '      '
        },
        {
          type: 'Object',
          children: [
            {
              type: 'ObjectOpen',
              source: '{'
            },
            {
              type: 'Newline',
              source: '\n'
            },
            {
              type: 'Whitespace',
              source: '        '
            },
            {
              type: 'String',
              source: '"one"'
            },
            {
              type: 'Colon',
              source: ':'
            },
            {
              type: 'Whitespace',
              source: ' '
            },
            {
              type: 'Object',
              children: [
                {
                  type: 'ObjectOpen',
                  source: '{'
                },
                {
                  type: 'ObjectClose',
                  source: '}'
                }
              ]
            },
            {
              type: 'Comma',
              source: ','
            },
            {
              type: 'Newline',
              source: '\n'
            },
            {
              type: 'Whitespace',
              source: '        '
            },
            {
              type: 'String',
              source: '"two"'
            },
            {
              type: 'Whitespace',
              source: ' '
            },
            {
              type: 'Colon',
              source: ':'
            },
            {
              type: 'Object',
              children: [
                {
                  type: 'ObjectOpen',
                  source: '{'
                },
                {
                  type: 'ObjectClose',
                  source: '}'
                }
              ]
            },
            {
              type: 'Comma',
              source: ','
            },
            {
              type: 'Newline',
              source: '\n'
            },
            {
              type: 'Whitespace',
              source: '        '
            },
            {
              type: 'String',
              source: '"three"'
            },
            {
              type: 'Colon',
              source: ':'
            },
            {
              type: 'Whitespace',
              source: ' '
            },
            {
              type: 'Object',
              children: [
                {
                  type: 'ObjectOpen',
                  source: '{'
                },
                {
                  type: 'Newline',
                  source: '\n'
                },
                {
                  type: 'Whitespace',
                  source: '          '
                },
                {
                  type: 'String',
                  source: '"one"'
                },
                {
                  type: 'Colon',
                  source: ':'
                },
                {
                  type: 'Whitespace',
                  source: ' '
                },
                {
                  type: 'Null',
                  source: 'null'
                },
                {
                  type: 'Comma',
                  source: ','
                },
                {
                  type: 'Newline',
                  source: '\n'
                },
                {
                  type: 'Whitespace',
                  source: '          '
                },
                {
                  type: 'String',
                  source: '"two"'
                },
                {
                  type: 'Whitespace',
                  source: ' '
                },
                {
                  type: 'Colon',
                  source: ':'
                },
                {
                  type: 'True',
                  source: 'true'
                },
                {
                  type: 'Comma',
                  source: ','
                },
                {
                  type: 'Newline',
                  source: '\n'
                },
                {
                  type: 'Whitespace',
                  source: '          '
                },
                {
                  type: 'String',
                  source: '"three"'
                },
                {
                  type: 'Colon',
                  source: ':'
                },
                {
                  type: 'Whitespace',
                  source: ' '
                },
                {
                  type: 'False',
                  source: 'false'
                },
                {
                  type: 'Comma',
                  source: ','
                },
                {
                  type: 'Newline',
                  source: '\n'
                },
                {
                  type: 'Whitespace',
                  source: '          '
                },
                {
                  type: 'String',
                  source: '"four"'
                },
                {
                  type: 'Colon',
                  source: ':'
                },
                {
                  type: 'Whitespace',
                  source: ' '
                },
                {
                  type: 'String',
                  source: '"asd\\n\\u0022\\""'
                },
                {
                  type: 'Comma',
                  source: ','
                },
                {
                  type: 'Newline',
                  source: '\n'
                },
                {
                  type: 'Whitespace',
                  source: '          '
                },
                {
                  type: 'String',
                  source: '"five"'
                },
                {
                  type: 'Colon',
                  source: ':'
                },
                {
                  type: 'Whitespace',
                  source: ' '
                },
                {
                  type: 'Number',
                  source: '-123.123e10'
                },
                {
                  type: 'Comma',
                  source: ','
                },
                {
                  type: 'Newline',
                  source: '\n'
                },
                {
                  type: 'Whitespace',
                  source: '          '
                },
                {
                  type: 'String',
                  source: '"six"'
                },
                {
                  type: 'Colon',
                  source: ':'
                },
                {
                  type: 'Whitespace',
                  source: ' '
                },
                {
                  type: 'Array',
                  children: [
                    {
                      type: 'ArrayOpen',
                      source: '['
                    },
                    {
                      type: 'Whitespace',
                      source: ' '
                    },
                    {
                      type: 'Number',
                      source: '123'
                    },
                    {
                      type: 'Comma',
                      source: ','
                    },
                    {
                      type: 'Whitespace',
                      source: ' '
                    },
                    {
                      type: 'True',
                      source: 'true'
                    },
                    {
                      type: 'Comma',
                      source: ','
                    },
                    {
                      type: 'Whitespace',
                      source: ' '
                    },
                    {
                      type: 'Array',
                      children: [
                        {
                          type: 'ArrayOpen',
                          source: '['
                        },
                        {
                          type: 'ArrayClose',
                          source: ']'
                        }
                      ]
                    },
                    {
                      type: 'CommaTrailing',
                      source: ','
                    },
                    {
                      type: 'ArrayClose',
                      source: ']'
                    }
                  ]
                },
                {
                  type: 'CommaTrailing',
                  source: ','
                },
                {
                  type: 'Newline',
                  source: '\n'
                },
                {
                  type: 'Whitespace',
                  source: '        '
                },
                {
                  type: 'ObjectClose',
                  source: '}'
                }
              ]
            },
            {
              type: 'CommaTrailing',
              source: ','
            },
            {
              type: 'Newline',
              source: '\n'
            },
            {
              type: 'Whitespace',
              source: '      '
            },
            {
              type: 'ObjectClose',
              source: '}'
            }
          ]
        },
        {
          type: 'Newline',
          source: '\n'
        },
        {
          type: 'Whitespace',
          source: '      '
        },
        {
          type: 'CommentLine',
          source: '// Example // Yes'
        },
        {
          type: 'Newline',
          source: '\n'
        },
        {
          type: 'Whitespace',
          source: '      '
        },
        {
          type: 'CommentBlock',
          source: '/* EXAMPLE */'
        },
        {
          type: 'Whitespace',
          source: ' '
        },
        {
          type: 'CommentBlock',
          source: '/* YES */'
        },
        {
          type: 'Newline',
          source: '\n'
        },
        {
          type: 'Whitespace',
          source: '    '
        }
      ]
    }
  },
  lookup: {
    object: `
      // Example // Yes
      /* EXAMPLE */ /* YES */
      {
        "one": {},
        "two" :{},
        "three": {
          "one": null,
          "two" :true,
          "three": false,
          "four": "asd\\n\\u0022\\"",
          "five": -123.123e10,
          "six": [ 123, true, [],],
        },
      }
      // Example // Yes
      /* EXAMPLE */ /* YES */
    `,
    objectPartial: `{ "foo" }`,
    array: `
      // Example // Yes
      /* EXAMPLE */ /* YES */
      [
        { "foo": 123,
        "bar": [123] }
      ]
      // Example // Yes
      /* EXAMPLE */ /* YES */
    `
  },
  parse: {
    input: `
      // Example // Yes
      /* EXAMPLE */ /* YES */
      {
        "one": {},
        "two" :{},
        "three": {
          "one": null,
          "two" :true,
          "three": false,
          "four": "asd\\n\\u0022\\"",
          "five": -123.123e10,
          "six": [ 123, true, [],],
        },
      }
      // Example // Yes
      /* EXAMPLE */ /* YES */
    `,
    output: {
      one: {},
      two: {},
      three: {
        one: null,
        two: true,
        three: false,
        four: "asd\n\u0022\"",
        five: -123.123e10,
        six: [123, true, []]
      }
    }
  },
  strip: {
    input: `
      { // This is an example // Example
        "foo" : 123,
        "// tricky": "/* tricky */",
        /* TRAILING COMMAS BELOW */ /* EXAMPLE */
        "bar": [1, 2 , 3,],
        /* TRAILING COMMAS ABOVE */
      }
    `,
    output: '{"foo":123,"// tricky":"/* tricky */","bar":[1,2,3]}'
  }
};

/* EXPORT */

module.exports = Fixtures;
