import React from 'react';
import { useResponsive } from '../../hooks/useResponsive';

const StatCard = ({ title, value, icon, color, subtext }) => {
    const { isMobile } = useResponsive();
    return (
        <div style={{ ...styles.card, ...(isMobile ? { padding: '18px' } : {}) }}>
            <div style={styles.cardContent}>
                <div style={styles.leftSection}>
                    <p style={styles.title}>{title}</p>
                    <h3 style={{ ...styles.value, ...(isMobile ? { fontSize: '24px' } : {}) }}>{value}</h3>
                    {subtext && <p style={styles.subtext}>{subtext}</p>}
                </div>
                {/* icon container now uses a soft transparent version of your theme colors */}
                <div style={{ 
                    ...styles.iconContainer, 
                    backgroundColor: `${color}22`, // 22 adds transparency
                    border: `1px solid ${color}44` 
                }}>
                    <span style={styles.icon}>{icon}</span>
                </div>
            </div>
        </div>
    );
};

const styles = {
    card: {
        backgroundColor: '#0f172a', // matches your dark sidebar/navbar exactly
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #1e293b', // subtle border for depth
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    cardContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leftSection: {
        flex: 1,
    },
    title: {
        margin: '0 0 8px 0',
        fontSize: '13px',
        color: '#94a3b8', // muted slate text
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    value: {
        margin: '0 0 4px 0',
        fontSize: '32px',
        fontWeight: '800',
        color: '#f8fafc', // crisp white/slate text
        letterSpacing: '-0.02em',
    },
    subtext: {
        margin: 0,
        fontSize: '12px',
        color: '#64748b', // darker slate for secondary info
    },
    iconContainer: {
        width: '54px',
        height: '54px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
};

// updated hover effect for dark theme
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    div[style*="background-color: rgb(15, 23, 42)"]:hover {
        transform: translateY(-5px);
        border-color: #334155 !important;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
        background-color: #1e293b !important;
    }
`;
document.head.appendChild(styleSheet);

export default StatCard;