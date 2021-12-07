import * as React2 from 'react';
import { MessageDescriptor } from 'react-intl';

type PrimitiveType = string | number | boolean | null | undefined | Date;

type FormatXMLElementFn<T, R = string | Array<string | T>> = (parts: Array<string | T>) => R

type C7NMessageDescriptor<P> = Omit<MessageDescriptor, 'id'> & {
  id?: P
}

type FormatStringType<P> = (descriptor: C7NMessageDescriptor<P>, values?: Record<string, PrimitiveType | FormatXMLElementFn<string, string>>) => string

type FormatNodeType<T, R, P> = (descriptor: C7NMessageDescriptor<P>, values?: Record<string, PrimitiveType | React2.ReactNode | FormatXMLElementFn<T, R>>) => React2.ReactNode

type useFormatMessageRetrunTypes<T = React2.ReactNode, R = T, P = string | number> = FormatStringType<P> & FormatNodeType<T, R, P>;

export type {
  useFormatMessageRetrunTypes,
};
