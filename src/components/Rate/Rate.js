import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Rate.css';
import star from '../../utils/images/star.png';
import star_filled from '../../utils/images/star_filled.png';

export default function Rate() {
    const [isRateOpened, setRateOpened] = useState(false);
    const [hoveredStarIndex, setHoveredStarIndex] = useState(null);
    const [selectedRate, setRate] = useState(null);
    const handleStarHover = (index) => {
        setHoveredStarIndex(index);
    };

    const handleStarLeave = () => {
        setHoveredStarIndex(null);
    };

    return (
        <>
            <motion.div className='rate__div'>
                {isRateOpened ? (
                    <>
                        {/* Your opened rate UI */}
                    </>
                ) : (
                    <>
                        <div className='rate__stars__div'>
                            {[...Array(5)].map((_, index) => (
                                <motion.img layout
                                    key={index}
                                    className='rate__star'
                                    src={index < (hoveredStarIndex !== null ? hoveredStarIndex + 1 : 0) ? star_filled : star}
                                    onMouseEnter={() => handleStarHover(index)}
                                    onMouseLeave={handleStarLeave}
                                    onClick={() => {
                                        setRate(index + 1)
                                        setHoveredStarIndex(index);
                                    }}
                                />
                            ))}
                        </div>
                    </>
                )}
            </motion.div>
        </>
    );
}
