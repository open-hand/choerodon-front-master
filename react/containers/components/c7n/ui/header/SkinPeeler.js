import React from 'react';
import { Button } from 'choerodon-ui/pro';
import { inject } from 'mobx-react';
import classNames from 'classnames';
import useTheme from '@/hooks/useTheme';

export default inject('AppState')((props) => {
  const [theme, setTheme] = useTheme();
  return (
    <Button
      className={classNames({
        'theme4-skinPeeler': theme === 'theme4',
      })}
      functype="flat"
      shape="circle"
      {
        ...theme === '' ? {
          style: { color: '#fff' },
        } : {}
      }
      icon={theme === 'theme4' ? 'toys-o' : 'toys'}
      onClick={() => {
        let newSchema;
        if (theme === 'theme4') {
          newSchema = '';
        } else {
          newSchema = 'theme4';
        }
        props.AppState.setCurrentTheme(newSchema);
        setTheme(newSchema);
      }}
    />
  );
});
