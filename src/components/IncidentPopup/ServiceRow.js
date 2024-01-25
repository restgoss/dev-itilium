import ServiceItem from "./ServiceItem";
import { motion, AnimatePresence } from 'framer-motion';
import loading from '../../utils/images/loading.gif';
export default function ServiceRow({
    group,
    setSelectedService,
    selectedService,
    componentList,
    selectedComponent,
    setSelectedComponent,
    componentIsLoading,
}) {
    const isSelectedServiceInRow =
        selectedService &&
        group.some((item) => item.ServiceUuid === selectedService.ServiceUuid);
    const groupToMap = group || [];
    return (
        <>
            <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'tween', ease: 'linear', duration: .4 }}
            className='incident-popup__services-row'>
                {groupToMap.map((item, itemIndex) => (
                    <ServiceItem
                        item={item}
                        selectFunction={setSelectedService}
                        selectedItem={selectedService}
                        key={itemIndex}
                        selectedComponentList={componentList}
                    ></ServiceItem>
                ))}
            </motion.div>

            {componentIsLoading & isSelectedServiceInRow ? (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0, display: 'none' }}
                    transition={{ type: 'tween', ease: 'linear', duration: .4 }}
                    className='incident-popup__services__layout_active'
                >
                    <img className="incident-popup__services-loading" src={loading} alt='' />
                </motion.div>
            ) : (
                <AnimatePresence mode='wait'>
                    {isSelectedServiceInRow && (
                        <motion.div 
                            className='incident-popup__services__layout_active'
                            initial={{height: 0, boxShadow: 'none'}}
                            animate={{height: 'auto', boxShadow: '0px 0px 17px -3px rgba(34, 60, 80, 0.2) inset'}}
                            exit={{height: 0}}
                            transition={{duration: .5, type: 'tween'}}
                            style={{overflow: 'hidden'}}
                            >
                            {componentList && componentList.map((item) => (
                                <div
                                    className={
                                        selectedComponent && item.ServiceComponentUuid === selectedComponent.ServiceComponentUuid
                                            ? `incident-popup__services-item incident-popup__services-item_active`
                                            : item.ServiceComponentUuid &&
                                                item.ServiceComponentUuid === (selectedComponent?.ServiceComponentUuid || null)
                                                ? `incident-popup__services-item incident-popup__services-item_inactive`
                                                : `incident-popup__services-item`}
                                    key={item.ServiceUuid}
                                    id={item.ServiceUuid}
                                    onClick={() => setSelectedComponent(item)}
                                >
                                    <p>{item.ServiceComponent}</p>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </>
    );
}
