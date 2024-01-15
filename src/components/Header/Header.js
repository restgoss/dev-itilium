import logo from '../../utils/images/pridex_black.svg';
import logout from '../../utils/images/logout.svg';
function Header({ isLoggedIn, onSignOut, setPopupOpened }) {
    const handleLogoutClick = () => {
      onSignOut();
    }
  
    return (
      <header>
        <img className='header__logo' alt='Pridex' src={logo}></img>
        {isLoggedIn ? <button className='button-add-new-incident' onClick={() => setPopupOpened(true)}>Создать новое обращение</button> : null}
        {isLoggedIn ? <img className='header__button' onClick={handleLogoutClick} alt='Выйти' src={logout}></img> : null}
      </header>
    );
  }
  
  export default Header;