import { useEffect, useState } from 'react';
import './App.css';
import { AnimatePresence } from 'framer-motion';
import { Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import ProtectedRoute from './utils/ProtectedRoute';
import Profile from './pages/Profile/Profile';
import Login from './pages/Login';
import api from './utils/Api';
import LoadingPage from './pages/LoadingPage';
import IncidentDetails from './pages/IncidentDetails';
import Header from './components/Header/Header';
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
      const tokenAD = await api.LoginAD({ username, password });
      const token = await api.getToken(tokenAD.auth_token);
      localStorage.setItem('jwt', token.Token);
      const { UTekP, UFiz, UIniciator } = await api.Login(token.Token);
      localStorage.setItem('currentUserUuid', UTekP);
      localStorage.setItem('currentPhysUuid', UFiz);
      localStorage.setItem('currentIniciatorUuid', UIniciator);
      setIsLoggedIn(true);
      navigate('/profile');
      fetchIncidents();
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
    localStorage.clear();
    setIsLoggedIn(false);
    navigate('/sign-in');
  };

  const addNewIncident = async ({ topic, description }) => {
    try {
      setIsLoading(true);
      const body = {
        "Topic": `${topic}`,
        "Data": "16.11.2023 14:15:00",
        "Description": `${description}`
      }
      const token = localStorage.getItem('jwt');
      const res = await api.addNewIncident(token, body);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      navigate('/profile');
    }
  }

  const fetchIncidents = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const iniciatorUuid = localStorage.getItem('currentIniciatorUuid');
      const res = await api.getIncidents(token, iniciatorUuid);
      setIncidentsList(res.Incidents);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      fetchIncidents();
    }
  }, [location, isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
        const interval = setInterval(() => {
          fetchIncidents();
        }, 60000);

        return () => clearInterval(interval);
    }
}, [fetchIncidents]);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token && !isLoggedIn) {
      setIsLoggedIn(true);
      fetchIncidents();
      navigate('/profile');
    }
  }, []);

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
                  />
                ) : (
                  <Navigate to='/sign-in' />
                )
              }
            />

            <Route path='/incident-details/:uuid' element={<IncidentDetails />} />
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
