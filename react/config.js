const alias = require('../alias').webpack;

module.exports = {
  port: 9092,
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
