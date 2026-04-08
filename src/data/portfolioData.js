export const IMG = {
  profile: "/gallery/profile_new.jpg",
  accelrtLogo: "https://framerusercontent.com/images/TSAli1ZEa27c4TP04Bm7UQIUQ.png?scale-down-to=512",
  accelrtSite: "https://framerusercontent.com/images/e0UVnUVjKLv5Ml8kJ5dRPMFf73Q.png",
  roboticsLogo: "https://framerusercontent.com/images/cuIo4eVBHbM00xXLX8JGOsgtUo.jpg?scale-down-to=512",
  roboticsSite: "https://framerusercontent.com/images/GChbrPKmHoUqbyTczTyy9OKupe4.jpg",
  cafeLogo: "https://framerusercontent.com/images/wVaWfn9GujVGnYPiHUz6qtusWaQ.jpg",
  cafeSite: "https://framerusercontent.com/images/VrerlOXUnIZtWILehqwd8HIhW54.jpg",
  city2Logo: "https://framerusercontent.com/images/rtNcXMSTJ0h0tvEy5ukgMpY68.png",
  city2Site: "https://framerusercontent.com/images/y3cKAV5jwOJGcb8wAzr95VJM49c.jpg",
  fllSite: "https://framerusercontent.com/images/9JV40cfKNMxfprkrpOBNYEt8XQ.jpeg?scale-down-to=1024",
  scrapyard1: "https://framerusercontent.com/images/zVJ0xEO14uoYedqzRcyE2u3LDBs.jpg?scale-down-to=1024",
  scrapyard2: "https://framerusercontent.com/images/sAPlOltwcpel7KaPCn3F0RwlEU.jpg?scale-down-to=1024",
  athletics: "https://framerusercontent.com/images/QUj5yg4QAZFH8t6eJb1SJCCE.png?scale-down-to=1024",
  flowerVid: "https://framerusercontent.com/assets/J9mOhxlb8oAWga9V9J7FMk7Y.mp4",
  squareVid: "https://framerusercontent.com/assets/Xa80JloFiy8jFUQd7V9kAzma5L4.mp4",
  daydreamPhoto: "https://framerusercontent.com/images/SzFUezPNJJVFtZO9J4QAIQBxI.jpeg?scale-down-to=2048",
  daydreamIcon: "https://daydream.hackclub.com/favicon.png",
};

export const TYPING = [
  "exploring technology & finance.",
  "thinking about good food and art.",
  "preparing myself for what's next.",
  "balancing academics & extracurriculars.",
];

export const STATS = [
  { label: "Hackathons", sub: "Organised/Competed", val: "2+" },
  { label: "Model United Nations", sub: "Competing", val: "Competing" },
  { label: "AccelRT", sub: "Non-profit", val: "2025" },
  { label: "FIRST Robotics Submerged", sub: "APOC", val: "Volunteered" },
  { label: "FIRST Robotics Unearthed", sub: "Nationals", val: "Competed" },
  { label: "FIRST Robotics Unearthed", sub: "Regionals (UNSW, Bossley Park)", val: "Volunteered" },
  { label: "BBHS Cafe", sub: "Barista", val: "2024–2025" },
  { label: "City2Surf", sub: "Volunteer", val: "Completed" },
];

export const EXPERIENCE = [
  {
    period: "2025",
    role: "Hackathon Organiser",
    company: "Hack Club",
    link: "https://daydream.hackclub.com/sydney",
    location: "UNSW – In person",
    logo: IMG.daydreamIcon,
    logoDark: IMG.daydreamIcon,
    siteImg: IMG.daydreamPhoto,
    summary:
      "Organised Daydream @ UNSW for Hack Club, a non-profit dedicated to creating and organising Hackathons for students in Australia. All spending is visible through Hack Club Bank.",
    achievements: [
      "Organised hackathon events connecting students with industry across Australia",
      "Managed event logistics and participant communication end-to-end",
      "All spending transparently tracked through Hack Club Bank",
    ],
    tags: ["Events", "Community", "Leadership"],
  },
  {
    period: "2024–2025",
    role: "Volunteer",
    company: "AccelRT",
    link: "https://accelrt-v2.vercel.app/",
    location: "Sydney – Hybrid",
    logo: IMG.accelrtLogo,
    logoDark: IMG.accelrtLogo,
    siteImg: IMG.accelrtSite,
    summary:
      "Work at AccelRT, a non-profit dedicated to creating and organising Hackathons for students in Australia — flexible, hybrid volunteering format.",
    achievements: [
      "Organised hackathon events connecting students with industry across Australia",
      "Managed event logistics and participant communication end-to-end",
    ],
    tags: ["Events", "Community", "Leadership"],
  },
  {
    period: "2024–2025",
    role: "Competitor – Unearthed Season",
    company: "First Lego League",
    link: "https://www.firstlegoleague.org/",
    location: "Sydney – In person",
    logo: "/gallery/vanguardlight.png",
    logoDark: "/gallery/vanguarddark.png",
    logoOnDark: true,
    siteImg: IMG.fllSite,
    summary:
      "Competed in the FIRST LEGO League Unearthed Season, representing our school at Regionals (UNSW & Bossley Park) and advancing all the way to Nationals. An incredible team experience combining robotics, research, and presentation.",
    achievements: [
      "Advanced to Nationals — one of the top-ranked teams in Australia",
      "Competed at two Regionals events: UNSW and Bossley Park",
      "Designed, programmed and piloted a LEGO robot through complex missions",
    ],
    tags: ["Robotics", "STEM", "Nationals", "Teamwork"],
  },
  {
    period: "2024",
    role: "Table Reset Volunteer",
    company: "FIRST Robotics",
    link: "https://www.firstlegoleague.org/",
    location: "Sydney – In person",
    logo: IMG.roboticsLogo,
    logoDark: IMG.roboticsLogo,
    siteImg: IMG.roboticsSite,
    summary:
      "Volunteered at FIRST Robotics, Asia Pacific Open Championship (APOC) with a table reset role which taught me how to work in a fast-paced timed environment.",
    achievements: [
      "Managed fast-paced timed table resets across all competition rounds",
      "Collaborated with international teams at the Asia Pacific Open Championship",
    ],
    tags: ["Robotics", "STEM", "Teamwork"],
  },
  {
    period: "2023–2025",
    role: "Barista",
    company: "BBHS Cafe",
    link: "#",
    location: "Blacktown, NSW",
    logo: IMG.cafeLogo,
    logoDark: IMG.cafeLogo,
    siteImg: IMG.cafeSite,
    summary:
      "A barista who makes coffees, hot chocolates, shakes and cheese toasties for students and teachers. Gives me the ability to work in a fast-paced environment with a way of learning how to communicate and deliver products.",
    achievements: [
      "High-volume, fast-paced customer service in a school cafe setting",
      "Developed communication and product delivery skills",
    ],
    tags: ["Customer Service", "F&B"],
  },
  {
    period: "2024",
    role: "Volunteer",
    company: "City2Surf",
    link: "https://city2surf.com.au/",
    location: "Sydney – In person",
    logo: IMG.city2Logo,
    logoDark: IMG.city2Logo,
    siteImg: IMG.city2Site,
    summary:
      "Volunteering at City2Surf was an exhilarating experience which showed me people from all walks of life trying to do their best for charity and giving their all to run the best they can.",
    achievements: [
      "Supported runners and event operations across the course",
      "Contributed to one of Australia's largest charity fun runs",
    ],
    tags: ["Charity", "Community", "Events"],
  },
];

export const EDUCATION = [
  { school: "University of New South Wales", link: "#", role: "Bachelor of Computer Science / Law", period: "Future" },
  { school: "Blacktown Boys High School", link: "#", role: "Student", period: "2020–2025" },
  { school: "Quakers Hill Public School", link: "#", role: "Advanced & OC streams", period: "2016–2022" },
];

export const CERTIFICATES = [
  { name: "Chrome DevTools User", issuer: "Google", year: "2026", link: "#" },
  { name: "DOM Detective", issuer: "Google", year: "2026", link: "#" },
  { name: "Android Studio User", issuer: "Google", year: "2025", link: "#" },
  { name: "Machine Learning Crash Course: Numerical Data", issuer: "Google", year: "2025", link: "#" },
  { name: "Firebase Studio Developer Community", issuer: "Google", year: "2025", link: "#" },
  { name: "Machine Learning Crash Course: Classification", issuer: "Google", year: "2025", link: "#" },
  { name: "Machine Learning Crash Course: Logistic Regression", issuer: "Google", year: "2025", link: "#" },
  { name: "Machine Learning Crash Course: Linear Regression", issuer: "Google", year: "2025", link: "#" },
  { name: "I/O 2025 – Registered", issuer: "Google", year: "2025", link: "#" },
  { name: "Joined the Google Developer Program", issuer: "Google", year: "2025", link: "#" },
];

export const REFERENCES = [
  {
    name: "Shuwei Guo",
    initials: "SG",
    text: "I am pleased to recommend Vatsal for his enthusiastic contributions to our team. He has demonstrated initiative by developing advertising plans for our social media platforms and participating in events, where he made valuable efforts to connect with key stakeholders. Additionally, Vatsal made creative contributions to our design team mascot during our branding discussions. His proactive attitude and willingness to support various aspects of our work have been appreciated.",
  },
  {
    name: "Aaron O'Meara",
    initials: "AO",
    text: "Vatsal played a key role in supporting the Team Alliance practice rooms at the 2025 FIRST® LEGO® League Asia Pacific Championships, ensuring teams adhered to scheduled time slots with 'gracious professionalism'. He also assisted with bump-out tasks, including rearranging furniture and maintaining clean, organised spaces. While encouraged to focus on his assigned responsibilities, he consistently demonstrated initiative and enthusiasm by seeking out additional ways to contribute throughout the day.",
  },
];

export const SKILLS = [
  { name: "Google Dev Tools", icon: "🔧" },
  { name: "Raycast", icon: "⚡" },
  { name: "Notion", icon: "📋" },
  { name: "Arc Browser", icon: "🌐" },
  { name: "VS Code", icon: ">_" },
  { name: "GitHub", icon: "🐙" },
  { name: "Shapr3D", icon: "🎨" },
  { name: "ChatGPT", icon: "🤖" },
  { name: "Kaggle", icon: "📊" },
  { name: "Python", icon: "🐍" },
  { name: "JavaScript", icon: "𝐉𝐒" },
  { name: "React", icon: "⚛" },
  { name: "Git", icon: "⎇" },
  { name: "Figma", icon: "✏️" },
];

export const GALLERY = [
  { label: "Campfire Hackathon", caption: "Building, hacking, and vibing — a night to remember.", src: "/gallery/campfire.jpg" },
  { label: "Fried Brothers with Friends", caption: "Good food, great people. The crew at our favourite spot.", src: "/gallery/fried1.jpg" },
  { label: "Fried Brothers with Friends", caption: "Neon lights and fries — peak dining experience.", src: "/gallery/fried2.jpg" },
  { label: "Mock Trial vs James Ruse Ag HS", caption: "Lost by 9 pts — but we held our own in the courtroom.", src: "/gallery/mocktrial.jpg" },
  { label: "Comp Club UNSW AI Course", caption: "Learning AI with the Competitive Programming Club at UNSW.", src: "/gallery/compclub.jpg" },
  { label: "UNSW AI Conference @ W Sydney", caption: "The Darling Harbour view from the W Hotel.", src: "/gallery/unsw1.jpg" },
  { label: "UNSW AI Conference @ W Sydney", caption: "Night view from the conference — Sydney city lit up.", src: "/gallery/unsw2.jpg" },
  { label: "UNSW AI Conference @ W Sydney", caption: "Sydney Harbour Bridge at night after the conference.", src: "/gallery/unsw3.jpg" },
  { label: "UNSW AI Conference @ W Sydney", caption: "Panel: NAIC, Future Government, AMP CTO, UNSW AI Director.", src: "/gallery/unsw4.jpg" },
  { label: "UNSW AI Conference @ W Sydney", caption: "Post-conference gelato run — well earned.", src: "/gallery/unsw5.jpg" },
  { label: "UNSW AI Conference @ W Sydney", caption: "Sydney CBD at night from the rooftop.", src: "/gallery/unsw6.jpg" },
  { label: "UNSW AI Conference @ W Sydney", caption: "Inside the AI panel event at W Sydney Hotel.", src: "/gallery/unsw7.jpg" },
  { label: "Scrapyard Hackathon", caption: "Hackathon, fun times, school spirit.", src: IMG.scrapyard1 },
  { label: "Multicultural Day", caption: "Explosion of culture, food, ethnicity.", src: IMG.scrapyard2 },
  { label: "Athletics Carnival", caption: "Sport, key event, great times, fun times.", src: IMG.athletics },
];

export const PROJECTS = [
  { label: "Flower Animation", caption: "Flower animation for multimedia at 12 FPS", src: IMG.flowerVid },
  { label: "Square to Triangle", caption: "Switching between two objects by combining opposite frames with creative liberty.", src: IMG.squareVid },
];

export const CONNECT = [
  { label: "Discord", val: "brain913", icon: "💬", href: "https://discord.com/users/767977600915734530" },
  { label: "WhatsApp", val: "Vatsal Mehta", icon: "📱", href: "https://web.whatsapp.com/send/?phone=61493444893" },
  { label: "LinkedIn", val: "Vatsal Mehta", icon: "💼", href: "https://linkedin.com/in/brain913" },
  { label: "Email", val: "vatsalplayzforever@gmail.com", icon: "✉️", href: "mailto:vatsalplayzforever@gmail.com" },
  { label: "Book a Call", val: "cal.com", icon: "📅", href: "https://cal.com/brain913" },
];

export const TABS = ["Overview", "Work Experience", "Education", "References", "Tech Stack", "Gallery", "Projects", "Connect"];
export const TAB_S = {
  Overview: "Home",
  "Work Experience": "Work",
  Education: "Edu",
  References: "Refs",
  "Tech Stack": "Stack",
  Gallery: "Gallery",
  Projects: "Projects",
  Connect: "Connect",
};
export const TAB_ICON = {
  Overview: "🏠",
  "Work Experience": "💼",
  Education: "🎓",
  References: "💬",
  "Tech Stack": "⚙️",
  Gallery: "🌇",
  Projects: "🎬",
  Connect: "📡",
};
