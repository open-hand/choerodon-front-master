const ThemeColorReplacer = require('webpack-theme-color-replacer');

const cssColorFileName = 'theme-colors.css';

module.exports = {
  // server: 'http://api.staging.saas.hand-china.com',
  // server: 'http://api.upgrade.staging.saas.hand-china.com',
  server: 'http://api.staging.saas.hand-china.com',
  webSocketServer: 'ws://notify.staging.saas.hand-china.com',
  master: './src/master.js',
  projectType: 'choerodon',
  buildType: 'single',
  dashboard: {},
  // webpackConfig(configs) {
  //   configs.plugins.push(
  //     new ThemeColorReplacer({
  //       fileName: cssColorFileName,
  //       matchColors: ['#3f51b5', '#303f9f'],
  //       isJsUgly: true,
  //     }),
  //   );
  //   return configs;
  // },
};
