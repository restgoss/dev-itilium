import { useState } from 'react';
import api from '../../utils/Api';
import file_message from '../../utils/images/file_message.png';
import loading from '../../utils/images/loading.gif';

const MAX_FILENAME_LENGTH = 20;

const TruncatedFileName = ({ name }) => {
    const truncateFileName = (fileName, maxLength) => {
        if (fileName.length <= maxLength) return fileName;
        const truncatedName = fileName.substring(0, maxLength / 2 - 3);
        const truncatedExtension = fileName.substring(fileName.lastIndexOf('.'));
        const remainingLength = maxLength - truncatedName.length;
        let remainingChars = fileName.substring(fileName.length - remainingLength);
        if (!remainingChars.endsWith(truncatedExtension)) {
            remainingChars += truncatedExtension;
        }
        return truncatedName + '...' + remainingChars;
    };

    return <p style={{ margin: 0 }}>{truncateFileName(name, MAX_FILENAME_LENGTH)}</p>;
};

const FileLoader = ({ file, fileLoadingMap, getFile }) => (
    <div className="message__file" onClick={() => getFile(file)}>
        {fileLoadingMap[file.UUID] ? (
            <>
                <img src={loading} className="message__img" alt="File icon" />
                <p style={{ margin: 0 }}>Загрузка файла...</p>
            </>
        ) : (
            <>
                <img src={file_message} className="message__img" alt="File icon" />
                <TruncatedFileName name={file.Name} />
            </>
        )}
    </div>
);

function base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}


export default function Message({ message }) {
    const [fileLoadingMap, setFileLoadingMap] = useState({});

    const getFile = async (file) => {
        console.log(message);
        try {
            if (!file.UUID) {
                return;
            }
            setFileLoadingMap(prevState => ({
                ...prevState,
                [file.UUID]: true
            }));
            const token = localStorage.getItem('jwt');
            const res = await api.getFile(token, file.UUID);
            const blob = new Blob([base64ToArrayBuffer(res.Data)], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = file.Name;
            document.body.appendChild(link);
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.log(error);
        } finally {
            setFileLoadingMap(prevState => ({
                ...prevState,
                [file.UUID]: false
            }));
        }
    };

    const renderMessageText = (text) => {
        const lines = text.split('\n');
        return lines.map((line, index) => {
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const parts = line.split(urlRegex);
            return parts.map((part, i) => {
                if (part.match(urlRegex)) {
                    const truncatedText = part.length > 50 ? part.substring(0, 43) + '...' : part;
                    return <a className='message__message' style={{ color: '#000' }} key={i} href={part} target="_blank" rel="noopener noreferrer">{truncatedText}</a>;
                } else {
                    return <p className='message__message' key={i}>{part}</p>;
                }
            });
        });
    };

    return (
        <>
            <div className={message.IsMyMessage ? "message__div-self" : "message__div"} style={message.IsMyMessage ? {} : { position: 'relative', marginTop: '35px' }}>
                {message.IsMyMessage ? null : <p className="message__name">{message.Autor}</p>}
                <div className="message__content">
                    <div className="message__text">
                        {renderMessageText(message.Text)}
                    </div>
                    <p className="message__date">{message.Data || null}</p>
                </div>
                {message.Files.length > 0 && message.Files.map((file, index) => (
                    (file.Name && file.UUID) ? (
                        <FileLoader key={index} file={file} fileLoadingMap={fileLoadingMap} getFile={getFile} />
                    ) : null
                ))}
            </div>
        </>
    );
}
