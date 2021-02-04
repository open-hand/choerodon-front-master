const uedConfig = require('@hzero-front-ui/cfg/lib/utils/uedConfig');

module.exports = {
  "presets": [
    ["c7n", { "absoluteRuntime": false }]
  ],
  "plugins": [
    ...uedConfig.generateC7nUiConfig(),
  ]
};
