import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import cross from '../../utils/images/white_cross.png';
import ServiceSelection from './ServiceSelection';
import api from '../../utils/Api';
import TypeInStep from './TypeInStep';
export default function IncidentPopup({ isPopupOpened, setPopupOpened }) {

    const [componentIsLoading, setComponentLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const [currentStep, setCurrentStep] = useState(1);

    const [selectedService, setSelectedService] = useState(null);

    const [componentList, setComponentList] = useState([]);

    const [selectedComponent, setSelectedComponent] = useState(null);

    const [topic, setTopic] = useState(null);
    const [description, setDescription] = useState(null);


    const handleNextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    const handlePrevStep = () => {
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
        setComponentList(null);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('jwt');
            const body = {
                "Topic": `${topic}`,
                "Data": "12.12.2023 12:13:14",
                "Description": `${description}`,
                "MembershipServices": {
                    "UID": `${selectedComponent.ServiceComponentUuid}`,
                    "Service": {
                        "UID": `${selectedService.ServiceUuid}`
                    }
                }
            };
            const res = await api.addNewIncident(token, body);
        } catch (error) {
            console.log(error);
        } finally {
            const token = localStorage.getItem('jwt');
            const iniciatorUuid = localStorage.getItem('currentIniciatorUuid');
            const res = await api.getIncidents(token, iniciatorUuid);
            handleClosePopup();
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
                        className='incident-popup incident-popup_active'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, type: 'tween' }}>
                        <motion.div className="incident-popup__body"
                        >
                            <button src={cross} onClick={() => handleClosePopup()} className="incident-popup__close-button"></button>
                            {currentStep === 1 && (
                                <>
                                <p className="incident-popup__paragraph">С чем вам нужна помощь?</p>
                                    <ServiceSelection
                                        selectedService={selectedService}
                                        selectedComponent={selectedComponent}
                                        componentList={componentList}
                                        setComponentList={setComponentList}
                                        setSelectedService={setSelectedService}
                                        setSelectedComponent={setSelectedComponent}
                                        componentIsLoading={componentIsLoading}
                                    />
                                    {errorMessage ? <motion.span
                                        initial={{ y: 10 }}
                                        animate={{ y: 0 }}
                                        exit={{ y: -10 }}
                                        transition={{ duration: .3, type: 'tween' }}
                                        className='incident-popup__span-error'>{errorMessage}</motion.span> : null}
                                    <button onClick={() => {
                                        if (selectedComponent) {
                                            setErrorMessage(null);
                                            handleNextStep();
                                        } else {
                                            setErrorMessage('Выберите услугу');
                                        }
                                    }} className="incident-popup__button">Далее</button>
                                </>
                            )}

                            {currentStep === 2 && (
                                <>
                                    <TypeInStep
                                        setDescription={setDescription}
                                        handlePrevStep={handlePrevStep}
                                        selectedService={selectedService}
                                        selectedComponent={selectedComponent}
                                        handleSubmit={handleSubmit}
                                    />
                                </>
                            )}
                        </motion.div>





                    </motion.div>
                )}
            </AnimatePresence>



        </>
    )
}