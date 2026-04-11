import React from 'react';
import { useScrollSections } from '../../hooks/useScrollSections';
import { portfolioData } from '../../data/portfolioData';
import MotionWrapper from '../ui/MotionWrapper';
import GlassCard from '../ui/GlassCard';

const Projects = () => {
    const { projects } = portfolioData;
    const { scrollToSection } = useScrollSections();

    return (
        <section id="projects" className="projects-section">
            <h2>Projects</h2>
            <div className="projects-container">
                {projects.map((project, index) => (
                    <MotionWrapper key={index}>
                        <GlassCard>
                            <h3>{project.title}</h3>
                            <p>{project.description}</p>
                            <button onClick={() => scrollToSection(project.link)}>View Project</button>
                        </GlassCard>
                    </MotionWrapper>
                ))}
            </div>
        </section>
    );
};

export default Projects;