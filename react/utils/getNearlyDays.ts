const getNearlyDay = (day:number) => { // 获取最近几天的时间  getDay(0);//当天日期 getDay(-3);//3天前日期
  const today = new Date();

  const targetdayMilliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;

  today.setTime(targetdayMilliseconds); // 注意，这行是关键代码

  const tYear = today.getFullYear();

  let tMonth = today.getMonth();

  let tDate = today.getDate();

  tMonth = doHandleMonth(tMonth + 1);

  tDate = doHandleMonth(tDate);

  return `${tYear}-${tMonth}-${tDate}`;
};

const doHandleMonth = (month:any) => {
  let m = month;

  if (month.toString().length == 1) {
    m = `0${month}`;
  }

  return m;
};
export default getNearlyDay;
