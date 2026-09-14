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
            setUploadStatus({ type: 'error', message: 'Unsupported file format. Please upload PDF or DOCX.' })
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
                alert("Please fill in at least job description or provide resume/self description")
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

            {/* App Top Navbar */}
            <header className='app-nav'>
                <Link to='/' className='app-brand'>
                    <span className='app-brand__mark'>P</span>
                    <span className='app-brand__name'>PrepAI</span>
                </Link>
                <div className='app-nav__user'>
                    {user && (
                        <span className='user-badge'>
                            <span className='user-dot' />
                            {user.username || user.email}
                        </span>
                    )}
                    <button onClick={handleLogout} className='logout-btn' title='Sign out'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                        Sign out
                    </button>
                </div>
            </header>

            {/* Page Header */}
            <header className='page-header'>
                <h1 className='page-header__title'>Create your custom interview plan</h1>
                <p className='page-header__sub'>Let our AI analyze role requirements and your unique background to build an interview strategy.</p>
            </header>

            {/* Main Unified Strategy Card */}
            <div className='strategy-card'>
                <div className='strategy-card__grid'>

                    {/* Column 1: Target Job Description */}
                    <div className='strategy-col strategy-col--job'>
                        <div className='col-header'>
                            <div className='col-header__left'>
                                <svg className='col-icon' xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                                <h2>Target job description</h2>
                            </div>
                            <span className='label-required'>Required</span>
                        </div>
                        <div className='input-wrapper'>
                            <textarea
                                onChange={(e) => { setJobDescription(e.target.value) }}
                                value={jobDescription}
                                className='custom-textarea custom-textarea--tall'
                                placeholder="Paste the full job description here...&#10;e.g. 'Senior Frontend Engineer requires proficiency in React, TypeScript, performance profiling, and distributed systems...'"
                                maxLength={5000}
                            />
                            <span className='char-count'>{jobDescription.length} / 5000</span>
                        </div>
                    </div>

                    {/* Column 2: Profile (Resume + Summary) */}
                    <div className='strategy-col strategy-col--profile'>
                        <div className='col-header'>
                            <div className='col-header__left'>
                                <svg className='col-icon' xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                <h2>Your profile</h2>
                            </div>
                        </div>

                        {/* Resume upload */}
                        <div className='upload-block'>
                            <div className='upload-block__label-row'>
                                <label className='sub-label'>Upload resume</label>
                                <span className='chip-best'>Best results</span>
                            </div>
                            <label className='dropzone-box' htmlFor='resume'>
                                <svg className='dropzone-icon' xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                                <span className='dropzone-text'>Click to upload or drag &amp; drop</span>
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
                                <p className='file-selected-text' title={uploadedResumeName}>
                                    Selected: {uploadedResumeName}
                                </p>
                            )}
                        </div>

                        {/* Plain OR divider */}
                        <div className='divider-or'>
                            <span>or</span>
                        </div>

                        {/* Quick Self-Description */}
                        <div className='summary-block'>
                            <label className='sub-label' htmlFor='selfDescription'>Quick self-description</label>
                            <textarea
                                onChange={(e) => { setSelfDescription(e.target.value) }}
                                value={selfDescription}
                                id='selfDescription'
                                name='selfDescription'
                                className='custom-textarea custom-textarea--short'
                                placeholder="Briefly describe your years of experience, core tech stack, and notable projects..."
                            />
                        </div>

                        {/* Warm Warning Box */}
                        <div className='warning-note'>
                            <svg className='warning-icon' xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                            <p>Either a <strong>Resume</strong> or a <strong>Self-Description</strong> is required for role matching.</p>
                        </div>
                    </div>
                </div>

                {/* Footer Action Bar */}
                <div className='strategy-card__footer'>
                    <span className='footer-meta'>AI-powered strategy generation — about 30 seconds</span>
                    <div className='action-btns'>
                        <button
                            type="button"
                            onClick={handleGeneratePdf}
                            disabled={pdfLoading}
                            className='btn-outline'
                            title="Generate a tailored resume PDF draft">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                            {pdfLoading ? 'Generating PDF...' : 'Generate Resume PDF'}
                        </button>
                        <button
                            type="button"
                            onClick={handleGenerateReport}
                            disabled={loading}
                            className='btn-primary'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
                            {loading ? 'Generating...' : 'Generate Interview Strategy'}
                        </button>
                    </div>
                </div>
            </div>

            {/* My Recent Interview Plans */}
            {!loading && reports.length > 0 && (
                <section className='recent-section'>
                    <h2 className='recent-title'>My recent interview plans</h2>
                    <div className='recent-list'>
                        {reports.map(report => (
                            <div
                                key={report._id}
                                className='recent-row'
                                onClick={() => navigate(`/interview/${report._id}`)}
                            >
                                <div className='recent-row__info'>
                                    <h3 className='recent-row__title'>{report.title || 'Target Position Plan'}</h3>
                                    <span className='recent-row__date'>Generated {new Date(report.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className='recent-row__score'>
                                    <span className='score-num'>{report.matchScore}%</span>
                                    <span className='score-text'>match</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <footer className='home-footer'>
                <p>&copy; {new Date().getFullYear()} PrepAI &bull; Editorial Interview Intelligence</p>
            </footer>
        </div>
    )
}

export default Home