type C7NPageProps = {
  className?: string
  service?: string[]
  onAccess?: CallableFunction
}

type PageWrapperProps = {
  cache?: boolean
  className?: string
  noHeader?: Array<string | number>
  children: any
  onChange?: (key: string | number) => void
}

export {
  C7NPageProps,
  PageWrapperProps,
};
