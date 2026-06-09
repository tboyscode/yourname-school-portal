import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/auth/Login';
import StudentRegister from './components/auth/StudentRegister';
import TeacherRegister from './components/auth/TeacherRegister';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import StudentDashboard from './components/student/StudentDashboard';
import AdminDashboard from './components/admin/AdminDashboard';

const ProtectedRoute = ({ children, roles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '20px' }}>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/student/register" element={<StudentRegister />} />
                    <Route path="/teacher/register" element={<TeacherRegister />} />

                    <Route path="/teacher/dashboard" element={
                        <ProtectedRoute roles={['teacher']}>
                            <TeacherDashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="/student/dashboard" element={
                        <ProtectedRoute roles={['student']}>
                            <StudentDashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="/admin/dashboard" element={
                        <ProtectedRoute roles={['super_admin']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};

createRoot(document.getElementById('app')).render(<App />);