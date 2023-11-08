import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './index.module.scss';

const apiUrlAuth = 'http://153.92.222.171:8000';

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    const authToken = sessionStorage.getItem('authToken');
    if (authToken) {
      navigate('/');
    }
  }, []);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setErrorMessage(''); 
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setErrorMessage(''); 
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiUrlAuth}/api/auth/sign-in`, {
        username,
        password,
      });

      console.log('Успешно авторизован:', response.data);

      sessionStorage.setItem('authToken', response.data.access_token);
      sessionStorage.setItem('refreshToken', response.data.refresh_token);

      navigate('/');
    } catch (error) {
      console.error('Ошибка авторизации:', error);
      setErrorMessage('Неверное имя пользователя или пароль!');
    }
  };

  const authToken = sessionStorage.getItem('authToken');

  if (authToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
  }

  return (
    <div className={styles.fon}>
      <div className={`${styles.light} ${styles.x1}`}></div>
      <div className={`${styles.light} ${styles.x2}`}></div>
      <div className={`${styles.light} ${styles.x3}`}></div>
      <div className={`${styles.light} ${styles.x4}`}></div>
      <div className={`${styles.light} ${styles.x5}`}></div>
      <div className={`${styles.light} ${styles.x6}`}></div>
      <div className={`${styles.light} ${styles.x7}`}></div>
      <div className={`${styles.light} ${styles.x8}`}></div>
      <div className={`${styles.light} ${styles.x9}`}></div>

      <div className={styles.authorizationform}>
        <h2>Авторизация</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formconteaner}>
            <label htmlFor="username">Имя пользователя:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
            />
          </div>
          <div className={styles.formconteaner}>
            <label htmlFor="password">Пароль:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          {errorMessage && <div className={styles.error}>{errorMessage}</div>}
          <button type="submit">Войти</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
