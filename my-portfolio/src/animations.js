const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  transition: { duration: 0.5 },
};

const slideIn = (direction = 'left') => ({
  hidden: { x: direction === 'left' ? '-100%' : '100%', opacity: 0 },
  visible: { x: 0, opacity: 1 },
  transition: { duration: 0.5 },
});

const scaleUp = {
  hidden: { scale: 0 },
  visible: { scale: 1 },
  transition: { duration: 0.5 },
};

const staggerChildren = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export { fadeIn, slideIn, scaleUp, staggerChildren };