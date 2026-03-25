const pdfParse = require("pdf-parse");
const { generateInterviewReport, generateResumePdf }=require("../services/ai.service");
const interviewReportmodel=require("../models/interviewReport.model");

async function generateInterviewReportController(req, res) {
    // Extract job description, self description and optional raw resume text from request body
    const { jobDescription, selfDescription = "", resume: resumeFromBody = "" } = req.body;

    let resumeContent = "";

    // If a file is uploaded, parse it and normalize to plain text only.
    if (req.file?.buffer) {
        const parsedResume = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
        if (typeof parsedResume === "string") {
            resumeContent = parsedResume;
        } else if (parsedResume && typeof parsedResume.text === "string") {
            resumeContent = parsedResume.text;
        }
    }

    // Helpful for Postman/manual testing where resume can be provided directly in JSON body.
    if (!resumeContent && typeof resumeFromBody === "string") {
        resumeContent = resumeFromBody;
    }

    if (!jobDescription || typeof jobDescription !== "string") {
        return res.status(400).json({ message: "jobDescription is required" });
    }

    if (!resumeContent && !selfDescription) {
        return res.status(400).json({ message: "Either resume file/text or selfDescription is required" });
    }

    const interviewReportByAi = await generateInterviewReport({
        resume: resumeContent,
        jobDescription,
        selfDescription,
    });

    const interviewReport = await interviewReportmodel.create({
        user: req.user.id,
        resume: resumeContent,
        jobDescription,
        selfDescription,
        ...interviewReportByAi,
    });

    res.status(200).json({
        message: "Interview report generated successfully",
        interviewReport,
    });

}

async function generateResumePdfController(req, res) {
    try {
        // Extract job description, self description and optional raw resume text from request body
        const { jobDescription, selfDescription = "", resume: resumeFromBody = "" } = req.body;

        let resumeContent = "";

        // If a file is uploaded, parse it and normalize to plain text only.
        if (req.file?.buffer) {
            const parsedResume = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
            if (typeof parsedResume === "string") {
                resumeContent = parsedResume;
            } else if (parsedResume && typeof parsedResume.text === "string") {
                resumeContent = parsedResume.text;
            }
        }

        // Helpful for manual testing where resume can be provided directly in JSON body.
        if (!resumeContent && typeof resumeFromBody === "string") {
            resumeContent = resumeFromBody;
        }

        if (!jobDescription || typeof jobDescription !== "string") {
            return res.status(400).json({ message: "jobDescription is required" });
        }

        if (!resumeContent && !selfDescription) {
            return res.status(400).json({ message: "Either resume file/text or selfDescription is required" });
        }

        console.log("Generating tailored resume PDF...");
        const pdfBuffer = await generateResumePdf({
            resume: resumeContent,
            jobDescription,
            selfDescription,
        });

        if (!pdfBuffer || pdfBuffer.length === 0) {
            return res.status(500).json({ message: "Error: PDF buffer is empty" });
        }

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="tailored-resume.pdf"',
            'Content-Length': pdfBuffer.length
        });

        res.send(pdfBuffer);
    } catch (error) {
        console.error("Error generating resume PDF:", error);
        res.status(500).json({ 
            message: "Error generating resume PDF", 
            error: error.message 
        });
    }
}


module.exports={ generateInterviewReportController, generateResumePdfController }



