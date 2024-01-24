import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import sort_up from '../../utils/images/sort-up.png';
import sort_down from '../../utils/images/sort-down.png';
import './Sort.css';

const Sort = ({ setSortOption, setTicketsInProgress }) => {
    const [isSortOpened, setSortOpened] = useState(false);
    const [selectedSortOption, setSelectedSortOption] = useState('newest');
    const [showOnlyInProgress, setShowOnlyInProgress] = useState(true);
    const sortOptions = [
        { sortOption: 'newest', sortDescription: 'Сначала недавние' },
        { sortOption: 'oldest', sortDescription: 'Сначала старые' },
        { sortOption: 'numberIncrement', sortDescription: 'По возрастанию номера' },
        { sortOption: 'numberDecrement', sortDescription: 'По убыванию номера' },
    ];

    const handleSortOptionChange = (option) => {
        setSelectedSortOption(option);
        setSortOption(option);
        setSortOpened(false);
    };

    const handleCheckboxChange = (event) => {
        event.stopPropagation();
        setShowOnlyInProgress(event.target.checked);
        setTicketsInProgress(event.target.checked);
    };

    useEffect(() => {
        setSortOpened(false);
    }, [selectedSortOption]);

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
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0}}
                    animate={{ opacity: 1}}
                    exit={{ opacity: 0}}
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

                {isSortOpened && (
                    <motion.fieldset
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ type: 'spring', duration: 0.4 }}
                        className='incident-sort__div'
                        exitBeforeEnter={false}>
                        
                        {sortOptions.map((optionObj) => (
                            <div
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
                            </div>
                        ))}
                        <div className="incident-sort__item" onClick={(event) => event.stopPropagation()}>
                            <p className="incident-sort__item__paragraph">Отображать заявки только в работе</p>
                            <label className="switch">
                                <input type="checkbox" onChange={handleCheckboxChange} checked={showOnlyInProgress} />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </motion.fieldset>

                )}
            </AnimatePresence>
        </>
    );
};

export default Sort;
