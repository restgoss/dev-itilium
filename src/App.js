import { useEffect, useState } from 'react';
import './App.css';
import { Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import ProtectedRoute from './utils/ProtectedRoute';
import Profile from './pages/Profile';
import Login from './pages/Login';
import api from './utils/Api';
import Footer from './components/Footer/Footer';
import LoadingPage from './pages/LoadingPage';
import IncidentDetails from './pages/IncidentDetails';
import Header from './components/Header/Header';
import AddNewIncident from './pages/AddNewIncident';
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('jwt'));
  const [isLoading, setIsLoading] = useState(false);
  const [incidentsList, setIncidentsList] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const onSignIn = async ({ username, password }) => {
    try {
      setIsLoading(true);
      const token = btoa(`${username}:${password}`);
      const res = await api.Login(token);
      localStorage.setItem('jwt', token);
      localStorage.setItem('currentUserUuid', res.UTekP);
      localStorage.setItem('currentPhysUuid', res.UFiz);
      localStorage.setItem('currentIniciatorUuid', res.UIniciator);
      setIsLoggedIn(true);
      console.log(isLoggedIn);
      navigate('/profile');
    } catch (error) {
      console.log(error);
      localStorage.clear();
    } finally {
      setIsLoading(false);
      fetchIncidents();
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
      console.log(res);
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
    if (localStorage.getItem('jwt')) {
      setIsLoggedIn(true);
      fetchIncidents();
    }
  }, [location]);

  if (isLoading) {
    return <LoadingPage text={'Загрузка...'} />
  }

  return (
    <>
      <div className="App">
      <Header isLoggedIn={isLoggedIn} onSignOut={onSignOut} />
        <Routes>
          <Route path='/sign-in' element={<Login onSignIn={onSignIn} />} />
          <Route
            path='/profile'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                incidentsList={incidentsList}
                component={Profile} 
              />
            }
          >
            <Route index={isLoggedIn ? <Navigate to='/profile' /> : <Navigate to='/sign-in' />} />
          </Route>

          <Route path='/incident-details/:uuid' element={<IncidentDetails />} />
          <Route
            path='/status-test'
            element={isLoggedIn ? <Navigate to='/profile' /> : <Navigate to='/sign-in' />}
          />
          <Route
            path='/add-new-incident'
            element={<AddNewIncident onSubmit={addNewIncident} />}
          />
          <Route path='*' element={isLoggedIn ? <Navigate to='/profile' /> : <Navigate to='/sign-in' />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
