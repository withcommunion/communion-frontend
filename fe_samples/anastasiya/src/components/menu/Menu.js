// import styles from './Menu.module.scss';
import HomeImg from '../../resourses/menu/Home.svg';
import SendImg from '../../resourses/menu/Send.svg';
import RedeemImg from '../../resourses/menu/Redeem.svg';
import SettingsImg from '../../resourses/menu/Settings.svg';
// import { Link } from "react-router-dom";


export default function Menu(){
    return(
        <div className="fixed h-14 inset-x-0 bottom-0 bg-white shadow-menuShadow">
        <div className="flex justify-around items-center mx-1 h-full ">
            <div><img src={HomeImg} alt="home"/></div>
            <div><img src={SendImg} alt="send"/></div>
            <div><img src={RedeemImg} alt="redeem"/></div>
            <div><img src={SettingsImg} alt="settings"/></div>
        </div>
        </div>
    )
}