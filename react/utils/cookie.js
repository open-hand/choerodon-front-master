import Cookies from 'universal-cookie';

const cookies = new Cookies();

const setCookie = (name, value, option) => {
  cookies.set(name, value, option);
  localStorage.setItem(name, value);
};

const getCookie = (name, option) => localStorage.getItem(name) || cookies.get(name, option);

const removeCookie = (name, option) => {
  cookies.remove(name, option);
  localStorage.removeItem(name);
};

export {
  setCookie,
  getCookie,
  removeCookie,
};
