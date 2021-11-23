import { ReactElement } from 'react';
import { MessageDescriptor } from 'react-intl';

type FormattedMessageProps = MessageDescriptor &
{
  values?: object,
  tagName?: string | any,
  children?: (chunks: ReactElement) => ReactElement,
}

type C7NFormatProps = {
  intlPrefix?:string
} & FormattedMessageProps

export {
  C7NFormatProps,
};
