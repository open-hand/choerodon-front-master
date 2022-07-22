import Api from './Api';

class MultiLanguageApi extends Api<MultiLanguageApi> {
  /**
   * @description: 前缀
   * @param {*}
   * @return {*}
   */
  get prefix() {
    return '/hpfm/choerodon/v1/multi-language';
  }

  getMultiLanguage({ token, paramFieldName, fieldName }:Record<string, string>) {
    return this.request({
      url: `${this.prefix}/tl?fieldName=${paramFieldName}`,
      method: 'post',
      data: {
        _token: token,
      },
      transformResponse: (data) => {
        // eslint-disable-next-line no-useless-catch
        try {
          const jsonData = JSON.parse(data);
          if (jsonData && !jsonData.failed) {
            const tlsRecord = {};
            jsonData.forEach((intlRecord:any) => {
              (tlsRecord as any)[intlRecord.code] = intlRecord.value;
            });
            return [{ [fieldName]: tlsRecord }];
          } if (jsonData && jsonData.failed) {
            throw new Error(jsonData.message);
          }
        } catch (e) {
          // do nothing, use default error deal
          throw e;
        }
        return data;
      },
    });
  }
}

const multiLanguageApi = new MultiLanguageApi();
const MultiLanguageApiConfig = new MultiLanguageApi(true);
export { multiLanguageApi, MultiLanguageApiConfig };
