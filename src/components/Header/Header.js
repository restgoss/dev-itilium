import './Header.css';
import logo from '../../utils/images/pridex_color.svg';
import logout from '../../utils/images/logout.svg';
import user from '../../utils/images/user.png';
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
      {isLoggedIn &&
        <div className='header__user-field'>
          {currentName &&
            <>
              <p className='header__full-name'>{currentName}</p>
            </>
          }
          {isLoggedIn ? <img className='header__button' onClick={handleLogoutClick} alt='Выйти' src={logout}></img> : null}
        </div>
      }
    </header>
  );
}

export default Header;