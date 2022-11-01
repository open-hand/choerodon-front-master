import React, { useCallback, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from './stores';
import RegisterPageContainer from './components/register/pageContainer';
import RegisterForm from './components/register/registerForm';
import SubmitSuccess from './components/register/submitSuccess';
import Approved from './components/register/approved';
import CompeleteInfoPageContainer from './components/compelete/compeletePageContainer';
import CompeleteInfoForm from './components/compelete/compeleteForm';
import CompeleteInfoSuccess from './components/compelete/compeleteSuccess';
import RegisterPagePhoneContainer from './mobileComponents/register/pageContainer';
import RegisterPhone from './mobileComponents/register/registerForm';
import RegisterSuccessPhone from './mobileComponents/register/submitSuccess';
import ApprovedPhone from './mobileComponents/register/approved';
import { TPagecontainer, TPageContent } from './stores/useStore';

export interface IProps {

}

const pageContainerMap:Map<TPagecontainer, React.FC<any>> = new Map([
  ['registerPage', RegisterPageContainer],
  ['registerPhonePage', RegisterPagePhoneContainer],
  ['compeletePage', CompeleteInfoPageContainer],
]);

const pageContentMap:Map<TPageContent, React.FC<any>> = new Map([
  ['register', RegisterForm],
  ['registerSuccess', SubmitSuccess],
  ['registerApproved', Approved],
  ['compelete', CompeleteInfoForm],
  ['compeleteSuccess', CompeleteInfoSuccess],
  ['registerPhone', RegisterPhone],
  ['registerSuccessPhone', RegisterSuccessPhone],
  ['approvedPhone', ApprovedPhone],
]);

const Content:React.FC<IProps> = (props) => {
  const {
    intlPrefix, prefixCls, mainStore,
  } = useStore();

  const { getPageType, setPageType } = mainStore;

  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|BlackBerry/i.test(
      navigator.userAgent,
    );
    if (isMobile) {
      setPageType({
        container: 'registerPhonePage',
        content: 'registerPhone',
      });
    }
    if (window.location.href.indexOf('user_token') !== -1) {
      setPageType({
        container: 'compeletePage',
        content: 'compelete',
      });
    }
  }, []);

  const getPage = useCallback(
    () => {
      const PageContainer = pageContainerMap.get(getPageType.container)!;
      const PageContent = pageContentMap.get(getPageType.content)!;
      return (
        <PageContainer>
          <PageContent />
        </PageContainer>
      );
    }, [getPageType],
  );

  return (
    <>
      { getPage()}
    </>
  );
};

export default observer(Content);
