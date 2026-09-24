import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'

const Login = () => {

    const { user, loading, handleLogin, handleDemoLogin } = useAuth()
    const navigate = useNavigate()

    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ authError, setAuthError ] = useState("")
    const [ isSubmittingDemo, setIsSubmittingDemo ] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setAuthError("")
        const { success, error } = await handleLogin({email,password})
        if (success) {
            navigate('/app')
            return
        }
        setAuthError(error)
    }

    const handleAutofillDemo = () => {
        setEmail("demo.recruiter@prepai.dev")
        setPassword("DemoUser@PrepAI123!")
        setAuthError("")
    }

    const onDemoLoginClick = async () => {
        setAuthError("")
        setIsSubmittingDemo(true)
        handleAutofillDemo()
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
                <h1>Loading.........</h1>
            </main>
        )
    }

    return (
        <main className='login-page'>
            <div className='login-page__layout'>
                <aside className='login-quote'>
                    <p className='login-quote__label'>Interview Intelligence</p>
                    <blockquote>
                        "Master system design trade-offs and walk into technical loops with structured confidence."
                    </blockquote>
                    <p className='login-quote__author'>PrepAI Platform</p>
                </aside>

                <section className='glass-card'>
                    <Link to='/' className='auth-back-link'>
                        ← Back to PrepAI
                    </Link>
                    <div className='card-header-badge'>
                        <span className='pill-badge'>🚀 Instant Access Available</span>
                    </div>
                    <h1>Welcome Back</h1>
                    <p className='glass-card__subtitle'>Sign in or use Demo Mode to test PrepAI instantly.</p>

                    <div className='demo-access-box'>
                        <div className='demo-access-box__info'>
                            <strong>Recruiter & Guest Access</strong>
                            <span>Skip registration and explore full app features with one click.</span>
                        </div>
                        <div className='demo-actions-row'>
                            <button
                                type="button"
                                className='button demo-button'
                                onClick={onDemoLoginClick}
                                disabled={isSubmittingDemo}
                            >
                                {isSubmittingDemo ? (
                                    <span>Connecting Demo...</span>
                                ) : (
                                    <span>⚡ 1-Click Demo Login</span>
                                )}
                            </button>
                            <button
                                type="button"
                                className='button demo-autofill-btn'
                                onClick={handleAutofillDemo}
                                title="Auto-fill demo credentials in the form"
                            >
                                Auto-fill
                            </button>
                        </div>
                    </div>

                    <div className='auth-divider'>
                        <span>or continue with email</span>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                value={email}
                                onChange={(e) => { setEmail(e.target.value) }}
                                type="email"
                                id="email"
                                name='email'
                                placeholder='Enter your email address' />
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                value={password}
                                onChange={(e) => { setPassword(e.target.value) }}
                                type="password"
                                id="password"
                                name='password'
                                placeholder='Enter your password' />
                        </div>

                        {authError && <p className='form-error'>{authError}</p>}

                        <button className='button primary-button login-submit' disabled={isSubmittingDemo}>
                            Sign In
                        </button>
                    </form>

                    <p className='switch-auth'>Don&apos;t have an account? <Link to={"/register"} >Create one</Link> </p>
                </section>
            </div>
        </main>
    )
}

export default Login;