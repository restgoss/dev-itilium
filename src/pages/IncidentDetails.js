// IncidentDetails.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/Api';

const IncidentDetails = () => {
    const { uuid } = useParams();
    const [incidentDetails, setIncidentDetails] = useState({});
    useEffect(() => {
        const fetchIncidentDetails = async () => {
            try {
                const token = localStorage.getItem('jwt');
                const response = await api.getIncidentsDetails(token, uuid);
                setIncidentDetails(response);
            } catch (error) {
                console.error(error);
            }
        };

        fetchIncidentDetails();
    }, [uuid]);

    return (
        <div>
            <h1>Детали заявки</h1>
            <p>Заголовок: {incidentDetails.topic}</p>
            <p>Куратор: {incidentDetails.curator}</p>
            <p>Клиент: {incidentDetails.client}</p>
            <p>Инициатор: {incidentDetails.initiator}</p>
            <p>Приоритет: {incidentDetails.priority}</p>
            <p>Описание: {incidentDetails.description}</p>
        </div>
    );
};

export default IncidentDetails;
