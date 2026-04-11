import React from 'react';
import { motion } from 'framer-motion';
import './layout.css';

const SectionContainer = ({ children }) => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="section-container"
        >
            {children}
        </motion.section>
    );
};

export default SectionContainer;