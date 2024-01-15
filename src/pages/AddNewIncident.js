import React, { useState, useEffect, useRef } from "react";
import cross from '../utils/images/cross.svg';
import { Services } from "../utils/Constants";
import api from "../utils/Api";
import loading from '../utils/images/loading.gif';
import error from '../utils/images/error.png';
import success from '../utils/images/success.png';

function AddNewIncident({ isPopupOpened, setPopupOpened }) {
    const [selectedServiceLoading, setSelectedServiceLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);

    const [selectedServiceUuid, setSelectedServiceUuid] = useState('');
    const [selectedServiceComponents, setSelectedServiceComponents] = useState([]);
    const [selectedServiceComponent, setSelectedServiceComponent] = useState();
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
        window.location.reload();
        setTopic('');
        setDescription('');
        setPopupOpened(false);
        setSuccessMessage(false);
    };

    useEffect(() => {
        if (selectedServiceComponent) {
            setTopic(selectedServiceComponent.ServiceComponent);
        }
    }, [selectedServiceComponent]);


    useEffect(() => {
        const fetchSelectedService = async () => {
            setSelectedServiceLoading(true);
            try {
                const token = localStorage.getItem('jwt');
                const res = await api.fetchServiceComponent(token, selectedServiceUuid);
                setSelectedServiceComponents(res.ServiceComponents);
            } catch (error) {
                console.log(error);
            } finally {
                setSelectedServiceLoading(false);
            }
        };

        if (selectedServiceUuid) {
            fetchSelectedService();
        }
    }, [selectedServiceUuid]);

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
                        "UID": `${selectedServiceUuid}`
                    }
                }
            };
            const res = await api.addNewIncident(token, body);
        } catch (error) {
            console.log(error);
        } finally {
            setCurrentStep(2);
            setIsLoading(false);
            setSuccessMessage(true);
            const token = localStorage.getItem('jwt');
            const iniciatorUuid = localStorage.getItem('currentIniciatorUuid');
            const res = await api.getIncidents(token, iniciatorUuid);
        }
    };
    return (
        <>
            <div className={isPopupOpened ? `incident-popup incident-popup_active` : `incident-popup`}>
                <div className="incident-popup__body">
                    <button src={cross} onClick={() => setPopupOpened(false)} className="incident-popup__close-button"></button>
                    {currentStep === 0 && (
                        <>
                            <p className="incident-popup__paragraph">Выберите услугу из списка:</p>
                            <div id="servicesContainer1"
                                className="incident-popup__services-div">
                                {Services.map((item) => (

                                    <div className={selectedServiceUuid === item.ServiceUuid ? `incident-popup__services-item incident-popup__services-item_active` : `incident-popup__services-item`} key={item.ServiceUuid} onClick={() => setSelectedServiceUuid(item.ServiceUuid)}>
                                        <p>{item.Service}</p>
                                    </div>

                                ))}
                            </div>
                            {selectedServiceLoading ? (
                                <div className="incident-popup__loading">
                                    <img className="incident-popup__services-loading" src={loading} alt="Loading"></img>
                                </div>
                            ) : (
                                selectedServiceComponents.length > 0 ? (
                                    <>
                                        <p className="incident-popup__paragraph">С чем вам нужна помощь?</p>
                                        <div id="servicesContainer2"
                                            className="incident-popup__services-div">
                                            {selectedServiceComponents.map((item) => (
                                                <div className={selectedServiceComponent && selectedServiceComponent.ServiceComponentUuid === item.ServiceComponentUuid ? `incident-popup__services-item incident-popup__services-item_active` : `incident-popup__services-item`} key={item.ServiceComponent} onClick={() => setSelectedServiceComponent(item)}>
                                                    <p>{item.ServiceComponent}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : null
                            )}
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
                                        <p className="incident-popup__paragraph">Выбранная услуга: <span>{selectedServiceComponent.ServiceComponent}</span></p>
                                        <button className="incident-popup__button-back" onClick={handlePrevStep}>🡄</button>
                                        <form className="incident-popup__form" onSubmit={(e) => handleSubmit(e)}>
                                            <p className="incident-popup__paragraph">Описание:</p>
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
                                    <button className="incident-popup__button" onClick={handleClosePopup}>В профиль</button>
                                </>
                            ) : (
                                <>
                                    <img className="incident-popup__img" src={error} alt=""></img>
                                    <p className="incident-popup__success">Произошла ошибка.</p>
                                    <p className="incident-popup__success">Ваше обращение не было зарегистрировано, попробуйте позже.</p>
                                    <button className="incident-popup__button" onClick={handleClosePopup}>В профиль</button>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div >
        </>

    )
}
export default AddNewIncident;
