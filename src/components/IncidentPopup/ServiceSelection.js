import React, { useEffect } from 'react';
import { Services } from "../../utils/Constants"
import { motion } from 'framer-motion';
import api from '../../utils/Api';
import ServiceItem from './ServiceItem';
import ServiceRow from './ServiceRow';

export default function ServiceSelection({ setSelectedService, setSelectedComponent, selectedService, selectedComponent, componentList, setComponentList, componentIsLoading }) {

    useEffect(() => {
       
        const fetchSelectedServiceComponents = async () => {
            try {
                const token = localStorage.getItem('jwt');
                const res = await api.fetchServiceComponent(token, selectedService.ServiceUuid);
                setComponentList(res.ServiceComponents);
            } catch (error) {
                console.log(error);
            }
        };
        setSelectedComponent(null);
        if (selectedService) {
            fetchSelectedServiceComponents();
        }
    }, [selectedService, setComponentList, setSelectedComponent]);

    const groupedIncidents = [];
    for (let i = 0; i < Services.length; i += 3) {
        groupedIncidents.push(Services.slice(i, i + 3));
    }


    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="incident-popup__services-div"
                id="servicesContainer1"
            >
                {groupedIncidents.map((group, index) => (
                    <ServiceRow
                        group={group}
                        setSelectedService={setSelectedService}
                        selectedService={selectedService}
                        setSelectedComponent={setSelectedComponent}
                        selectedComponent={selectedComponent}
                        componentList={componentList} 
                        componentIsLoading={componentIsLoading}
                        key={index}
                        />
                        
                ))}

            </motion.div>
        </>
    )
}
