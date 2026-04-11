const portfolioData = {
  personalInfo: {
    name: "Your Name",
    title: "Your Title",
    description: "A brief description about yourself or your portfolio.",
    email: "your.email@example.com",
    socialLinks: {
      github: "https://github.com/yourusername",
      linkedin: "https://linkedin.com/in/yourusername",
      twitter: "https://twitter.com/yourusername",
    },
  },
  experience: [
    {
      company: "Company Name",
      position: "Job Title",
      duration: "Start Date - End Date",
      description: "A brief description of your role and responsibilities.",
    },
    // Add more experience entries as needed
  ],
  projects: [
    {
      title: "Project Title",
      description: "A brief description of the project.",
      technologies: ["Tech1", "Tech2", "Tech3"],
      link: "https://link-to-project.com",
    },
    // Add more project entries as needed
  ],
  gallery: [
    {
      title: "Gallery Item Title",
      imageUrl: "/gallery/image1.jpg",
      description: "A brief description of the gallery item.",
    },
    // Add more gallery items as needed
  ],
};

export default portfolioData;