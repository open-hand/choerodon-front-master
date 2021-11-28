import { useCallback } from 'react';
import { useIntl, IntlFormatters } from 'react-intl';

function useFormatMessage(intlPrefix?:string):IntlFormatters['formatMessage'] {
  const {
    formatMessage,
  } = useIntl();

  const handleFormat = useCallback((props) => {
    const [messageOpts, values] = props;
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
