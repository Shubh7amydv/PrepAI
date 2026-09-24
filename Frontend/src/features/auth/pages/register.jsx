import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'

const Register = () => {

    const navigate = useNavigate()
    const [ username, setUsername ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ authError, setAuthError ] = useState("")

    const { user, loading, handleRegister, handleDemoLogin } = useAuth()
    const [ isSubmittingDemo, setIsSubmittingDemo ] = useState(false)
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        setAuthError("")
        const { success, error } = await handleRegister({username,email,password})
        if (success) {
            navigate("/app")
            return
        }
        setAuthError(error)
    }

    const onDemoLoginClick = async () => {
        setAuthError("")
        setIsSubmittingDemo(true)
        const { success, error } = await handleDemoLogin()
        if (success) {
            navigate('/app')
            return
        }
        setIsSubmittingDemo(false)
        setAuthError(error || "Demo login failed")
    }

    useEffect(() => {
        if (user) {
            navigate('/app')
        }
    }, [user, navigate])

    if (loading && !isSubmittingDemo) {
        return (
            <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <h1>Loading........</h1>
            </main>
        )
    }

    return (
        <main className='register-page'>
            <div className='register-page__layout'>
                <section className='glass-card register-card'>
                    <Link to='/' className='auth-back-link'>
                        ← Back to PrepAI
                    </Link>
                    <div className='card-header-badge'>
                        <span className='pill-badge'>⚡ Recruiter Demo Mode</span>
                    </div>
                    <h1>Create Account</h1>
                    <p className='glass-card__subtitle'>Join to prepare for interviews, or try Demo Mode instantly.</p>

                    <div className='demo-access-box'>
                        <div className='demo-access-box__info'>
                            <strong>Want to test without creating an account?</strong>
                            <span>Jump straight to the dashboard with full features enabled.</span>
                        </div>
                        <button
                            type="button"
                            className='button demo-button'
                            onClick={onDemoLoginClick}
                            disabled={isSubmittingDemo}
                        >
                            {isSubmittingDemo ? "Connecting Demo..." : "⚡ 1-Click Demo Login"}
                        </button>
                    </div>

                    <div className='auth-divider'>
                        <span>or register with email</span>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="username">Username</label>
                            <input
                                onChange={(e) => { setUsername(e.target.value) }}
                                type="text"
                                id="username"
                                name='username'
                                placeholder='Choose your username' />
                        </div>
                        <div className="input-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                onChange={(e) => { setEmail(e.target.value) }}
                                type="email"
                                id="email"
                                name='email'
                                placeholder='Enter your email address' />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                onChange={(e) => { setPassword(e.target.value) }}
                                type="password"
                                id="password"
                                name='password'
                                placeholder='Create a strong password' />
                        </div>

                        {authError && <p className='form-error'>{authError}</p>}

                        <button className='button primary-button register-submit' disabled={isSubmittingDemo}>
                            Create Account
                        </button>
                    </form>

                    <p className='switch-auth'>Already have an account? <Link to={"/login"} >Sign in</Link> </p>
                </section>

                <aside className='register-quote'>
                    <p className='register-quote__label'>Targeted Preparation</p>
                    <blockquote>
                        "Decode interviewer rubrics, isolate JD skill gaps, and practice architecture questions with high signal."
                    </blockquote>
                    <p className='register-quote__author'>PrepAI Platform</p>
                </aside>
            </div>
        </main>
    )
}

export default Register