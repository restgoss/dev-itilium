import './Header.css';
import logo from '../../utils/images/pridex_color.svg';
import logout from '../../utils/images/logout.svg';
import user from '../../utils/images/user.png';
import manual from '../../utils/images/manual.png';
import { useEffect, useState } from 'react';
import guide from '../../utils/Инструкция_работе_с_порталом_Pridex_IT_SupportРасширенная.pdf';
function Header({ isLoggedIn, onSignOut, setPopupOpened }) {
  const handleLogoutClick = () => {
    onSignOut();
  }

  const [currentName, setCurrentName] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      setCurrentName(localStorage.getItem('userFullName'));
    }
  }, [isLoggedIn])


  return (
    <header>
      <img className='header__logo' alt='Pridex' src={logo}></img>
      <div className='header__user-field'>
        {isLoggedIn &&
          <>
            <p className='header__full-name'>{currentName}</p>
          </>
        }
        <a className='header__link' style={{marginRight: '35px'}} href={guide} target='_blank' rel='noreferrer'></a>
        {isLoggedIn ? <img className='header__button' onClick={handleLogoutClick} alt='Выйти' src={logout}></img> : null}
      </div>

    </header>
  );
}

export default Header;