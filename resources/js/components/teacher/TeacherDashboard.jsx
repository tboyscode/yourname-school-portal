import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const TeacherDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [topics, setTopics] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [file, setFile] = useState(null);
    const [filters, setFilters] = useState({ class: '', term: '', search: '' });
    const [form, setForm] = useState({ subject_id: '', title: '', content: '', class: 'SS2', term: 'First Term' });

    useEffect(() => { loadData(); }, [filters]);

    const loadData = () => {
        const params = {};
        if (filters.class) params.class = filters.class;
        if (filters.term) params.term = filters.term;
        if (filters.search) params.search = filters.search;
        api.get('/topics', { params }).then(r => setTopics(r.data.data || []));
        api.get('/subjects').then(r => setSubjects(r.data || [])).catch(() => { });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('subject_id', form.subject_id);
        formData.append('title', form.title);
        formData.append('content', form.content);
        formData.append('class', form.class);
        formData.append('term', form.term);
        if (file) formData.append('file', file);

        if (editing) {
            formData.append('_method', 'PUT');
            await api.post('/topics/' + editing.id, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        } else {
            await api.post('/topics', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        }

        setShowForm(false); setEditing(null); setFile(null);
        setForm({ subject_id: '', title: '', content: '', class: 'SS2', term: 'First Term' });
        loadData();
    };

    const editTopic = (topic) => {
        setEditing(topic);
        setForm({ subject_id: topic.subject_id, title: topic.title, content: topic.content, class: topic.class, term: topic.term });
        setFile(null);
        setShowForm(true);
    };

    const deleteTopic = async (id) => {
        if (window.confirm('Delete this topic?')) {
            await api.delete('/topics/' + id);
            loadData();
        }
    };

    const handleLogout = async () => { await logout(); navigate('/login'); };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <div style={{ width: '250px', background: '#1e293b', color: 'white', padding: '20px', position: 'fixed', left: 0, top: 0, height: '100vh' }}>
                <h2 style={{ fontSize: '20px', marginBottom: '30px', paddingBottom: '15px', borderBottom: '2px solid #334155' }}>🏫 Teacher Portal</h2>
                <p style={{ color: '#cbd5e1', marginBottom: '20px' }}>Welcome, {user?.name}</p>
                <div onClick={handleLogout} style={{ position: 'absolute', bottom: '20px', color: '#ef4444', cursor: 'pointer', padding: '12px 15px', borderRadius: '8px' }}>
                    🚪 Logout
                </div>
            </div>

            {/* Main Content */}
            <div style={{ marginLeft: '250px', padding: '30px', flex: 1, background: '#f1f5f9', minHeight: '100vh' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <div>
                        <h1 style={{ fontSize: '28px', color: '#1e293b' }}>My Topics</h1>
                        <p style={{ color: '#64748b' }}>Manage your lesson notes</p>
                    </div>
                    <button onClick={() => { setShowForm(!showForm); setEditing(null); setFile(null); setForm({ subject_id: '', title: '', content: '', class: 'SS2', term: 'First Term' }); }}
                        style={{ padding: '12px 24px', background: showForm ? '#64748b' : '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '15px' }}>
                        {showForm ? 'Cancel' : '+ Create Topic'}
                    </button>
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', flexWrap: 'wrap' }}>
                    <select value={filters.class} onChange={e => setFilters({ ...filters, class: e.target.value })}
                        style={{ padding: '10px 15px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', background: 'white' }}>
                        <option value="">All Classes</option>
                        <option>JSS1</option><option>JSS2</option><option>JSS3</option>
                        <option>SS1</option><option>SS2</option><option>SS3</option>
                    </select>
                    <select value={filters.term} onChange={e => setFilters({ ...filters, term: e.target.value })}
                        style={{ padding: '10px 15px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', background: 'white' }}>
                        <option value="">All Terms</option>
                        <option>First Term</option><option>Second Term</option><option>Third Term</option>
                    </select>
                    <input placeholder="Search topics..." value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })}
                        style={{ padding: '10px 15px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', flex: '1', minWidth: '200px' }} />
                </div>

                {/* Create/Edit Form */}
                {showForm && (
                    <form onSubmit={handleSubmit} style={{ background: 'white', padding: '25px', borderRadius: '12px', marginBottom: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                            <div>
                                <label style={labelStyle}>Subject</label>
                                <select value={form.subject_id} onChange={e => setForm({ ...form, subject_id: e.target.value })} style={inputStyle} required>
                                    <option value="">Select Subject</option>
                                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.department})</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Title</label>
                                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} placeholder="Topic title" required />
                            </div>
                            <div>
                                <label style={labelStyle}>Class</label>
                                <select value={form.class} onChange={e => setForm({ ...form, class: e.target.value })} style={inputStyle}>
                                    <option>JSS1</option><option>JSS2</option><option>JSS3</option>
                                    <option>SS1</option><option>SS2</option><option>SS3</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Term</label>
                                <select value={form.term} onChange={e => setForm({ ...form, term: e.target.value })} style={inputStyle}>
                                    <option>First Term</option><option>Second Term</option><option>Third Term</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={labelStyle}>Content</label>
                            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                                style={{ ...inputStyle, minHeight: '150px' }} placeholder="Write your lesson notes here..." required />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={labelStyle}>Attachment (PDF, DOC, Images - Max 10MB)</label>
                            <input type="file" onChange={handleFileChange}
                                style={{ width: '100%', padding: '10px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', background: 'white' }} />
                            {editing && editing.file_name && <p style={{ fontSize: '12px', color: '#64748b', marginTop: '5px' }}>Current file: {editing.file_name}</p>}
                        </div>
                        <button type="submit" style={{ padding: '12px 30px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '15px' }}>
                            {editing ? 'Update Topic' : 'Save Topic'}
                        </button>
                    </form>
                )}

                {/* Topics List */}
                <div style={{ display: 'grid', gap: '15px' }}>
                    {topics.map(topic => (
                        <div key={topic.id} style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ marginBottom: '8px', color: '#1e293b' }}>{topic.title}</h3>
                                    <p style={{ color: '#64748b', marginBottom: '10px', lineHeight: '1.6' }}>
                                        {topic.content?.substring(0, 200)}{topic.content?.length > 200 ? '...' : ''}
                                    </p>
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                                        <span style={tag}>{topic.subject?.name}</span>
                                        <span style={tag}>{topic.class}</span>
                                        <span style={tag}>{topic.term}</span>
                                        {topic.file_path && (
                                            <a href={`http://127.0.0.1:8000/storage/${topic.file_path}`} target="_blank"
                                                style={{ padding: '4px 10px', background: '#e0e7ff', color: '#3730a3', borderRadius: '20px', fontSize: '12px', fontWeight: '600', textDecoration: 'none' }}>
                                                📎 {topic.file_name}
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => editTopic(topic)} style={actionBtn('#3b82f6')}>Edit</button>
                                    <button onClick={() => deleteTopic(topic.id)} style={actionBtn('#ef4444')}>Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {topics.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                            <p style={{ fontSize: '48px', marginBottom: '15px' }}>📝</p>
                            <p style={{ fontSize: '18px' }}>No topics yet. Create your first topic!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' };
const inputStyle = { width: '100%', padding: '12px 15px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' };
const actionBtn = (bg) => ({ padding: '8px 16px', background: bg, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' });
const tag = { padding: '4px 10px', background: '#e2e8f0', color: '#475569', borderRadius: '20px', fontSize: '12px', fontWeight: '600' };

export default TeacherDashboard;