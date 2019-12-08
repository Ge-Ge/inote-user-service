// 登录redis key
const LOGIN_REFRESH_TOKEN = { key: 'login:refreshToken', express: 3600 * 24 * 15 };
const LOGIN_ACCESS_TOKEN = { key: 'login:accessToken', express: 3600 * 24 * 15 };

export {
  LOGIN_REFRESH_TOKEN,
  LOGIN_ACCESS_TOKEN,
};
