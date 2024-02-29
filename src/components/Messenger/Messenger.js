import './Messenger.css';
import loading from '../../utils/images/loading.gif';
import send from '../../utils/images/send.png';
import red_cross from '../../utils/images/red_cross.png';
import { useState, useEffect, useRef } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import TextareaAutosize from 'react-textarea-autosize';
import { motion } from 'framer-motion';
import "overlayscrollbars/styles/overlayscrollbars.css";
import Message from './Message';
import api from '../../utils/Api';

export default function Messenger({ messageHistory, selectedIncidentUuid, fetchSelectedIncident, isIncidentClosed }) {
    const MAX_FILE_SIZE_MB = 5;
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [fileBase64List, setFileBase64List] = useState([]);
    const reversedMessageHistory = [...messageHistory].reverse();

    const handleSendMessage = () => {
        if (inputValue || fileBase64List.length > 0) {
            try {
                setLoading(true);
                const token = localStorage.getItem('jwt');
                const fileData = fileBase64List.map(file => ({ Name: file.name, Data: file.base64Content }));
                const res = api.addNewFile(token, selectedIncidentUuid, fileData, inputValue);
                setTimeout(() => {
                    fetchSelectedIncident();
                }, 600);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
                setInputValue('');
                setFileBase64List([]);
            }
        };
    }

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
    };
    

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setInputValue(prevValue => {
                if (prevValue.endsWith('\n')) {
                    return prevValue;
                } else {
                    return prevValue + '\n';
                }
            });
        }
    };

    useEffect(() => {
        if (inputValue === '') {
            const interval = setInterval(() => {
                fetchSelectedIncident();
            }, 60000);
    
            return () => clearInterval(interval);
        }
    }, [inputValue, fetchSelectedIncident]);
    

    return (
        <>
            <div className="messenger__div">
                <div className='messenger__field'>
                    <OverlayScrollbarsComponent
                        id='messenger__block'
                        options={{ scrollbars: { autoHide: "leave" } }}
                        style={{ maxHeight: '100%', display: 'flex' }}
                        events={{
                            initialized: (instance) => {
                              instance.elements().viewport.scrollTo(9999, 9999);
                            },
                          }}
                    >
                        {reversedMessageHistory.map((item, index) => {
                            return <Message key={item + index} message={item} />
                        })}
                    </OverlayScrollbarsComponent>
                </div>
                <motion.div className="messenger__input-div">
                    <div className="messenger__input-area">
                        <div className='messenger__type-in'>
                            <label className="messenger__add-file" style={{ display: isIncidentClosed ? 'none' : null }}>
                                <input type='file' onChange={handleFileChange} style={{ display: isIncidentClosed ? 'none' : null }} multiple />
                            </label>
                            <TextareaAutosize
                                style={{ marginLeft: isIncidentClosed ? '20px' : null }}
                                maxRows={25}
                                required
                                type="text"
                                className="messenger__input"
                                value={inputValue}
                                placeholder={isIncidentClosed ? 'Заявка закрыта, отправка сообщений ограничена.' : 'Напишите сообщение...'}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyPress}
                                disabled={isIncidentClosed}>
                            </TextareaAutosize >
                            <button className='messenger__send' src={isLoading ? loading : send} alt='' onClick={handleSendMessage} />
                        </div>
                        {fileBase64List.length > 0 && (
                            <div className='messenger__area'>
                                {fileBase64List.map((file, index) => (
                                    <div key={index} className='messenger__pinned-file'>
                                        Файл во вложении: <span>{file.name}</span>
                                        <img onClick={() => setFileBase64List(prevList => prevList.filter((_, i) => i !== index))} className='messenger__area__cross' alt='' src={red_cross}></img>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </>
    );
}
