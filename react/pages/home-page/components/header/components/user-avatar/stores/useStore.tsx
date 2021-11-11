import { useLocalStore } from 'mobx-react-lite';

export default function useStore() {
  return useLocalStore(() => ({
    menuVisible: false,
    setMeneVisible(value:boolean) {
      this.menuVisible = value;
    },
  }));
}

export type StoreProps = ReturnType<typeof useStore>;
