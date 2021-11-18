const req = require.context('../header/style/icons', false, /\.sprite.svg$/);
req.keys().forEach(req);
