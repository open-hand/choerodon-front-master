import React, { useContext } from 'react';
import { Button } from 'choerodon-ui/pro';
import ThemeContext from '@hzero-front-ui/cfg/lib/utils/ThemeContext';
import { defaultConfig } from '@hzero-front-ui/cfg/lib/utils/config';

export default () => {
  const { setTheme, schema } = useContext(ThemeContext);
  return (
    <Button
      icon="toys"
      onClick={() => {
        let newSchema;
        if (schema === 'theme4') {
          newSchema = '';
        } else {
          newSchema = 'theme4';
        }
        setTheme({
          current: {
            ...defaultConfig,
            schema: newSchema,
          },
          active: newSchema,
          prev: {},
        })
      }}
    />
  );
};
