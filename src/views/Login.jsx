import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';
import { useAuth } from './AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Use login from context

  const getEmail = process.env.REACT_APP_EMAIL;
  const getPass = process.env.REACT_APP_Password;

 const handleLogin = (e) => {
  e.preventDefault();
  if (getEmail === email && getPass === password) {
    login(); // Use login from context
    navigate('/');
    toast.success('Login Successful!', {
      position: 'top-right',
      style: { color: '#fff' }  
    });
  } else {
    toast.error('Wrong Email or Password!', {
      position: 'top-right',
      style: { color: '#fff' } 
    });
  }
};


  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
    }
    
    toast.success(`Copied: ${text}`, {
      position: 'top-right',
      className: 'custom-toast',
      style: { color: 'white' }
    });
  };

  return (
    <>
      <div className="login-wrapper">
        <div className="container">
          <div className="row justify-content-center align-items-center min-vh-100">
            <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
              <div className="login-card">
                {/* Header Section */}
                <div className="login-header">
                  <div className="login-icon">
                    <i className="bi bi-shield-lock"></i>
                  </div>
                  <h2 className="login-title">Welcome Back</h2>
                  <p className="login-subtitle">Sign in to continue</p>
                </div>

                {/* Form Section */}
                <div className="login-body">
                  <form onSubmit={handleLogin}>
                    {/* Email Input */}
                    <div className="mb-4">
                      <label htmlFor="loginemail" className="form-label fw-semibold">
                        Email Address
                      </label>
                      <div className="input-group-modern">
                        <i className="bi bi-envelope input-icon"></i>
                        <input
                          onChange={(e) => setEmail(e.target.value)}
                          value={email}
                          type="email"
                          className="form-control form-control-modern"
                          id="loginemail"
                          placeholder="name@example.com"
                          required
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div className="mb-4">
                      <label htmlFor="loginpassword" className="form-label fw-semibold">
                        Password
                      </label>
                      <div className="input-group-modern">
                        <i className="bi bi-lock input-icon"></i>
                        <input
                          onChange={(e) => setPassword(e.target.value)}
                          value={password}
                          type={showPassword ? 'text' : 'password'}
                          className="form-control form-control-modern"
                          id="loginpassword"
                          placeholder="Enter your password"
                          required
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                        </button>
                      </div>
                    </div>

                    {/* Demo Credentials */}
                    <div className="demo-credentials">
                      <p className="demo-title">
                        <i className="bi bi-info-circle me-2"></i>
                        Demo Credentials
                      </p>
                      
                      <div className="credential-item">
                        <div className="credential-content">
                          <i className="bi bi-envelope credential-icon"></i>
                          <span className="credential-text">demo@gmail.com</span>
                        </div>
                        <button
                          type="button"
                          className={`btn-copy ${copiedEmail ? 'copied' : ''}`}
                          onClick={() => copyToClipboard('demo@gmail.com', 'email')}
                        >
                          {copiedEmail ? (
                            <>
                              <i className="bi bi-check2"></i> Copied
                            </>
                          ) : (
                            <>
                              <i className="bi bi-clipboard"></i> Copy
                            </>
                          )}
                        </button>
                      </div>

                      <div className="credential-item">
                        <div className="credential-content">
                          <i className="bi bi-lock credential-icon"></i>
                          <span className="credential-text">demo@400500</span>
                        </div>
                        <button
                          type="button"
                          className={`btn-copy ${copiedPassword ? 'copied' : ''}`}
                          onClick={() => copyToClipboard('demo@400500', 'password')}
                        >
                          {copiedPassword ? (
                            <>
                              <i className="bi bi-check2"></i> Copied
                            </>
                          ) : (
                            <>
                              <i className="bi bi-clipboard"></i> Copy
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button className="btn btn-submit w-100" type="submit">
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Sign In
                    </button>
                  </form>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer autoClose={2000} />
    </>
  );
};

export default Login;