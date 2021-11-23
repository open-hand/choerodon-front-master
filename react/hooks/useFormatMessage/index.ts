import React, { useCallback } from 'react';
import { MessageDescriptor, useIntl } from 'react-intl';

type MessageFormatPrimitiveValue = string | number | boolean | null | undefined

type FormatterValues = Record<string, MessageFormatPrimitiveValue | React.ReactElement | any>

function useFormatMessage(intlPrefix?:string):(props:MessageDescriptor, values?:FormatterValues)=> string | React.ReactNode

function useFormatMessage(intlPrefix?:string) {
  const {
    formatMessage,
  } = useIntl();

  const handleFormat = useCallback((messageOpts: MessageDescriptor, values?:FormatterValues) => {
    const {
      id,
      ...rest
    } = messageOpts;
    return formatMessage.call(null, {
      // 按照规范，一般code都是为`boot.create等等`
      // 例如：这里的intlPrefix：boot, 那么连接create就用“.”链接
      id: `${intlPrefix}.${id}`,
      ...rest,
    }, values);
  }, []);

  return intlPrefix ? handleFormat : formatMessage;
}

export default useFormatMessage;
