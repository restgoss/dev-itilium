import React, { useEffect, useState } from 'react';
import loading from '../utils/images/loading.gif';
import sort_up from '../utils/images/sort-up.png';
import sort_down from '../utils/images/sort-down.png';
import api from '../utils/Api';
import AddNewIncident from './AddNewIncident';
const Profile = ({ incidentsList, isPopupOpened, setPopupOpened }) => {
  const [selectedIncidentUuid, setSelectedIncidentUuid] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isSelectedIncidentLoading, setSelectedIncidentLoading] = useState(true);
  const [sortedIncidentsList, setIncidentsList] = useState([]);
  const [showOnlyInProgress, setShowOnlyInProgress] = useState(false);

  const handleCheckboxChange = () => {
    setShowOnlyInProgress((prevValue) => !prevValue); // Step 3
  };

  // sort logics
  const [sortParams, setSortParams] = useState({
    field: 'date',
    increment: false,
  });

  const { field, increment } = sortParams;

  useEffect(() => {
    if (field === 'date') {
      const sortedIncidents = [...incidentsList];
      sortedIncidents.sort((a, b) => {
        return (increment ? (a.date - b.date ? -1 : 1) : (b.date - a.date ? 1 : -1));
      });
      setIncidentsList(sortedIncidents);
    }
    if (field === 'status') {
      const sortedIncidents = [...incidentsList];
      sortedIncidents.sort((a, b) => {
        const statusA = a.state.toLowerCase();
        const statusB = b.state.toLowerCase();
        return increment ? statusB.localeCompare(statusA) : statusA.localeCompare(statusB);
      });
      setIncidentsList(sortedIncidents);
    }
  }, [field, increment, incidentsList]);




  const setSortedFieldDate = () => {
    setSortParams((prevParams) => ({
      field: 'date',
      increment: !prevParams.increment,
    }));
  };

  const setSortedFieldStatus = () => {
    setSortParams((prevParams) => ({
      field: 'status',
      increment: !prevParams.increment,
    }));
  };


  useEffect(() => {
    const fetchSelectedIncident = async () => {
      try {
        setSelectedIncidentLoading(true);
        const token = localStorage.getItem('jwt');
        const res = await api.getIncidentsDetails(token, selectedIncidentUuid);
        setSelectedIncident(res);
      } catch (error) {
        console.log(error);
      } finally {
        setSelectedIncidentLoading(false);
      }
    };
    if (selectedIncidentUuid) {
      fetchSelectedIncident();
    }
  }, [selectedIncidentUuid]);

  return (
    <>
      <div className='profile-page-block'>
        <div className='profile-div'>
          <div className='incident-list__table'>
          <div className='incident-list__field'>Отображать только заявки в работе<input className='incident-list__field__input' type='checkbox' checked={showOnlyInProgress}
              onChange={handleCheckboxChange}></input></div>
            <div className='incident-list__header'>
              <div className='incident-list__cell first-column' onClick={() => setSortedFieldDate()}>
                Дата
                {sortParams.field === 'date' && (
                  sortParams.increment ? (
                    ' ▲'
                  ) : (
                    ' ▼'
                  )
                )}
              </div>
              <div className={`incident-list__cell second-column`}>Номер</div>
              <div className={`incident-list__cell third-column`}>Тема</div>
              <div className={`incident-list__cell fourth-column`} onClick={() => setSortedFieldStatus()}>
                Статус
                {sortParams.field === 'status' && (
                  sortParams.increment ? (
                    ' ▼'
                  ) : (
                    ' ▲'
                  )
                )}
              </div>
            </div>  
            <div className='incident-list__body'>
              {sortedIncidentsList
              .filter((incident) => !showOnlyInProgress || incident.state !== 'Отклонено')
              .map((incident) => (
                <div
                  key={incident.linkUuid}
                  className='incident-list__row'
                  onClick={() => setSelectedIncidentUuid(incident.linkUuid)}
                >
                  <div className='incident-list__cell first-column'>{incident.date.split(':').slice(0, -1).join(':')}</div>
                  <div className='incident-list__cell second-column'>{incident.number.replace(/^0+/, '')}</div>
                  <div className='incident-list__cell third-column'>{incident.topic}</div>
                  <div className='incident-list__cell fourth-column'>{incident.state}</div>
                </div>
              ))}
            </div>
          </div>
          <div className='incident-info__div'>
            {selectedIncidentUuid ? (
              isSelectedIncidentLoading ? (
                <img src={loading} className='incident-info__loading' alt='Загрузка...'></img>
              ) : (
                <>
                  <div className='incident-info__block'>
                    <div className='incident-info__header'>
                      <div className='incident-info__first-cell'>
                        <span>№ </span>
                        {selectedIncident.number}
                      </div>
                      <div className='incident-info__second-cell'>
                        <span>Дата: </span>
                        {selectedIncident.date}
                      </div>
                    </div>
                    <div className='incident-info__text-block'>
                      <p className='incident-info__topic'>
                        <span>Тема: </span>
                        <p>{selectedIncident.topic}</p>
                      </p>
                      <p className='incident-info__topic'><span>Описание:</span></p>
                      <p className='incident-info__description'> {selectedIncident.description}</p>
                      <p className='incident-info__curator'>
                        <span>Статус: </span>
                        {selectedIncident.state}
                      </p>
                    </div>
                  </div>
                </>
              )
            ) : (
              <p className='incident-info__selectincident'>Выберите заявку из списка</p>
            )}
          </div>
        </div>
      </div >
      <AddNewIncident setPopupOpened={setPopupOpened} isPopupOpened={isPopupOpened} />
    </>
  );
};

export default Profile;
