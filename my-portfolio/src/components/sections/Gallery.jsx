import React from 'react';
import { useScrollSections } from '../../hooks/useScrollSections';
import { portfolioData } from '../../data/portfolioData';
import MotionWrapper from '../ui/MotionWrapper';
import './sections.css';

const Gallery = () => {
    const { galleryItems } = portfolioData;

    return (
        <section id="gallery" className="gallery-section">
            <h2 className="section-title">Gallery</h2>
            <MotionWrapper>
                <div className="gallery-grid">
                    {galleryItems.map((item, index) => (
                        <div key={index} className="gallery-item">
                            <img src={item.image} alt={item.alt} className="gallery-image" />
                        </div>
                    ))}
                </div>
            </MotionWrapper>
        </section>
    );
};

export default Gallery;