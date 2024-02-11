import './Profile.css';
import React, { useEffect, useState, useRef } from 'react';
import loading from '../../utils/images/loading.gif';
import api from '../../utils/Api';
import Messenger from '../../components/Messenger/Messenger';
import Search from '../../components/Search/Search';
import Sort from '../../components/Sort/Sort';
import "overlayscrollbars/styles/overlayscrollbars.css";
import { motion, AnimatePresence } from 'framer-motion'
import sort_up from '../../utils/images/sort-up.png';
import sort_down from '../../utils/images/sort-down.png';
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import IncidentPopup from '../../components/IncidentPopup/IncidentPopup';
import Rate from '../../components/Rate/Rate';
const Profile = ({ incidentsList, isPopupOpened, setPopupOpened, fetchIncidents }) => {
  const [selectedIncidentUuid, setSelectedIncidentUuid] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isSelectedIncidentLoading, setSelectedIncidentLoading] = useState(true);
  const [sortedIncidentsList, setIncidentsList] = useState([]);
  const [isIncidentClosed, setIsIncidentClosed] = useState(false);
  const [sortOption, setSortOption] = useState('newest');
  const [ticketsInProgress, setTicketsInProgress] = useState(true);

  const handleSortClick = (type) => {
    if (type === sortOption) {
      switch (type) {
        case 'newest':
          setSortOption('oldest');
          break;
        case 'oldest':
          setSortOption('newest');
          break;
        case 'numberDecrement':
          setSortOption('numberIncrement');
          break;
        case 'numberIncrement':
          setSortOption('numberDecrement');
          break;
        case 'alphabet':
          setSortOption('alphabetReverse');
          break
        case 'alphabetReverse':
          setSortOption('alphabet');
          break
        default:
          break;
      }
    } else {
      setSortOption(type);
    }
  };



  const sortIncidents = (list, option, sortedIncidentsList) => {
    let sortedList = [...list];

    switch (option) {
      case 'newest':
        sortedList.sort((a, b) => new Date(convertDateFormat(b.date)) - new Date(convertDateFormat(a.date)));
        break;
      case 'oldest':
        sortedList.sort((a, b) => new Date(convertDateFormat(a.date)) - new Date(convertDateFormat(b.date)));
        break;
      case 'numberDecrement':
        sortedList.sort((a, b) => parseInt(b.number) - parseInt(a.number));
        break;
      case 'numberIncrement':
        sortedList.sort((a, b) => parseInt(a.number) - parseInt(b.number));
        break;
      case 'alphabet':
        sortedList.sort((a, b) => a.state.toLowerCase().localeCompare(b.state.toLowerCase()));
        break;
      case 'alphabetReverse':
        sortedList.sort((a, b) => b.state.toLowerCase().localeCompare(a.state.toLowerCase()));
        break;
      default:
        console.log('defaultcase');
    }
    return sortedList;
  };

  const convertDateFormat = (dateString) => {
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('.');
    let [hours, minutes, seconds] = timePart.split(':');
    hours = hours.length === 1 ? `0${hours}` : hours;

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };
  
  useEffect(() => {
    const sortedList = sortIncidents(incidentsList, sortOption);
    setIncidentsList(sortedList);
  }, [incidentsList, sortOption]);

  const fetchSelectedIncident = async () => {
    try {
      setSelectedIncidentLoading(true);
      const token = localStorage.getItem('jwt');
      const res = await api.getIncidentsDetails(token, selectedIncidentUuid);
      setSelectedIncident(res);
      const isClosed = ['Отклонено', 'Не согласовано', 'Закрыто'].includes(res.state);
      setIsIncidentClosed(isClosed);
    } catch (error) {
      console.log(error);
    } finally {
      setSelectedIncidentLoading(false);
    }
  };

  useEffect(() => {
    if (selectedIncidentUuid) {
      fetchSelectedIncident();
    }
  }, [selectedIncidentUuid]);

  return (
    <>
      <div className='profile-page-block'>
        <div className='profile-div'>
          <div className='incident-list__table'>
            <div className='incident-list__field'>
              <Sort key='sort_component' setSortOption={setSortOption} setTicketsInProgress={setTicketsInProgress} sortOption={sortOption} ticketsInProgress={ticketsInProgress} />
              <div className='incident-list__add-button' onClick={() => setPopupOpened(true)}>
                <p className='incident-list__add-button__paragraph'>Создать</p>
              </div>
            </div>
            <div className='incident-list__header'>
              <div className='incident-list__header__cell' id='first-column' onClick={() => handleSortClick('newest')}>
                <p>Дата</p>
                {sortOption == 'newest' && <img src={sort_down} className='incident-list__header__arrow' alt=''></img>}
                {sortOption == 'oldest' && <img src={sort_up} className='incident-list__header__arrow' alt=''></img>}
              </div>
              <div className='incident-list__header__cell' id='second-column' onClick={() => handleSortClick('numberDecrement')}>
                <p>Номер</p>
                {sortOption == 'numberDecrement' && <img className='incident-list__header__arrow' src={sort_down} alt=''></img>}
                {sortOption == 'numberIncrement' && <img className='incident-list__header__arrow' src={sort_up} alt=''></img>}
              </div>
              <div className='incident-list__header__cell no-hover' id='third-column'>Тема</div>
              <div className='incident-list__header__cell' id='fourth-column' onClick={() => handleSortClick('alphabet')}>
                <p>Статус</p>
                {sortOption == 'alphabet' && <img className='incident-list__header__arrow' src={sort_down} alt=''></img>}
                {sortOption == 'alphabetReverse' && <img className='incident-list__header__arrow' src={sort_up} alt=''></img>}
              </div>
            </div>
            <div className='incident-list__body' >
              <OverlayScrollbarsComponent options={{ scrollbars: { autoHide: "leave" } }}>
                {sortedIncidentsList.length === 0 ? (
                  <p className='incident-info__selectincident'>Все Ваши обращения выполнены</p>
                ) : (
                  sortedIncidentsList
                    .filter((item) =>
                      (ticketsInProgress && !['Отклонено', 'Не согласовано', 'Закрыто'].includes(item.state)) ||
                      (!ticketsInProgress)
                    )
                    .map((incident, index) => (
                      <div
                        key={`${incident.linkUuid}-${index}`}
                        className={selectedIncidentUuid && selectedIncidentUuid === incident.linkUuid ? 'incident-list__row incident-list__row_active' : 'incident-list__row'}
                        onClick={() => setSelectedIncidentUuid(incident.linkUuid)}
                      >
                        <p className='incident-list__row__p'>{incident.date.split(':').slice(0, -1).join(':')}</p>
                        <p className='incident-list__row__p'>{incident.number.replace(/^0+/, '')}</p>
                        <p className='incident-list__row__p' style={{ textAlign: 'left' }}>{incident.topic}</p>
                        <p className='incident-list__row__p'>{incident.state}</p>
                      </div>
                    ))
                )}
              </OverlayScrollbarsComponent>

            </div>
          </div>
          <div className='incident-info__div'>
            {selectedIncidentUuid ? (
              isSelectedIncidentLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ height: '100%' }}>

                  <motion.img
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    src={loading} className='incident-info__loading' alt='Загрузка...'></motion.img>
                </motion.div>
              ) : (
                <>
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: .5, type: 'tween', delay: .3 }}
                      className='incident-info__header'>
                      <motion.div className='incident-info__first-cell'>
                        <span>№ </span>
                        {selectedIncident.number}
                      </motion.div>
                      <motion.div className='incident-info__second-cell'>
                        <span>От: </span>
                        {selectedIncident.date}
                      </motion.div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: .5, type: 'tween', delay: .3 }}
                      className='incident-info__block'>
                      <div className='incident-info__text-div'>
                        <div className='incident-info__text-block'>
                          <p className='incident-info__topic'>
                            <span>Тема: </span>
                            <p>{selectedIncident.topic}</p>
                          </p>
                          <p className='incident-info__topic' style={{ marginTop: '20px' }}><span>Описание:</span></p>
                          <OverlayScrollbarsComponent style={{ maxHeight: '90px' }} options={{ scrollbars: { autoHide: "leave" } }}>
                            <p className='incident-info__description'>{selectedIncident.description}</p>
                          </OverlayScrollbarsComponent>
                        </div>
                        <div className='incident-info__curator'>
                          <div className='incident-info__status'>
                            <span className='incident-info__status__span'>Статус: </span>
                            <p className='incident-info__status__p'>{selectedIncident.state}</p>
                          </div>
                        </div>
                      </div>
                      <Messenger isIncidentClosed={isIncidentClosed} messageHistory={selectedIncident.TheHistoryOfCommunication} selectedIncidentUuid={selectedIncidentUuid} fetchSelectedIncident={fetchSelectedIncident} />
                    </motion.div>
                  </AnimatePresence>
                </>
              )
            ) : (
              <p className='incident-info__selectincident'>Выберите обращение из списка слева</p>
            )}
          </div>
        </div>
      </div >
      <IncidentPopup setPopupOpened={setPopupOpened} isPopupOpened={isPopupOpened} fetchIncidents={fetchIncidents}/>
    </>
  );
};

export default Profile;
