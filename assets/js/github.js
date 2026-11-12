/* ==========================================================================
   GitHub REST API Integration, Dynamic Classifier, Explorer & Dashboard
   Profile: https://github.com/Vipuldhurvey (No personal access token required)
   ========================================================================== */
(function (window, document) {
  'use strict';

  const USERNAME = 'Vipuldhurvey';
  const API_USER_URL = `https://api.github.com/users/${USERNAME}`;
  const API_REPOS_URL = `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`;
  const API_EVENTS_URL = `https://api.github.com/users/${USERNAME}/events/public?per_page=30`;
  const CACHE_KEY = 'bk-gh-portfolio-cache-v1';
  const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
  const PAGE_SIZE = 9;

  const VISUALS = {
    frontend: 'assets/images/projects/frontend-showcase.jpg',
    javascript: 'assets/images/projects/javascript-interactive.jpg',
    backend: 'assets/images/projects/backend-architecture.jpg',
    java: 'assets/images/projects/java-dsa.jpg',
    ecommerce: 'assets/images/projects/ecommerce-cms.jpg'
  };

  const LANG_COLORS = {
    JavaScript: '#f7df1e',
    HTML: '#e34f26',
    CSS: '#38bdf8',
    Java: '#f97316',
    EJS: '#a855f7',
    Python: '#3b82f6',
    Other: '#94a3b8'
  };

  // Verified repositories with live static index.html hosted on vipuldhurvey.github.io
  const VERIFIED_PAGES_REPOS = new Set([
    'frontend-portfolio',
    'morrow-form-storefront-upwork',
    'clientdesk-crm-upwork',
    'upwork-projects',
    'luma-support-assistant',
    'aura-3d-configurator',
    'Music-Player',
    'SuperHero-Hunter',
    'StopWatch',
    'Insta',
    'Vipul_Dhurvey_Web',
    'Log-in-form',
    'BMI-Caclulater',
    'Analog-Clock',
    'Alarm-clock',
    'IssueTracker-fronrend',
    'Todo-list-main',
    'Calculater',
    'Todolist_javaScript',
    'Meals-app'
  ]);

  // Known Node/React source-only repos where GitHub Pages serves only README (not a running web app)
  const NON_STATIC_PAGES_REPOS = new Set([
    'Hospital_API',
    'CSV_Upload',
    'Bipul_spin',
    'Placement_Cell',
    'habit_tracker',
    'polling-system-api',
    'Issue_tracker-node',
    'DropdownList',
    'ToolTip-React',
    'Contact-list-react'
  ]);

  // Curated truthful metadata derived directly from inspecting repositories & READMEs
  const REPO_METADATA = {
    'aura-3d-configurator': {
      displayName: 'Aura One — 3D Product Studio',
      description: 'Interactive headphone configurator concept built with HTML, CSS, Vanilla JavaScript, and Three.js featuring procedural 3D finishes and preset controls.',
      categories: ['Featured Projects', 'Web Applications', 'JavaScript Projects'],
      stack: ['HTML5', 'CSS3', 'JavaScript', 'Three.js'],
      visual: VISUALS.ecommerce,
      kind: 'Featured Demo',
      isPractice: false,
      featuredRank: 1
    },
    'luma-support-assistant': {
      displayName: 'Luma — Store Support Assistant',
      description: 'Responsive ecommerce storefront and interactive support assistant prototype with product lookup and local cart interactions in Vanilla JavaScript.',
      categories: ['Featured Projects', 'Web Applications', 'JavaScript Projects'],
      stack: ['HTML5', 'CSS3', 'JavaScript'],
      visual: VISUALS.ecommerce,
      kind: 'Featured Demo',
      isPractice: false,
      featuredRank: 2
    },
    'upwork-projects': {
      displayName: 'Rowwise — CSV Insights Dashboard',
      description: 'Client-side CSV import and order analytics dashboard built with HTML, CSS, and Vanilla JavaScript featuring status filtering and CSV export.',
      categories: ['Featured Projects', 'Web Applications', 'JavaScript Projects', 'Database Projects'],
      stack: ['HTML5', 'CSS3', 'JavaScript', 'CSV Parsing'],
      visual: VISUALS.frontend,
      kind: 'Featured Demo',
      isPractice: false,
      featuredRank: 3
    },
    'clientdesk-crm-upwork': {
      displayName: 'ClientDesk — Contact CRM Demo',
      description: 'Responsive contact and lead management interface with search, status filtering, and localStorage persistence in Vanilla JavaScript.',
      categories: ['Featured Projects', 'Web Applications', 'JavaScript Projects'],
      stack: ['HTML5', 'CSS3', 'JavaScript', 'localStorage'],
      visual: VISUALS.ecommerce,
      kind: 'Featured Demo',
      isPractice: false,
      featuredRank: 4
    },
    'morrow-form-storefront-upwork': {
      displayName: 'Morrow & Form — Storefront Demo',
      description: 'Editorial ecommerce storefront concept with category filtering, search, sorting, and persistent shopping bag interactions.',
      categories: ['Featured Projects', 'Web Applications'],
      stack: ['HTML5', 'CSS3', 'JavaScript'],
      visual: VISUALS.ecommerce,
      kind: 'Featured Demo',
      isPractice: false,
      featuredRank: 5
    },
    'frontend-portfolio': {
      displayName: 'Web Development Portfolio Template',
      description: 'Responsive static portfolio showcase highlighting frontend development layouts and service presentation with zero personal tracking.',
      categories: ['Featured Projects', 'Web Applications'],
      stack: ['HTML5', 'CSS3', 'Responsive UI'],
      visual: VISUALS.frontend,
      kind: 'Portfolio Showcase',
      isPractice: false,
      featuredRank: 6
    },
    'SuperHero-Hunter': {
      displayName: 'SuperHero Hunter',
      description: 'API-powered character search and favorites explorer built with HTML, CSS, and JavaScript.',
      categories: ['Featured Projects', 'Web Applications', 'JavaScript Projects'],
      stack: ['HTML5', 'CSS3', 'JavaScript', 'REST API'],
      visual: VISUALS.javascript,
      kind: 'Web App',
      isPractice: false,
      featuredRank: 7
    },
    'Meals-app': {
      displayName: 'The Meal App',
      description: 'Early Vanilla JavaScript recipe search and meal detail explorer utilizing public meal APIs.',
      categories: ['Featured Projects', 'Web Applications', 'JavaScript Projects'],
      stack: ['HTML5', 'CSS3', 'JavaScript', 'Fetch API'],
      visual: VISUALS.javascript,
      kind: 'Web App',
      isPractice: false,
      featuredRank: 8
    },
    'IssueTracker-fronrend': {
      displayName: 'Issue Tracker Frontend',
      description: 'Lightweight issue tracking web app built with Vanilla JavaScript and refined using Chrome DevTools debugging.',
      categories: ['Web Applications', 'JavaScript Projects'],
      stack: ['HTML5', 'CSS3', 'JavaScript'],
      visual: VISUALS.frontend,
      kind: 'Web App',
      isPractice: false,
      featuredRank: 9
    },
    'Music-Player': {
      displayName: 'Music Player Interface',
      description: 'Responsive music player UI project created during Coding Ninjas Career Camp frontend coursework using Flexbox and CSS layouts.',
      categories: ['Web Applications', 'Learning & Experiments'],
      stack: ['HTML5', 'CSS3', 'Flexbox'],
      visual: VISUALS.javascript,
      kind: 'Coursework Project',
      isPractice: true,
      featuredRank: 10
    },
    'Placement_Cell': {
      displayName: 'Placement Cell Portal',
      description: 'Coding Ninjas Node.js full-stack coursework application for managing student profiles, interviews, and CSV export workflows.',
      categories: ['Backend / API Projects', 'Web Applications', 'JavaScript Projects', 'Database Projects', 'Learning & Experiments'],
      stack: ['Node.js', 'Express', 'EJS', 'Database'],
      visual: VISUALS.backend,
      kind: 'Backend Coursework',
      isPractice: true
    },
    'Hospital_API': {
      displayName: 'Hospital Management API',
      description: 'Node.js REST API coursework project designed for doctor authentication, patient registration, and status reporting.',
      categories: ['Backend / API Projects', 'JavaScript Projects', 'Database Projects', 'Learning & Experiments'],
      stack: ['Node.js', 'Express', 'REST API', 'Database'],
      visual: VISUALS.backend,
      kind: 'Backend Coursework',
      isPractice: true
    },
    'polling-system-api': {
      displayName: 'Polling System API',
      description: 'Node.js skill-test backend API supporting questions, voting options, and vote management endpoints.',
      categories: ['Backend / API Projects', 'JavaScript Projects', 'Database Projects', 'Learning & Experiments'],
      stack: ['Node.js', 'Express', 'REST API'],
      visual: VISUALS.backend,
      kind: 'Backend Coursework',
      isPractice: true
    },
    'EmployeeReviewSystem': {
      displayName: 'Employee Review System',
      description: 'Full-stack Node.js coursework application enabling employee role management and peer performance reviews.',
      categories: ['Backend / API Projects', 'Web Applications', 'JavaScript Projects', 'Database Projects', 'Learning & Experiments'],
      stack: ['Node.js', 'Express', 'JavaScript'],
      visual: VISUALS.backend,
      kind: 'Backend Coursework',
      isPractice: true
    },
    'habit_tracker': {
      displayName: 'Habit Tracker Backend App',
      description: 'Node.js and Express web application for tracking daily habits and weekly streaks.',
      categories: ['Backend / API Projects', 'Web Applications', 'JavaScript Projects', 'Database Projects', 'Learning & Experiments'],
      stack: ['Node.js', 'Express', 'Database'],
      visual: VISUALS.backend,
      kind: 'Backend Coursework',
      isPractice: true
    },
    'Issue_tracker-node': {
      displayName: 'Issue Tracker (Node & EJS)',
      description: 'Server-rendered Node.js and EJS issue tracker project from full-stack backend training.',
      categories: ['Backend / API Projects', 'Web Applications', 'JavaScript Projects', 'Learning & Experiments'],
      stack: ['Node.js', 'EJS', 'Express'],
      visual: VISUALS.backend,
      kind: 'Backend Coursework',
      isPractice: true
    },
    'CSV_Upload': {
      displayName: 'CSV Upload & Viewer',
      description: 'Node.js application for uploading CSV files, parsing tabular records, and searching rows.',
      categories: ['Backend / API Projects', 'Web Applications', 'JavaScript Projects', 'Learning & Experiments'],
      stack: ['Node.js', 'JavaScript', 'CSV'],
      visual: VISUALS.backend,
      kind: 'Backend Coursework',
      isPractice: true
    },
    'ChatAppReact': {
      displayName: 'React Chat Application',
      description: 'Coursework chat interface built while learning component state and messaging flows in React.',
      categories: ['Web Applications', 'JavaScript Projects', 'Learning & Experiments'],
      stack: ['JavaScript', 'React', 'CSS3'],
      visual: VISUALS.frontend,
      kind: 'Coursework Project',
      isPractice: true
    },
    'ResumeBuilder': {
      displayName: 'Resume Builder App',
      description: 'Practice React application for structured resume form input and layout preview.',
      categories: ['Web Applications', 'JavaScript Projects', 'Learning & Experiments'],
      stack: ['JavaScript', 'React', 'CSS3'],
      visual: VISUALS.frontend,
      kind: 'Coursework Project',
      isPractice: true
    },
    'Contact-list-react': {
      displayName: 'Contact List (React)',
      description: 'Coursework contact list CRUD application created while practicing React state management.',
      categories: ['Web Applications', 'JavaScript Projects', 'Learning & Experiments'],
      stack: ['JavaScript', 'React'],
      visual: VISUALS.frontend,
      kind: 'Coursework Project',
      isPractice: true
    },
    'ToolTip-React': {
      displayName: 'Tooltip Component (React)',
      description: 'Interactive React UI component exercise exploring hover positioning and reusable props.',
      categories: ['JavaScript Projects', 'Learning & Experiments'],
      stack: ['JavaScript', 'React'],
      visual: VISUALS.javascript,
      kind: 'Practice Exercise',
      isPractice: true
    },
    'DropdownList': {
      displayName: 'Dropdown Component Exercise',
      description: 'Frontend dropdown menu practice project exploring accessible toggle interactions.',
      categories: ['Web Applications', 'JavaScript Projects', 'Learning & Experiments'],
      stack: ['HTML5', 'CSS3', 'JavaScript'],
      visual: VISUALS.javascript,
      kind: 'Practice Exercise',
      isPractice: true
    },
    'DSA_with_Java': {
      displayName: 'DSA with Java Solutions',
      description: 'Coding Ninjas coursework solutions covering Data Structures and Algorithms implemented in Java.',
      categories: ['Java Projects', 'DSA & Programming', 'Learning & Experiments'],
      stack: ['Java', 'Data Structures', 'Algorithms'],
      visual: VISUALS.java,
      kind: 'Coursework & DSA',
      isPractice: true
    },
    'Introduction_To_Java': {
      displayName: 'Introduction to Java Solutions',
      description: 'Coding Ninjas Java programming fundamentals exercises covering loops, arrays, and core syntax.',
      categories: ['Java Projects', 'DSA & Programming', 'Learning & Experiments'],
      stack: ['Java', 'Core Java'],
      visual: VISUALS.java,
      kind: 'Coursework & DSA',
      isPractice: true
    },
    'JavaSkillTest': {
      displayName: 'Java DSA Skill Test',
      description: 'Java problem-solving solutions for timed algorithmic skill test challenges.',
      categories: ['Java Projects', 'DSA & Programming', 'Learning & Experiments'],
      stack: ['Java', 'DSA'],
      visual: VISUALS.java,
      kind: 'Practice / Assessment',
      isPractice: true
    },
    'java-game': {
      displayName: 'Java Game Exercises',
      description: 'Practice Java mini-programs exploring game logic and object-oriented structure.',
      categories: ['Java Projects', 'DSA & Programming', 'Learning & Experiments'],
      stack: ['Java', 'OOP'],
      visual: VISUALS.java,
      kind: 'Practice Exercise',
      isPractice: true
    },
    'Coding_ninja_DBMS': {
      displayName: 'DBMS Practice Solutions',
      description: 'Coding Ninjas Database Management System coursework exercises and query solutions.',
      categories: ['Database Projects', 'Learning & Experiments'],
      stack: ['DBMS', 'SQL Fundamentals'],
      visual: VISUALS.backend,
      kind: 'Coursework Archive',
      isPractice: true
    },
    'Analog-Clock': {
      displayName: 'Analog Clock with Sound',
      description: 'Vanilla JavaScript analog clock with CSS styling and ticking audio feedback.',
      categories: ['JavaScript Projects', 'Web Applications', 'Learning & Experiments'],
      stack: ['HTML5', 'CSS3', 'JavaScript'],
      visual: VISUALS.javascript,
      kind: 'Practice Project',
      isPractice: true
    },
    'Alarm-clock': {
      displayName: 'Alarm Clock Utility',
      description: 'Browser alarm clock practice project built with HTML, CSS, and Vanilla JavaScript.',
      categories: ['JavaScript Projects', 'Web Applications', 'Learning & Experiments'],
      stack: ['HTML5', 'CSS3', 'JavaScript'],
      visual: VISUALS.javascript,
      kind: 'Practice Project',
      isPractice: true
    },
    'StopWatch': {
      displayName: 'Stopwatch Timer',
      description: 'Minimal stopwatch web utility built with Vanilla JavaScript, CSS3, and HTML5.',
      categories: ['JavaScript Projects', 'Web Applications', 'Learning & Experiments'],
      stack: ['HTML5', 'CSS3', 'JavaScript'],
      visual: VISUALS.javascript,
      kind: 'Practice Project',
      isPractice: true
    },
    'BMI-Caclulater': {
      displayName: 'BMI Calculator',
      description: 'Interactive Body Mass Index calculator web utility built with HTML, CSS, and JavaScript.',
      categories: ['JavaScript Projects', 'Web Applications', 'Learning & Experiments'],
      stack: ['HTML5', 'CSS3', 'JavaScript'],
      visual: VISUALS.javascript,
      kind: 'Practice Utility',
      isPractice: true
    },
    'Calculater': {
      displayName: 'Calculator UI',
      description: 'Clean arithmetic calculator web app built with HTML, CSS, and JavaScript.',
      categories: ['JavaScript Projects', 'Web Applications', 'Learning & Experiments'],
      stack: ['HTML5', 'CSS3', 'JavaScript'],
      visual: VISUALS.javascript,
      kind: 'Practice Utility',
      isPractice: true
    },
    'Todo-list-main': {
      displayName: 'To-Do List App',
      description: 'Interactive task manager practice project built with HTML, CSS, and Vanilla JavaScript.',
      categories: ['JavaScript Projects', 'Web Applications', 'Learning & Experiments'],
      stack: ['HTML5', 'CSS3', 'JavaScript'],
      visual: VISUALS.javascript,
      kind: 'Practice Project',
      isPractice: true
    },
    'Todolist_javaScript': {
      displayName: 'Todo List (First GitHub Repo)',
      description: 'First repository created on GitHub — Vanilla JavaScript task list practicing DOM events.',
      categories: ['JavaScript Projects', 'Web Applications', 'Learning & Experiments'],
      stack: ['HTML5', 'CSS3', 'JavaScript'],
      visual: VISUALS.javascript,
      kind: 'Learning Milestone',
      isPractice: true
    },
    'React-part1': {
      displayName: 'React Milestone 9 Notes & Quiz',
      description: 'Coding Ninjas React Part 1 module study notes and multiple-choice practice solutions.',
      categories: ['Learning & Experiments'],
      stack: ['Study Notes', 'React Basics'],
      visual: VISUALS.frontend,
      kind: 'Study Archive',
      isPractice: true
    },
    'React_part-2': {
      displayName: 'React Milestone 10 Notes & Quiz',
      description: 'Coding Ninjas React Part 2 (Hooks) module study notes and practice solutions.',
      categories: ['Learning & Experiments'],
      stack: ['Study Notes', 'React Hooks'],
      visual: VISUALS.frontend,
      kind: 'Study Archive',
      isPractice: true
    },
    'LinkDin_Skill-Quiz': {
      displayName: 'LinkedIn Skill Quiz Reference',
      description: 'Practice study repository containing technical assessment quiz reference materials.',
      categories: ['Learning & Experiments'],
      stack: ['Study Reference'],
      visual: VISUALS.java,
      kind: 'Study Archive',
      isPractice: true
    },
    'Bipul_spin': {
      displayName: 'First Coding Ninjas Assessment',
      description: 'Initial frontend assessment task completed early during Coding Ninjas training.',
      categories: ['Learning & Experiments'],
      stack: ['HTML5', 'CSS3'],
      visual: VISUALS.frontend,
      kind: 'Coursework Assessment',
      isPractice: true
    },
    'Log-in-form': {
      displayName: 'Simple Login Form UI',
      description: 'Clean login form layout practicing CSS styling and form input structure.',
      categories: ['Learning & Experiments'],
      stack: ['HTML5', 'CSS3'],
      visual: VISUALS.frontend,
      kind: 'CSS Practice',
      isPractice: true
    },
    'Insta': {
      displayName: 'Instagram Layout Practice',
      description: 'Static CSS layout study recreating social feed and profile UI structure.',
      categories: ['Learning & Experiments'],
      stack: ['HTML5', 'CSS3'],
      visual: VISUALS.frontend,
      kind: 'UI Practice',
      isPractice: true
    },
    'Vipul_Dhurvey_Web': {
      displayName: 'Early Web Practice Page',
      description: 'Early static HTML and CSS practice website created during coursework.',
      categories: ['Learning & Experiments'],
      stack: ['HTML5', 'CSS3'],
      visual: VISUALS.frontend,
      kind: 'Learning Exercise',
      isPractice: true
    },
    'Falling-liaves': {
      displayName: 'Falling Leaves Animation Experiment',
      description: 'CSS and HTML visual animation experiment.',
      categories: ['Learning & Experiments'],
      stack: ['HTML5', 'CSS3'],
      visual: VISUALS.javascript,
      kind: 'Experiment',
      isPractice: true
    },
    'Pooja_Project': {
      displayName: 'HTML Layout Experiment',
      description: 'Early HTML structure and page styling practice repository.',
      categories: ['Learning & Experiments'],
      stack: ['HTML5'],
      visual: VISUALS.frontend,
      kind: 'Experiment',
      isPractice: true
    }
  };

  const PORTFOLIO_PROFILE_BIO =
    'Full Stack Developer | Frontend Development | HTML5, CSS3, JavaScript, Java | WordPress & Shopify | Responsive Web Design | Problem Solving | Software Projects';

  // Fallback snapshot used only if GitHub API is unreachable or rate-limited and no cache exists
  const FALLBACK_DATA = {
    user: {
      login: 'vipuldhurvey',
      name: 'Bipul Kumar',
      bio: PORTFOLIO_PROFILE_BIO,
      public_repos: null,
      followers: null,
      following: null,
      avatar_url: 'assets/images/profile-placeholder.png',
      html_url: 'https://github.com/Vipuldhurvey',
      created_at: '2021-10-06T06:24:46Z'
    },
    repos: [
      { name: 'frontend-portfolio', language: 'HTML', description: 'My Portfolio website', homepage: '', has_pages: true, stargazers_count: 0, forks_count: 0, updated_at: '2026-11-06T00:00:00Z', default_branch: 'main', html_url: 'https://github.com/vipuldhurvey/frontend-portfolio', topics: [] },
      { name: 'aura-3d-configurator', language: 'JavaScript', description: 'aura-3d-configurator project', homepage: '', has_pages: true, stargazers_count: 0, forks_count: 0, updated_at: '2026-10-23T00:00:00Z', default_branch: 'main', html_url: 'https://github.com/vipuldhurvey/aura-3d-configurator', topics: [] },
      { name: 'luma-support-assistant', language: 'CSS', description: 'luma-support-assistant', homepage: '', has_pages: true, stargazers_count: 0, forks_count: 0, updated_at: '2026-10-23T00:00:00Z', default_branch: 'main', html_url: 'https://github.com/vipuldhurvey/luma-support-assistant', topics: [] },
      { name: 'upwork-projects', language: 'JavaScript', description: 'upwork-projects', homepage: '', has_pages: true, stargazers_count: 0, forks_count: 0, updated_at: '2026-10-23T00:00:00Z', default_branch: 'main', html_url: 'https://github.com/vipuldhurvey/upwork-projects', topics: [] },
      { name: 'clientdesk-crm-upwork', language: 'HTML', description: 'clientdesk-crm-upwork', homepage: '', has_pages: true, stargazers_count: 0, forks_count: 0, updated_at: '2026-10-23T00:00:00Z', default_branch: 'main', html_url: 'https://github.com/vipuldhurvey/clientdesk-crm-upwork', topics: [] },
      { name: 'morrow-form-storefront-upwork', language: 'HTML', description: 'morrow-form-storefront-upwork', homepage: '', has_pages: true, stargazers_count: 0, forks_count: 0, updated_at: '2026-10-23T00:00:00Z', default_branch: 'main', html_url: 'https://github.com/vipuldhurvey/morrow-form-storefront-upwork', topics: [] },
      { name: 'SuperHero-Hunter', language: 'HTML', description: '', homepage: '', has_pages: true, stargazers_count: 0, forks_count: 0, updated_at: '2023-08-02T00:00:00Z', default_branch: 'main', html_url: 'https://github.com/vipuldhurvey/SuperHero-Hunter', topics: [] },
      { name: 'Meals-app', language: 'JavaScript', description: 'My second repository on github about the meals app', homepage: '', has_pages: true, stargazers_count: 0, forks_count: 0, updated_at: '2023-05-01T00:00:00Z', default_branch: 'main', html_url: 'https://github.com/vipuldhurvey/Meals-app', topics: [] },
      { name: 'Placement_Cell', language: 'JavaScript', description: '', homepage: '', has_pages: true, stargazers_count: 0, forks_count: 0, updated_at: '2023-05-29T00:00:00Z', default_branch: 'main', html_url: 'https://github.com/vipuldhurvey/Placement_Cell', topics: [] },
      { name: 'Hospital_API', language: 'JavaScript', description: '', homepage: '', has_pages: true, stargazers_count: 0, forks_count: 0, updated_at: '2023-07-19T00:00:00Z', default_branch: 'master', html_url: 'https://github.com/vipuldhurvey/Hospital_API', topics: [] },
      { name: 'DSA_with_Java', language: 'Java', description: 'This is solution of coding ninja introduction to java and DSA', homepage: '', has_pages: false, stargazers_count: 0, forks_count: 0, updated_at: '2023-05-01T00:00:00Z', default_branch: 'main', html_url: 'https://github.com/vipuldhurvey/DSA_with_Java', topics: [] },
      { name: 'Coding_ninja_DBMS', language: null, description: 'solutions of coding ninja DBMS', homepage: '', has_pages: false, stargazers_count: 0, forks_count: 0, updated_at: '2023-05-01T00:00:00Z', default_branch: 'main', html_url: 'https://github.com/vipuldhurvey/Coding_ninja_DBMS', topics: [] }
    ],
    events: []
  };

  const state = {
    user: null,
    repos: [],
    events: [],
    category: 'all',
    search: '',
    sort: 'updated',
    visibleCount: PAGE_SIZE,
    sourceMode: 'loading'
  };

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatRepoName(slug) {
    return slug
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function formatDate(iso) {
    if (!iso) return 'Unknown';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return 'Unknown';
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function isValidUrl(url) {
    if (!url || typeof url !== 'string') return false;
    try {
      const parsed = new URL(url.trim());
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }

  function classifyDynamicRepo(raw) {
    const known = REPO_METADATA[raw.name];
    const lang = raw.language || 'Markup / Docs';
    const lowerName = raw.name.toLowerCase();
    const lowerDesc = (raw.description || '').toLowerCase();
    const categories = new Set();

    let displayName = known ? known.displayName : formatRepoName(raw.name);
    let description = known
      ? known.description
      : raw.description && raw.description.trim().length > 3 && raw.description.trim().toLowerCase() !== lowerName
      ? raw.description.trim()
      : `${lang} repository published on GitHub under @${USERNAME}.`;

    if (known) {
      known.categories.forEach((c) => categories.add(c));
    } else {
      if (lang === 'JavaScript') categories.add('JavaScript Projects');
      if (lang === 'Java') {
        categories.add('Java Projects');
        categories.add('DSA & Programming');
      }
      if (/(api|node|backend|server|express)/.test(lowerName + ' ' + lowerDesc)) {
        categories.add('Backend / API Projects');
      }
      if (/(dbms|sql|database|mongo)/.test(lowerName + ' ' + lowerDesc)) {
        categories.add('Database Projects');
      }
      if (/(dsa|algo|quiz|solution|coding ninja|practice|test)/.test(lowerName + ' ' + lowerDesc)) {
        categories.add('DSA & Programming');
        categories.add('Learning & Experiments');
      }
      if (lang === 'HTML' || lang === 'CSS' || raw.has_pages || isValidUrl(raw.homepage)) {
        categories.add('Web Applications');
      }
      if (categories.size === 0) {
        categories.add('Learning & Experiments');
      }
    }

    // Verified live demo URL resolution
    let demoUrl = null;
    if (isValidUrl(raw.homepage)) {
      demoUrl = raw.homepage.trim();
    } else if (raw.has_pages && VERIFIED_PAGES_REPOS.has(raw.name)) {
      demoUrl = `https://vipuldhurvey.github.io/${encodeURIComponent(raw.name)}/`;
    }

    // Visual selection
    let visual = VISUALS.frontend;
    if (known && known.visual) {
      visual = known.visual;
    } else if (categories.has('Backend / API Projects') || categories.has('Database Projects')) {
      visual = VISUALS.backend;
    } else if (categories.has('Java Projects') || categories.has('DSA & Programming')) {
      visual = VISUALS.java;
    } else if (categories.has('JavaScript Projects')) {
      visual = VISUALS.javascript;
    }

    const stack = known
      ? known.stack
      : [raw.language, ...(Array.isArray(raw.topics) ? raw.topics.slice(0, 3) : [])].filter(Boolean);

    if (!stack.length) stack.push('Code & Docs');

    return {
      raw,
      name: raw.name,
      displayName,
      description,
      language: raw.language || 'Other',
      categories: Array.from(categories),
      primaryCategory: Array.from(categories)[0] || 'Learning & Experiments',
      stack,
      visual,
      kind: known ? known.kind : categories.has('Learning & Experiments') ? 'Practice / Repo' : 'Web Project',
      isPractice: known ? known.isPractice : categories.has('Learning & Experiments'),
      featuredRank: known && known.featuredRank ? known.featuredRank : 999,
      stars: Number(raw.stargazers_count || 0),
      forks: Number(raw.forks_count || 0),
      updatedAt: raw.updated_at || raw.pushed_at || '',
      createdAt: raw.created_at || '',
      defaultBranch: raw.default_branch || 'main',
      htmlUrl: raw.html_url || `https://github.com/${USERNAME}/${raw.name}`,
      demoUrl
    };
  }

  // Probe brand-new unknown has_pages repos for index.html without using REST API quota
  async function verifyDynamicPages(repos) {
    const candidates = repos.filter(
      (r) =>
        !r.demoUrl &&
        r.raw.has_pages &&
        !VERIFIED_PAGES_REPOS.has(r.name) &&
        !NON_STATIC_PAGES_REPOS.has(r.name)
    );
    if (!candidates.length) return;

    let updated = false;
    await Promise.all(
      candidates.slice(0, 6).map(async (repo) => {
        try {
          const checkUrl = `https://raw.githubusercontent.com/${USERNAME}/${encodeURIComponent(repo.name)}/${encodeURIComponent(repo.defaultBranch)}/index.html`;
          const res = await fetch(checkUrl, { method: 'HEAD' });
          if (res.ok) {
            repo.demoUrl = `https://vipuldhurvey.github.io/${encodeURIComponent(repo.name)}/`;
            updated = true;
          }
        } catch {
          // Ignore probe errors quietly
        }
      })
    );

    if (updated) {
      renderProjects();
    }
  }

  function loadCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function saveCache(payload) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), ...payload }));
    } catch {
      // Ignore storage quota errors
    }
  }

  async function fetchJson(url) {
    const res = await fetch(url, {
      headers: { Accept: 'application/vnd.github+json' }
    });
    if (!res.ok) {
      const err = new Error(`GitHub API HTTP ${res.status}`);
      err.status = res.status;
      throw err;
    }
    return res.json();
  }

  function updateSyncStatus(mode, label) {
    const statusEl = document.getElementById('github-sync-status');
    if (!statusEl) return;
    statusEl.classList.remove('is-live', 'is-fallback');
    if (mode === 'live' || mode === 'cached') {
      statusEl.classList.add('is-live');
    } else {
      statusEl.classList.add('is-fallback');
    }
    const textSpan = statusEl.querySelector('span:last-child');
    if (textSpan) textSpan.textContent = label;
  }

  function showFallbackBanner(title, message) {
    const banner = document.getElementById('projects-fallback');
    const titleEl = document.getElementById('fallback-title');
    const msgEl = document.getElementById('fallback-message');
    if (!banner) return;
    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;
    banner.hidden = false;
  }

  function renderCategoryCounts() {
    const countMap = { all: state.repos.length };
    const filterButtons = document.querySelectorAll('.filter-chip[data-category]');
    filterButtons.forEach((btn) => {
      const cat = btn.getAttribute('data-category');
      if (cat && cat !== 'all') {
        countMap[cat] = state.repos.filter((r) => r.categories.includes(cat)).length;
      }
      const badge = btn.querySelector('.chip-count');
      if (badge) {
        badge.textContent = String(countMap[cat] ?? 0);
      }
    });
  }

  function getFilteredRepos() {
    const term = state.search.trim().toLowerCase();
    const list = state.repos.filter((repo) => {
      const catMatch = state.category === 'all' || repo.categories.includes(state.category);
      if (!catMatch) return false;
      if (!term) return true;
      const haystack = [
        repo.name,
        repo.displayName,
        repo.description,
        repo.language,
        repo.kind,
        ...repo.categories,
        ...repo.stack
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(term);
    });

    list.sort((a, b) => {
      if (state.sort === 'featured') {
        if (a.featuredRank !== b.featuredRank) return a.featuredRank - b.featuredRank;
      } else if (state.sort === 'stars') {
        if (b.stars !== a.stars) return b.stars - a.stars;
      } else if (state.sort === 'name') {
        return a.displayName.localeCompare(b.displayName);
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    return list;
  }

  function renderProjects() {
    const grid = document.getElementById('projects-grid');
    const emptyEl = document.getElementById('projects-empty');
    const summaryEl = document.getElementById('projects-summary');
    const loadMoreWrap = document.getElementById('load-more-wrap');
    const remainingEl = document.getElementById('load-more-remaining');
    if (!grid) return;

    const filtered = getFilteredRepos();
    const visible = filtered.slice(0, state.visibleCount);

    if (summaryEl) {
      const catText = state.category === 'all' ? 'All Repositories' : state.category;
      summaryEl.textContent = `Showing ${visible.length} of ${filtered.length} repositories in ${catText} (${state.repos.length} total loaded)`;
    }

    if (!filtered.length) {
      grid.innerHTML = '';
      if (emptyEl) emptyEl.hidden = false;
      if (loadMoreWrap) loadMoreWrap.hidden = true;
      return;
    }

    if (emptyEl) emptyEl.hidden = true;

    grid.innerHTML = visible
      .map((repo) => {
        const badgeClass = repo.isPractice ? 'project-kind is-practice' : 'project-kind';
        const tagsHtml = repo.stack
          .slice(0, 4)
          .map((tag, i) => `<span class="project-tag ${i === 0 ? 'is-lang' : ''}">${escapeHtml(tag)}</span>`)
          .join('');

        const demoBtn = repo.demoUrl
          ? `<a href="${escapeHtml(repo.demoUrl)}" target="_blank" rel="noopener noreferrer" class="btn-card is-demo" aria-label="Open live demo for ${escapeHtml(repo.displayName)}">Live Demo &#8599;</a>`
          : '';

        return `
          <article class="project-card glass-card reveal-item" data-tilt data-tilt-max="4" data-repo-name="${escapeHtml(repo.name)}">
            <div class="project-thumb">
              <img src="${escapeHtml(repo.visual)}" alt="Representative visual for ${escapeHtml(repo.displayName)}" loading="lazy" width="960" height="540">
              <div class="project-thumb-overlay">
                <span class="${badgeClass} mono">${escapeHtml(repo.kind)}</span>
                <span class="visual-label mono">Representative Visual</span>
              </div>
            </div>
            <div class="project-body">
              <div class="project-title-row">
                <div>
                  <h3>${escapeHtml(repo.displayName)}</h3>
                  <span class="project-slug mono">${escapeHtml(repo.name)}</span>
                </div>
                <div class="project-stats-mini mono" title="GitHub Stars &amp; Forks">
                  <span>&#9733; ${repo.stars}</span>
                  <span>&#9906; ${repo.forks}</span>
                </div>
              </div>
              <p class="project-desc">${escapeHtml(repo.description)}</p>
              <div class="project-tags">${tagsHtml}</div>
              <div class="project-footer">
                <span class="project-updated mono">Updated ${escapeHtml(formatDate(repo.updatedAt))}</span>
                <div class="project-actions">
                  <button type="button" class="btn-card js-repo-details" data-repo="${escapeHtml(repo.name)}">Details</button>
                  <a href="${escapeHtml(repo.htmlUrl)}" target="_blank" rel="noopener noreferrer" class="btn-card">GitHub</a>
                  ${demoBtn}
                </div>
              </div>
            </div>
          </article>
        `;
      })
      .join('');

    if (loadMoreWrap && remainingEl) {
      const remaining = filtered.length - visible.length;
      loadMoreWrap.hidden = remaining <= 0;
      remainingEl.textContent = remaining > 0 ? `(${remaining} left)` : '';
    }

    if (window.PortfolioAnimations) {
      window.PortfolioAnimations.observeNewReveals(grid);
      window.PortfolioAnimations.initTiltEffects(grid);
    }
  }

  function renderDashboard(user, repos, events) {
    const avatarEl = document.getElementById('gh-avatar');
    const nameEl = document.getElementById('gh-name');
    const bioEl = document.getElementById('gh-bio');
    const joinedEl = document.getElementById('gh-joined');
    const heroRepoCount = document.getElementById('hero-repo-count');

    if (avatarEl && user.avatar_url) {
      avatarEl.src = user.avatar_url;
      avatarEl.onerror = () => {
        avatarEl.src = 'assets/images/profile-placeholder.png';
      };
    }
    if (nameEl) nameEl.textContent = user.name || 'Bipul Kumar';
    if (bioEl) bioEl.textContent = PORTFOLIO_PROFILE_BIO;
    if (joinedEl && user.created_at) {
      joinedEl.textContent = `Member since ${formatDate(user.created_at)} · Public Profile Verified`;
    }

    const hasLiveStats = user.public_repos !== null && user.public_repos !== undefined;
    const repoTotal = hasLiveStats ? Number(user.public_repos) : null;
    const followersTotal = user.followers !== null && user.followers !== undefined ? Number(user.followers) : null;
    const followingTotal = user.following !== null && user.following !== undefined ? Number(user.following) : null;
    const totalStars = repos.reduce((acc, r) => acc + r.stars, 0);
    const totalForks = repos.reduce((acc, r) => acc + r.forks, 0);

    if (heroRepoCount) {
      heroRepoCount.textContent = repoTotal !== null ? `${repoTotal}` : 'GitHub';
    }

    const animate = window.PortfolioAnimations ? window.PortfolioAnimations.animateCounter : (el, v) => { el.textContent = String(v); };
    const statReposEl = document.getElementById('stat-repos');
    const statFollowersEl = document.getElementById('stat-followers');
    const statFollowingEl = document.getElementById('stat-following');
    const engEl = document.getElementById('stat-engagement');
    const engSub = document.getElementById('stat-engagement-sub');

    if (statReposEl) {
      if (repoTotal !== null) animate(statReposEl, repoTotal, 900);
      else statReposEl.textContent = '--';
    }
    if (statFollowersEl) {
      if (followersTotal !== null) animate(statFollowersEl, followersTotal, 900);
      else statFollowersEl.textContent = '--';
    }
    if (statFollowingEl) {
      if (followingTotal !== null) animate(statFollowingEl, followingTotal, 900);
      else statFollowingEl.textContent = '--';
    }
    if (engEl) {
      if (hasLiveStats) animate(engEl, totalStars + totalForks, 900);
      else engEl.textContent = '--';
    }
    if (engSub) {
      engSub.textContent = hasLiveStats
        ? `${totalStars} stars · ${totalForks} forks across repos`
        : 'Live metrics available when connected to GitHub API';
    }

    // Programming Language Distribution
    const langWrap = document.getElementById('github-languages');
    if (langWrap) {
      const counts = {};
      repos.forEach((r) => {
        const key = r.raw.language || 'Other / Docs';
        counts[key] = (counts[key] || 0) + 1;
      });
      const sortedLangs = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);
      const totalForPct = repos.length || 1;

      langWrap.innerHTML = sortedLangs
        .map(([lang, count]) => {
          const pct = Math.round((count / totalForPct) * 100);
          const color = LANG_COLORS[lang] || LANG_COLORS.Other;
          return `
            <div class="lang-row">
              <div class="lang-meta">
                <span class="lang-name"><span class="lang-dot" style="background:${escapeHtml(color)}"></span>${escapeHtml(lang)}</span>
                <span class="mono">${count} repos (${pct}%)</span>
              </div>
              <div class="lang-track">
                <div class="lang-fill" style="width:${pct}%;background:${escapeHtml(color)}"></div>
              </div>
            </div>
          `;
        })
        .join('');
    }

    // Recently Updated List
    const recentWrap = document.getElementById('github-recent-repos');
    if (recentWrap) {
      const topRecent = [...repos]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5);

      recentWrap.innerHTML = topRecent
        .map(
          (repo) => `
          <li class="recent-item">
            <a href="${escapeHtml(repo.htmlUrl)}" target="_blank" rel="noopener noreferrer">
              <span>${escapeHtml(repo.displayName)}</span>
              <span class="mono" style="color:var(--accent-cyan);font-size:0.74rem">${escapeHtml(repo.language)}</span>
            </a>
            <small>Updated ${escapeHtml(formatDate(repo.updatedAt))}</small>
          </li>
        `
        )
        .join('');
    }

    // Public Events Activity Feed
    const activityWrap = document.getElementById('github-activity');
    if (activityWrap) {
      if (Array.isArray(events) && events.length > 0) {
        const cleanEvents = events.slice(0, 5).map((ev) => {
          const repoShort = ev.repo && ev.repo.name ? ev.repo.name.replace(`${USERNAME}/`, '').replace('vipuldhurvey/', '') : 'repository';
          let label = ev.type ? ev.type.replace(/Event$/, '') : 'Activity';
          if (ev.type === 'CreateEvent') label = `Created ${ev.payload?.ref_type || 'branch'} in`;
          if (ev.type === 'PushEvent') label = 'Pushed commits to';
          if (ev.type === 'WatchEvent') label = 'Starred';
          if (ev.type === 'ForkEvent') label = 'Forked';
          return `
            <div class="activity-item">
              <div><strong>${escapeHtml(label)}</strong> <span class="mono">${escapeHtml(repoShort)}</span></div>
              <small>${escapeHtml(formatDate(ev.created_at))}</small>
            </div>
          `;
        });
        activityWrap.innerHTML = cleanEvents.join('');
      } else {
        activityWrap.innerHTML = `
          <div class="activity-item">
            <div>Public event stream shows recent 90-day activity.</div>
            <small>
              <a href="https://github.com/${USERNAME}" target="_blank" rel="noopener noreferrer" class="inline-link">
                View full contribution graph on GitHub &rarr;
              </a>
            </small>
          </div>
        `;
      }
    }
  }

  // Modal Details + On-Demand README Preview (from raw.githubusercontent.com)
  let lastFocusedTrigger = null;

  async function openRepoModal(repoName, triggerEl) {
    const repo = state.repos.find((r) => r.name === repoName);
    if (!repo) return;

    const modal = document.getElementById('project-modal');
    if (!modal) return;
    lastFocusedTrigger = triggerEl || document.activeElement;

    document.getElementById('modal-image').src = repo.visual;
    document.getElementById('modal-image').alt = `Representative visual for ${repo.displayName}`;
    document.getElementById('modal-kind').textContent = repo.kind;
    document.getElementById('modal-kind').className = repo.isPractice ? 'project-kind is-practice mono' : 'project-kind mono';
    document.getElementById('modal-category').textContent = repo.categories.join(' · ');
    document.getElementById('modal-title').textContent = repo.displayName;
    document.getElementById('modal-slug').textContent = `${USERNAME.toLowerCase()}/${repo.name}`;
    document.getElementById('modal-description').textContent = repo.description;

    document.getElementById('modal-stats').innerHTML = `
      <span>Language: <strong>${escapeHtml(repo.language)}</strong></span>
      <span>Stars: <strong>${repo.stars}</strong></span>
      <span>Forks: <strong>${repo.forks}</strong></span>
      <span>Updated: <strong>${escapeHtml(formatDate(repo.updatedAt))}</strong></span>
    `;

    document.getElementById('modal-stack').innerHTML = repo.stack
      .map((item) => `<span class="project-tag">${escapeHtml(item)}</span>`)
      .join('');

    const ghLink = document.getElementById('modal-github-link');
    const demoLink = document.getElementById('modal-demo-link');
    ghLink.href = repo.htmlUrl;
    if (repo.demoUrl) {
      demoLink.href = repo.demoUrl;
      demoLink.hidden = false;
    } else {
      demoLink.hidden = true;
    }

    const readmeStatus = document.getElementById('modal-readme-status');
    const readmeBody = document.getElementById('modal-readme-content');
    readmeStatus.textContent = 'Loading...';
    readmeBody.textContent = 'Fetching README.md from GitHub...';

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    document.getElementById('modal-close').focus();

    try {
      const rawUrl = `https://raw.githubusercontent.com/${USERNAME}/${encodeURIComponent(repo.name)}/${encodeURIComponent(repo.defaultBranch)}/README.md`;
      const res = await fetch(rawUrl);
      if (res.ok) {
        const text = await res.text();
        const cleaned = text.trim();
        readmeStatus.textContent = 'README.md';
        readmeBody.textContent = cleaned ? cleaned.slice(0, 1400) + (cleaned.length > 1400 ? '\n\n... (view full README on GitHub)' : '') : 'README file is empty.';
      } else {
        readmeStatus.textContent = 'No README';
        readmeBody.textContent = 'No README.md file found in the default branch. Inspect source files directly on GitHub.';
      }
    } catch {
      readmeStatus.textContent = 'Unavailable';
      readmeBody.textContent = 'Unable to load README preview right now. Open the repository on GitHub to view full documentation.';
    }
  }

  function closeRepoModal() {
    const modal = document.getElementById('project-modal');
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === 'function') {
      lastFocusedTrigger.focus();
    }
  }

  function bindControls() {
    const searchInput = document.getElementById('project-search');
    const clearBtn = document.getElementById('clear-search');
    const sortSelect = document.getElementById('project-sort');
    const filterContainer = document.getElementById('category-filters');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const resetBtn = document.getElementById('reset-filters-btn');
    const grid = document.getElementById('projects-grid');
    const modal = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.search = e.target.value;
        state.visibleCount = PAGE_SIZE;
        if (clearBtn) clearBtn.hidden = !state.search.length;
        renderProjects();
      });
    }

    if (clearBtn && searchInput) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        state.search = '';
        clearBtn.hidden = true;
        state.visibleCount = PAGE_SIZE;
        renderProjects();
        searchInput.focus();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        state.sort = e.target.value;
        state.visibleCount = PAGE_SIZE;
        renderProjects();
      });
    }

    if (filterContainer) {
      filterContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-chip[data-category]');
        if (!btn) return;
        filterContainer.querySelectorAll('.filter-chip').forEach((el) => {
          el.classList.remove('is-active');
          el.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
        state.category = btn.getAttribute('data-category') || 'all';
        state.visibleCount = PAGE_SIZE;
        renderProjects();
      });
    }

    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        state.visibleCount += PAGE_SIZE;
        renderProjects();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        state.category = 'all';
        state.search = '';
        state.visibleCount = PAGE_SIZE;
        if (searchInput) searchInput.value = '';
        if (clearBtn) clearBtn.hidden = true;
        if (filterContainer) {
          filterContainer.querySelectorAll('.filter-chip').forEach((el) => {
            const isAll = el.getAttribute('data-category') === 'all';
            el.classList.toggle('is-active', isAll);
            el.setAttribute('aria-selected', isAll ? 'true' : 'false');
          });
        }
        renderProjects();
      });
    }

    if (grid) {
      grid.addEventListener('click', (e) => {
        const detailBtn = e.target.closest('.js-repo-details');
        if (detailBtn) {
          openRepoModal(detailBtn.getAttribute('data-repo'), detailBtn);
          return;
        }
        const thumb = e.target.closest('.project-thumb');
        if (thumb) {
          const card = thumb.closest('.project-card');
          if (card) {
            const trigger = card.querySelector('.js-repo-details');
            openRepoModal(card.getAttribute('data-repo-name'), trigger || card);
          }
        }
      });
    }

    if (modalClose) modalClose.addEventListener('click', closeRepoModal);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeRepoModal();
      });
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeRepoModal();
    });
  }

  async function initGitHubPortfolio() {
    bindControls();

    const cached = loadCache();
    const isFresh = cached && Date.now() - cached.timestamp < CACHE_TTL_MS && Array.isArray(cached.repos) && cached.repos.length > 0;

    if (isFresh) {
      applyData(cached.user, cached.repos, cached.events || [], 'cached');
      updateSyncStatus('cached', `Synced (${cached.repos.length} public repos · cached)`);
      verifyDynamicPages(state.repos);
      return;
    }

    try {
      const [user, repos, events] = await Promise.all([
        fetchJson(API_USER_URL),
        fetchJson(API_REPOS_URL),
        fetchJson(API_EVENTS_URL).catch(() => [])
      ]);

      saveCache({ user, repos, events });
      applyData(user, repos, events, 'live');
      updateSyncStatus('live', `Live GitHub API (${repos.length} public repos)`);
      verifyDynamicPages(state.repos);
    } catch (err) {
      if (cached && Array.isArray(cached.repos) && cached.repos.length > 0) {
        applyData(cached.user, cached.repos, cached.events || [], 'fallback');
        updateSyncStatus('fallback', 'Cached Snapshot (API limited)');
        showFallbackBanner(
          'GitHub API Rate Limit Reached',
          'Displaying your last synced repository snapshot from browser cache. Live data will resume automatically.'
        );
      } else {
        applyData(FALLBACK_DATA.user, FALLBACK_DATA.repos, FALLBACK_DATA.events, 'fallback');
        updateSyncStatus('fallback', 'Offline / Rate-Limit Fallback');
        showFallbackBanner(
          'Unable to Reach Live GitHub API',
          err && err.status === 403
            ? 'GitHub unauthenticated API rate limit was temporarily reached. Displaying curated key repositories — visit GitHub for the full live list.'
            : 'Network connection or GitHub API is temporarily unavailable. Displaying curated highlights — visit GitHub for the complete repository list.'
        );
      }
    }
  }

  function applyData(user, rawRepos, events, mode) {
    state.user = user || FALLBACK_DATA.user;
    state.repos = (Array.isArray(rawRepos) ? rawRepos : []).map(classifyDynamicRepo);
    state.events = Array.isArray(events) ? events : [];
    state.sourceMode = mode;

    renderCategoryCounts();
    renderProjects();
    renderDashboard(state.user, state.repos, state.events);
  }

  window.PortfolioGitHub = {
    init: initGitHubPortfolio
  };
})(window, document);
