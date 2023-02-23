
import Image from 'next/image';
import Gravatar from 'react-gravatar';
import nfdone from "../../public/nfd1.png"
import valorbadge from "../../public/valor-badge.png"
import nfgred from "../../public/redhappyface.jpeg"
import nfggreen from "../../public/greendaddyface.jpeg"
import nforange from "../../public/yellow-face.jpeg"
import nFDBeat from "../../public/beatupdaddy.png"
import hawk from "../../public/hawk.jpeg"
import ronda from "../../public/ronda.png"

interface AvatarProps {
    avatar?: string;
    address: string;
}

const Avatar = (props: AvatarProps) => {
  return (
    <>
        {props.avatar === undefined && <Gravatar email={props.address} className="avatar-img" />}
        {props.avatar === "Gravatar" && <Gravatar email={props.address} className="avatar-img" />}
        {props.avatar === "MonsterId" && <Gravatar default="monsterid" email={props.address} className="avatar-img" />}
        {props.avatar === "NFD1" && <Image src={nfdone} alt="NFD1" className="avatar-img" />}
        {props.avatar === "Valorpds" && <Image src={valorbadge} alt="valorbadge" className="avatar-img" />}
        {props.avatar === "Pepe" && <Image src={nfgred} alt="Pepe" className="avatar-img" />}
        {props.avatar === "Robert" && <Image src={nfggreen} alt="Robert" className="avatar-img" />}
        {props.avatar === "Francis" && <Image src={nforange} alt="Francis" className="avatar-img" />}
        {props.avatar === "nFDBeat" && <Image src={nFDBeat} alt="Francis" className="avatar-img" />}
        {props.avatar === "Hawk" && <Image src={hawk} alt="Hawk" className="avatar-img" />}
        {props.avatar === "Ronda" && <Image src={ronda} alt="Ronda" className="avatar-img" />}
    </>
  );
};

export default Avatar;
