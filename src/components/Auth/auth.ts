export const getAccessToken = () => {
  return localStorage.getItem('userToken');
};

export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

export const isLoggedIn = () => {
  return !!getAccessToken();
};

export const logout = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('refreshToken');
};
