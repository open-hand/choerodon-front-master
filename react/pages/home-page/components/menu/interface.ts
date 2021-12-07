import appState from '@/containers/stores/c7n/AppState';
import menuStore from '@/containers/stores/c7n/MenuStore';
import { StoreProps } from './stores/useStore';

export type SideMenuIndexProps = {
};

export type SideMenuStoreContext = {
  prefixCls: 'c7ncd-side-menu'
  intlPrefix: 'c7ncd.side.menu'
  mainStore: StoreProps
  formatMessage(arg0: object, arg1?: object): string,
  MenuStore:any
  AppState: any
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

// 菜单level类型
export type MenuLevelType = 'site' | 'orgnization' | 'project' | 'user';

// 菜单每一项的数据结构，还有更具体的
export type MenuObjProps = {
  subMenus?: MenuObjProps[],
  route:string
  icon:string
  name:string
  code:string
  level: MenuLevelType, // 菜单数据的层级
}
