import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import red_cross from '../../utils/images/red_cross.png';
export default function TypeInStep({
  selectedService,
  selectedComponent,
  handlePrevStep,
  setDescription,
  handleSubmit,
  isLoading,
  description,
  setFilesArray
}) {
  const MAX_FILE_SIZE_MB = 5;
  const [isEmpty, setIsEmpty] = useState(false);
  const [fileBase64List, setFileBase64List] = useState([]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!description.trim() || fileBase64List.length === 0) {
      setIsEmpty(true);
      return;
    }
    setIsEmpty(false);
    const filesArray = fileBase64List.map(file => ({
      Name: file.name,
      Data: file.base64Content
    }));
    handleSubmit(e, filesArray);
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    const newFiles = Array.from(files).filter(file => file.size <= MAX_FILE_SIZE_MB * 1024 * 1024);

    if (newFiles.length !== files.length) {
      alert(`Один или несколько файлов слишком большие. Максимальный размер файла: ${MAX_FILE_SIZE_MB} MB`);
    }

    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        const base64Content = base64String.split(',')[1];
        setFileBase64List(prevList => [...prevList, { name: file.name, base64Content }]);
      };
      reader.readAsDataURL(file);
    });
    console.log(newFiles);
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="incident-popup__form">
        <form className="incident-popup__form" onSubmit={handleFormSubmit}>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ margin: '20px 0 0 0' }}
            className="incident-popup__paragraph">Вложенные файлы:</motion.p>
          {fileBase64List.length > 0 ? (
            <div className='incident-popup__area'>
              {fileBase64List.map((file, index) => (
                <div key={index} className='incident-popup__pinned-file'>
                  <span>{file.name}</span>
                  <img onClick={() => setFileBase64List(prevList => prevList.filter((_, i) => i !== index))} className='incident-popup__area__cross' alt='' src={red_cross}></img>
                </div>
              ))}
            </div>
          ) : (
            <>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ fontWeight: 'normal', margin: '15px 0 15px 0' }}
                className="incident-popup__paragraph">Вы не прикрепили ни одного файла.</motion.p>
            </>
          )}
          <div className='incident-popup__pinarea'>
            <label className="messenger__add-file">
              <input type='file' onChange={handleFileChange} multiple />
            </label>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="incident-popup__paragraph" style={{ marginTop: '70px', marginBottom: '15px' }}>Описание:</motion.p>
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
