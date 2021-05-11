import { useLocalStore } from 'mobx-react-lite';

export default function useStore() {
  return useLocalStore(() => ({
    isOpen: false,
    setOpen(value:boolean) {
      this.isOpen = value;
    },
  }));
}

export type MainStoreProps = ReturnType<typeof useStore>;
