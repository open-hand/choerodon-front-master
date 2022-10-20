import { useEffect } from 'react';
import { useMutation } from 'react-query';
import { useLocalStorageState } from 'ahooks';
import { hzerosUsersApi } from '@/apis';
import { LanguageTypes } from '@/typings';

const useChangeLanguage = () => {
  const {
    mutate, isSuccess,
  } = useMutation<string, unknown, {language:LanguageTypes}>('change-languages', ({ language }) => hzerosUsersApi.changeLanguages(language));

  const [, setLanguage] = useLocalStorageState<LanguageTypes>('language');

  const handleChangeLanguage = (language:LanguageTypes) => {
    mutate({ language });
    setLanguage(language);
  };

  useEffect(() => {
    if (isSuccess) {
      // @ts-ignore
      window.location.reload(true); // 将强制 Firefox 从服务器加载页面资源
    }
  }, [isSuccess]);

  return handleChangeLanguage;
};

export default useChangeLanguage;
