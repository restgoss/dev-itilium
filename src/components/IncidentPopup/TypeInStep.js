import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function TypeInStep({
  selectedService,
  selectedComponent,
  handlePrevStep,
  setDescription,
  handleSubmit,
  isLoading,
  description
}) {
  const [isEmpty, setIsEmpty] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setIsEmpty(true);
      return;
    }
    setIsEmpty(false);
    handleSubmit(e);
  };

  return (
    <>
      <button className="incident-popup__button-back" onClick={handlePrevStep}>
        &#8249;<span>Назад</span>
      </button>
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="incident-popup__form">
        <form className="incident-popup__form" onSubmit={handleFormSubmit}>
          <textarea
            className="incident-popup__textarea"
            id="description"
            placeholder="Подробно опишите,  с чем Вам нужна помощь..."
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
          {isEmpty && <p style={{ color: "red" }}>Поле не может быть пустым</p>}
          <button className="incident-popup__button" type="submit" disabled={isLoading}>
            {isLoading ? 'Отправка...' : 'Отправить'}
          </button>
        </form>
      </motion.div>
    </>
  );
}
