import React, { useEffect, useState } from 'react';
import loading from '../utils/images/loading.gif';
import sort from '../utils/images/sort.png';
import api from '../utils/Api';
import AddNewIncident from './AddNewIncident';
import { sortByDate } from '../utils/SortingAlgorithms';
const Profile = ({ incidentsList }) => {
  const [selectedIncidentUuid, setSelectedIncidentUuid] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isSelectedIncidentLoading, setSelectedIncidentLoading] = useState(true);
  const [isPopupOpened, setPopupOpened] = useState(false);

  // sort logics
  const [sortedField, setSortedField] = useState('date');
  
  useEffect(() => {
    if (sortedField === 'date') {
      incidentsList.sort(sortByDate);
    }
  }, [sortedField, incidentsList])




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
        <button className='button-add-new-incident' onClick={() => setPopupOpened(true)}>Создать обращение</button>
        <div className='profile-div'>
          <div className='incident-list__table'>
            <div className='incident-list__header'>
              <div className={`incident-list__cell first-column`} onClick={() => setSortedField('date')}>Дата{sortedField === 'date' ? <img className='incident-list__sort' src={sort} alt=''></img> : null}</div>
              <div className={`incident-list__cell second-column`}>Тема</div>
              <div className={`incident-list__cell third-column`} onClick={() => setSortedField('status')}>Статус{sortedField === 'status' ? <img className='incident-list__sort' src={sort} alt=''></img> : null}</div>
            </div>
            <div className='incident-list__body'>
              {incidentsList.map((incident) => (
                <div
                  key={incident.linkUuid}
                  className='incident-list__row'
                  onClick={() => setSelectedIncidentUuid(incident.linkUuid)}
                >
                  <div className='incident-list__cell first-column'>{incident.date}</div>
                  <div className='incident-list__cell second-column'>{incident.topic}</div>
                  <div className='incident-list__cell third-column'>{incident.state}</div>
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
                  <div className='incident-info__header'>
                    <div className='incident-info__first-cell'>
                      <span>№ </span>
                      {selectedIncident.number}
                    </div>
                    <div className='incident-info__second-cell'>
                      <span>Дата: </span>
                      {selectedIncident.date}
                    </div>
                    <div className='incident-info__third-cell'>
                      <span>Статус: </span>
                      {selectedIncident.state}
                    </div>
                  </div>
                  <div className='incident-info__text-block'>
                    <p className='incident-info__topic'>
                      <span>Тема: </span>
                      {selectedIncident.topic}
                    </p>
                    <p className='incident-info__description'>{selectedIncident.description}</p>
                    <p className='incident-info__curator'>
                      <span>Ответственный: </span>
                      {selectedIncident.responsible}
                    </p>
                  </div>
                </>
              )
            ) : (
              <p className='incident-info__selectincident'>Выберите заявку из списка</p>
            )}
          </div>
        </div>
      </div>
      <AddNewIncident setPopupOpened={setPopupOpened} isPopupOpened={isPopupOpened} />
    </>
  );
};

export default Profile;
