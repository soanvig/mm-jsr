// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    'browser': true,
    'es6': true
  },
  // add your custom rules here
  'rules': {
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'getter-return': 'warn',
    'no-dupe-args': 'error',
    'no-dupe-keys': 'error',
    'no-duplicate-case': 'error',
    'no-empty': 'error',
    'no-extra-semi': 'error',
    'no-inner-declarations': 'error',
    'no-invalid-regexp': 'error',
    'no-sparse-arrays': 'error',
    'no-template-curly-in-string': 'error',
    'no-unexpected-multiline': 'error',
    'no-unreachable': 'error',
    'valid-typeof': 'error',
    'accessor-pairs': 'warn',
    'array-callback-return': 'error',
    'block-scoped-var': 'error',
    'curly': 'error',
    'default-case': 'warn',
    'dot-location': ['error', 'property'],
     // dot-notation to access object properties. Should be or 'error'?
    'dot-notation': 'warn',
    'eqeqeq': 'error',
    'no-alert': 'warn',
    'no-case-declarations': 'error',
    'no-else-return': 'error',
    // Comments inside make the function correct
    'no-empty-function': 'warn',
    'no-floating-decimal': 'error',
    'no-global-assign': 'error',
    'no-implicit-coercion': 'error',
    'no-implicit-globals': 'error',
    'no-lone-blocks': 'error',
    'no-loop-func': 'error',
    // Need to test it
    'no-multi-spaces': ['error', {
      'exceptions': {
        'VariableDeclarator': true,
        'ImportDeclaration': true,
        'Property': true
      }
    }],
    'no-multi-str': 'error',
    'no-octal': 'error',
    'no-redeclare': 'error',
    'no-return-assign': 'error',
    'no-script-url': 'error',
    'no-self-assign': 'error',
    'no-self-compare': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-unused-expressions': 'error',
    'no-useless-concat': 'error',
    'vars-on-top': 'error',
    'yoda': 'error',
    'no-unused-vars': 'warn',
    'no-use-before-define': 'error',
    'array-bracket-newline': ['error', { 'multiline': true }],
    'array-bracket-spacing': 'error',
    'block-spacing': 'error',
    'brace-style': 'error',
    'camelcase': 'error',
    'comma-spacing': 'error',
    'consistent-this': ['error', 'self'],
    'func-call-spacing': 'error',
    'func-style': ['error', 'declaration'],
    'indent': ['error', 2, {
      'VariableDeclarator': { 'var': 2, 'let': 2, 'const': 3 },
      'ArrayExpression': 1,
      'ObjectExpression': 1
    }],
    'key-spacing': ['error', {
      'beforeColon': false,
      'afterColon': true
    }],
    'keyword-spacing': ['error', {
      'before': true,
      'after': true
    }],
    'lines-around-comment': ['error', {
      'beforeBlockComment': true
    }],
    'new-cap': 'error',
    'no-lonely-if': 'error',
    'no-mixed-spaces-and-tabs': 'error',
    'no-multiple-empty-lines': 'error',
    'no-negated-condition': 'error',
    'no-plusplus': 'error',
    'no-tabs': 'error',
    'no-unneeded-ternary': 'error',
    'no-whitespace-before-property': 'error',
    'nonblock-statement-body-position': 'error',
    'object-curly-newline': ['error', {
      'consistent': true
    }],
    'object-curly-spacing': ['error', 'always'],
    'operator-assignment': ['error', 'always'],
    'operator-linebreak': ['error', 'before'],
    'padded-blocks': ['error', 'never'],
    'quote-props': ['error', 'consistent'],
    'quotes': ['error', 'single', { 'allowTemplateLiterals': true }],
    'semi': ['error', 'always'],
    'semi-spacing': 'error',
    'space-before-blocks': 'error',
    'space-before-function-paren': 'error',
    'space-infix-ops': 'error',
    'space-unary-ops': 'error',
    'spaced-comment': 'error',
    'switch-colon-spacing': 'error',
    'unicode-bom': 'error',
    'wrap-regex': 'error',
    'arrow-parens': 'error',
    'arrow-spacing': 'error',
    'constructor-super': 'error',
    'no-class-assign': 'error',
    'no-confusing-arrow': 'error',
    'no-const-assign': 'error',
    'no-dupe-class-members': 'error',
    'no-duplicate-imports': 'error',
    'no-new-symbol': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-const': 'error',
    'prefer-template': 'error',
    'template-curly-spacing': 'error'
  }
}
