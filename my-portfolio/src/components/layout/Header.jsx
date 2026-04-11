import React from 'react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { motion } from 'framer-motion';
import portfolioData from '../../data/portfolioData';

const Header = () => {
    const prefersReducedMotion = useReducedMotion();

    const navVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <header className="header">
            <motion.nav
                initial={prefersReducedMotion ? false : 'hidden'}
                animate="visible"
                variants={navVariants}
                transition={{ duration: 0.5 }}
            >
                <ul className="nav-list">
                    {portfolioData.navigation.map((item) => (
                        <li key={item.id}>
                            <Link to={item.path}>{item.label}</Link>
                        </li>
                    ))}
                </ul>
            </motion.nav>
        </header>
    );
};

export default Header;