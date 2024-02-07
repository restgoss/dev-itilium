import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import sort_up from '../../utils/images/sort-up.png';
import sort_down from '../../utils/images/sort-down.png';
import './Sort.css';

const Sort = ({ setTicketsInProgress, ticketsInProgress }) => {
    const [showOnlyInProgress, setShowOnlyInProgress] = useState(true);

    const handleCheckboxChange = (event) => {
        setShowOnlyInProgress(!event.target.checked);
        setTicketsInProgress(!event.target.checked);
    };

    const handleSortDivClick = () => {
        setShowOnlyInProgress(!showOnlyInProgress);
        setTicketsInProgress(!showOnlyInProgress);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, visibility: 'none' }}
                animate={{ opacity: 1, visibility: 'visible' }}
                exit={{ opacity: 0, display: 'none' }}
                transition={{ delay: .2, type: 'spring' }}
                className="incident-sort__item"
                onClick={handleSortDivClick}
            >
                <p className="incident-sort__item__paragraph" style={{ marginLeft: '0' }}>Показать только открытые</p>
                <label className="switch">
                    <input type="checkbox" onChange={handleCheckboxChange} checked={showOnlyInProgress} />
                    <span className="slider round"></span>
                </label>
            </motion.div>
        </>
    );
};

export default Sort;
