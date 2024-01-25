import './Search.css';
import { useState } from "react"

export default function Search() {
    const [inputValue, setInputValue] = useState('');
    return(
        <>
            <div className="incident-list__search__div">
                <input className="incident-list__search__input" onChange={(e) => setInputValue(e.target.value)} placeholder='Поиск' disabled></input>
                <img className='incident-list__search__image'></img>
            </div>
        </>
    )
}