import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import { LogoIcon } from '../../../components/Logo'
import '../style/landing.scss'

const technicalQuestions = [
    {
        id: 'idempotency',
        badge: 'Distributed Systems • High Concurrency',
        topic: 'Payment Idempotency',
        question: 'How would you architect an idempotent payment & webhook ingest pipeline handling 50k req/sec with exactly-once semantics?',
        intention: 'Evaluates atomic Redis locks (SETNX with TTL), transactional inbox/outbox patterns, and dead-letter queue (DLQ) backpressure to eliminate duplicate charge risks under network partitions.',
        tags: ['Redis SETNX', 'Transactional Outbox', 'DLQ Backpressure']
    },
    {
        id: 'caching',
        badge: 'Caching & Storage • Performance',
        topic: 'Cache Stampede',
        question: 'How do you resolve a cache stampede (thundering herd) when a high-traffic hot key expires under 100k concurrent read requests?',
        intention: 'Tests practical knowledge of Probabilistic Early Expiration (XFetch algorithm), distributed mutex locking on cache misses, and stale-while-revalidate background refreshes.',
        tags: ['XFetch Algorithm', 'Mutex on Miss', 'Stale-While-Revalidate']
    },
    {
        id: 'locking',
        badge: 'Distributed Systems • Concurrency',
        topic: 'Distributed Locks',
        question: 'When implementing distributed locks across multiple instances, what failure modes occur with system clock drift and split-brain scenarios?',
        intention: 'Assesses understanding of monotonic clock reliance, fencing tokens for downstream storage integrity, and heartbeat lock auto-extension mechanisms.',
        tags: ['Fencing Tokens', 'Monotonic Clocks', 'Redlock Safety Margins']
    },
    {
        id: 'indexing',
        badge: 'Database Engineering • Optimization',
        topic: 'DB Indexing',
        question: 'Given a composite index on (status, created_at, user_id), why does WHERE user_id = ? cause a full table scan, and how do you optimize it?',
        intention: 'Assesses leftmost-prefix B-Tree index traversal rules, index column cardinality ordering, partial indexes, and reading EXPLAIN ANALYZE execution plans.',
        tags: ['Leftmost Prefix Rule', 'Index Cardinality', 'EXPLAIN ANALYZE']
    }
]

const faqs = [
    {
        q: 'How does PrepAI analyze my resume and target job description?',
        a: 'PrepAI uses advanced multi-model LLMs to cross-reference every requirement, skill, and architectural demand in the job description against your background. It calculates a compatibility score, isolates specific skill gaps, and generates targeted technical questions.'
    },
    {
        q: 'Can I download the tailored resume as a PDF?',
        a: 'Yes! PrepAI automatically generates an ATS-optimized, beautifully styled resume tailored to the target role with one click, powered by headless PDF rendering.'
    },
    {
        q: 'What is "Interviewer Intention"?',
        a: 'Behind every technical or behavioral interview question is an underlying evaluation rubric (e.g. testing concurrency edge cases or conflict resolution). PrepAI explicitly reveals what interviewers are testing for and gives you model STAR responses.'
    },
    {
        q: 'Can I test PrepAI without creating an account?',
        a: 'Absolutely. We offer 1-Click Demo Login specifically for recruiters, hiring managers, and candidates to explore all features instantly without registering.'
    }
]

const Landing = () => {
    const { user, handleDemoLogin } = useAuth()
    const navigate = useNavigate()
    const [ mobileMenuOpen, setMobileMenuOpen ] = useState(false)
    const [ activeTab, setActiveTab ] = useState('technical')
    const [ selectedQuestionIdx, setSelectedQuestionIdx ] = useState(0)
    const [ openFaq, setOpenFaq ] = useState(null)
    const [ demoLoading, setDemoLoading ] = useState(false)

    const handlePrimaryAction = () => {
        navigate(user ? '/app' : '/register')
    }

    const handleQuickDemo = async () => {
        if (user) {
            navigate('/app')
            return
        }
        setDemoLoading(true)
        const { success } = await handleDemoLogin()
        if (success) {
            navigate('/app')
        } else {
            navigate('/login')
        }
        setDemoLoading(false)
    }

    const currentQuestion = technicalQuestions[selectedQuestionIdx] || technicalQuestions[0]

    return (
        <div className="landing-page">
            {/* Ambient Background Glow Mesh */}
            <div className="ambient-glow ambient-glow--1"></div>
            <div className="ambient-glow ambient-glow--2"></div>
            <div className="ambient-glow ambient-glow--3"></div>

            {/* Sticky Header */}
            <header className="landing-nav">
                <div className="landing-nav__inner">
                    <div className="landing-nav__left">
                        <Link to="/" className="landing-brand">
                            <LogoIcon size={32} />
                            <span className="landing-brand__text">Prep<span className="text-gradient">AI</span></span>
                        </Link>

                        <nav className="landing-nav__links">
                            <a href="#features">Capabilities</a>
                            <a href="#preview">Interactive Workspace</a>
                            <a href="#faqs">FAQ</a>
                        </nav>
                    </div>

                    <div className="landing-nav__actions">
                        {!user ? (
                            <>
                                <button type="button" onClick={handleQuickDemo} className="btn-nav-demo">
                                    {demoLoading ? 'Connecting...' : '⚡ 1-Click Demo'}
                                </button>
                                <Link to="/login" className="btn-nav-ghost">Sign In</Link>
                                <button type="button" className="btn-nav-primary" onClick={handlePrimaryAction}>
                                    Get Started
                                </button>
                            </>
                        ) : (
                            <button type="button" className="btn-nav-primary" onClick={handlePrimaryAction}>
                                Open Workspace
                            </button>
                        )}
                        <button
                            type="button"
                            className="mobile-nav-toggle"
                            onClick={() => setMobileMenuOpen(o => !o)}
                            aria-label="Toggle Navigation Menu"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                {mobileMenuOpen ? (
                                    <>
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </>
                                ) : (
                                    <>
                                        <line x1="4" y1="12" x2="20" y2="12" />
                                        <line x1="4" y1="6" x2="20" y2="6" />
                                        <line x1="4" y1="18" x2="20" y2="18" />
                                    </>
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className="mobile-dropdown">
                        <a href="#features" onClick={() => setMobileMenuOpen(false)}>Capabilities</a>
                        <a href="#preview" onClick={() => setMobileMenuOpen(false)}>Interactive Workspace</a>
                        <a href="#faqs" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
                        <div className="mobile-dropdown__actions">
                            <button type="button" onClick={handleQuickDemo} className="btn-nav-demo mobile-btn">
                                ⚡ 1-Click Demo Login
                            </button>
                            {!user ? (
                                <>
                                    <Link to="/login" className="btn-nav-ghost mobile-btn" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                                    <button type="button" className="btn-nav-primary mobile-btn" onClick={handlePrimaryAction}>
                                        Get started free
                                    </button>
                                </>
                            ) : (
                                <button type="button" className="btn-nav-primary mobile-btn" onClick={handlePrimaryAction}>
                                    Open Dashboard
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero__inner">
                    <div className="hero__content">
                        {/* Clean Eyebrow */}
                        <div className="hero-eyebrow">
                            <span>TECHNICAL INTERVIEW INTELLIGENCE &amp; RUBRIC DECODER</span>
                        </div>

                        <h1 className="hero__headline">
                            Master Technical Interviews. <br />
                            <span className="headline-highlight">Outsmart The Rubric.</span>
                        </h1>

                        <p className="hero__subhead">
                            PrepAI parses target job descriptions, isolates critical skill gaps, decodes interviewer scoring rubrics, and generates ATS-tailored resumes in seconds.
                        </p>

                        <div className="hero__actions">
                            <button type="button" className="btn-hero-primary" onClick={handlePrimaryAction}>
                                <span>{user ? 'Open Workspace' : 'Start Preparing Free'}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </button>

                            <button type="button" className="btn-hero-secondary" onClick={handleQuickDemo}>
                                <span>⚡ 1-Click Demo Access</span>
                            </button>
                        </div>

                        {/* Feature Badges List */}
                        <div className="hero-benefits">
                            <div className="benefit-item">
                                <span className="icon-check">✓</span>
                                <span>Zero Setup Required</span>
                            </div>
                            <div className="benefit-item">
                                <span className="icon-check">✓</span>
                                <span>AI Intention Breakdown</span>
                            </div>
                            <div className="benefit-item">
                                <span className="icon-check">✓</span>
                                <span>Instant ATS Resume PDF</span>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Workspace Mockup */}
                    <div className="hero__preview" id="preview">
                        <div className="mockup-window">
                            {/* Window Header */}
                            <div className="mockup-header">
                                <div className="window-dots">
                                    <span className="dot dot--red"></span>
                                    <span className="dot dot--yellow"></span>
                                    <span className="dot dot--green"></span>
                                </div>
                                <div className="mockup-tabs">
                                    <button
                                        className={`tab-btn ${activeTab === 'technical' ? 'tab-btn--active' : ''}`}
                                        onClick={() => setActiveTab('technical')}
                                    >
                                        Technical Deep-Dive
                                    </button>
                                    <button
                                        className={`tab-btn ${activeTab === 'dashboard' ? 'tab-btn--active' : ''}`}
                                        onClick={() => setActiveTab('dashboard')}
                                    >
                                        Role Compatibility
                                    </button>
                                    <button
                                        className={`tab-btn ${activeTab === 'roadmap' ? 'tab-btn--active' : ''}`}
                                        onClick={() => setActiveTab('roadmap')}
                                    >
                                        10-Day Plan
                                    </button>
                                </div>
                            </div>

                            {/* Mockup Body */}
                            <div className="mockup-body">
                                {activeTab === 'technical' && (
                                    <div className="tab-pane">
                                        {/* Question Topic Selector */}
                                        <div className="q-selector-nav">
                                            {technicalQuestions.map((q, idx) => (
                                                <button
                                                    key={q.id}
                                                    type="button"
                                                    className={`q-pill-btn ${selectedQuestionIdx === idx ? 'q-pill-btn--active' : ''}`}
                                                    onClick={() => setSelectedQuestionIdx(idx)}
                                                >
                                                    {q.topic}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="q-preview-card">
                                            <div className="q-preview-head">
                                                <span className="q-badge">{currentQuestion.badge}</span>
                                                <h4>{currentQuestion.question}</h4>
                                            </div>
                                            <div className="q-preview-body">
                                                <div className="rubric-box">
                                                    <span className="rubric-tag">Interviewer Intention Rubric:</span>
                                                    <p>{currentQuestion.intention}</p>
                                                </div>
                                            </div>
                                            <div className="q-tags-row">
                                                {currentQuestion.tags.map((tag) => (
                                                    <span key={tag} className="q-concept-tag">{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'dashboard' && (
                                    <div className="tab-pane">
                                        <div className="metric-header-card">
                                            <div className="gauge-box">
                                                <svg viewBox="0 0 100 100" className="gauge-svg">
                                                    <circle cx="50" cy="50" r="40" className="gauge-track" />
                                                    <circle cx="50" cy="50" r="40" className="gauge-fill" strokeDasharray="251.2" strokeDashoffset="30" />
                                                </svg>
                                                <div className="gauge-value">
                                                    <strong>88%</strong>
                                                    <span>MATCH</span>
                                                </div>
                                            </div>
                                            <div className="role-meta">
                                                <span className="pill-status">High Role Compatibility</span>
                                                <h3>Senior Full Stack / Platform Engineer</h3>
                                                <p>Strong alignment with distributed Node.js microservices, React 19 architecture, and high-throughput PostgreSQL query optimization.</p>
                                                <p className="match-score-basis">
                                                    Score calculated from keyword &amp; skill overlap between resume and job description.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="breakdown-columns">
                                            <div className="breakdown-card">
                                                <span className="card-label card-label--green">Verified Strengths</span>
                                                <div className="tags-wrap">
                                                    <span className="tag-item">React Fiber internals</span>
                                                    <span className="tag-item">Distributed Locking</span>
                                                    <span className="tag-item">TypeScript</span>
                                                    <span className="tag-item">GraphQL Schemas</span>
                                                </div>
                                            </div>
                                            <div className="breakdown-card">
                                                <span className="card-label card-label--rose">Target Skill Gaps</span>
                                                <div className="tags-wrap">
                                                    <span className="tag-item tag-item--gap">Kafka Partitioning</span>
                                                    <span className="tag-item tag-item--gap">Distributed Tracing</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'roadmap' && (
                                    <div className="tab-pane">
                                        <div className="roadmap-preview-card">
                                            <div className="roadmap-day-tag">Days 01–03</div>
                                            <div className="roadmap-day-info">
                                                <strong>Distributed Caching &amp; Idempotency Mechanisms</strong>
                                                <p>Master cache stampede prevention, write-through vs write-behind, and Redis atomic locking.</p>
                                            </div>
                                        </div>
                                        <div className="roadmap-preview-card">
                                            <div className="roadmap-day-tag">Days 04–07</div>
                                            <div className="roadmap-day-info">
                                                <strong>Database Sharding, Read Replicas &amp; Indexing</strong>
                                                <p>Deep-dive into partition key selection, connection pooling, and eventual consistency trade-offs.</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Capabilities Grid */}
            <section className="features-section" id="features">
                <div className="features-section__inner">
                    <div className="section-header">
                        <span className="section-eyebrow">CORE CAPABILITIES</span>
                        <h2 className="section-title">Built for Engineering Clarity</h2>
                        <p className="section-subtitle">
                            Every feature is designed to give you unfair clarity before walking into technical and architectural interview rounds.
                        </p>
                    </div>

                    <div className="bento-grid">
                        <div className="bento-card bento-card--featured">
                            <div className="bento-card__glow"></div>
                            <h3>Deep Job &amp; Role Deconstruction</h3>
                            <p>Paste any job posting. PrepAI decomposes requirements, stack expectations, and seniority bars into structured evaluation targets.</p>
                            <div className="bento-chips">
                                <span>Requirements Matrix</span>
                                <span>Seniority Calibration</span>
                                <span>Domain Isolation</span>
                            </div>
                        </div>

                        <div className="bento-card">
                            <div className="bento-card__glow"></div>
                            <h3>Interviewer Intention Rubrics</h3>
                            <p>Never wonder what interviewers are testing for. PrepAI surfaces the underlying evaluation checklist and provides model STAR responses.</p>
                            <div className="bento-chips">
                                <span>STAR Framework</span>
                                <span>Edge Case Prep</span>
                            </div>
                        </div>

                        <div className="bento-card">
                            <div className="bento-card__glow"></div>
                            <h3>Milestone Plan &amp; Tailored Resume</h3>
                            <p>Follow a customized day-by-day roadmap and export an ATS-tailored resume designed to pass screening filters instantly.</p>
                            <div className="bento-chips">
                                <span>Day-by-Day Tasks</span>
                                <span>Instant PDF Export</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why I Built This / Human Signal Section */}
            <section className="creator-section">
                <div className="creator-section__inner">
                    <div className="creator-card">
                        <div className="creator-header">
                            <span className="section-eyebrow">CREATOR NOTE</span>
                            <h2 className="section-title">Why I Built PrepAI</h2>
                        </div>
                        <p className="creator-story">
                            Most technical interview prep is either generic LeetCode grinding or superficial flashcards that fail to prepare engineers for actual Staff and Platform rounds. I built PrepAI to focus on what senior interviewers actually evaluate: architectural trade-offs, concurrency edge cases, distributed failure modes, and structured STAR delivery.
                        </p>
                        <div className="creator-meta">
                            <div className="creator-author">
                                <strong>Shubham Yadav</strong>
                                <span>Creator &amp; Maintainer</span>
                            </div>
                            <div className="creator-links">
                                <a href="https://github.com/Shubh7amydv/PrepAI" target="_blank" rel="noopener noreferrer" className="github-link">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                                    <span>View on GitHub</span>
                                </a>
                                <span className="project-version">v1.2.0 • Updated September 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section" id="faqs">
                <div className="faq-section__inner">
                    <div className="section-header text-center">
                        <span className="section-eyebrow">FAQ</span>
                        <h2 className="section-title">Frequently Asked Questions</h2>
                    </div>

                    <div className="faq-list">
                        {faqs.map((faq, idx) => {
                            const isOpen = openFaq === idx
                            return (
                                <div key={faq.q} className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}>
                                    <button
                                        type="button"
                                        className="faq-question"
                                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                                    >
                                        <span>{faq.q}</span>
                                        <span className="faq-icon">{isOpen ? '−' : '+'}</span>
                                    </button>
                                    {isOpen && (
                                        <div className="faq-answer">
                                            <p>{faq.a}</p>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Final CTA Banner */}
            <section className="cta-banner">
                <div className="cta-banner__inner">
                    <div className="cta-glow"></div>
                    <h2>Master Your Next Interview. <br /><span className="headline-highlight">Get Hired Faster.</span></h2>
                    <p>Engineered to eliminate interview guesswork with targeted technical questions and rubric breakdowns.</p>
                    <div className="cta-banner__actions">
                        <button type="button" className="btn-hero-primary" onClick={handlePrimaryAction}>
                            {user ? 'Open Workspace' : 'Get Started Free →'}
                        </button>
                        <button type="button" className="btn-hero-secondary" onClick={handleQuickDemo}>
                            ⚡ Try 1-Click Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="landing-footer__inner">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <LogoIcon size={28} />
                            <strong>PrepAI</strong>
                        </div>
                        <p>Technical Interview Intelligence &amp; Rubric Decoder Platform.</p>
                        <p className="footer-creator-line">
                            Built by <a href="https://github.com/Shubh7amydv/PrepAI" target="_blank" rel="noopener noreferrer">Shubham Yadav</a> • Open Source on GitHub
                        </p>
                    </div>

                    <div className="footer-links">
                        <div className="footer-col">
                            <strong>Platform</strong>
                            <a href="#features">Capabilities</a>
                            <a href="#preview">Workspace</a>
                        </div>
                        <div className="footer-col">
                            <strong>Resources</strong>
                            <a href="#faqs">FAQ</a>
                            <a href="https://github.com/Shubh7amydv/PrepAI" target="_blank" rel="noopener noreferrer">GitHub Repo</a>
                            <button type="button" onClick={handleQuickDemo} className="footer-link-btn">Demo Mode</button>
                            <Link to="/login">Sign In</Link>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} PrepAI. Designed &amp; built by Shubham Yadav • v1.2.0</p>
                </div>
            </footer>
        </div>
    )
}

export default Landing