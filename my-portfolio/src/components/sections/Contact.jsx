import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { GlassCard } from '../ui/GlassCard';
import { portfolioData } from '../../data/portfolioData';

const Contact = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const prefersReducedMotion = useReducedMotion();

    const onSubmit = (data) => {
        console.log(data);
        // Handle form submission logic here
    };

    const motionProps = prefersReducedMotion ? {} : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    return (
        <section className="contact-section">
            <GlassCard>
                <motion.div {...motionProps}>
                    <h2>{portfolioData.contact.title}</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="name">{portfolioData.contact.labels.name}</label>
                            <input
                                id="name"
                                type="text"
                                {...register('name', { required: true })}
                            />
                            {errors.name && <span>This field is required</span>}
                        </div>
                        <div>
                            <label htmlFor="email">{portfolioData.contact.labels.email}</label>
                            <input
                                id="email"
                                type="email"
                                {...register('email', { required: true })}
                            />
                            {errors.email && <span>This field is required</span>}
                        </div>
                        <div>
                            <label htmlFor="message">{portfolioData.contact.labels.message}</label>
                            <textarea
                                id="message"
                                {...register('message', { required: true })}
                            />
                            {errors.message && <span>This field is required</span>}
                        </div>
                        <button type="submit">{portfolioData.contact.submit}</button>
                    </form>
                </motion.div>
            </GlassCard>
        </section>
    );
};

export default Contact;