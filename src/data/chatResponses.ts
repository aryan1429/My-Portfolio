export interface ChatResponse {
    id: string;
    keywords: string[];
    response: string;
    category: 'Technical' | 'Behavioral' | 'Personal' | 'Project' | 'Contact' | 'General';
}

export const chatResponses: ChatResponse[] = [
    // --- Personal / Introduction ---
    {
        id: 'intro',
        keywords: ['hello', 'hi', 'hey', 'greetings', 'who are you', 'name'],
        response: "Hello! I'm Aryan's AI assistant. I can answer questions about his skills, projects, and experience. Ask me anything!",
        category: 'Personal'
    },
    {
        id: 'about',
        keywords: ['about', 'tell me about yourself', 'background', 'bio'],
        response: "I'm a passionate Full Stack Developer with experience in React, Node.js, and Cloud technologies. I love building scalable web applications and solving complex problems.",
        category: 'Personal'
    },
    {
        id: 'location',
        keywords: ['location', 'where', 'based', 'live', 'city'],
        response: "I'm based in India, but I'm open to remote opportunities worldwide.",
        category: 'Personal'
    },

    // --- Technical Skills ---
    {
        id: 'skills',
        keywords: ['skills', 'stack', 'technologies', 'tech', 'languages'],
        response: "My core stack includes React, TypeScript, Node.js, and Python. I also have experience with AWS, Google Cloud, Docker, and various databases like MongoDB and PostgreSQL.",
        category: 'Technical'
    },
    {
        id: 'react',
        keywords: ['react', 'frontend', 'ui', 'library'],
        response: "I have extensive experience with React, including hooks, context API, and state management libraries like Redux and Zustand. I focus on building performant and accessible UIs.",
        category: 'Technical'
    },
    {
        id: 'backend',
        keywords: ['backend', 'api', 'server', 'node', 'express'],
        response: "On the backend, I specialize in Node.js and Express to build RESTful APIs. I also have experience with Python (Django/Flask) and serverless functions.",
        category: 'Technical'
    },
    {
        id: 'database',
        keywords: ['database', 'db', 'sql', 'nosql', 'mongo', 'postgres'],
        response: "I'm comfortable working with both SQL (PostgreSQL, MySQL) and NoSQL (MongoDB, Firebase) databases, designing schemas and optimizing queries.",
        category: 'Technical'
    },
    {
        id: 'cloud',
        keywords: ['cloud', 'aws', 'gcp', 'azure', 'deploy'],
        response: "I have practical experience with cloud platforms like GCP and AWS. I've deployed applications using Docker, Kubernetes, and serverless architectures.",
        category: 'Technical'
    },

    // --- Projects ---
    {
        id: 'projects',
        keywords: ['project', 'work', 'portfolio', 'built', 'app'],
        response: "You can view my detailed projects on the 'Tech Projects' page. Highlights include a full-stack e-commerce platform and a real-time chat application.",
        category: 'Project'
    },
    {
        id: 'best-project',
        keywords: ['best project', 'favorite project', 'proud'],
        response: "One of my favorite projects is this portfolio itself! It showcases my ability to integrate modern UI libraries like Shadcn with a robust React architecture.",
        category: 'Project'
    },

    // --- Contact / Hiring ---
    {
        id: 'contact',
        keywords: ['contact', 'email', 'reach', 'touch', 'hire'],
        response: "You can reach me via the Contact page form, or email me directly at aryan@example.com (placeholder). I'm always open to discussing new opportunities.",
        category: 'Contact'
    },
    {
        id: 'resume',
        keywords: ['resume', 'cv', 'download'],
        response: "You can view and download my resume from the 'Resume' section of this site.",
        category: 'Contact'
    },
    {
        id: 'availability',
        keywords: ['available', 'start', 'when'],
        response: "I am currently available for freelance work and full-time positions. Let's chat about your timeline!",
        category: 'Contact'
    },

    // --- Behavioral ---
    {
        id: 'strength',
        keywords: ['strength', 'strong', 'good at'],
        response: "My greatest strength is my problem-solving ability and adaptability. I enjoy diving into new technologies and finding efficient solutions to challenging bugs.",
        category: 'Behavioral'
    },
    {
        id: 'weakness',
        keywords: ['weakness', 'improve'],
        response: "I sometimes get too caught up in optimizing code early on. I'm learning to balance perfectionism with shipping speed by focusing on MVP first.",
        category: 'Behavioral'
    },
    {
        id: 'teamwork',
        keywords: ['team', 'collaborate', 'work with others'],
        response: "I thrive in collaborative environments. I believe clear communication and code reviews are essential for a healthy engineering culture.",
        category: 'Behavioral'
    },
    {
        id: 'challenge',
        keywords: ['challenge', 'difficult', 'hardest'],
        response: "I once had to debug a complex memory leak in a Node.js service. By using profiling tools and systematic testing, I identified the culprit and reduced memory usage by 40%.",
        category: 'Behavioral'
    },

    // --- Fun / Random ---
    {
        id: 'hobby',
        keywords: ['hobby', 'fun', 'free time', 'interest'],
        response: "Outside of coding, I enjoy gaming, reading sci-fi novels, and exploring new coffee shops.",
        category: 'Personal'
    },
    {
        id: 'joke',
        keywords: ['joke', 'funny'],
        response: "Why do programmers prefer dark mode? Because light attracts bugs!",
        category: 'General'
    }
];

export const findResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();

    // 1. Exact keyword match (highest priority)
    for (const item of chatResponses) {
        if (item.keywords.some(k => lowerInput.includes(k.toLowerCase()))) {
            return item.response;
        }
    }

    // 2. Fallback
    return "I'm not sure about that, but I'm constantly learning! You can ask me about my skills, projects, or contact info.";
};
