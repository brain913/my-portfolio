import React from 'react';
import { useScrollSections } from '../../hooks/useScrollSections';
import { portfolioData } from '../../data/portfolioData';
import GlassCard from '../ui/GlassCard';
import MotionWrapper from '../ui/MotionWrapper';
import './sections.css';

const About = () => {
    const { aboutSectionRef } = useScrollSections();

    return (
        <section ref={aboutSectionRef} className="about-section">
            <MotionWrapper>
                <h2 className="section-title">{portfolioData.about.title}</h2>
                <p className="section-description">{portfolioData.about.description}</p>
                <div className="about-cards">
                    {portfolioData.about.cards.map((card, index) => (
                        <GlassCard key={index} title={card.title} content={card.content} />
                    ))}
                </div>
            </MotionWrapper>
        </section>
    );
};

export default About;