import React, { useMemo } from 'react';
import { C7NFormatCommonProps } from './interface';
import C7NFormat from '../c7n-formatMessage';

const C7NFormatCommon = (props:C7NFormatCommonProps) => {
  const {
    id,
    ...rest
  } = props;

  const getId = useMemo(() => {
    const currentId:string | number | undefined = `boot.${id}`;
    return currentId;
  }, []);

  return <C7NFormat {...rest} id={getId} />;
};

export default C7NFormatCommon;
