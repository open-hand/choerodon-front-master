import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useFormatMessageRetrunTypes } from '@/typings';

function useFormatMessage<T, R>(intlPrefix?:string):useFormatMessageRetrunTypes<T, R> {
  const {
    formatMessage,
  } = useIntl();

  const handleFormat = useCallback((messageOpts, values) => {
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
