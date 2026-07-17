import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft, Banknote, Briefcase, Calendar, Clock,
    CheckCircle, XCircle, FileText, User, AlertCircle,
    Award, ChevronRight, Building2, MapPin, Star, BookOpen
} from 'lucide-react';
import { COLORS } from '../constants/colors';
import { jobsService } from '../services/jobsService';
import { jobSeekerAuthService } from '../services/jobSeekerAuthService';
import { useResponsive } from '../hooks/useResponsive';
import UserNavbar from '../components/brand/UserNavbar';
import { formatJobSalary } from '../utils/currency';

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_MAP = {
    applied:              { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE', label: 'Applied',             icon: Clock },
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
const getStatus = (s) => STATUS_MAP[s] || { bg: '#F9FAFB', text: '#374151', border: '#E5E7EB', label: s, icon: Clock };

// ─── Timeline steps ───────────────────────────────────────────────────────────

const PIPELINE = [
    { key: 'applied',             label: 'Applied' },
    { key: 'test',                label: 'Test' },
    { key: 'interview',           label: 'Interview' },
    { key: 'waiting',             label: 'Review' },
    { key: 'notice_period',       label: 'Notice' },
    { key: 'hired',               label: 'Hired' },
];

const getPipelineStep = (status) => {
    if (['applied'].includes(status))                                         return 0;
    if (['test_assigned','test_completed','test_passed','test_failed'].includes(status)) return 1;
    if (['interview_scheduled','interview_completed'].includes(status))       return 2;
    if (status === 'waiting')                                                 return 3;
    if (status === 'notice_period')                                           return 4;
    if (status === 'hired')                                                   return 5;
    if (status === 'rejected')                                                return -1;
    return 0;
};

// ─── Main Component ───────────────────────────────────────────────────────────

const ApplicationDetail = () => {
    const navigate = useNavigate();
    const { isMobile, isCompact } = useResponsive();
    const { id } = useParams();
    const [application, setApplication] = useState(null);
    const [loading, setLoading]         = useState(true);
    const [withdrawing, setWithdrawing] = useState(false);
    const [user, setUser]               = useState(null);

    useEffect(() => {
        const currentUser = jobSeekerAuthService.getCurrentUser();
        if (!currentUser) { navigate('/login'); return; }
        setUser(currentUser);
        loadApplication();
    }, [id]);

    const loadApplication = async () => {
        setLoading(true);
        try {
            const data = await jobsService.getMyApplicationDetail(id);
            setApplication(data);
        } catch (err) {
            console.error('Error loading application:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async () => {
        if (!window.confirm('Are you sure you want to withdraw this application?')) return;
        setWithdrawing(true);
        try {
            await jobsService.withdrawApplication(id);
            navigate('/my-applications');
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to withdraw application');
        } finally {
            setWithdrawing(false);
        }
    };

    if (loading) return (
        <div style={s.fullCenter}>
            <div style={s.spinner} />
            <p style={{ color: '#94A3B8', marginTop: 12 }}>Loading application...</p>
        </div>
    );

    if (!application) return (
        <div style={s.fullCenter}>
            <AlertCircle size={40} color="#CBD5E1" />
            <p style={{ color: '#64748B', marginTop: 12 }}>Application not found</p>
            <button onClick={() => navigate('/my-applications')} style={s.primaryBtn}>Back to Applications</button>
        </div>
    );

    const st          = getStatus(application.status);
    const StatusIcon  = st.icon;
    const pipelineStep = getPipelineStep(application.status);
    const isRejected  = application.status === 'rejected';
    const isHired     = application.status === 'hired';

    const jd = application.job_details      || {};
    const cd = application.company_details  || {};
    const td = application.test_details     || {};
    const iv = application.interview_details || {};
    const rd = application.resume_details   || {};

    return (
        <div style={s.root}>

            {/* Navbar */}
            <UserNavbar />

            <div style={{ ...s.page, ...(isMobile ? { padding: '16px' } : {}) }}>
                <button onClick={() => navigate('/my-applications')} style={s.backBtn}>
                    <ArrowLeft size={16} /> Back to Applications
                </button>

                <div style={{ ...s.layout, ...(isCompact ? { flexDirection: 'column' } : {}) }}>

                    {/* ── MAIN COLUMN ── */}
                    <div style={s.mainCol}>

                        {/* Hero card */}
                        <div style={s.heroCard}>
                            <div style={{ ...s.heroTop, ...(isMobile ? { flexWrap: 'wrap' } : {}) }}>
                                <div style={s.heroLogo}>
                                    {cd.logo_url
                                        ? <img src={cd.logo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} />
                                        : <div style={s.heroLogoPlaceholder}>{(cd.name || 'C')[0]}</div>
                                    }
                                </div>
                                <div style={s.heroInfo}>
                                    <h1 style={s.jobTitle}>{jd.title || '—'}</h1>
                                    <p style={s.companyName}><Building2 size={14} /> {cd.name || '—'}</p>
                                </div>
                                <span style={{ ...s.statusPill, background: st.bg, color: st.text, border: `1px solid ${st.border}` }}>
                                    <StatusIcon size={14} /> {st.label}
                                </span>
                            </div>

                            {/* Meta strip */}
                            <div style={{ ...s.metaStrip, ...(isMobile ? { display: 'grid', gridTemplateColumns: '1fr 1fr' } : {}) }}>
                                <MetaBox icon={<Calendar size={16} />} label="Applied On"  value={new Date(application.applied_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} />
                                <MetaBox icon={<Briefcase size={16} />} label="Job Type"   value={jd.job_type?.replace('_', ' ') || '—'} />
                                <MetaBox icon={<Banknote size={16} />} label="Salary"    value={formatJobSalary(jd) || 'Not specified'} />
                                <MetaBox icon={<Award size={16} />} label="Selection"      value={jd.selection_type?.replace('_', ' ') || '—'} />
                            </div>
                        </div>

                        {/* Pipeline tracker */}
                        {!isRejected && (
                            <div style={s.pipelineCard}>
                                <h3 style={s.sectionTitle}>Application Progress</h3>
                                <div style={{ ...s.pipeline, ...(isMobile ? { overflowX: 'auto', paddingBottom: 4 } : {}) }}>
                                    {PIPELINE.map((step, i) => {
                                        const done    = pipelineStep > i;
                                        const current = pipelineStep === i;
                                        return (
                                            <React.Fragment key={step.key}>
                                                <div style={s.pipelineStep}>
                                                    <div style={{
                                                        ...s.pipelineCircle,
                                                        background: done ? COLORS.secondary : current ? COLORS.primary : '#E2E8F0',
                                                        color: (done || current) ? 'white' : '#94A3B8',
                                                        border: current ? `2px solid ${COLORS.primary}` : 'none',
                                                        boxShadow: current ? `0 0 0 4px ${COLORS.primary}20` : 'none',
                                                    }}>
                                                        {done ? <CheckCircle size={14} /> : i + 1}
                                                    </div>
                                                    <span style={{ ...s.pipelineLabel, color: (done || current) ? '#0F172A' : '#94A3B8', fontWeight: current ? 700 : 400 }}>
                                                        {step.label}
                                                    </span>
                                                </div>
                                                {i < PIPELINE.length - 1 && (
                                                    <div style={{ ...s.pipelineLine, background: done ? COLORS.secondary : '#E2E8F0' }} />
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Hired banner */}
                        {isHired && (
                            <div style={s.hiredBanner}>
                                <Award size={28} color="#14532D" />
                                <div>
                                    <h3 style={s.hiredTitle}>Congratulations! You've been hired 🎉</h3>
                                    <p style={s.hiredSub}>You have been selected for <strong>{jd.title}</strong> at <strong>{cd.name}</strong>.</p>
                                </div>
                            </div>
                        )}

                        {/* Rejected banner */}
                        {isRejected && (
                            <div style={s.rejectedBanner}>
                                <XCircle size={24} color="#991B1B" />
                                <div>
                                    <h3 style={s.rejectedTitle}>Application Rejected</h3>
                                    {application.rejection_reason && (
                                        <p style={s.rejectedReason}>{application.rejection_reason}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Test section */}
                        {td.has_test && (
                            <div style={s.card}>
                                <h2 style={s.sectionTitle}><FileText size={16} /> Test Information</h2>
                                <div style={{ ...s.testTopRow, ...(isMobile ? { flexDirection: 'column', gap: 12 } : {}) }}>
                                    <div>
                                        <p style={s.testChapter}>{td.chapter_name}</p>
                                        {td.deadline && (
                                            <p style={s.testDeadline}>
                                                <Clock size={13} /> Deadline: {new Date(td.deadline).toLocaleString()}
                                            </p>
                                        )}
                                        <p style={s.testDeadline}>Pass mark: {td.pass_percentage}%</p>
                                    </div>
                                    {application.status === 'test_assigned' && (
                                        <button onClick={() => navigate(`/test/${application.id}`)} style={s.takeTestBtn}>
                                            Take Test Now →
                                        </button>
                                    )}
                                </div>

                                {td.test_completed && td.result && (
                                    <div style={{ ...s.resultBox, borderColor: td.result.passed ? '#BBF7D0' : '#FECACA', background: td.result.passed ? '#F0FDF4' : '#FEF2F2' }}>
                                        <div style={s.resultRow}>
                                            <div style={s.resultStat}>
                                                <span style={s.resultStatNum} >{Math.round(td.result.percentage)}%</span>
                                                <span style={s.resultStatLabel}>Score</span>
                                            </div>
                                            <div style={s.resultStat}>
                                                <span style={s.resultStatNum}>{td.result.correct_answers}/{td.result.total_questions}</span>
                                                <span style={s.resultStatLabel}>Correct</span>
                                            </div>
                                            <div style={s.resultStat}>
                                                <span style={{ ...s.resultStatNum, color: td.result.passed ? '#15803D' : '#B91C1C' }}>
                                                    {td.result.passed ? '✓ Passed' : '✗ Failed'}
                                                </span>
                                                <span style={s.resultStatLabel}>Result</span>
                                            </div>
                                        </div>
                                        <button onClick={() => navigate(`/test-results/${application.id}`)} style={s.viewResultsBtn}>
                                            View Detailed Results <ChevronRight size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Interview section */}
                        {iv.has_interview && (
                            <div style={s.card}>
                                <h2 style={s.sectionTitle}><Calendar size={16} /> Interview Details</h2>
                                <div style={{ ...s.interviewGrid, ...(isMobile ? { gridTemplateColumns: '1fr' } : {}) }}>
                                    <div style={s.interviewItem}>
                                        <p style={s.interviewLabel}>Date & Time</p>
                                        <p style={s.interviewValue}>{new Date(iv.interview_datetime).toLocaleString()}</p>
                                    </div>
                                    <div style={s.interviewItem}>
                                        <p style={s.interviewLabel}>Interview Link</p>
                                        <a href={iv.interview_link} target="_blank" rel="noopener noreferrer" style={s.interviewLink}>
                                            Join Interview →
                                        </a>
                                    </div>
                                </div>
                                {iv.message && (
                                    <div style={s.interviewMsg}>
                                        <AlertCircle size={16} color={COLORS.accent} />
                                        <p style={{ margin: 0, fontSize: 14, color: '#475569', lineHeight: 1.6 }}>{iv.message}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Job description */}
                        <div style={s.card}>
                            <h2 style={s.sectionTitle}><Briefcase size={16} /> Job Description</h2>
                            <p style={s.bodyText}>{jd.description || 'No description available.'}</p>
                        </div>

                        {/* Actions */}
                        {application.status === 'applied' && (
                            <div style={s.actionsRow}>
                                <button onClick={handleWithdraw} disabled={withdrawing} style={s.withdrawBtn}>
                                    <XCircle size={15} /> {withdrawing ? 'Withdrawing...' : 'Withdraw Application'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT SIDEBAR ── */}
                    <aside style={{ ...s.sidebar, ...(isCompact ? { width: '100%', position: 'static' } : {}) }}>

                        {/* Resume submitted */}
                        <div style={s.sideCard}>
                            <h4 style={s.sideCardTitle}><FileText size={14} /> Resume Submitted</h4>
                            {rd && (rd.title || rd.education) ? (
                                <>
                                    {rd.title && rd.title !== 'Profile Data' && (
                                        <div style={s.resumeTitleRow}>
                                            <span style={s.resumeTitle}>{rd.title}</span>
                                            {rd.is_primary && <span style={s.primaryBadge}><Star size={10} fill="#F59E0B" color="#F59E0B" /> Primary</span>}
                                        </div>
                                    )}
                                    <ResumeField label="Father's Name" value={rd.father_name} />
                                    <ResumeField label="CNIC"          value={rd.cnic} />
                                    <ResumeField label="Address"       value={rd.address} />
                                    {rd.current_job && <ResumeField label="Current Job" value={rd.current_job} />}
                                    {rd.education && (
                                        <div style={s.resumeSection}>
                                            <p style={s.resumeFieldLabel}><BookOpen size={11} /> Education</p>
                                            <p style={s.resumeFieldValue}>{rd.education}</p>
                                        </div>
                                    )}
                                    {rd.experience && (
                                        <div style={s.resumeSection}>
                                            <p style={s.resumeFieldLabel}><Briefcase size={11} /> Experience</p>
                                            <p style={s.resumeFieldValue}>{rd.experience}</p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p style={{ fontSize: 13, color: '#94A3B8' }}>No resume data available</p>
                            )}
                        </div>

                        {/* Company info */}
                        <div style={s.sideCard}>
                            <h4 style={s.sideCardTitle}><Building2 size={14} /> About {cd.name}</h4>
                            {cd.tagline && <p style={s.companyTagline}>{cd.tagline}</p>}
                            {cd.ceo_name && <ResumeField label="CEO" value={cd.ceo_name} />}
                            {cd.email    && <ResumeField label="Email" value={cd.email} />}
                        </div>

                        {/* Quick links */}
                        <div style={s.sideCard}>
                            <h4 style={s.sideCardTitle}>Quick Links</h4>
                            <button onClick={() => navigate('/my-applications')} style={s.sideLink}>
                                <FileText size={13} /> All Applications <ChevronRight size={13} style={{ marginLeft: 'auto' }} />
                            </button>
                            <button onClick={() => navigate('/profile')} style={s.sideLink}>
                                <User size={13} /> Edit Profile <ChevronRight size={13} style={{ marginLeft: 'auto' }} />
                            </button>
                            <button onClick={() => navigate('/jobs')} style={s.sideLink}>
                                <Briefcase size={13} /> Browse Jobs <ChevronRight size={13} style={{ marginLeft: 'auto' }} />
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const MetaBox = ({ icon, label, value }) => (
    <div style={s.metaBox}>
        <div style={s.metaBoxIcon}>{icon}</div>
        <div>
            <p style={s.metaBoxLabel}>{label}</p>
            <p style={s.metaBoxValue}>{value}</p>
        </div>
    </div>
);

const ResumeField = ({ label, value }) => (
    value ? (
        <div style={{ marginBottom: 10 }}>
            <p style={s.resumeFieldLabel}>{label}</p>
            <p style={s.resumeFieldValue}>{value}</p>
        </div>
    ) : null
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = {
    root:      { minHeight: '100vh', background: '#F1F5F9', fontFamily: "system-ui, -apple-system, sans-serif" },
    fullCenter:{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 12 },
    spinner:   { width: 36, height: 36, border: '4px solid #E2E8F0', borderTop: `4px solid ${COLORS.primary}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
    primaryBtn:{ background: COLORS.primary, color: 'white', border: 'none', padding: '11px 24px', borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: 'pointer' },

    navbar:     { background: 'white', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 200, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
    navInner:   { maxWidth: 1400, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', gap: 20 },
    logo:       { display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flexShrink: 0 },
    logoMark:   { display: 'flex', gap: 3 },
    dot:        { width: 10, height: 10, borderRadius: '50%' },
    logoText:   { fontSize: 20, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' },
    navRight:   { display: 'flex', alignItems: 'center', gap: 16, marginLeft: 'auto' },
    navTextBtn: { background: 'none', border: 'none', color: '#475569', fontSize: 14, fontWeight: 500, cursor: 'pointer' },
    logoutBtn:  { display: 'flex', alignItems: 'center', gap: 6, background: '#FEF2F2', color: '#DC2626', border: 'none', padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' },
    avatarWrap: { width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', border: '2px solid #E2E8F0' },
    avatarImg:  { width: '100%', height: '100%', objectFit: 'cover' },
    avatarInitial:{ width: '100%', height: '100%', background: '#EFF6FF', color: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 },

    page:    { maxWidth: 1300, margin: '0 auto', padding: '28px 24px' },
    backBtn: { display: 'inline-flex', alignItems: 'center', gap: 7, background: 'none', border: 'none', color: '#64748B', fontSize: 14, fontWeight: 500, cursor: 'pointer', marginBottom: 20, padding: '6px 0' },
    layout:  { display: 'flex', gap: 24, alignItems: 'flex-start' },

    mainCol: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 },
    sidebar: { width: 300, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 80 },

    heroCard:          { background: 'white', borderRadius: 16, border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
    heroTop:           { display: 'flex', alignItems: 'center', gap: 16, padding: '24px 24px 0' },
    heroLogo:          { width: 60, height: 60, borderRadius: 12, border: '1px solid #E2E8F0', overflow: 'hidden', flexShrink: 0 },
    heroLogoPlaceholder:{ width: 60, height: 60, borderRadius: 12, background: '#EFF6FF', color: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800 },
    heroInfo:          { flex: 1, minWidth: 0 },
    jobTitle:          { fontSize: 22, fontWeight: 800, color: '#0F172A', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    companyName:       { display: 'flex', alignItems: 'center', gap: 5, fontSize: 14, color: '#64748B', margin: 0 },
    statusPill:        { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, flexShrink: 0, whiteSpace: 'nowrap' },
    metaStrip:         { display: 'flex', borderTop: '1px solid #F1F5F9', margin: '16px 0 0' },
    metaBox:           { flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px' },
    metaBoxIcon:       { width: 34, height: 34, borderRadius: 8, background: `${COLORS.primary}10`, color: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    metaBoxLabel:      { fontSize: 10, color: '#94A3B8', fontWeight: 500, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.04em' },
    metaBoxValue:      { fontSize: 13, fontWeight: 700, color: '#0F172A', margin: 0 },

    pipelineCard:   { background: 'white', borderRadius: 14, border: '1px solid #E2E8F0', padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
    pipeline:       { display: 'flex', alignItems: 'center', marginTop: 16 },
    pipelineStep:   { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 },
    pipelineCircle: { width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, transition: 'all 0.2s' },
    pipelineLabel:  { fontSize: 11, textAlign: 'center', whiteSpace: 'nowrap' },
    pipelineLine:   { flex: 1, height: 2, margin: '0 4px', marginBottom: 22, transition: 'background 0.2s' },

    hiredBanner:   { display: 'flex', gap: 16, alignItems: 'flex-start', background: '#F0FDF4', border: '2px solid #86EFAC', borderRadius: 14, padding: '20px 24px' },
    hiredTitle:    { fontSize: 17, fontWeight: 700, color: '#14532D', margin: '0 0 4px' },
    hiredSub:      { fontSize: 13, color: '#166534', margin: 0 },
    rejectedBanner:{ display: 'flex', gap: 16, alignItems: 'flex-start', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 14, padding: '20px 24px' },
    rejectedTitle: { fontSize: 17, fontWeight: 700, color: '#991B1B', margin: '0 0 4px' },
    rejectedReason:{ fontSize: 13, color: '#B91C1C', margin: 0, lineHeight: 1.6 },

    card:          { background: 'white', borderRadius: 14, border: '1px solid #E2E8F0', padding: '22px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
    sectionTitle:  { display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 16px' },
    bodyText:      { fontSize: 14, color: '#475569', lineHeight: 1.7, margin: 0 },

    testTopRow:    { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
    testChapter:   { fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 6px' },
    testDeadline:  { display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#64748B', margin: '0 0 4px' },
    takeTestBtn:   { background: COLORS.primary, color: 'white', border: 'none', padding: '11px 22px', borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: 'pointer', flexShrink: 0 },
    resultBox:     { borderRadius: 12, border: '1px solid', padding: '18px 20px', marginTop: 4 },
    resultRow:     { display: 'flex', gap: 32, marginBottom: 14 },
    resultStat:    { display: 'flex', flexDirection: 'column' },
    resultStatNum: { fontSize: 22, fontWeight: 800, color: '#0F172A' },
    resultStatLabel:{ fontSize: 11, color: '#94A3B8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' },
    viewResultsBtn:{ display: 'flex', alignItems: 'center', gap: 5, background: 'white', border: '1px solid #E2E8F0', color: COLORS.primary, padding: '9px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' },

    interviewGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 14 },
    interviewItem: { display: 'flex', flexDirection: 'column', gap: 4 },
    interviewLabel:{ fontSize: 11, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 },
    interviewValue:{ fontSize: 14, fontWeight: 600, color: '#0F172A', margin: 0 },
    interviewLink: { fontSize: 14, fontWeight: 700, color: COLORS.primary, textDecoration: 'none' },
    interviewMsg:  { display: 'flex', gap: 10, alignItems: 'flex-start', background: `${COLORS.accent}12`, border: `1px solid ${COLORS.accent}30`, borderRadius: 9, padding: '12px 14px' },

    actionsRow:    { display: 'flex', justifyContent: 'flex-end' },
    withdrawBtn:   { display: 'flex', alignItems: 'center', gap: 7, background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', padding: '11px 22px', borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: 'pointer' },

    sideCard:      { background: 'white', borderRadius: 14, border: '1px solid #E2E8F0', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
    sideCardTitle: { display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 700, color: '#0F172A', margin: '0 0 14px' },
    resumeTitleRow:{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 },
    resumeTitle:   { fontSize: 14, fontWeight: 700, color: '#0F172A' },
    primaryBadge:  { display: 'flex', alignItems: 'center', gap: 3, background: '#FFFBEB', color: '#92400E', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, border: '1px solid #FDE68A' },
    resumeFieldLabel:{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 3px' },
    resumeFieldValue:{ fontSize: 13, color: '#334155', margin: 0, lineHeight: 1.5, whiteSpace: 'pre-line' },
    resumeSection: { marginBottom: 12, paddingTop: 10, borderTop: '1px solid #F1F5F9' },
    companyTagline:{ fontSize: 13, color: '#64748B', fontStyle: 'italic', margin: '0 0 12px' },
    sideLink:      { display: 'flex', alignItems: 'center', gap: 9, width: '100%', background: 'none', border: 'none', borderBottom: '1px solid #F1F5F9', padding: '10px 0', fontSize: 13, fontWeight: 500, color: '#374151', cursor: 'pointer', textAlign: 'left' },
};

const styleEl = document.createElement('style');
styleEl.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
document.head.appendChild(styleEl);

export default ApplicationDetail;