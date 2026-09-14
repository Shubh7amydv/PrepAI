import React from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import '../style/landing.scss'

const featureItems = [
    {
        title: 'AI Interview Report',
        text: 'Generate a role-aware report with match score, technical questions, behavioral questions, and preparation guidance.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
            </svg>
        )
    },
    {
        title: 'Resume Intelligence',
        text: 'Upload a resume and let the system extract skills, identify gaps, and tailor the output to the target job.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="m4.93 4.93 4.24 4.24" />
                <path d="m14.83 9.17 4.24-4.24" />
                <path d="m14.83 14.83 4.24 4.24" />
                <path d="m9.17 14.83-4.24 4.24" />
                <circle cx="12" cy="12" r="4" />
            </svg>
        )
    },
    {
        title: 'ATS-Aware Output',
        text: 'Highlight relevant keywords, strengths, and missing skills so candidates can optimize for recruiter screening.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        )
    }
]

const processSteps = [
    {
        title: 'Provide your profile',
        desc: 'Upload your resume or enter a brief self-description of your key skills and experience.'
    },
    {
        title: 'Paste the target job',
        desc: 'Add the full job description to let the AI analyze role expectations and requirements.'
    },
    {
        title: 'Review strategy report',
        desc: 'Examine your match score, technical questions, behavioral answers, and skill gaps.'
    },
    {
        title: 'Tailor & prepare',
        desc: 'Follow the day-wise roadmap and download an ATS-tailored resume draft.'
    }
]

const metricCards = [
    { label: 'Input sources', value: 'Resume, JD, Summary' },
    { label: 'Core output', value: 'Full Strategy Report' },
    { label: 'AI engine', value: 'Groq High-Speed LLMs' }
]

const Landing = () => {
    const { user } = useAuth()
    const navigate = useNavigate()

    const handlePrimaryAction = () => {
        navigate(user ? '/app' : '/register')
    }

    return (
        <main className="landing-page">
            <header className="landing-nav">
                <Link to="/" className="landing-brand">
                    <span className="landing-brand__mark">P</span>
                    <span className="landing-brand__text">PrepAI</span>
                </Link>

                <nav className="landing-nav__links">
                    <a href="#features">Features</a>
                    <a href="#workflow">Workflow</a>
                    <a href="#cta">Get Started</a>
                </nav>

                <div className="landing-nav__actions">
                    <Link to="/login" className="landing-link">Sign in</Link>
                    <button type="button" className="landing-button landing-button--primary" onClick={handlePrimaryAction}>
                        {user ? 'Open Dashboard' : 'Create Account'}
                    </button>
                </div>
            </header>

            <section className="hero">
                <div className="hero__content">
                    <p className="hero__eyebrow">AI interview preparation, ATS focused</p>
                    <h1 className="hero__headline">Turn your resume into interview-ready momentum.</h1>
                    <p className="hero__subhead">
                        PrepAI analyzes your resume, job description, and background to generate a comprehensive interview report with skill gaps, role-specific questions, and a focused preparation roadmap.
                    </p>

                    <div className="hero__actions" id="cta">
                        <button type="button" className="landing-button landing-button--primary" onClick={handlePrimaryAction}>
                            {user ? 'Go to App' : 'Start Preparing'}
                        </button>
                        <Link to="/login" className="landing-button landing-button--outline">
                            Sign In
                        </Link>
                    </div>

                    <div className="hero__metrics">
                        {metricCards.map((metric) => (
                            <div key={metric.label} className="metric-col">
                                <span className="metric-col__label">{metric.label}</span>
                                <strong className="metric-col__value">{metric.value}</strong>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="hero__visual">
                    <div className="document-card">
                        <div className="document-card__header">
                            <div className="status-indicator">
                                <span className="status-dot" />
                                <span>Interview strategy preview</span>
                            </div>
                            <span className="doc-badge">Role Analysis</span>
                        </div>

                        <div className="score-block">
                            <div className="score-ring">
                                <svg className="score-ring__svg" viewBox="0 0 100 100">
                                    <circle className="score-ring__track" cx="50" cy="50" r="42" />
                                    <circle className="score-ring__progress" cx="50" cy="50" r="42" strokeDasharray="264" strokeDashoffset="42" />
                                </svg>
                                <div className="score-ring__text">
                                    <span className="score-val">84<small>%</small></span>
                                    <span className="score-lbl">Match Score</span>
                                </div>
                            </div>
                            <div className="score-meta">
                                <p className="score-status"><span className="dot-success" /> Strong candidate match</p>
                                <p className="score-desc">Profile closely aligns with technical stack and core competencies.</p>
                            </div>
                        </div>

                        <div className="doc-rows">
                            <div className="doc-row">
                                <span className="doc-row__label">Top skills</span>
                                <span className="doc-row__val">React, Node.js, TypeScript, REST APIs</span>
                            </div>
                            <div className="doc-row">
                                <span className="doc-row__label">Identified gaps</span>
                                <span className="doc-row__val doc-row__val--warm">System design at scale, Docker</span>
                            </div>
                            <div className="doc-row">
                                <span className="doc-row__label">Preparation plan</span>
                                <span className="doc-row__val">12-day milestone roadmap</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="features-section" id="features">
                <div className="section-header">
                    <span className="section-eyebrow">Key capabilities</span>
                    <h2 className="section-title">Everything you need to master your next interview.</h2>
                </div>

                <div className="feature-grid">
                    {featureItems.map((item) => (
                        <article key={item.title} className="feature-card">
                            <div className="feature-card__icon">{item.icon}</div>
                            <h3 className="feature-card__title">{item.title}</h3>
                            <p className="feature-card__text">{item.text}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="workflow-section" id="workflow">
                <div className="section-header">
                    <span className="section-eyebrow">How it works</span>
                    <h2 className="section-title">Built for fast, structured interview preparation.</h2>
                </div>

                <div className="workflow-steps">
                    {processSteps.map((step, index) => (
                        <article key={step.title} className="workflow-step">
                            <span className="workflow-step__num">0{index + 1}</span>
                            <h3 className="workflow-step__title">{step.title}</h3>
                            <p className="workflow-step__desc">{step.desc}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="final-cta">
                <div className="final-cta__content">
                    <span className="final-cta__eyebrow">Ready to begin</span>
                    <h2 className="final-cta__title">Planning is the first step to winning your next interview.</h2>
                    <p className="final-cta__text">Generate your custom interview questions and roadmap in under 30 seconds.</p>
                </div>
                <div className="final-cta__actions">
                    <Link to="/register" className="landing-button landing-button--deep">
                        Create Account
                    </Link>
                    <Link to="/login" className="landing-button landing-button--outline">
                        Sign In
                    </Link>
                </div>
            </section>

            <footer className="landing-footer">
                <div className="landing-footer__brand">
                    <strong>PrepAI</strong>
                    <span>Editorial Interview Intelligence</span>
                </div>
                <p className="landing-footer__copy">&copy; {new Date().getFullYear()} PrepAI. All rights reserved.</p>
            </footer>
        </main>
    )
}

export default Landing