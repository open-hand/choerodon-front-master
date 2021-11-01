import { theme4 } from '@hzero-front-ui/themes';
import C7nTemplate from '@hzero-front-ui/c7n-ui';

const theme4Configs = {
  defaultTheme: 'theme4',
  scope: [],
  themes: [
    {
      name: 'theme4',
      data: theme4,
    },
  ],
  templates: [
    {
      id: 'c7n',
      component: C7nTemplate,
    },
  ],
};

export {
  theme4Configs,
};
