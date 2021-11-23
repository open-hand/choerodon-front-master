import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { C7NFormatProps } from './interface';

const C7NFormat = (props:C7NFormatProps) => {
  const {
    intlPrefix,
    id,
    ...rest
  } = props;

  const getId = useMemo(() => {
    let currentId:string | number | undefined = id;
    if (intlPrefix) {
      currentId = `${intlPrefix}.${id}`;
    }
    return currentId;
  }, []);

  return <FormattedMessage {...rest} id={getId} />;
};

export default C7NFormat;
