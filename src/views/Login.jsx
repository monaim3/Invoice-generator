import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email,setEmail]=useState('')
    const [password, setPassword]=useState('')
    const navigate=useNavigate()
    const getEmail=process.env.REACT_APP_EMAIL
    const getPass=process.env.REACT_APP_Password
    const handleLogin=(e)=>{
    e.preventDefault()
    if(getEmail==email && getPass==password){
      
        document.cookie = `auth=${true};`;
        navigate("/")
    }else{
        alert("Wrong Password")
    }    
}
   
    return (
        <>
           <div className='w-25 mx-auto mt-5 shadow-lg p-4'>
           <form onSubmit={handleLogin}>
            <div className="mb-3">
                <label for="loginemail" className="form-label">Email address</label>
                <input onChange={(e)=>setEmail(e.target.value)}  value={email}type="email" className="form-control" id="loginemail" placeholder="name@example.com"/>
            </div>
            <div className="mb-3">
                <label for="loginpassword" className="form-label"> Password</label>
                <input onChange={(e)=>setPassword(e.target.value)}  value={password}type="password" className="form-control" id="loginpassword" placeholder="password"/>
            </div>

            <div className="mb-3">
                <label for="loginpassword" className="form-label">Demo Login:demo@gmail.com <br></br> Password:demo@400500</label>
               
            </div>
            <button style={{width:"100%"}} className='btn btn-primary mt-2' type='submit'>Submit</button>
            </form>
           </div>
            
        </>
    );
};

export default Login;