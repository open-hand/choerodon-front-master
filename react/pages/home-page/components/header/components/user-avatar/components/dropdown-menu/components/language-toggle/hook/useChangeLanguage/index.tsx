import { useEffect } from 'react';
import { useMutation } from 'react-query';
import { hzerosUsersApi } from '@/apis';
import { LanguageTypes } from '@/typings';

const useChangeLanguage = () => {
  const {
    mutate, isSuccess,
  } = useMutation<string, unknown, {language:LanguageTypes}>('change-languages', ({ language }) => hzerosUsersApi.changeLanguages(language));

  const handleChangeLanguage = (language:LanguageTypes) => {
    mutate({ language });
  };

  useEffect(() => {
    if (isSuccess) window.location.reload(true);
  }, [isSuccess]);

  return handleChangeLanguage;
};

export default useChangeLanguage;
