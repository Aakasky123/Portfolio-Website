export const CONTENT = {
  name: "Aakash Siricilla",
  role: "Software Engineer",
  focus: "AI/ML Systems & Distributed Backends",
  location: "Jersey City, NJ",
  resumeUrl: "/Aakash_Resume.pdf",

  // Hero
  heroEyebrow: "Aakash Siricilla — Software Engineer",
  heroHeadline: ["I build AI agents that do real work,", "and the systems that keep them reliable."],
  heroSub:
    "4+ years designing and operating distributed backend and AI/ML systems in production — Java, Spring Boot, Kafka, Python, FastAPI, Kubernetes. Currently engineering event-driven service assurance at AT&T.",
  heroStats: [
    { value: "~40M/day", label: "events ingested by the service-assurance platform I built at AT&T" },
    { value: "~1,200", label: "automated tests behind Astra, my autonomous computer-use agent" },
    { value: "-70%", label: "document lookup time via hybrid RAG retrieval" },
  ],

  ticker: [
    "Java",
    "Spring Boot",
    "Kafka",
    "Python",
    "FastAPI",
    "PostgreSQL",
    "Redis",
    "Kubernetes",
    "AWS",
    "Terraform",
    "LLM Agents",
    "RAG",
    "PyTorch",
    "XGBoost",
    "gRPC",
    "React",
    "Next.js",
    "Prometheus",
  ],

  socials: [
    { label: "GitHub", href: "https://github.com/Aakasky123" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/aakash-siricilla" },
    { label: "Email", href: "mailto:aakash.siricilla02@gmail.com" },
  ],

  // Animated agent trace shown in the featured Astra panel
  agentTrace: [
    { kind: "obs", text: "screenshot captured — job application form, 14 fields" },
    { kind: "plan", text: "decide: fill `years_experience` → type \"4\"" },
    { kind: "act", text: "execute: DOM-verified input via Chrome MV3 runtime" },
    { kind: "verify", text: "read-back OK — field matches intent" },
    { kind: "gate", text: "submit detected → holding for human approval" },
    { kind: "mem", text: "audit receipt written · memory updated" },
  ],

  // About
  about: [
    "I'm a software engineer with 4+ years designing, operating, and scaling distributed backend and AI/ML systems in production. At AT&T I own an event-driven service-assurance platform end to end — Kafka pipelines ingesting ~40M events a day, high-throughput APIs, ML anomaly detection, Kubernetes deploys, SLOs, and on-call. Before that I shipped transaction-heavy CRM services at Flipkart.",
    "On my own time I build autonomous agents on that same foundation: Astra, my LLM computer-use agent, completes real digital tasks through a vision–action loop with approval gates, a credential vault, and ~1,200 tests. What I care about: agents that verify their own actions, services with measurable latency wins, and enough observability that incidents are boring.",
  ],
  aboutFacts: [
    { label: "Now", value: "Software Engineer, Distributed Systems @ AT&T" },
    { label: "Education", value: "M.S. Computer Science, NJIT (2025)" },
    { label: "Based in", value: "Jersey City, NJ — open to relocation" },
    { label: "Open to", value: "AI/ML Systems, SDE, and Systems Engineering roles" },
  ],

  // Work
  featured: {
    title: "Astra",
    kicker: "Flagship · Autonomous LLM Computer-Use Agent (ApplyPilotAI)",
    desc: "An LLM-driven agent that completes real digital tasks end-to-end — job applications, forms, app work — through a vision–action loop: screenshot → model action → execution → read-back verification.",
    tags: ["Python", "FastAPI", "Chrome MV3", "Electron", "SQLite"],
    highlights: [
      {
        title: "Vision–action loop",
        desc: "Every step is observed, decided, executed, and verified against a read-back — with per-step audit receipts and LLM-curated persistent memory.",
      },
      {
        title: "Swappable execution bodies",
        desc: "A DOM-verified Chrome MV3 extension for browser automation and a Windows desktop controller (UIA/SendInput), routed per task.",
      },
      {
        title: "Safety & reliability layer",
        desc: "Approval gates before any submit/pay action, a credential vault the model never sees, sensitive-field masking in screenshots, and URL allow-listing.",
      },
      {
        title: "Engineered like a product",
        desc: "FastAPI + SQLite backend covered by ~1,200 automated tests across the agent loop, execution bodies, and safety gates.",
      },
    ],
    link: "https://github.com/Aakasky123/ApplyPilotAI",
  },
  projects: [
    {
      title: "DocuMindAI",
      subtitle: "Document Intelligence (RAG) Platform",
      desc: "RAG platform with async ingestion, chunking/embedding pipelines, hybrid dense + keyword retrieval over Qdrant, and LLM chat — cutting document lookup time by ~70%.",
      tags: ["FastAPI", "React", "Qdrant", "Redis", "Celery", "MLflow"],
      metric: "-70% lookup time",
      highlights: [
        "Hybrid dense + keyword retrieval over Qdrant embeddings",
        "Indexing offloaded to Celery/Redis background workers",
        "Retrieval experiments tracked in MLflow",
      ],
      link: "https://github.com/Aakasky123/DocuMindAI",
    },
    {
      title: "SyncStream",
      subtitle: "Real-Time Collaborative Streaming",
      desc: "Dockerized real-time collaboration platform with invite-based sessions, persistent room state, and low-latency user synchronization over Spring Boot WebSockets.",
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
      company: "AT&T",
      role: "Software Engineer, Distributed Systems",
      time: "Sep 2024 — Present",
      place: "Remote, USA",
      bullets: [
        "Designed an event-driven service-assurance platform (Java, Spring Boot, Kafka, PostgreSQL) ingesting ~40M network and customer-operations events/day from 12+ upstream systems — replaced batch reconciliation and cut manual effort 40%.",
        "Built high-throughput REST/gRPC APIs sustaining ~2.5k RPS with connection pooling, Redis caching, and idempotent writes; rewrote hot-path PostgreSQL queries, reducing p95 latency 35% (480ms → 310ms).",
        "Deployed services across dev/stage/prod on AWS EKS with Docker, Terraform, and GitHub Actions CI/CD — canary releases and automated rollbacks took release incidents from ~3/month to near zero.",
        "Built an ML anomaly-detection service (Python, scikit-learn, XGBoost, FastAPI) scoring streaming metrics against seasonal baselines with MLflow-tracked retraining and drift monitoring — cut false pages 30% and time-to-detect from hours to <10 min.",
        "Defined SLOs/SLIs (99.9% availability, p95 latency) with Prometheus/Grafana burn-rate alerts and runbooks; on-call rotation member leading P1/P2 root-cause analysis.",
        "Automated health checks, log parsing, data validation, and backfills with Python and Bash — eliminated ~15 hours/week of manual runbook steps.",
      ],
    },
    {
      company: "Flipkart",
      role: "Software Engineer",
      time: "Apr 2021 — Sep 2023",
      place: "Hyderabad, India",
      bullets: [
        "Developed customer-facing CRM and workflow-automation services (Java, Spring Boot, React, PostgreSQL) used by 1,500+ internal agents — reduced manual coordination effort by 35%.",
        "Designed REST APIs and data-access logic for transaction-heavy flows handling ~5M records/day; Redis caching and N+1 removal improved retrieval performance 25% and held p99 under target at festive-sale peaks.",
        "Built asynchronous background-job processing (Kafka consumers, scheduled workers) with retry and dead-letter handling — raised job throughput 3x.",
        "Shipped real-time monitoring dashboards and alerting for API health, queue lag, and error rates; kept JUnit/Mockito coverage above 80%.",
        "Created a reusable React component library integrated with Spring Boot services — cut feature delivery time 30% across four teams.",
      ],
    },
  ],

  // Skills — mirrors resume categories
  skills: [
    {
      category: "AI/ML Systems",
      items: [
        "LLMs",
        "RAG",
        "Agentic Workflows (Tool Use · Computer Use)",
        "Embeddings & Vector Search (Qdrant · FAISS)",
        "PyTorch",
        "scikit-learn",
        "XGBoost",
        "Model Serving",
        "MLflow",
        "Evaluation Harnesses",
        "Drift Monitoring",
      ],
    },
    {
      category: "Languages",
      items: ["Java", "Python", "TypeScript/JavaScript", "SQL", "Bash/Shell", "C/C++"],
    },
    {
      category: "Backend Systems",
      items: [
        "Spring Boot",
        "FastAPI",
        "REST / gRPC / WebSocket APIs",
        "Microservices",
        "Kafka",
        "Celery",
        "Event-Driven Processing",
        "Caching",
        "Idempotency",
        "Fault Tolerance",
        "Capacity Planning",
      ],
    },
    {
      category: "Data & Storage",
      items: [
        "PostgreSQL",
        "MySQL",
        "Redis",
        "TimescaleDB",
        "SQLite",
        "ETL / Streaming Pipelines",
        "Query Optimization",
        "Schema Design",
      ],
    },
    {
      category: "Cloud & Ops",
      items: [
        "AWS (EC2 · EKS · S3 · RDS · Lambda · SQS · CloudWatch)",
        "Docker",
        "Kubernetes",
        "Terraform",
        "GitHub Actions CI/CD",
        "Linux",
        "Prometheus",
        "Grafana",
        "SLOs/SLIs",
        "Incident Response",
      ],
    },
    {
      category: "Frontend & Testing",
      items: ["React", "Next.js", "Tailwind CSS", "JUnit", "Mockito", "pytest", "Load Testing (k6)", "Git"],
    },
  ],

  education: [
    {
      school: "New Jersey Institute of Technology",
      degree: "M.S. in Computer Science",
      time: "Sep 2023 — May 2025",
      detail: "Distributed Systems · Deep Learning · Machine Learning & MLOps",
    },
    {
      school: "Kommuri Pratap Reddy Institute of Technology",
      degree: "B.Tech. in Computer Science & Engineering",
      time: "Aug 2018 — May 2022",
      detail: "Hyderabad, India",
    },
  ],

  contact: {
    heading: "Let's build something that ships.",
    sub: "Open to AI/ML Systems, SDE, and Systems Engineering roles — remote or relocating. The fastest way to reach me is email; I usually reply within a day.",
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
