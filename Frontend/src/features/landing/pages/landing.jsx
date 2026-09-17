import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import '../style/landing.scss'

const testimonials = [
    {
        name: 'David Zhao',
        role: 'Senior Staff Engineer at Stripe',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
        text: 'The interviewer intention breakdown is pure gold. I knew exactly why they asked specific concurrency questions and structured my STAR answers seamlessly.',
        company: 'Stripe'
    },
    {
        name: 'Elena Rostova',
        role: 'Lead Frontend Architect at Netflix',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80',
        text: 'PrepAI tailored my resume for 4 different target jobs in minutes. Landed interviews at 3 tier-1 tech companies on my first attempt.',
        company: 'Netflix'
    },
    {
        name: 'Marcus Vance',
        role: 'Engineering Manager at Meta',
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=150&h=150&q=80',
        text: 'The 10-day roadmap took all the anxiety out of interview preparation. Instead of guessing what to study, I had a daily checklist.',
        company: 'Meta'
    }
]

const faqs = [
    {
        q: 'How does PrepAI analyze my resume and target job description?',
        a: 'PrepAI uses advanced LLM intelligence to cross-reference every requirement, skill, and expectation in the job description against your background. It calculates a compatibility score, isolates specific skill gaps, and generates targeted questions.'
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
    const [ bannerDismissed, setBannerDismissed ] = useState(false)
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
            {/* Top Announcement Banner */}
            {!bannerDismissed && (
                <div className="top-announcement-banner">
                    <div className="banner-content">
                        <span>🎉 PrepAI is now live — Generate targeted interview prep plans & tailored ATS resumes in seconds.</span>
                        <button type="button" onClick={handleQuickDemo} className="banner-link">
                            Try 1-Click Demo →
                        </button>
                    </div>
                    <button
                        type="button"
                        className="banner-close-btn"
                        onClick={() => setBannerDismissed(true)}
                        aria-label="Dismiss banner"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Sticky Editorial Header */}
            <header className="landing-nav">
                <div className="landing-nav__inner">
                    <div className="landing-nav__left">
                        <Link to="/" className="landing-brand">
                            <div className="landing-brand__icon">
                                <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="brand-svg">
                                    <rect x="5" y="3" width="22" height="28" rx="4" fill="#E85A4F" opacity="0.18" />
                                    <rect x="5" y="3" width="22" height="28" rx="4" stroke="#E85A4F" strokeWidth="2.2" />
                                    <line x1="10" y1="11" x2="22" y2="11" stroke="#E85A4F" strokeWidth="2" strokeLinecap="round" />
                                    <line x1="10" y1="16" x2="19" y2="16" stroke="#E85A4F" strokeWidth="2" strokeLinecap="round" />
                                    <line x1="10" y1="21" x2="22" y2="21" stroke="#E85A4F" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M22 3.5L16.5 19H21L14 32.5L20.5 17H16L22 3.5Z" fill="#E85A4F" />
                                </svg>
                            </div>
                            <span className="landing-brand__text">PrepAI</span>
                        </Link>

                        <nav className="landing-nav__links">
                            <a href="#features">Features</a>
                            <a href="#preview">Interactive Workspace</a>
                            <a href="#testimonials">Candidates</a>
                            <a href="#faqs">Resources & FAQ</a>
                        </nav>
                    </div>

                    <div className="landing-nav__actions">
                        {!user ? (
                            <>
                                <button type="button" onClick={handleQuickDemo} className="btn-nav-demo">
                                    {demoLoading ? 'Connecting...' : '⚡ Demo Access'}
                                </button>
                                <Link to="/login" className="btn-nav-ghost">Sign In</Link>
                                <button type="button" className="btn-nav-primary" onClick={handlePrimaryAction}>
                                    Get started free
                                </button>
                            </>
                        ) : (
                            <button type="button" className="btn-nav-primary" onClick={handlePrimaryAction}>
                                Open Dashboard
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
                        <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
                        <a href="#preview" onClick={() => setMobileMenuOpen(false)}>Interactive Workspace</a>
                        <a href="#testimonials" onClick={() => setMobileMenuOpen(false)}>Candidates</a>
                        <a href="#faqs" onClick={() => setMobileMenuOpen(false)}>Resources & FAQ</a>
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

            {/* Sub-banner Highlight */}
            <div className="feature-strip">
                <div className="feature-strip__inner">
                    <div className="strip-badge-wrap">
                        <span className="strip-badge">NEW //</span>
                        <p className="strip-text">
                            <strong>Instant ATS Resume Generation:</strong> Tailor your resume to match exact recruiter keywords in under 60 seconds.
                        </p>
                    </div>
                    <div className="strip-tags">
                        <span className="tag-pill">System Design</span>
                        <span className="tag-pill">STAR Method</span>
                        <span className="tag-pill">ATS Scoring</span>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero__inner">
                    <div className="hero__content">
                        {/* Rating pill */}
                        <div className="rating-pill">
                            <div className="stars">
                                {'★'.repeat(5)}
                            </div>
                            <span>Rated 4.9/5 by 12,000+ candidates & engineers</span>
                        </div>

                        <h1 className="hero__headline">
                            Master your next interview. <br />
                            <em>Get hired faster.</em>
                        </h1>

                        <p className="hero__subhead">
                            PrepAI gives candidates and engineers a complete interview intelligence platform — generate tailored technical & behavioral questions, decode interviewer intentions, and export an ATS-matched resume in seconds.
                        </p>

                        <div className="hero__actions">
                            <button type="button" className="btn-hero-primary" onClick={handlePrimaryAction}>
                                <span>{user ? 'Open Dashboard' : 'Get started free'}</span>
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
                                <span className="dot dot--green"></span>
                                <span>No credit card required</span>
                            </div>
                            <div className="benefit-item">
                                <span className="dot dot--coral"></span>
                                <span>1-minute setup</span>
                            </div>
                            <div className="benefit-item">
                                <span className="dot dot--rose"></span>
                                <span>Instant ATS Resume PDF</span>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Mockup (BillFlow Style) */}
                    <div className="hero__preview" id="preview">
                        <div className="mockup-glow"></div>
                        <div className="mockup-card">
                            {/* Mockup Header */}
                            <div className="mockup-topbar">
                                <div className="mockup-brand">
                                    <span className="mockup-slash">//</span>
                                    <strong>prepai</strong>
                                </div>
                                <div className="mockup-topbar-right">
                                    <button
                                        type="button"
                                        className="mockup-create-btn"
                                        onClick={() => navigate('/app')}
                                    >
                                        + New Prep Plan
                                    </button>
                                    <div className="mockup-user-pill">
                                        <span>Alex Chen</span>
                                        <span className="pro-badge">PRO</span>
                                    </div>
                                </div>
                            </div>

                            {/* Mockup Window Workspace */}
                            <div className="mockup-split">
                                {/* Left Mini Sidebar */}
                                <aside className="mockup-sidebar">
                                    <button
                                        className={`sidebar-link ${activeTab === 'dashboard' ? 'sidebar-link--active' : ''}`}
                                        onClick={() => setActiveTab('dashboard')}
                                    >
                                        <span>📊 Dashboard</span>
                                    </button>
                                    <button
                                        className={`sidebar-link ${activeTab === 'technical' ? 'sidebar-link--active' : ''}`}
                                        onClick={() => setActiveTab('technical')}
                                    >
                                        <span>💻 Technical Qs</span>
                                    </button>
                                    <button
                                        className={`sidebar-link ${activeTab === 'behavioral' ? 'sidebar-link--active' : ''}`}
                                        onClick={() => setActiveTab('behavioral')}
                                    >
                                        <span>🗣️ Behavioral Qs</span>
                                    </button>
                                    <button
                                        className={`sidebar-link ${activeTab === 'roadmap' ? 'sidebar-link--active' : ''}`}
                                        onClick={() => setActiveTab('roadmap')}
                                    >
                                        <span>🗺️ 10-Day Plan</span>
                                    </button>
                                    <button
                                        className={`sidebar-link ${activeTab === 'resume' ? 'sidebar-link--active' : ''}`}
                                        onClick={() => setActiveTab('resume')}
                                    >
                                        <span>📄 ATS Resume</span>
                                    </button>
                                </aside>

                                {/* Mockup Main Viewport */}
                                <div className="mockup-viewport">
                                    <div className="viewport-greeting">
                                        <h2>Good morning, Alex</h2>
                                        <p>Target Position: <strong>Senior Full Stack Engineer @ Stripe</strong></p>
                                    </div>

                                    {/* Action Chips */}
                                    <div className="quick-action-chips">
                                        <div className="chip chip--emerald">
                                            <span>📄 Tailored Resume Ready</span>
                                        </div>
                                        <div className="chip chip--sky">
                                            <span>⚡ 88% Match Score</span>
                                        </div>
                                        <div className="chip chip--purple">
                                            <span>🎯 8 Technical Focus Qs</span>
                                        </div>
                                        <div className="chip chip--amber">
                                            <span>🗓️ Day 3 of 10 Roadmap</span>
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="viewport-stats-grid">
                                        {/* Match Score Gauge Card */}
                                        <div className="stat-card">
                                            <div className="stat-card__head">
                                                <h4>Compatibility breakdown</h4>
                                                <span className="stat-badge">High Fit</span>
                                            </div>
                                            <div className="dial-wrap">
                                                <div className="dial-circle">
                                                    <svg viewBox="0 0 100 100" className="dial-svg">
                                                        <circle cx="50" cy="50" r="38" className="dial-bg" />
                                                        <circle cx="50" cy="50" r="38" className="dial-fill" strokeDasharray="238.7" strokeDashoffset="28" />
                                                    </svg>
                                                    <div className="dial-label">
                                                        <span className="dial-num">88%</span>
                                                        <span className="dial-sub">Match</span>
                                                    </div>
                                                </div>
                                                <div className="dial-skills">
                                                    <div className="skill-row">
                                                        <span className="sq sq--amber"></span>
                                                        <span>System Design (94%)</span>
                                                    </div>
                                                    <div className="skill-row">
                                                        <span className="sq sq--coral"></span>
                                                        <span>React & Node (89%)</span>
                                                    </div>
                                                    <div className="skill-row">
                                                        <span className="sq sq--purple"></span>
                                                        <span>Concurrency (82%)</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Question Preview Card */}
                                        <div className="stat-card">
                                            <div className="stat-card__head">
                                                <h4>Sample Interviewer Intention</h4>
                                                <span className="stat-tag">STAR Rubric</span>
                                            </div>
                                            <div className="intention-box">
                                                <strong>Q: "How do you handle distributed race conditions in payment processing?"</strong>
                                                <p className="intention-text">
                                                    <em>Interviewer Intention:</em> Evaluates idempotent locking (`SETNX`), state machine validation, and safe retry policies under network partition.
                                                </p>
                                                <span className="answer-pill">✓ Model Answer Included</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section" id="features">
                <div className="features-section__inner">
                    <div className="section-head">
                        <span className="section-pill">TAILORED FOR YOUR WORKFLOW</span>
                        <h2 className="section-title">Built for candidates & engineers like you</h2>
                        <p className="section-subtitle">
                            Whether you are preparing for your first technical round or negotiating a Staff-level offer, PrepAI gives you the exact tools you need to excel.
                        </p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-card__badge">01 // PARSING</div>
                            <h3>Role & JD Deconstruction</h3>
                            <p>Paste any job posting. PrepAI extracts core technical proficiencies, architectural demands, and team expectations directly into structured insights.</p>
                            <div className="feature-card__footer">
                                <span className="feature-tag">Keyword Extraction</span>
                                <span className="feature-tag">Seniority Calibration</span>
                            </div>
                        </div>

                        <div className="feature-card">
                            <div className="feature-card__badge">02 // STRATEGY</div>
                            <h3>Interviewer Intention Decoding</h3>
                            <p>Never guess what an interviewer is really asking. PrepAI reveals the exact evaluation criteria behind every question and provides bulletproof model answers.</p>
                            <div className="feature-card__footer">
                                <span className="feature-tag">STAR Formatting</span>
                                <span className="feature-tag">Technical Depth</span>
                            </div>
                        </div>

                        <div className="feature-card">
                            <div className="feature-card__badge">03 // EXECUTION</div>
                            <h3>Day-by-Day Roadmap & ATS PDF</h3>
                            <p>Follow a customized milestone timeline to close identified skill gaps, then download a beautifully crafted ATS-tailored resume to maximize callbacks.</p>
                            <div className="feature-card__footer">
                                <span className="feature-tag">Daily Tasks</span>
                                <span className="feature-tag">Instant PDF Export</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="testimonials-section" id="testimonials">
                <div className="testimonials-section__inner">
                    <div className="section-head text-center">
                        <span className="section-pill">REAL RESULTS</span>
                        <h2 className="section-title">Trusted by candidates who landed top offers</h2>
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
                    <div className="section-head text-center">
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
                    <h2>Master your next interview. <br />Step into the room prepared.</h2>
                    <p>Join thousands of engineers who use PrepAI to decode interview rubrics and land top offers.</p>
                    <div className="cta-banner__actions">
                        <button type="button" className="btn-hero-primary" onClick={handlePrimaryAction}>
                            {user ? 'Open Dashboard' : 'Get started free →'}
                        </button>
                        <button type="button" className="btn-hero-secondary" onClick={handleQuickDemo}>
                            ⚡ Try 1-Click Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* Warm Editorial Footer */}
            <footer className="landing-footer">
                <div className="landing-footer__inner">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <span className="brand-dot"></span>
                            <strong>PrepAI</strong>
                        </div>
                        <p>Intelligent Interview Preparation & Strategy Platform.</p>
                    </div>

                    <div className="footer-links">
                        <div className="footer-col">
                            <strong>Platform</strong>
                            <a href="#features">Features</a>
                            <a href="#preview">Workspace</a>
                            <a href="#testimonials">Testimonials</a>
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
                    <p>&copy; {new Date().getFullYear()} PrepAI. Built for candidates & engineering leaders.</p>
                </div>
            </footer>
        </div>
    )
}

export default Landing