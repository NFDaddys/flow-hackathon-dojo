const API_ROOT =
  process.env.NEXT_PUBLIC_API_ROOT || 'https://valorpds.nfdaddys.tech/';

const ROUTES = {
  // Frontend routes
  HOME: '/',
  CHECKIN: `/checkin`,
  SCAN: '/scan',
  LEADERBOARD: '/leaderboard',
  PROFILE: '/profile',
  
  // API routes
  API_SIGN_AS_MINTER: `${API_ROOT}/api/signAsMinter`,
  API_SIGN_AS_MINTER_INFO: `${API_ROOT}/api/signAsMinter/info`,
};

export default ROUTES;
