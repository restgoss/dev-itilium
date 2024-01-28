import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion"
import cross from '../utils/images/cross.svg';
import { Services } from "../utils/Constants";
import api from "../utils/Api";
import loading from '../utils/images/loading.gif';
import error from '../utils/images/error.png';
import success from '../utils/images/success.png';

function AddNewIncident({ isPopupOpened, setPopupOpened }) {
    const [successMessage, setSuccessMessage] = useState(false);
    const [selectedService, setSelectedService] = useState('');
    const [selectedServiceComponents, setSelectedServiceComponents] = useState([]);
    const [selectedServiceComponent, setSelectedServiceComponent] = useState('');
    const [step2Error, setStep2Error] = useState('');
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const handleNextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    const handlePrevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const [topic, setTopic] = useState('');
    const [description, setDescription] = useState('');
    const handleClosePopup = () => {
        setCurrentStep(0);
        setTopic('');
        setDescription('');
        setSelectedService('');
        setSelectedServiceComponents('');
        setSelectedServiceComponent('');
        setPopupOpened(false);
        setSuccessMessage(false);
    };

    useEffect(() => {
        if (selectedServiceComponent) {
            setTopic(selectedServiceComponent.ServiceComponent);
        }
    }, [selectedServiceComponent]);

    useEffect(() => {
        const handleOverlayClick = (event) => {
            const div = document.querySelector('.incident-popup_active');
            if (div && !div.contains(event.target)) {
                setPopupOpened(false);
            }
        };
        if (isPopupOpened) {
            document.addEventListener('click', handleOverlayClick);
        } else {
            document.removeEventListener('click', handleOverlayClick);
        }
        return () => {
            document.removeEventListener('click', handleOverlayClick);
        };
    }, [isPopupOpened]);

    useEffect(() => {
        const fetchSelectedService = async () => {
            try {
                const token = localStorage.getItem('jwt');
                const res = await api.fetchServiceComponent(token, selectedService.ServiceUuid);
                setSelectedServiceComponents(res.ServiceComponents);
            } catch (error) {
                console.log(error);
            } finally {
            }
        };
        setSelectedServiceComponent('');
        if (selectedService) {
            fetchSelectedService();
        }
    }, [selectedService]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const token = localStorage.getItem('jwt');
            const body = {
                "Topic": `${topic}`,
                "Data": "12.12.2023 12:13:14",
                "Description": `${description}`,
                "MembershipServices": {
                    "UID": `${selectedServiceComponent.ServiceComponentUuid}`,
                    "Service": {
                        "UID": `${selectedService.ServiceUuid}`
                    }
                }
            };
            const res = await api.addNewIncident(token, body);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
            setSuccessMessage(true);
            const token = localStorage.getItem('jwt');
            const iniciatorUuid = localStorage.getItem('currentIniciatorUuid');
            const res = await api.getIncidents(token, iniciatorUuid);
            handleClosePopup();
        }
    };
    return (
        <>
            <AnimatePresence>
                <div className={isPopupOpened ? `incident-popup incident-popup_active` : `incident-popup`}>
                    <motion.div
                        key='incident-layout'
                        animate={{ height: 'auto' }}
                        className="incident-popup__body">
                        <button src={cross} onClick={() => handleClosePopup()} className="incident-popup__close-button"></button>
                        {currentStep === 0 && (
                            <>
                                <p className="incident-popup__paragraph">С чем Вам нужна помощь?</p>
                                <motion.div
                                key='service-container'
                                    animate={{ height: 'auto' }}
                                    id="servicesContainer1"
                                    className="incident-popup__services-div">
                                    {Services.map((item) => (
                                        <>
                                            <div
                                                className={
                                                    selectedService.ServiceUuid === item.ServiceUuid
                                                        ? `incident-popup__services-item incident-popup__services-item_active`
                                                        : selectedService.ServiceUuid && selectedService.ServiceUuid !== item.ServiceUuid
                                                            ? `incident-popup__services-item incident-popup__services-item_inactive`
                                                            : `incident-popup__services-item`
                                                }
                                                key={item.ServiceUuid}
                                                onClick={() => setSelectedService(item)}
                                            >
                                                <p>{item.Service}</p>
                                            </div>
                                        </>
                                    ))}
                                </motion.div>
                                <span className="incident-popup__span-error">{step2Error}</span>
                                <button className="incident-popup__button" onClick={() => {
                                    if (selectedServiceComponent) {
                                        setStep2Error('');
                                        handleNextStep();
                                    } else {
                                        setStep2Error('Выберите услугу');
                                    }
                                }}> Далее</button>
                            </>
                        )}
                        {currentStep === 1 && (
                            <>
                                {isLoading ?
                                    (<>
                                        <div className="incident-popup__loading">
                                            <img className="incident-popup__services-loading" src={loading} alt="Loading"></img>
                                        </div>
                                    </>) : (
                                        <>
                                            <button className="incident-popup__button-back" onClick={handlePrevStep}>&#8249;</button>
                                            <div className="incident-popup__text-block">
                                                <p className="incident-popup__paragraph">Выбранная услуга: <span>{selectedService.Service} — {selectedServiceComponent.ServiceComponent}</span></p>
                                            </div>
                                            <p className="incident-popup__paragraph" style={{ marginTop: '115px', marginBottom: '15px' }}>Описание:</p>
                                            <form className="incident-popup__form" onSubmit={(e) => handleSubmit(e)}>
                                                <input id="description" placeholder="Описание обращения" onChange={(e) => setDescription(e.target.value)} required></input>
                                                <button className="incident-popup__button">Отправить</button>
                                            </form>
                                        </>
                                    )}

                            </>
                        )}
                        {currentStep === 2 && (
                            <>
                                {successMessage ? (
                                    <>
                                        <img className="incident-popup__img" src={success} alt=""></img>
                                        <p className="incident-popup__success">Обращение успешно зарегистрировано!</p>
                                        <button className="incident-popup__button" onClick={handleClosePopup}>На главную</button>
                                    </>
                                ) : (
                                    <>
                                        <img className="incident-popup__img" src={error} alt=""></img>
                                        <p className="incident-popup__success">Произошла ошибка.</p>
                                        <p className="incident-popup__success">Ваше обращение не было зарегистрировано, попробуйте позже.</p>
                                        <button className="incident-popup__button" onClick={handleClosePopup}>На главную</button>
                                    </>
                                )}
                            </>
                        )}
                    </motion.div>
                </div>
            </AnimatePresence>
        </>

    )
}
export default AddNewIncident;
