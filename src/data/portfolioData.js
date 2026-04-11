/* portfolioData.js - single source of truth for all portfolio content */

export const IMG = {
  profile:      "/gallery/profile_new.jpg",
  accelrtLogo:  "https://framerusercontent.com/images/TSAli1ZEa27c4TP04Bm7UQIUQ.png?scale-down-to=512",
  accelrtSite:  "https://framerusercontent.com/images/e0UVnUVjKLv5Ml8kJ5dRPMFf73Q.png",
  roboticsLogo: "https://framerusercontent.com/images/cuIo4eVBHbM00xXLX8JGOsgtUo.jpg?scale-down-to=512",
  roboticsSite: "https://framerusercontent.com/images/GChbrPKmHoUqbyTczTyy9OKupe4.jpg",
  cafeLogo:     "https://framerusercontent.com/images/wVaWfn9GujVGnYPiHUz6qtusWaQ.jpg",
  cafeSite:     "https://framerusercontent.com/images/VrerlOXUnIZtWILehqwd8HIhW54.jpg",
  city2Logo:    "https://framerusercontent.com/images/rtNcXMSTJ0h0tvEy5ukgMpY68.png",
  city2Site:    "https://framerusercontent.com/images/y3cKAV5jwOJGcb8wAzr95VJM49c.jpg",
  fllSite:      "https://framerusercontent.com/images/9JV40cfKNMxfprkrpOBNYEt8XQ.jpeg?scale-down-to=1024",
  scrapyard1:   "https://framerusercontent.com/images/zVJ0xEO14uoYedqzRcyE2u3LDBs.jpg?scale-down-to=1024",
  scrapyard2:   "https://framerusercontent.com/images/sAPlOltwcpel7KaPCn3F0RwlEU.jpg?scale-down-to=1024",
  athletics:    "https://framerusercontent.com/images/QUj5yg4QAZFH8t6eJb1SJCCE.png?scale-down-to=1024",
  flowerVid:    "https://framerusercontent.com/assets/J9mOhxlb8oAWga9V9J7FMk7Y.mp4",
  squareVid:    "https://framerusercontent.com/assets/Xa80JloFiy8jFUQd7V9kAzma5L4.mp4",
  daydreamPhoto:"https://framerusercontent.com/images/SzFUezPNJJVFtZO9J4QAIQBxI.jpeg?scale-down-to=2048",
  daydreamIcon: "https://daydream.hackclub.com/favicon.png",
};

export const TYPING = [
  "exploring technology & finance.",
  "thinking about good food and art.",
  "preparing myself for what's next.",
  "balancing academics & extracurriculars.",
];

export const STATS = [
  { label: "Hackathons",               sub: "Organised / Competed",           val: "2+"          },
  { label: "Model United Nations",     sub: "Competing",                      val: "Active"      },
  { label: "AccelRT",                  sub: "Non-profit volunteer",            val: "2025"        },
  { label: "FIRST Robotics Submerged", sub: "APOC",                           val: "Volunteered" },
  { label: "FIRST Robotics Unearthed", sub: "Nationals",                      val: "Competed"    },
  { label: "FIRST Robotics Unearthed", sub: "Regionals - UNSW & Bossley Pk",  val: "Volunteered" },
  { label: "BBHS Cafe",                sub: "Barista",                        val: "2023-2025"   },
  { label: "City2Surf",                sub: "Volunteer",                      val: "Completed"   },
];

export const EXPERIENCE = [
  {
    featured: true,
    period: "2025",
    role: "Hackathon Organiser",
    company: "Hack Club",
    link: "https://daydream.hackclub.com/sydney",
    location: "UNSW - In person",
    logo: IMG.daydreamIcon,
    logoDark: IMG.daydreamIcon,
    siteImg: IMG.daydreamPhoto,
    impact: "150+ students",
    scope: "Sydney",
    summary: "Organised Daydream @ UNSW for Hack Club, a non-profit running hackathons for students across Australia. Full spending transparency via Hack Club Bank.",
    achievements: [
      "Brought together 150+ students from across Sydney for a full-day hackathon at UNSW",
      "Managed event logistics, sponsorship coordination and participant communications end-to-end",
      "All spending transparently tracked and public through Hack Club Bank",
    ],
    tags: ["Events", "Community", "Leadership"],
  },
  {
    featured: true,
    period: "2024-2025",
    role: "Competitor - Unearthed Season",
    company: "First Lego League",
    link: "https://www.firstlegoleague.org/",
    location: "Sydney - In person",
    logo: "/gallery/vanguardlight.png",
    logoDark: "/gallery/vanguarddark.png",
    logoOnDark: true,
    siteImg: IMG.fllSite,
    impact: "Reached Nationals",
    scope: "Australia",
    summary: "Competed in the FIRST LEGO League Unearthed Season - from Regionals at UNSW & Bossley Park all the way to Nationals. Robotics, research, and team presentation combined.",
    achievements: [
      "Advanced to Nationals - one of the top-ranked teams in Australia",
      "Competed at two Regional events: UNSW and Bossley Park",
      "Designed, programmed and piloted a LEGO robot through complex timed missions",
    ],
    tags: ["Robotics", "STEM", "Nationals", "Teamwork"],
  },
  {
    featured: true,
    period: "2024-2025",
    role: "Volunteer",
    company: "AccelRT",
    link: "https://accelrt-v2.vercel.app/",
    location: "Sydney - Hybrid",
    logo: IMG.accelrtLogo,
    logoDark: IMG.accelrtLogo,
    siteImg: IMG.accelrtSite,
    impact: "Multiple events",
    scope: "Australia",
    summary: "Volunteered with AccelRT, a student-run non-profit organising hackathons for students across Australia. Flexible hybrid format balancing school and community work.",
    achievements: [
      "Organised hackathon events connecting students with industry mentors across Australia",
      "Managed event logistics and participant communication end-to-end",
    ],
    tags: ["Events", "Community", "Leadership"],
  },
  {
    featured: false,
    period: "2024",
    role: "Table Reset Volunteer",
    company: "FIRST Robotics",
    link: "https://www.firstlegoleague.org/",
    location: "Sydney - In person",
    logo: IMG.roboticsLogo,
    logoDark: IMG.roboticsLogo,
    siteImg: IMG.roboticsSite,
    summary: "Volunteered at FIRST Robotics APOC (Asia Pacific Open Championship) in a table reset role - fast-paced, time-critical, and collaborative.",
    achievements: [
      "Managed timed table resets across all competition rounds under pressure",
      "Collaborated with international volunteer teams at the Asia Pacific Open Championship",
    ],
    tags: ["Robotics", "STEM", "Teamwork"],
  },
  {
    featured: false,
    period: "2023-2025",
    role: "Barista",
    company: "BBHS Cafe",
    link: "#",
    location: "Blacktown, NSW",
    logo: IMG.cafeLogo,
    logoDark: IMG.cafeLogo,
    siteImg: IMG.cafeSite,
    summary: "Making coffees, shakes and toasties for students and staff at the school cafe - high-volume, fast-paced, customer-first.",
    achievements: [
      "High-volume customer service in a fast-paced school cafe environment",
      "Developed communication, speed and product-delivery skills under daily pressure",
    ],
    tags: ["Customer Service", "F&B"],
  },
  {
    featured: false,
    period: "2024",
    role: "Volunteer",
    company: "City2Surf",
    link: "https://city2surf.com.au/",
    location: "Sydney - In person",
    logo: IMG.city2Logo,
    logoDark: IMG.city2Logo,
    siteImg: IMG.city2Site,
    summary: "Volunteered at City2Surf - one of Australia's largest charity fun runs. Supported runners and operations across the course.",
    achievements: [
      "Supported runners and event operations across the course route",
      "Contributed to one of Australia's largest charity fun runs",
    ],
    tags: ["Charity", "Community", "Events"],
  },
];

export const EDUCATION = [
  { school: "University of New South Wales", link: "#", role: "Bachelor of Computer Science / Law", period: "Upcoming"  },
  { school: "Blacktown Boys High School",    link: "#", role: "Student",                            period: "2020-2025" },
  { school: "Quakers Hill Public School",    link: "#", role: "Advanced & OC streams",              period: "2016-2022" },
];

export const CERTIFICATES = [
  { name: "Chrome DevTools User",                               issuer: "Google", year: "2026", link: "#" },
  { name: "DOM Detective",                                      issuer: "Google", year: "2026", link: "#" },
  { name: "Android Studio User",                                issuer: "Google", year: "2025", link: "#" },
  { name: "Machine Learning Crash Course: Numerical Data",      issuer: "Google", year: "2025", link: "#" },
  { name: "Firebase Studio Developer Community",                issuer: "Google", year: "2025", link: "#" },
  { name: "Machine Learning Crash Course: Classification",      issuer: "Google", year: "2025", link: "#" },
  { name: "Machine Learning Crash Course: Logistic Regression", issuer: "Google", year: "2025", link: "#" },
  { name: "Machine Learning Crash Course: Linear Regression",   issuer: "Google", year: "2025", link: "#" },
  { name: "I/O 2025 - Registered",                              issuer: "Google", year: "2025", link: "#" },
  { name: "Joined the Google Developer Program",                issuer: "Google", year: "2025", link: "#" },
];

export const REFERENCES = [
  {
    name: "Shuwei Guo",
    initials: "SG",
    short: "Vatsal showed real initiative developing advertising plans and contributing to branding discussions. His proactive attitude was genuinely appreciated.",
    text: "I am pleased to recommend Vatsal for his enthusiastic contributions to our team. He has demonstrated initiative by developing advertising plans for our social media platforms and participating in events, where he made valuable efforts to connect with key stakeholders. Additionally, Vatsal made creative contributions to our design team mascot during our branding discussions. His proactive attitude and willingness to support various aspects of our work have been appreciated.",
  },
  {
    name: "Aaron O'Meara",
    initials: "AO",
    short: "Vatsal supported the Team Alliance practice rooms at FLL Asia Pacific Championships with gracious professionalism and consistent initiative throughout the day.",
    text: "Vatsal played a key role in supporting the Team Alliance practice rooms at the 2025 FIRST LEGO League Asia Pacific Championships, ensuring teams adhered to scheduled time slots with gracious professionalism. He also assisted with bump-out tasks, including rearranging furniture and maintaining clean, organised spaces. While encouraged to focus on his assigned responsibilities, he consistently demonstrated initiative and enthusiasm by seeking out additional ways to contribute throughout the day.",
  },
];

export const SKILLS = [
  { name: "JavaScript", site: "https://developer.mozilla.org/docs/Web/JavaScript", logo: "https://cdn.simpleicons.org/javascript" },
  { name: "React", site: "https://react.dev", logo: "https://cdn.simpleicons.org/react" },
  { name: "Python", site: "https://www.python.org", logo: "https://cdn.simpleicons.org/python" },
  { name: "Git", site: "https://git-scm.com", logo: "https://cdn.simpleicons.org/git" },
  { name: "GitHub", site: "https://github.com", logo: "https://cdn.simpleicons.org/github" },
  { name: "Figma", site: "https://www.figma.com", logo: "https://cdn.simpleicons.org/figma" },
  { name: "VS Code", site: "https://code.visualstudio.com", logo: "https://cdn.simpleicons.org/visualstudiocode" },
  { name: "Arc Browser", site: "https://arc.net", logo: "https://cdn.simpleicons.org/arc" },
  { name: "ChatGPT", site: "https://chatgpt.com", logo: "https://cdn.simpleicons.org/openai" },
  { name: "Android Studio", site: "https://developer.android.com/studio", logo: "https://cdn.simpleicons.org/androidstudio" },
  { name: "Kaggle", site: "https://www.kaggle.com", logo: "https://cdn.simpleicons.org/kaggle" },
  { name: "Machine Learning", site: "https://scikit-learn.org", logo: "https://cdn.simpleicons.org/scikitlearn" },
  { name: "Raycast", site: "https://www.raycast.com", logo: "https://cdn.simpleicons.org/raycast" },
  { name: "Notion", site: "https://www.notion.so", logo: "https://cdn.simpleicons.org/notion" },
  { name: "Shapr3D", site: "https://www.shapr3d.com", logo: "https://cdn.simpleicons.org/shapr3d" },
  { name: "Chrome DevTools", site: "https://developer.chrome.com/docs/devtools", logo: "https://cdn.simpleicons.org/googlechrome" },
  { name: "Google Dev Tools", site: "https://developer.chrome.com/docs/devtools", logo: "https://cdn.simpleicons.org/googlechrome" },
  { name: "Firebase", site: "https://firebase.google.com", logo: "https://cdn.simpleicons.org/firebase" },
  { name: "Framer", site: "https://www.framer.com", logo: "https://cdn.simpleicons.org/framer" },
  { name: "JetBrains", site: "https://www.jetbrains.com", logo: "https://cdn.simpleicons.org/jetbrains" },
];

export const GALLERY = [
  { label: "Campfire Hackathon",             caption: "Building, hacking, and vibing - a night to remember.",            src: "/gallery/campfire.jpg"  },
  { label: "Fried Brothers with Friends",    caption: "Good food, great people. The crew at our favourite spot.",         src: "/gallery/fried1.jpg"    },
  { label: "Fried Brothers with Friends",    caption: "Neon lights and fries - peak dining experience.",                 src: "/gallery/fried2.jpg"    },
  { label: "Mock Trial vs James Ruse Ag HS", caption: "Lost by 9 pts - but we held our own in the courtroom.",           src: "/gallery/mocktrial.jpg" },
  { label: "Comp Club UNSW AI Course",       caption: "Learning AI with the Competitive Programming Club at UNSW.",       src: "/gallery/compclub.jpg"  },
  { label: "UNSW AI Conference @ W Sydney",  caption: "Darling Harbour from the W Hotel.",                               src: "/gallery/unsw1.jpg"     },
  { label: "UNSW AI Conference @ W Sydney",  caption: "Night view from the conference - Sydney lit up.",                  src: "/gallery/unsw2.jpg"     },
  { label: "UNSW AI Conference @ W Sydney",  caption: "Sydney Harbour Bridge at night, post-conference.",                src: "/gallery/unsw3.jpg"     },
  { label: "UNSW AI Conference @ W Sydney",  caption: "Panel: NAIC, Future Government, AMP CTO, UNSW AI Director.",      src: "/gallery/unsw4.jpg"     },
  { label: "UNSW AI Conference @ W Sydney",  caption: "Post-conference gelato run - well earned.",                        src: "/gallery/unsw5.jpg"     },
  { label: "UNSW AI Conference @ W Sydney",  caption: "Sydney CBD from the rooftop.",                                    src: "/gallery/unsw6.jpg"     },
  { label: "UNSW AI Conference @ W Sydney",  caption: "Inside the AI panel event at W Sydney Hotel.",                    src: "/gallery/unsw7.jpg"     },
  { label: "Dromca Hangout",                 caption: "Good times, great people.",                                       src: "/gallery/dromca (1).jpg"  },
  { label: "Dromca Hangout",                 caption: "Moments worth remembering.",                                      src: "/gallery/dromca (2).jpg"  },
  { label: "Dromca Hangout",                 caption: "The crew doing what we do.",                                       src: "/gallery/dromca (3).jpg"  },
  { label: "Dromca Hangout",                 caption: "Candid, real, unfiltered.",                                       src: "/gallery/dromca (4).jpg"  },
  { label: "Dromca Hangout",                 caption: "Laughs and good energy all night.",                               src: "/gallery/dromca (5).jpg"  },
  { label: "Dromca Hangout",                 caption: "Squad up.",                                                       src: "/gallery/dromca (6).jpg"  },
  { label: "Dromca Hangout",                 caption: "One of those nights.",                                            src: "/gallery/dromca (7).jpg"  },
  { label: "Dromca Hangout",                 caption: "Always a vibe.",                                                  src: "/gallery/dromca (8).jpg"  },
  { label: "Dromca Hangout",                 caption: "The aftermath of a great time.",                                  src: "/gallery/dromca (9).jpg"  },
  { label: "Dromca Hangout",                 caption: "Everyone's in their element.",                                    src: "/gallery/dromca (10).jpg" },
  { label: "Dromca Hangout",                 caption: "More memories for the books.",                                    src: "/gallery/dromca (11).jpg" },
  { label: "Dromca Hangout",                 caption: "Genuine smiles, genuine people.",                                 src: "/gallery/dromca (12).jpg" },
  { label: "Dromca Hangout",                 caption: "The hangout that needed no agenda.",                              src: "/gallery/dromca (13).jpg" },
  { label: "Dromca Hangout",                 caption: "Golden hours with golden people.",                                src: "/gallery/dromca (14).jpg" },
  { label: "Dromca Hangout",                 caption: "Last one standing.",                                              src: "/gallery/dromca (15).jpg" },
  { label: "Scrapyard Hackathon",            caption: "Hackathon, fun times, school spirit.",                            src: "https://framerusercontent.com/images/zVJ0xEO14uoYedqzRcyE2u3LDBs.jpg?scale-down-to=1024" },
  { label: "Multicultural Day",              caption: "Explosion of culture, food, ethnicity.",                          src: "https://framerusercontent.com/images/sAPlOltwcpel7KaPCn3F0RwlEU.jpg?scale-down-to=1024"  },
  { label: "Athletics Carnival",             caption: "Sport, key event, great times.",                                  src: "https://framerusercontent.com/images/QUj5yg4QAZFH8t6eJb1SJCCE.png?scale-down-to=1024"   },
];

export const PROJECTS = [
  { label: "Flower Animation",   caption: "Frame-by-frame flower animation for multimedia class - 12 FPS.",                                  src: "https://framerusercontent.com/assets/J9mOhxlb8oAWga9V9J7FMk7Y.mp4"  },
  { label: "Square to Triangle", caption: "Shape morphing - combining opposite frames to transition between objects with creative liberty.",   src: "https://framerusercontent.com/assets/Xa80JloFiy8jFUQd7V9kAzma5L4.mp4" },
];

export const CONNECT = [
  { label: "Discord",     val: "brain913",                     icon: "chat", href: "https://discord.com/users/767977600915734530"     },
  { label: "WhatsApp",    val: "Vatsal Mehta",                  icon: "msg",  href: "https://web.whatsapp.com/send/?phone=61493444893" },
  { label: "LinkedIn",    val: "Vatsal Mehta",                  icon: "work", href: "https://linkedin.com/in/brain913"                 },
  { label: "Email",       val: "vatsalplayzforever@gmail.com",  icon: "mail", href: "mailto:vatsalplayzforever@gmail.com"              },
  { label: "Book a Call", val: "cal.com/brain913",              icon: "cal",  href: "https://cal.com/brain913"                         },
];

export const CONNECT_ICONS = {
  chat: "💬", msg: "📱", work: "💼", mail: "✉️", cal: "📅",
};

export const CMD_ITEMS = [
  { section: "Actions", label: "Print Resume", icon: "print", hotkey: "Ctrl+P", action: () => window.print() },
  { section: "Social",  label: "LinkedIn",     icon: "work",  hotkey: "Ctrl+L", action: () => window.open("https://linkedin.com/in/brain913","_blank") },
  { section: "Social",  label: "Email",        icon: "mail",  hotkey: "Ctrl+E", action: () => { window.location.href = "mailto:vatsalplayzforever@gmail.com"; } },
  { section: "Social",  label: "Instagram",    icon: "pic",   hotkey: "",       action: () => window.open("https://instagram.com/brain913","_blank") },
  { section: "Coding",  label: "GitHub",       icon: "code",  hotkey: "",       action: () => window.open("https://github.com/brain913","_blank") },
];

export const CMD_ICON = {
  print: "🖨", work: "💼", mail: "✉️", pic: "📸", code: "🐙",
};
