import React from 'react';
import { SectionOne, SectionTwo, SectionThree } from './components/sections';
import { useCustomHook } from './hooks/useCustomHook';
import './index.css';

const Portfolio = () => {
    const { state, dispatch } = useCustomHook();

    return (
        <div className="portfolio-container">
            <SectionOne />
            <SectionTwo />
            <SectionThree />
        </div>
    );
};

export default Portfolio;