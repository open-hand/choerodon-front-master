import React, { useRef } from 'react';
import { IntlConfig, IntlProvider } from 'react-intl';
import { reduce, assign } from 'lodash';
import { useBoolean, useMount } from 'ahooks';
import closeLoading from '@/utils/closeLoading';
import { useCurrentLanguage } from '@/hooks';
import { LanguageTypes } from '@/typings';

type C7NLocaleProviderTypes<T> = {
  importer(language:LanguageTypes):Promise<T>
} & Partial<IntlConfig> & { children: React.ReactNode }

const LocaleStore = React.createContext<{}>({});

export function useC7NLocalStore() {
  return React.useContext(LocaleStore);
}

function C7NLocaleProvider<T extends Record<string, string>>(props:C7NLocaleProviderTypes<T>) {
  const {
    children,
    importer,
    ...rest
  } = props;

  const language = useCurrentLanguage();

  const messageRef = useRef<Record<string, string>>({});

  const [isLoading, { setFalse }] = useBoolean(true);

  const loadCommonLocal = ():Promise<any> => import(/* webpackInclude: /\.js|.ts$/ */`../../locale/${language}/common`);

  const loadData = async () => {
    const [messageData, CommonMessageData] = await Promise.all([
      importer?.(language), loadCommonLocal(),
    ]);

    const messagesKeysObj:Record<string, string> = assign(messageData, CommonMessageData);

    const unionMessages = reduce(messagesKeysObj, (sumObj, nextObj) => (
      assign(sumObj, nextObj)
    ), {});

    messageRef.current = unionMessages;
    setFalse();
  };

  const contextValue = {
    // commonMessages,
  };

  useMount(() => {
    loadData();
  });

  // if (isLoading) {
  //   return (
  //     <Loading
  //       type="c7n"
  //       style={{
  //         height: '100vh',
  //       }}
  //     />
  //   );
  // }
  if (isLoading) {
    return (<div />);
  }
  closeLoading();

  return (
    <LocaleStore.Provider value={contextValue}>
      <IntlProvider
        {...rest}
        locale={language.replace('_', '-')}
        messages={messageRef.current}
      >
        {children}
      </IntlProvider>
    </LocaleStore.Provider>
  );
}

export default C7NLocaleProvider;
