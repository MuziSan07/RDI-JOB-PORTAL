import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import StatCard from './StatCard';
import { BarChart, DonutChart, LineChart } from './Charts';
import { authService } from '../../services/authService';
import Loader from '../common/Loader';
import { useResponsive } from '../../hooks/useResponsive';
import {
    Zap,
    Target,
    ArrowUpRight,
    Briefcase,
    Globe,
    Layers,
    Activity,
    PieChart,
    BarChart2,
    TrendingUp
} from 'lucide-react';

// Human-readable labels + palette for application-status donut slices
const STATUS_META = {
    applied: { label: 'Applied', color: '#818cf8' },
    test_assigned: { label: 'Test Assigned', color: '#60a5fa' },
    test_completed: { label: 'Test Completed', color: '#22d3ee' },
    test_passed: { label: 'Test Passed', color: '#34d399' },
    test_failed: { label: 'Test Failed', color: '#f87171' },
    interview_scheduled: { label: 'Interview Scheduled', color: '#fbbf24' },
    interview_completed: { label: 'Interview Done', color: '#a78bfa' },
    waiting: { label: 'Waiting', color: '#94a3b8' },
    notice_period: { label: 'Notice Period', color: '#2dd4bf' },
    hired: { label: 'Hired', color: '#4ade80' },
    rejected: { label: 'Rejected', color: '#fb7185' },
};

const Dashboard = () => {
    const { isMobile, isTablet, isCompact } = useResponsive();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const data = await authService.getDashboardData();
            setDashboardData(data);
        } catch (err) {
            console.error('sync error', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;

    // dynamic math for the fulfillment ring
    const active = dashboardData?.total_counts?.active_jobs || 0;
    const total = dashboardData?.total_counts?.jobs || 1;
    const fillRate = Math.round(((total - active) / total) * 100);

    // ── Analytics chart data (derived from the dashboard endpoint) ──
    const statusData = (dashboardData?.applications_by_status || []).map((row) => {
        const meta = STATUS_META[row.status] || { label: row.status, color: '#818cf8' };
        return { label: meta.label, value: row.count || 0, color: meta.color };
    });

    const deptData = (dashboardData?.jobs_per_department || []).map((row) => ({
        label: row.name,
        value: row.job_count || 0,
    }));

    const trendData = (dashboardData?.applications_last_7_days || []).map((row) => ({
        label: row.label,
        value: row.count || 0,
    }));

    const chartCols = isCompact ? '1fr' : 'repeat(2, 1fr)';

    return (
        <div style={styles.container}>
            <Sidebar />
            <main style={{ ...styles.mainContent, ...(isCompact ? { marginLeft: 0 } : {}) }}>
                <Navbar />

                <div style={{ ...styles.scrollArea, ...(isMobile ? { padding: '90px 16px 24px 16px' } : {}) }}>
                    <header style={{ ...styles.dashboardHeader, ...(isMobile ? { flexDirection: 'column', alignItems: 'stretch', gap: '16px', flexWrap: 'wrap' } : {}) }}>
                        <div style={styles.headerText}>
                            <h1 style={styles.welcomeText}>Console Overview</h1>
                            <p style={styles.subText}>Operational intelligence for RDI Portal</p>
                        </div>
                        <div style={styles.liveIndicator}>
                            <Activity size={14} color="#818cf8" />
                            <span style={styles.liveText}>Live Stream</span>
                        </div>
                    </header>

                    {/* highlight stats grid */}
                    <div style={{ ...styles.statsGrid, ...(isMobile ? { gridTemplateColumns: '1fr' } : isTablet ? { gridTemplateColumns: 'repeat(2, 1fr)' } : {}) }}>
                        <StatCard
                            title="Total Candidates"
                            value={dashboardData?.total_counts?.job_seekers || 0}
                            icon={<Layers size={20} color="#818cf8" />}
                            isDark={true}
                        />
                        <StatCard
                            title="Active Openings"
                            value={active}
                            icon={<Briefcase size={20} color="#34d399" />}
                            isDark={true}
                        />
                        <StatCard
                            title="Employees"
                            value={dashboardData?.total_counts?.employees || 0}
                            icon={<Globe size={20} color="#fbbf24" />}
                            isDark={true}
                        />
                        <StatCard
                            title="Monthly Traffic"
                            value={dashboardData?.recent_stats?.applications_last_30_days || 0}
                            icon={<Zap size={20} color="#f472b6" />}
                            isDark={true}
                        />
                    </div>

                    <div style={{ ...styles.bottomGrid, ...(isCompact ? { gridTemplateColumns: '1fr' } : {}) }}>
                        {/* main analysis card - dark navy */}
                        <section style={styles.mainAnalysis}>
                            <div style={styles.cardHeader}>
                                <h3 style={styles.cardTitle}>Departmental Saturation</h3>
                                <button style={styles.actionLink}>
                                    Full Audit <ArrowUpRight size={14}/>
                                </button>
                            </div>
                            <div style={styles.deptList}>
                                {dashboardData?.top_departments?.map((dept, index) => (
                                    <div key={dept.id} style={styles.deptRow}>
                                        <div style={styles.deptMeta}>
                                            <span style={styles.deptName}>{dept.name}</span>
                                            <span style={styles.deptCount}>{dept.employee_count} active</span>
                                        </div>
                                        <div style={styles.barTrack}>
                                            <div style={{
                                                ...styles.barFill, 
                                                width: `${Math.min(100, (dept.employee_count / (dashboardData?.total_counts?.employees || 1)) * 200)}%`,
                                                background: index % 2 === 0 ? 'linear-gradient(90deg, #6366f1, #818cf8)' : 'linear-gradient(90deg, #ec4899, #f472b6)'
                                            }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* fulfillment card - glass navy */}
                        <aside style={styles.sideMetric}>
                            <div style={styles.cardHeader}>
                                <h3 style={styles.cardTitle}>Goal Tracking</h3>
                                <Target size={18} color="#94a3b8" />
                            </div>
                            <div style={styles.ringContainer}>
                                <div style={styles.progressRing}>
                                    <span style={styles.ringVal}>{fillRate}%</span>
                                    <span style={styles.ringLabel}>Filled</span>
                                </div>
                                <div style={styles.miniStats}>
                                    <div style={styles.statBox}>
                                        <span style={styles.statLabel}>Total Roles</span>
                                        <span style={styles.statVal}>{total}</span>
                                    </div>
                                    <div style={styles.statBox}>
                                        <span style={styles.statLabel}>Remaining</span>
                                        <span style={styles.statVal}>{active}</span>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>

                    {/* ── Analytics ── */}
                    <section style={styles.analyticsSection}>
                        <div style={styles.analyticsHeading}>
                            <TrendingUp size={18} color="#818cf8" />
                            <h2 style={styles.analyticsTitle}>Analytics</h2>
                        </div>

                        <div style={{ ...styles.chartsGrid, gridTemplateColumns: chartCols }}>
                            <div style={styles.chartCard}>
                                <div style={styles.chartCardHead}>
                                    <PieChart size={16} color="#818cf8" />
                                    <span style={styles.chartCardTitle}>Applications by Status</span>
                                </div>
                                <DonutChart data={statusData} title="Applications by status" />
                            </div>

                            <div style={styles.chartCard}>
                                <div style={styles.chartCardHead}>
                                    <BarChart2 size={16} color="#34d399" />
                                    <span style={styles.chartCardTitle}>Jobs per Department</span>
                                </div>
                                <BarChart data={deptData} color="#818cf8" title="Jobs per department" />
                            </div>

                            <div style={{ ...styles.chartCard, ...(isCompact ? {} : { gridColumn: '1 / -1' }) }}>
                                <div style={styles.chartCardHead}>
                                    <Activity size={16} color="#34d399" />
                                    <span style={styles.chartCardTitle}>Applications — Last 7 Days</span>
                                </div>
                                <LineChart data={trendData} color="#34d399" title="Applications over the last 7 days" />
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        // base background matches sidebar
        backgroundColor: '#020617', 
        minHeight: '100vh',
    },
    mainContent: {
        marginLeft: '280px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    scrollArea: {
        padding: '100px 40px 40px 40px',
    },
    dashboardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
    },
    welcomeText: {
        fontSize: '28px',
        fontWeight: '800',
        color: '#f8fafc',
        margin: 0,
        letterSpacing: '-0.5px',
    },
    subText: {
        color: '#64748b',
        fontSize: '14px',
        margin: '4px 0 0 0',
    },
    liveIndicator: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#1e293b',
        padding: '6px 14px',
        borderRadius: '8px',
        border: '1px solid #334155',
    },
    liveText: {
        color: '#818cf8',
        fontSize: '12px',
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        marginBottom: '32px',
    },
    bottomGrid: {
        display: 'grid',
        gridTemplateColumns: '1.7fr 1.3fr',
        gap: '24px',
    },
    analyticsSection: {
        marginTop: '32px',
    },
    analyticsHeading: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '18px',
    },
    analyticsTitle: {
        fontSize: '18px',
        fontWeight: '800',
        color: '#f1f5f9',
        margin: 0,
        letterSpacing: '-0.3px',
    },
    chartsGrid: {
        display: 'grid',
        gap: '24px',
    },
    chartCard: {
        backgroundColor: '#0f172a',
        borderRadius: '14px',
        padding: '22px',
        border: '1px solid #1e293b',
        minWidth: 0,
    },
    chartCardHead: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '18px',
    },
    chartCardTitle: {
        fontSize: '14px',
        fontWeight: '700',
        color: '#e2e8f0',
    },
    mainAnalysis: {
        // card background is one shade lighter than body
        backgroundColor: '#0f172a', 
        borderRadius: '16px',
        padding: '28px',
        border: '1px solid #1e293b',
    },
    sideMetric: {
        // glass effect card
        backgroundColor: '#111827', 
        borderRadius: '16px',
        padding: '28px',
        border: '1px solid #374151',
        display: 'flex',
        flexDirection: 'column',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '28px',
    },
    cardTitle: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#f1f5f9',
        margin: 0,
    },
    actionLink: {
        background: 'none',
        border: 'none',
        color: '#818cf8',
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
    },
    deptList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
    },
    deptRow: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    deptMeta: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '13px',
    },
    deptName: {
        color: '#cbd5e1',
        fontWeight: '500',
    },
    deptCount: {
        color: '#64748b',
    },
    barTrack: {
        height: '6px',
        backgroundColor: '#1e293b',
        borderRadius: '10px',
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        borderRadius: '10px',
    },
    ringContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '30px',
    },
    progressRing: {
        width: '130px',
        height: '130px',
        borderRadius: '50%',
        border: '8px solid #1e293b',
        borderTopColor: '#6366f1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'inset 0 0 15px rgba(0,0,0,0.3)',
    },
    ringVal: {
        fontSize: '28px',
        fontWeight: '800',
        color: 'white',
    },
    ringLabel: {
        fontSize: '10px',
        color: '#94a3b8',
        textTransform: 'uppercase',
    },
    miniStats: {
        width: '100%',
        display: 'flex',
        gap: '12px',
    },
    statBox: {
        flex: 1,
        backgroundColor: '#0f172a',
        padding: '12px',
        borderRadius: '12px',
        textAlign: 'center',
        border: '1px solid #1e293b',
    },
    statLabel: {
        display: 'block',
        fontSize: '10px',
        color: '#64748b',
        marginBottom: '4px',
    },
    statVal: {
        fontSize: '16px',
        fontWeight: '700',
        color: 'white',
    },
};

export default Dashboard;