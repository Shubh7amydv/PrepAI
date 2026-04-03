import React from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import '../style/landing.scss'

const featureItems = [
    {
        title: 'AI Interview Report',
        text: 'Generate a role-aware report with match score, technical questions, behavioral questions, and preparation guidance.'
    },
    {
        title: 'Resume Intelligence',
        text: 'Upload a resume and let the system extract skills, identify gaps, and tailor the output to the target job.'
    },
    {
        title: 'ATS-Aware Output',
        text: 'Highlight relevant keywords, strengths, and missing skills so candidates can optimize for recruiter screening.'
    }
]

const processSteps = [
    'Upload your resume or add a short self-description.',
    'Paste the target job description and generate the report.',
    'Review the match score, questions, gaps, and plan.',
    'Use the resume PDF flow to tailor applications faster.'
]

const metricCards = [
    { label: 'Input Sources', value: 'Resume + JD + Self Description' },
    { label: 'Core Output', value: 'Interview Strategy Report' },
    { label: 'AI Provider', value: 'Groq API' }
]

const Landing = () => {
    const { user } = useAuth()
    const navigate = useNavigate()

    const handlePrimaryAction = () => {
        navigate(user ? '/app' : '/register')
    }

    return (
        <main className="landing-page">
            <div className="landing-page__glow landing-page__glow--one" />
            <div className="landing-page__glow landing-page__glow--two" />
            <div className="landing-page__grain" />

            <header className="landing-nav">
                <Link to="/" className="landing-brand">
                    <span className="landing-brand__mark">P</span>
                    <span className="landing-brand__text">
                        <strong>PrepAI</strong>
                        <small>AI Interview Preparation Platform</small>
                    </span>
                </Link>

                <nav className="landing-nav__links">
                    <a href="#features">Features</a>
                    <a href="#workflow">Workflow</a>
                    <a href="#cta">Get Started</a>
                </nav>

                <div className="landing-nav__actions">
                    <Link to="/login" className="landing-link">Sign in</Link>
                    <button type="button" className="landing-button landing-button--ghost" onClick={handlePrimaryAction}>
                        {user ? 'Open Dashboard' : 'Create Account'}
                    </button>
                </div>
            </header>

            <section className="hero">
                <div className="hero__content">
                    <span className="hero__eyebrow">AI Interview Prep • ATS Focused</span>
                    <h1>Turn your resume into interview-ready momentum.</h1>
                    <p>
                        PrepAI analyzes your resume, job description, and self-summary to generate a polished interview report with skill gaps,
                        role-specific questions, and a focused preparation roadmap.
                    </p>

                    <div className="hero__actions" id="cta">
                        <button type="button" className="landing-button" onClick={handlePrimaryAction}>
                            {user ? 'Go to App' : 'Start Free'}
                        </button>
                        <Link to="/login" className="landing-button landing-button--secondary">
                            Sign In
                        </Link>
                    </div>

                    <div className="hero__metrics">
                        {metricCards.map((metric) => (
                            <article key={metric.label} className="metric-card">
                                <span>{metric.label}</span>
                                <strong>{metric.value}</strong>
                            </article>
                        ))}
                    </div>
                </div>

                <div className="hero__visual">
                    <div className="glass-panel glass-panel--main">
                        <div className="glass-panel__topline">
                            <span className="status-dot" />
                            <span>AI report preview</span>
                        </div>

                        <div className="score-ring">
                            <div>
                                <span>Match Score</span>
                                <strong>84%</strong>
                            </div>
                        </div>

                        <div className="report-snippet">
                            <div>
                                <span>Top skills</span>
                                <strong>React, Node.js, MongoDB, JWT</strong>
                            </div>
                            <div>
                                <span>Skill gaps</span>
                                <strong>System design, scaling, testing</strong>
                            </div>
                            <div>
                                <span>Prep plan</span>
                                <strong>10-day focused roadmap</strong>
                            </div>
                        </div>
                    </div>

                    <div className="floating-card floating-card--left">
                        <span>Technical Questions</span>
                        <strong>8 to 10 role-specific prompts</strong>
                    </div>

                    <div className="floating-card floating-card--right">
                        <span>Behavioral Questions</span>
                        <strong>STAR-based response guidance</strong>
                    </div>
                </div>
            </section>

            <section className="feature-grid" id="features">
                {featureItems.map((item) => (
                    <article key={item.title} className="feature-card">
                        <span className="feature-card__chip">Included</span>
                        <h2>{item.title}</h2>
                        <p>{item.text}</p>
                    </article>
                ))}
            </section>

            <section className="workflow" id="workflow">
                <div className="workflow__header">
                    <span className="section-tag">How it works</span>
                    <h2>Built for fast interview prep with a clean workflow.</h2>
                </div>

                <div className="workflow__steps">
                    {processSteps.map((step, index) => (
                        <article key={step} className="workflow-step">
                            <span>{String(index + 1).padStart(2, '0')}</span>
                            <p>{step}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="final-cta">
                <div>
                    <span className="section-tag">Ready to launch</span>
                    <h2>Planning is the first step to winning your next interview.</h2>
                </div>
                <div className="final-cta__actions">
                    <Link to="/register" className="landing-button">
                        Create Account
                    </Link>
                    <Link to="/login" className="landing-button landing-button--secondary">
                        Sign In
                    </Link>
                </div>
            </section>
        </main>
    )
}

export default Landing