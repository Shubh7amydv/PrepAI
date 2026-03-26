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

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    if (!process.env.GROQ_API_KEY) {
        throw new Error("Missing GROQ_API_KEY in environment variables");
    }

    const prompt = `You are an expert interview coach and hiring manager. Generate a COMPREHENSIVE interview report for a candidate applying for a position.

CANDIDATE PROFILE:
Resume/Experience: ${resume}
Self Description: ${selfDescription}

JOB DESCRIPTION:
${jobDescription}

CRITICAL REQUIREMENTS - Generate DETAILED and COMPREHENSIVE content:

1. MATCH SCORE (0-100): Analyze how well the candidate's skills, experience, and background match the job requirements. Be thorough in your analysis.

2. TECHNICAL QUESTIONS: Generate 8-10 highly relevant technical questions that would likely be asked in interviews for this role. Include:
   - Deep technical questions specific to the tech stack mentioned in the job
   - System design or architecture questions if applicable
   - Problem-solving scenarios
   - Each question should have:
     * A clear, specific question
     * The interviewer's intention behind asking it
     * A detailed answer covering key points, approaches, and best practices
     * Real-world examples if applicable

3. BEHAVIORAL QUESTIONS: Generate 6-8 behavioral and situational questions tailored to the role and company needs. Include:
   - Leadership and teamwork questions
   - Conflict resolution scenarios
   - Problem-solving under pressure
   - Achievement and failure stories
   - Each question should have:
     * A clear behavioral question
     * Why the interviewer asks this (intention)
     * A detailed answer using STAR method when applicable
     * Tips for impactful responses

4. SKILL GAPS: Identify 5-8 skill gaps or areas where the candidate could improve. For each:
   - Name the specific skill or knowledge area
   - Rate severity as "low", "medium", or "high"
   - Explain why this skill is important for the role

5. PREPARATION PLAN: Create a detailed 10-14 day intensive preparation roadmap:
   - Each day should have a specific focus area
   - Include 3-5 concrete tasks per day
   - Tasks should be specific resources, practice problems, or learning activities
   - Cover: technical concepts, system design, behavioral prep, mock interviews, projects
   - Example tasks: "Study [specific topic] from [resource]", "Solve [N] problems on [platform]", "Practice mock interview focusing on [area]"
   - Make the plan actionable and time-bound

6. JOB TITLE: Return the exact job title for which this report is generated

Return ONLY valid JSON with NO additional text, following this exact structure:
{
  "matchScore": number (0-100),
  "technicalQuestions": [
    {
      "question": "specific technical question",
      "intention": "why interviewer asks this",
      "answer": "detailed answer with key points and examples"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "behavioral question",
      "intention": "why interviewer asks this",
      "answer": "detailed answer with STAR method and examples"
    }
  ],
  "skillGaps": [
    {
      "skill": "skill name",
      "severity": "low|medium|high"
    }
  ],
  "preparationPlan": [
    {
      "day": number (starting from 1),
      "focus": "specific focus for this day",
      "tasks": ["Task 1: specific and actionable", "Task 2: specific and actionable", ...]
    }
  ],
  "title": "exact job title"
}

IMPORTANT:
- Generate AT LEAST 8 technical questions and 6 behavioral questions
- Each answer should be 2-3 sentences minimum with concrete details
- Preparation plan should be 10+ days with 3-5 tasks per day
- All content should be highly specific to the job description and candidate profile
- Make sure tasks are actionable with specific resources or platforms when possible`

    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
            {
                role: "system",
                content: "You are an expert interview coach and hiring manager. Always return strictly valid JSON only. Generate comprehensive, detailed, and specific content with many interview questions and a detailed preparation plan. Be thorough in your analysis and recommendations."
            },
            {
                role: "user",
                content: prompt,
            },
        ],
    });

    const raw = completion.choices?.[0]?.message?.content;

    if (!raw) {
        throw new Error("Groq returned an empty response");
    }

    const parsed = JSON.parse(raw);

    return interviewReportSchema.parse(parsed);
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
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            temperature: 0.4,
            response_format: { type: "json_object" },
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

        const raw = completion.choices?.[0]?.message?.content;

        if (!raw) {
            throw new Error("Groq returned an empty response for resume generation");
        }

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