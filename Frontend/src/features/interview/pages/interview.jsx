import React, { useState, useEffect } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams, Link } from 'react-router'

const NAV_ITEMS = [
    {
        id: 'technical',
        label: 'Technical questions',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
            </svg>
        )
    },
    {
        id: 'behavioral',
        label: 'Behavioral questions',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        )
    },
    {
        id: 'roadmap',
        label: 'Preparation roadmap',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
        )
    },
]

// ── Question Card Sub-component ───────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
    const [ open, setOpen ] = useState(false)
    const [ copied, setCopied ] = useState(false)

    const handleCopy = (e) => {
        e.stopPropagation()
        const textToCopy = `Question ${index + 1}: ${item.question}\n\nInterviewer Intention: ${item.intention}\n\nModel Answer: ${item.answer}`
        navigator.clipboard.writeText(textToCopy)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <article className={`q-card ${open ? 'q-card--open' : ''}`}>
            <header className='q-card__header' onClick={() => setOpen(o => !o)}>
                <span className='q-card__num'>Q{index + 1}</span>
                <h3 className='q-card__question'>{item.question}</h3>
                <div className='q-card__controls'>
                    <button
                        type='button'
                        onClick={handleCopy}
                        className={`copy-btn ${copied ? 'copy-btn--copied' : ''}`}
                        title='Copy question and answer'
                    >
                        {copied ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                <span>Copied</span>
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                                <span>Copy</span>
                            </>
                        )}
                    </button>
                    <span className={`q-card__chevron ${open ? 'q-card__chevron--rotated' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                    </span>
                </div>
            </header>
            {open && (
                <div className='q-card__body'>
                    <div className='q-card__section'>
                        <span className='section-tag section-tag--intention'>Interviewer intention</span>
                        <p>{item.intention}</p>
                    </div>
                    <div className='q-card__section'>
                        <span className='section-tag section-tag--answer'>Model answer</span>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </article>
    )
}

// ── Road Map Day Sub-component ────────────────────────────────────────────────
const RoadMapDay = ({ day }) => (
    <div className='roadmap-card'>
        <div className='roadmap-card__header'>
            <span className='roadmap-card__badge'>Day {day.day}</span>
            <h3 className='roadmap-card__focus'>{day.focus}</h3>
        </div>
        <ul className='roadmap-card__tasks'>
            {day.tasks.map((task, i) => (
                <li key={i}>
                    <span className='task-bullet' />
                    <span>{task}</span>
                </li>
            ))}
        </ul>
    </div>
)

// ── Main Interview Component ──────────────────────────────────────────────────
const Interview = () => {
    const [ activeNav, setActiveNav ] = useState('technical')
    const { report, getReportById, loading, getResumePdf, resumeLoading } = useInterview()
    const { interviewId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [ interviewId ])

    if (loading || !report) {
        return (
            <main className='loading-screen'>
                <div className='loading-spinner' />
                <p>Loading your personalized interview strategy...</p>
            </main>
        )
    }

    const matchPercent = report.matchScore || 75
    const dashOffset = 264 - (264 * matchPercent) / 100

    return (
        <div className='interview-page'>
            {/* Top Bar */}
            <header className='report-topbar'>
                <div className='report-topbar__left'>
                    <button onClick={() => navigate('/app')} className='back-btn'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                        <span>Dashboard</span>
                    </button>
                    <span className='crumb-sep'>/</span>
                    <h1 className='report-title'>{report.title || 'Target Position Plan'}</h1>
                </div>
                <div className='report-topbar__right'>
                    <button
                        type='button'
                        onClick={() => { getResumePdf(report) }}
                        disabled={resumeLoading}
                        className='btn-download-resume'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                        <span>{resumeLoading ? 'Generating...' : 'Download Resume PDF'}</span>
                    </button>
                </div>
            </header>

            <div className='interview-layout'>

                {/* ── Left Sidebar Nav ── */}
                <nav className='interview-nav'>
                    <span className='nav-section-label'>Sections</span>
                    <div className='nav-links'>
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                className={`nav-link ${activeNav === item.id ? 'nav-link--active' : ''}`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                <span className='nav-link__icon'>{item.icon}</span>
                                <span className='nav-link__label'>{item.label}</span>
                            </button>
                        ))}
                    </div>
                </nav>

                {/* ── Center Content ── */}
                <main className='interview-main'>
                    {activeNav === 'technical' && (
                        <section className='content-section'>
                            <div className='content-section__head'>
                                <h2>Technical questions</h2>
                                <span className='count-chip'>{report.technicalQuestions?.length || 0} questions</span>
                            </div>
                            <div className='q-stack'>
                                {report.technicalQuestions?.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'behavioral' && (
                        <section className='content-section'>
                            <div className='content-section__head'>
                                <h2>Behavioral questions</h2>
                                <span className='count-chip'>{report.behavioralQuestions?.length || 0} questions</span>
                            </div>
                            <div className='q-stack'>
                                {report.behavioralQuestions?.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'roadmap' && (
                        <section className='content-section'>
                            <div className='content-section__head'>
                                <h2>Preparation roadmap</h2>
                                <span className='count-chip'>{report.preparationPlan?.length || 0}-day plan</span>
                            </div>
                            <div className='roadmap-stack'>
                                {report.preparationPlan?.map((day) => (
                                    <RoadMapDay key={day.day} day={day} />
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                {/* ── Right Sidebar Overview ── */}
                <aside className='interview-aside'>

                    {/* Match Score Card */}
                    <div className='aside-card match-score-card'>
                        <span className='aside-card__label'>Match score</span>
                        <div className='score-ring-wrapper'>
                            <svg className='score-svg' viewBox='0 0 100 100'>
                                <circle className='score-track' cx='50' cy='50' r='42' />
                                <circle
                                    className='score-fill'
                                    cx='50'
                                    cy='50'
                                    r='42'
                                    strokeDasharray='264'
                                    strokeDashoffset={dashOffset}
                                />
                            </svg>
                            <div className='score-inner'>
                                <span className='score-number'>{matchPercent}</span>
                                <span className='score-percent'>%</span>
                            </div>
                        </div>
                        <div className='match-status-row'>
                            <span className='match-dot' />
                            <span>{matchPercent >= 75 ? 'Strong match for this role' : 'Moderate role alignment'}</span>
                        </div>
                    </div>

                    {/* Skill Gaps Card */}
                    <div className='aside-card skill-gaps-card'>
                        <span className='aside-card__label'>Skill gaps</span>
                        <div className='gaps-list'>
                            {report.skillGaps?.map((gap, i) => (
                                <div key={i} className='gap-item'>
                                    <span className={`severity-dot severity-dot--${gap.severity}`} />
                                    <span className='gap-name'>{gap.skill}</span>
                                    <span className='gap-level'>{gap.severity}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </aside>

            </div>
        </div>
    )
}

export default Interview