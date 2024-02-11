import show from '../../utils/images/show.png';
import './Login.css';
import React, { useState } from "react";
import { AnimatePresence, motion } from 'framer-motion';
function Login({ onSignIn, loginError }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  function handleUsernameFocus() {
    setUsernameFocused(true);
  }

  function handleUsernameBlur() {
    setUsernameFocused(false);
  }

  function handlePasswordFocus() {
    setPasswordFocused(true);
  }

  function handlePasswordBlur() {
    setPasswordFocused(false);
  }

  function submitForm(e) {
    e.preventDefault();
    setErrorMessage('');
    onSignIn({ username, password });
  }

  return (
    <>
    <AnimatePresence>
      <motion.form 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="form" onSubmit={(e) => submitForm(e)}>
        <div className='user-box'>
          <input
            id="username"
            type="text"
            value={username}
            onFocus={handleUsernameFocus}
            onBlur={handleUsernameBlur}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label className={usernameFocused || username ? 'focused' : ''}>Логин</label>
        </div>
        <div className='user-box'>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onFocus={handlePasswordFocus}
            onBlur={handlePasswordBlur}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label className={passwordFocused || password ? 'focused' : ''}>Пароль</label>
          <img src={show} className='form__show' onClick={() => setShowPassword(!showPassword)} alt="Show Password"></img>
        </div>
        {loginError && <p style={{ color: 'red', margin: '0 0 10px 0' }}>{loginError}</p>}
        <button type="submit" className="form__showpass">Войти</button>
      </motion.form>
      </AnimatePresence>
    </>
  );
}


export default Login;
