import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Search, MapPin, Banknote, Briefcase, Filter, User,
    Clock, CheckCircle, XCircle, AlertCircle, ChevronRight, Star,
    Bell, Settings, FileText, TrendingUp, Award, Calendar
} from 'lucide-react';
import { BRAND, FONT, page, injectBrandStyles } from '../components/brand/brandTheme';
import { jobsService } from '../services/jobsService';
import { jobSeekerAuthService } from '../services/jobSeekerAuthService';
import { useResponsive } from '../hooks/useResponsive';
import UserNavbar from '../components/brand/UserNavbar';
import { JobListSkeleton } from '../components/common/Skeleton';
import { formatJobSalary } from '../utils/currency';

injectBrandStyles();

// ───── shared flat button variants (mirrors Landing.jsx) ─────
const btn = {
    primary: {
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        background: BRAND.green, color: '#fff', border: `1px solid ${BRAND.green}`,
        padding: '10px 20px', borderRadius: 8, fontSize: 13.5, fontWeight: 600,
        cursor: 'pointer', fontFamily: FONT, transition: 'background .15s ease',
    },
    ghost: {
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        background: 'transparent', color: BRAND.ink, border: `1px solid ${BRAND.line}`,
        padding: '9px 18px', borderRadius: 8, fontSize: 13.5, fontWeight: 600,
        cursor: 'pointer', fontFamily: FONT, transition: 'border-color .15s ease',
    },
    text: {
        display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
        color: BRAND.green, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: FONT, padding: 0,
    },
};

const formatSalary = (job) => formatJobSalary(job) || 'Not specified';

// ───── status/badge palettes derived from BRAND tokens ─────
const getStatusColor = (status) => {
    const map = {
        applied: { bg: `${BRAND.ink}0d`, text: BRAND.ink, label: 'Applied' },
        task_assigned: { bg: `${BRAND.green}17`, text: BRAND.green, label: 'Task Assigned' },
        task_submitted: { bg: `${BRAND.ink}0d`, text: BRAND.slate, label: 'Task Submitted' },
        test_assigned: { bg: `${BRAND.gold}17`, text: BRAND.gold, label: 'Test Assigned' },
        test_completed: { bg: `${BRAND.ink}0d`, text: BRAND.slate, label: 'Test Done' },
        test_passed: { bg: `${BRAND.green}17`, text: BRAND.green, label: 'Test Passed' },
        test_failed: { bg: `${BRAND.crimson}14`, text: BRAND.crimson, label: 'Test Failed' },
        interview_scheduled: { bg: `${BRAND.gold}17`, text: BRAND.gold, label: 'Interview Set' },
        interview_completed: { bg: `${BRAND.green}17`, text: BRAND.green, label: 'Interviewed' },
        waiting: { bg: `${BRAND.gold}17`, text: BRAND.gold, label: 'Waiting' },
        notice_period: { bg: `${BRAND.gold}17`, text: BRAND.gold, label: 'Notice Period' },
        hired: { bg: `${BRAND.green}17`, text: BRAND.green, label: 'Hired' },
        rejected: { bg: `${BRAND.crimson}14`, text: BRAND.crimson, label: 'Rejected' },
    };
    return map[status] || { bg: BRAND.surfaceAlt, text: BRAND.muted, label: status };
};

const getJobTypeBadgeStyle = (type) => {
    const map = {
        remote: { bg: `${BRAND.green}14`, text: BRAND.green },
        onsite: { bg: `${BRAND.ink}0d`, text: BRAND.ink },
        hybrid: { bg: `${BRAND.gold}17`, text: BRAND.gold },
    };
    return map[type] || { bg: BRAND.surfaceAlt, text: BRAND.muted };
};

const JobsBrowse = () => {
    const navigate = useNavigate();
    const { isMobile, isCompact } = useResponsive();
    const [searchParams] = useSearchParams();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [myApplications, setMyApplications] = useState([]);
    const [loadingApps, setLoadingApps] = useState(false);
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        job_type: '',
        selection_type: '',
        sort_by: '-created_at',
    });
    const [pagination, setPagination] = useState({ page: 1, total_pages: 1, count: 0 });

    useEffect(() => {
        const currentUser = jobSeekerAuthService.getCurrentUser();
        setUser(currentUser);
        if (currentUser) loadMyApplications();
    }, []);

    useEffect(() => {
        loadJobs();
    }, [filters, pagination.page]);

    const loadJobs = async () => {
        setLoading(true);
        try {
            const data = await jobsService.getPublicJobs({ ...filters, page: pagination.page });
            setJobs(data.results || []);
            setPagination(prev => ({
                ...prev,
                total_pages: data.total_pages || 1,
                count: data.count || 0,
            }));
        } catch (error) {
            console.error('Error loading jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMyApplications = async () => {
        setLoadingApps(true);
        try {
            const data = await jobsService.getMyApplications();
            setMyApplications(Array.isArray(data) ? data : data.results || []);
        } catch (err) {
            console.error('Error loading applications:', err);
        } finally {
            setLoadingApps(false);
        }
    };

    const clearFilters = () => {
        setFilters({ search: '', job_type: '', selection_type: '', sort_by: '-created_at' });
    };

    const appStats = {
        total: myApplications.length,
        active: myApplications.filter(a => !['hired', 'rejected'].includes(a.status)).length,
        hired: myApplications.filter(a => a.status === 'hired').length,
    };

    return (
        <div style={{ ...page.root, minHeight: '100vh' }}>
            <UserNavbar />

            <div style={{
                ...s.page,
                ...(isCompact ? { flexDirection: 'column' } : {}),
                ...(isMobile ? { padding: '18px 14px' } : {}),
            }}>
                <aside style={{
                    ...s.leftSidebar,
                    ...(isCompact ? { width: '100%', position: 'static', maxHeight: 'none', overflowY: 'visible' } : {}),
                }}>
                    {user ? (
                        <div style={s.profileCard}>
                            <div style={s.profileBanner} />
                            <div style={s.profileAvatarWrap}>
                                {user.profile_picture
                                    ? <img src={user.profile_picture} alt="" style={s.profileAvatar} />
                                    : <div style={s.profileAvatarInitial}>{(user.first_name || user.username || 'U')[0].toUpperCase()}</div>
                                }
                            </div>
                            <div style={s.profileInfo}>
                                <h3 style={s.profileName}>{user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username}</h3>
                                <p style={s.profileEmail}>{user.email}</p>
                                {user.current_job && <p style={s.profileJob}>{user.current_job}</p>}
                            </div>
                            <div style={s.profileStats}>
                                <div style={s.statItem}>
                                    <span style={s.statNum}>{appStats.total}</span>
                                    <span style={s.statLabel}>Applied</span>
                                </div>
                                <div style={s.statDivider} />
                                <div style={s.statItem}>
                                    <span style={s.statNum}>{appStats.active}</span>
                                    <span style={s.statLabel}>Active</span>
                                </div>
                                <div style={s.statDivider} />
                                <div style={s.statItem}>
                                    <span style={{ ...s.statNum, color: BRAND.green }}>{appStats.hired}</span>
                                    <span style={s.statLabel}>Hired</span>
                                </div>
                            </div>
                            <div style={s.profileActions}>
                                <button onClick={() => navigate('/profile')} style={btn.primary}>
                                    <User size={14} /> Edit Profile
                                </button>
                                <button onClick={() => navigate('/my-applications')} style={btn.ghost}>
                                    <FileText size={14} /> All Applications
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={s.loginPromptCard}>
                            <div style={s.loginPromptIcon}><User size={30} color={BRAND.green} strokeWidth={1.75} /></div>
                            <h3 style={s.loginPromptTitle}>Track Your Applications</h3>
                            <p style={s.loginPromptText}>Sign in to apply for jobs and track your application status in real-time.</p>
                            <button onClick={() => navigate('/login')} style={{ ...btn.primary, width: '100%', marginBottom: 8 }}>Sign In</button>
                            <button onClick={() => navigate('/register')} style={{ ...btn.ghost, width: '100%' }}>Create Account</button>
                        </div>
                    )}

                    {user && (
                        <div style={s.appliedPanel}>
                            <div style={s.appliedPanelHeader}>
                                <h4 style={s.appliedPanelTitle}>
                                    <TrendingUp size={15} color={BRAND.green} strokeWidth={1.75} /> My Applications
                                </h4>
                                <button onClick={() => navigate('/my-applications')} style={btn.text} className="brand-link">See all</button>
                            </div>
                            {loadingApps ? (
                                <div style={s.miniLoader}><div style={s.miniSpinner} /></div>
                            ) : myApplications.length === 0 ? (
                                <div style={s.noAppsMsg}>
                                    <Briefcase size={28} color={BRAND.line} strokeWidth={1.75} />
                                    <p style={s.noAppsMsgText}>No applications yet. Start applying!</p>
                                </div>
                            ) : (
                                <div style={s.appList}>
                                    {myApplications.slice(0, 6).map(app => {
                                        const statusStyle = getStatusColor(app.status);
                                        return (
                                            <div key={app.id} style={s.appItem} onClick={() => navigate(`/my-applications/${app.id}`)}>
                                                <div style={s.appItemLeft}>
                                                    <div style={s.appItemLogo}>
                                                        {app.job_department_logo
                                                            ? <img src={app.job_department_logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                            : <span style={s.appItemLogoChar}>{(app.job_title || 'J')[0]}</span>
                                                        }
                                                    </div>
                                                    <div style={s.appItemInfo}>
                                                        <p style={s.appItemTitle}>{app.job_title || 'Job'}</p>
                                                        <p style={s.appItemDept}>{app.job_department_name || ''}</p>
                                                    </div>
                                                </div>
                                                <span style={{ ...s.statusBadge, background: statusStyle.bg, color: statusStyle.text }}>
                                                    {statusStyle.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                            <div style={s.statusLegend}>
                                <p style={s.legendTitle}>Status Guide</p>
                                {['applied', 'test_passed', 'hired', 'rejected'].map(st => {
                                    const style = getStatusColor(st);
                                    return (
                                        <div key={st} style={s.legendItem}>
                                            <span style={{ ...s.legendDot, background: style.text }} />
                                            <span style={s.legendLabel}>{style.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div style={s.filterCard}>
                        <div style={s.filterCardHeader}>
                            <h4 style={s.filterCardTitle}><Filter size={14} strokeWidth={1.75} /> Filters</h4>
                            <button onClick={clearFilters} style={btn.text} className="brand-link">Clear</button>
                        </div>
                        <div style={s.filterGroup}>
                            <label style={s.filterLabel}>Job Type</label>
                            <select value={filters.job_type} onChange={e => setFilters(f => ({ ...f, job_type: e.target.value }))} style={s.select}>
                                <option value="">All Types</option>
                                <option value="onsite">On Site</option>
                                <option value="remote">Remote</option>
                                <option value="hybrid">Hybrid</option>
                            </select>
                        </div>
                        <div style={s.filterGroup}>
                            <label style={s.filterLabel}>Selection</label>
                            <select value={filters.selection_type} onChange={e => setFilters(f => ({ ...f, selection_type: e.target.value }))} style={s.select}>
                                <option value="">All</option>
                                <option value="test">Test Only</option>
                                <option value="interview">Interview Only</option>
                                <option value="test_interview">Test + Interview</option>
                            </select>
                        </div>
                        <div style={s.filterGroup}>
                            <label style={s.filterLabel}>Sort By</label>
                            <select value={filters.sort_by} onChange={e => setFilters(f => ({ ...f, sort_by: e.target.value }))} style={s.select}>
                                <option value="-created_at">Newest First</option>
                                <option value="created_at">Oldest First</option>
                            </select>
                        </div>
                    </div>
                </aside>

                <main style={s.main}>
                    <div style={s.mainHeader}>
                        <div>
                            <h2 style={s.mainTitle}>Browse Jobs</h2>
                            <span style={s.mainCount}>{pagination.count} positions available</span>
                        </div>
                    </div>

                    <div style={{ ...s.searchBar, ...(isMobile ? { flexDirection: 'column', alignItems: 'stretch', gap: 8 } : {}) }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                            <Search size={18} color={BRAND.faint} strokeWidth={1.75} />
                            <input
                                style={s.searchInput}
                                placeholder="Search by title, skills, or company..."
                                value={filters.search}
                                onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
                                onKeyPress={e => e.key === 'Enter' && loadJobs()}
                            />
                        </div>
                        <button onClick={loadJobs} style={{ ...btn.primary, ...(isMobile ? { width: '100%' } : {}) }}>Search</button>
                    </div>

                    {loading ? (
                        <JobListSkeleton count={5} />
                    ) : jobs.length === 0 ? (
                        <div style={s.emptyState}>
                            <Briefcase size={52} color={BRAND.line} strokeWidth={1.5} />
                            <h3 style={s.emptyTitle}>No jobs found</h3>
                            <p style={s.emptyText}>Try different keywords or clear filters</p>
                            <button onClick={clearFilters} style={btn.primary}>Clear Filters</button>
                        </div>
                    ) : (
                        <>
                            {jobs.map(job => (
                                <JobCard key={job.id} job={job} onClick={() => navigate(`/jobs/${job.slug || job.id}`)} myApplications={myApplications} isMobile={isMobile} />
                            ))}
                            {pagination.total_pages > 1 && (
                                <div style={s.pagination}>
                                    <button
                                        onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                                        disabled={pagination.page === 1}
                                        style={{ ...btn.ghost, ...(pagination.page === 1 ? s.pageBtnDisabled : {}) }}
                                    >Previous</button>
                                    <span style={s.pageInfo}>Page {pagination.page} of {pagination.total_pages}</span>
                                    <button
                                        onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                                        disabled={pagination.page === pagination.total_pages}
                                        style={{ ...btn.ghost, ...(pagination.page === pagination.total_pages ? s.pageBtnDisabled : {}) }}
                                    >Next</button>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

const JobCard = ({ job, onClick, myApplications, isMobile }) => {
    const [hovered, setHovered] = useState(false);
    const application = myApplications?.find(a => a.job === job.id || a.job_id === job.id);
    const statusStyle = application ? getStatusColor(application.status) : null;
    const jobTypeBadge = getJobTypeBadgeStyle(job.job_type);
    const selectionLabel = { test: 'Test', interview: 'Interview', test_interview: 'Test + Interview' }[job.selection_type] || job.selection_type;
    const vacanciesLeft = (job.vacancies || 0) - (job.filled_positions || 0);

    return (
        <div
            style={{ ...s.card, ...(isMobile ? { padding: '16px 16px' } : {}), ...(hovered ? s.cardHovered : {}) }}
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {statusStyle && (
                <div style={{ ...s.appliedBadge, background: statusStyle.bg, color: statusStyle.text, ...(isMobile ? { position: 'static', display: 'inline-flex', marginBottom: 10 } : {}) }}>
                    <CheckCircle size={12} strokeWidth={2} /> {statusStyle.label}
                </div>
            )}
            <div style={{ ...s.cardHeader, ...(isMobile ? { alignItems: 'flex-start', flexWrap: 'wrap' } : {}) }}>
                <div style={s.cardLogoWrap}>
                    {job.department_logo
                        ? <img src={job.department_logo} alt={job.department_name} style={s.cardLogo} />
                        : <div style={s.cardLogoPlaceholder}>{(job.department_name || 'C')[0]}</div>
                    }
                </div>
                <div style={s.cardTitleArea}>
                    <h3 style={{ ...s.cardTitle, paddingRight: isMobile ? 0 : 90, whiteSpace: isMobile ? 'normal' : 'nowrap' }}>{job.title}</h3>
                    <p style={s.cardCompany}>{job.department_name}</p>
                </div>
                <span style={{ ...s.typeBadge, background: jobTypeBadge.bg, color: jobTypeBadge.text }}>
                    {job.job_type?.replace('_', ' ') || 'Full Time'}
                </span>
            </div>
            <div style={s.cardMeta}>
                <span style={s.metaItem}><Banknote size={13} color={BRAND.faint} strokeWidth={1.75} />{formatSalary(job)}</span>
                <span style={s.metaItem}><Briefcase size={13} color={BRAND.faint} strokeWidth={1.75} />{selectionLabel}</span>
                <span style={s.metaItem}><User size={13} color={BRAND.faint} strokeWidth={1.75} />{vacanciesLeft > 0 ? `${vacanciesLeft} of ${job.vacancies} open` : 'Positions filled'}</span>
                <span style={s.metaItem}><Calendar size={13} color={BRAND.faint} strokeWidth={1.75} />{new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <p style={s.cardDesc}>
                {(job.description || 'No description available').substring(0, 220)}
                {job.description?.length > 220 ? '...' : ''}
            </p>
            {job.required_skills && (
                <div style={s.skillsRow}>
                    {job.required_skills.split(',').slice(0, 5).map((skill, i) => (
                        <span key={i} style={s.skillTag}>{skill.trim()}</span>
                    ))}
                    {job.required_skills.split(',').length > 5 && (
                        <span style={s.skillTagMore}>+{job.required_skills.split(',').length - 5} more</span>
                    )}
                </div>
            )}
            <div style={s.cardFooter}>
                <span style={{ ...s.vacancyPill, background: vacanciesLeft > 0 ? `${BRAND.green}17` : `${BRAND.crimson}14`, color: vacanciesLeft > 0 ? BRAND.green : BRAND.crimson }}>
                    {vacanciesLeft > 0 ? `${vacanciesLeft} ${vacanciesLeft === 1 ? 'vacancy' : 'vacancies'}` : 'Closed'}
                </span>
                <span style={s.viewLink}>View Details <ChevronRight size={15} strokeWidth={2} /></span>
            </div>
        </div>
    );
};

// ───── style dictionary — flat, hairline-bordered, brand-token driven ─────
const s = {
    page: { maxWidth: 1400, margin: '0 auto', padding: '28px 24px', display: 'flex', gap: 24, alignItems: 'flex-start', fontFamily: FONT },
    leftSidebar: { width: 290, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 80, maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' },

    profileCard: { background: BRAND.surface, borderRadius: 10, border: `1px solid ${BRAND.line}`, overflow: 'hidden', flexShrink: 0 },
    profileBanner: { height: 56, background: BRAND.green },
    profileAvatarWrap: { margin: '-26px 0 0 18px', marginBottom: 6 },
    profileAvatar: { width: 54, height: 54, borderRadius: '50%', border: `3px solid ${BRAND.surface}`, objectFit: 'cover' },
    profileAvatarInitial: { width: 54, height: 54, borderRadius: '50%', border: `3px solid ${BRAND.surface}`, background: BRAND.ink, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, fontWeight: 700, fontFamily: FONT },
    profileInfo: { padding: '0 18px 14px' },
    profileName: { fontSize: 15, fontWeight: 700, color: BRAND.ink, margin: '0 0 2px', fontFamily: FONT },
    profileEmail: { fontSize: 12, color: BRAND.faint, margin: 0 },
    profileJob: { fontSize: 12, color: BRAND.slate, margin: '3px 0 0', fontStyle: 'italic' },
    profileStats: { display: 'flex', borderTop: `1px solid ${BRAND.line}`, padding: '10px 18px' },
    statItem: { flex: 1, textAlign: 'center' },
    statNum: { display: 'block', fontSize: 17, fontWeight: 700, color: BRAND.ink, letterSpacing: '-0.3px' },
    statLabel: { fontSize: 10, color: BRAND.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' },
    statDivider: { width: 1, background: BRAND.line },
    profileActions: { padding: '10px 18px 16px', display: 'flex', flexDirection: 'column', gap: 8 },

    loginPromptCard: { background: BRAND.surface, borderRadius: 10, border: `1px solid ${BRAND.line}`, padding: '24px 20px', textAlign: 'center', flexShrink: 0 },
    loginPromptIcon: { width: 52, height: 52, borderRadius: '50%', background: `${BRAND.green}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' },
    loginPromptTitle: { fontSize: 15, fontWeight: 700, color: BRAND.ink, margin: '0 0 6px', fontFamily: FONT },
    loginPromptText: { fontSize: 13, color: BRAND.slate, lineHeight: 1.55, margin: '0 0 16px' },

    appliedPanel: { background: BRAND.surface, borderRadius: 10, border: `1px solid ${BRAND.line}`, overflow: 'hidden' },
    appliedPanelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px 12px', borderBottom: `1px solid ${BRAND.line}` },
    appliedPanelTitle: { display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 700, color: BRAND.ink, margin: 0, fontFamily: FONT },
    miniLoader: { display: 'flex', justifyContent: 'center', padding: 20 },
    miniSpinner: { width: 22, height: 22, border: `2px solid ${BRAND.line}`, borderTop: `2px solid ${BRAND.ink}`, borderRadius: '50%', animation: 'brandSpin .8s linear infinite' },
    noAppsMsg: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '20px', color: BRAND.faint },
    noAppsMsgText: { fontSize: 12, textAlign: 'center', lineHeight: 1.5, margin: 0, color: BRAND.muted },
    appList: { padding: '4px 0' },
    appItem: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 18px', cursor: 'pointer', gap: 8, transition: 'background .15s ease' },
    appItemLeft: { display: 'flex', alignItems: 'center', gap: 9, flex: 1, minWidth: 0 },
    appItemLogo: { width: 32, height: 32, borderRadius: 7, background: BRAND.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, border: `1px solid ${BRAND.line}` },
    appItemLogoChar: { fontSize: 13, fontWeight: 700, color: BRAND.ink },
    appItemInfo: { flex: 1, minWidth: 0 },
    appItemTitle: { fontSize: 12, fontWeight: 600, color: BRAND.ink, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    appItemDept: { fontSize: 10, color: BRAND.faint, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    statusBadge: { fontSize: 9, fontWeight: 700, padding: '3px 7px', borderRadius: 6, flexShrink: 0, whiteSpace: 'nowrap' },
    statusLegend: { padding: '10px 18px 14px', borderTop: `1px solid ${BRAND.line}` },
    legendTitle: { fontSize: 10, fontWeight: 700, color: BRAND.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' },
    legendItem: { display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 },
    legendDot: { width: 6, height: 6, borderRadius: '50%', flexShrink: 0 },
    legendLabel: { fontSize: 11, color: BRAND.slate },

    filterCard: { background: BRAND.surface, borderRadius: 10, border: `1px solid ${BRAND.line}`, padding: '14px 18px', flexShrink: 0 },
    filterCardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
    filterCardTitle: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 700, color: BRAND.ink, margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: FONT },
    filterGroup: { marginBottom: 12 },
    filterLabel: { display: 'block', fontSize: 11, fontWeight: 600, color: BRAND.slate, marginBottom: 5 },
    select: { width: '100%', padding: '9px 10px', border: `1px solid ${BRAND.line}`, borderRadius: 8, fontSize: 13, color: BRAND.ink, outline: 'none', background: BRAND.surface, cursor: 'pointer', fontFamily: FONT },

    main: { flex: 1, minWidth: 0 },
    mainHeader: { marginBottom: 14 },
    mainTitle: { fontSize: 22, fontWeight: 700, color: BRAND.ink, margin: '0 0 2px', letterSpacing: '-0.5px', fontFamily: FONT },
    mainCount: { fontSize: 14, color: BRAND.slate },

    searchBar: { display: 'flex', alignItems: 'center', gap: 10, background: BRAND.surface, border: `1px solid ${BRAND.ink}`, borderRadius: 8, padding: '10px 16px', marginBottom: 18 },
    searchInput: { flex: 1, border: 'none', outline: 'none', fontSize: 15, color: BRAND.ink, background: 'transparent', fontFamily: FONT },

    loader: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0' },
    spinner: { width: 32, height: 32, border: `2px solid ${BRAND.line}`, borderTop: `2px solid ${BRAND.ink}`, borderRadius: '50%', animation: 'brandSpin .8s linear infinite' },

    emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '80px 20px', background: BRAND.surface, borderRadius: 10, border: `1px solid ${BRAND.line}` },
    emptyTitle: { fontSize: 19, fontWeight: 700, color: BRAND.ink, margin: 0, fontFamily: FONT },
    emptyText: { fontSize: 14, color: BRAND.slate, margin: 0 },

    card: { background: BRAND.surface, borderRadius: 10, border: `1px solid ${BRAND.line}`, padding: '20px 22px', marginBottom: 14, cursor: 'pointer', transition: 'background .15s ease, border-color .15s ease', position: 'relative' },
    cardHovered: { background: BRAND.surfaceAlt, border: `1px solid ${BRAND.ink}` },
    appliedBadge: { position: 'absolute', top: 14, right: 14, display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 6 },
    cardHeader: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 },
    cardLogoWrap: { flexShrink: 0 },
    cardLogo: { width: 48, height: 48, borderRadius: 8, border: `1px solid ${BRAND.line}`, objectFit: 'cover' },
    cardLogoPlaceholder: { width: 48, height: 48, borderRadius: 8, background: BRAND.surfaceAlt, color: BRAND.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, fontWeight: 800, border: `1px solid ${BRAND.line}` },
    cardTitleArea: { flex: 1, minWidth: 0 },
    cardTitle: { fontSize: 16.5, fontWeight: 700, color: BRAND.ink, margin: '0 0 3px', paddingRight: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: FONT },
    cardCompany: { fontSize: 13, color: BRAND.slate, margin: 0 },
    typeBadge: { fontSize: 11, fontWeight: 600, padding: '4px 11px', borderRadius: 6, textTransform: 'capitalize', flexShrink: 0 },
    cardMeta: { display: 'flex', gap: 18, marginBottom: 10, flexWrap: 'wrap' },
    metaItem: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: BRAND.slate },
    cardDesc: { fontSize: 13.5, color: BRAND.slate, lineHeight: 1.65, margin: '0 0 12px' },
    skillsRow: { display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
    skillTag: { background: BRAND.surfaceAlt, color: BRAND.ink, fontSize: 11, fontWeight: 500, padding: '3px 9px', borderRadius: 6, border: `1px solid ${BRAND.line}` },
    skillTagMore: { background: 'transparent', color: BRAND.muted, fontSize: 11, fontWeight: 500, padding: '3px 9px', borderRadius: 6, border: `1px solid ${BRAND.line}` },
    cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: `1px solid ${BRAND.line}` },
    vacancyPill: { fontSize: 11, fontWeight: 600, padding: '4px 11px', borderRadius: 6 },
    viewLink: { display: 'flex', alignItems: 'center', gap: 2, color: BRAND.green, fontSize: 13, fontWeight: 600 },

    pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, padding: '18px', background: BRAND.surface, borderRadius: 10, border: `1px solid ${BRAND.line}` },
    pageBtnDisabled: { opacity: 0.4, cursor: 'not-allowed' },
    pageInfo: { fontSize: 13, color: BRAND.slate, fontWeight: 600 },
};

export default JobsBrowse;