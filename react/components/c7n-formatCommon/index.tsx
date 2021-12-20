import React, { useMemo } from 'react';
import { C7NFormatCommonProps } from './interface';
import C7NFormat from '../c7n-formatMessage';

const C7NFormatCommon = (props:C7NFormatCommonProps) => {
  const {
    intlPrefix,
    id,
    ...rest
  } = props;

  const getId = useMemo(() => {
    const currentId:string | number | undefined = `${intlPrefix || 'boot'}.${id}`;
    return currentId;
  }, [id]);

  return <C7NFormat {...rest} id={getId} intlPrefix={intlPrefix} />;
};

export default C7NFormatCommon;
