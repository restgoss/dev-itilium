import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TextareaAutosize from 'react-textarea-autosize';
import loading from '../../utils/images/loading.gif';
import Select from 'react-select';
import api from '../../utils/Api';
import back from '../../utils/images/back.svg';

export default function ReworkTypeInStep({
    selectedService,
    selectedComponent,
    handlePrevStep,
    setCurrentStep,
    setSuccess
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [finMethriksOptions, setFinMethriksOptions] = useState([]);
    const [uprRiskMethriksOptions, setUprRiskMethriksOptions] = useState([]);
    const [ohvatMethriksOptions, setOhvatMethriksOptions] = useState([]);
    const [interesantMethriksOptions, setInteresantMethriksOptions] = useState([]);
    const [topic, setTopic] = useState('');
    const [description, setDescription] = useState('');
    const [methriksDescription, setMethriksDescription] = useState('');
    const [selectedOptions, setSelectedOptions] = useState({
        FinmethriksUuid: null,
        UprRiskmethriksUuid: null,
        OhvatmethriksUuid: null,
        InteresantmethriksUuid: null
    });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const token = localStorage.getItem('jwt');
            const body = {
                "Topic": topic,
                "Data": "12.12.2023 12:13:14",
                "Description": description,
                "MembershipServices": {
                    "UID": selectedComponent.ServiceComponentUuid,
                    "Service": {
                        "UID": selectedService.ServiceUuid,
                    }
                },
                "FinmethriksUuid": selectedOptions.FinmethriksUuid.value,
                "UprRiskmethriksUuid": selectedOptions.UprRiskmethriksUuid.value,
                "OhvatmethriksUuid": selectedOptions.OhvatmethriksUuid.value,
                "InteresantmethriksUuid": selectedOptions.InteresantmethriksUuid.value,
                "IniciatorsComm": methriksDescription
            }
            const res = await api.addNewIncidentMobile(token, body);
            setSuccess(true);
            setCurrentStep(3);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    const fetchOptions = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('jwt');
            const res = await api.fetchOptions(token);
            setFinMethriksOptions(res.Fin_methriks.map(option => ({
                value: option.FinmethriksUuid,
                label: option.Finmethriks
            })));
            setUprRiskMethriksOptions(res.UprRisk_methriks.map(option => ({
                value: option.UprRiskmethriksUuid,
                label: option.UprRiskmethriks
            })));
            setOhvatMethriksOptions(res.Ohvat_methriks.map(option => ({
                value: option.OhvatmethriksUuid,
                label: option.Ohvatkmethriks
            })));
            setInteresantMethriksOptions(res.Interesant_methriks.map(option => ({
                value: option.InteresantmethriksUuid,
                label: option.Interesantmethriks
            })));
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleSelectChange = (value, key) => {
        setSelectedOptions(prevOptions => ({
            ...prevOptions,
            [key]: value
        }));
    };

    useEffect(() => {
        fetchOptions();
    }, []);

    const selectStyles = {
        control: (baseStyles) => ({
            ...baseStyles,
            width: '350px',
            fontFamily: 'Circe',
        }),
        valueContainer: (baseStyles) => ({
            ...baseStyles,
            padding: '0px',
            fontFamily: 'Circe',
        }),
        container: (baseStyles) => ({
            ...baseStyles,
            marginBottom: '15px',
            fontFamily: 'Circe',
        }),
        menu: (baseStyles) => ({
            ...baseStyles,
            fontSize: '14px',
            fontFamily: 'Circe',
        }),
        placeholder: (baseStyles) => ({
            ...baseStyles,
            fontSize: '14px',
            textAlign: 'left',
            marginLeft: '15px',
            fontFamily: 'Circe',
        }),
        singleValue: (baseStyles) => ({
            ...baseStyles,
            fontSize: '14px',
            fontFamily: 'Circe',
        }),
    };

    return (
        <>
            <img src={back} className="incident-popup__button-back" onClick={handlePrevStep} alt="Back"></img>
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="incident-popup__text-block">
                        <p className="incident-popup__paragraph">Выбранная услуга:</p>
                        <p className="incident-popup__paragraph">
                            <span>
                                {selectedService?.Service} — {selectedComponent?.ServiceComponent}
                            </span>
                        </p>
                    </motion.div>
                    <motion.form 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className='incident-popup__1c-form' onSubmit={onSubmit}>
                        <div className='incident-popup__select-block'>
                            <div className='incident-popup__select-div'>
                                <Select
                                    isSearchable={false}
                                    options={finMethriksOptions}
                                    placeholder="Выберите финансовую метрику"
                                    onChange={(value) => handleSelectChange(value, "FinmethriksUuid")}
                                    styles={selectStyles}
                                    required
                                />
                                <Select
                                    isSearchable={false}
                                    options={uprRiskMethriksOptions}
                                    placeholder="Выберите управленческий риск"
                                    onChange={(value) => handleSelectChange(value, "UprRiskmethriksUuid")}
                                    styles={selectStyles}
                                    required
                                />
                                <Select
                                    isSearchable={false}
                                    options={ohvatMethriksOptions}
                                    placeholder="Выберите охват метрики"
                                    onChange={(value) => handleSelectChange(value, "OhvatmethriksUuid")}
                                    styles={selectStyles}
                                    required
                                />
                                <Select
                                    isSearchable={false}
                                    options={interesantMethriksOptions}
                                    placeholder="Выберите интересующую сторону"
                                    onChange={(value) => handleSelectChange(value, "InteresantmethriksUuid")}
                                    styles={selectStyles}
                                    required
                                />
                            </div>
                            <TextareaAutosize
                                maxRows={9}
                                required
                                type="text"
                                className="incident-popup__input"
                                value={methriksDescription}
                                placeholder='Комментарий к метрикам'
                                onChange={(e) => setMethriksDescription(e.target.value)}>
                            </TextareaAutosize >
                        </div>
                        <div className='incident-popup__input-block'>
                            <p className="incident-popup__paragraph" style={{ marginBottom: '15px' }}>Тема:</p>
                            <input
                                style={{ minHeight: '0px', width: '100%' }}
                                required
                                className="incident-popup__input"
                                value={topic}
                                placeholder='Тема обращения'
                                onChange={(e) => setTopic(e.target.value)}>
                            </input >
                            <p className="incident-popup__paragraph" style={{ marginBottom: '15px', marginTop: '30px' }}>Описание:</p>
                            <TextareaAutosize
                                style={{ marginBottom: '30px' }}
                                maxRows={8}
                                required
                                type="text"
                                className="incident-popup__input"
                                value={description}
                                placeholder='Описание обращения'
                                onChange={(e) => setDescription(e.target.value)}>
                            </TextareaAutosize >

                        </div>
                        <button className="incident-popup__button" type="submit" disabled={isLoading}>
                            {isLoading ? 'Отправка...' : 'Отправить'}
                        </button>
                    </motion.form>
                </>
        </>
    );
}
