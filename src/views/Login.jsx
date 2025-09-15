import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const getEmail = process.env.REACT_APP_EMAIL;
  const getPass = process.env.REACT_APP_Password;

  const handleLogin = (e) => {
    e.preventDefault();
    if (getEmail === email && getPass === password) {
      document.cookie = `auth=${true};`;
      navigate('/');
    } else {
      toast.error('Wrong Email or Password!', { position: 'top-right' });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied: ${text}`, { position: 'top-right' });
  };

  return (
    <>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-8 col-md-6 col-lg-4 shadow-lg p-4 rounded">
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="loginemail" className="form-label">
                  Email address
                </label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  className="form-control"
                  id="loginemail"
                  placeholder="name@example.com"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="loginpassword" className="form-label">
                  Password
                </label>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="password"
                  className="form-control"
                  id="loginpassword"
                  placeholder="password"
                />
              </div>

              {/* Demo credentials with copy buttons */}
              <div className="mb-3">
                <div className="d-flex align-items-center justify-content-between">
                  <span>Email: demo@gmail.com</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => copyToClipboard('demo@gmail.com')}
                  >
                    Copy
                  </button>
                </div>
                <div className="d-flex align-items-center justify-content-between mt-2">
                  <span>Password: demo@400500</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => copyToClipboard('demo@400500')}
                  >
                    Copy
                  </button>
                </div>
              </div>

              <button
                style={{ width: '100%' }}
                className="btn btn-primary mt-2"
                type="submit"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Toast container */}
      <ToastContainer autoClose={2000} />
    </>
  );
};

export default Login;
