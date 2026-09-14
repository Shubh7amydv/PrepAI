import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://prepai-1zor.onrender.com",
    withCredentials: true,
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("prepai_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const downloadArrayBufferPdf = (arrayBuffer, fileName) => {
    const blob = new Blob([ arrayBuffer ], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

const buildFallbackResumePdf = async ({ jobDescription, selfDescription, resumeText }) => {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })

    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 42
    const contentWidth = pageWidth - margin * 2
    let y = 54

    const ensureSpace = (required = 24) => {
        if (y + required > pageHeight - margin) {
            doc.addPage()
            y = 54
        }
    }

    const addHeading = (text) => {
        ensureSpace(30)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(14)
        doc.text(text, margin, y)
        y += 18
        doc.setDrawColor(220)
        doc.line(margin, y, pageWidth - margin, y)
        y += 14
    }

    const addBody = (text) => {
        const safeText = (text || 'Not provided').trim() || 'Not provided'
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(11)
        const lines = doc.splitTextToSize(safeText, contentWidth)
        lines.forEach((line) => {
            ensureSpace(16)
            doc.text(line, margin, y)
            y += 14
        })
        y += 10
    }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(18)
    doc.text('Tailored Resume Draft', margin, y)
    y += 28

    addHeading('Professional Summary')
    addBody(selfDescription)

    addHeading('Target Job Description')
    addBody(jobDescription)

    addHeading('Experience / Resume Highlights')
    addBody(resumeText)

    doc.save('tailored-resume.pdf')
}


/**
 * @description Service to generate interview report based on user self description, resume and job description.
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {

    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)
    formData.append("resume", resumeFile)

    const response = await api.post("/api/interview/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })

    return response.data

}


/**
 * @description Service to get interview report by interviewId.
 */
export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`)

    return response.data
}


/**
 * @description Service to get all interview reports of logged in user.
 */
export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview/")

    return response.data
}

/**
 * @description Service to generate a tailored resume PDF based on job description and candidate profile.
 */
export const generateResumePdf = async ({ jobDescription, selfDescription, resumeFile, resumeText }) => {
    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)
    if (resumeFile) {
        formData.append("resume", resumeFile)
    } else if (resumeText) {
        formData.append("resume", resumeText)
    }

    try {
        const response = await api.post("/api/interview/resume-pdf", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            responseType: 'arraybuffer'
        })

        downloadArrayBufferPdf(response.data, 'tailored-resume.pdf')
        return { fallbackUsed: false }
    } catch (error) {
        console.error('Server PDF generation failed, using browser fallback PDF:', error)
        await buildFallbackResumePdf({ jobDescription, selfDescription, resumeText })
        return { fallbackUsed: true }
    }
}