import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { login } from '../services/authService';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const token = await login(username, password);
            if (token) {
                window.location.href = '/'; 
            }
        } catch (err) {
            setError(err.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <style>{`
                .auth-wrapper { min-height: 100vh; width: 100vw; display: flex; align-items: center; justify-content: center; background: #020617; font-family: 'Inter', sans-serif; color: white; padding: 20px; position: relative; overflow: hidden; }
                .ambient-glow { position: absolute; width: 500px; height: 500px; background: rgba(59, 130, 246, 0.05); border-radius: 50%; filter: blur(120px); pointer-events: none; top: 25%; left: 50%; transform: translateX(-50%); }
                .auth-card { background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid #1e293b; width: 100%; max-width: 420px; padding: 45px; border-radius: 28px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); z-index: 10; }
                .brand-logo-container { width: 72px; height: 92px; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 16px; display: inline-flex; items: center; justify-content: center; margin-bottom: 20px; color: #3b82f6; box-shadow: 0 0 20px rgba(59, 130, 246, 0.15); }
                .input-group { margin-bottom: 24px; text-align: left; }
                .input-group label { display: block; font-size: 11px; font-weight: 800; color: #64748b; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.05em; }
                .input-wrapper { position: relative; display: flex; align-items: center; }
                .input-wrapper i { position: absolute; left: 16px; color: #475569; display: flex; align-items: center; }
                .input-field { width: 100%; background: #020617; border: 1px solid #1e293b; padding: 14px 15px 14px 48px; border-radius: 14px; color: white; transition: all 0.3s ease; font-size: 15px; }
                .input-field:focus { border-color: #3b82f6; outline: none; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15); background: #0f172a; }
                .auth-btn { width: 100%; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 16px; border-radius: 14px; border: none; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: 0.3s; margin-top: 10px; font-size: 16px; box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.4); }
                .auth-btn:hover { transform: translateY(-2px); box-shadow: 0 15px 25px -5px rgba(37, 99, 235, 0.5); }
                .auth-btn:active { transform: translateY(0); }
                .auth-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
                .error-box { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color: #ef4444; padding: 12px; border-radius: 12px; font-size: 13px; margin-bottom: 25px; display: flex; align-items: center; gap: 10px; text-align: left; }
                .card-footer { text-align: center; marginTop: 35px; padding-top: 25px; border-top: 1px solid #1e293b; }
                @keyframes spin { to { transform: rotate(360deg); } }
                .spinner { width: 20px; height: 20px; border: 2px solid white; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite; }
            `}</style>

            <div className="ambient-glow" />

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="auth-card"
            >
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    {/* Centered Premium Identity Frame */}
                    <div className="brand-logo-container">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '36px', height: '36px' }}>
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                    </div>
                    <h2 style={{ margin: 0, fontSize: '30px', fontWeight: '800', letterSpacing: '-0.02em' }}>Welcome Back</h2>
                    <p style={{ color: '#64748b', fontSize: '15px', marginTop: '8px' }}>Log in to continue to your Abode feed</p>
                </div>

                {error && (
                    <div className="error-box">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Username</label>
                        <div className="input-wrapper">
                            <i><Mail size={19}/></i>
                            <input 
                                type="text" 
                                required 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                className="input-field" 
                                placeholder="u/kaushik" 
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <div style={{ display: 'flex', justifyCwontent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <label style={{ margin: 0 }}>Password</label>
                            
                        </div>
                        <div className="input-wrapper">
                            <i><Lock size={19}/></i>
                            <input 
                                type="password" 
                                required 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                className="input-field" 
                                placeholder="••••••••" 
                            />
                        </div>
                        <span style={{ fontSize: '11px', color: '#3b82f6', cursor: 'pointer', fontWeight: '700', marginBottom: '10px' }}>Forgot?</span>
                    </div>

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? (
                            <div className="spinner" />
                        ) : (
                            <>Sign In <ArrowRight size={19}/></>
                        )}
                    </button>
                </form>

                <div className="card-footer">
                    <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                        Don't have an account? <Link to="/signup" style={{ color: '#3b82f6', fontWeight: '700', textDecoration: 'none', marginLeft: '5px' }}>Register</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;