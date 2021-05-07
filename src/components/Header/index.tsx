import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import { useEffect, useRef, useState } from 'react';

import styles from '../Header/styles.module.scss';


export default function Header(){
    const currentDate = format(new Date(), 'EEEEEE, d MMM',{
        locale: ptBR,
    })
    
    const [isDark, setIsDark] = useState(false)

    function toggleDarkMode(){
        setIsDark(!isDark)
    }
    useEffect(()=>{
        console.log(isDark)
        document.querySelector("html").setAttribute('data-dark',String(isDark))
    },[isDark])

    return(    
            <header className={styles.headerContainer}>
                <img src="/logo.svg" alt="Podcast"/>
                <p> O melhor para você ouvir, sempre</p>
                <span>{currentDate}</span>
                <label className={styles.switch}>
                    <input type="checkbox" onChange={toggleDarkMode}/>
                    <span className={`${styles.slider} ${styles.round}`}></span>
                </label>
            </header>
    )
}