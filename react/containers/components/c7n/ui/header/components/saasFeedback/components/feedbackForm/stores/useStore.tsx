import { useLocalStore } from 'mobx-react-lite';
import { findIndex } from 'lodash';

export default function useStore() {
  return useLocalStore(() => ({
    fileLists: [],
    setFile(value:boolean) {
      this.fileLists = value;
    },
    pushFile(value:any) {
      // if(!this.fileli)
      this.fileLists.push(value);
    },
    getFileIndex(uid:string) {
      const index = findIndex(this.fileLists, (value:any) => value.uid === uid);
      return index;
    },
    modifyFilePercent(uid:string, percent:number) {
      const index = this.getFileIndex(uid);
      if (index > -1) {
        this.fileLists[index].percent = percent;
      }
    },
    modifyFileStatus(uid:string, status?:string) {
      const index = this.getFileIndex(uid);
      if (index > -1) {
        this.fileLists[index].status = status;
      }
    },
    attribute(uid:string, key:string, value:any) {
      const index = this.getFileIndex(uid);
      debugger
      if (index > -1) {
        this.fileLists[index][key] = value;
      }
    },
    deleteFile(uid:string) {
      this.fileLists.splice(this.getFileIndex(uid), 1);
    },
  }));
}

export type MainStoreProps = ReturnType<typeof useStore>;
