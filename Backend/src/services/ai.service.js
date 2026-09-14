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

    const prompt = `You are an expert interview coach and hiring manager. Generate a COMPREHENSIVE interview report for a candidate applying for a position.

CANDIDATE PROFILE:
Resume/Experience: ${resume || "Provided in self-description"}
Self Description: ${selfDescription || "Not provided"}

JOB DESCRIPTION:
${jobDescription}

CRITICAL REQUIREMENTS - Generate DETAILED and COMPREHENSIVE content:

1. MATCH SCORE (0-100): Analyze how well the candidate's skills, experience, and background match the job requirements.
2. TECHNICAL QUESTIONS: Generate 8-10 highly relevant technical questions with question, intention, and detailed answer.
3. BEHAVIORAL QUESTIONS: Generate 6-8 behavioral questions with question, intention, and answer using STAR method.
4. SKILL GAPS: Identify 4-6 specific skill gaps with skill name and severity ("low", "medium", or "high").
5. PREPARATION PLAN: Create a detailed day-wise preparation roadmap (10-14 days) with day number, focus, and actionable tasks array.
6. TITLE: The job title for this position.

Return ONLY valid JSON with this exact structure:
{
  "title": "Exact Job Title",
  "matchScore": 75,
  "technicalQuestions": [
    { "question": "...", "intention": "...", "answer": "..." }
  ],
  "behavioralQuestions": [
    { "question": "...", "intention": "...", "answer": "..." }
  ],
  "skillGaps": [
    { "skill": "...", "severity": "low|medium|high" }
  ],
  "preparationPlan": [
    { "day": 1, "focus": "...", "tasks": ["Task 1", "Task 2"] }
  ]
}`;

    const raw = await callGroqWithFallback({
        temperature: 0.3,
        messages: [
            {
                role: "system",
                content: "You are an expert interview coach. Return strictly valid JSON with comprehensive interview prep content."
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
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        console.log("Setting page content...");
        await page.setContent(htmlContent, { waitUntil: "networkidle0" });

        console.log("Generating PDF...");
        const pdfBuffer = await page.pdf({
            format: "A4",
            margin: {
                top: "20mm",
                bottom: "20mm",
                left: "15mm",
                right: "15mm"
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

        const resumePdfSchema = z.object({
            html: z.string().describe("The HTML content of the resume which can be converted to PDF using puppeteer")
        });

        const prompt = `You are an expert professional resume writer with deep knowledge of ATS systems and hiring practices. Generate a TAILORED resume for this candidate.

CANDIDATE PROFILE:
Current Resume/Experience: ${resume}
Self Description: ${selfDescription}

TARGET JOB:
${jobDescription}

CRITICAL INSTRUCTIONS for Resume Generation:

1. ANALYSIS & TAILORING:
   - Analyze the job description thoroughly for key requirements, skills, and responsibilities
   - Identify which of the candidate's experiences are most relevant
   - Reframe and highlight achievements that match the job
   - Use keywords from the job description naturally throughout the resume

2. RESUME STRUCTURE (in order):
   - Header: Full Name, Email, Phone, LinkedIn URL (if available)
   - Professional Summary: 2-3 lines tailored to the target role, highlighting key strengths
   - Key Skills: 6-8 relevant skills matching the job requirements (organized by category if applicable)
   - Professional Experience: 3-5 most relevant positions with:
     * Company name, job title, duration
     * 4-5 achievement-focused bullet points using action verbs
     * Quantifiable results where possible (metrics, percentages, numbers)
     * Focus on accomplishments over responsibilities
   - Education: Degree, University, Graduation year, relevant coursework/certifications
   - Certifications/Achievements (if any relevant ones exist)
   - Optional: Projects or Portfolio links

3. CONTENT QUALITY:
   - Use strong action verbs: "Designed", "Implemented", "Optimized", "Led", "Architected"
   - Quantify achievements: percentages, numbers, time improvements
   - Focus on impact and value delivered, not just duties
   - Make it human-written, not robotic or AI-sounding
   - Tailor all experiences to highlight job-relevant skills
   - Keep to 1-2 pages maximum but prioritize quality

4. ATS OPTIMIZATION:
   - Use standard section headings (Professional Summary, Skills, Experience, Education)
   - Include relevant keywords from job description naturally
   - Use simple, clean formatting without images, tables, or special characters
   - Use bullet points with consistent formatting
   - Spell out abbreviations on first mention
   - Include technical skills that match the job

5. STYLING & FORMAT:
   - Professional color scheme (dark headings, clean layout)
   - Clear visual hierarchy with distinct sections
   - Use HTML semantic tags and simple CSS
   - Readable fonts (Arial, Calibri, etc.)
   - Proper spacing and margins for visual appeal
   - Bold for job titles and company names
   - Italics for dates and locations
   - Clean borders or dividers between sections

6. CRITICAL REQUIREMENTS:
   - No images, logos, or graphics (ATS incompatible)
   - No tables or complex layouts
   - Complete, valid, well-formatted HTML
   - Responsive and printer-friendly
   - All text must be selectable (important for ATS)
   - Include ALL necessary content fields

Return ONLY valid JSON with complete, production-ready HTML:
{
  "html": "<!DOCTYPE html><html>...</html>"
}

REMEMBER:
- This resume will be parsed by ATS systems - keep it clean and simple
- Focus on achievements and metrics, not duties
- Tailor heavily to the job description
- Make it look professional but natural
- Include all relevant information that matches the job requirements`;

        console.log("Calling Groq API for resume generation...");
        const raw = await callGroqWithFallback({
            temperature: 0.4,
            messages: [
                {
                    role: "system",
                    content: "You are an expert professional resume writer and ATS specialist. Generate only valid JSON with comprehensive, tailored, achievement-focused resume HTML. Ensure the resume is ATS-friendly, professional, and tailored to the specific job description. Include detailed content with strong achievements and metrics."
                },
                {
                    role: "user",
                    content: prompt
                }
            ]
        });

        console.log("Parsing Groq response...");
        let parsed;
        try {
            parsed = JSON.parse(raw);
        } catch (e) {
            console.error("JSON parse error. Raw response:", raw.substring(0, 500));
            throw new Error(`Failed to parse Groq response as JSON: ${e.message}`);
        }

        const validated = resumePdfSchema.parse(parsed);

        if (!validated.html) {
            throw new Error("Resume HTML is empty or not provided");
        }

        console.log("HTML validated. Converting to PDF...");
        const pdfBuffer = await generatePdfFromHtml(validated.html);

        if (!pdfBuffer || pdfBuffer.length === 0) {
            throw new Error("PDF buffer is empty after generation");
        }

        return pdfBuffer;
    } catch (error) {
        console.error("Error in generateResumePdf:", error);
        throw error;
    }
}



module.exports = { generateInterviewReport, generateResumePdf, generatePdfFromHtml };