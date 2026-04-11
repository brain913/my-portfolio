import React from 'react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import './layout.css';

const MobileNav = ({ isOpen, toggleNav }) => {
    const prefersReducedMotion = useReducedMotion();

    return (
        <nav className={`mobile-nav ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
            <button className="close-btn" onClick={toggleNav} aria-label="Close navigation">
                &times;
            </button>
            <ul className="nav-links">
                <li>
                    <Link to="/" onClick={toggleNav}>Home</Link>
                </li>
                <li>
                    <Link to="/about" onClick={toggleNav}>About</Link>
                </li>
                <li>
                    <Link to="/experience" onClick={toggleNav}>Experience</Link>
                </li>
                <li>
                    <Link to="/projects" onClick={toggleNav}>Projects</Link>
                </li>
                <li>
                    <Link to="/gallery" onClick={toggleNav}>Gallery</Link>
                </li>
                <li>
                    <Link to="/contact" onClick={toggleNav}>Contact</Link>
                </li>
            </ul>
            <style jsx>{`
                .mobile-nav {
                    display: ${isOpen ? 'block' : 'none'};
                    transition: ${prefersReducedMotion ? 'none' : 'transform 0.3s ease-in-out'};
                }
            `}</style>
        </nav>
    );
};

export default MobileNav;