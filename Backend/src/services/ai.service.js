const dotenv = require("dotenv");
dotenv.config();

const Groq = require("groq-sdk");
const { z } = require("zod");
const puppeteer = require("puppeteer");
// import chalk from "chalk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

const CANDIDATE_MODELS = [
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "qwen/qwen3.8-27b"
];

function sanitizeInterviewReport(rawObj, fallbackTitle = "Target Position Interview Plan") {
    const obj = typeof rawObj === "object" && rawObj !== null ? rawObj : {};

    // 1. Title
    const title = String(obj.title || obj.jobTitle || obj.role || fallbackTitle).trim() || fallbackTitle;

    // 2. Match Score (0 - 100)
    let score = typeof obj.matchScore === "number" ? obj.matchScore : parseInt(String(obj.matchScore).replace(/[^0-9]/g, ""), 10);
    if (isNaN(score) || score < 0) score = 70;
    if (score > 100) score = 100;

    // 3. Technical Questions
    const technicalQuestions = Array.isArray(obj.technicalQuestions)
        ? obj.technicalQuestions.map(q => ({
            question: String(q?.question || "Technical Concept Question").trim(),
            intention: String(q?.intention || "Evaluate domain expertise and practical experience").trim(),
            answer: String(q?.answer || "Provide a detailed answer with practical examples.").trim()
        }))
        : [];

    // 4. Behavioral Questions
    const behavioralQuestions = Array.isArray(obj.behavioralQuestions)
        ? obj.behavioralQuestions.map(q => ({
            question: String(q?.question || "Behavioral Scenario Question").trim(),
            intention: String(q?.intention || "Evaluate teamwork, communication, and decision making").trim(),
            answer: String(q?.answer || "Structure the response using the STAR method.").trim()
        }))
        : [];

    // 5. Skill Gaps
    const validSeverities = ["low", "medium", "high"];
    const skillGaps = Array.isArray(obj.skillGaps)
        ? obj.skillGaps.map(g => {
            let sev = String(g?.severity || "medium").toLowerCase().trim();
            if (!validSeverities.includes(sev)) {
                if (sev.includes("high") || sev.includes("crit")) sev = "high";
                else if (sev.includes("low")) sev = "low";
                else sev = "medium";
            }
            return {
                skill: String(g?.skill || "Technical Skill").trim(),
                severity: sev
            };
        })
        : [];

    // 6. Preparation Plan
    const preparationPlan = Array.isArray(obj.preparationPlan)
        ? obj.preparationPlan.map((p, idx) => {
            let day = typeof p?.day === "number" ? p.day : parseInt(String(p?.day).replace(/[^0-9]/g, ""), 10);
            if (isNaN(day) || day <= 0) day = idx + 1;
            const focus = String(p?.focus || `Day ${day} Preparation & Practice`).trim();
            const tasks = Array.isArray(p?.tasks)
                ? p.tasks.map(t => String(t).trim()).filter(Boolean)
                : [String(p?.tasks || "Review key technical topics")];
            return {
                day,
                focus,
                tasks: tasks.length ? tasks : ["Review core concepts and practice interview problems"]
            };
        })
        : [];

    return {
        title,
        matchScore: score,
        technicalQuestions,
        behavioralQuestions,
        skillGaps,
        preparationPlan
    };
}

async function callGroqWithFallback({ messages, temperature = 0.3 }) {
    let lastError = null;
    for (const model of CANDIDATE_MODELS) {
        try {
            console.log(`Calling Groq model: ${model}...`);
            const completion = await groq.chat.completions.create({
                model,
                temperature,
                response_format: { type: "json_object" },
                messages,
            });

            const raw = completion.choices?.[0]?.message?.content;
            if (raw) {
                return raw;
            }
        } catch (err) {
            console.warn(`Model ${model} error (${err.message}). Trying fallback...`);
            lastError = err;
        }
    }
    throw lastError || new Error("All Groq models failed to return a response");
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    if (!process.env.GROQ_API_KEY) {
        throw new Error("Missing GROQ_API_KEY in environment variables");
    }

    const prompt = `You are a Principal Engineering Director and Staff Hiring Committee Chair at a Tier-1 tech company.
Generate an in-depth, production-grade, and actionable Technical Interview Intelligence Report.

CANDIDATE BACKGROUND & PROFILE:
Resume Details:
${resume || "Not explicitly provided in resume file"}

Candidate Self-Description & Stated Skills:
${selfDescription || "Not explicitly provided"}

TARGET JOB DESCRIPTION & REQUIREMENTS:
${jobDescription}

================================================================================
CALIBRATION GUIDELINES & CRITICAL REQUIREMENTS:
================================================================================

1. EXACT JOB TITLE:
   - Extract the precise target role title (e.g., "Staff Backend Engineer - Distributed Systems", "Senior Frontend Engineer - Platform").

2. MATHEMATICAL MATCH SCORE CALCULATION (0 - 100):
   Evaluate the candidate strictly against these 4 weighted pillars:
   - Core Hard Skills & Tech Stack Alignment (40% weight): Match of primary programming languages, frameworks, and storage systems.
   - Scale, Concurrency & System Complexity (25% weight): Demonstrated experience with distributed systems, high throughput, low latency, or deep frontend state architecture.
   - Seniority & Technical Ownership (20% weight): Alignment with target seniority level (Junior / Mid / Senior / Staff / Principal), architectural decision-making, and mentorship.
   - Domain & Tooling Familiarity (15% weight): Domain-specific requirements (e.g., FinTech, Cloud Infra, Real-time APIs, Security, CI/CD).
   Output a single realistic integer score reflecting this weighted calculation.

3. TECHNICAL QUESTIONS (Generate 8 - 10 Comprehensive Questions):
   - Focus on REAL-WORLD production scenarios, race conditions, distributed consensus, failure recovery, caching invalidation, database sharding, memory optimization, or framework architecture.
   - AVOID shallow textbook trivia (e.g., "what is a promise?"). Instead ask scenario-driven questions (e.g., "How do you ensure idempotency across distributed microservices handling 50k webhook req/s with out-of-order delivery?").
   - For each question:
     * "question": The exact scenario-based technical question.
     * "intention": Reveal what the hiring committee evaluates (the signal they seek: understanding of race conditions, memory vs CPU trade-offs, consistency models).
     * "answer": A multi-part response blueprint including:
       1) Recommended Architecture / Algorithmic solution.
       2) Trade-offs & performance implications (P99 latency, memory footprint).
       3) Edge cases and pitfalls to highlight in the interview.

4. BEHAVIORAL & LEADERSHIP QUESTIONS (Generate 6 - 8 Questions):
   - Tailored to the company culture and seniority in the JD (e.g., technical disagreements, managing tech debt vs feature delivery, production outages, cross-team misalignment).
   - For each question:
     * "question": The behavioral prompt.
     * "intention": The core competency assessed (e.g., conflict resolution, root-cause blameless post-mortem, stakeholder empathy).
     * "answer": A structured STAR (Situation, Task, Action, Result) model response detailing:
       - Situation: Specific high-stakes context.
       - Task: Individual ownership and goal.
       - Action: Engineering and interpersonal actions taken.
       - Result: Quantified impact (e.g., 99.99% uptime restored, 30% latency drop, delivered 2 weeks ahead).

5. SKILL GAPS ISOLATION (Generate 4 - 6 Specific Gaps):
   - Isolate exact areas where the candidate's background falls short of the target job posting.
   - Classify severity strictly:
     * "high": Essential hard requirement for the role; failing this will result in a No-Hire.
     * "medium": Expected secondary skill or architectural pattern that will be probed.
     * "low": Tooling, secondary library, or domain nuance that can be ramped up on the job.

6. ACTIONABLE PREPARATION ROADMAP (10 to 14 Days):
   - Structure into 4 progressive phases:
     * Phase 1 (Days 1-3): Deep-Dive on High-Severity Skill Gaps & Foundational Architecture.
     * Phase 2 (Days 4-7): Practical Implementation, Concurrency, Indexing & API Resilience.
     * Phase 3 (Days 8-10): End-to-End System Design Scenarios & STAR Story Framing.
     * Phase 4 (Days 11-14): Full-Scale Live Mock Interviews, Edge-Case Defense & Whiteboard Drills.
   - For each day provide:
     * "day": Integer (1, 2, 3...)
     * "focus": Concise theme of the day.
     * "tasks": Array of 3-4 specific, actionable study/coding tasks with concrete deliverables.

================================================================================
OUTPUT FORMAT:
================================================================================
Return ONLY a valid JSON object matching this schema:
{
  "title": "Exact Role Title",
  "matchScore": 82,
  "technicalQuestions": [
    {
      "question": "Scenario-based technical question...",
      "intention": "What the interviewer evaluates...",
      "answer": "Structured architecture solution, trade-offs, and edge cases..."
    }
  ],
  "behavioralQuestions": [
    {
      "question": "Behavioral question...",
      "intention": "Competency and leadership trait evaluated...",
      "answer": "STAR Framework: Situation (...), Task (...), Action (...), Result (...)"
    }
  ],
  "skillGaps": [
    {
      "skill": "Specific Skill / Architecture Gap",
      "severity": "high"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "Core Domain / Distributed Locking",
      "tasks": [
        "Implement a Redis SETNX lock with TTL safety in sandbox environment.",
        "Analyze split-brain edge cases in multi-master setups.",
        "Review P99 latency impact of distributed locks under 20k RPS."
      ]
    }
  ]
}`;

    const raw = await callGroqWithFallback({
        temperature: 0.25,
        messages: [
            {
                role: "system",
                content: "You are a Principal Engineering Director and Staff Interview Calibrator. Output strictly valid JSON conforming to the requested schema. Provide comprehensive, production-grade technical interview strategies with high-signal trade-offs and STAR behavioral frameworks."
            },
            {
                role: "user",
                content: prompt,
            },
        ],
    });

    let parsed;
    try {
        parsed = JSON.parse(raw);
    } catch (e) {
        // Try extracting JSON from markdown fences if any
        const match = raw.match(/\{[\s\S]*\}/);
        if (match) {
            parsed = JSON.parse(match[0]);
        } else {
            throw new Error(`Failed to parse Groq response: ${e.message}`);
        }
    }

    const sanitized = sanitizeInterviewReport(parsed, jobDescription.slice(0, 50));
    return interviewReportSchema.parse(sanitized);
}

// ── High-Standard Harvard ATS Resume Schema & HTML Compiler ───────────────────

const structuredResumeSchema = z.object({
    fullName: z.string().default("Candidate Name"),
    contact: z.object({
        email: z.string().optional().default(""),
        phone: z.string().optional().default(""),
        location: z.string().optional().default(""),
        linkedin: z.string().optional().default(""),
        github: z.string().optional().default(""),
        portfolio: z.string().optional().default("")
    }).default({}),
    targetTitle: z.string().default(""),
    summary: z.string().default(""),
    skills: z.array(z.object({
        category: z.string(),
        items: z.union([z.array(z.string()), z.string()])
    })).default([]),
    experience: z.array(z.object({
        role: z.string(),
        company: z.string(),
        location: z.string().optional().default(""),
        dates: z.string().optional().default(""),
        highlights: z.array(z.string()).default([])
    })).default([]),
    projects: z.array(z.object({
        title: z.string(),
        techStack: z.string().optional().default(""),
        dates: z.string().optional().default(""),
        highlights: z.array(z.string()).default([])
    })).optional().default([]),
    education: z.array(z.object({
        degree: z.string(),
        institution: z.string(),
        dates: z.string().optional().default(""),
        details: z.string().optional().default("")
    })).default([]),
    certifications: z.array(z.string()).optional().default([])
});

function renderAtsResumeHtml(data) {
    const fullName = data.fullName || "Candidate Name";
    const contact = data.contact || {};
    const targetTitle = data.targetTitle || "";
    const summary = data.summary || "";
    const skills = Array.isArray(data.skills) ? data.skills : [];
    const experience = Array.isArray(data.experience) ? data.experience : [];
    const projects = Array.isArray(data.projects) ? data.projects : [];
    const education = Array.isArray(data.education) ? data.education : [];
    const certifications = Array.isArray(data.certifications) ? data.certifications : [];

    const contactParts = [
        contact.email,
        contact.phone,
        contact.location,
        contact.linkedin ? contact.linkedin.replace(/^https?:\/\/(www\.)?/, '') : null,
        contact.github ? contact.github.replace(/^https?:\/\/(www\.)?/, '') : null,
        contact.portfolio ? contact.portfolio.replace(/^https?:\/\/(www\.)?/, '') : null
    ].filter(Boolean);

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${fullName} - ATS Tailored Resume</title>
<style>
  @page {
    size: A4;
    margin: 12mm 15mm;
  }
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #111827;
    background: #FFFFFF;
    font-size: 9.5pt;
    line-height: 1.4;
    -webkit-font-smoothing: antialiased;
  }
  .resume-container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 4px 0;
  }
  .header {
    text-align: center;
    margin-bottom: 10px;
  }
  .name {
    font-size: 19pt;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: #0F172A;
    text-transform: uppercase;
    margin-bottom: 2px;
  }
  .target-title {
    font-size: 10.5pt;
    font-weight: 600;
    color: #2563EB;
    margin-bottom: 4px;
    letter-spacing: -0.01em;
  }
  .contact-bar {
    font-size: 8.5pt;
    color: #475569;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 6px;
  }
  .contact-item:not(:last-child)::after {
    content: " • ";
    color: #94A3B8;
    margin-left: 6px;
  }
  .section {
    margin-top: 9px;
    margin-bottom: 6px;
  }
  .section-title {
    font-size: 10pt;
    font-weight: 700;
    color: #0F172A;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    border-bottom: 1.5px solid #0F172A;
    padding-bottom: 2px;
    margin-bottom: 5px;
  }
  .summary-text {
    font-size: 9pt;
    color: #334155;
    line-height: 1.45;
    text-align: justify;
  }
  .skills-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .skills-row {
    font-size: 9pt;
    color: #334155;
    line-height: 1.35;
  }
  .skills-row strong {
    color: #0F172A;
    font-weight: 600;
  }
  .entry {
    margin-bottom: 7px;
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .entry-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 1px;
  }
  .entry-title {
    font-size: 9.5pt;
    font-weight: 700;
    color: #0F172A;
  }
  .entry-company {
    font-size: 9pt;
    font-weight: 600;
    color: #334155;
  }
  .entry-meta {
    font-size: 8.5pt;
    font-weight: 500;
    color: #64748B;
    text-align: right;
    white-space: nowrap;
  }
  .bullets {
    list-style-type: disc;
    margin-left: 16px;
    margin-top: 2px;
  }
  .bullets li {
    font-size: 8.8pt;
    color: #334155;
    line-height: 1.38;
    margin-bottom: 2px;
  }
  .bullets li strong {
    color: #0F172A;
  }
  @media print {
    body {
      background: transparent;
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }
  }
</style>
</head>
<body>
<div class="resume-container">
  <header class="header">
    <h1 class="name">${fullName}</h1>
    ${targetTitle ? `<div class="target-title">${targetTitle}</div>` : ''}
    <div class="contact-bar">
      ${contactParts.map(p => `<span class="contact-item">${p}</span>`).join('')}
    </div>
  </header>

  ${summary ? `
  <section class="section">
    <h2 class="section-title">Professional Summary</h2>
    <p class="summary-text">${summary}</p>
  </section>
  ` : ''}

  ${skills.length > 0 ? `
  <section class="section">
    <h2 class="section-title">Technical Skills</h2>
    <div class="skills-list">
      ${skills.map(s => `
        <div class="skills-row">
          <strong>${s.category || 'Competencies'}:</strong> ${Array.isArray(s.items) ? s.items.join(', ') : s.items}
        </div>
      `).join('')}
    </div>
  </section>
  ` : ''}

  ${experience.length > 0 ? `
  <section class="section">
    <h2 class="section-title">Professional Experience</h2>
    ${experience.map(exp => `
      <article class="entry">
        <div class="entry-header">
          <span class="entry-title">${exp.role} <span class="entry-company">&bull; ${exp.company}</span></span>
          <span class="entry-meta">${exp.location ? `${exp.location} | ` : ''}${exp.dates || ''}</span>
        </div>
        ${exp.highlights && exp.highlights.length > 0 ? `
          <ul class="bullets">
            ${exp.highlights.map(h => `<li>${h}</li>`).join('')}
          </ul>
        ` : ''}
      </article>
    `).join('')}
  </section>
  ` : ''}

  ${projects.length > 0 ? `
  <section class="section">
    <h2 class="section-title">Key Projects &amp; Systems</h2>
    ${projects.map(proj => `
      <article class="entry">
        <div class="entry-header">
          <span class="entry-title">${proj.title} ${proj.techStack ? `<span style="font-weight: 500; font-size: 8.5pt; color: #64748B;">(${proj.techStack})</span>` : ''}</span>
          ${proj.dates ? `<span class="entry-meta">${proj.dates}</span>` : ''}
        </div>
        ${proj.highlights && proj.highlights.length > 0 ? `
          <ul class="bullets">
            ${proj.highlights.map(h => `<li>${h}</li>`).join('')}
          </ul>
        ` : ''}
      </article>
    `).join('')}
  </section>
  ` : ''}

  ${education.length > 0 ? `
  <section class="section">
    <h2 class="section-title">Education</h2>
    ${education.map(edu => `
      <article class="entry">
        <div class="entry-header">
          <span class="entry-title">${edu.degree}</span>
          <span class="entry-meta">${edu.dates || ''}</span>
        </div>
        <div class="entry-company">${edu.institution}${edu.details ? ` &bull; ${edu.details}` : ''}</div>
      </article>
    `).join('')}
  </section>
  ` : ''}

  ${certifications.length > 0 ? `
  <section class="section">
    <h2 class="section-title">Certifications &amp; Achievements</h2>
    <ul class="bullets">
      ${certifications.map(c => `<li>${c}</li>`).join('')}
    </ul>
  </section>
  ` : ''}
</div>
</body>
</html>`;
}

async function generateStructuredResume({ resume, selfDescription, jobDescription }) {
    const prompt = `You are a world-class executive resume writer and ATS optimization specialist.
Generate a TAILORED, HIGH-IMPACT resume for this candidate specifically optimized for the target job description.

CANDIDATE BACKGROUND:
Existing Resume Text: ${resume || "Not provided"}
Self Description / Profile: ${selfDescription || "Not provided"}

TARGET JOB DESCRIPTION:
${jobDescription}

REQUIREMENTS:
1. Extract candidate's name or create an authoritative professional name.
2. Provide a compelling 2-3 sentence Professional Summary tightly matching the target role keywords.
3. Categorize Technical Skills (e.g. "Languages & Runtimes", "Frameworks & Libraries", "Cloud & DevOps", "Databases & Storage").
4. Reframe Professional Experience into 3-4 bullet points per role using the Google X-Y-Z formula: "Accomplished [X] as measured by [Y], by doing [Z]".
5. Highlight quantified metrics (e.g., "reduced P99 latency by 45%", "scaled throughput to 50k req/s", "improved test coverage from 60% to 92%").
6. Include relevant Projects, Education, and Certifications.

Return ONLY a valid JSON object strictly matching this schema:
{
  "fullName": "First Last",
  "contact": {
    "email": "email@example.com",
    "phone": "+1 (555) 000-0000",
    "location": "City, State / Remote",
    "linkedin": "linkedin.com/in/profile",
    "github": "github.com/profile"
  },
  "targetTitle": "Target Job Title",
  "summary": "Tailored executive summary...",
  "skills": [
    { "category": "Languages", "items": ["TypeScript", "Python", "Go"] },
    { "category": "Backend & Cloud", "items": ["Node.js", "PostgreSQL", "Redis", "Docker", "AWS"] }
  ],
  "experience": [
    {
      "role": "Role Title",
      "company": "Company Name",
      "location": "City, State",
      "dates": "2022 - Present",
      "highlights": [
        "Architected and deployed distributed event pipeline processing 40M+ events daily with 99.99% uptime.",
        "Optimized PostgreSQL database queries and shard indexing, reducing median response times from 340ms to 48ms."
      ]
    }
  ],
  "projects": [
    {
      "title": "Project Name",
      "techStack": "Next.js, Tailwind, Redis, Groq API",
      "dates": "2024",
      "highlights": ["Designed low-latency streaming pipeline with sub-100ms response times."]
    }
  ],
  "education": [
    {
      "degree": "B.S. in Computer Science",
      "institution": "University Name",
      "dates": "Graduated 2022",
      "details": "GPA 3.8 / Dean's List"
    }
  ],
  "certifications": ["AWS Certified Solutions Architect"]
}`;

    const raw = await callGroqWithFallback({
        temperature: 0.35,
        messages: [
            {
                role: "system",
                content: "You are an expert ATS resume writer. Return strictly valid JSON conforming to the structured resume schema."
            },
            {
                role: "user",
                content: prompt
            }
        ]
    });

    let parsed;
    try {
        parsed = JSON.parse(raw);
    } catch (e) {
        const match = raw.match(/\{[\s\S]*\}/);
        if (match) {
            parsed = JSON.parse(match[0]);
        } else {
            throw new Error(`Failed to parse resume JSON: ${e.message}`);
        }
    }

    return structuredResumeSchema.parse(parsed);
}

// ── PDF Generation Functions ───────────────────────────────────────────────────

async function generatePdfFromHtml(htmlContent) {
    let browser;
    try {
        if (!htmlContent || typeof htmlContent !== 'string') {
            throw new Error("Invalid HTML content provided to generatePdfFromHtml");
        }

        console.log("Launching Puppeteer browser...");
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--single-process',
                '--disable-gpu'
            ]
        });
        
        const page = await browser.newPage();
        console.log("Setting page content...");
        await page.setContent(htmlContent, { waitUntil: "networkidle0" });

        console.log("Generating PDF...");
        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "12mm",
                bottom: "12mm",
                left: "14mm",
                right: "14mm"
            }
        });

        await browser.close();
        
        if (!pdfBuffer || pdfBuffer.length === 0) {
            throw new Error("Generated PDF buffer is empty");
        }

        console.log(`PDF generated successfully. Size: ${pdfBuffer.length} bytes`);
        return pdfBuffer;
    } catch (error) {
        console.error("Error in generatePdfFromHtml:", error);
        if (browser) {
            await browser.close().catch(e => console.error("Error closing browser:", e));
        }
        throw error;
    }
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    try {
        if (!process.env.GROQ_API_KEY) {
            throw new Error("Missing GROQ_API_KEY in environment variables");
        }

        console.log("Generating structured resume data from AI...");
        const resumeData = await generateStructuredResume({ resume, selfDescription, jobDescription });

        console.log("Rendering Harvard ATS HTML template...");
        const html = renderAtsResumeHtml(resumeData);

        console.log("Converting HTML to PDF via Puppeteer...");
        const pdfBuffer = await generatePdfFromHtml(html);

        return { pdfBuffer, html, resumeData };
    } catch (error) {
        console.error("Error in generateResumePdf:", error);
        throw error;
    }
}

module.exports = {
    generateInterviewReport,
    generateStructuredResume,
    renderAtsResumeHtml,
    generateResumePdf,
    generatePdfFromHtml
};