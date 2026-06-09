import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [stats, setStats] = useState({});
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [topics, setTopics] = useState([]);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', department: 'General', description: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [userSearch, setUserSearch] = useState('');
    const [studentClass, setStudentClass] = useState('');
    const [studentDept, setStudentDept] = useState('');

    useEffect(() => { loadAll(); }, [studentClass, studentDept]);

    const loadAll = () => {
        api.get('/admin/dashboard').then(r => setStats(r.data)).catch(() => { });
        api.get('/admin/teachers').then(r => setTeachers(r.data.data || [])).catch(() => { });

        // Students with filters
        const studentParams = {};
        if (studentClass) studentParams.class = studentClass;
        if (studentDept) studentParams.department = studentDept;
        api.get('/admin/students', { params: studentParams }).then(r => setStudents(r.data.data || [])).catch(() => { });

        api.get('/admin/subjects').then(r => setSubjects(r.data || [])).catch(() => { });
        api.get('/topics').then(r => setTopics(r.data.data || [])).catch(() => { });
    };

    const handleLogout = async () => { await logout(); navigate('/login'); };
    const approveTeacher = async (id) => { await api.put('/admin/teachers/' + id + '/approve'); loadAll(); };
    const toggleUserStatus = async (id, status) => { await api.put('/admin/users/' + id, { status }); loadAll(); };
    const deleteUser = async (id) => { if (window.confirm('Delete this user?')) { await api.delete('/admin/users/' + id); loadAll(); } };

    const handleSubjectSubmit = async (e) => {
        e.preventDefault();
        editing ? await api.put('/admin/subjects/' + editing.id, form) : await api.post('/admin/subjects', form);
        setShowForm(false); setEditing(null); setForm({ name: '', department: 'General', description: '' }); loadAll();
    };

    const editSubject = (s) => { setEditing(s); setForm({ name: s.name, department: s.department, description: s.description || '' }); setShowForm(true); };
    const deleteSubject = async (id) => { if (window.confirm('Delete this subject?')) { await api.delete('/admin/subjects/' + id); loadAll(); } };
    const deleteTopic = async (id) => { if (window.confirm('Delete this topic?')) { await api.delete('/topics/' + id); loadAll(); } };

    const filteredTeachers = teachers.filter(t => !userSearch || t.name.toLowerCase().includes(userSearch.toLowerCase()) || t.email.toLowerCase().includes(userSearch.toLowerCase()));
    const filteredStudents = students.filter(s => !userSearch || s.name.toLowerCase().includes(userSearch.toLowerCase()) || s.username.toLowerCase().includes(userSearch.toLowerCase()));
    const filteredTopics = topics.filter(t => !searchTerm || t.title.toLowerCase().includes(searchTerm.toLowerCase()));

    const menuItems = [
        { id: 'dashboard', label: '📊 Dashboard' },
        { id: 'teachers', label: '👨‍🏫 Teachers' },
        { id: 'students', label: '🎓 Students' },
        { id: 'subjects', label: '📚 Subjects' },
        { id: 'topics', label: '📝 All Topics' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Mobile Menu Button */}
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{ display: 'none', position: 'fixed', top: '10px', left: '10px', zIndex: 1000, padding: '10px 12px', background: '#1e293b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '18px' }}
                className="mobile-menu-btn">
                ☰
            </button>
            {/* Sidebar */}
            <div className={`sidebar ${sidebarOpen ? 'open' : ''}`} style={{ width: '250px', background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)', color: 'white', padding: '20px', position: 'fixed', left: 0, top: 0, height: '100vh', overflow: 'auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                    <p style={{ fontSize: '32px', marginBottom: '8px' }}>🏫</p>
                    <h2 style={{ fontSize: '18px', fontWeight: '700' }}>School Portal</h2>
                    <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '5px' }}>Admin Panel</p>
                </div>
                {menuItems.map(item => (
                    <div key={item.id} onClick={() => { setActiveTab(item.id); setUserSearch(''); setSearchTerm(''); }}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 15px', cursor: 'pointer', borderRadius: '10px', marginBottom: '5px',
                            background: activeTab === item.id ? 'rgba(59,130,246,0.2)' : 'transparent', color: activeTab === item.id ? '#60a5fa' : '#cbd5e1',
                            fontWeight: activeTab === item.id ? '600' : '400', transition: '0.2s'
                        }}>
                        {item.label}
                    </div>
                ))}
                <div onClick={handleLogout} class='logout-btn' style={{ position: 'absolute', bottom: '60px', left: '20px', right: '20px', padding: '12px', textAlign: 'center', background: 'rgba(239,68,68,0.1)', color: '#f87171', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>
                    🚪 Logout
                </div>
            </div>

            {/* Main Content */}
            <div style={{ marginLeft: '250px', padding: '30px', flex: 1, background: '#f8fafc', minHeight: '100vh' }}>
                <div style={{ marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '28px', color: '#0f172a', fontWeight: '700' }}>{menuItems.find(m => m.id === activeTab)?.label}</h1>
                    <p style={{ color: '#64748b' }}>Welcome back, {user?.name}</p>
                </div>

                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                    <div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
                            {[
                                { label: 'Total Teachers', value: stats.total_teachers || 0, color: '#3b82f6', icon: '👨‍🏫', tab: 'teachers' },
                                { label: 'Total Students', value: stats.total_students || 0, color: '#10b981', icon: '🎓', tab: 'students' },
                                { label: 'Pending Approvals', value: stats.pending_teachers || 0, color: '#f59e0b', icon: '⏳', tab: 'teachers' },
                                { label: 'Total Subjects', value: stats.total_subjects || 0, color: '#8b5cf6', icon: '📚', tab: 'subjects' },
                            ].map((stat, i) => (
                                <div key={i} onClick={() => setActiveTab(stat.tab)}
                                    style={{ background: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', cursor: 'pointer', border: '1px solid #e2e8f0', transition: '0.3s' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                        <div>
                                            <p style={{ color: '#64748b', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{stat.label}</p>
                                            <p style={{ fontSize: '36px', fontWeight: '700', color: stat.color }}>{stat.value}</p>
                                        </div>
                                        <span style={{ fontSize: '28px' }}>{stat.icon}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ background: 'white', borderRadius: '16px', padding: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ marginBottom: '10px', color: '#0f172a' }}>Quick Overview</h3>
                            <p style={{ color: '#64748b', lineHeight: '1.6' }}>Manage all aspects of the school portal from this dashboard. Use the sidebar to navigate between sections.</p>
                        </div>
                    </div>
                )}

                {/* Teachers Tab */}
                {activeTab === 'teachers' && (
                    <div style={{ background: 'white', borderRadius: '16px', padding: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                            <h3 style={{ color: '#0f172a' }}>All Teachers ({filteredTeachers.length})</h3>
                            <input placeholder="🔍 Search teachers..." value={userSearch} onChange={e => setUserSearch(e.target.value)}
                                style={{ padding: '10px 15px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', width: '250px' }} />
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc' }}>
                                        <th style={thStyle}>Name</th><th style={thStyle}>Email</th><th style={thStyle}>Status</th><th style={thStyle}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTeachers.map(t => (
                                        <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={tdStyle}><strong>{t.name}</strong></td>
                                            <td style={{ ...tdStyle, color: '#64748b' }}>{t.email}</td>
                                            <td style={tdStyle}>
                                                <span style={{
                                                    padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                                                    background: t.status === 'active' ? '#d1fae5' : t.status === 'pending' ? '#fef3c7' : '#fee2e2',
                                                    color: t.status === 'active' ? '#065f46' : t.status === 'pending' ? '#92400e' : '#991b1b'
                                                }}>
                                                    {t.status}
                                                </span>
                                            </td>
                                            <td style={tdStyle}>
                                                <div style={{ display: 'flex', gap: '5px' }}>
                                                    {t.status === 'pending' && <button onClick={() => approveTeacher(t.id)} style={btnSmall('#10b981')}>Approve</button>}
                                                    {t.status === 'active' && <button onClick={() => toggleUserStatus(t.id, 'inactive')} style={btnSmall('#f59e0b')}>Deactivate</button>}
                                                    {t.status === 'inactive' && <button onClick={() => toggleUserStatus(t.id, 'active')} style={btnSmall('#10b981')}>Activate</button>}
                                                    <button onClick={() => deleteUser(t.id)} style={btnSmall('#ef4444')}>Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Students Tab */}
                {activeTab === 'students' && (
                    <div style={{ background: 'white', borderRadius: '16px', padding: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                            <h3 style={{ color: '#0f172a' }}>All Students ({filteredStudents.length})</h3>
                            <input placeholder="🔍 Search name or username..." value={userSearch} onChange={e => setUserSearch(e.target.value)}
                                style={{ padding: '10px 15px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', width: '250px' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                            <select value={studentClass} onChange={e => setStudentClass(e.target.value)}
                                style={{ padding: '10px 15px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', background: 'white' }}>
                                <option value="">All Classes</option>
                                <option>JSS1</option><option>JSS2</option><option>JSS3</option>
                                <option>SS1</option><option>SS2</option><option>SS3</option>
                            </select>
                            <select value={studentDept} onChange={e => setStudentDept(e.target.value)}
                                style={{ padding: '10px 15px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', background: 'white' }}>
                                <option value="">All Departments</option>
                                <option>Science</option><option>Art</option><option>Commercial</option>
                            </select>
                            <button onClick={() => { setStudentClass(''); setStudentDept(''); }}
                                style={{ padding: '10px 15px', background: '#64748b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
                                Clear Filters
                            </button>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc' }}>
                                        <th style={thStyle}>Name</th><th style={thStyle}>Username</th><th style={thStyle}>Class</th><th style={thStyle}>Dept</th><th style={thStyle}>Status</th><th style={thStyle}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.map(s => (
                                        <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={tdStyle}><strong>{s.name}</strong></td>
                                            <td style={{ ...tdStyle, color: '#64748b' }}>{s.username}</td>
                                            <td style={tdStyle}>{s.class}</td>
                                            <td style={tdStyle}>{s.department}</td>
                                            <td style={tdStyle}>
                                                <span style={{
                                                    padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                                                    background: s.status === 'active' ? '#d1fae5' : '#fee2e2',
                                                    color: s.status === 'active' ? '#065f46' : '#991b1b'
                                                }}>
                                                    {s.status}
                                                </span>
                                            </td>
                                            <td style={tdStyle}>
                                                {s.status === 'active'
                                                    ? <button onClick={() => toggleUserStatus(s.id, 'inactive')} style={btnSmall('#f59e0b')}>Deactivate</button>
                                                    : <button onClick={() => toggleUserStatus(s.id, 'active')} style={btnSmall('#10b981')}>Activate</button>
                                                }
                                                <button onClick={() => deleteUser(s.id)} style={btnSmall('#ef4444')}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Subjects Tab */}
                {activeTab === 'subjects' && (
                    <div style={{ background: 'white', borderRadius: '16px', padding: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ color: '#0f172a' }}>All Subjects ({subjects.length})</h3>
                            <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: '', department: 'General', description: '' }); }}
                                style={btnPrimary}>
                                {showForm ? '✕ Cancel' : '+ Add Subject'}
                            </button>
                        </div>

                        {showForm && (
                            <form onSubmit={handleSubjectSubmit} style={{ background: '#f8fafc', padding: '25px', borderRadius: '12px', marginBottom: '25px', border: '2px solid #e2e8f0' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                    <div>
                                        <label style={lbl}>Subject Name *</label>
                                        <input style={inp} placeholder="e.g. Mathematics" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                                    </div>
                                    <div>
                                        <label style={lbl}>Department *</label>
                                        <select style={inp} value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}>
                                            <option>General</option><option>Science</option><option>Art</option><option>Commercial</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={lbl}>Description</label>
                                    <textarea style={{ ...inp, minHeight: '80px' }} placeholder="Optional description..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                                </div>
                                <button type="submit" style={btnSuccess}>{editing ? 'Update Subject' : 'Save Subject'}</button>
                            </form>
                        )}

                        {['General', 'Science', 'Art', 'Commercial'].map(dept => {
                            const deptSubjects = subjects.filter(s => s.department === dept);
                            if (deptSubjects.length === 0) return null;
                            return (
                                <div key={dept} style={{ marginBottom: '20px' }}>
                                    <h4 style={{ color: '#64748b', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', paddingLeft: '5px' }}>
                                        {dept === 'General' ? '📋' : dept === 'Science' ? '🔬' : dept === 'Art' ? '🎨' : '💼'} {dept}
                                    </h4>
                                    {deptSubjects.map(s => (
                                        <div key={s.id} style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <strong>{s.name}</strong>
                                                {s.description && <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '3px' }}>{s.description}</p>}
                                            </div>
                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                <button onClick={() => editSubject(s)} style={btnSmall('#3b82f6')}>Edit</button>
                                                <button onClick={() => deleteSubject(s.id)} style={btnSmall('#ef4444')}>Delete</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Topics Tab */}
                {activeTab === 'topics' && (
                    <div style={{ background: 'white', borderRadius: '16px', padding: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                            <h3 style={{ color: '#0f172a' }}>All Topics ({filteredTopics.length})</h3>
                            <input placeholder="🔍 Search topics..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                style={{ padding: '10px 15px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', width: '250px' }} />
                        </div>
                        {filteredTopics.map(topic => (
                            <div key={topic.id} style={{ background: '#f8fafc', padding: '15px 20px', borderRadius: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <strong>{topic.title}</strong>
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '5px', flexWrap: 'wrap' }}>
                                        <span style={tag}>{topic.subject?.name}</span>
                                        <span style={tag}>{topic.class}</span>
                                        <span style={tag}>{topic.term}</span>
                                        <span style={{ ...tag, background: '#e0e7ff', color: '#3730a3' }}>By: {topic.teacher?.name}</span>
                                    </div>
                                </div>
                                <button onClick={() => deleteTopic(topic.id)} style={btnSmall('#ef4444')}>Delete</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const thStyle = { padding: '14px 15px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b', fontWeight: '600' };
const tdStyle = { padding: '14px 15px', fontSize: '14px' };
const lbl = { display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' };
const inp = { width: '100%', padding: '12px 15px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box' };
const btnPrimary = { padding: '12px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' };
const btnSuccess = { padding: '12px 24px', background: '#10b981', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' };
const btnSmall = (bg) => ({ padding: '6px 12px', background: bg, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px', marginLeft: '3px' });
const tag = { padding: '3px 8px', background: '#e2e8f0', color: '#475569', borderRadius: '15px', fontSize: '11px', fontWeight: '600' };

export default AdminDashboard;