import { useLocalStore } from 'mobx-react-lite';
import {
  filter, get, map,
} from 'lodash';

export default function useStore(history) {
  return useLocalStore(() => ({
    starProjects: [],
    setStartProjects(value) {
      this.starProjects = value;
    },

    cacheAppServiceData: {},
    setCacheAppServiceData(value) {
      this.cacheAppServiceData = value;
    },

    cacheQuickLinkData: {},
    setCacheQuickLinkData(value) {
      this.cacheQuickLinkData = value;
    },

    cacheDocData: {},
    setCacheDocData(value) {
      this.cacheDocData = value;
    },

    todoThingsData: {},
    setTodoThingsData(value) {
      this.todoThingsData = value;
    },

    todoQuestions: {},
    setTodoQuestions(value) {
      this.todoQuestions = value;
    },

    focusQuestions: {},
    setFocusQuestions(value) {
      this.focusQuestions = value;
    },

    bugQuestions: {},
    setBugQuestions(value) {
      this.bugQuestions = value;
    },

    reportQuestions: {},
    setReportQuestions(value) {
      this.reportQuestions = value;
    },
    myExecutionQuestions: {},
    setMyExecutionQuestions(value) {
      this.myExecutionQuestions = value;
    },

  }));
}
