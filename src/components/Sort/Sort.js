import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import sort_up from '../../utils/images/sort-up.png';
import sort_down from '../../utils/images/sort-down.png';
import './Sort.css';

const Sort = ({ setSortOption, setTicketsInProgress, sortOption }) => {
    const [isSortOpened, setSortOpened] = useState(false);
    const [selectedSortOption, setSelectedSortOption] = useState(sortOption);
    const [showOnlyInProgress, setShowOnlyInProgress] = useState(true);
    const sortOptions = [
        { sortOption: 'newest', sortDescription: 'Сначала новые' },
        { sortOption: 'oldest', sortDescription: 'Сначала старые' },
        { sortOption: 'numberDecrement', sortDescription: 'По убыванию номера' },
        { sortOption: 'numberIncrement', sortDescription: 'По возрастанию номера' },
    ];

    const handleSortOptionChange = (option) => {
        setSelectedSortOption(option);
        setSortOption(option);
    };

    const handleCheckboxChange = (event) => {
        event.stopPropagation();
        setShowOnlyInProgress(event.target.checked);
        setTicketsInProgress(event.target.checked);
    };

    useEffect(() => {
        setSelectedSortOption(sortOption);
    }, [sortOption]);
    
    useEffect(() => {
        setSortOpened(false);
    }, [selectedSortOption]);

    useEffect(() => {
        setSortOpened(false);
    }, [showOnlyInProgress]);

    useEffect(() => {
        const handleOverlayClick = (event) => {
            const sortDiv = document.querySelector('.incident-sort__div');
            if (sortDiv && !sortDiv.contains(event.target)) {
                setSortOpened(false);
            }
        };
        if (isSortOpened) {
            document.addEventListener('click', handleOverlayClick);
        } else {
            document.removeEventListener('click', handleOverlayClick);
        }
        return () => {
            document.removeEventListener('click', handleOverlayClick);
        };
    }, [isSortOpened]);

    return (
        <>
            <motion.div
                key='sortbutton'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'tween', duration: 0.3 }}

                className='incident-sort__button'
                onClick={(event) => {
                    event.stopPropagation();
                    setSortOpened((prev) => !prev);
                }}
            >
                {isSortOpened ? (
                    <>
                        <p>Фильтр</p>
                        <img src={sort_up} alt='' style={{ width: '12px', height: '12px', marginLeft: '5px' }}></img>
                    </>
                ) : (
                    <>
                        <p>Фильтр</p>
                        <img src={sort_down} alt='' style={{ width: '12px', height: '12px', marginLeft: '5px' }}></img>
                    </>
                )}
            </motion.div>
            <AnimatePresence>
                {isSortOpened && (

                    <motion.fieldset
                        key='fieldset'
                        initial={{ height: 0 }}
                        animate={{ height: '250px' }}
                        exit={{ height: 0, opacity: 0, transition: {delay: .2} }}
                        transition={{ type: 'tween', duration: .3}}
                        className='incident-sort__div'>

                        {sortOptions.map((optionObj) => (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, display: 'none', height: 0 }}
                                transition={{delay: .2, type: 'spring', duration: .3 }}
                                key={optionObj.sortOption}
                                className={`incident-sort__item ${selectedSortOption === optionObj.sortOption ? 'incident-sort__item_active' : ''}`}
                                onClick={() => handleSortOptionChange(optionObj.sortOption)}
                            >
                                <input
                                    className="incident-sort__item__checkbox"
                                    type="radio"
                                    id={optionObj.sortOption}
                                    name="sortOption"
                                    checked={selectedSortOption === optionObj.sortOption}
                                    onChange={() => handleSortOptionChange(optionObj.sortOption)}
                                />
                                <p className="incident-sort__item__paragraph">{optionObj.sortDescription}</p>
                            </motion.div>
                        ))}
                        <motion.div 
                        initial={{ opacity: 0, visibility: 'none' }}
                        animate={{ opacity: 1, visibility: 'visible' }}
                        exit={{ opacity: 0, display: 'none'}}
                        transition={{ delay: .2, type: 'spring'}}
                        className="incident-sort__item" onClick={(event) => event.stopPropagation()}>
                            <p className="incident-sort__item__paragraph" style={{marginLeft: '0'}}>Показать только открытые</p>
                            <label className="switch">
                                <input type="checkbox" onChange={handleCheckboxChange} checked={showOnlyInProgress} />
                                <span className="slider round"></span>
                            </label>
                        </motion.div>
                    </motion.fieldset>

                )}
            </AnimatePresence>
        </>
    );
};

export default Sort;
