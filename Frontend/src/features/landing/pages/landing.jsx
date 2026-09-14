import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import '../style/landing.scss'

const featureItems = [
    {
        title: 'Role & JD Deconstruction',
        tag: 'Instant Analysis',
        text: 'Extracts exact technical competencies, implicit seniority expectations, and core deliverables directly from any job description.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
            </svg>
        )
    },
    {
        title: 'Interview Intention Decoding',
        tag: 'Model Answers',
        text: 'Understand what interviewers are actually testing for behind each question, with battle-tested model responses and key talking points.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        title: 'Milestone Roadmap & ATS Export',
        tag: 'Action Plan',
        text: 'Follow a day-by-day study roadmap tailored to your gaps and export an ATS-optimized resume drafted for the position.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        )
    }
]

const processSteps = [
    {
        step: '01',
        title: 'Input Job & Resume',
        desc: 'Paste the target job description and upload your resume or a quick summary.'
    },
    {
        step: '02',
        title: 'Role Match Scoring',
        desc: 'AI scores profile compatibility and isolates critical technical & domain gaps.'
    },
    {
        step: '03',
        title: 'Question Strategy',
        desc: 'Review curated technical and behavioral questions paired with interviewer intentions.'
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
            {/* Background Ambient Glows */}
            <div className="ambient-glow ambient-glow--1" />
            <div className="ambient-glow ambient-glow--2" />

            {/* Sticky Navigation Bar */}
            <header className="landing-nav">
                <Link to="/" className="landing-brand">
                    <div className="landing-brand__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                    </div>
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
                            <button type="button" className="btn-glow" onClick={handlePrimaryAction}>
                                <span>Get Started</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                            </button>
                        </>
                    ) : (
                        <button type="button" className="btn-glow" onClick={handlePrimaryAction}>
                            <span>Open Dashboard</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                        </button>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero__badge">
                    <span className="hero__badge-dot" />
                    <span>Engineered for top-tier tech interviews</span>
                </div>

                <h1 className="hero__headline">
                    Master your next interview <br className="hero-br" />
                    <span className="text-gradient">before you step into the room.</span>
                </h1>

                <p className="hero__subhead">
                    PrepAI parses job descriptions, evaluates candidate strengths, and generates role-specific technical questions, interviewer intentions, and an actionable preparation roadmap.
                </p>

                <div className="hero__actions">
                    <button type="button" className="btn-hero-primary" onClick={handlePrimaryAction}>
                        <span>{user ? 'Go to Dashboard' : 'Start Preparing Free'}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                    </button>
                    {!user && (
                        <Link to="/login" className="btn-hero-secondary">
                            Sign In
                        </Link>
                    )}
                </div>

                {/* Hero Interactive Workspace Mockup */}
                <div className="hero__preview" id="preview">
                    <div className="mockup-window">
                        {/* macOS Window Header */}
                        <div className="mockup-header">
                            <div className="window-dots">
                                <span className="dot dot--red" />
                                <span className="dot dot--yellow" />
                                <span className="dot dot--green" />
                            </div>
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
                            <div className="mockup-status">
                                <span className="status-live" />
                                <span>Live Strategy</span>
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
                                                <span className="score-tag">Match Score</span>
                                            </div>
                                        </div>
                                        <div className="score-details">
                                            <div className="badge-pill badge-pill--emerald">
                                                <span className="pill-dot" /> Strong Role Fit
                                            </div>
                                            <h3>Staff / Senior Full Stack Engineer</h3>
                                            <p>Candidate demonstrates exceptional mastery in distributed Node.js services, React architecture, and async system design.</p>
                                        </div>
                                    </div>

                                    <div className="breakdown-grid">
                                        <div className="breakdown-card">
                                            <span className="breakdown-label">Verified Strengths</span>
                                            <div className="tag-group">
                                                <span className="skill-tag">React Fiber</span>
                                                <span className="skill-tag">TypeScript</span>
                                                <span className="skill-tag">GraphQL</span>
                                                <span className="skill-tag">PostgreSQL</span>
                                            </div>
                                        </div>
                                        <div className="breakdown-card">
                                            <span className="breakdown-label">High-Impact Focus Areas</span>
                                            <div className="tag-group">
                                                <span className="skill-tag skill-tag--warn">Kafka Partitioning</span>
                                                <span className="skill-tag skill-tag--warn">Distributed Caching</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'questions' && (
                                <div className="tab-pane tab-pane--questions">
                                    <div className="mock-q">
                                        <div className="mock-q__head">
                                            <span className="q-badge">Q1 &bull; System Design</span>
                                            <h4>How would you design a distributed idempotency layer for payment webhooks?</h4>
                                        </div>
                                        <div className="mock-q__body">
                                            <div className="q-intention">
                                                <strong>Interviewer Intention:</strong> Testing Redis atomic locking (`SETNX`), TTL safety windows, and failure-handling under network partitions.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mock-q">
                                        <div className="mock-q__head">
                                            <span className="q-badge">Q2 &bull; React Internals</span>
                                            <h4>Explain how React 19 server actions and transitions prevent UI blocking during async state updates.</h4>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'roadmap' && (
                                <div className="tab-pane tab-pane--roadmap">
                                    <div className="roadmap-preview-item">
                                        <div className="r-day">Day 01–03</div>
                                        <div className="r-content">
                                            <strong>Distributed Caching & Redis Locking Patterns</strong>
                                            <p>Deep-dive into cache invalidation, write-through vs write-behind, and stampede prevention.</p>
                                        </div>
                                    </div>
                                    <div className="roadmap-preview-item">
                                        <div className="r-day">Day 04–07</div>
                                        <div className="r-content">
                                            <strong>System Scale, Sharding & Read Replicas</strong>
                                            <p>Rehearse partition key selection, eventual consistency trade-offs, and horizontal scalability.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Bento Grid */}
            <section className="features-section" id="features">
                <div className="section-head">
                    <span className="section-tag">Core Capabilities</span>
                    <h2 className="section-title">Engineered to give you an unfair advantage.</h2>
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
                    <h2 className="section-title">From job post to interview ready in 30 seconds.</h2>
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

            {/* High-Impact Final CTA */}
            <section className="cta-banner">
                <div className="cta-banner__inner">
                    <div className="cta-banner__content">
                        <h2>Ready to ace your upcoming interviews?</h2>
                        <p>Generate role-tailored questions, decode interviewer intentions, and boost your confidence now.</p>
                    </div>
                    <div className="cta-banner__actions">
                        <button type="button" className="btn-hero-primary" onClick={handlePrimaryAction}>
                            <span>{user ? 'Open Dashboard' : 'Get Started Now'}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="landing-footer__brand">
                    <div className="footer-logo">
                        <span className="dot dot--indigo" />
                        <strong>PrepAI</strong>
                    </div>
                    <span>Modern Interview Intelligence</span>
                </div>
                <p className="landing-footer__copy">&copy; {new Date().getFullYear()} PrepAI. All rights reserved.</p>
            </footer>
        </div>
    )
}

export default Landing