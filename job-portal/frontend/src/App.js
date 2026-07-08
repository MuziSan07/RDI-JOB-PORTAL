import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Admin Components
import Login from './components/admin/Login';
import Dashboard from './components/admin/Dashboard';
import DepartmentDashboard from './components/admin/DepartmentDashboard';
import DepartmentJobs from './components/admin/DepartmentJobs';
import DepartmentChapters from './components/admin/DepartmentChapters';
import DepartmentQuestions from './components/admin/DepartmentQuestions';
import DepartmentApplicants from './components/admin/DepartmentApplicants';
import Departments from './components/admin/Departments';
import Jobs from './components/admin/Jobs';
import Employees from './components/admin/Employees';
import Tests from './components/admin/Tests';
import ActivityLogs from './components/admin/ActivityLogs';
import DepartmentEmployees from './components/admin/DepartmentEmployees';
import DepartmentActivityLogs from './components/admin/DepartmentActivityLogs';
import DepartmentSettings from './components/admin/DepartmentSettings';

// Job Seeker Components
import Landing from './pages/Landing';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import ForEmployers from './pages/ForEmployers';
import Contact from './pages/Contact';
import JobSeekerLogin from './pages/JobSeekerLogin';
import JobSeekerRegister from './pages/JobSeekerRegister';
import JobsBrowse from './pages/JobsBrowse';
import JobDetail from './pages/JobDetail';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import MyApplications from './pages/MyApplications';
import ApplicationDetail from './pages/ApplicationDetail';
import TakeTest from './pages/TakeTest';
import TestResults from './pages/TestResults';
import ProfilePage from './pages/ProfilePage';

// Common Components
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Public Routes - Job Seeker */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/how-it-works" element={<HowItWorks />} />
                    <Route path="/for-employers" element={<ForEmployers />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<JobSeekerLogin />} />
                    <Route path="/register" element={<JobSeekerRegister />} />
                    <Route path="/jobs" element={<JobsBrowse />} />
                    <Route path="/jobs/:id" element={<JobDetail />} />
                    
                    {/* Job Seeker Protected Routes */}
                    <Route path="/dashboard" element={<JobSeekerDashboard />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/my-applications" element={<MyApplications />} />
                    <Route path="/my-applications/:id" element={<ApplicationDetail />} />
                    <Route path="/test/:applicationId" element={<TakeTest />} />
                    <Route path="/test-results/:applicationId" element={<TestResults />} />
                    
                    {/* Admin Login */}
                    <Route path="/admin/login" element={<Login />} />
                    
                    {/* Super Admin Routes */}
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['super_admin']}>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/departments"
                        element={
                            <ProtectedRoute allowedRoles={['super_admin']}>
                                <Departments />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/jobs"
                        element={
                            <ProtectedRoute allowedRoles={['super_admin']}>
                                <Jobs />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/employees"
                        element={
                            <ProtectedRoute allowedRoles={['super_admin']}>
                                <Employees />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/tests"
                        element={
                            <ProtectedRoute allowedRoles={['super_admin']}>
                                <Tests />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/activity-logs"
                        element={
                            <ProtectedRoute allowedRoles={['super_admin']}>
                                <ActivityLogs />
                            </ProtectedRoute>
                        }
                    />
                    
                    {/* Department Routes */}
                    <Route
                        path="/department/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['department']}>
                                <DepartmentDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/department/activity-logs"
                        element={
                            <ProtectedRoute allowedRoles={['department']}>
                                <DepartmentActivityLogs />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/department/settings"
                        element={
                            <ProtectedRoute allowedRoles={['department']}>
                                <DepartmentSettings />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/department/jobs"
                        element={
                            <ProtectedRoute allowedRoles={['department']}>
                                <DepartmentJobs />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/department/chapters"
                        element={
                            <ProtectedRoute allowedRoles={['department']}>
                                <DepartmentChapters />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/department/questions"
                        element={
                            <ProtectedRoute allowedRoles={['department']}>
                                <DepartmentQuestions />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/department/applicants"
                        element={
                            <ProtectedRoute allowedRoles={['department']}>
                                <DepartmentApplicants />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/department/employees"
                        element={
                            <ProtectedRoute allowedRoles={['department']}>
                                <DepartmentEmployees />
                            </ProtectedRoute>
                        }
                    />

                    {/* 404 - Redirect to home */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;