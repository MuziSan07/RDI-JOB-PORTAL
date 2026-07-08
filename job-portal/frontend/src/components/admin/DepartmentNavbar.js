import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Search, ChevronDown, HelpCircle } from 'lucide-react';
import { useResponsive } from '../../hooks/useResponsive';

const DepartmentNavbar = () => {
    const { user } = useAuth();
    const { isCompact, isMobile } = useResponsive();

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
                        <Search size={18} color="#64748b" />
                        <input
                            type="text"
                            placeholder={isMobile ? 'Search...' : `Search in ${user?.department_name || 'Department'}...`}
                            style={styles.searchInput}
                        />
                    </div>
                </div>

                {/* Right Section: Actions & Profile */}
                <div style={styles.rightSection}>
                    {!isMobile && (
                    <div style={styles.actionGroup}>
                        <button style={styles.iconBtn} title="Help">
                            <HelpCircle size={20} />
                        </button>
                        <button style={styles.iconBtn} title="Notifications">
                            <Bell size={20} />
                            <span style={styles.activeDot}></span>
                        </button>
                    </div>
                    )}

                    {!isMobile && <div style={styles.verticalDivider}></div>}

                    <div style={styles.profileArea}>
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
};

export default DepartmentNavbar;