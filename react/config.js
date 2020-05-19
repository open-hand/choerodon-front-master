const alias = require('../alias').webpack;

module.exports = {
  webSocketServer: 'ws://notify.staging.saas.hand-china.com',
  master: './react/master.js',
  projectType: 'choerodon',
  buildType: 'single',
  modules: ['.'],
  dashboard: {},
  webpackConfig(configs) {
    configs.resolve.alias = alias;
    return configs;
  },
};
