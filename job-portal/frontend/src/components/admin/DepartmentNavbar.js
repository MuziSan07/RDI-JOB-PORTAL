import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, ChevronDown, HelpCircle, X, Mail, BookOpen } from 'lucide-react';
import { useResponsive } from '../../hooks/useResponsive';
import NotificationBell from '../common/NotificationBell';

const DepartmentNavbar = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { isCompact, isMobile } = useResponsive();
    const [searchTerm, setSearchTerm] = useState('');
    const [showHelp, setShowHelp] = useState(false);

    const runSearch = () => {
        const q = searchTerm.trim();
        // The department-wide search jumps to applicants filtered by the term.
        navigate(`/department/applicants${q ? `?search=${encodeURIComponent(q)}` : ''}`);
    };

    const navbarStyle = {
        ...styles.navbar,
        ...(isCompact ? { left: 0 } : {}),
    };
    const navContentStyle = {
        ...styles.navContent,
        ...(isCompact ? { paddingLeft: 70, paddingRight: 16 } : {}),
    };
    const searchWrapperStyle = {
        ...styles.searchWrapper,
        ...(isCompact ? { width: '100%', maxWidth: 340 } : {}),
    };

    const getInitials = (name) => {
        if (!name) return 'D';
        return name.charAt(0).toUpperCase();
    };

    const displayImage = user?.profile_picture || user?.department_logo;

    return (
        <header style={navbarStyle}>
            <div style={navContentStyle}>
                {/* Left Section: Integrated Search */}
                <div style={styles.leftSection}>
                    <div style={searchWrapperStyle}>
                        <Search size={18} color="#64748b" style={{ cursor: 'pointer' }} onClick={runSearch} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') runSearch(); }}
                            placeholder={isMobile ? 'Search applicants...' : `Search applicants in ${user?.department_name || 'Department'}...`}
                            style={styles.searchInput}
                        />
                    </div>
                </div>

                {/* Right Section: Actions & Profile */}
                <div style={styles.rightSection}>
                    {!isMobile && (
                    <div style={styles.actionGroup}>
                        <button style={styles.iconBtn} title="Help" onClick={() => setShowHelp(true)}>
                            <HelpCircle size={20} />
                        </button>
                        <NotificationBell buttonStyle={styles.iconBtn} iconColor="#94a3b8" iconSize={20} theme="dark" />
                    </div>
                    )}

                    {!isMobile && <div style={styles.verticalDivider}></div>}

                    <div style={styles.profileArea} onClick={() => navigate('/department/settings')} title="Edit profile & settings">
                        {!isMobile && <div style={styles.userText}>
                            <span style={styles.userName}>{user?.username || 'User'}</span>
                            <span style={styles.userRole}>
                                {user?.department_name || 'Department Admin'}
                            </span>
                        </div>}

                        <div style={styles.avatarContainer}>
                            {displayImage ? (
                                <img 
                                    src={displayImage} 
                                    alt="profile"
                                    style={styles.profileImg}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                            ) : null}
                            <div style={{
                                ...styles.fallbackAvatar,
                                display: displayImage ? 'none' : 'flex'
                            }}>
                                {getInitials(user?.username)}
                            </div>
                        </div>
                        <ChevronDown size={14} color="#64748b" />
                    </div>
                </div>
            </div>

            {showHelp && (
                <div style={styles.helpOverlay} onClick={() => setShowHelp(false)}>
                    <div style={styles.helpModal} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.helpHeader}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <HelpCircle size={20} color="#818cf8" />
                                <h3 style={styles.helpTitle}>Need help?</h3>
                            </div>
                            <button style={styles.helpClose} onClick={() => setShowHelp(false)}><X size={18} /></button>
                        </div>
                        <p style={styles.helpText}>Quick pointers for managing your department:</p>
                        <ul style={styles.helpList}>
                            <li><strong>Jobs</strong> — post and manage openings from the Jobs page.</li>
                            <li><strong>Applicants</strong> — review, assign tests, schedule interviews, and hire.</li>
                            <li><strong>Employees</strong> — see everyone you've hired and their details.</li>
                            <li><strong>Settings</strong> — edit your department profile and change your password.</li>
                        </ul>
                        <div style={styles.helpContactRow}>
                            <a href="mailto:hr@rdi.com" style={styles.helpContactBtn}><Mail size={15} /> Contact support</a>
                            <button style={styles.helpDocsBtn} onClick={() => { setShowHelp(false); navigate('/how-it-works'); }}><BookOpen size={15} /> How it works</button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

const styles = {
    navbar: {
        backgroundColor: '#0f172a', 
        borderBottom: '1px solid #1e293b',
        position: 'fixed',
        top: 0,
        right: 0,
        left: '280px', 
        zIndex: 100,
        height: '70px',
        color: '#f8fafc',
    },
    navContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 28px',
        height: '100%',
    },
    leftSection: {
        flex: 1,
    },
    searchWrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: '#1e293b',
        padding: '8px 16px',
        borderRadius: '10px',
        width: '340px',
        border: '1px solid #334155',
    },
    searchInput: {
        border: 'none',
        background: 'transparent',
        outline: 'none',
        fontSize: '14px',
        color: '#f8fafc',
        width: '100%',
    },
    rightSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    actionGroup: {
        display: 'flex',
        gap: '8px',
    },
    iconBtn: {
        background: 'transparent',
        border: 'none',
        color: '#94a3b8',
        cursor: 'pointer',
        padding: '8px',
        borderRadius: '8px',
        position: 'relative',
        display: 'flex',
    },
    activeDot: {
        position: 'absolute',
        top: '8px',
        right: '8px',
        width: '7px',
        height: '7px',
        backgroundColor: '#818cf8',
        borderRadius: '50%',
        border: '2px solid #0f172a',
    },
    verticalDivider: {
        width: '1px',
        height: '28px',
        backgroundColor: '#1e293b',
    },
    profileArea: {
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        cursor: 'pointer',
        padding: '6px 10px',
        borderRadius: '12px',
    },
    userText: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'right',
    },
    userName: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#f8fafc',
    },
    userRole: {
        fontSize: '11px',
        color: '#64748b',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '0.4px',
    },
    avatarContainer: {
        width: '38px',
        height: '38px',
        position: 'relative',
    },
    profileImg: {
        width: '100%',
        height: '100%',
        borderRadius: '10px',
        objectFit: 'cover',
        border: '1.5px solid #334155',
    },
    fallbackAvatar: {
        width: '100%',
        height: '100%',
        borderRadius: '10px',
        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: '700',
        fontSize: '14px',
    },

    helpOverlay: { position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 },
    helpModal: { background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: 24, width: '100%', maxWidth: 440, color: '#e2e8f0' },
    helpHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
    helpTitle: { margin: 0, fontSize: 17, fontWeight: 700, color: '#f8fafc' },
    helpClose: { background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', padding: 4 },
    helpText: { fontSize: 13.5, color: '#94a3b8', margin: '0 0 10px' },
    helpList: { margin: '0 0 20px', paddingLeft: 18, fontSize: 13.5, lineHeight: 1.9, color: '#cbd5e1' },
    helpContactRow: { display: 'flex', gap: 10, flexWrap: 'wrap' },
    helpContactBtn: { display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 16px', fontSize: 13, fontWeight: 600, color: '#fff', background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)', borderRadius: 10, textDecoration: 'none' },
    helpDocsBtn: { display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 16px', fontSize: 13, fontWeight: 600, color: '#c7d2fe', background: '#1e293b', border: '1px solid #334155', borderRadius: 10, cursor: 'pointer' },
};

export default DepartmentNavbar;