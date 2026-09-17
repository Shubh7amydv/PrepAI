const pdfParse = require("pdf-parse");
const { generateInterviewReport, generateResumePdf }=require("../services/ai.service");
const interviewReportmodel=require("../models/interviewReport.model");

async function generateInterviewReportController(req, res) {
    try {
        // Extract job description, self description and optional raw resume text from request body
        const { jobDescription, selfDescription = "", resume: resumeFromBody = "" } = req.body;

        let resumeContent = "";

        // If a file is uploaded, parse it and normalize to plain text only.
        if (req.file?.buffer) {
            try {
                const parsedResume = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
                if (typeof parsedResume === "string") {
                    resumeContent = parsedResume;
                } else if (parsedResume && typeof parsedResume.text === "string") {
                    resumeContent = parsedResume.text;
                }
            } catch (pdfErr) {
                console.warn("Could not extract text from uploaded resume buffer:", pdfErr.message);
                resumeContent = req.file.originalname ? `Uploaded Resume File: ${req.file.originalname}` : "";
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
    } catch (error) {
        console.error("Error generating interview report:", error);
        res.status(500).json({
            message: "Failed to generate interview report",
            error: error.message
        });
    }
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
        const result = await generateResumePdf({
            resume: resumeContent,
            jobDescription,
            selfDescription,
        });

        const pdfBuffer = result?.pdfBuffer || (Buffer.isBuffer(result) ? result : null);

        if (pdfBuffer && pdfBuffer.length > 0) {
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="tailored-resume.pdf"',
                'Content-Length': pdfBuffer.length
            });
            return res.send(pdfBuffer);
        }

        if (result?.html) {
            return res.status(200).json({
                message: "Resume generated as HTML",
                html: result.html,
                resumeData: result.resumeData
            });
        }

        return res.status(500).json({ message: "Error: PDF buffer is empty" });
    } catch (error) {
        console.error("Error generating resume PDF:", error);
        res.status(500).json({ 
            message: "Error generating resume PDF", 
            error: error.message 
        });
    }
}


async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params;
        const interviewReport = await interviewReportmodel.findOne({
            _id: interviewId,
            user: req.user.id
        });

        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found" });
        }

        res.status(200).json({
            message: "Interview report fetched successfully",
            interviewReport
        });
    } catch (error) {
        console.error("Error fetching interview report:", error);
        res.status(500).json({ message: "Failed to fetch interview report", error: error.message });
    }
}

async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportmodel.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            message: "Interview reports fetched successfully",
            interviewReports: interviewReports || []
        });
    } catch (error) {
        console.error("Error fetching all interview reports:", error);
        res.status(500).json({ message: "Failed to fetch interview reports", error: error.message });
    }
}

module.exports = {
    generateInterviewReportController,
    generateResumePdfController,
    getInterviewReportByIdController,
    getAllInterviewReportsController
};



