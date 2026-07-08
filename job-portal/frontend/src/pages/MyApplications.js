import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Briefcase, Search, Clock, CheckCircle, XCircle, FileText,
    User, TrendingUp, Award, ChevronRight, AlertCircle,
    Calendar, Building2, Filter, LayoutGrid, List, ArrowRight
} from 'lucide-react';
import { COLORS } from '../constants/colors';
import { jobsService } from '../services/jobsService';
import { jobSeekerAuthService } from '../services/jobSeekerAuthService';
import { useResponsive } from '../hooks/useResponsive';
import UserNavbar from '../components/brand/UserNavbar';

// ─── Helpers ────────────────────────────────────────────────────────────────

const STATUS_MAP = {
    applied:              { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE', label: 'Applied',            icon: Clock },
    test_assigned:        { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA', label: 'Test Assigned',       icon: FileText },
    test_completed:       { bg: '#F5F3FF', text: '#6D28D9', border: '#DDD6FE', label: 'Test Completed',      icon: FileText },
    test_passed:          { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0', label: 'Test Passed',         icon: CheckCircle },
    test_failed:          { bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA', label: 'Test Failed',         icon: XCircle },
    interview_scheduled:  { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE', label: 'Interview Scheduled', icon: Calendar },
    interview_completed:  { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0', label: 'Interviewed',         icon: CheckCircle },
    waiting:              { bg: '#FEFCE8', text: '#A16207', border: '#FDE68A', label: 'Waiting',             icon: Clock },
    notice_period:        { bg: '#FFF7ED', text: '#9A3412', border: '#FED7AA', label: 'Notice Period',       icon: AlertCircle },
    hired:                { bg: '#F0FDF4', text: '#14532D', border: '#86EFAC', label: '🎉 Hired',             icon: Award },
    rejected:             { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA', label: 'Rejected',            icon: XCircle },
};

const getStatus = (status) => STATUS_MAP[status] || { bg: '#F9FAFB', text: '#374151', border: '#E5E7EB', label: status, icon: Clock };

const STATUS_PIPELINE = [
    { key: '',                   label: 'All' },
    { key: 'applied',            label: 'Applied' },
    { key: 'test_assigned',      label: 'Test Assigned' },
    { key: 'test_passed',        label: 'Test Passed' },
    { key: 'test_failed',        label: 'Test Failed' },
    { key: 'interview_scheduled',label: 'Interview' },
    { key: 'hired',              label: 'Hired' },
    { key: 'rejected',           label: 'Rejected' },
];

// ─── Main Component ──────────────────────────────────────────────────────────

const MyApplications = () => {
    const navigate = useNavigate();
    const { isMobile, isCompact } = useResponsive();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = jobSeekerAuthService.getCurrentUser();
        if (!currentUser) { navigate('/login'); return; }
        setUser(currentUser);
        loadApplications();
    }, [statusFilter]);

    const loadApplications = async () => {
        setLoading(true);
        try {
            const data = await jobsService.getMyApplications(statusFilter);
            setApplications(Array.isArray(data) ? data : data.results || []);
        } catch (err) {
            console.error('Error loading applications:', err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = applications.filter(app => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (app.job_title || '').toLowerCase().includes(q) ||
               (app.company_name || '').toLowerCase().includes(q);
    });

    // Stats
    const stats = {
        total:     applications.length,
        active:    applications.filter(a => !['hired','rejected','test_failed'].includes(a.status)).length,
        hired:     applications.filter(a => a.status === 'hired').length,
        rejected:  applications.filter(a => a.status === 'rejected').length,
        tests:     applications.filter(a => ['test_assigned','test_completed','test_passed','test_failed'].includes(a.status)).length,
        interviews:applications.filter(a => ['interview_scheduled','interview_completed'].includes(a.status)).length,
    };

    // Group by status for pipeline view
    const grouped = STATUS_PIPELINE.slice(1).reduce((acc, s) => {
        const items = applications.filter(a => a.status === s.key);
        if (items.length) acc[s.key] = items;
        return acc;
    }, {});

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
                                {user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.username}
                            </h3>
                            <p style={s.profileEmail}>{user?.email}</p>
                        </div>
                        <div style={s.profileStatRow}>
                            <div style={s.pStat}><span style={s.pStatNum}>{stats.total}</span><span style={s.pStatLabel}>Total</span></div>
                            <div style={s.pStatDiv} />
                            <div style={s.pStat}><span style={s.pStatNum}>{stats.active}</span><span style={s.pStatLabel}>Active</span></div>
                            <div style={s.pStatDiv} />
                            <div style={s.pStat}><span style={{ ...s.pStatNum, color: COLORS.secondary }}>{stats.hired}</span><span style={s.pStatLabel}>Hired</span></div>
                        </div>
                        <div style={s.profileBtns}>
                            <button onClick={() => navigate('/dashboard')} style={s.profileBtn}><User size={13} /> Profile</button>
                            <button onClick={() => navigate('/jobs')} style={s.profileBtnOutline}><Briefcase size={13} /> Find Jobs</button>
                        </div>
                    </div>

                    {/* Stats breakdown */}
                    <div style={s.statsCard}>
                        <h4 style={s.statsCardTitle}>Application Tracker</h4>
                        {[
                            { label: 'Total Applied',   value: stats.total,      color: COLORS.primary },
                            { label: 'Active',          value: stats.active,     color: '#F59E0B' },
                            { label: 'Tests',           value: stats.tests,      color: '#7C3AED' },
                            { label: 'Interviews',      value: stats.interviews, color: '#0891B2' },
                            { label: 'Hired',           value: stats.hired,      color: COLORS.secondary },
                            { label: 'Rejected',        value: stats.rejected,   color: '#EF4444' },
                        ].map(({ label, value, color }) => (
                            <div key={label} style={s.trackerRow}>
                                <div style={s.trackerLeft}>
                                    <span style={{ ...s.trackerDot, background: color }} />
                                    <span style={s.trackerLabel}>{label}</span>
                                </div>
                                <span style={{ ...s.trackerVal, color }}>{value}</span>
                            </div>
                        ))}

                        {/* Overall progress bar */}
                        {stats.total > 0 && (
                            <div style={s.overallBar}>
                                <div style={s.overallBarLabel}>
                                    <span style={s.overallBarText}>Success Rate</span>
                                    <span style={{ ...s.overallBarText, fontWeight: 700, color: COLORS.secondary }}>
                                        {Math.round((stats.hired / stats.total) * 100)}%
                                    </span>
                                </div>
                                <div style={s.barTrack}>
                                    <div style={{ ...s.barFill, width: `${(stats.hired / stats.total) * 100}%` }} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Status filter pills */}
                    <div style={s.filterCard}>
                        <h4 style={s.filterCardTitle}><Filter size={13} /> Filter by Status</h4>
                        <div style={s.filterPills}>
                            {STATUS_PIPELINE.map(({ key, label }) => {
                                const count = key === '' ? applications.length : applications.filter(a => a.status === key).length;
                                const active = statusFilter === key;
                                const st = key ? getStatus(key) : null;
                                return (
                                    <button
                                        key={key}
                                        onClick={() => setStatusFilter(key)}
                                        style={{
                                            ...s.filterPill,
                                            background: active ? (st?.bg || COLORS.primary + '15') : 'white',
                                            color: active ? (st?.text || COLORS.primary) : '#475569',
                                            border: active ? `1.5px solid ${st?.border || COLORS.primary}` : '1px solid #E2E8F0',
                                            fontWeight: active ? 700 : 500,
                                        }}
                                    >
                                        {label}
                                        {count > 0 && <span style={{ ...s.filterPillCount, background: active ? (st?.text || COLORS.primary) : '#E2E8F0', color: active ? 'white' : '#64748B' }}>{count}</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </aside>

                {/* ── MAIN CONTENT ── */}
                <main style={s.main}>

                    {/* Header */}
                    <div style={{ ...s.mainHeader, ...(isMobile ? { flexDirection: 'column', alignItems: 'stretch', gap: 12 } : {}) }}>
                        <div>
                            <h1 style={s.pageTitle}>My Applications</h1>
                            <p style={s.pageSubtitle}>
                                {filtered.length} {filtered.length === 1 ? 'application' : 'applications'}
                                {statusFilter ? ` · ${getStatus(statusFilter).label}` : ''}
                            </p>
                        </div>
                        <div style={s.mainHeaderRight}>
                            <div style={s.viewToggle}>
                                <button onClick={() => setViewMode('list')} style={{ ...s.viewBtn, ...(viewMode === 'list' ? s.viewBtnActive : {}) }}><List size={16} /></button>
                                <button onClick={() => setViewMode('grid')} style={{ ...s.viewBtn, ...(viewMode === 'grid' ? s.viewBtnActive : {}) }}><LayoutGrid size={16} /></button>
                            </div>
                            <button onClick={() => navigate('/jobs')} style={s.browseBtn}><Briefcase size={15} /> Browse Jobs</button>
                        </div>
                    </div>

                    {/* Search */}
                    <div style={s.searchBar}>
                        <Search size={18} color="#94A3B8" />
                        <input
                            style={s.searchInput}
                            placeholder="Search by job title or company..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        {search && <button onClick={() => setSearch('')} style={s.clearSearchBtn}>✕</button>}
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div style={s.loader}><div style={s.spinner} /><p style={s.loaderText}>Loading applications...</p></div>
                    ) : filtered.length === 0 ? (
                        <EmptyState onBrowse={() => navigate('/jobs')} hasApps={applications.length > 0} />
                    ) : viewMode === 'list' ? (
                        <div style={s.listWrap}>
                            {filtered.map(app => (
                                <AppListCard key={app.id} app={app} onClick={() => navigate(`/my-applications/${app.id}`)} />
                            ))}
                        </div>
                    ) : (
                        <div style={s.gridWrap}>
                            {filtered.map(app => (
                                <AppGridCard key={app.id} app={app} onClick={() => navigate(`/my-applications/${app.id}`)} />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

// ─── App List Card ────────────────────────────────────────────────────────────

const AppListCard = ({ app, onClick }) => {
    const [hovered, setHovered] = useState(false);
    const st = getStatus(app.status);
    const Icon = st.icon;
    const isActionable = ['test_assigned', 'interview_scheduled'].includes(app.status);

    return (
        <div
            style={{ ...s.listCard, ...(hovered ? s.listCardHover : {}) }}
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Logo */}
            <div style={s.listLogo}>
                {app.company_logo
                    ? <img src={app.company_logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} />
                    : <div style={s.listLogoInitial}>{(app.company_name || app.job_title || 'J')[0]}</div>
                }
            </div>

            {/* Info */}
            <div style={s.listInfo}>
                <div style={s.listTopRow}>
                    <h3 style={s.listTitle}>{app.job_title || 'Job Position'}</h3>
                    <span style={{ ...s.statusPill, background: st.bg, color: st.text, border: `1px solid ${st.border}` }}>
                        <Icon size={12} /> {st.label}
                    </span>
                </div>
                <p style={s.listCompany}><Building2 size={13} color="#94A3B8" /> {app.company_name || '—'}</p>
                <div style={s.listMeta}>
                    <span style={s.listMetaItem}><Calendar size={13} color="#94A3B8" /> Applied {new Date(app.applied_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    {app.job_type && <span style={s.listMetaItem}><Briefcase size={13} color="#94A3B8" /> {app.job_type.replace('_', ' ')}</span>}
                    {app.test_score !== null && app.test_score !== undefined && (
                        <span style={{ ...s.listMetaItem, color: app.test_score >= 70 ? '#15803D' : '#B91C1C', fontWeight: 600 }}>
                            <FileText size={13} /> Score: {Math.round(app.test_score)}%
                        </span>
                    )}
                </div>
            </div>

            {/* Action */}
            <div style={s.listAction}>
                {isActionable && (
                    <div style={s.actionDot} />
                )}
                <ChevronRight size={20} color={hovered ? COLORS.primary : '#CBD5E1'} />
            </div>
        </div>
    );
};

// ─── App Grid Card ────────────────────────────────────────────────────────────

const AppGridCard = ({ app, onClick }) => {
    const [hovered, setHovered] = useState(false);
    const st = getStatus(app.status);
    const Icon = st.icon;

    return (
        <div
            style={{ ...s.gridCard, ...(hovered ? s.gridCardHover : {}) }}
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div style={s.gridCardTop}>
                <div style={s.gridLogo}>
                    {app.company_logo
                        ? <img src={app.company_logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 9 }} />
                        : <div style={s.gridLogoInitial}>{(app.company_name || 'J')[0]}</div>
                    }
                </div>
                <span style={{ ...s.statusPill, background: st.bg, color: st.text, border: `1px solid ${st.border}` }}>
                    <Icon size={11} /> {st.label}
                </span>
            </div>
            <h3 style={s.gridTitle}>{app.job_title || 'Job Position'}</h3>
            <p style={s.gridCompany}>{app.company_name || '—'}</p>
            {app.test_score !== null && app.test_score !== undefined && (
                <div style={{ ...s.scorePill, background: app.test_score >= 70 ? '#F0FDF4' : '#FEF2F2', color: app.test_score >= 70 ? '#15803D' : '#B91C1C' }}>
                    Test Score: {Math.round(app.test_score)}%
                </div>
            )}
            <div style={s.gridFooter}>
                <span style={s.gridDate}>{new Date(app.applied_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <span style={s.gridViewLink}>View <ArrowRight size={13} /></span>
            </div>
        </div>
    );
};

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = ({ onBrowse, hasApps }) => (
    <div style={s.empty}>
        <div style={s.emptyIcon}><Briefcase size={40} color="#CBD5E1" /></div>
        <h3 style={s.emptyTitle}>{hasApps ? 'No matching applications' : 'No applications yet'}</h3>
        <p style={s.emptyText}>{hasApps ? 'Try a different filter or search term.' : 'Start applying to jobs to track your progress here.'}</p>
        {!hasApps && <button onClick={onBrowse} style={s.emptyBtn}>Browse Open Jobs</button>}
    </div>
);

// ─── Styles ──────────────────────────────────────────────────────────────────

const s = {
    root: { minHeight: '100vh', background: '#F1F5F9', fontFamily: "system-ui, -apple-system, sans-serif" },

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

    // Left Sidebar
    sidebar: { width: 290, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 80, maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' },

    // Profile Card
    profileCard: { background: 'white', borderRadius: 14, border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', flexShrink: 0 },
    profileBanner: { height: 58, background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})` },
    profileAvatarWrap: { margin: '-27px 0 0 18px', marginBottom: 6 },
    profileAvatar: { width: 54, height: 54, borderRadius: '50%', border: '3px solid white', objectFit: 'cover' },
    profileAvatarInitial: { width: 54, height: 54, borderRadius: '50%', border: '3px solid white', background: COLORS.primary, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700 },
    profileInfo: { padding: '0 18px 12px' },
    profileName: { fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 2px' },
    profileEmail: { fontSize: 11, color: '#94A3B8', margin: 0 },
    profileStatRow: { display: 'flex', borderTop: '1px solid #F1F5F9', padding: '10px 18px' },
    pStat: { flex: 1, textAlign: 'center' },
    pStatNum: { display: 'block', fontSize: 17, fontWeight: 700, color: '#0F172A' },
    pStatLabel: { fontSize: 10, color: '#94A3B8' },
    pStatDiv: { width: 1, background: '#E2E8F0' },
    profileBtns: { padding: '10px 18px 14px', display: 'flex', gap: 8 },
    profileBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, background: COLORS.primary, color: 'white', border: 'none', padding: '8px 0', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
    profileBtnOutline: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, background: 'white', color: COLORS.primary, border: `1px solid ${COLORS.primary}`, padding: '8px 0', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' },

    // Stats Card
    statsCard: { background: 'white', borderRadius: 14, border: '1px solid #E2E8F0', padding: '16px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', flexShrink: 0 },
    statsCardTitle: { fontSize: 13, fontWeight: 700, color: '#0F172A', margin: '0 0 14px' },
    trackerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    trackerLeft: { display: 'flex', alignItems: 'center', gap: 8 },
    trackerDot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
    trackerLabel: { fontSize: 13, color: '#475569' },
    trackerVal: { fontSize: 14, fontWeight: 700 },
    overallBar: { marginTop: 14, paddingTop: 14, borderTop: '1px solid #F1F5F9' },
    overallBarLabel: { display: 'flex', justifyContent: 'space-between', marginBottom: 6 },
    overallBarText: { fontSize: 12, color: '#64748B' },
    barTrack: { height: 7, background: '#F1F5F9', borderRadius: 10, overflow: 'hidden' },
    barFill: { height: '100%', background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`, borderRadius: 10, transition: 'width 0.6s ease' },

    // Filter Card
    filterCard: { background: 'white', borderRadius: 14, border: '1px solid #E2E8F0', padding: '14px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', flexShrink: 0 },
    filterCardTitle: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#0F172A', margin: '0 0 12px' },
    filterPills: { display: 'flex', flexDirection: 'column', gap: 7 },
    filterPill: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 8, fontSize: 13, cursor: 'pointer', transition: 'all 0.15s' },
    filterPillCount: { fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 20, minWidth: 20, textAlign: 'center' },

    // Main
    main: { flex: 1, minWidth: 0 },
    mainHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 },
    pageTitle: { fontSize: 22, fontWeight: 800, color: '#0F172A', margin: '0 0 2px' },
    pageSubtitle: { fontSize: 13, color: '#64748B' },
    mainHeaderRight: { display: 'flex', alignItems: 'center', gap: 10 },
    viewToggle: { display: 'flex', border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden' },
    viewBtn: { padding: '8px 12px', background: 'white', border: 'none', cursor: 'pointer', color: '#94A3B8', display: 'flex', alignItems: 'center' },
    viewBtnActive: { background: COLORS.primary, color: 'white' },
    browseBtn: { display: 'flex', alignItems: 'center', gap: 6, background: COLORS.primary, color: 'white', border: 'none', padding: '10px 18px', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer' },

    // Search
    searchBar: { display: 'flex', alignItems: 'center', gap: 10, background: 'white', border: '1px solid #E2E8F0', borderRadius: 11, padding: '10px 16px', marginBottom: 18, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
    searchInput: { flex: 1, border: 'none', outline: 'none', fontSize: 14, color: '#0F172A', background: 'transparent' },
    clearSearchBtn: { background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: 14, padding: '0 4px' },

    // Loader
    loader: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0', gap: 14 },
    spinner: { width: 34, height: 34, border: '3px solid #E2E8F0', borderTop: `3px solid ${COLORS.primary}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
    loaderText: { color: '#94A3B8', fontSize: 14, margin: 0 },

    // List view
    listWrap: { display: 'flex', flexDirection: 'column', gap: 12 },
    listCard: { background: 'white', borderRadius: 13, border: '1px solid #E2E8F0', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', transition: 'all 0.18s', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
    listCardHover: { boxShadow: '0 6px 20px rgba(0,0,0,0.09)', transform: 'translateY(-1px)', border: '1px solid #93C5FD' },
    listLogo: { width: 52, height: 52, borderRadius: 10, border: '1px solid #E2E8F0', overflow: 'hidden', flexShrink: 0, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    listLogoInitial: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: COLORS.primary, background: '#EFF6FF' },
    listInfo: { flex: 1, minWidth: 0 },
    listTopRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5, flexWrap: 'wrap' },
    listTitle: { fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    listCompany: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#64748B', margin: '0 0 7px' },
    listMeta: { display: 'flex', flexWrap: 'wrap', gap: 14 },
    listMetaItem: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#64748B' },
    listAction: { display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, position: 'relative' },
    actionDot: { width: 8, height: 8, borderRadius: '50%', background: COLORS.accent, position: 'absolute', top: -2, right: -2 },

    // Grid view
    gridWrap: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 },
    gridCard: { background: 'white', borderRadius: 13, border: '1px solid #E2E8F0', padding: '20px', cursor: 'pointer', transition: 'all 0.18s', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
    gridCardHover: { boxShadow: '0 6px 20px rgba(0,0,0,0.09)', transform: 'translateY(-2px)', border: '1px solid #93C5FD' },
    gridCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    gridLogo: { width: 44, height: 44, borderRadius: 9, border: '1px solid #E2E8F0', overflow: 'hidden', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    gridLogoInitial: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 800, color: COLORS.primary },
    gridTitle: { fontSize: 14, fontWeight: 700, color: '#0F172A', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    gridCompany: { fontSize: 12, color: '#64748B', margin: '0 0 10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    scorePill: { fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, display: 'inline-block', marginBottom: 10 },
    gridFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: 10 },
    gridDate: { fontSize: 11, color: '#94A3B8' },
    gridViewLink: { display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, color: COLORS.primary, fontWeight: 600 },

    // Status pill (shared)
    statusPill: { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, whiteSpace: 'nowrap', flexShrink: 0 },

    // Empty state
    empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '80px 20px', background: 'white', borderRadius: 14, border: '1px solid #E2E8F0' },
    emptyIcon: { width: 72, height: 72, borderRadius: '50%', background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    emptyTitle: { fontSize: 18, fontWeight: 700, color: '#0F172A', margin: 0 },
    emptyText: { fontSize: 14, color: '#64748B', margin: 0, textAlign: 'center' },
    emptyBtn: { background: COLORS.primary, color: 'white', border: 'none', padding: '12px 28px', borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 4 },
};

const styleEl = document.createElement('style');
styleEl.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
document.head.appendChild(styleEl);

export default MyApplications;