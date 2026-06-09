import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const TeacherRegister = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { registerTeacher } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try { const res = await registerTeacher(form); setSuccess(res.message); } 
        catch (err) { setError(err.response?.data?.message || 'Registration failed'); }
    };

    if (success) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ background: 'white', borderRadius: '16px', padding: '50px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                    <p style={{ fontSize: '48px', marginBottom: '15px' }}>✅</p>
                    <h2 style={{ marginBottom: '10px', color: '#1e293b' }}>Registration Submitted!</h2>
                    <p style={{ color: '#64748b', marginBottom: '20px' }}>{success}</p>
                    <Link to="/login" style={{ padding: '12px 30px', background: '#3b82f6', color: 'white', textDecoration: 'none', borderRadius: '10px', fontWeight: '600' }}>Go to Login</Link>
                </div>
            </div>
        );
    }

    const inputStyle = { width: '100%', padding: '14px 16px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '15px', marginBottom: '18px', boxSizing: 'border-box' };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '440px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '28px', color: '#1e293b', marginBottom: '5px' }}>👨‍🏫 Teacher Registration</h1>
                    <p style={{ color: '#64748b' }}>Apply for a teaching account</p>
                </div>
                {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '14px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <input style={inputStyle} placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                    <input style={inputStyle} type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                    <input style={inputStyle} type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
                    <input style={inputStyle} type="password" placeholder="Confirm Password" value={form.password_confirmation} onChange={e => setForm({...form, password_confirmation: e.target.value})} required />
                    <button type="submit" style={{ width: '100%', padding: '14px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
                        Submit Application
                    </button>
                </form>
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Link to="/login" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>Already have an account? Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default TeacherRegister;
