// All copy and data for the site lives here. Every number is from the résumé.

export const SITE = {
  name: "Aakash Siricilla",
  first: "Aakash",
  role: "Software Engineer",
  location: "Jersey City, NJ",
  coords: "40.7178° N  74.0431° W",
  timeZone: "America/New_York",
  email: "aakash.siricilla02@gmail.com",
  phone: "+1 (551) 375-6945",
  phoneHref: "tel:+15513756945",
  resumeUrl: "/Aakash_Resume.pdf",
  github: "https://github.com/Aakasky123",
  linkedin: "https://www.linkedin.com/in/aakash-siricilla",
  formAction: "https://formspree.io/f/mrblnbyb",
};

export const NAV = [
  { id: "agent", n: "01", label: "Agent" },
  { id: "systems", n: "02", label: "Systems" },
  { id: "stack", n: "03", label: "Stack" },
  { id: "about", n: "04", label: "About" },
];

export const HERO = {
  kicker: "Software engineer — AI agents & distributed systems",
  intro:
    "I build LLM agents that operate real software. They look at the screen, decide, act, then check their own work. Underneath them I build the distributed backends: the kind that move forty million events a day without anyone noticing.",
  now: "Software Engineer, Distributed Systems at AT&T",
  open: "AI/ML systems, SDE & systems engineering roles",
  stats: [
    { value: "40M", unit: "events / day", label: "through the service-assurance platform I built at AT&T" },
    { value: "1,200", unit: "tests", label: "behind Astra, my autonomous computer-use agent" },
    { value: "−70%", unit: "lookup time", label: "document search, via hybrid RAG retrieval" },
  ],
};

// ─── 01 · The agent ──────────────────────────────────────────────────────────

export const ASTRA = {
  title: "Astra",
  repo: "https://github.com/Aakasky123/ApplyPilotAI",
  headline: ["Astra uses a computer", "the way you do."],
  lead:
    "Astra is an autonomous LLM agent that finishes real digital tasks: job applications, forms, app work. It runs a vision–action loop. Take a screenshot, pick an action, execute it, then read the screen back to prove the action actually happened.",
  demoLead: "Here it is applying for a job. Yours, specifically.",
  stack: ["Python", "FastAPI", "Chrome MV3", "Electron", "SQLite"],
  principles: [
    {
      n: "i",
      title: "A loop, not a script.",
      body:
        "Every step is observed, decided, executed and verified against a read-back of the screen, with a per-step audit receipt and LLM-curated persistent memory.",
    },
    {
      n: "ii",
      title: "Two bodies, one brain.",
      body:
        "A DOM-verified Chrome MV3 extension drives the browser; a Windows controller (UIA + SendInput) drives native apps. Each task is routed to the right body.",
    },
    {
      n: "iii",
      title: "Safe by construction.",
      body:
        "Approval gates before any submit or payment. A credential vault the model never sees. Sensitive fields masked in screenshots. URL allow-listing.",
    },
    {
      n: "iv",
      title: "Tested like a product.",
      body:
        "A FastAPI + SQLite backend covered by roughly 1,200 automated tests across the agent loop, both execution bodies, and the safety gates.",
    },
  ],
};

// The scripted run for the interactive demo. The applicant is Aakash;
// the employer is whoever is reading.
export const DEMO = {
  url: "careers.your-company.com/apply",
  role: "Software Engineer, AI Systems",
  fields: {
    name: "Aakash Siricilla",
    email: "aakash.siricilla02@gmail.com",
    years: "4+ years",
    link: "github.com/Aakasky123",
    why: "I build agents that check their own work, and systems that stay up while they do it.",
  },
};

export const DOCUMIND = {
  title: "DocuMindAI",
  kind: "Document intelligence · RAG",
  repo: "https://github.com/Aakasky123/DocuMindAI",
  body:
    "A retrieval-augmented platform: async ingestion, chunking and embedding pipelines, hybrid dense + keyword retrieval over Qdrant, and LLM chat on top. Indexing runs on Celery/Redis workers, and every retrieval experiment is tracked in MLflow.",
  metric: { value: "−70%", label: "document lookup time" },
  stack: ["FastAPI", "React", "Qdrant", "Redis", "Celery", "MLflow", "Docker"],
  // Canned retrieval runs for the specimen: [chunk, dense score, keyword score]
  queries: [
    {
      q: "What is the SLA for P1 incidents?",
      hits: [
        ["runbook/incident-severity.md §2 — P1 response within 15 min", 0.82, 0.91],
        ["sla/enterprise-2024.pdf p.7 — availability credits", 0.77, 0.34],
        ["postmortems/2024-03.md — P1 timeline", 0.71, 0.58],
        ["onboarding/oncall.md — paging policy", 0.64, 0.49],
      ],
    },
    {
      q: "how do we rotate database credentials",
      hits: [
        ["security/secrets.md §4 — rotation via vault lease", 0.88, 0.62],
        ["infra/terraform/rds.md — IAM auth", 0.74, 0.71],
        ["runbook/db-failover.md — credential refresh", 0.69, 0.55],
        ["faq/access.md — who can request credentials", 0.52, 0.47],
      ],
    },
  ],
};

// ─── 02 · The systems ────────────────────────────────────────────────────────

export const SYSTEMS = {
  headline: ["Forty million events a day.", "Incidents stay boring."],
  lead:
    "At AT&T I own an event-driven service-assurance platform end to end: Kafka pipelines, high-throughput APIs, ML anomaly detection, Kubernetes deploys, SLOs, and the pager. Below is its heartbeat, simulated at the real rate.",
  // `ratio` = after / before, drawn as the bar that's left once the cut is made.
  outcomes: [
    { big: "−35%", label: "p95 latency, hot-path queries", from: "480 ms", to: "310 ms", ratio: 310 / 480, note: "Composite indexes and query-plan tuning." },
    { big: "≈0", label: "Release-related incidents", from: "~3 a month", to: "near zero", ratio: 0.04, note: "Canary releases with automated rollback." },
    { big: "<10m", label: "Time to detect", from: "hours", to: "under 10 min", ratio: 0.06, note: "Streaming anomaly detection replaced batch reconciliation." },
    { big: "−30%", label: "False pages", from: "100%", to: "70%", ratio: 0.7, note: "ML scoring against seasonal baselines, with drift monitoring." },
    { big: "15h", label: "Manual toil removed, weekly", from: "~15 h / week", to: "automated", ratio: 0.03, note: "Python and Bash: health checks, backfills, validation." },
    { big: "−45%", label: "Incident investigation time", from: "100%", to: "55%", ratio: 0.55, note: "Role-based access control and transactional audit logs." },
  ],
};

export const EXPERIENCE = [
  {
    company: "AT&T",
    role: "Software Engineer, Distributed Systems",
    time: "Sep 2024 — Present",
    start: 2024,
    place: "Remote, USA",
    summary:
      "Owns an event-driven service-assurance platform end to end: ~40M events a day from 12+ upstream systems, APIs at ~2.5k RPS, ML anomaly detection, and the on-call rotation.",
    stack: ["Java", "Spring Boot", "Kafka", "PostgreSQL", "Redis", "gRPC", "AWS EKS", "Terraform", "Python", "XGBoost", "Prometheus"],
    log: [
      "Designed and implemented an event-driven service-assurance platform (Java, Spring Boot, Kafka, PostgreSQL) ingesting ~40M network and customer-operations events/day from 12+ upstream systems, replacing batch reconciliation and cutting manual effort 40%.",
      "Built high-throughput REST/gRPC APIs sustaining ~2.5k RPS with connection pooling, Redis caching and idempotent writes; rewrote hot-path PostgreSQL queries with composite indexes and query-plan tuning, cutting p95 latency 35% (480ms → 310ms).",
      "Deployed services across dev/stage/prod on AWS EKS with Docker, Terraform and GitHub Actions CI/CD — canary releases, automated rollbacks, config management — taking release-related incidents from ~3/month to near zero.",
      "Built an ML anomaly-detection service (Python, scikit-learn, XGBoost, FastAPI) scoring streaming metrics against seasonal baselines, with MLflow-tracked retraining and drift monitoring; cut false pages 30% and time-to-detect from hours to <10 min.",
      "Defined SLOs/SLIs (99.9% availability, p95 latency) with Prometheus/Grafana and CloudWatch burn-rate alerts, and wrote the runbooks; on-call rotation member leading P1/P2 root-cause analysis.",
      "Automated health checks, log parsing, data validation, backfills and scheduled maintenance with Python and Bash — eliminating ~15 hours/week of manual runbook steps.",
      "Partnered with product, network-operations and security teams on requirements, capacity plans and test procedures; delivered role-based access control and transactional audit logging, cutting investigation time 45%.",
    ],
  },
  {
    company: "Flipkart",
    role: "Software Engineer",
    time: "Apr 2021 — Sep 2023",
    start: 2021,
    place: "Hyderabad, India",
    summary:
      "Built CRM and workflow-automation services used by 1,500+ internal agents, on transaction-heavy flows of ~5M records a day that had to hold p99 through festive-sale peaks.",
    stack: ["Java", "Spring Boot", "React", "PostgreSQL", "Redis", "Kafka", "JUnit", "Mockito"],
    log: [
      "Developed customer-facing CRM and workflow-automation services (Java, Spring Boot, React, PostgreSQL) used by 1,500+ internal agents for lead management and client onboarding, reducing manual coordination effort 35%.",
      "Designed REST APIs, service-layer validation and data-access logic for transaction-heavy flows handling ~5M records/day; Redis caching and N+1 removal improved retrieval performance 25% and held p99 under target at festive-sale peaks.",
      "Built asynchronous background-job processing (Kafka consumers, scheduled workers) for notifications, exports and batch updates, with retry and dead-letter handling — raising job throughput 3x.",
      "Shipped real-time monitoring dashboards and alerting for API health, queue lag and error rates; kept JUnit/Mockito coverage above 80%.",
      "Created a reusable React component library integrated with Spring Boot services — cutting feature delivery time 30% and standardizing UI across four teams.",
    ],
  },
];

export const SYNCSTREAM = {
  title: "SyncStream",
  kind: "Real-time collaborative streaming",
  repo: "https://github.com/Aakasky123/SyncStream",
  body:
    "A real-time collaboration platform: invite-based sessions, persistent room state, and low-latency synchronization over Spring Boot WebSockets. Dockerized front to back.",
  stack: ["Java", "Spring Boot", "Next.js", "WebSockets", "PostgreSQL", "Docker"],
};

// ─── 03 · Stack ──────────────────────────────────────────────────────────────

export const STACK = [
  {
    id: "ai",
    label: "AI / ML systems",
    items: [
      "LLMs", "RAG", "Agentic workflows (tool use, computer use)", "Embeddings & vector search (Qdrant, FAISS)",
      "PyTorch", "scikit-learn", "XGBoost", "Model serving", "MLflow", "Evaluation harnesses", "Drift monitoring",
    ],
  },
  {
    id: "backend",
    label: "Backend systems",
    items: [
      "Spring Boot", "FastAPI", "REST, gRPC & WebSocket APIs", "Microservices", "Kafka", "Celery",
      "Event-driven processing", "Caching", "Idempotency", "Fault tolerance", "Capacity planning",
    ],
  },
  {
    id: "lang",
    label: "Languages",
    items: ["Java", "Python", "TypeScript / JavaScript", "SQL", "Bash", "C / C++"],
  },
  {
    id: "data",
    label: "Data & storage",
    items: [
      "PostgreSQL", "MySQL", "Redis", "TimescaleDB", "SQLite", "ETL & streaming pipelines",
      "Query optimization", "Schema design",
    ],
  },
  {
    id: "ops",
    label: "Cloud & operations",
    items: [
      "AWS (EC2, EKS, S3, RDS, Lambda, SQS, CloudWatch)", "Docker", "Kubernetes", "Terraform",
      "GitHub Actions CI/CD", "Linux", "Prometheus", "Grafana", "SLOs & SLIs", "On-call & incident response", "Runbooks",
    ],
  },
  {
    id: "front",
    label: "Frontend & testing",
    items: ["React", "Next.js", "Tailwind CSS", "JUnit", "Mockito", "pytest", "k6 load testing", "Git"],
  },
];

// Where the tools were actually used — powers the hover cross-reference.
export const USED_IN = {
  LLMs: ["Astra", "DocuMindAI"],
  RAG: ["DocuMindAI"],
  "Agentic workflows (tool use, computer use)": ["Astra"],
  "Embeddings & vector search (Qdrant, FAISS)": ["DocuMindAI"],
  "scikit-learn": ["AT&T"],
  XGBoost: ["AT&T"],
  MLflow: ["AT&T", "DocuMindAI"],
  "Drift monitoring": ["AT&T"],
  "Spring Boot": ["AT&T", "Flipkart", "SyncStream"],
  FastAPI: ["AT&T", "Astra", "DocuMindAI"],
  "REST, gRPC & WebSocket APIs": ["AT&T", "Flipkart", "SyncStream"],
  Kafka: ["AT&T", "Flipkart"],
  Celery: ["DocuMindAI"],
  "Event-driven processing": ["AT&T", "Flipkart"],
  Caching: ["AT&T", "Flipkart"],
  Idempotency: ["AT&T"],
  "Capacity planning": ["AT&T"],
  Java: ["AT&T", "Flipkart", "SyncStream"],
  Python: ["AT&T", "Astra", "DocuMindAI"],
  "TypeScript / JavaScript": ["Astra", "SyncStream", "Flipkart"],
  Bash: ["AT&T"],
  PostgreSQL: ["AT&T", "Flipkart", "SyncStream"],
  Redis: ["AT&T", "Flipkart", "DocuMindAI"],
  SQLite: ["Astra"],
  "AWS (EC2, EKS, S3, RDS, Lambda, SQS, CloudWatch)": ["AT&T"],
  Docker: ["AT&T", "DocuMindAI", "SyncStream"],
  Kubernetes: ["AT&T"],
  Terraform: ["AT&T"],
  "GitHub Actions CI/CD": ["AT&T"],
  Prometheus: ["AT&T"],
  Grafana: ["AT&T"],
  "SLOs & SLIs": ["AT&T"],
  "On-call & incident response": ["AT&T"],
  Runbooks: ["AT&T"],
  React: ["Flipkart", "DocuMindAI"],
  "Next.js": ["SyncStream"],
  JUnit: ["Flipkart"],
  Mockito: ["Flipkart"],
};

// ─── 04 · About ──────────────────────────────────────────────────────────────

export const ABOUT = {
  headline: "Hi, I'm Aakash.",
  body: [
    "For four-plus years I've worked on the part of software people only notice when it breaks. First it was transaction-heavy CRM services at Flipkart. Now it's an event-driven service-assurance platform at AT&T, where I own everything from the Kafka pipelines to the on-call rotation.",
    "On my own time I build agents on the same foundation. What I care about: agents that verify their own actions, services with latency wins you can measure, and enough observability that incidents are boring.",
  ],
  facts: [
    { k: "Now", v: "Software Engineer, Distributed Systems — AT&T" },
    { k: "Studied", v: "M.S. Computer Science — NJIT, 2025" },
    { k: "Based", v: "Jersey City, NJ — open to relocation" },
    { k: "Looking", v: "AI/ML systems, SDE, systems engineering" },
  ],
  education: [
    {
      school: "New Jersey Institute of Technology",
      degree: "M.S. Computer Science",
      time: "2023 — 2025",
      detail: "Distributed systems · Deep learning · ML & MLOps",
    },
    {
      school: "Kommuri Pratap Reddy Institute of Technology",
      degree: "B.Tech. Computer Science & Engineering",
      time: "2018 — 2022",
      detail: "Hyderabad, India",
    },
  ],
};

export const CONTACT = {
  headline: "Awaiting human input",
  body:
    "Open to AI/ML systems, backend and platform roles, remote or relocating for the right team. Email is fastest. I usually reply within a day.",
};
