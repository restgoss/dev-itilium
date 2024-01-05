import logo from '../../utils/images/pridex_black.svg';
import logout from '../../utils/images/logout.svg';
function Header({ isLoggedIn, onSignOut }) {
    const handleLogoutClick = () => {
      onSignOut();
    }
  
    return (
      <header>
        <img className='header__logo' alt='Pridex' src={logo}></img>
        {isLoggedIn ? <img className='header__button' onClick={handleLogoutClick} alt='Выйти' src={logout}></img> : null}
      </header>
    );
  }
  
  export default Header;