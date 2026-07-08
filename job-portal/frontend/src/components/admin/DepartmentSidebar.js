import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  BookOpen,
  HelpCircle,
  Users,
  History,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useResponsive } from '../../hooks/useResponsive';

const DepartmentSidebar = () => {
    const navigate = useNavigate();
    const { isCompact } = useResponsive();
    const [open, setOpen] = useState(false);

    const menuItems = [
        { path: '/department/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/department/jobs', label: 'Jobs', icon: <Briefcase size={20} /> },
        { path: '/department/chapters', label: 'Chapters', icon: <BookOpen size={20} /> },
        { path: '/department/questions', label: 'Questions', icon: <HelpCircle size={20} /> },
        { path: '/department/applicants', label: 'Applicants', icon: <Users size={20} /> },
        { path: '/department/employees', label: 'Employees', icon: <Users size={20} /> },
        { path: '/department/activity-logs', label: 'Activity', icon: <History size={20} /> },
        { path: '/department/settings', label: 'Settings', icon: <Settings size={20} /> },
    ];

    const handleLogout = () => {
        // Clear token/auth logic
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');
        
        // Redirect to admin login
        navigate('/admin/login');
    };

    const sidebarStyle = {
        ...styles.sidebar,
        ...(isCompact
            ? {
                  zIndex: 250,
                  transform: open ? 'translateX(0)' : 'translateX(-100%)',
                  transition: 'transform 0.25s ease',
                  boxShadow: open ? '4px 0 24px rgba(0,0,0,0.5)' : 'none',
              }
            : {}),
    };

    return (
        <>
            {isCompact && !open && (
                <button aria-label="Open menu" onClick={() => setOpen(true)} style={styles.hamburger}>
                    <Menu size={22} />
                </button>
            )}
            {isCompact && open && (
                <div style={styles.overlay} onClick={() => setOpen(false)} />
            )}
        <aside style={sidebarStyle}>
            {isCompact && (
                <button aria-label="Close menu" onClick={() => setOpen(false)} style={styles.closeBtn}>
                    <X size={20} />
                </button>
            )}
            <div style={styles.brandSection}>
                <div style={styles.logoBadge}>RD</div>
                <div>
                    <h1 style={styles.brandName}>RDI</h1>
                    <p style={styles.brandSubtitle}>Department Portal</p>
                </div>
            </div>

            <div style={styles.navContainer}>
                <p style={styles.sectionLabel}>Main Menu</p>
                <nav style={styles.nav}>
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className="sidebar-link"
                            onClick={() => { if (isCompact) setOpen(false); }}
                            style={({ isActive }) => ({
                                ...styles.menuItem,
                                ...(isActive ? styles.menuItemActive : {}),
                            })}
                        >
                            <span className="icon-wrapper">{item.icon}</span>
                            <span style={styles.menuLabel}>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div style={styles.footer}>
                <button 
                    onClick={handleLogout}
                    className="logout-button"
                    style={styles.logoutBtn}
                >
                    <LogOut size={18} />
                    <span style={styles.menuLabel}>Sign Out</span>
                </button>
                <div style={styles.versionInfo}>
                    <p style={styles.footerText}>v1.0.4 Premium</p>
                </div>
            </div>
        </aside>
        </>
    );
};

const styles = {
    sidebar: {
        width: '280px',
        backgroundColor: '#020617',
        color: '#f8fafc',
        height: '100vh',
        position: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        left: 0,
        top: 0,
        borderRight: '1px solid #1e293b',
        zIndex: 100,
    },
    hamburger: {
        position: 'fixed',
        top: '15px',
        left: '16px',
        zIndex: 300,
        width: '42px',
        height: '42px',
        borderRadius: '10px',
        backgroundColor: '#020617',
        border: '1px solid #1e293b',
        color: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    },
    overlay: {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 240,
    },
    closeBtn: {
        position: 'absolute',
        top: '20px',
        right: '16px',
        background: 'transparent',
        border: 'none',
        color: '#94a3b8',
        cursor: 'pointer',
        display: 'flex',
        zIndex: 2,
    },
    brandSection: {
        padding: '32px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '10px'
    },
    logoBadge: {
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '18px',
        color: 'white'
    },
    brandName: {
        margin: 0,
        fontSize: '22px',
        fontWeight: '700',
        letterSpacing: '0.5px',
        color: '#f8fafc'
    },
    brandSubtitle: {
        margin: 0,
        fontSize: '12px',
        color: '#94a3b8',
    },
    navContainer: {
        flex: 1,
        padding: '0 16px',
        overflowY: 'auto',
    },
    sectionLabel: {
        paddingLeft: '12px',
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        color: '#475569',
        fontWeight: '600',
        marginBottom: '12px'
    },
    nav: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    menuItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 14px',
        borderRadius: '10px',
        textDecoration: 'none',
        color: '#94a3b8',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    menuItemActive: {
        backgroundColor: '#0f172a',
        color: '#818cf8',
        border: '1px solid #1e293b',
    },
    menuLabel: {
        flex: 1,
    },
    footer: {
        padding: '16px',
        borderTop: '1px solid #1e293b',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    logoutBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 14px',
        borderRadius: '10px',
        backgroundColor: 'transparent',
        border: '1px solid transparent',
        color: '#94a3b8',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        width: '100%',
        textAlign: 'left'
    },
    versionInfo: {
        textAlign: 'center'
    },
    footerText: {
        margin: 0,
        fontSize: '11px',
        color: '#475569',
        fontWeight: '600'
    }
};

const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .sidebar-link:hover {
        background-color: rgba(255, 255, 255, 0.03);
        color: #f8fafc !important;
        transform: translateX(4px);
    }
    .logout-button:hover {
        background-color: rgba(239, 68, 68, 0.1) !important;
        color: #ef4444 !important;
        border: 1px solid rgba(239, 68, 68, 0.2) !important;
    }
`;
document.head.appendChild(styleSheet);

export default DepartmentSidebar;