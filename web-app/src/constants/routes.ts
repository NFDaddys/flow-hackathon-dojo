import moment from 'moment';
import Qrcodes from "../check-code.json";

const API_ROOT =
  process.env.NEXT_PUBLIC_API_ROOT || 'https://valorpdsapp.web.app';
  
const currentDay = moment().day();
let currentUrl;

const formUrl = () => {
  Qrcodes.forEach((item) => {
    if(item.date === currentDay) {
      currentUrl = item.value;
    };
  });
}
formUrl();

const ROUTES = {
  // Frontend routes
  HOME: '/',
  CHECKIN: `/checkin?qr=${currentUrl}`,
  SCAN: '/scan',
  LEADERBOARD: '/leaderboard',
  PROFILE: '/profile',
  
  // API routes
  API_SIGN_AS_MINTER: `${API_ROOT}/api/signAsMinter`,
  API_SIGN_AS_MINTER_INFO: `${API_ROOT}/api/signAsMinter/info`,
};

export default ROUTES;
