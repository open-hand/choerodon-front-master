/* eslint-disable no-underscore-dangle */
import moment from 'moment';

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
    return moment(value).format('YYYY-MM-DD HH:mm:ss');
  }
  return value;
};
