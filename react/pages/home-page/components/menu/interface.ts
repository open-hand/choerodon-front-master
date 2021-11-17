import { StoreProps } from './stores/useStore';

export type SideMenuIndexProps = {
};

export type SideMenuStoreContext = {
  prefixCls: 'c7ncd-side-menu'
  intlPrefix: 'c7ncd.side.menu'
  mainStore: StoreProps
  formatMessage(arg0: object, arg1?: object): string,
} & ProviderProps;

export type ProviderProps = {
  [fields:string]:any
} & SideMenuIndexProps;

export type TreeProps ={
  subMenus?: TreeProps[]
  parentName?:string
  [field:string]:any
}

export type TreeReduceCallbackProps ={
  treeNode:TreeProps
  parents:TreeProps[]
  index?:number
}

export type TreeReduceProps = {
  tree: TreeProps
  callback(props:TreeReduceCallbackProps):boolean
  parents?:TreeProps[]
}
