import { useState } from "react";

function Login({ onSignIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function submitForm(e) {
    e.preventDefault();
    onSignIn({ username, password })
  }

  return (
    <>
      <form className="form" onSubmit={(e) => submitForm(e)}>
      <h1 className="form__title">Itilium IT</h1>
        <input
          type="text"
          placeholder="Логин"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        required/>
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        required/>
        <button type="submit" style={{ alignSelf: 'center' }}>Войти</button>
      </form>
    </>
  );
}

export default Login;
