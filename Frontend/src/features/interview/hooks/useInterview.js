
import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useContext, useEffect, useState } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()
    const [ resumeLoading, setResumeLoading ] = useState(false)

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        let response = null
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            if (response?.interviewReport) {
                setReport(response.interviewReport)
            }
        } catch (error) {
            console.error("Error generating interview report:", error)
            const errorMsg = error?.response?.data?.message || error?.message || "Failed to generate interview report"
            alert(errorMsg)
            throw error
        } finally {
            setLoading(false)
        }

        return response?.interviewReport || null
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            if (response?.interviewReport) {
                setReport(response.interviewReport)
            }
        } catch (error) {
            console.error("Error fetching report by ID:", error)
        } finally {
            setLoading(false)
        }
        return response?.interviewReport || null
    }

    const getReports = async () => {
        setLoading(true)
        let response = null
        try {
            response = await getAllInterviewReports()
            if (response?.interviewReports) {
                setReports(response.interviewReports)
            }
        } catch (error) {
            console.error("Error fetching interview reports:", error)
        } finally {
            setLoading(false)
        }

        return response?.interviewReports || []
    }

    const getResumePdf = async (interviewReport) => {
        if (!interviewReport?.jobDescription) {
            alert("Missing interview report details. Please refresh and try again.")
            return
        }

        setResumeLoading(true)
        try {
            const result = await generateResumePdf({
                jobDescription: interviewReport.jobDescription,
                selfDescription: interviewReport.selfDescription || "",
                resumeText: interviewReport.resume || "",
            })

            if (result?.fallbackUsed) {
                alert("Server resume generation is currently unavailable. Downloaded a fallback PDF instead.")
            }
        } catch (error) {
            console.log(error)
            alert(error?.response?.data?.message || "Failed to generate resume PDF. Please try again.")
        } finally {
            setResumeLoading(false)
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [ interviewId ])

    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf, resumeLoading }

}
