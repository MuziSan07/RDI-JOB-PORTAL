import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useResponsive } from '../../hooks/useResponsive';
import NotificationBell from '../common/NotificationBell';

// Admin pages whose lists support a ?search= query.
const SEARCHABLE = ['/admin/jobs', '/admin/employees', '/admin/departments'];

const Navbar = ({ title, user }) => {
    const { isCompact, isMobile } = useResponsive();
    const navigate = useNavigate();
    const location = useLocation();
    const [term, setTerm] = useState('');

    const runSearch = () => {
        const q = term.trim();
        // Filter the current page if it's searchable, otherwise fall back to Jobs.
        const base = SEARCHABLE.find((p) => location.pathname.startsWith(p)) || '/admin/jobs';
        navigate(`${base}${q ? `?search=${encodeURIComponent(q)}` : ''}`);
    };

    const navbarStyle = {
        ...styles.navbar,
        ...(isCompact ? { left: 0, paddingLeft: 70, paddingRight: 16 } : {}),
    };
    const titleStyle = { ...styles.title, ...(isMobile ? { fontSize: 18 } : {}) };
    return (
        <div className="admin-navbar" style={navbarStyle}>
            <div style={titleStyle}>{title}</div>
            <div style={styles.actions}>
                {!isMobile && (
                    <div style={styles.searchWrap}>
                        <Search size={18} color="#a0aec0" style={{ cursor: 'pointer' }} onClick={runSearch} />
                        <input
                            type="text"
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') runSearch(); }}
                            placeholder="Search…"
                            style={styles.searchInput}
                        />
                    </div>
                )}
                <NotificationBell buttonStyle={styles.notificationBtn} iconColor="#a0aec0" iconSize={20} theme="dark" />
                
                {/* User Avatar */}
                {user?.profile_picture ? (
                    <img src={user.profile_picture} alt="" style={styles.avatar} />
                ) : (
                    <div style={styles.avatarPlaceholder}>
                        {user?.username?.charAt(0).toUpperCase() || 'A'}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    navbar: {
        height: '72px',
        backgroundColor: '#1a202c',
        borderBottom: '1px solid #2d3748',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        position: 'fixed', // Fixed position
        top: 0,
        left: '280px', // Starts exactly where sidebar ends
        right: 0, // Extends to the right edge
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    title: {
        fontSize: '24px',
        fontWeight: '700',
        color: 'white',
    },
    actions: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    searchWrap: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: '#2d3748',
        border: '1px solid #2d3748',
        borderRadius: '8px',
        padding: '9px 14px',
        width: '260px',
    },
    searchInput: {
        border: 'none',
        background: 'transparent',
        outline: 'none',
        fontSize: '14px',
        color: '#f8fafc',
        width: '100%',
    },
    notificationBtn: {
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        border: '1px solid #2d3748',
        backgroundColor: '#2d3748',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: '#a0aec0',
        position: 'relative',
        transition: 'all 0.2s',
    },
    badge: {
        position: 'absolute',
        top: '-4px',
        right: '-4px',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '11px',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid #1a202c',
    },
    avatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '2px solid #2d3748',
        cursor: 'pointer',
    },
    avatarPlaceholder: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: '700',
        fontSize: '16px',
        border: '2px solid #2d3748',
        cursor: 'pointer',
    },
};

const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .admin-navbar button:hover {
        background-color: #4a5568 !important;
        border-color: #4a5568 !important;
        color: white !important;
    }
`;
document.head.appendChild(styleSheet);

export default Navbar;
