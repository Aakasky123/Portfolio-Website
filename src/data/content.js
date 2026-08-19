export const CONTENT = {
  name: "Aakash Siricilla",
  role: "Software Engineer",
  focus: "AI Agents & Distributed Systems",
  location: "New Jersey, USA",
  resumeUrl: "/Aakash_Resume.pdf",

  // Hero
  heroEyebrow: "Aakash Siricilla — Software Engineer",
  heroHeadline: ["I build AI agents that do real work,", "and the systems that keep them reliable."],
  heroSub:
    "LLM agents, RAG platforms, and real-time distributed backends — Python, FastAPI, Java, Spring Boot, PostgreSQL, Redis. Currently engineering financial systems at Spectrum Capital NJ.",
  heroStats: [
    { value: "~1,200", label: "automated tests behind Astra, my autonomous computer-use agent" },
    { value: "sub-500ms", label: "request handling in a real-time anomaly-detection pipeline" },
    { value: "-70%", label: "document lookup time via hybrid RAG retrieval" },
  ],

  socials: [
    { label: "GitHub", href: "https://github.com/Aakasky123" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/aakash-siricilla" },
    { label: "Email", href: "mailto:aakash.siricilla02@gmail.com" },
  ],

  // Animated agent trace shown in the hero panel
  agentTrace: [
    { kind: "obs", text: "screenshot captured — job application form, 14 fields" },
    { kind: "plan", text: "decide: fill `years_experience` → type \"3\"" },
    { kind: "act", text: "execute: DOM-verified input via Chrome MV3 runtime" },
    { kind: "verify", text: "read-back OK — field matches intent" },
    { kind: "gate", text: "submit detected → holding for human approval" },
    { kind: "mem", text: "audit receipt written · memory updated" },
  ],

  // About
  about: [
    "I'm a software engineer working at the intersection of LLM systems and distributed backends. I've spent the last few years shipping production services — financial dashboards, CRM platforms, data pipelines — and now I build autonomous agents on top of that foundation: vision-guided computer use, RAG retrieval, and safety-first orchestration.",
    "What I care about: agents that verify their own actions, APIs with measurable latency wins, data flows you can audit, and enough tests that deploys are boring.",
  ],
  aboutFacts: [
    { label: "Now", value: "Software Engineer @ Spectrum Capital NJ" },
    { label: "Education", value: "M.S. Computer Science, NJIT · GPA 3.93" },
    { label: "Based in", value: "New Jersey, USA" },
    { label: "Open to", value: "SWE roles — AI systems, backend, full-stack" },
  ],

  // Work
  featured: {
    title: "Astra",
    kicker: "Flagship · Autonomous Computer-Use AI Agent",
    desc: "An LLM-driven agent that completes real-world digital tasks end-to-end — job applications, bookings, form filling — through a vision–action loop: screenshot → single-action model decision → execution → read-back verification.",
    tags: ["Python", "FastAPI", "Electron", "Next.js", "Chrome MV3", "SQLite"],
    highlights: [
      {
        title: "Vision–action loop",
        desc: "Every step is observed, decided, executed, and verified against a read-back — with step-level audit receipts and LLM-curated persistent memory.",
      },
      {
        title: "Dual execution runtimes",
        desc: "A Chrome MV3 extension for DOM-verified browser automation and a Windows desktop controller (UIA/SendInput), with per-task routing and an LLM-classified chat ingress.",
      },
      {
        title: "Safety-first architecture",
        desc: "Approval gates before any submit/pay action, a credential vault isolated from the model, sensitive-field masking, and sanctioned-URL navigation.",
      },
      {
        title: "Engineered like a product",
        desc: "FastAPI + SQLite backend with ~1,200 automated tests covering the agent loop, runtimes, and safety gates.",
      },
    ],
    note: "Private build — happy to walk through the architecture.",
  },
  projects: [
    {
      title: "DocuMindAI",
      subtitle: "Enterprise Document Intelligence (RAG)",
      desc: "Full-stack RAG platform with asynchronous ingestion, hybrid semantic + keyword retrieval over Qdrant embeddings, and contextual chat — cutting document lookup time by ~70%.",
      tags: ["FastAPI", "React", "Qdrant", "Redis", "Celery", "MLflow"],
      metric: "-70% lookup time",
      highlights: [
        "Hybrid retrieval over Qdrant embeddings with contextual chat",
        "Celery + Redis background execution for multi-document workloads",
        "MLflow-tracked experiments across retrieval configurations",
      ],
      link: "https://github.com/Aakasky123/DocuMindAI",
    },
    {
      title: "SentinelAI",
      subtitle: "Real-Time Network Monitoring",
      desc: "Real-time event-processing pipeline with streaming analytics, Redis-backed state, and sub-500ms request handling for high-volume anomaly-detection workflows.",
      tags: ["Python", "FastAPI", "Redis", "TimescaleDB", "Next.js", "Docker"],
      metric: "sub-500ms handling",
      highlights: [
        "Streaming analytics with Redis hot-state management",
        "WebSocket-powered live dashboard with replay controls",
        "TimescaleDB persistence off the hot ingestion path",
      ],
      link: "https://github.com/Aakasky123/SentinelAI",
    },
    {
      title: "SyncStream",
      subtitle: "Real-Time Collaborative Streaming",
      desc: "Dockerized full-stack collaboration platform with invite-based sessions, persistent room state, and low-latency user synchronization over Spring Boot WebSockets.",
      tags: ["Java", "Spring Boot", "Next.js", "WebSockets", "PostgreSQL"],
      metric: "low-latency sync",
      highlights: [
        "Invite-based sessions with persistent room state",
        "Spring Boot WebSocket synchronization across clients",
        "Dockerized frontend + backend for cloud-ready deploys",
      ],
      link: "https://github.com/Aakasky123/SyncStream",
    },
  ],

  // Experience
  experience: [
    {
      company: "Spectrum Capital NJ",
      role: "Software Engineer, Distributed Systems",
      time: "May 2025 — Present",
      place: "New Jersey, USA",
      bullets: [
        "Engineered centralized financial-operations dashboards (Java, Spring Boot, React, PostgreSQL) consolidating portfolio tracking and client workflows — cut manual reconciliation effort by 40%.",
        "Optimized high-throughput REST APIs and complex PostgreSQL query pipelines, reducing average response latency by 35% for data-intensive internal services.",
        "Automated end-to-end financial data ingestion and validation with Python/SQL ETL pipelines, accelerating report generation by 60%.",
        "Architected role-based workflow orchestration and audit-tracking modules with granular access controls and transactional logging, slashing issue-investigation time by 45%.",
        "Containerized and deployed Spring Boot services on AWS with Docker, standardizing deployment environments.",
      ],
    },
    {
      company: "New Jersey Institute of Technology",
      role: "Research Assistant",
      time: "Mar 2024 — May 2025",
      place: "Newark, NJ",
      bullets: [
        "Optimized PostgreSQL and MySQL queries across 120K+ records by redesigning joins and indexing strategies — cut query execution time by 40%.",
        "Automated Python ETL and preprocessing pipelines, reducing manual processing effort by 60% and improving reliability of downstream ML workflows.",
        "Built data pipelines and dashboards tracking operational and model-performance metrics, shortening reporting turnaround by 30%.",
      ],
    },
    {
      company: "Cognier Insights",
      role: "Software Engineer",
      time: "Apr 2021 — Sep 2023",
      place: "Hyderabad, India",
      bullets: [
        "Developed customer-facing CRM modules and workflow automation (Java, Spring Boot, React, PostgreSQL), reducing manual coordination effort by 35%.",
        "Designed REST APIs, service-layer validation, and PostgreSQL-backed data access for data-intensive workflows — improved retrieval performance by 25%.",
        "Created reusable React components integrated with Spring Boot services, cutting feature delivery time by 30%.",
      ],
    },
  ],

  // Skills — mirrors resume categories
  skills: [
    {
      category: "AI & LLM Systems",
      items: [
        "LLM Agents (planning · tool use · computer use)",
        "RAG",
        "Semantic Search",
        "Embeddings",
        "Prompt Engineering",
        "OpenAI / OpenRouter APIs",
        "MLflow",
        "Vision-Guided Automation",
      ],
    },
    {
      category: "Languages",
      items: ["Python", "Java", "TypeScript", "SQL", "C/C++"],
    },
    {
      category: "Backend & APIs",
      items: ["FastAPI", "Spring Boot", "REST APIs", "WebSockets", "Celery", "Async Processing", "JWT Authentication"],
    },
    {
      category: "Databases & Vector Stores",
      items: ["PostgreSQL", "MySQL", "Redis", "Qdrant", "FAISS", "TimescaleDB", "SQLite"],
    },
    {
      category: "Frontend & Apps",
      items: ["React", "Next.js", "Electron", "Chrome Extensions (MV3)", "Tailwind CSS"],
    },
    {
      category: "Cloud & DevOps",
      items: ["Docker", "Kubernetes", "AWS", "CI/CD", "GitHub Actions", "Prometheus", "Grafana"],
    },
  ],

  education: [
    {
      school: "New Jersey Institute of Technology",
      degree: "M.S. in Computer Science",
      time: "Sep 2023 — May 2025",
      detail: "GPA 3.93 / 4.0 · Machine Learning & MLOps, Deep Learning, Distributed Systems",
    },
    {
      school: "Kommuri Pratap Reddy Institute of Technology",
      degree: "B.Tech. in Computer Science & Engineering",
      time: "Aug 2019 — May 2023",
      detail: "GPA 8.55 / 10 · Cloud Computing, DSA, Operating Systems, Databases",
    },
  ],

  contact: {
    heading: "Let's build something that ships.",
    sub: "Open to software engineering roles across AI systems, backend, and full-stack. The fastest way to reach me is email — I usually reply within a day.",
    email: "aakash.siricilla02@gmail.com",
    phone: "+1 (551) 375-6945",
    phoneHref: "tel:+15513756945",
    formAction: "https://formspree.io/f/mrblnbyb",
  },
};

export const NAV_ITEMS = [
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];
