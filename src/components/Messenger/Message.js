import file_message from '../../utils/images/file_message.png';

export default function Message({ message }) {
    const MAX_FILENAME_LENGTH = 20;

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
            {message.IsMyMessage ? (
                    <div className="message__div-self">
                        <div className="message__content">
                            <div className="message__text">
                                {renderMessageText(message.Text)}
                            </div>
                            <p className="message__date">{message.Data || null}</p>
                        </div>
                        {message.Files.length > 0 && message.Files[0].Name && (
                            <div className="message__file">
                                <img src={file_message} className='message__img' alt="File icon" />
                                {truncateFileName(message.Files[0].Name, MAX_FILENAME_LENGTH)}
                            </div>
                        )}
                    </div>
            ) : (
                <div style={{position: 'relative', marginTop: '35px'}}>
                    <p className="message__name">{message.Autor}</p>
                    <div className="message__div">
                        <div className="message__content">
                            <div className="message__text">
                                {renderMessageText(message.Text)}
                            </div>
                            <p className="message__date">{message.Data || null}</p>
                        </div>
                        {message.Files.length > 0 && message.Files[0].Name && (
                            <div className="message__file">
                                <img src={file_message} className='message__img' alt="File icon" />
                                {truncateFileName(message.Files[0].Name, MAX_FILENAME_LENGTH)}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
