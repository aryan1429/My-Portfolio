export interface ChatResponse {
    id: string;
    keywords: string[];
    response: string;
    category: 'Technical' | 'Behavioral' | 'Personal' | 'Project' | 'Contact' | 'General';
}

export const chatResponses: ChatResponse[] = [
    // =================================================================================
    // PERSONAL & INTRODUCTION
    // =================================================================================
    {
        id: 'intro',
        keywords: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'yo', 'sup', 'howdy'],
        response: "Hello! I'm Aryan's AI assistant. I'm here to answer any questions you have about his work, skills, or experience. How can I help you today?",
        category: 'Personal'
    },
    {
        id: 'identity',
        keywords: ['who are you', 'what are you', 'are you a bot', 'are you real', 'who is this'],
        response: "I am an AI assistant created by Aryan to help visitors navigate his portfolio. I know all about his professional background and projects!",
        category: 'Personal'
    },
    {
        id: 'aryan-identity',
        keywords: ['who is aryan', 'who is he', 'tell me about aryan', 'who is the developer', 'about the author'],
        response: "Aryan Aligeti is a passionate Full Stack Developer and Content Creator based in India. He specializes in building modern web applications and creating engaging digital content.",
        category: 'Personal'
    },
    {
        id: 'age',
        keywords: ['how old', 'age', 'birth', 'birthday', 'when were you born'],
        response: "Aryan prefers to let his work speak for his maturity! But he is a Gen Z developer with a fresh perspective on technology.",
        category: 'Personal'
    },
    {
        id: 'location',
        keywords: ['location', 'where', 'based', 'live', 'city', 'country', 'region', 'timezone'],
        response: "Aryan is based in India (IST timezone). However, he is very comfortable working with remote teams across different time zones.",
        category: 'Personal'
    },
    {
        id: 'languages-spoken',
        keywords: ['languages spoken', 'speak', 'english', 'hindi', 'telugu', 'communication skills'],
        response: "Aryan is fluent in English, Hindi, and Telugu, making him an effective communicator in diverse teams.",
        category: 'Personal'
    },
    {
        id: 'education',
        keywords: ['education', 'degree', 'college', 'university', 'school', 'study', 'graduated', 'major'],
        response: "Aryan has a strong educational background in Computer Science. He is constantly learning and staying updated with the latest industry trends.",
        category: 'Personal'
    },
    {
        id: 'hobbies',
        keywords: ['hobby', 'hobbies', 'fun', 'free time', 'interest', 'outside work', 'weekend'],
        response: "When not coding, Aryan enjoys video editing, gaming, reading sci-fi novels, and exploring new tech gadgets. He's also a bit of a coffee enthusiast.",
        category: 'Personal'
    },
    {
        id: 'coffee',
        keywords: ['coffee', 'tea', 'drink', 'beverage'],
        response: "Aryan is definitely a coffee person! It fuels his coding sessions.",
        category: 'Personal'
    },
    {
        id: 'music',
        keywords: ['music', 'song', 'listen', 'band', 'genre'],
        response: "Aryan enjoys a mix of Lo-Fi beats for coding and energetic tracks for workouts. Music is a big part of his creative process.",
        category: 'Personal'
    },

    // =================================================================================
    // CONTENT CREATION & VIDEO EDITING
    // =================================================================================
    {
        id: 'content-creation-general',
        keywords: ['content creation', 'creator', 'youtube', 'instagram', 'social media', 'influencer'],
        response: "Aryan is a skilled content creator with over 3 years of experience. He understands how to craft engaging narratives and visuals for digital platforms.",
        category: 'Personal'
    },
    {
        id: 'video-editing',
        keywords: ['video editing', 'editor', 'edit video', 'post production', 'cutting'],
        response: "Video editing is one of Aryan's core strengths. He has edited over 100 projects, ranging from short-form reels to long-form documentaries.",
        category: 'Personal'
    },
    {
        id: 'editing-software',
        keywords: ['premiere pro', 'after effects', 'davinci resolve', 'final cut', 'capcut', 'editing tools'],
        response: "Aryan is proficient in industry-standard tools like Adobe Premiere Pro, After Effects, and DaVinci Resolve. He can handle complex color grading, motion graphics, and sound design.",
        category: 'Personal'
    },
    {
        id: 'motion-graphics',
        keywords: ['motion graphics', 'animation', 'vfx', 'visual effects', 'titles'],
        response: "Yes, Aryan can create stunning motion graphics and visual effects using Adobe After Effects to add that extra polish to video projects.",
        category: 'Personal'
    },
    {
        id: 'thumbnail-design',
        keywords: ['thumbnail', 'photoshop', 'graphic design', 'canva', 'cover art'],
        response: "Aryan also designs high-CTR thumbnails using Photoshop and Canva, understanding the psychology behind what makes people click.",
        category: 'Personal'
    },

    // =================================================================================
    // TECHNICAL SKILLS - FRONTEND
    // =================================================================================
    {
        id: 'frontend-general',
        keywords: ['frontend', 'front-end', 'client side', 'ui', 'ux', 'interface'],
        response: "Aryan is an expert in Frontend Development, focusing on creating responsive, accessible, and performant user interfaces.",
        category: 'Technical'
    },
    {
        id: 'react',
        keywords: ['react', 'reactjs', 'jsx', 'hooks', 'components'],
        response: "React is Aryan's primary library. He has deep knowledge of Hooks, Context API, Custom Hooks, and performance optimization techniques like memoization.",
        category: 'Technical'
    },
    {
        id: 'typescript',
        keywords: ['typescript', 'ts', 'types', 'typing'],
        response: "Aryan uses TypeScript in almost all his projects to ensure type safety, better developer experience, and fewer runtime bugs.",
        category: 'Technical'
    },
    {
        id: 'nextjs',
        keywords: ['next.js', 'nextjs', 'ssr', 'ssg', 'server side rendering'],
        response: "Aryan is experienced with Next.js for building SEO-friendly, high-performance applications using Server Side Rendering (SSR) and Static Site Generation (SSG).",
        category: 'Technical'
    },
    {
        id: 'html-css',
        keywords: ['html', 'css', 'html5', 'css3', 'markup', 'style'],
        response: "He has a solid foundation in semantic HTML5 and modern CSS3, including Flexbox, Grid, and animations.",
        category: 'Technical'
    },
    {
        id: 'tailwind',
        keywords: ['tailwind', 'tailwindcss', 'utility classes', 'styling'],
        response: "Tailwind CSS is Aryan's go-to framework for styling. He loves its utility-first approach for rapid UI development.",
        category: 'Technical'
    },
    {
        id: 'shadcn',
        keywords: ['shadcn', 'shadcn/ui', 'radix', 'ui components'],
        response: "Aryan frequently uses Shadcn/UI (which this portfolio uses!) for building accessible and customizable component libraries.",
        category: 'Technical'
    },
    {
        id: 'state-management',
        keywords: ['redux', 'zustand', 'context', 'mobx', 'recoil', 'state'],
        response: "For state management, Aryan prefers Zustand for its simplicity, but is also proficient with Redux Toolkit and React Context API.",
        category: 'Technical'
    },

    // =================================================================================
    // TECHNICAL SKILLS - BACKEND
    // =================================================================================
    {
        id: 'backend-general',
        keywords: ['backend', 'back-end', 'server side', 'api', 'database'],
        response: "Aryan is a capable Backend Developer who can build robust, scalable APIs and manage databases effectively.",
        category: 'Technical'
    },
    {
        id: 'nodejs',
        keywords: ['node', 'nodejs', 'node.js', 'runtime', 'javascript backend'],
        response: "Aryan uses Node.js for building scalable network applications. He understands the event loop, streams, and asynchronous programming deeply.",
        category: 'Technical'
    },
    {
        id: 'express',
        keywords: ['express', 'expressjs', 'middleware', 'routing'],
        response: "Express.js is his framework of choice for building RESTful APIs due to its flexibility and vast ecosystem.",
        category: 'Technical'
    },
    {
        id: 'python',
        keywords: ['python', 'py', 'django', 'flask', 'fastapi'],
        response: "Aryan is proficient in Python, using it for scripting, automation, and backend development with frameworks like Django or Flask.",
        category: 'Technical'
    },
    {
        id: 'databases',
        keywords: ['database', 'db', 'sql', 'nosql', 'storage'],
        response: "He works with both SQL (PostgreSQL, MySQL) and NoSQL (MongoDB, Firebase) databases, choosing the right tool for the job.",
        category: 'Technical'
    },
    {
        id: 'mongodb',
        keywords: ['mongo', 'mongodb', 'mongoose', 'document db'],
        response: "Aryan has extensive experience with MongoDB for flexible, schema-less data storage, often using Mongoose for object modeling.",
        category: 'Technical'
    },
    {
        id: 'firebase',
        keywords: ['firebase', 'firestore', 'auth', 'google cloud'],
        response: "He uses Firebase for rapid prototyping, real-time databases, and handling authentication securely.",
        category: 'Technical'
    },

    // =================================================================================
    // TECHNICAL SKILLS - TOOLS & DEVOPS
    // =================================================================================
    {
        id: 'git',
        keywords: ['git', 'github', 'gitlab', 'version control', 'commit', 'branch'],
        response: "Git is essential. Aryan follows best practices for version control, including branching strategies, meaningful commits, and pull requests.",
        category: 'Technical'
    },
    {
        id: 'docker',
        keywords: ['docker', 'container', 'containerization', 'kubernetes', 'k8s'],
        response: "Aryan uses Docker to containerize applications, ensuring consistency across development, testing, and production environments.",
        category: 'Technical'
    },
    {
        id: 'cloud-platforms',
        keywords: ['aws', 'amazon web services', 'gcp', 'google cloud', 'azure', 'cloud'],
        response: "He has practical experience deploying and managing applications on cloud platforms like AWS (EC2, S3) and Google Cloud Platform.",
        category: 'Technical'
    },
    {
        id: 'vscode',
        keywords: ['vscode', 'visual studio code', 'editor', 'ide'],
        response: "VS Code is his daily driver, customized with extensions for productivity, linting, and debugging.",
        category: 'Technical'
    },
    {
        id: 'figma',
        keywords: ['figma', 'design tool', 'prototyping', 'wireframe'],
        response: "Aryan uses Figma to collaborate with designers and inspect designs for pixel-perfect implementation.",
        category: 'Technical'
    },

    // =================================================================================
    // PROJECTS
    // =================================================================================
    {
        id: 'projects-general',
        keywords: ['project', 'portfolio', 'work', 'case study', 'built', 'showcase'],
        response: "Aryan has built a variety of projects ranging from e-commerce sites to AI-powered tools. Check out the 'Tech Projects' page for a full gallery.",
        category: 'Project'
    },
    {
        id: 'portfolio-site',
        keywords: ['this website', 'this site', 'portfolio tech stack', 'how was this made'],
        response: "This portfolio is built with React, TypeScript, Tailwind CSS, and Shadcn/UI. It features a custom AI chatbot (me!) and integrates with EmailJS for contact.",
        category: 'Project'
    },
    {
        id: 'ecommerce',
        keywords: ['ecommerce', 'shop', 'store', 'cart', 'payment'],
        response: "Aryan has built full-stack e-commerce solutions featuring product management, shopping carts, and secure payment gateway integrations.",
        category: 'Project'
    },
    {
        id: 'chat-app',
        keywords: ['chat app', 'messaging', 'realtime', 'socket', 'socket.io'],
        response: "He has developed real-time chat applications using Socket.io, demonstrating his ability to handle WebSocket connections and live data updates.",
        category: 'Project'
    },
    {
        id: 'ai-projects',
        keywords: ['ai project', 'artificial intelligence', 'ml', 'machine learning', 'bot'],
        response: "Aryan is exploring AI integration, as seen in this very chatbot which uses keyword analysis to provide instant responses.",
        category: 'Project'
    },

    // =================================================================================
    // EXPERIENCE & CAREER
    // =================================================================================
    {
        id: 'experience',
        keywords: ['experience', 'years', 'work history', 'career', 'job'],
        response: "Aryan has gained valuable experience through freelance projects, internships, and personal development. He is ready to tackle professional challenges.",
        category: 'Technical'
    },
    {
        id: 'freelance',
        keywords: ['freelance', 'contract', 'client work', 'upwork', 'fiverr'],
        response: "As a freelancer, Aryan has delivered high-quality web and video solutions to clients, managing timelines and requirements effectively.",
        category: 'Technical'
    },
    {
        id: 'internship',
        keywords: ['intern', 'internship', 'training'],
        response: "He is open to and actively looking for internship opportunities to further hone his skills in a professional environment.",
        category: 'Contact'
    },

    // =================================================================================
    // BEHAVIORAL & SOFT SKILLS
    // =================================================================================
    {
        id: 'problem-solving',
        keywords: ['problem solving', 'debug', 'fix', 'troubleshoot'],
        response: "Aryan loves a good challenge. He approaches problems systematically, breaking them down into smaller, manageable parts.",
        category: 'Behavioral'
    },
    {
        id: 'learning',
        keywords: ['learn', 'learning', 'study', 'new tech', 'adapt'],
        response: "He is a fast learner who adapts quickly to new technologies. In this fast-paced industry, his ability to learn is his biggest asset.",
        category: 'Behavioral'
    },
    {
        id: 'teamwork',
        keywords: ['team', 'collaboration', 'group', 'partner'],
        response: "Aryan is a team player who values open communication, code reviews, and mutual support to achieve project goals.",
        category: 'Behavioral'
    },
    {
        id: 'work-ethic',
        keywords: ['work ethic', 'hard working', 'discipline', 'motivation'],
        response: "He is self-motivated and disciplined, capable of working independently or leading initiatives when required.",
        category: 'Behavioral'
    },

    // =================================================================================
    // CONTACT & AVAILABILITY
    // =================================================================================
    {
        id: 'contact-method',
        keywords: ['contact', 'email', 'phone', 'call', 'message', 'reach'],
        response: "The best way to reach Aryan is via the contact form on this site or by emailing aryanaligetibusiness@gmail.com.",
        category: 'Contact'
    },
    {
        id: 'hiring',
        keywords: ['hire', 'job offer', 'vacancy', 'position', 'recruit'],
        response: "Aryan is currently open to new opportunities! If you have a role that fits his skills, he'd love to hear from you.",
        category: 'Contact'
    },
    {
        id: 'resume-cv',
        keywords: ['resume', 'cv', 'curriculum vitae', 'download resume'],
        response: "You can find his Resume in the navigation menu. It contains a detailed breakdown of his skills and experience.",
        category: 'Contact'
    },
    {
        id: 'socials',
        keywords: ['linkedin', 'github', 'twitter', 'instagram', 'social media'],
        response: "You can find links to Aryan's LinkedIn, GitHub, and other social profiles in the footer or the 'Contact' section.",
        category: 'Contact'
    },

    // =================================================================================
    // FUN & RANDOM
    // =================================================================================
    {
        id: 'joke',
        keywords: ['joke', 'tell me a joke', 'funny', 'laugh', 'humor'],
        response: "Why did the developer go broke? Because he used up all his cache! 😂",
        category: 'General'
    },
    {
        id: 'favorite-tech',
        keywords: ['favorite tech', 'favorite language', 'best tool'],
        response: "Right now, Aryan is really enjoying the React + TypeScript + Tailwind combo. It makes development feel like a superpower.",
        category: 'Personal'
    },
    {
        id: 'inspiration',
        keywords: ['inspire', 'inspiration', 'role model', 'hero'],
        response: "Aryan is inspired by the open-source community and creators who build tools that empower others.",
        category: 'Personal'
    },
    {
        id: 'secret',
        keywords: ['secret', 'easter egg', 'hidden'],
        response: "The secret to great code? Coffee, consistency, and reading the documentation! 🤫",
        category: 'General'
    },
    {
        id: 'meaning-of-life',
        keywords: ['meaning of life', '42', 'universe'],
        response: "42. But for a developer, it's probably 'Hello World'.",
        category: 'General'
    },
    {
        id: 'thanks',
        keywords: ['thanks', 'thank you', 'thx', 'appreciate it', 'cool', 'awesome'],
        response: "You're welcome! Let me know if you have any other questions about Aryan.",
        category: 'General'
    },
    {
        id: 'bye',
        keywords: ['bye', 'goodbye', 'see ya', 'later', 'exit', 'quit'],
        response: "Goodbye! Thanks for visiting Aryan's portfolio. Have a great day!",
        category: 'General'
    }
];

export const findResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();

    // 1. Exact keyword match (highest priority)
    for (const item of chatResponses) {
        // Check if any keyword is contained in the input string
        if (item.keywords.some(k => lowerInput.includes(k.toLowerCase()))) {
            return item.response;
        }
    }

    // 2. Fallback
    return "I'm not sure about that, but I'm constantly learning! You can ask me about Aryan's skills, projects, content creation experience, or contact info.";
};
