import success_img from '../../utils/images/success.png';
import error from '../../utils/images/error.png';
import { motion } from 'framer-motion';
export default function Result({ success }) {
    return (
        <>
            {success ? (
                <>
                    <motion.img
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="incident-popup__img" src={success_img} alt=""></motion.img>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="incident-popup__success">Обращение успешно зарегистрировано!</motion.p>
                </>
            ) : (
                <>
                    <motion.img
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="incident-popup__img" src={error} alt=""></motion.img>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="incident-popup__success">Произошла ошибка.</motion.p>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="incident-popup__success">Ваше обращение не было зарегистрировано, попробуйте позже.</motion.p>

                </>
            )}
        </>
    )
}