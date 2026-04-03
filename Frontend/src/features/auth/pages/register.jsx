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

    const { user, loading, handleRegister } = useAuth()
    
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

    useEffect(() => {
        if (user) {
            navigate('/app')
        }
    }, [user, navigate])

    if (loading) {
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
                    <h1>Create Account</h1>
                    <p className='glass-card__subtitle'>Join thousands preparing for their next big opportunity.</p>

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

                        <button className='button primary-button register-submit' >Create Account</button>
                    </form>

                    <p className='switch-auth'>Already have an account? <Link to={"/login"} >Sign in</Link> </p>
                </section>

                <aside className='register-quote'>
                    <p className='register-quote__label'>Key to Success</p>
                    <blockquote>
                        "Preparation is the key to success. Practice, learn, and excel."
                    </blockquote>
                    <p className='register-quote__author'>- Allan Poe</p>
                </aside>
            </div>
        </main>
    )
}

export default Register