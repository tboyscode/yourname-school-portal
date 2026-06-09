import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const StudentRegister = () => {
    const [form, setForm] = useState({ name: '', username: '', password: '', password_confirmation: '', class: 'SS2', department: 'Science' });
    const [error, setError] = useState('');
    const { registerStudent } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try { await registerStudent(form); navigate('/student/dashboard'); }
        catch (err) { setError(err.response?.data?.message || 'Registration failed'); }
    };

    const inputStyle = { width: '100%', padding: '14px 16px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '15px', marginBottom: '18px', boxSizing: 'border-box' };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '440px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '28px', color: '#1e293b', marginBottom: '5px' }}>🎓 Student Registration</h1>
                    <p style={{ color: '#64748b' }}>Create your account</p>
                </div>
                {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '14px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <input style={inputStyle} placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    <input style={inputStyle} placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
                    <input style={inputStyle} type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                    <input style={inputStyle} type="password" placeholder="Confirm Password" value={form.password_confirmation} onChange={e => setForm({ ...form, password_confirmation: e.target.value })} required />
                    <select style={inputStyle} value={form.class} onChange={e => setForm({ ...form, class: e.target.value })}>
                        <option>JSS1</option><option>JSS2</option><option>JSS3</option>
                        <option>SS1</option><option>SS2</option><option>SS3</option>
                    </select>
                    <select style={inputStyle} value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}>
                        <option>Science</option><option>Art</option><option>Commercial</option>
                    </select>
                    <button type="submit" style={{ width: '100%', padding: '14px', background: '#10b981', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
                        Create Account
                    </button>
                </form>
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Link to="/login" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>Already have an account? Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default StudentRegister;
