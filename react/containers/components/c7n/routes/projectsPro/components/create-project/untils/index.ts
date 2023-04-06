/* eslint-disable no-underscore-dangle */
import moment from 'moment';

export const MAX_NUMBER_VALUE = 99999999;
// 两位小数
export const MAX_FLOAT_BITE = 2;
export const MAX_NUMBER_STEP = Math.pow(10, -MAX_FLOAT_BITE);

export const getDisplayDateTypeValue = (value:any, fieldType:any) => {
  if (fieldType === 'time') {
    return moment(value).format('HH:mm:ss');
  } if (fieldType === 'date') {
    return moment(value).format('YYYY-MM-DD');
  }
  return value;
};

export const getsubmitDateTypeValue = (value:any, fieldType:any) => {
  if (fieldType === 'time') {
    const str = moment().format('YYYY-MM-DD');
    // @ts-ignore
    const isValid = moment(`${str} ${value}`)._isValid;
    if (isValid) {
      return moment(`${str} ${value}`).format('YYYY-MM-DD HH:mm:ss');
    }
    return value;
  } if (fieldType === 'date') {
    if (!value) {
      return null;
    }
    return moment(value).format('YYYY-MM-DD HH:mm:ss');
  }
  return value;
};

export const getNumberTypeDynamicProps = (fieldType:any, decimalFlag:boolean) => ({
  max: () => {
    if (fieldType === 'number') {
      return MAX_NUMBER_VALUE;
    }
    return undefined;
  },
  step: () => {
    if (fieldType === 'number') {
      return decimalFlag ? MAX_NUMBER_STEP : 1;
    }
    return undefined;
  },
});
