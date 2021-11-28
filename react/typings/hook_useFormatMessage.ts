import * as React2 from 'react';
import { MessageDescriptor } from 'react-intl';

type PrimitiveType = string | number | boolean | null | undefined | Date;

type FormatXMLElementFn<T, R = string | Array<string | T>> = (parts: Array<string | T>) => R

type FormatStringType = (descriptor: MessageDescriptor, values?: Record<string, PrimitiveType | FormatXMLElementFn<string, string>>) => string

type FormatNodeType<T, R> = (descriptor: MessageDescriptor, values?: Record<string, PrimitiveType | React2.ReactNode | FormatXMLElementFn<T, R>>) => React2.ReactNode

export type useFormatMessageRetrunTypes<T = React2.ReactNode, R = T> = FormatStringType & FormatNodeType<T, R>;
