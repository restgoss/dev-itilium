import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, AnimateSharedLayout } from 'framer-motion';
import cross from '../../utils/images/white_cross.png';
import ServiceSelection from './ServiceSelection';
import api from '../../utils/Api';
import TypeInStep from './TypeInStep';
import Result from './Result.js';
import { useNavigate } from 'react-router-dom';

export default function IncidentPopup({ isPopupOpened, setPopupOpened, fetchIncidents }) {
    const popupRef = useRef(null);

    const [componentIsLoading, setComponentLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [success, setSuccess] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setLoading] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [componentList, setComponentList] = useState([]);
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [topic, setTopic] = useState(null);
    const [description, setDescription] = useState(null);
    const [filesArray, setFilesArray] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                handleClosePopup();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleNextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    const handlePrevStep = () => {
        if (selectedComponent) {
            setSelectedComponent(selectedComponent);
        }
        setCurrentStep(currentStep - 1);
    };

    const handleClosePopup = () => {
        setPopupOpened(false);
        setSelectedService(null);
        setSelectedComponent(null);
        setTopic(null);
        setDescription(null);
        setErrorMessage(null);
        setCurrentStep(1);
        setComponentLoading(false);
        setLoading(false);
        setComponentList(null);
        fetchIncidents();
        navigate('/profile');
    };

    const handleSubmit = async (e, filesArray) => {
        e.preventDefault();
        setLoading(true);
        try {
            const iniciatorUuid = localStorage.getItem('currentIniciatorUuid');
            const clientUuid = localStorage.getItem('currentClientUuid');
            const token = localStorage.getItem('jwt');
            const body = {
                Action: "RegisterIncident",
                ClientUuid: `${clientUuid}`,
                InitiatorUuid: `${iniciatorUuid}`,
                Topic: `${topic}`,
                Data: '12.12.2023 12:13:14',
                Description: `${description}`,
                ServiceUuid: `${selectedService.ServiceUuid}`,
                CompositionServiceUuid: `${selectedComponent.ServiceComponentUuid}`,
                Files: filesArray
            }
            console.log(body)
            const res = await api.addNewIncident(token, body);
            setSuccess(true);
            setCurrentStep(3);
        } catch (error) {
            setSuccess(false);
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        const fetchServiceComponentList = async () => {
            try {
                setComponentLoading(true);
                const token = localStorage.getItem('jwt');
                const res = await api.fetchServiceComponent(token, selectedService.ServiceUuid);
                setComponentList(res.ServiceComponents);
            } catch (error) {
                console.log(error);
            } finally {
                setComponentLoading(false);
            }
        };
        setSelectedComponent(null);
        if (selectedService) {
            fetchServiceComponentList();
        }
    }, [selectedService]);

    useEffect(() => {
        if (selectedComponent) {
            setTopic(selectedComponent.ServiceComponent);
        }
    }, [selectedComponent]);

    return (
        <>
            <AnimatePresence>
                {isPopupOpened && (
                    <motion.div
                        className="incident-popup incident-popup_active"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, type: 'tween' }}

                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, type: 'tween' }}
                            key="incbodyanimatekey"
                            className="incident-popup__body"
                            ref={popupRef}
                        >
                            <button src={cross} onClick={() => handleClosePopup()} className="incident-popup__close-button"></button>
                            {currentStep === 1 && (
                                <>
                                    <p className="incident-popup__paragraph">С чем Вам нужна помощь?</p>
                                    <ServiceSelection
                                        selectedService={selectedService}
                                        selectedComponent={selectedComponent}
                                        componentList={componentList}
                                        setComponentList={setComponentList}
                                        setSelectedService={setSelectedService}
                                        setSelectedComponent={setSelectedComponent}
                                        componentIsLoading={componentIsLoading}
                                    />
                                    {errorMessage ? (
                                        <motion.span
                                            initial={{ y: 10 }}
                                            animate={{ y: 0 }}
                                            exit={{ y: -10 }}
                                            transition={{ duration: 0.3, type: 'tween' }}
                                            className="incident-popup__span-error"
                                        >
                                            {errorMessage}
                                        </motion.span>
                                    ) : null}
                                    <button
                                        onClick={() => {
                                            if (selectedComponent) {
                                                setErrorMessage(null);
                                                handleNextStep();
                                            } else {
                                                setErrorMessage('Выберите услугу');
                                            }
                                        }}
                                        className="incident-popup__button"
                                    >
                                        Далее
                                    </button>
                                </>
                            )}

                            {currentStep === 2 && (
                                <>
                                    <TypeInStep
                                        setDescription={setDescription}
                                        description={description}
                                        handlePrevStep={handlePrevStep}
                                        selectedService={selectedService}
                                        selectedComponent={selectedComponent}
                                        handleSubmit={handleSubmit}
                                        isLoading={isLoading}
                                        setFilesArray={setFilesArray}
                                    />
                                </>
                            )}

                            {currentStep === 3 && (
                                <>
                                    <Result success={success} />
                                    <button className="incident-popup__button" onClick={handleClosePopup}>
                                        На главную
                                    </button>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
