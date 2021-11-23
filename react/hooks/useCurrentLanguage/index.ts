import { useIntl } from 'react-intl';
import { LanguageTypes } from '@/typings';

/**
 * 获取当前的系统语言
 * @return {*}
 */
const useCurrentLanguage = () => {
  const {
    locale,
  } = useIntl();

  return locale.replace('-', '_') as LanguageTypes;
};

export default useCurrentLanguage;
