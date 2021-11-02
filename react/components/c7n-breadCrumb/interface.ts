import { ReactNode } from 'react';

type BreadcrumbProps = {
  title?:string
  AppState:any
  MenuStore:any
  custom?:boolean
  extraNode?:ReactNode
  children?:ReactNode
}

export {
  BreadcrumbProps,
};
