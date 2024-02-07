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

export default function Messenger({ messageHistory, selectedIncidentUuid, fetchSelectedIncident }) {
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [fileBase64, setFileBase64] = useState(null);
    const reversedMessageHistory = [...messageHistory].reverse();

    const handleSendMessage = () => {
        if (inputValue && !fileBase64) {
            try {
                setLoading(true);
                const token = localStorage.getItem('jwt');
                const res = api.addNewCommunication(token, selectedIncidentUuid, inputValue);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
                fetchSelectedIncident();
            }
        }

        if (fileBase64) {
            try {
                console.log(fileBase64);
                setLoading(true);
                const token = localStorage.getItem('jwt');
                let fileData = null;
                if (fileBase64) {
                    fileData = [fileBase64];
                }
                const res = api.addNewFile(token, selectedIncidentUuid, fileData, inputValue);
                fetchSelectedIncident();
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
    }

    useEffect(() => {
        if (inputValue) {
            const interval = setInterval(() => {
                fetchSelectedIncident();
            }, 60000);

            return () => clearInterval(interval);
        }
    }, [fetchSelectedIncident]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            const base64String = reader.result;
            const base64Content = base64String.split(',')[1];
            setFileBase64({
                Name: file.name,
                Data: base64Content
            });
        };

        reader.readAsDataURL(file);
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

    return (
        <>
            <div className="messenger__div">
                <div className='messenger__field'>
                    <OverlayScrollbarsComponent id='messenger__block' 
                        options={{ scrollbars: { autoHide: "leave" } }} style={{ maxHeight: '100%', display: 'flex' }}>
                        {reversedMessageHistory.map((item, index) => {
                            return <Message key={index} message={item} />
                        })}
                    </OverlayScrollbarsComponent>
                </div>
                <motion.div className="messenger__input-div">
                <div className="messenger__input-area">
                    <div className='messenger__type-in'>
                        <label className="messenger__add-file">
                            <input type='file' onChange={handleFileChange} />
                        </label>
                        <TextareaAutosize
                            maxRows={25}
                            required
                            type="text"
                            className="messenger__input"
                            value={inputValue}
                            placeholder='Напишите сообщение...'
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyPress}>

                        </TextareaAutosize >
                        <button className='messenger__send' src={isLoading ? loading : send} alt='' onClick={handleSendMessage} />
                    </div>
                    {fileBase64 ? (
                        <div className='messenger__area'>
                            <p className='messenger__pinned-file'>Файл во вложении: <span>{fileBase64.Name}</span></p>
                            <img onClick={() => setFileBase64(null)} className='messenger__area__cross' alt='' src={red_cross}></img>
                        </div>
                    ) : null}
                </div>

            </motion.div>
            </div>
            
        </>
    );
}
