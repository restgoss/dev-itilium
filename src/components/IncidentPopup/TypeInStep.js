import { AnimatePresence, motion } from "framer-motion";

export default function TypeInStep({
  selectedService,
  selectedComponent,
  handlePrevStep,
  setDescription,
  handleSubmit
}) {
  return (
    <>
      <button className="incident-popup__button-back" onClick={handlePrevStep}>&#8249;<span>Назад</span></button>
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
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="incident-popup__paragraph" style={{ marginTop: '70px', marginBottom: '15px' }}>Описание:</motion.p>
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="incident-popup__form" onSubmit={(e) => handleSubmit(e)}>
        <input
          id="description"
          placeholder="Описание обращения"
          onChange={(e) => setDescription(e.target.value)}
          required
        ></input>
        <button className="incident-popup__button">Отправить</button>
      </motion.form>
    </>
  );
}
