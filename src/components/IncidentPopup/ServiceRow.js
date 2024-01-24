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
            <div className='incident-popup__services-row'>
                {groupToMap.map((item, itemIndex) => (
                    <ServiceItem
                        item={item}
                        selectFunction={setSelectedService}
                        selectedItem={selectedService}
                        key={itemIndex}
                        selectedComponentList={componentList}
                    ></ServiceItem>
                ))}
            </div>

            {componentIsLoading & isSelectedServiceInRow ? (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: 'tween', ease: 'easeInOut', duration: .4 }}
                    className='incident-popup__services__layout_active'
                >
                    <img className="incident-popup__services-loading" src={loading} alt='' />
                </motion.div>
            ) : (
                isSelectedServiceInRow && (
                    <AnimatePresence>
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ type: 'tween', ease: 'easeInOut', duration: .4 }}
                            className='incident-popup__services__layout_active'
                        >
                            {componentList && componentList.map((item) => (
                                <div
                                    className={
                                        selectedComponent && item.ServiceComponentUuid === selectedComponent.ServiceComponentUuid
                                            ? `incident-popup__services-item incident-popup__services-item_active`
                                            : item.ServiceComponentUuid &&
                                                item.ServiceComponentUuid !== (selectedComponent?.ServiceComponentUuid || null)
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
                    </AnimatePresence>
                )
            )}
        </>
    );
}
