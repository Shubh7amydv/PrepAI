import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import '../style/landing.scss'

const featureItems = [
    {
        title: 'Role & JD Deconstruction',
        tag: 'Job parsing',
        text: 'Extracts exact technical competencies, seniority expectations, and core deliverables directly from any job description.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
        )
    },
    {
        title: 'Interview Intention Decoding',
        tag: 'Model answers',
        text: 'Understand what interviewers are actually testing for behind each question, with curated model responses and talking points.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
        )
    },
    {
        title: 'Milestone Roadmap & ATS Export',
        tag: 'Execution plan',
        text: 'Follow a targeted day-by-day study roadmap tailored to your gaps and export an ATS-optimized resume drafted for the position.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        )
    }
]

const processSteps = [
    {
        step: '01',
        title: 'Input Job & Profile',
        desc: 'Paste the target job description and upload your resume or profile summary.'
    },
    {
        step: '02',
        title: 'Match Analysis',
        desc: 'The model assesses alignment and isolates critical technical and domain gaps.'
    },
    {
        step: '03',
        title: 'Question Strategy',
        desc: 'Review tailored technical and behavioral questions with interviewer intentions.'
    },
    {
        step: '04',
        title: 'Structured Execution',
        desc: 'Follow the preparation milestones and download an ATS-tailored resume draft.'
    }
]

const Landing = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [ activeTab, setActiveTab ] = useState('score')

    const handlePrimaryAction = () => {
        navigate(user ? '/app' : '/register')
    }

    return (
        <div className="landing-page">
            {/* Navigation Bar */}
            <header className="landing-nav">
                <Link to="/" className="landing-brand">
                    <div className="landing-brand__mark">P</div>
                    <span className="landing-brand__text">PrepAI</span>
                </Link>

                <nav className="landing-nav__links">
                    <a href="#features">Features</a>
                    <a href="#workflow">Workflow</a>
                    <a href="#preview">Interactive Demo</a>
                </nav>

                <div className="landing-nav__actions">
                    {!user ? (
                        <>
                            <Link to="/login" className="landing-link">Sign in</Link>
                            <button type="button" className="btn-nav-primary" onClick={handlePrimaryAction}>
                                Get Started
                            </button>
                        </>
                    ) : (
                        <button type="button" className="btn-nav-primary" onClick={handlePrimaryAction}>
                            Open Dashboard
                        </button>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero">
                <p className="hero__eyebrow">
                    Engineered for top-tier tech interviews
                </p>

                <h1 className="hero__headline">
                    Master your next interview <br />
                    <em>before you step into the room.</em>
                </h1>

                <p className="hero__subhead">
                    PrepAI parses job descriptions, evaluates candidate strengths, and generates role-specific technical questions, interviewer intentions, and an actionable preparation roadmap.
                </p>

                <div className="hero__actions">
                    <button type="button" className="btn-hero-primary" onClick={handlePrimaryAction}>
                        {user ? 'Open Dashboard' : 'Start Preparing Free'}
                    </button>
                    {!user && (
                        <Link to="/login" className="btn-hero-secondary">
                            Sign In
                        </Link>
                    )}
                </div>

                {/* Hero Interactive Workspace Mockup (No macOS traffic dots, clean tab strip) */}
                <div className="hero__preview" id="preview">
                    <div className="mockup-window">
                        {/* Tab Strip Framing */}
                        <div className="mockup-header">
                            <div className="mockup-tabs">
                                <button
                                    className={`tab-btn ${activeTab === 'score' ? 'tab-btn--active' : ''}`}
                                    onClick={() => setActiveTab('score')}
                                >
                                    Role Compatibility
                                </button>
                                <button
                                    className={`tab-btn ${activeTab === 'questions' ? 'tab-btn--active' : ''}`}
                                    onClick={() => setActiveTab('questions')}
                                >
                                    Technical Deep-Dive
                                </button>
                                <button
                                    className={`tab-btn ${activeTab === 'roadmap' ? 'tab-btn--active' : ''}`}
                                    onClick={() => setActiveTab('roadmap')}
                                >
                                    Preparation Plan
                                </button>
                            </div>
                        </div>

                        {/* Mockup Body */}
                        <div className="mockup-body">
                            {activeTab === 'score' && (
                                <div className="tab-pane tab-pane--score">
                                    <div className="score-summary-card">
                                        <div className="score-dial">
                                            <svg viewBox="0 0 100 100" className="score-dial__svg">
                                                <circle className="dial-bg" cx="50" cy="50" r="40" />
                                                <circle className="dial-progress" cx="50" cy="50" r="40" strokeDasharray="251" strokeDashoffset="35" />
                                            </svg>
                                            <div className="score-dial__content">
                                                <span className="score-val">86<small>%</small></span>
                                                <span className="score-tag">Match score</span>
                                            </div>
                                        </div>
                                        <div className="score-details">
                                            <span className="status-label">Strong role alignment</span>
                                            <h3>Staff / Senior Full Stack Engineer</h3>
                                            <p>Candidate demonstrates strong alignment with distributed Node.js services, React architecture, and async system design.</p>
                                        </div>
                                    </div>

                                    <div className="breakdown-grid">
                                        <div className="breakdown-card">
                                            <span className="breakdown-label">Verified strengths</span>
                                            <div className="tag-group">
                                                <span className="skill-tag">React Fiber</span>
                                                <span className="skill-tag">TypeScript</span>
                                                <span className="skill-tag">GraphQL</span>
                                                <span className="skill-tag">PostgreSQL</span>
                                            </div>
                                        </div>
                                        <div className="breakdown-card">
                                            <span className="breakdown-label">Focus areas</span>
                                            <div className="tag-group">
                                                <span className="skill-tag skill-tag--focus">Kafka Partitioning</span>
                                                <span className="skill-tag skill-tag--focus">Distributed Caching</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'questions' && (
                                <div className="tab-pane tab-pane--questions">
                                    <div className="mock-q">
                                        <div className="mock-q__head">
                                            <span className="q-label">Question 01 &bull; System Design</span>
                                            <h4>How would you design a distributed idempotency layer for payment webhooks?</h4>
                                        </div>
                                        <div className="mock-q__body">
                                            <p className="q-intention">
                                                <strong>Interviewer intention:</strong> Testing Redis atomic locking (`SETNX`), TTL safety windows, and failure-handling under network partitions.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mock-q">
                                        <div className="mock-q__head">
                                            <span className="q-label">Question 02 &bull; React Architecture</span>
                                            <h4>Explain how React 19 server actions and transitions prevent UI blocking during async state updates.</h4>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'roadmap' && (
                                <div className="tab-pane tab-pane--roadmap">
                                    <div className="roadmap-preview-item">
                                        <span className="r-day">Days 01–03</span>
                                        <div className="r-content">
                                            <strong>Distributed Caching & Redis Locking Patterns</strong>
                                            <p>Review cache invalidation, write-through vs write-behind, and stampede prevention mechanisms.</p>
                                        </div>
                                    </div>
                                    <div className="roadmap-preview-item">
                                        <span className="r-day">Days 04–07</span>
                                        <div className="r-content">
                                            <strong>System Scale, Sharding & Read Replicas</strong>
                                            <p>Examine partition key selection, eventual consistency trade-offs, and horizontal scalability.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section" id="features">
                <div className="section-head">
                    <span className="section-tag">Core capabilities</span>
                    <h2 className="section-title">Designed for rigor and precision.</h2>
                </div>

                <div className="bento-grid">
                    {featureItems.map((item) => (
                        <div key={item.title} className="bento-card">
                            <div className="bento-card__top">
                                <div className="bento-card__icon">{item.icon}</div>
                                <span className="bento-card__tag">{item.tag}</span>
                            </div>
                            <h3 className="bento-card__title">{item.title}</h3>
                            <p className="bento-card__text">{item.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Workflow Steps */}
            <section className="workflow-section" id="workflow">
                <div className="section-head">
                    <span className="section-tag">Workflow</span>
                    <h2 className="section-title">From job description to structured plan.</h2>
                </div>

                <div className="steps-container">
                    {processSteps.map((step) => (
                        <div key={step.step} className="step-card">
                            <div className="step-card__num">{step.step}</div>
                            <h3 className="step-card__title">{step.title}</h3>
                            <p className="step-card__desc">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Final CTA Banner */}
            <section className="cta-banner">
                <div className="cta-banner__inner">
                    <div className="cta-banner__content">
                        <h2>Ready to prepare for your next opportunity?</h2>
                        <p>Generate role-tailored questions, decode interviewer intentions, and step into the room prepared.</p>
                    </div>
                    <div className="cta-banner__actions">
                        <button type="button" className="btn-hero-primary" onClick={handlePrimaryAction}>
                            {user ? 'Open Dashboard' : 'Start Preparing Free'}
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="landing-footer__brand">
                    <span className="footer-mark">P</span>
                    <strong>PrepAI</strong>
                    <span className="footer-sep">&bull;</span>
                    <span className="footer-tagline">Interview Strategy Intelligence</span>
                </div>
                <p className="landing-footer__copy">&copy; {new Date().getFullYear()} PrepAI. All rights reserved.</p>
            </footer>
        </div>
    )
}

export default Landing