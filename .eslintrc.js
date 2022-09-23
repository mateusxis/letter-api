module.exports = {
  plugins: ['security'],
  extends: ['prettier', 'plugin:security/recommended'],
  env: {
    node: true,
    commonjs: true,
    jest: true
  },
  parserOptions: {
    sourceType: 'script',
    ecmaVersion: 2020
  }
};
