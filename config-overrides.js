const { override, addWebpackAlias, addBabelPlugins } = require('customize-cra')

module.exports = override(
  addWebpackAlias({
    'react-native': 'react-native-web',
  }),
  addBabelPlugins('@babel/plugin-syntax-class-properties'),

)
