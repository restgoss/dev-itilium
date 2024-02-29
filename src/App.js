import { useEffect, useState } from 'react';
import './App.css';
import { AnimatePresence } from 'framer-motion';
import { Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import ProtectedRoute from './utils/ProtectedRoute';
import Profile from './pages/Profile/Profile';
import Login from './pages/Login/Login';
import api from './utils/Api';
import LoadingPage from './pages/LoadingPage';
import IncidentDetails from './pages/IncidentDetails';
import Header from './components/Header/Header';
import guide from './utils/Инструкция_работе_с_порталом_Pridex_IT_SupportРасширенная.pdf';
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [incidentsList, setIncidentsList] = useState([]);
  const [isPopupOpened, setPopupOpened] = useState(false);
  const [loginError, setLoginError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const onSignIn = async ({ username, password }) => {
    try {
      setIsLoading(true);
      const token = await api.LoginAD({ username, password });
      localStorage.setItem('jwt', token.Token);
      const { UTekP, UFiz, UIniciator, Full_name, UClient, Key_user } = await api.Login(token.Token);
      localStorage.setItem('currentUserUuid', UTekP);
      localStorage.setItem('currentPhysUuid', UFiz);
      localStorage.setItem('currentIniciatorUuid', UIniciator);
      localStorage.setItem('userFullName', Full_name);
      localStorage.setItem('currentClientUuid', UClient);
      localStorage.setItem('isKeyUser', Key_user);
      setIsLoggedIn(true);
      if (token) {
        fetchIncidents();
      }
    } catch (error) {
      console.error(error.message);
      setLoginError('Неверный логин или пароль');
      setIsLoggedIn(false);
      localStorage.clear();
    } finally {
      setIsLoading(false);
    }
  }

  const onSignOut = () => {
    setIsLoggedIn(false);
    localStorage.clear();
    navigate('/sign-in');
  };

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('jwt');
      if (token) {
        const { UTekP, UFiz, UIniciator, Full_name, UClient, Key_user } = await api.Login(token);
        localStorage.setItem('currentUserUuid', UTekP);
        localStorage.setItem('currentPhysUuid', UFiz);
        localStorage.setItem('currentIniciatorUuid', UIniciator);
        localStorage.setItem('userFullName', Full_name);
        localStorage.setItem('currentClientUuid', UClient);
        localStorage.setItem('isKeyUser', Key_user);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error(error.message);
      localStorage.clear();
    } finally {
      setIsLoading(false);
    }
  }
  

  useEffect(() => {
    fetchUser();
  }, [])


  const fetchIncidents = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const iniciatorUuid = localStorage.getItem('currentIniciatorUuid');
      if (token && iniciatorUuid) {
        const res = await api.getIncidents(token, iniciatorUuid);
        setIncidentsList(res.Incidents);
      }
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    if (isLoggedIn) {
      fetchIncidents();
      navigate('/profile');
    }
  }, [isLoggedIn]);


  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token && !isLoggedIn) {
      setIsLoggedIn(true);
      fetchIncidents();
      navigate('/profile');
    }
  }, [isLoggedIn]);

  if (isLoading) {
    return <LoadingPage text={'Загрузка...'} />
  }

  return (
    <>
      <div className="App">
        <Header isLoggedIn={isLoggedIn} onSignOut={onSignOut} setPopupOpened={setPopupOpened} />
        <Routes>
          <Route path='/sign-in' element={<Login onSignIn={onSignIn} loginError={loginError} />} />
          <Route
            path='/profile'
            element={
              isLoggedIn ? (
                <ProtectedRoute
                  isLoggedIn={isLoggedIn}
                  incidentsList={incidentsList}
                  isPopupOpened={isPopupOpened}
                  setPopupOpened={setPopupOpened}
                  component={Profile}
                  fetchIncidents={fetchIncidents}
                />
              ) : (
                <Navigate to='/sign-in' />
              )
            }
          />
          <Route
            path='/status-test'
            element={isLoggedIn ? <Navigate to='/profile' /> : <Navigate to='/sign-in' />}
          />
          <Route path='*' element={isLoggedIn ? <Navigate to='/profile' /> : <Navigate to='/sign-in' />} />
        </Routes>
      </div>
    </>
  );
}

export default App;

