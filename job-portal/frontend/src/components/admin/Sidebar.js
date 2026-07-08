import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Building2,
    Briefcase,
    Users,
    FileText,
    Activity,
    LogOut,
    Menu,
    X,
} from 'lucide-react';
import { useResponsive } from '../../hooks/useResponsive';

const Sidebar = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isCompact } = useResponsive();
    const [open, setOpen] = useState(false);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: Building2, label: 'Departments', path: '/admin/departments' },
        { icon: Briefcase, label: 'Jobs', path: '/admin/jobs' },
        { icon: Users, label: 'Employees', path: '/admin/employees' },
        { icon: FileText, label: 'Tests', path: '/admin/tests' },
        { icon: Activity, label: 'Activity Logs', path: '/admin/activity-logs' },
    ];

    const isActive = (path) => location.pathname === path;

    const go = (path) => {
        navigate(path);
        if (isCompact) setOpen(false);
    };

    const handleLogout = () => {
        // Clear all stored authentication data
        localStorage.clear();
        sessionStorage.clear();

        // Call parent logout if it exists
        if (onLogout) {
            onLogout();
        }

        // Close mobile sidebar
        setOpen(false);

        // Redirect to landing page
        navigate('/', { replace: true });
    };

    const sidebarStyle = {
        ...styles.sidebar,
        ...(isCompact
            ? {
                  zIndex: 250,
                  transform: open ? 'translateX(0)' : 'translateX(-100%)',
                  transition: 'transform 0.25s ease',
                  boxShadow: open ? '4px 0 24px rgba(0,0,0,0.4)' : 'none',
              }
            : {}),
    };

    return (
        <>
            {isCompact && !open && (
                <button
                    aria-label="Open menu"
                    onClick={() => setOpen(true)}
                    style={styles.hamburger}
                >
                    <Menu size={22} />
                </button>
            )}

            {isCompact && open && (
                <div
                    style={styles.overlay}
                    onClick={() => setOpen(false)}
                />
            )}

            <div style={sidebarStyle}>
                {isCompact && (
                    <button
                        aria-label="Close menu"
                        onClick={() => setOpen(false)}
                        style={styles.closeBtn}
                    >
                        <X size={20} />
                    </button>
                )}

                {/* Logo */}
                <div style={styles.logo}>
                    <div style={styles.logoIcon}>RDI</div>
                    <span style={styles.logoText}>Admin Portal</span>
                </div>

                {/* User */}
                <div style={styles.userSection}>
                    {user?.profile_picture ? (
                        <img
                            src={user.profile_picture}
                            alt="Profile"
                            style={styles.avatar}
                        />
                    ) : (
                        <div style={styles.avatarPlaceholder}>
                            {user?.username?.charAt(0).toUpperCase() || 'A'}
                        </div>
                    )}

                    <div style={styles.userInfo}>
                        <div style={styles.userName}>
                            {user?.username || 'Admin'}
                        </div>
                        <div style={styles.userRole}>Super Admin</div>
                    </div>
                </div>

                {/* Navigation */}
                <nav style={styles.nav}>
                    {menuItems.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => go(item.path)}
                            style={{
                                ...styles.menuItem,
                                ...(isActive(item.path)
                                    ? styles.menuItemActive
                                    : {}),
                            }}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    style={styles.logoutBtn}
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </>
    );
};

const styles = {
    sidebar: {
        width: '280px',
        height: '100vh',
        backgroundColor: '#1a202c',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        overflowY: 'auto',
        borderRight: '1px solid #2d3748',
    },
    hamburger: {
        position: 'fixed',
        top: '16px',
        left: '16px',
        zIndex: 300,
        width: '42px',
        height: '42px',
        borderRadius: '10px',
        backgroundColor: '#1a202c',
        border: '1px solid #2d3748',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    },
    overlay: {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 240,
    },
    closeBtn: {
        position: 'absolute',
        top: '16px',
        right: '16px',
        background: 'transparent',
        border: 'none',
        color: '#a0aec0',
        cursor: 'pointer',
        display: 'flex',
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '32px',
        padding: '0 8px',
    },
    logoIcon: {
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: '800',
        fontSize: '16px',
    },
    logoText: {
        color: '#fff',
        fontSize: '20px',
        fontWeight: '700',
    },
    userSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px',
        backgroundColor: '#2d3748',
        borderRadius: '12px',
        marginBottom: '24px',
    },
    avatar: {
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        objectFit: 'cover',
    },
    avatarPlaceholder: {
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: '700',
        fontSize: '20px',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        color: '#fff',
        fontWeight: '600',
        fontSize: '15px',
        marginBottom: '2px',
    },
    userRole: {
        color: '#a0aec0',
        fontSize: '13px',
    },
    nav: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    menuItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '8px',
        color: '#a0aec0',
        fontSize: '15px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s',
        textAlign: 'left',
    },
    menuItemActive: {
        backgroundColor: '#2d3748',
        color: '#fff',
    },
    logoutBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        backgroundColor: 'rgba(220,53,69,0.1)',
        border: '1px solid rgba(220,53,69,0.3)',
        borderRadius: '8px',
        color: '#fc8181',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '16px',
    },
};

export default Sidebar;