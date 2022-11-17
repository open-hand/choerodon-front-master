const path = require('path');

module.exports = {
  port: 8080,
  entry: [
    {
      index: path.resolve(process.cwd(), './react/entry.tsx'),
    },
  ],
  modules: [
    '.',
  ],
};
