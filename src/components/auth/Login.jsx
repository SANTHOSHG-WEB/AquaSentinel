import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import { LogIn, Mail, Lock, Activity } from 'lucide-react';
import GlassCard from '../common/GlassCard';
import './Auth.css';

const Login = ({ onAuthChange }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Special bypass for testhome@gmail.com
        if (email === 'testhome@gmail.com') {
            console.log('Bypassing auth for test account');
            localStorage.setItem('aqua_auth', 'true');
            if (onAuthChange) onAuthChange();
            navigate('/');
            return;
        }

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <GlassCard className="auth-card" delay={100}>
                <div className="auth-header">
                    <Activity className="auth-logo pulse-icon" size={40} />
                    <h2 className="gradient-text">Welcome Back</h2>
                    <p>Enter your credentials to access Aquasentinel</p>
                </div>

                <form onSubmit={handleLogin} className="auth-form">
                    <div className="input-group">
                        <Mail size={20} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <Lock size={20} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <button type="submit" className="btn-auth" disabled={loading}>
                        {loading ? 'Authenticating...' : 'Login'} <LogIn size={20} />
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
                    <p className="hint">Use <strong>testhome@gmail.com</strong> for quick access</p>
                </div>
            </GlassCard>
        </div>
    );
};

export default Login;
