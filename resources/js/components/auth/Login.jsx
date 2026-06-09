import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [form, setForm] = useState({ login: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await login(form.login, form.password);
            if (res.user.role === 'super_admin') navigate('/admin/dashboard');
            else if (res.user.role === 'teacher') navigate('/teacher/dashboard');
            else navigate('/student/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <div style={{ background: 'white', borderRadius: '16px', padding: '50px', width: '100%', maxWidth: '440px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                        <h1 style={{ fontSize: '32px', color: '#1e293b', marginBottom: '8px' }}>🏫 School Portal</h1>
                        <p style={{ color: '#64748b', fontSize: '16px' }}>Sign in to your account</p>
                    </div>

                    {error && (
                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '14px', borderRadius: '10px', marginBottom: '25px', fontSize: '14px' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Email or Username</label>
                            <input type="text" value={form.login} onChange={e => setForm({...form, login: e.target.value})}
                                style={{ width: '100%', padding: '14px 16px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '15px', transition: '0.3s', boxSizing: 'border-box' }}
                                placeholder="Enter email or username" required />
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Password</label>
                            <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                                style={{ width: '100%', padding: '14px 16px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '15px', transition: '0.3s', boxSizing: 'border-box' }}
                                placeholder="Enter password" required />
                        </div>

                        <button type="submit" disabled={loading}
                            style={{ width: '100%', padding: '14px', background: loading ? '#94a3b8' : '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: '0.3s' }}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '30px', paddingTop: '25px', borderTop: '1px solid #e2e8f0' }}>
                        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '15px' }}>Don't have an account?</p>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <Link to="/teacher/register" style={{ padding: '10px 20px', background: '#f1f5f9', color: '#1e293b', textDecoration: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '14px' }}>
                                Register as Teacher
                            </Link>
                            <Link to="/student/register" style={{ padding: '10px 20px', background: '#f1f5f9', color: '#1e293b', textDecoration: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '14px' }}>
                                Register as Student
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
