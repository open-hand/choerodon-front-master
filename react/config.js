const path = require('path');

module.exports = {
  port: 8080,
  entry: path.resolve(__dirname, './entry.tsx'),
  modules: ['.'],
};
