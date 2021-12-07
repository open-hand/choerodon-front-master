import { ReactElement } from 'react';
import { MessageDescriptor } from 'react-intl';

type FormattedMessageProps = MessageDescriptor &
{
  values?: object,
  tagName?: string | any,
  children?: (chunks: ReactElement) => ReactElement,
}

type C7NFormatCommonProps = FormattedMessageProps

export {
  C7NFormatCommonProps,
};
