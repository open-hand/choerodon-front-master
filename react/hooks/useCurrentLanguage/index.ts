import { useLocalStorageState } from 'ahooks';
import { LanguageTypes } from '@/typings';
import AppState from '@/containers/stores/c7n/AppState';

/**
 * 获取当前的系统语言
 * @return {*}
 */
const useCurrentLanguage = () => {
  const [localLanguage] = useLocalStorageState('language');
  const language = localLanguage || AppState.currentLanguage as LanguageTypes;

  return language?.replace('-', '_') as LanguageTypes;
};

export default useCurrentLanguage;
