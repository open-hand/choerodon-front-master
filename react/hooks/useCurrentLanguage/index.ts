import { useLocalStorageState, useUpdateEffect } from 'ahooks';
import { LanguageTypes } from '@/typings';
import stores from '@/containers/stores';

const { AppState } = stores;

/**
 * 获取当前的系统语言
 * @return {*}
 */
const useCurrentLanguage = () => {
  const [localLanguage] = useLocalStorageState('language');

  const stateLanguage = AppState.currentLanguage;

  const language:LanguageTypes = stateLanguage || localLanguage;

  return language?.replace('-', '_') as LanguageTypes;
};

export default useCurrentLanguage;
