import React, { useState, useRef } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useAuth } from '../../auth/hooks/useAuth.js'
import { useNavigate, Link } from 'react-router'
import { generateResumePdf } from '../services/interview.api.js'

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
        setUploadStatus({ type: 'success', message: 'Resume uploaded successfully.' })
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
                    <div className='app-brand__icon'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <span className='app-brand__name'>PrepAI</span>
                </Link>

                <div className='app-nav__user'>
                    {user && (
                        <div className='user-badge'>
                            <span className='user-dot' />
                            <span className='user-name'>{user.username || user.email}</span>
                        </div>
                    )}
                    <button onClick={handleLogout} className='logout-btn' title='Sign out'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                        <span>Sign out</span>
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className='home-content'>
                <div className='page-header'>
                    <div className='page-header__badge'>
                        <span className='badge-spark'>⚡</span> Strategy Workspace
                    </div>
                    <h1 className='page-header__title'>Generate an Interview Strategy</h1>
                    <p className='page-header__sub'>Provide your target job requirements and profile to receive customized interview questions, interviewer expectations, and a milestone roadmap.</p>
                </div>

                {/* Strategy Form Container */}
                <div className='strategy-card'>
                    <div className='strategy-card__grid'>

                        {/* Column 1: Job Description */}
                        <div className='strategy-col strategy-col--job'>
                            <div className='col-header'>
                                <div className='col-header__left'>
                                    <div className='col-icon-box'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                                    </div>
                                    <h2>Target Job Description</h2>
                                </div>
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
                                <div className='col-header__left'>
                                    <div className='col-icon-box'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                    </div>
                                    <h2>Your Profile &amp; Experience</h2>
                                </div>
                            </div>

                            {/* Dropzone */}
                            <div className='upload-block'>
                                <div className='upload-block__header'>
                                    <label className='sub-label'>Upload Resume</label>
                                    <span className='chip-tag'>Recommended</span>
                                </div>

                                <label className='dropzone-box' htmlFor='resume'>
                                    <div className='dropzone-icon-box'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                    </div>
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
                                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                                        <span className='file-name'>{uploadedResumeName}</span>
                                    </div>
                                )}
                            </div>

                            {/* Plain Divider */}
                            <div className='divider-or'>
                                <span>or summary</span>
                            </div>

                            {/* Summary Textarea */}
                            <div className='summary-block'>
                                <label className='sub-label' htmlFor='selfDescription'>Quick Background Summary</label>
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
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                <span>Upload a <strong>Resume</strong> or provide a <strong>Summary</strong> for accurate role matching.</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Action Bar */}
                    <div className='strategy-card__footer'>
                        <div className='footer-meta'>
                            <span className='status-dot-pulse' />
                            <span>Fast AI synthesis &bull; takes ~15–20s</span>
                        </div>
                        <div className='action-btns'>
                            <button
                                type="button"
                                onClick={handleGeneratePdf}
                                disabled={pdfLoading}
                                className='btn-secondary-action'
                                title="Draft an ATS-optimized resume for this job">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                <span>{pdfLoading ? 'Drafting...' : 'Draft Resume PDF'}</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleGenerateReport}
                                disabled={loading}
                                className='btn-primary-action'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                                <span>{loading ? 'Synthesizing Strategy...' : 'Generate Interview Strategy'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Recent Interview Plans */}
                {!loading && reports && reports.length > 0 && (
                    <section className='recent-section'>
                        <div className='recent-header'>
                            <h2>Recent Interview Strategies</h2>
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
                                        <h3 className='recent-row__title'>{report.title || 'Target Role Strategy'}</h3>
                                        <span className='recent-row__date'>Generated {new Date(report.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    <div className='recent-row__score'>
                                        <span className='score-badge'>{report.matchScore || 80}% Match</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <footer className='home-footer'>
                <p>&copy; {new Date().getFullYear()} PrepAI &bull; Autonomous Interview Architecture</p>
            </footer>
        </div>
    )
}

export default Home