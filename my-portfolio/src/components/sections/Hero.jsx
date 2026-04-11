import React from 'react';
import { useScrollSections } from '../../hooks/useScrollSections';
import { GlassCard } from '../ui/GlassCard';
import { motion } from 'framer-motion';
import { portfolioData } from '../../data/portfolioData';

const Hero = () => {
    const { scrollToSection } = useScrollSections();

    return (
        <section className="hero" id="hero">
            <motion.div 
                className="hero-content"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1>{portfolioData.hero.title}</h1>
                <p>{portfolioData.hero.description}</p>
                <button onClick={() => scrollToSection('about')}>
                    {portfolioData.hero.buttonText}
                </button>
            </motion.div>
            <GlassCard className="hero-image">
                <img src={portfolioData.hero.image} alt="Hero" />
            </GlassCard>
        </section>
    );
};

export default Hero;