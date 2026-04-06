# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------# 🚀 Personal Portfolio Website

A modern, interactive personal portfolio built with React, showcasing experience, projects, skills, and extracurricular activities. Designed with a strong focus on UI/UX, performance, and custom visual effects.

✨ Features
🎨 Dynamic Theme System
Switch between multiple colour themes (green, blue, purple, etc.)
⌨️ Command Palette
Keyboard-accessible command system for navigation and actions
✍️ Typing Animation Hook
Custom hook for animated text cycling in the About section
🌿 Procedural Canvas Background
Animated branching visual effect rendered with HTML5 Canvas
📱 Responsive Design
Optimised for both desktop and mobile experiences
🧠 Modular Data Structure
Easily editable sections for:
Experience
Education
Certificates
Skills
Gallery
Projects
Contact links
🧩 Reusable Components
Clean component structure for scalability and maintainability
🛠️ Tech Stack
Frontend: React (Hooks-based)
Styling: Inline styles (custom design system)
Animations: requestAnimationFrame + custom logic
Tools & Skills Highlighted:
JavaScript
React
Git & GitHub
Python
Figma
VS Code
📂 Project Structure
portfolio.jsx
│
├── Hooks
│   ├── useTyping
│   └── useIsMobile
│
├── Components
│   ├── PlumCanvas
│   ├── CommandPalette
│   ├── SidebarContent
│   └── UI Elements (Tag, SectionHead, etc.)
│
├── Data
│   ├── EXPERIENCE
│   ├── EDUCATION
│   ├── CERTIFICATES
│   ├── SKILLS
│   ├── PROJECTS
│   └── GALLERY
│
└── Constants
    ├── THEMES
    ├── IMG Assets
    └── Navigation Tabs
⚙️ Installation & Setup
Clone the repository:
git clone https://github.com/your-username/portfolio.git
Navigate into the project:
cd portfolio
Install dependencies:
npm install
Run the development server:
npm start
🧠 Key Concepts Used
Custom React Hooks for reusable logic
Canvas API for procedural animation
State Management using useState, useEffect, useRef
Event Handling (keyboard navigation, resizing)
Component Composition for scalable UI
📸 Sections Included
About (with animated typing effect)
Work Experience
Education
References
Tech Stack
Gallery
Projects
Contact / Social Links
🔗 Contact
LinkedIn: https://linkedin.com/in/brain913
Email: vatsalplayzforever@gmail.com
GitHub: https://github.com/brain913
📌 Future Improvements
Add backend for dynamic content
Improve accessibility (ARIA roles, keyboard navigation)
Convert inline styles to a scalable styling system (e.g. Tailwind or CSS modules)
Add animations using a library (Framer Motion)
🧾 License

This project is open-source and available under the MIT License.
