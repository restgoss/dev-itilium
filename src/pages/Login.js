import { useState } from "react";

function Login({ onSignIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  function submitForm(e) {
    e.preventDefault();
    onSignIn({ username, password })
  }


  return (
    <>
      <form className="form" onSubmit={(e) => submitForm(e)}>
        <p className="form_p">Логин</p>
        <input
          id="username"
          type="text"
          placeholder="Введите логин"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required />
        <p className="form_p">Пароль</p>
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Введите пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="form__showpass">Войти</button>
      </form>
    </>
  );
}

export default Login;
