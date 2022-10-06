import {FC, useState} from "react";
import PrimaryButton from "@/shared_components/buttons/primaryButton";
import s from '../../styles/Index.module.css'
import Image from "next/image";
import hotDog from '../../../public/images/landing/HotDog.png';

const StartPage: FC = () => {

    const [password, setPassword] = useState<string>('');
    const PASSWORD = 'bettertogether';

    return (
        <div className={s.app}>
            {/*<a*/}
            {/*    className={s.loginLink}*/}
            {/*    href='#'*/}
            {/*>Log in</a>*/}
            <div className={s.loginLink}>
                <PrimaryButton
                    onClick={
                        () => password.toLowerCase() === PASSWORD ? console.log('enter') : console.log('error password')
                    }
                    text='Log in'
                    size='tiny'
                />
            </div>
            <div className={s.content}>
                <img
                    className={s.logo}
                    src={'./images/landing/Logo.svg'} alt='morm'/>
                <p className={s.description}>Modernizing worker training/development for blue-collar businesses</p>
                <input
                    className={s.passwordInput}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value) }
                />
                <PrimaryButton
                    onClick={
                        () => password.toLowerCase() === PASSWORD ? console.log('enter') : console.log('error password')
                    }
                    text='Enter'
                    size='small'
                />
            </div>
            <img
                className={s.burger}
                src={'./images/landing/Burger.png'}
                alt="burger"/>
            <img
                className={s.prize}
                src={'./images/landing/Prize.png'}
                alt="prize"/>
            <img
                className={s.pizza}
                src={'./images/landing/Pizza.png'}
                alt="pizza"/>
            <img
                className={s.hotDog}
                src={'./images/landing/HotDog.png'}
                alt="hot dog"/>
            <img
                className={s.donut}
                src={'./images/landing/Donut.png'}
                alt="Donut"/>
            <img
                className={s.hotDogBlur}
                src={'./images/landing/HotDog.png'}
                alt="hot dog blur"/>
        </div>
    );
}

export default StartPage;