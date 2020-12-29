import React, { useContext } from 'react';
import { Button } from 'choerodon-ui/pro';
import ThemeContext from '@hzero-front-ui/cfg/lib/utils/ThemeContext';
import { inject } from 'mobx-react';
import { defaultConfig } from '@hzero-front-ui/cfg/lib/utils/config';

export default inject('AppState')(() => {
  const { setTheme, schema } = useContext(ThemeContext);
  return (
    <Button
      functype="flat"
      shape="circle"
      style={{ color: '#fff' }}
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
        });
      }}
    />
  );
});
