import { useLocalStore } from 'mobx-react-lite';

export default function useStore(history) {
  return useLocalStore(() => ({
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

    myHandlerIssues: {},
    setMyHandlerIssues(value) {
      this.myHandlerIssues = value;
    },
    clear() {
      ['cacheDocData', 'todoThingsData', 'todoQuestions', 'focusQuestions', 'bugQuestions', 'reportQuestions', 'myExecutionQuestions', 'myHandlerIssues'].forEach((key) => {
        this[key] = {};
      });
    },
  }));
}
