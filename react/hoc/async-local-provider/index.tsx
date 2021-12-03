import React, { PureComponent } from 'react';
import { IntlProvider } from 'react-intl';
import { reduce } from 'lodash';
import { LanguageTypes } from '@/typings';
import esModule from '@/utils/esModule';

export default function asyncLocaleProvider(locale:LanguageTypes, getMessage:CallableFunction):React.ComponentType {
  return class AsyncLocaleProvider extends PureComponent<any, any> {
    constructor(props:any) {
      super(props);
      this.state = {
        messages: null,
      };
    }

    // 默认导入全局通用的中英文
    loadCommonLocal = () => import(`../../locale/${locale}/common`);

    loadData = async () => {
      const [messageData, CommonMessageData] = await Promise.all([
        getMessage ? getMessage() : null, this.loadCommonLocal(),
      ]);

      const messagesKeysObj = {
        ...esModule(CommonMessageData),
        ...esModule(messageData),
      };
      const messages = reduce(messagesKeysObj, (sumObj:Record<string, any>, nextObj:Record<string, any>) => (
        { ...sumObj, ...nextObj }
      ), {});

      this.setState({
        messages,
      });
    }

    componentDidMount() {
      this.loadData();
    }

    render() {
      const { messages } = this.state;
      return messages ? (
        <IntlProvider
          {...this.props}
          locale={locale.replace('_', '-')}
          messages={messages}
        />
      ) : null;
    }
  };
}
