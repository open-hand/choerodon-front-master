import { useLocalStore } from 'mobx-react-lite';

export type TPagecontainer = 'registerPage' | 'compeletePage' | 'registerPhonePage'
export type TPageContent = 'register' | 'registerSuccess' | 'registerApproved' | 'compelete' | 'compeleteSuccess'
| 'registerPhone' | 'registerSuccessPhone'|'approvedPhone'

export interface IPageType {
  container: TPagecontainer
  content: TPageContent
}

export default function useStore() {
  return useLocalStore(() => ({
    pageType: {
      container: 'registerPage',
      content: 'register',
    },
    userEmail: '',
    setPageType(data:IPageType) {
      this.pageType = data;
    },
    get getPageType() {
      return this.pageType;
    },
    setUserEmail(data:string) {
      this.userEmail = data;
    },
    get getUserEmail() {
      return this.userEmail;
    },
  }));
}
