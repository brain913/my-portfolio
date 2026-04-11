import React from 'react';
import { useScrollSections } from '../../hooks/useScrollSections';
import { portfolioData } from '../../data/portfolioData';
import MotionWrapper from '../ui/MotionWrapper';
import GlassCard from '../ui/GlassCard';

const Experience = () => {
    const { experience } = portfolioData;

    return (
        <section id="experience" className="experience-section">
            <h2>Experience</h2>
            <div className="experience-list">
                {experience.map((item, index) => (
                    <MotionWrapper key={index}>
                        <GlassCard>
                            <h3>{item.title}</h3>
                            <p>{item.company}</p>
                            <p>{item.date}</p>
                            <p>{item.description}</p>
                        </GlassCard>
                    </MotionWrapper>
                ))}
            </div>
        </section>
    );
};

export default Experience;