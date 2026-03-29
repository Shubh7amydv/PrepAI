import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'

const Login = () => {

    const { user, loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ authError, setAuthError ] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setAuthError("")
        const { success, error } = await handleLogin({email,password})
        if (success) {
            navigate('/')
            return
        }
        setAuthError(error)
    }

    useEffect(() => {
        if (user) {
            navigate('/')
        }
    }, [user, navigate])

    if(loading){
        return (
            <main>
                <h1>Loading.......</h1>
                <p>Waking up backend from free-plan nap 🥲 Please wait about a minute.</p>
            </main>
        )
    }

    return (
        <main className='login-page'>
            <div className='login-page__layout'>
                <aside className='login-quote'>
                    <p className='login-quote__label'>Today&apos;s Momentum</p>
                    <blockquote>
                        "Success is the sum of small efforts, repeated day in and day out."
                    </blockquote>
                    <p className='login-quote__author'>- Robert Collier</p>
                </aside>

                <section className='glass-card'>
                    <h1>Welcome Back</h1>
                    <p className='glass-card__subtitle'>Sign in and continue building your interview edge.</p>

                    <form onSubmit={handleSubmit}>
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
                                placeholder='Enter your password' />
                        </div>

                        {authError && <p className='form-error'>{authError}</p>}

                        <button className='button primary-button login-submit' >Sign In</button>
                    </form>

                    <p className='switch-auth'>Don&apos;t have an account? <Link to={"/register"} >Create one</Link> </p>
                </section>
            </div>
        </main>
    )
}

export default Login;