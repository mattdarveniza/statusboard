module.exports = {
  parser: 'babel-eslint',
  plugins: [
    'babel',
    'flowtype',
  ],
  extends: [
    'airbnb',
    'plugin:flowtype/recommended',
  ],
  env: {
    browser: true,
    jest: true,
  },
  rules: {
    'react/jsx-filename-extension': 0,
    'react/sort-comp': [1, {
      order: [
        'type-annotations',
        'static-methods',
        'state',
        'lifecycle',
        'everything-else',
        'render'
      ]
    }],
    'babel/quotes': ['error', 'single', { avoidEscape: true }],
    'quotes': 0,
    'import/prefer-default-export': 0,
    'function-paren-newline': ['error', 'consistent'],
  }
}