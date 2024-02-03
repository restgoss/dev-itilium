import ServiceItem from "./ServiceItem";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';

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
            <AnimatePresence mode='wait'>
                <motion.div
                    className='incident-popup__services-row'>
                    {groupToMap.map((item, itemIndex) => (
                        <ServiceItem
                            item={item}
                            selectFunction={setSelectedService}
                            selectedItem={selectedService}
                            key={item.ServiceUuid}
                            selectedComponentList={componentList}
                        ></ServiceItem>
                    ))}
                </motion.div>

                {componentIsLoading && isSelectedServiceInRow ? (
                    null
                ) : (
                    <AnimatePresence>
                        {isSelectedServiceInRow && (
                            <motion.div
                                initial={{ height: 0, padding: 0 }}
                                animate={{ height: 'auto', padding: '20px', transition: { delay: .3 } }}
                                exit={{ height: 0, padding: 0 }}
                                transition={{ type: 'tween', duration: .3 }}
                                className={componentIsLoading ? 'incident-popup__services__layout' : 'incident-popup__services__layout_active'}
                            >
                                {componentList && componentList.map((item) => (
                                    <div
                                        className={`incident-popup__services-item incident-popup__services-item${selectedComponent && item.ServiceComponentUuid === selectedComponent.ServiceComponentUuid ? '_active' : (selectedComponent ? '_inactive' : '')}`}
                                        key={item.ServiceUuid}
                                        id={item.ServiceUuid}
                                        onClick={() => {
                                            if (selectedComponent === item) {
                                                setSelectedComponent(null);
                                            } else {
                                                setSelectedComponent(item);
                                            }
                                        }}
                                    >
                                        <p>{item.ServiceComponent}</p>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </AnimatePresence>
        </>
    );
}
