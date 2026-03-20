import React from 'react';
import { motion } from 'framer-motion';

const AnimatedList = ({ items, renderItem, className = "" }) => {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemAnim = {
        hidden: { opacity: 0, x: -10 },
        show: { opacity: 1, x: 0 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className={className}
        >
            {items.map((item, index) => (
                <motion.div key={item.id || index} variants={itemAnim}>
                    {renderItem(item, index)}
                </motion.div>
            ))}
        </motion.div>
    );
};

export default AnimatedList;
