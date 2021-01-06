import React, { useContext } from 'react';
import { Button } from 'choerodon-ui/pro';
import ThemeContext from '@hzero-front-ui/cfg/lib/utils/ThemeContext';
import { inject } from 'mobx-react';
import classNames from 'classnames';
import { defaultConfig } from '@hzero-front-ui/cfg/lib/utils/config';

export default inject('AppState')((props) => {
  const { setTheme, schema } = useContext(ThemeContext);
  return (
    <Button
      className={classNames({
        'theme4-skinPeeler': props.AppState.getCurrentTheme === 'theme4',
      })}
      functype="flat"
      shape="circle"
      {
        ...props.AppState.getCurrentTheme === '' ? {
          style: { color: '#fff' },
        } : {}
      }
      icon={props.AppState.getCurrentTheme === 'theme4' ? 'toys-o' : "toys"}
      onClick={() => {
        let newSchema;
        if (schema === 'theme4') {
          newSchema = '';
        } else {
          newSchema = 'theme4';
        }
        props.AppState.setCurrentTheme(newSchema);
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
