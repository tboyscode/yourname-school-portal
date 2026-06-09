import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [topics, setTopics] = useState([]);
    const [term, setTerm] = useState('');

    useEffect(() => { api.get('/student/subjects').then(r => setSubjects(r.data)).catch(() => {}); }, []);

    const loadTopics = async (subjectId) => {
        setSelectedSubject(subjectId);
        const params = subjectId ? '?subject_id=' + subjectId : '';
        const termParam = term ? (params ? '&term=' + term : '?term=' + term) : '';
        const r = await api.get('/student/topics' + params + termParam);
        setTopics(r.data.data || []);
    };

    const handleLogout = async () => { await logout(); navigate('/login'); };

    const subjectColors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1', '#14b8a6'];

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <div style={{ width: '250px', background: '#1e293b', color: 'white', padding: '20px', position: 'fixed', left: 0, top: 0, height: '100vh' }}>
                <h2 style={{ fontSize: '20px', marginBottom: '30px', paddingBottom: '15px', borderBottom: '2px solid #334155' }}>🎓 Student Portal</h2>
                <p style={{ color: '#cbd5e1', marginBottom: '5px' }}>Welcome, {user?.name}</p>
                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>{user?.class} • {user?.department}</p>
                <div onClick={handleLogout} style={{ position: 'absolute', bottom: '20px', color: '#ef4444', cursor: 'pointer', padding: '12px 15px', borderRadius: '8px' }}>
                    🚪 Logout
                </div>
            </div>

            <div style={{ marginLeft: '250px', padding: '30px', flex: 1, background: '#f1f5f9', minHeight: '100vh' }}>
                <div style={{ marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '28px', color: '#1e293b' }}>My Subjects</h1>
                    <p style={{ color: '#64748b' }}>Select a subject to view topics</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
                    {subjects.map((subject, i) => (
                        <div key={subject.id} onClick={() => loadTopics(subject.id)}
                            style={{ background: selectedSubject === subject.id ? subjectColors[i % subjectColors.length] : 'white', 
                                color: selectedSubject === subject.id ? 'white' : '#1e293b',
                                padding: '25px 20px', borderRadius: '12px', cursor: 'pointer', textAlign: 'center',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)', transition: '0.3s', minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <p style={{ fontSize: '32px', marginBottom: '10px' }}>📚</p>
                            <h3 style={{ fontSize: '16px', marginBottom: '5px' }}>{subject.name}</h3>
                            <small style={{ opacity: 0.8 }}>{subject.department}</small>
                        </div>
                    ))}
                </div>

                {selectedSubject && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '22px', color: '#1e293b' }}>
                                Topics ({topics.length})
                            </h2>
                            <select value={term} onChange={e => { setTerm(e.target.value); loadTopics(selectedSubject); }}
                                style={{ padding: '10px 15px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', background: 'white' }}>
                                <option value="">All Terms</option>
                                <option>First Term</option>
                                <option>Second Term</option>
                                <option>Third Term</option>
                            </select>
                        </div>

                        {topics.map(topic => (
                            <div key={topic.id} style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '15px' }}>
                                <h3 style={{ marginBottom: '8px', color: '#1e293b' }}>{topic.title}</h3>
                                <p style={{ color: '#475569', lineHeight: '1.7', marginBottom: '12px' }}>{topic.content}</p>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    <span style={{ padding: '4px 10px', background: '#e0e7ff', color: '#3730a3', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                                        👨‍🏫 {topic.teacher?.name || 'Teacher'}
                                    </span>
                                    <span style={{ padding: '4px 10px', background: '#d1fae5', color: '#065f46', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                                        {topic.subject?.name}
                                    </span>
                                    <span style={{ padding: '4px 10px', background: '#fef3c7', color: '#92400e', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                                        📅 {topic.term}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {topics.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b', background: 'white', borderRadius: '12px' }}>
                                <p style={{ fontSize: '48px', marginBottom: '15px' }}>📖</p>
                                <p style={{ fontSize: '18px' }}>No topics available for this subject yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
