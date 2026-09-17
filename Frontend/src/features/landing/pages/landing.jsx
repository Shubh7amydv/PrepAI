import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import '../style/landing.scss'

const testimonials = [
    {
        name: 'David Zhao',
        role: 'Senior Staff Engineer at Stripe',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
        text: 'The interviewer intention breakdown is pure gold. I understood the exact distributed locking rubrics they were testing for and structured my STAR answers flawlessly.',
        company: 'Stripe'
    },
    {
        name: 'Elena Rostova',
        role: 'Lead Frontend Architect at Netflix',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80',
        text: 'PrepAI tailored my resume to match 4 different Staff roles with zero fluff. Landed technical interviews at all 4 companies within a week.',
        company: 'Netflix'
    },
    {
        name: 'Marcus Vance',
        role: 'Engineering Manager at Meta',
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=150&h=150&q=80',
        text: 'The milestone preparation plan eliminated all uncertainty. Instead of aimlessly reading random docs, I had an actionable daily roadmap.',
        company: 'Meta'
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
    const [ activeTab, setActiveTab ] = useState('dashboard')
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
                            <div className="landing-brand__icon">
                                <span className="brand-symbol">⚡</span>
                            </div>
                            <span className="landing-brand__text">Prep<span className="text-gradient">AI</span></span>
                        </Link>

                        <nav className="landing-nav__links">
                            <a href="#features">Capabilities</a>
                            <a href="#preview">Interactive Workspace</a>
                            <a href="#testimonials">Candidates</a>
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
                        <a href="#testimonials" onClick={() => setMobileMenuOpen(false)}>Candidates</a>
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
                        {/* Rating Pill */}
                        <div className="hero-badge">
                            <span className="badge-pulse"></span>
                            <span className="badge-text">Next-Gen Interview Intelligence Platform</span>
                        </div>

                        <h1 className="hero__headline">
                            Master Technical Interviews. <br />
                            <span className="gradient-text">Outsmart The Rubric.</span>
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
                                        className={`tab-btn ${activeTab === 'dashboard' ? 'tab-btn--active' : ''}`}
                                        onClick={() => setActiveTab('dashboard')}
                                    >
                                        Role Compatibility
                                    </button>
                                    <button
                                        className={`tab-btn ${activeTab === 'technical' ? 'tab-btn--active' : ''}`}
                                        onClick={() => setActiveTab('technical')}
                                    >
                                        Technical Deep-Dive
                                    </button>
                                    <button
                                        className={`tab-btn ${activeTab === 'roadmap' ? 'tab-btn--active' : ''}`}
                                        onClick={() => setActiveTab('roadmap')}
                                    >
                                        10-Day Execution Plan
                                    </button>
                                </div>
                            </div>

                            {/* Mockup Body */}
                            <div className="mockup-body">
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

                                {activeTab === 'technical' && (
                                    <div className="tab-pane">
                                        <div className="q-preview-card">
                                            <div className="q-preview-head">
                                                <span className="q-badge">Question 01 • Distributed Systems</span>
                                                <h4>How would you engineer an idempotent webhook ingest pipeline handling 50k req/sec?</h4>
                                            </div>
                                            <div className="q-preview-body">
                                                <div className="rubric-box">
                                                    <span className="rubric-tag">Interviewer Intention:</span>
                                                    <p>Testing atomic Redis locks (`SETNX`), dead-letter queue backpressure, and exactly-once transaction boundaries under network partitions.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="q-preview-card">
                                            <div className="q-preview-head">
                                                <span className="q-badge">Question 02 • Architecture</span>
                                                <h4>Explain how React 19 Concurrent Mode &amp; Server Actions prevent main-thread UI lag.</h4>
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

            {/* Capabilities Bento Grid */}
            <section className="features-section" id="features">
                <div className="features-section__inner">
                    <div className="section-header">
                        <span className="section-pill">CORE CAPABILITIES</span>
                        <h2 className="section-title">Built for Engineering Excellence</h2>
                        <p className="section-subtitle">
                            Every feature is designed to give you unfair clarity before walking into technical and architectural interview rounds.
                        </p>
                    </div>

                    <div className="bento-grid">
                        <div className="bento-card bento-card--featured">
                            <div className="bento-card__glow"></div>
                            <span className="bento-step">01 // PARSING</span>
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
                            <span className="bento-step">02 // DECODING</span>
                            <h3>Interviewer Intention Rubrics</h3>
                            <p>Never wonder what interviewers are testing for. PrepAI surfaces the underlying evaluation checklist and provides model STAR responses.</p>
                            <div className="bento-chips">
                                <span>STAR Framework</span>
                                <span>Edge Case Prep</span>
                            </div>
                        </div>

                        <div className="bento-card">
                            <div className="bento-card__glow"></div>
                            <span className="bento-step">03 // EXECUTION</span>
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

            {/* Testimonials */}
            <section className="testimonials-section" id="testimonials">
                <div className="testimonials-section__inner">
                    <div className="section-header text-center">
                        <span className="section-pill">TESTIMONIALS</span>
                        <h2 className="section-title">Candidates Landing Top-Tier Offers</h2>
                    </div>

                    <div className="testimonials-grid">
                        {testimonials.map((t) => (
                            <div key={t.name} className="testimonial-card">
                                <div className="testimonial-stars">★★★★★</div>
                                <p className="testimonial-text">"{t.text}"</p>
                                <div className="testimonial-author">
                                    <img src={t.image} alt={t.name} className="author-img" />
                                    <div>
                                        <strong className="author-name">{t.name}</strong>
                                        <p className="author-role">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section" id="faqs">
                <div className="faq-section__inner">
                    <div className="section-header text-center">
                        <span className="section-pill">FAQ</span>
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
                    <h2>Master Your Next Interview. <br /><span className="gradient-text">Get Hired Faster.</span></h2>
                    <p>Join thousands of software engineers and leaders using PrepAI to prepare with clarity.</p>
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
                            <span className="brand-symbol">⚡</span>
                            <strong>Prep<span className="text-gradient">AI</span></strong>
                        </div>
                        <p>AI-Powered Interview Strategy &amp; Intelligence Platform.</p>
                    </div>

                    <div className="footer-links">
                        <div className="footer-col">
                            <strong>Platform</strong>
                            <a href="#features">Capabilities</a>
                            <a href="#preview">Workspace</a>
                            <a href="#testimonials">Candidates</a>
                        </div>
                        <div className="footer-col">
                            <strong>Resources</strong>
                            <a href="#faqs">FAQ</a>
                            <button type="button" onClick={handleQuickDemo} className="footer-link-btn">Demo Mode</button>
                            <Link to="/login">Sign In</Link>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} PrepAI. Engineered for ambitious engineers.</p>
                </div>
            </footer>
        </div>
    )
}

export default Landing