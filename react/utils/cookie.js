import Cookies from 'universal-cookie';

const cookies = new Cookies();

const setCookie = (name, value, option) => {
  console.log(name,value,option,'in cookie.js')
  console.log(document.domain,'in cookie.js' )
  console.log(window.location.href,'in cookie.js')
  cookies.set(name, value, option);
};

const getCookie = (name, option) => cookies.get(name, option);

const removeCookie = (name, option) => {
  cookies.remove(name, option);
};

export {
  setCookie,
  getCookie,
  removeCookie,
};
