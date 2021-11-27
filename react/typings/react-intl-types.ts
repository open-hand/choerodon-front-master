import { MessageDescriptor } from 'react-intl';

export type MessageFormatPrimitiveValue = string | number | boolean | null | undefined

export type FormatterValues = Record<string, MessageFormatPrimitiveValue | React.ReactElement | any>

export type FormatFunctionTypes = (props:MessageDescriptor, values?:FormatterValues)=> string | React.ReactNode
