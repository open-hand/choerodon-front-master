import { CSSProperties } from 'react';

type C7NPageProps = {
  className?:string
  service?:string[]
  onAccess?:CallableFunction
}

type PageHeaderProps = {
  backPath?:string | null
  className?:string
}

type PageContentProps = {
  link?:string
  values?:any
  className?:string
  code?:string
  style?:CSSProperties
}

export {
  C7NPageProps,
  PageHeaderProps,
  PageContentProps,
};
