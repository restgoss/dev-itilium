import './Profile.css';
import React, { useEffect, useState, useRef } from 'react';
import loading from '../../utils/images/loading.gif';
import api from '../../utils/Api';
import AddNewIncident from '../AddNewIncident';
import Search from '../../components/Search/Search';
import Sort from '../../components/Sort/Sort';
import "overlayscrollbars/styles/overlayscrollbars.css";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
const Profile = ({ incidentsList, isPopupOpened, setPopupOpened }) => {
  const [selectedIncidentUuid, setSelectedIncidentUuid] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isSelectedIncidentLoading, setSelectedIncidentLoading] = useState(true);
  const [sortedIncidentsList, setIncidentsList] = useState([]);
  const [showOnlyInProgress, setShowOnlyInProgress] = useState(false);

  const [sortOption, setSortOption] = useState('newest');
  const [ticketsInProgress, setTicketsInProgress] = useState(true);

  const sortIncidents = (list, option, sortedIncidentsList) => {
    let sortedList = [...list];

    switch (option) {
      case 'newest':
        sortedList.sort((a, b) => b.date - a.date ? 1 : -1);
        break;
      case 'oldest':
        sortedList.sort((a, b) => a.date - b.date ? -1 : 1);
        break;
      case 'numberDecrement':
        sortedList.sort((a, b) => parseInt(b.number) - parseInt(a.number));
        break;
      case 'numberIncrement':
        sortedList.sort((a, b) => parseInt(a.number) - parseInt(b.number));
        break;
    }
    return sortedList;
  };

  useEffect(() => {
    const sortedList = sortIncidents(incidentsList, sortOption);
    setIncidentsList(sortedList);
  }, [incidentsList, sortOption]);


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

  const handleWheelScroll = (e) => {
    const delta = e.deltaY || e.detail || e.wheelDelta;
    const scrollSpeed = 1;
    document.querySelector('.incident-list__body').scrollTop += delta * scrollSpeed;
  };

  return (
    <>
      <div className='profile-page-block'>
        <div className='profile-div'>
          <div className='incident-list__table'>
            <div className='incident-list__field'>
              <Search />
              <Sort setSortOption={setSortOption} setTicketsInProgress={setTicketsInProgress} />
              <div className='incident-list__add-button' onClick={() => setPopupOpened(true)}>
                <p className='incident-list__add-button__plus'>+</p>
                <p className='incident-list__add-button__paragraph'>Новое обращение</p>
              </div>
            </div>
            <div className='incident-list__header'>
              <div className='incident-list__header__cell' id='first-column'>Дата</div>
              <div className='incident-list__header__cell' id='second-column'>Номер</div>
              <div className='incident-list__header__cell' id='third-column'>Тема</div>
              <div className='incident-list__header__cell' id='fourth-column'>Статус</div>
            </div>
            <div className='incident-list__body' >
            <OverlayScrollbarsComponent options={{ scrollbars: { autoHide: "leave" } }}>
              {sortedIncidentsList
                .map((incident) => (
                  <div
                    key={incident.linkUuid}
                    className={selectedIncidentUuid && selectedIncidentUuid === incident.linkUuid ? 'incident-list__row incident-list__row_active' : 'incident-list__row'}
                    onClick={() => setSelectedIncidentUuid(incident.linkUuid)}
                  >
                    <div className='incident-list__cell first-column'>{incident.date.split(':').slice(0, -1).join(':')}</div>
                    <div className='incident-list__cell second-column'>{incident.number.replace(/^0+/, '')}</div>
                    <div className='incident-list__cell third-column' style={{ display: 'block' }}>{incident.topic}</div>
                    <div className='incident-list__cell fourth-column'>{incident.state}</div>
                  </div>
                ))}
                 </OverlayScrollbarsComponent>
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
