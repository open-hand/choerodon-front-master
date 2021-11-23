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
      window.location.reload();
    }
  }, [isSuccess]);

  return handleChangeLanguage;
};

export default useChangeLanguage;
