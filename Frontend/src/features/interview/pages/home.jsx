import React, { useState, useRef } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useAuth } from '../../auth/hooks/useAuth.js'
import { useNavigate, Link } from 'react-router'
import { generateResumePdf } from '../services/interview.api.js'
import { LogoIcon } from '../../../components/Logo.jsx'

const Home = () => {
    const { user, logout } = useAuth()
    const { loading, generateReport, reports } = useInterview()
    const [ jobDescription, setJobDescription ] = useState("")
    const [ selfDescription, setSelfDescription ] = useState("")
    const [ pdfLoading, setPdfLoading ] = useState(false)
    const [ uploadedResumeName, setUploadedResumeName ] = useState("")
    const [ uploadStatus, setUploadStatus ] = useState({ type: "", message: "" })
    const resumeInputRef = useRef()

    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await logout()
            navigate('/login')
        } catch (err) {
            navigate('/login')
        }
    }

    const handleResumeChange = (e) => {
        const file = e.target.files?.[0]

        if (!file) {
            setUploadedResumeName("")
            setUploadStatus({ type: "", message: "" })
            return
        }

        const maxFileSizeInBytes = 5 * 1024 * 1024
        const allowedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]

        if (!allowedTypes.includes(file.type)) {
            e.target.value = ''
            setUploadedResumeName("")
            setUploadStatus({ type: 'error', message: 'Unsupported format. Please upload PDF or DOCX.' })
            return
        }

        if (file.size > maxFileSizeInBytes) {
            e.target.value = ''
            setUploadedResumeName("")
            setUploadStatus({ type: 'error', message: 'File is too large. Max size is 5MB.' })
            return
        }

        setUploadedResumeName(file.name)
        setUploadStatus({ type: 'success', message: 'Resume attached successfully.' })
    }

    const handleGenerateReport = async () => {
        try {
            const resumeFile = resumeInputRef.current?.files?.[ 0 ]
            const data = await generateReport({ jobDescription, selfDescription, resumeFile })
            if (data?._id) {
                navigate(`/interview/${data._id}`)
            }
        } catch (error) {
            console.error("Failed to generate report:", error)
        }
    }

    const handleGeneratePdf = async () => {
        try {
            const resumeFile = resumeInputRef.current.files[ 0 ]
            if (!jobDescription && !selfDescription && !resumeFile) {
                alert("Please provide at least a Job Description or a Resume/Self-Description.")
                return
            }
            setPdfLoading(true)
            await generateResumePdf({ jobDescription, selfDescription, resumeFile })
        } catch (error) {
            console.error("Error generating PDF:", error)
            alert("Failed to generate PDF resume. Please try again.")
        } finally {
            setPdfLoading(false)
        }
    }

    return (
        <div className='home-page'>
            {/* Top Workspace Header */}
            <header className='app-nav'>
                <Link to='/' className='app-brand'>
                    <LogoIcon size={30} />
                    <span className='app-brand__name'>Prep<span style={{ color: '#E8622C' }}>AI</span></span>
                </Link>

                <div className='app-nav__user'>
                    {user && (
                        <span className='user-name'>{user.username || user.email}</span>
                    )}
                    <button onClick={handleLogout} className='logout-btn' title='Sign out'>
                        Sign out
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className='home-content'>
                <div className='page-header'>
                    <h1 className='page-header__title'>Create Your Custom Interview Plan</h1>
                    <p className='page-header__sub'>Provide your target job requirements and profile to receive customized interview questions, interviewer expectations, and a milestone roadmap.</p>
                </div>

                {/* Strategy Form Container */}
                <div className='strategy-card'>
                    <div className='strategy-card__grid'>

                        {/* Column 1: Job Description */}
                        <div className='strategy-col strategy-col--job'>
                            <div className='col-header'>
                                <h2>Target job description</h2>
                                <span className='label-required'>Required</span>
                            </div>

                            <div className='input-wrapper'>
                                <textarea
                                    onChange={(e) => { setJobDescription(e.target.value) }}
                                    value={jobDescription}
                                    className='custom-textarea custom-textarea--tall'
                                    placeholder="Paste the full job description here...&#10;&#10;e.g. 'Senior Frontend Engineer: Must have deep knowledge of React internals, TypeScript, web performance profiling, and distributed API integrations...'"
                                    maxLength={5000}
                                />
                                <div className='char-row'>
                                    <span className='char-count'>{jobDescription.length} / 5000 characters</span>
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Candidate Profile */}
                        <div className='strategy-col strategy-col--profile'>
                            <div className='col-header'>
                                <h2>Your profile &amp; experience</h2>
                            </div>

                            {/* Dropzone */}
                            <div className='upload-block'>
                                <div className='upload-block__header'>
                                    <label className='sub-label'>Upload resume</label>
                                    <span className='chip-tag'>Recommended</span>
                                </div>

                                <label className='dropzone-box' htmlFor='resume'>
                                    <span className='dropzone-text'>Click or drag &amp; drop to upload</span>
                                    <span className='dropzone-hint'>PDF or DOCX (Max 5MB)</span>
                                    <input
                                        ref={resumeInputRef}
                                        hidden
                                        type='file'
                                        id='resume'
                                        name='resume'
                                        accept='.pdf,.docx'
                                        onChange={handleResumeChange}
                                    />
                                </label>

                                {uploadStatus.message && (
                                    <p className={`upload-msg upload-msg--${uploadStatus.type}`}>
                                        {uploadStatus.message}
                                    </p>
                                )}

                                {uploadedResumeName && (
                                    <div className='file-pill'>
                                        <span className='file-name'>{uploadedResumeName}</span>
                                    </div>
                                )}
                            </div>

                            {/* Plain Divider */}
                            <div className='divider-or'>
                                <span>or background summary</span>
                            </div>

                            {/* Summary Textarea */}
                            <div className='summary-block'>
                                <label className='sub-label' htmlFor='selfDescription'>Quick background summary</label>
                                <textarea
                                    onChange={(e) => { setSelfDescription(e.target.value) }}
                                    value={selfDescription}
                                    id='selfDescription'
                                    name='selfDescription'
                                    className='custom-textarea custom-textarea--short'
                                    placeholder="Briefly state your years of experience, primary tech stack, and notable project deliverables..."
                                />
                            </div>

                            {/* Warning Note */}
                            <div className='notice-note'>
                                <span>Upload a <strong>Resume</strong> or provide a <strong>Summary</strong> for accurate role matching.</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Action Bar */}
                    <div className='strategy-card__footer'>
                        <div className='footer-meta'>
                            <span>Analysis takes ~15–20 seconds</span>
                        </div>
                        <div className='action-btns'>
                            <button
                                type="button"
                                onClick={handleGeneratePdf}
                                disabled={pdfLoading}
                                className='btn-secondary-action'>
                                {pdfLoading ? 'Drafting...' : 'Generate Resume PDF'}
                            </button>
                            <button
                                type="button"
                                onClick={handleGenerateReport}
                                disabled={loading}
                                className='btn-primary-action'>
                                {loading ? 'Generating strategy...' : 'Generate Interview Strategy'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Recent Interview Plans */}
                {!loading && reports && reports.length > 0 && (
                    <section className='recent-section'>
                        <div className='recent-header'>
                            <h2>Recent interview plans</h2>
                            <span className='recent-count'>{reports.length} saved</span>
                        </div>
                        <div className='recent-list'>
                            {reports.map(report => (
                                <div
                                    key={report._id}
                                    className='recent-row'
                                    onClick={() => navigate(`/interview/${report._id}`)}
                                >
                                    <div className='recent-row__info'>
                                        <h3 className='recent-row__title'>{report.title || 'Target Position Plan'}</h3>
                                        <span className='recent-row__date'>Created {new Date(report.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    <div className='recent-row__score'>
                                        <span className='score-badge'>{report.matchScore || 80}% Match</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <footer className='home-footer'>
                <p>&copy; {new Date().getFullYear()} PrepAI. All rights reserved.</p>
            </footer>
        </div>
    )
}

export default Home