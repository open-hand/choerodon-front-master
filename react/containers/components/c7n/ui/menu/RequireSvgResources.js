const req = require.context('../header/style/icons', false, /\.sprite.svg$/);
const requireAll = (requireContext) => requireContext.keys().map(requireContext);
requireAll(req);
