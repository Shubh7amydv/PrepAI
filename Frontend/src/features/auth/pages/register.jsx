import React from 'react';
import { useNavigate,Link } from 'react-router';

function register(props) {
   
    const naviagte=useNavigate()

    const handleSubmit =(e) =>{
        e.preventDefault()
    }


    return (
       <main>
          <div className="form-container">
               <h1>Register</h1>

               <form onSubmit={handleSubmit}> 

         

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

                   <div className="input-group">
                      <label htmlFor="username">Username</label>
                      <input
                       type="username" 
                       id="username"
                       name="username"
                       placeholder='enter your username'
                      />
                  </div>

                 

                  <button className='button primary-button'> Register</button>

               </form>

               <p>Already Have an Account ? <Link to="/login">Login</Link></p>
          </div>
       </main> 
    );
}

export default register;