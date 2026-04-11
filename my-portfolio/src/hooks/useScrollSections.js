import { useEffect, useState } from 'react';

const useScrollSections = (sectionRefs) => {
    const [activeSection, setActiveSection] = useState(0);

    const handleScroll = () => {
        const scrollPosition = window.scrollY + window.innerHeight / 2;

        sectionRefs.forEach((ref, index) => {
            if (ref.current) {
                const sectionTop = ref.current.offsetTop;
                const sectionHeight = ref.current.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    setActiveSection(index);
                }
            }
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [sectionRefs]);

    return activeSection;
};

export default useScrollSections;