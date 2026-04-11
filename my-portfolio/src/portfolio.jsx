import React from 'react';
import Header from './components/layout/Header';
import MobileNav from './components/layout/MobileNav';
import SectionContainer from './components/layout/SectionContainer';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Experience from './components/sections/Experience';
import Projects from './components/sections/Projects';
import Gallery from './components/sections/Gallery';
import Contact from './components/sections/Contact';
import useScrollSections from './hooks/useScrollSections';
import useReducedMotion from './hooks/useReducedMotion';
import './styles/layout.css';
import './styles/components.css';
import './styles/sections.css';

const Portfolio = () => {
    const { currentSection } = useScrollSections();
    const prefersReducedMotion = useReducedMotion();

    return (
        <div className={`portfolio ${prefersReducedMotion ? 'reduced-motion' : ''}`}>
            <Header />
            <MobileNav />
            <SectionContainer currentSection={currentSection}>
                <Hero />
                <About />
                <Experience />
                <Projects />
                <Gallery />
                <Contact />
            </SectionContainer>
        </div>
    );
};

export default Portfolio;