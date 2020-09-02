const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, './entry.js'),
  webSocketServer: 'ws://notify.staging.saas.hand-china.com',
  master: './react/master.js',
  projectType: 'choerodon',
  buildType: 'single',
  modules: ['.'],
  dashboard: {},
};
