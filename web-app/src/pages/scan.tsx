import ROUTES from '../constants/routes';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Qrcodes from "../check-code.json";
import moment from 'moment';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import {QRCodeSVG} from 'qrcode.react';
import BeltRewards from "../belts.json";

const Scan = () => {
  const router = useRouter();
  const currentDay = moment().day();
  const [imageString, setimageString] = useState('');
  const [testVersion, settestVersion] = useState('');
  const [currentUrl, seticurrentUrl] = useState('');
  const [dropdownOpen, setdropdownOpen] = useState(false);
  const [activeQR, setactiveQR] = useState(0);

    const goCheckIn = () => {
        router.push({
            pathname: ROUTES.CHECKIN,
            query: {
                qr: currentUrl,
            },
        }) 
    }
    const goCheckInTest = () => {
        router.push({
            pathname: ROUTES.CHECKIN,
            query: {
                test: activeQR,
                qr: currentUrl
            },
        }) 
    }


    const formUrl = () => {
        Qrcodes.forEach((item) => {
            if(item.date === currentDay) {
                seticurrentUrl(item.value);
            };
        });
    }

  useEffect(() => {
    gettingCorrectQr();
    formUrl();
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

    const handleSelection = (test: number) => {
        setactiveQR(test)
    }

    const toggle = () => {
        setdropdownOpen(!dropdownOpen)
    }

  return (
    <>
        <Dropdown isOpen={dropdownOpen} toggle={toggle} className="drop-qr">
            <DropdownToggle caret>
            Select QR
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem active onClick={() => handleSelection(0)}>Course Checkin</DropdownItem>
              {BeltRewards.map((e: any, j) => (
                <DropdownItem key={j} onClick={() => handleSelection(e.level)}>{e.title}</DropdownItem>
              ))}
                
            </DropdownMenu>
        </Dropdown>
        {activeQR === 0 &&
            <div onClick={goCheckIn}>
            <div className="qr-image" >
              <QRCodeSVG size={400} includeMargin={true} fgColor="#d4cac8" bgColor="transparent" value={`https://valorpdsapp.web.app/checkin?qr=${imageString}`} />
            </div>
          </div>
        }
        {activeQR >= 1 &&
            <div onClick={goCheckInTest}>
                <div className="qr-image" >
                <QRCodeSVG size={400} includeMargin={true} fgColor="#d4cac8" bgColor="transparent" value={`https://valorpdsapp.web.app/checkin?qr=${imageString}&test=${activeQR}`} />
                </div>
          </div>
        }
    </>
  );
};

export default Scan;
