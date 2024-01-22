import React, { useEffect, useState } from 'react';
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
    }, [selectedSortOption])

    return (
        <div
            className={isSortOpened ? 'incident-sort__div' : 'incident-sort__button'}
            onClick={() => setSortOpened((prev) => !prev)}
        >
            {isSortOpened ? (
                <fieldset>
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
                </fieldset>
            ) : (
                <p className="incident-sort__button_paragraph">Фильтр</p>
            )}
        </div>
    );
};

export default Sort;
