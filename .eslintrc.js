module.exports = {
  root: true,
  'env': {
    'browser': true,
    'es6': true
  },
  'extends': [
    'plugin:vue/essential',
    'standard'
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  'parserOptions': {
    'ecmaVersion': 2018,
    'sourceType': 'module'
  },
  'plugins': [
    'vue'
  ],
  'rules': {
    'generator-star-spacing': 'off',
  }
}
