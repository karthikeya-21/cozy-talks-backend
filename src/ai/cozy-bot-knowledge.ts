type KnowledgeEntry = {
  id: string;
  keywords: string[];
  answer: string;
};

export const cozyBotKnowledge: KnowledgeEntry[] = [
  {
    id: "app-overview",
    keywords: ["cozytalks", "what is cozytalks", "about cozytalks", "what is this app", "about this app", "chat app"],
    answer:
      "CozyTalks is a rebuilt realtime chat application with a Next.js frontend and a NestJS backend. It supports registration, login, profile management, chat requests, connected users, realtime messaging, image sharing, emoji, unread indicators, and responsive chat screens.",
  },
  {
    id: "register",
    keywords: ["register", "signup", "sign up", "create account", "join"],
    answer:
      "To create an account, open the Register page, enter your name, email, and password, then submit the form. After signup, you can log in and start using the chat app.",
  },
  {
    id: "login",
    keywords: ["login", "log in", "signin", "sign in"],
    answer:
      "Use your registered email and password on the Login page. After a successful login, CozyTalks loads your chat workspace and contacts.",
  },
  {
    id: "chat-request",
    keywords: ["chat request", "request user", "connect user", "add user", "send request", "discover people", "discover"],
    answer:
      "To connect with someone, find them in the Discover panel and send a chat request. Once they approve it, they move into your Connected Users list and you can message them.",
  },
  {
    id: "approve-request",
    keywords: ["approve request", "reject request", "notifications", "pending request", "receive request"],
    answer:
      "Pending chat requests appear in the Notifications or Requests panel. From there, you can approve or reject incoming requests, and approved users become messageable connections.",
  },
  {
    id: "connected-users",
    keywords: ["connected users", "contacts", "sidebar", "contact list", "pinned bot"],
    answer:
      "Your approved contacts appear in the Connected Users list on the left side of chat. That list also supports search, unread indicators, and keeps Cozy Bot pinned to the top.",
  },
  {
    id: "cant-message",
    keywords: ["can't message", "cannot message", "why can't i message", "not able to message", "users must be connected"],
    answer:
      "You can message only approved connections. If someone is still in pending requests or not connected yet, send or accept the chat request first.",
  },
  {
    id: "profile",
    keywords: ["profile", "update profile", "change name", "change email", "avatar"],
    answer:
      "You can update your account details from the Profile section. That page lets you change fields like name, email, password, and avatar if the backend accepts the update.",
  },
  {
    id: "profile-photo",
    keywords: ["profile photo", "avatar upload", "upload photo", "remove photo", "change photo"],
    answer:
      "The Profile page lets you choose an image file, upload it as your avatar, and also remove the current profile photo if needed.",
  },
  {
    id: "reset-password",
    keywords: ["reset password", "forgot password", "change password", "password"],
    answer:
      "If you forgot your password, use the Forgot Password or Reset Password flow from the auth pages. If you are logged in, you can usually change your password from your profile settings.",
  },
  {
    id: "image-upload",
    keywords: ["image", "photo", "upload", "send image", "attachment"],
    answer:
      "The chat composer supports image sending. Choose an image, wait for it to upload, then send it into the conversation.",
  },
  {
    id: "emoji",
    keywords: ["emoji", "emojis", "smile", "picker"],
    answer:
      "The chat composer includes an emoji picker. Open it from the composer actions, tap an emoji, and it gets inserted into your current message text.",
  },
  {
    id: "lightbox",
    keywords: ["lightbox", "preview image", "open image", "view image"],
    answer:
      "Images sent in chat can be previewed and opened in a larger lightbox view so they are easier to inspect.",
  },
  {
    id: "presence",
    keywords: ["online", "offline", "presence", "last seen", "status"],
    answer:
      "CozyTalks shows realtime presence updates. Connected users can appear as online or offline, and the app can show last seen information when they are not online.",
  },
  {
    id: "unread",
    keywords: ["unread", "badge", "new messages", "message count"],
    answer:
      "The chat list keeps local unread indicators so you can see which conversations received messages while they were not active.",
  },
  {
    id: "mobile",
    keywords: ["mobile", "phone", "responsive", "small screen", "bottom navigation"],
    answer:
      "The rebuilt chat UI is responsive. On smaller screens it collapses sections and uses mobile-friendly navigation patterns so the chat remains usable on phones.",
  },
  {
    id: "delete-account",
    keywords: ["delete account", "remove account", "close account"],
    answer:
      "The Profile area includes a delete-account flow. It asks for password confirmation before permanently removing the account through the backend.",
  },
  {
    id: "landing",
    keywords: ["home page", "landing page", "landing", "welcome page"],
    answer:
      "The home page is a branded landing screen with entry points for login and registration, plus cards that highlight the rebuilt CozyTalks experience.",
  },
  {
    id: "stack",
    keywords: ["tech stack", "stack", "nextjs", "nestjs", "prisma", "socket io", "postgres"],
    answer:
      "CozyTalks is rebuilt with a Next.js frontend and a NestJS backend. It uses Prisma with PostgreSQL, JWT-based auth, Socket.IO for realtime updates, and local file uploads for images.",
  },
  {
    id: "setup",
    keywords: ["setup", "run locally", "local setup", "start backend", "start frontend", "env"],
    answer:
      "For local setup, run the Nest backend on port 3001 and the Next frontend on port 3000. The frontend uses NEXT_PUBLIC_BACKEND_URL to point at the backend, and the backend needs database and JWT environment variables.",
  },
  {
    id: "seed",
    keywords: ["seed", "demo account", "sample user", "karthik", "akhila", "rahul", "sanjana"],
    answer:
      "The backend seed script creates demo users, starter connections, and starter messages so the app can be explored quickly during local development.",
  },
  {
    id: "developer-name",
    keywords: ["who is the developer", "developer name", "about karthik", "who built this", "karthikeya"],
    answer:
      "The developer is Deekonda Karthikeya from Hyderabad, Telangana. He is a Computer Science graduate in AI and ML with practical experience in enterprise software development and full-stack web applications.",
  },
  {
    id: "developer-summary",
    keywords: ["developer summary", "tell me about the developer", "about the developer", "profile summary"],
    answer:
      "Karthikeya's background combines AI and ML academics with hands-on backend and full-stack engineering. His resume highlights problem-solving, web technologies, scalable backend systems, performance, data security, and software development methodology.",
  },
  {
    id: "developer-current-role",
    keywords: ["current role", "current job", "where does he work", "ofss", "oracle financial services", "associate consultant"],
    answer:
      "Karthikeya is working as an Associate Consultant at Oracle Financial Services Software since June 2024. His work includes customizing Oracle FLEXCUBE backend workflows, building client-specific logic, and improving file ingestion and backend processing pipelines.",
  },
  {
    id: "developer-internship",
    keywords: ["internship", "simplify", "software engineering intern", "django rest framework", "sow platform"],
    answer:
      "He also worked as a Software Engineering Intern at Simplify from September 2023 to May 2024, where he built backend APIs for document and workflow management using Django and Django REST Framework and improved API performance.",
  },
  {
    id: "developer-skills",
    keywords: ["skills", "developer skills", "programming languages", "tech skills", "backend skills"],
    answer:
      "His resume lists Python, C++, SQL, and Java as programming languages. It also includes MySQL, PL or SQL, MongoDB, Firebase, Git, GitHub, Netlify, Vercel, Render, REST APIs, backend development, debugging, problem solving, HTML, CSS, JavaScript, PHP, Node.js, Express.js, WordPress, and React.js.",
  },
  {
    id: "developer-education",
    keywords: ["education", "college", "degree", "cgpa", "vardhaman"],
    answer:
      "Karthikeya completed a Bachelor of Technology in Computer Science with AI and ML from Vardhaman College of Engineering between 2020 and 2024, with a CGPA of 8.49.",
  },
  {
    id: "developer-projects",
    keywords: ["projects", "resume projects", "portfolio projects", "what projects"],
    answer:
      "His resume highlights three main projects: Deep Fake Video Detection, Know Your Car, and Dream Home Locator. These cover machine learning, backend APIs, multi-platform app development, and search or filtering systems.",
  },
  {
    id: "developer-deepfake-project",
    keywords: ["deep fake", "deepfake", "video detection", "ml project", "aws project"],
    answer:
      "In the Deep Fake Video Detection project, Karthikeya worked on a machine learning system for detecting deepfake videos. The project involved Python, machine learning, PHP, and AWS, and the resume mentions achieving over 70 percent accuracy under resource constraints.",
  },
  {
    id: "developer-know-your-car",
    keywords: ["know your car", "car project", "flutter", "react", "node", "mongodb", "firebase"],
    answer:
      "Know Your Car is a multi-platform web and mobile project built with React and Flutter on top of a shared Node.js backend. The resume says it used MongoDB, Firebase, and an EJS-based admin interface for managing car listings.",
  },
  {
    id: "developer-dream-home",
    keywords: ["dream home locator", "property project", "php mysql", "real estate project"],
    answer:
      "Dream Home Locator is a PHP and MySQL-based project focused on property listings and search filters. The resume notes backend filtering and query improvements that improved search relevance and reduced unnecessary data retrieval.",
  },
  {
    id: "cozy-bot",
    keywords: ["cozy bot", "who are you", "what can you do", "bot"],
    answer:
      "I am Cozy Bot, your built-in chat helper inside CozyTalks. I can answer app-help questions from local knowledge, and I can be connected to an AI model later for smarter replies.",
  },
];

function normalizeText(message: string) {
  return message.toLowerCase();
}

function tokenize(message: string) {
  return normalizeText(message).match(/[a-z0-9]+/g) ?? [];
}

export function findKnowledgeAnswer(message: string) {
  const normalized = normalizeText(message);
  const tokens = new Set(tokenize(message));

  let bestMatch: { score: number; answer: string } | null = null;

  for (const entry of cozyBotKnowledge) {
    const score = entry.keywords.reduce((total, keyword) => {
      const keywordTokens = tokenize(keyword);
      const phraseMatch = normalized.includes(keyword) ? 2 : 0;
      const tokenMatches = keywordTokens.reduce((matches, token) => matches + (tokens.has(token) ? 1 : 0), 0);
      return total + phraseMatch + tokenMatches;
    }, 0);

    const contentTokenMatches = tokenize(entry.answer).reduce(
      (matches, token) => matches + (tokens.has(token) ? 1 : 0),
      0,
    );
    const totalScore = score + Math.min(contentTokenMatches, 2);

    if (totalScore < 2) {
      continue;
    }

    if (!bestMatch || totalScore > bestMatch.score) {
      bestMatch = {
        score: totalScore,
        answer: entry.answer,
      };
    }
  }

  return bestMatch?.answer ?? null;
}
