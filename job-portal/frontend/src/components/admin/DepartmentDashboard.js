import React, { useState, useEffect } from 'react';
import DepartmentSidebar from './DepartmentSidebar';
import DepartmentNavbar from './DepartmentNavbar';
import StatCard from './StatCard';
import { authService } from '../../services/authService';
import Loader from '../common/Loader';
import { useResponsive } from '../../hooks/useResponsive';
import { 
    Briefcase, 
    Users, 
    FileText, 
    BookOpen, 
    Activity, 
    Building2,
    Calendar
} from 'lucide-react';

const DepartmentDashboard = () => {
    const { isMobile, isTablet, isCompact } = useResponsive();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const data = await authService.getDepartmentDashboardData();
            setDashboardData(data);
        } catch (err) {
            setError('Failed to load dashboard data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;

    if (error) {
        return (
            <div style={styles.errorContainer}>
                <p style={styles.errorText}>{error}</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <DepartmentSidebar />
            <div style={{ ...styles.mainContent, ...(isCompact ? { marginLeft: 0 } : {}) }}>
                <DepartmentNavbar />
                <div style={{ ...styles.content, ...(isMobile ? { padding: '90px 16px 32px 16px' } : {}) }}>
                    {/* Welcome Section */}
                    <header style={{ ...styles.welcomeSection, ...(isMobile ? { flexDirection: 'column', alignItems: 'flex-start', gap: '12px' } : {}) }}>
                        <div style={styles.welcomeTextContent}>
                            <h1 style={styles.welcomeTitle}>
                                System Intelligence: {dashboardData?.department_info?.name}
                            </h1>
                            <p style={styles.welcomeSubtitle}>
                                {dashboardData?.department_info?.tagline || 'Real-time operational metrics'}
                            </p>
                        </div>
                        <div style={styles.dateBadge}>
                            <Calendar size={14} color="#6366f1" />
                            <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                    </header>

                    {/* Stats Grid */}
                    <div style={{ ...styles.statsGrid, ...(isMobile ? { gridTemplateColumns: '1fr' } : isTablet ? { gridTemplateColumns: 'repeat(2, 1fr)' } : {}) }}>
                        <StatCard
                            title="Total Jobs"
                            value={dashboardData?.total_counts?.jobs || 0}
                            icon={<Briefcase size={18} color="#10b981" />}
                            isDark={true}
                        />
                        <StatCard
                            title="Applications"
                            value={dashboardData?.total_counts?.applications || 0}
                            icon={<FileText size={18} color="#f472b6" />}
                            isDark={true}
                        />
                        <StatCard
                            title="Department Staff"
                            value={dashboardData?.total_counts?.employees || 0}
                            icon={<Users size={18} color="#818cf8" />}
                            isDark={true}
                        />
                        <StatCard
                            title="Test Chapters"
                            value={dashboardData?.total_counts?.chapters || 0}
                            icon={<BookOpen size={18} color="#fbbf24" />}
                            isDark={true}
                        />
                    </div>

                    <div style={{ ...styles.mainGrid, ...(isCompact ? { gridTemplateColumns: '1fr' } : {}) }}>
                        {/* Left Column */}
                        <div style={styles.leftCol}>
                            <section style={styles.obsidianCard}>
                                <div style={styles.cardHeader}>
                                    <div style={styles.titleWithIcon}>
                                        <Activity size={18} color="#6366f1" />
                                        <h3 style={styles.cardTitle}>Performance Metrics</h3>
                                    </div>
                                </div>
                                <div style={styles.metricsRow}>
                                    <div style={styles.statBox}>
                                        <span style={styles.miniLabel}>Active Openings</span>
                                        <span style={styles.miniVal}>{dashboardData?.total_counts?.active_jobs || 0}</span>
                                    </div>
                                    <div style={styles.statBox}>
                                        <span style={styles.miniLabel}>Closed Positions</span>
                                        <span style={styles.miniVal}>{dashboardData?.total_counts?.closed_jobs || 0}</span>
                                    </div>
                                </div>
                            </section>

                            <section style={styles.obsidianCard}>
                                <div style={styles.cardHeader}>
                                    <h3 style={styles.cardTitle}>Top Jobs by Applications</h3>
                                </div>
                                <div style={styles.tableWrapper}>
                                    {dashboardData?.top_jobs_by_applications?.length > 0 ? (
                                        <table style={styles.table}>
                                            <thead>
                                                <tr>
                                                    <th style={styles.tableHeader}>Job Title</th>
                                                    <th style={{...styles.tableHeader, textAlign: 'right'}}>Volume</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dashboardData.top_jobs_by_applications.map((job) => (
                                                    <tr key={job.id} style={styles.tableRow}>
                                                        <td style={styles.tableCell}>{job.title}</td>
                                                        <td style={{...styles.tableCell, textAlign: 'right'}}>
                                                            <span style={styles.badge}>{job.application_count}</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p style={styles.noData}>No data available</p>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Right Column */}
                        <div style={styles.rightCol}>
                            <aside style={styles.obsidianCard}>
                                <div style={styles.cardHeader}>
                                    <div style={styles.titleWithIcon}>
                                        <Activity size={18} color="#f472b6" />
                                        <h3 style={styles.cardTitle}>Recent Activity</h3>
                                    </div>
                                </div>
                                <div style={styles.activityList}>
                                    {dashboardData?.recent_activities?.length > 0 ? (
                                        dashboardData.recent_activities.map((activity) => (
                                            <div key={activity.id} style={styles.activityItem}>
                                                <div style={styles.activityIndicator}></div>
                                                <div style={styles.activityContent}>
                                                    <p style={styles.activityText}>
                                                        <strong>{activity.action}</strong>
                                                        <span style={styles.activityDetails}>{activity.details && ` ${activity.details}`}</span>
                                                    </p>
                                                    <p style={styles.activityTime}>
                                                        {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p style={styles.noData}>No recent activity</p>
                                    )}
                                </div>
                            </aside>

                            <aside style={styles.midnightCard}>
                                <div style={styles.cardHeader}>
                                    <div style={styles.titleWithIcon}>
                                        <Building2 size={18} color="#fbbf24" />
                                        <h3 style={styles.cardTitle}>Organization</h3>
                                    </div>
                                </div>
                                <div style={styles.infoList}>
                                    <div style={styles.infoRow}>
                                        <span style={styles.infoLabel}>Entity</span>
                                        <span style={styles.infoValue}>{dashboardData?.department_info?.name}</span>
                                    </div>
                                    <div style={styles.infoRow}>
                                        <span style={styles.infoLabel}>Leadership</span>
                                        <span style={styles.infoValue}>{dashboardData?.department_info?.ceo_name}</span>
                                    </div>
                                    <div style={styles.infoRow}>
                                        <span style={styles.infoLabel}>Contact</span>
                                        <span style={styles.infoValue}>{dashboardData?.department_info?.email}</span>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        backgroundColor: '#020617', // Deepest dark navy
        minHeight: '100vh',
    },
    mainContent: {
        minWidth: 0,
        marginLeft: '280px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        padding: '100px 40px 40px 40px',
    },
    welcomeSection: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
    },
    welcomeTitle: {
        fontSize: '26px',
        fontWeight: '800',
        color: '#f8fafc',
        margin: 0,
        letterSpacing: '-0.5px',
    },
    welcomeSubtitle: {
        color: '#64748b',
        fontSize: '14px',
        margin: '4px 0 0 0',
    },
    dateBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#0f172a',
        border: '1px solid #1e293b',
        padding: '10px 16px',
        borderRadius: '10px',
        color: '#f8fafc',
        fontSize: '13px',
        fontWeight: '600',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        marginBottom: '32px',
    },
    mainGrid: {
        display: 'grid',
        gridTemplateColumns: '1.7fr 1.3fr',
        gap: '24px',
    },
    leftCol: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
    },
    rightCol: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
    },
    obsidianCard: {
        backgroundColor: '#0f172a', 
        borderRadius: '16px',
        padding: '30px',
        border: '1px solid #1e293b',
    },
    midnightCard: {
        backgroundColor: '#020617',
        borderRadius: '16px',
        padding: '30px',
        border: '1px solid #1e293b',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
    },
    titleWithIcon: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    cardTitle: {
        fontSize: '14px',
        fontWeight: '700',
        color: '#f1f5f9',
        margin: 0,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    metricsRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
    },
    statBox: {
        backgroundColor: '#020617',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid #1e293b',
    },
    miniLabel: {
        display: 'block',
        fontSize: '11px',
        color: '#64748b',
        marginBottom: '8px',
        textTransform: 'uppercase',
    },
    miniVal: {
        fontSize: '24px',
        fontWeight: '800',
        color: 'white',
    },
    tableWrapper: {
        marginTop: '8px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    tableHeader: {
        textAlign: 'left',
        padding: '12px 0',
        fontSize: '12px',
        color: '#64748b',
        textTransform: 'uppercase',
        borderBottom: '1px solid #1e293b',
    },
    tableCell: {
        padding: '16px 0',
        fontSize: '14px',
        color: '#cbd5e1',
        borderBottom: '1px solid #1e293b',
    },
    badge: {
        backgroundColor: '#1e293b',
        color: '#818cf8',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '700',
        border: '1px solid #312e81',
    },
    activityList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
    },
    activityItem: {
        display: 'flex',
        gap: '16px',
    },
    activityIndicator: {
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: '#6366f1',
        marginTop: '7px',
        boxShadow: '0 0 10px rgba(99, 102, 241, 0.4)',
    },
    activityText: {
        margin: 0,
        fontSize: '13.5px',
        color: '#cbd5e1',
        lineHeight: '1.5',
    },
    activityTime: {
        margin: '4px 0 0 0',
        fontSize: '11px',
        color: '#475569',
    },
    infoList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    infoRow: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    infoLabel: {
        fontSize: '10px',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    infoValue: {
        fontSize: '14px',
        color: '#f1f5f9',
        fontWeight: '500',
    },
    noData: {
        color: '#475569',
        fontSize: '13px',
        textAlign: 'center',
        padding: '20px',
    },
    errorContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#020617',
    },
    errorText: {
        color: '#ef4444',
        backgroundColor: '#0f172a',
        padding: '16px 24px',
        borderRadius: '12px',
        border: '1px solid #dc2626',
    },
};

export default DepartmentDashboard;