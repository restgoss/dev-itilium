import loading from '../utils/images/loading.gif';
function LoadingPage({text}) {
    return(
        <>
            <div className="loading-page">
                <p className="loading-page_p">{text}</p>
                <img src={loading} className='loading-gif' alt='Загрузка'></img>
            </div>
        </>
    )
}

export default LoadingPage;