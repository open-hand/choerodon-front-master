const prefixCls = 'c7ncd-reactQuery';

const c7nReactQueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
};

// devtools configs
const c7nReactQueryDevtoolsConfig = {
  panelProps: {
    className: prefixCls,
  },
  closeButtonProps: {
    className: `${prefixCls}-closeButton`,
  },
  toggleButtonProps: {
    className: `${prefixCls}-toggleButton`,
  },
};

export { c7nReactQueryClientConfig, c7nReactQueryDevtoolsConfig };
