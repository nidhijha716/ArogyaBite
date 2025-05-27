import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        
        axios.post('http://localhost:3001/login', {email, password})
        .then(result => {
            console.log(result);
            if(result.data === "Success"){
                console.log("Login Success");
                localStorage.setItem("email", email);
                navigate('/home');
            } else {
                alert('Incorrect email or password! Please try again.');
            }
        })
        .catch(err => {
            console.log(err);
            alert('An error occurred during login. Please try again.');
        });
    }

    return (
        <div className="dark-theme" style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
        }}>
            <div className="d-flex justify-content-center align-items-center text-center min-vh-100">
                <div className="card bg-dark text-light p-4 rounded-4 shadow-lg" style={{width: '100%', maxWidth: '450px'}}>
                    <div className="card-body">
                        <h2 className='mb-4 text-primary fw-bold'>Welcome Back</h2>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3 text-start">
                                <label htmlFor="email" className="form-label">
                                    Email Address
                                </label>
                                <input 
                                    type="email" 
                                    placeholder="Enter your email"
                                    className="form-control bg-dark text-light border-secondary" 
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                /> 
                            </div>
                            
                            <div className="mb-4 text-start">
                                <label htmlFor="password" className="form-label">
                                    Password
                                </label>
                                <input 
                                    type="password" 
                                    placeholder="Enter your password"
                                    className="form-control bg-dark text-light border-secondary" 
                                    id="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <button 
                                type="submit" 
                                className="btn btn-primary w-100 py-2 fw-bold"
                                style={{borderRadius: '50px'}}
                            >
                                Login
                            </button>
                        </form>
                        
                        <div className="mt-4 pt-3 border-top border-secondary">
                            <p className="mb-2 text-muted">Don't have an account?</p>
                            <Link 
                                to='/register' 
                                className="btn btn-outline-light w-100 py-2"
                                style={{borderRadius: '50px'}}
                            >
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Global dark theme styles */}
            <style jsx global>{`
                body {
                    background-color: #121212;
                    color: #f8f9fa;
                }
                
                .dark-theme input:-webkit-autofill,
                .dark-theme input:-webkit-autofill:hover, 
                .dark-theme input:-webkit-autofill:focus, 
                .dark-theme input:-webkit-autofill:active {
                    -webkit-box-shadow: 0 0 0 30px #343a40 inset !important;
                    -webkit-text-fill-color: #f8f9fa !important;
                }
                
                .dark-theme .form-control:focus {
                    background-color: #343a40;
                    color: #f8f9fa;
                    border-color: #495057;
                    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
                }
            `}</style>
        </div>
    )
}

export default Login;





