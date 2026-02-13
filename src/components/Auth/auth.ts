export const getAccessToken = () => {
  return (
    localStorage.getItem('userToken') ||
    sessionStorage.getItem('userToken')
  );
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

export const refreshAccessToken = async () => {
  const storedRefreshToken =
    localStorage.getItem('refreshToken') ||
    sessionStorage.getItem('refreshToken');
  if (!storedRefreshToken) {
    throw new Error('No refresh token found');
  }

  const res = await fetch('https://dummyjson.com/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      refreshToken: storedRefreshToken,
      expiresInMins: 30,
    }),
  });
  if (!res.ok) {
    throw new Error('Failed to refresh token');
  }
  return res.json();
};

export const saveTokens = (
  accessToken: string,
  refreshToken: string
) => {
  const isRemembered = !!localStorage.getItem('refreshToken');
  const storage = isRemembered ? localStorage : sessionStorage;
  storage.setItem('userToken', accessToken);
  storage.setItem('refreshToken', refreshToken);
};