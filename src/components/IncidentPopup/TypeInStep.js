export default function TypeInStep({ selectedService, selectedComponent, handlePrevStep, setDescription, handleSubmit }) {
    return (
        <>
            <button className="incident-popup__button-back" onClick={handlePrevStep}>&#8249;</button>
            <div className="incident-popup__text-block">
                <p className="incident-popup__paragraph">Выбранная услуга: <span>{selectedService.Service} — {selectedComponent.ServiceComponent}</span></p>
            </div>
            <p className="incident-popup__paragraph" style={{ marginTop: '115px', marginBottom: '15px' }}>Описание:</p>
            <form className="incident-popup__form" onSubmit={(e) => handleSubmit(e)}>
                <input id="description" placeholder="Описание обращения" onChange={(e) => setDescription(e.target.value)} required></input>
                <button className="incident-popup__button">Отправить</button>
            </form>
        </>
    )
}