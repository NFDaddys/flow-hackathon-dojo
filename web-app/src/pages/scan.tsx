import ROUTES from '../constants/routes';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Qrcodes from "../check-code.json";
import moment from 'moment';
import {QRCodeSVG} from 'qrcode.react';

const Scan = () => {
  const router = useRouter();
  const currentDay = moment().day();
  const [imageString, setimageString] = useState('');

  const goCheckIn = () => {
    router.push(ROUTES.CHECKIN);
  }

  useEffect(() => {
    gettingCorrectQr();
  }, []);

    const gettingCorrectQr = async () => {
    // loop through QR json and see whicch one matches the date
        Qrcodes.forEach((item) => {
        // item.formedDate = new Date
        if(item.date === currentDay) {
        //   setcurrentQrInfo(item);
            switch (item.date) {
                case 0:
                setimageString(item.value);
                break;
                case 1:
                setimageString(item.value);
                break;
                case 2:
                setimageString(item.value);
                break;
                case 3:
                setimageString(item.value);
                break;
                case 4:
                setimageString(item.value);
                break;
                case 5:
                setimageString(item.value);
                break;
                case 6:
                setimageString(item.value);
                break;
                default:
                setimageString(item.value);
                break;
            };
        };
    });
};

  return (
      <div onClick={goCheckIn}>
        <div className="qr-image" >
          <QRCodeSVG size={400} includeMargin={true} fgColor="#d4cac8" bgColor="#111" value={'https://valorpdsapp.web.app/checkin?qr=' + imageString} />
        </div>
      </div>
  );
};

export default Scan;
