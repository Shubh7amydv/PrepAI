import React from 'react';
import "/Users/saurabhyadav/Desktop/Gen-Ai-Project/Frontend/src/features/auth/auth.form.scss"
import { useNavigate,Link } from 'react-router';

const Login= () => {

    const handleSubmit =(e) =>{
        e.preventDefault()
    }

    return (
       <main>
          <div className="form-container">
               <h1>Login</h1>

               <form  onSubmit={handleSubmit}> 

         

                  <div className="input-group">
                      <label htmlFor="email">Email</label>
                      <input
                       type="email" 
                       id="email"
                       name="email"
                       placeholder='enter you email'
                      />
                  </div>
                 
               
                
                 <div className="input-group">
                      <label htmlFor="password">Password</label>
                      <input
                       type="string" 
                       id="password"
                       name="password"
                       placeholder='enter your password'
                      />
                  </div>

                 

                  <button className='button primary-button'> Login</button>

               </form>

              <p>Don't Have an Account ? <Link to="/register">Register </Link></p>
               
          </div>
       </main> 
    ); 
}

export default Login;