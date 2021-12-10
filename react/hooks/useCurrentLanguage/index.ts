import { useLocalStorageState, useUpdateEffect } from 'ahooks';
import { LanguageTypes } from '@/typings';
import AppState from '@/containers/stores/c7n/AppState';

/**
 * 获取当前的系统语言
 * @return {*}
 */
const useCurrentLanguage = () => {
  const [localLanguage, setLanguage] = useLocalStorageState('language');

  const stateLanguage = AppState.currentLanguage;

  const language:LanguageTypes = stateLanguage || localLanguage;

  return language?.replace('-', '_') as LanguageTypes;
};

export default useCurrentLanguage;
