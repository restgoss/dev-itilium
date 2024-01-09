import React, { useState, useEffect, useRef } from "react";
import cross from '../utils/images/cross.svg';
import { Services } from "../utils/Constants";
import api from "../utils/Api";
import loading from '../utils/images/loading.gif';
import success from '../utils/images/success.png';

function AddNewIncident({ isPopupOpened, setPopupOpened }) {
    const [selectedServiceLoading, setSelectedServiceLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);

    const [selectedServiceUuid, setSelectedServiceUuid] = useState('');
    const [selectedServiceComponents, setSelectedServiceComponents] = useState([]);
    const [selectedServiceComponent, setSelectedServiceComponent] = useState();

    const [topic, setTopic] = useState('');
    const [description, setDescription] = useState('');
    const handleClosePopup = () => {
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
            setSuccessMessage(true);
        }
    };

    const servicesContainerRef1 = useRef(null);
    const servicesContainerRef2 = useRef(null);

    const handleWheelScroll = (e, containerId) => {
        const container = document.getElementById(containerId);
        if (container) {
            container.scrollLeft += e.deltaY;
        }
    };

    return (
        <>
            <div className={isPopupOpened ? `incident-popup incident-popup_active` : `incident-popup`}>
                <button src={cross} onClick={() => setPopupOpened(false)} className="incident-popup__close-button"></button>
                <div className="incident-popup__body">
                    {successMessage ? (
                        <>
                            <img className="incident-popup__img" src={success} alt=""></img>
                            <p className="incident-popup__success">Обращение успешно зарегистрировано!</p>
                            <button className="incident-popup__button" onClick={handleClosePopup}>В профиль</button>
                        </>
                    ) : (
                        <>
                            <div id="servicesContainer1"
                                ref={servicesContainerRef1}
                                className="incident-popup__services-div"
                                onWheel={(e) => handleWheelScroll(e, "servicesContainer1")}>
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

                                    <div id="servicesContainer2"
                                        ref={servicesContainerRef2}
                                        className="incident-popup__services-div"
                                        onWheel={(e) => handleWheelScroll(e, "servicesContainer2")}>
                                        {selectedServiceComponents.map((item) => (
                                            <div className={selectedServiceComponent && selectedServiceComponent.ServiceComponentUuid === item.ServiceComponentUuid ? `incident-popup__services-item incident-popup__services-item_active` : `incident-popup__services-item`} key={item.ServiceComponent} onClick={() => setSelectedServiceComponent(item)}>
                                                <p>{item.ServiceComponent}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : null
                            )}
                            <form className="incident-popup__form" onSubmit={(e) => handleSubmit(e)}>
                                <p>Тема обращения</p>
                                <input id="topic" placeholder="Тема обращения" value={topic} onChange={(e) => setTopic(e.target.value)}></input>
                                <p>Описание</p>
                                <input id="description" placeholder="Описание обращения" onChange={(e) => setDescription(e.target.value)} required></input>
                                <button>Отправить</button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default AddNewIncident;
