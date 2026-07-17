import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Briefcase, Clock, CheckCircle, FileText, TrendingUp, User,
    XCircle, Calendar, Award, ChevronRight, ArrowRight, Bell,
    MapPin, Banknote, Zap, Target, BarChart2, Star
} from 'lucide-react';
import { COLORS } from '../constants/colors';
import { jobSeekerAuthService } from '../services/jobSeekerAuthService';
import { useResponsive } from '../hooks/useResponsive';
import UserNavbar from '../components/brand/UserNavbar';
import { formatJobSalary } from '../utils/currency';

// ─── Status helpers (same as MyApplications for consistency) ────────────────
const GREEN = '#16A34A'; // Defined green constant


const STATUS_MAP = {
    applied:              { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE', label: 'Applied' },
    test_assigned:        { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA', label: 'Test Assigned' },
    test_completed:       { bg: '#F5F3FF', text: '#6D28D9', border: '#DDD6FE', label: 'Test Completed' },
    test_passed:          { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0', label: 'Test Passed' },
    test_failed:          { bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA', label: 'Test Failed' },
    interview_scheduled:  { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE', label: 'Interview Set' },
    interview_completed:  { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0', label: 'Interviewed' },
    waiting:              { bg: '#FEFCE8', text: '#A16207', border: '#FDE68A', label: 'Waiting' },
    hired:                { bg: '#F0FDF4', text: '#14532D', border: '#86EFAC', label: '🎉 Hired' },
    rejected:             { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA', label: 'Rejected' },
};
const getStatus = (s) => STATUS_MAP[s] || { bg: '#F9FAFB', text: '#374151', border: '#E5E7EB', label: s };

const formatSalary = (job) => formatJobSalary(job) || null;

// ─── Main Component ──────────────────────────────────────────────────────────

const JobSeekerDashboard = () => {
    const navigate = useNavigate();
    const { isMobile, isCompact } = useResponsive();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = jobSeekerAuthService.getCurrentUser();
        if (!currentUser) { navigate('/login'); return; }
        setUser(currentUser);
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        setLoading(true);
        try {
            const d = await jobSeekerAuthService.getDashboard();
            setData(d);
        } catch (err) {
            console.error('Dashboard error:', err);
        } finally {
            setLoading(false);
        }
    };

    const stats = data?.statistics || {};
    const recentApps = data?.recent_applications || [];
    const recommendedJobs = data?.recommended_jobs || [];
    const userName = data?.user_info?.first_name || user?.username || 'there';
    const totalApps = stats.total_applications || 0;
    const activeApps = totalApps - (stats.accepted || 0) - (stats.rejected || 0);

    // Greeting based on time
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    
    
    if (loading) {
        return (
            <div style={s.fullCenter}>
                <div style={s.spinner} />
                <p style={{ color: '#94A3B8', marginTop: 12 }}>Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div style={s.root}>

            {/* ── Navbar ── */}
            <UserNavbar />

            {/* ── Page Body ── */}
            <div style={{ ...s.page, ...(isCompact ? { flexDirection: 'column', padding: isMobile ? '16px' : '24px' } : {}) }}>

                {/* ── LEFT SIDEBAR ── */}
                <aside style={{ ...s.sidebar, ...(isCompact ? { width: '100%', position: 'static', maxHeight: 'none', overflowY: 'visible' } : {}) }}>

                    {/* Profile card */}
                    <div style={s.profileCard}>
                        <div style={s.profileBanner} />
                        <div style={s.profileAvatarWrap}>
                            {user?.profile_picture
                                ? <img src={user.profile_picture} alt="" style={s.profileAvatar} />
                                : <div style={s.profileAvatarInitial}>{(user?.first_name || user?.username || 'U')[0]?.toUpperCase()}</div>
                            }
                        </div>
                        <div style={s.profileInfo}>
                            <h3 style={s.profileName}>
                                {data?.user_info?.first_name && data?.user_info?.last_name
                                    ? `${data.user_info.first_name} ${data.user_info.last_name}`
                                    : user?.username}
                            </h3>
                            <p style={s.profileEmail}>{data?.user_info?.email || user?.email}</p>
                            {user?.current_job && <p style={s.profileRole}>{user.current_job}</p>}
                        </div>
                        <div style={s.profileStats}>
                            <div style={s.pStat}><span style={s.pStatNum}>{totalApps}</span><span style={s.pStatLabel}>Applied</span></div>
                            <div style={s.pStatDiv} />
                            <div style={s.pStat}><span style={s.pStatNum}>{activeApps}</span><span style={s.pStatLabel}>Active</span></div>
                            <div style={s.pStatDiv} />
                            <div style={s.pStat}><span style={{ ...s.pStatNum, color: COLORS.secondary }}>{stats.accepted || 0}</span><span style={s.pStatLabel}>Hired</span></div>
                        </div>
                        <div style={s.profileBtns}>
                            <button onClick={() => navigate('/my-applications')} style={s.profileBtn}><FileText size={13} /> Applications</button>
                            <button onClick={() => navigate('/jobs')} style={s.profileBtnOutline}><Briefcase size={13} /> Browse Jobs</button>
                        </div>
                    </div>

                    {/* Job search health */}
                    <div style={s.healthCard}>
                        <h4 style={s.healthTitle}><Target size={14} color={COLORS.primary} /> Search Progress</h4>
                        {[
                            { label: 'Applied',       value: stats.pending || 0,              color: '#3B82F6' },
                            { label: 'In Tests',      value: (stats.test_completed || 0) + (stats.test_passed || 0), color: '#7C3AED' },
                            { label: 'Interviews',    value: stats.interview_scheduled || 0,  color: '#0891B2' },
                            { label: 'Hired',         value: stats.accepted || 0,             color: COLORS.secondary },
                            { label: 'Rejected',      value: stats.rejected || 0,             color: '#EF4444' },
                        ].map(({ label, value, color }) => (
                            <div key={label} style={s.healthRow}>
                                <div style={s.healthLeft}>
                                    <span style={{ ...s.healthDot, background: color }} />
                                    <span style={s.healthLabel}>{label}</span>
                                </div>
                                <div style={s.healthRight}>
                                    <div style={s.healthBarTrack}>
                                        <div style={{ ...s.healthBarFill, width: totalApps > 0 ? `${Math.min((value/totalApps)*100,100)}%` : '0%', background: color }} />
                                    </div>
                                    <span style={{ ...s.healthVal, color }}>{value}</span>
                                </div>
                            </div>
                        ))}
                        {totalApps > 0 && (
                            <div style={s.successRate}>
                                <Award size={14} color={COLORS.secondary} />
                                <span style={s.successRateText}>
                                    Success rate: <strong>{Math.round(((stats.accepted || 0) / totalApps) * 100)}%</strong>
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Quick actions */}
                    <div style={s.quickCard}>
                        <h4 style={s.quickTitle}>Quick Actions</h4>
                        {[
                            { label: 'Edit Profile',          icon: <User size={15} />,        path: '/profile',          color: '#64748B' },
                            { label: 'Browse All Jobs',       icon: <Briefcase size={15} />,   path: '/jobs',             color: COLORS.primary },
                            { label: 'My Applications',       icon: <FileText size={15} />,    path: '/my-applications',  color: '#7C3AED' },
                            { label: 'Hired Jobs',            icon: <Award size={15} />,       path: '/my-applications?status=hired', color: COLORS.secondary },
                            { label: 'Pending Tests',         icon: <Clock size={15} />,       path: '/my-applications?status=test_assigned', color: '#F59E0B' },
                        ].map(({ label, icon, path, color }) => (
                            <button key={label} onClick={() => navigate(path)} style={s.quickBtn}>
                                <span style={{ ...s.quickBtnIcon, color, background: color + '15' }}>{icon}</span>
                                <span style={s.quickBtnLabel}>{label}</span>
                                <ChevronRight size={14} color="#CBD5E1" />
                            </button>
                        ))}
                    </div>
                </aside>

                {/* ── MAIN CONTENT ── */}
                <main style={s.main}>

                    {/* Welcome banner */}
                    <div style={{ ...s.welcomeBanner, ...(isMobile ? { flexDirection: 'column', alignItems: 'stretch', padding: '20px 18px' } : {}) }}>
                        <div style={s.welcomeLeft}>
                            <p style={{ ...s.welcomeGreeting, ...(isMobile ? { fontSize: 20 } : {}) }}>{greeting}, <strong>{userName}</strong> 👋</p>
                            <p style={s.welcomeSub}>Here's your job search overview for today</p>
                            {stats.test_assigned > 0 && (
                                <div style={s.alertChip}>
                                    <Bell size={13} /> {stats.test_assigned} pending test{stats.test_assigned > 1 ? 's' : ''} — take action!
                                </div>
                            )}
                        </div>
                        <button onClick={() => navigate('/jobs')} style={s.welcomeBtn}>
                            <Zap size={16} /> Find Jobs
                        </button>
                    </div>

                    {/* Stats grid */}
                    <div style={{ ...s.statsGrid, ...(isMobile ? { gridTemplateColumns: '1fr' } : isCompact ? { gridTemplateColumns: 'repeat(2, 1fr)' } : {}) }}>
                        {[
                            { icon: <Briefcase size={22} />, value: stats.total_applications || 0, label: 'Total Applied',     color: COLORS.primary,   sub: 'all time',         onClick: () => navigate('/my-applications') },
                            { icon: <Clock size={22} />,     value: activeApps,                     label: 'Active Now',        color: '#F59E0B',        sub: 'in progress' },
                            { icon: <FileText size={22} />,  value: stats.test_completed || 0,      label: 'Tests Done',        color: '#7C3AED',        sub: 'completed' },
                            { icon: <Award size={22} />,     value: stats.accepted || 0,            label: 'Hired',             color: COLORS.secondary, sub: 'offers received',  onClick: () => navigate('/my-applications') },
                        ].map(({ icon, value, label, color, sub, onClick }) => (
                            <div key={label} style={{ ...s.statCard, cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
                                <div style={{ ...s.statIconWrap, background: color + '12', color }}>
                                    {icon}
                                </div>
                                <div style={s.statBody}>
                                    <span style={{ ...s.statValue, color }}>{value}</span>
                                    <span style={s.statLabel}>{label}</span>
                                    <span style={s.statSub}>{sub}</span>
                                </div>
                                {onClick && <ChevronRight size={18} color="#CBD5E1" style={{ marginLeft: 'auto' }} />}
                            </div>
                        ))}
                    </div>

                    {/* Recent Applications */}
                    <section style={s.section}>
                        <div style={s.sectionHeader}>
                            <div>
                                <h2 style={s.sectionTitle}>Recent Applications</h2>
                                <p style={s.sectionSub}>Your last {recentApps.length} application{recentApps.length !== 1 ? 's' : ''}</p>
                            </div>
                            <button onClick={() => navigate('/my-applications')} style={s.seeAllBtn}>
                                View All <ArrowRight size={14} />
                            </button>
                        </div>

                        {recentApps.length === 0 ? (
                            <div style={s.emptyCard}>
                                <Briefcase size={40} color="#CBD5E1" />
                                <h3 style={s.emptyTitle}>No applications yet</h3>
                                <p style={s.emptyText}>Start applying to track your progress here</p>
                                <button onClick={() => navigate('/jobs')} style={s.emptyBtn}>Browse Jobs</button>
                            </div>
                        ) : (
                            <div style={s.appsList}>
                                {recentApps.map(app => (
                                    <RecentAppCard key={app.id} app={app} onClick={() => navigate(`/my-applications/${app.id}`)} />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Recommended Jobs */}
                    <section style={s.section}>
                        <div style={s.sectionHeader}>
                            <div>
                                <h2 style={s.sectionTitle}>Recommended Jobs</h2>
                                <p style={s.sectionSub}>Latest open positions for you</p>
                            </div>
                            <button onClick={() => navigate('/jobs')} style={s.seeAllBtn}>
                                All Jobs <ArrowRight size={14} />
                            </button>
                        </div>

                        {recommendedJobs.length === 0 ? (
                            <div style={s.emptyCard}>
                                <TrendingUp size={40} color="#CBD5E1" />
                                <p style={s.emptyText}>No open jobs at the moment. Check back soon!</p>
                            </div>
                        ) : (
                            <div style={s.jobsGrid}>
                                {recommendedJobs.map(job => (
                                    <RecommendedJobCard key={job.id} job={job} onClick={() => navigate(`/jobs/${job.slug || job.id}`)} />
                                ))}
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
};

// ─── Recent App Card ──────────────────────────────────────────────────────────

const RecentAppCard = ({ app, onClick }) => {
    const [hovered, setHovered] = useState(false);
    const st = getStatus(app.status);
    const isActionable = ['test_assigned', 'interview_scheduled'].includes(app.status);

    return (
        <div
            style={{ ...s.recentCard, ...(hovered ? s.recentCardHover : {}) }}
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div style={s.rcLogo}>
                {app.company_logo
                    ? <img src={app.company_logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 9 }} />
                    : <div style={s.rcLogoInitial}>{(app.company_name || 'J')[0]}</div>
                }
                {isActionable && <div style={s.rcActionDot} />}
            </div>
            <div style={s.rcInfo}>
                <div style={s.rcTopRow}>
                    <h4 style={s.rcTitle}>{app.job_title || 'Job Position'}</h4>
                    <span style={{ ...s.rcStatusPill, background: st.bg, color: st.text, border: `1px solid ${st.border}` }}>
                        {st.label}
                    </span>
                </div>
                <p style={s.rcCompany}>{app.company_name || '—'}</p>
                <div style={s.rcMeta}>
                    <span style={s.rcMetaItem}><Calendar size={12} /> {new Date(app.applied_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    {app.job_type && <span style={s.rcMetaItem}><Briefcase size={12} /> {app.job_type.replace('_', ' ')}</span>}
                    {app.test_score !== null && app.test_score !== undefined && (
                        <span style={{ ...s.rcMetaItem, color: app.test_score >= 70 ? '#15803D' : '#B91C1C', fontWeight: 600 }}>
                            <FileText size={12} /> {Math.round(app.test_score)}%
                        </span>
                    )}
                </div>
            </div>
            <ChevronRight size={18} color={hovered ? COLORS.primary : '#CBD5E1'} style={{ flexShrink: 0 }} />
        </div>
    );
};

// ─── Recommended Job Card ─────────────────────────────────────────────────────

const RecommendedJobCard = ({ job, onClick }) => {
    const [hovered, setHovered] = useState(false);
    const TYPE_COLORS = {
        remote:  { bg: '#F0FDF4', text: '#166534' },
        onsite:  { bg: '#EFF6FF', text: '#1D4ED8' },
        hybrid:  { bg: '#FDF4FF', text: '#7E22CE' },
    };
    const tc = TYPE_COLORS[job.job_type] || { bg: '#F9FAFB', text: '#374151' };
    const salaryText = formatSalary(job);

    return (
        <div
            style={{ ...s.jobCard, ...(hovered ? s.jobCardHover : {}) }}
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div style={s.jcTop}>
                <div style={s.jcLogo}>
                    {job.department_logo
                        ? <img src={job.department_logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={s.jcLogoInitial}>{(job.department_name || 'C')[0]}</div>
                    }
                </div>
                <span style={{ ...s.jcTypePill, background: tc.bg, color: tc.text }}>
                    {job.job_type?.replace('_', ' ') || 'Full Time'}
                </span>
            </div>
            <h3 style={s.jcTitle}>{job.title}</h3>
            <p style={s.jcCompany}>{job.department_name}</p>
            {salaryText && (
                <div style={s.jcSalary}><Banknote size={13} color="#64748B" />{salaryText}</div>
            )}
            <div style={s.jcFooter}>
                <span style={s.jcDate}>{new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <span style={s.jcLink}>View <ArrowRight size={13} /></span>
            </div>
        </div>
    );
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const s = {
    root: { minHeight: '100vh', background: '#F1F5F9', fontFamily: "system-ui, -apple-system, sans-serif" },
    fullCenter: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' },
    spinner: { width: 36, height: 36, border: '4px solid #E2E8F0', borderTop: `4px solid ${COLORS.primary}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' },

    // Navbar
    navbar: { background: 'white', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 200, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
    navInner: { maxWidth: 1400, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', gap: 20 },
    logo: { display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flexShrink: 0 },
    logoMark: { display: 'flex', gap: 3 },
    dot: { width: 10, height: 10, borderRadius: '50%' },
    logoText: { fontSize: 20, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' },
    navRight: { display: 'flex', alignItems: 'center', gap: 16, marginLeft: 'auto' },
    navTextBtn: { background: 'none', border: 'none', color: '#475569', fontSize: 14, fontWeight: 500, cursor: 'pointer' },
    logoutBtn: { display: 'flex', alignItems: 'center', gap: 6, background: '#FEF2F2', color: '#DC2626', border: 'none', padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' },
    avatarWrap: { width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', border: '2px solid #E2E8F0' },
    avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
    avatarInitial: { width: '100%', height: '100%', background: '#EFF6FF', color: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 },

    // Layout
    page: { maxWidth: 1400, margin: '0 auto', padding: '28px 24px', display: 'flex', gap: 24, alignItems: 'flex-start' },

    // Sidebar
    sidebar: { width: 290, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 80, maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' },

    // Profile card
    profileCard: { background: 'white', borderRadius: 14, border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', flexShrink: 0 },
    profileBanner: { height: 58, background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})` },
    profileAvatarWrap: { margin: '-27px 0 0 18px', marginBottom: 6 },
    profileAvatar: { width: 54, height: 54, borderRadius: '50%', border: '3px solid white', objectFit: 'cover' },
    profileAvatarInitial: { width: 54, height: 54, borderRadius: '50%', border: '3px solid white', background: COLORS.primary, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700 },
    profileInfo: { padding: '0 18px 12px' },
    profileName: { fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 2px' },
    profileEmail: { fontSize: 11, color: '#94A3B8', margin: 0 },
    profileRole: { fontSize: 12, color: '#64748B', margin: '3px 0 0', fontStyle: 'italic' },
    profileStats: { display: 'flex', borderTop: '1px solid #F1F5F9', padding: '10px 18px' },
    pStat: { flex: 1, textAlign: 'center' },
    pStatNum: { display: 'block', fontSize: 17, fontWeight: 700, color: '#0F172A' },
    pStatLabel: { fontSize: 10, color: '#94A3B8' },
    pStatDiv: { width: 1, background: '#E2E8F0' },
    profileBtns: { padding: '10px 18px 14px', display: 'flex', gap: 8 },
    profileBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, background: GREEN, color: 'white', border: 'none', padding: '8px 0', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
    profileBtnOutline: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, background: 'white', color: GREEN, border: `1px solid ${GREEN}`, padding: '8px 0', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' },

    // Search health card
    healthCard: { background: 'white', borderRadius: 14, border: '1px solid #E2E8F0', padding: '16px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', flexShrink: 0 },
    healthTitle: { display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 700, color: '#0F172A', margin: '0 0 14px' },
    healthRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 },
    healthLeft: { display: 'flex', alignItems: 'center', gap: 6, width: 80, flexShrink: 0 },
    healthDot: { width: 7, height: 7, borderRadius: '50%', flexShrink: 0 },
    healthLabel: { fontSize: 12, color: '#475569' },
    healthRight: { flex: 1, display: 'flex', alignItems: 'center', gap: 8 },
    healthBarTrack: { flex: 1, height: 5, background: '#F1F5F9', borderRadius: 10, overflow: 'hidden' },
    healthBarFill: { height: '100%', borderRadius: 10, transition: 'width 0.6s ease' },
    healthVal: { fontSize: 12, fontWeight: 700, minWidth: 16, textAlign: 'right' },
    successRate: { display: 'flex', alignItems: 'center', gap: 7, marginTop: 12, paddingTop: 12, borderTop: '1px solid #F1F5F9', fontSize: 12, color: '#64748B' },
    successRateText: { fontSize: 12, color: '#64748B' },

    // Quick actions card
    quickCard: { background: 'white', borderRadius: 14, border: '1px solid #E2E8F0', padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', flexShrink: 0 },
    quickTitle: { fontSize: 13, fontWeight: 700, color: '#0F172A', margin: '0 0 10px' },
    quickBtn: { display: 'flex', alignItems: 'center', gap: 10, width: '100%', background: 'none', border: 'none', padding: '9px 6px', borderRadius: 8, cursor: 'pointer', textAlign: 'left', marginBottom: 2 },
    quickBtnIcon: { width: 30, height: 30, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    quickBtnLabel: { flex: 1, fontSize: 13, color: '#334155', fontWeight: 500 },

    // Main
    main: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 24 },

    // Welcome banner
    welcomeBanner: { background: `linear-gradient(135deg, ${COLORS.primary}F0, ${COLORS.secondary}E0)`, borderRadius: 16, padding: '28px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 },
    welcomeLeft: { flex: 1 },
    welcomeGreeting: { fontSize: 22, fontWeight: 700, color: 'white', margin: '0 0 4px' },
    welcomeSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', margin: 0 },
    alertChip: { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.2)', color: 'white', padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, marginTop: 10 },
    welcomeBtn: { display: 'flex', alignItems: 'center', gap: 8, background: 'white', color: GREEN, border: 'none', padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', flexShrink: 0 },

    // Stats grid
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 },
    statCard: { background: 'white', borderRadius: 13, border: '1px solid #E2E8F0', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', transition: 'all 0.18s' },
    statIconWrap: { width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    statBody: { display: 'flex', flexDirection: 'column', flex: 1 },
    statValue: { fontSize: 26, fontWeight: 800, lineHeight: 1, marginBottom: 2 },
    statLabel: { fontSize: 13, fontWeight: 600, color: '#374151' },
    statSub: { fontSize: 11, color: '#94A3B8' },

    // Sections
    section: { display: 'flex', flexDirection: 'column', gap: 14 },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    sectionTitle: { fontSize: 18, fontWeight: 700, color: '#0F172A', margin: '0 0 2px' },
    sectionSub: { fontSize: 13, color: '#64748B', margin: 0 },
    seeAllBtn: { display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', color: COLORS.primary, fontSize: 13, fontWeight: 600, cursor: 'pointer' },

    // Empty card
    emptyCard: { background: 'white', borderRadius: 13, border: '1px solid #E2E8F0', padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 },
    emptyTitle: { fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 },
    emptyText: { fontSize: 14, color: '#64748B', margin: 0, textAlign: 'center' },
    emptyBtn: { background: COLORS.primary, color: 'white', border: 'none', padding: '10px 24px', borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 4 },

    // Recent app cards (list)
    appsList: { display: 'flex', flexDirection: 'column', gap: 10 },
    recentCard: { background: 'white', borderRadius: 12, border: '1px solid #E2E8F0', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', transition: 'all 0.18s', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
    recentCardHover: { boxShadow: '0 6px 18px rgba(0,0,0,0.09)', transform: 'translateY(-1px)', borderColor: '#93C5FD' },
    rcLogo: { width: 46, height: 46, borderRadius: 9, border: '1px solid #E2E8F0', overflow: 'hidden', flexShrink: 0, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
    rcLogoInitial: { fontSize: 18, fontWeight: 800, color: COLORS.primary },
    rcActionDot: { position: 'absolute', top: -2, right: -2, width: 10, height: 10, borderRadius: '50%', background: COLORS.accent, border: '2px solid white' },
    rcInfo: { flex: 1, minWidth: 0 },
    rcTopRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' },
    rcTitle: { fontSize: 14, fontWeight: 700, color: '#0F172A', margin: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    rcStatusPill: { fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20, whiteSpace: 'nowrap', flexShrink: 0 },
    rcCompany: { fontSize: 12, color: '#64748B', margin: '0 0 5px' },
    rcMeta: { display: 'flex', gap: 12, flexWrap: 'wrap' },
    rcMetaItem: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#64748B' },

    // Recommended job cards (grid)
    jobsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 },
    jobCard: { background: 'white', borderRadius: 13, border: '1px solid #E2E8F0', padding: '18px', cursor: 'pointer', transition: 'all 0.18s', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
    jobCardHover: { boxShadow: '0 8px 22px rgba(0,0,0,0.1)', transform: 'translateY(-2px)', borderColor: '#93C5FD' },
    jcTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    jcLogo: { width: 44, height: 44, borderRadius: 9, border: '1px solid #E2E8F0', overflow: 'hidden', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    jcLogoInitial: { fontSize: 18, fontWeight: 800, color: COLORS.primary },
    jcTypePill: { fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 20, textTransform: 'capitalize' },
    jcTitle: { fontSize: 14, fontWeight: 700, color: '#0F172A', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    jcCompany: { fontSize: 12, color: '#64748B', margin: '0 0 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    jcSalary: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#475569', fontWeight: 500, marginBottom: 12 },
    jcFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: 10 },
    jcDate: { fontSize: 11, color: '#94A3B8' },
    jcLink: { display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, color: COLORS.primary, fontWeight: 600 },
};

const styleEl = document.createElement('style');
styleEl.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
document.head.appendChild(styleEl);

export default JobSeekerDashboard;
