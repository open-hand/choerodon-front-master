export type ProjectsSelectorIndexProps = {
};

export type ProjectsSelectorStoreContext = {
  prefixCls: 'c7ncd-projects-selector'
  intlPrefix: 'c7ncd.projects.selector'
  projectId:string
  handleSelectProjectCallback:(item:Record<string, any>)=>void
  handleSelectorBlur:()=>void,
  selectorRef:React.MutableRefObject<any>
} & ProviderProps;

export type ProviderProps = {
  [fields:string]:any
} & ProjectsSelectorIndexProps;
