import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft, DollarSign, Briefcase, Calendar, Building2,
    User, MapPin, CheckCircle, Clock, Users,
    Mail, Award, ChevronRight, Share2, Bookmark, AlertCircle, FileText, Star, X
} from 'lucide-react';
import { BRAND, FONT, page, injectBrandStyles } from '../components/brand/brandTheme';
import { jobsService } from '../services/jobsService';
import { savedJobsService } from '../services/savedJobsService';
import { jobSeekerAuthService } from '../services/jobSeekerAuthService';
import { profileService } from '../services/profileService';
import { useResponsive } from '../hooks/useResponsive';
import UserNavbar from '../components/brand/UserNavbar';
import { injectJobPostingSchema } from '../utils/jobSchema';
import { Skeleton } from '../components/common/Skeleton';

injectBrandStyles();

// ───── shared flat button variants (mirrors Landing.jsx / JobsBrowse.jsx) ─────
const btn = {
    primary: {
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        background: BRAND.green, color: '#fff', border: `1px solid ${BRAND.green}`,
        padding: '13px 24px', borderRadius: 8, fontSize: 14.5, fontWeight: 600,
        cursor: 'pointer', fontFamily: FONT, transition: 'background .15s ease',
    },
    ghost: {
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        background: 'transparent', color: BRAND.ink, border: `1px solid ${BRAND.line}`,
        padding: '11px 22px', borderRadius: 8, fontSize: 14, fontWeight: 600,
        cursor: 'pointer', fontFamily: FONT, transition: 'border-color .15s ease',
    },
    text: {
        display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
        color: BRAND.green, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: FONT, padding: 0,
    },
};

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatSalary = (salaryRange) => {
    if (!salaryRange || salaryRange.trim() === '') return 'Not specified';
    return salaryRange;
};

const JOB_TYPE_COLORS = {
    remote: { bg: `${BRAND.green}14`, text: BRAND.green, border: `${BRAND.green}33` },
    onsite: { bg: `${BRAND.ink}0d`, text: BRAND.ink, border: BRAND.line },
    hybrid: { bg: `${BRAND.gold}17`, text: BRAND.gold, border: `${BRAND.gold}33` },
};

const SELECTION_LABELS = {
    test: 'Written Test',
    interview: 'Interview',
    test_interview: 'Test + Interview',
};

const SELECTION_STEPS = {
    test: ['Apply', 'Written Test', 'Results'],
    interview: ['Apply', 'Interview', 'Decision'],
    test_interview: ['Apply', 'Written Test', 'Interview', 'Final Decision'],
};

// ─── Main Component ──────────────────────────────────────────────────────────

const JobDetail = () => {
    const navigate = useNavigate();
    const { isMobile, isCompact } = useResponsive();
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [applied, setApplied] = useState(false);
    const [user, setUser] = useState(null);
    const [saved, setSaved] = useState(false);
    const [savingBookmark, setSavingBookmark] = useState(false);
    const [resumes, setResumes] = useState([]);
    const [selectedResumeId, setSelectedResumeId] = useState(null);
    const [loadingResumes, setLoadingResumes] = useState(false);
    const isAuthenticated = jobSeekerAuthService.isAuthenticated();

    useEffect(() => {
        const currentUser = jobSeekerAuthService.getCurrentUser();
        setUser(currentUser);
        loadJob();
    }, [id]);

    // Inject Google JobPosting structured data (JSON-LD) for this job
    useEffect(() => {
        if (!job) return undefined;
        return injectJobPostingSchema(job);
    }, [job]);

    // Fetch whether this job is already bookmarked by the logged-in job seeker
    useEffect(() => {
        if (!job || !isAuthenticated) return;
        let active = true;
        savedJobsService.list()
            .then(data => {
                if (!active) return;
                const list = data?.results || [];
                setSaved(list.some(j => j.id === job.id));
            })
            .catch(() => { /* non-blocking */ });
        return () => { active = false; };
    }, [job, isAuthenticated]);

    const handleToggleSave = async () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { returnUrl: `/jobs/${id}` } });
            return;
        }
        if (!job || savingBookmark) return;
        setSavingBookmark(true);
        // optimistic
        const prev = saved;
        setSaved(!prev);
        try {
            const res = await savedJobsService.toggle(job.id);
            setSaved(!!res.saved);
        } catch (error) {
            console.error('Error toggling saved job:', error);
            setSaved(prev); // revert
        } finally {
            setSavingBookmark(false);
        }
    };

    const loadJob = async () => {
        setLoading(true);
        try {
            const data = await jobsService.getPublicJobDetail(id);
            setJob(data);
        } catch (error) {
            console.error('Error loading job:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { returnUrl: `/jobs/${id}` } });
            return;
        }
        // Check profile picture
        const currentUser = jobSeekerAuthService.getCurrentUser();
        if (!currentUser?.profile_picture) {
            if (window.confirm('You need a profile picture to apply. Go to your profile now?')) {
                navigate('/profile');
            }
            return;
        }
        // Load resumes
        setLoadingResumes(true);
        try {
            const r = await profileService.getResumes();
            setResumes(r);
            if (r.length === 0) {
                if (window.confirm('You need at least one resume to apply. Create one now?')) {
                    navigate('/profile');
                }
                return;
            }
            // Pre-select primary resume
            const primary = r.find(x => x.is_primary);
            setSelectedResumeId(primary ? primary.id : r[0].id);
            setShowApplyModal(true);
        } catch (err) {
            console.error('Failed to load resumes', err);
        } finally {
            setLoadingResumes(false);
        }
    };

    const submitApplication = async () => {
        if (!selectedResumeId) { alert('Please select a resume'); return; }
        setApplying(true);
        try {
            await jobsService.applyForJob(id, selectedResumeId);
            setApplied(true);
            setShowApplyModal(false);
            setTimeout(() => navigate('/my-applications'), 1500);
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.response?.data?.detail || 'Failed to apply for job';
            alert(errorMsg);
        } finally {
            setApplying(false);
        }
    };

    const vacanciesLeft = job ? (job.vacancies || 0) - (job.filled_positions || 0) : 0;
    const selectionSteps = job ? (SELECTION_STEPS[job.selection_type] || ['Apply', 'Review', 'Decision']) : [];
    const jobTypeStyle = job ? (JOB_TYPE_COLORS[job.job_type] || { bg: BRAND.surfaceAlt, text: BRAND.muted, border: BRAND.line }) : {};

    const contentCardStyle = { ...s.contentCard, ...(isMobile ? { padding: '18px 16px' } : {}) };
    const companyCardStyle = { ...s.companyCard, ...(isMobile ? { padding: '18px 16px' } : {}) };

    if (loading) {
        return (
            <div style={{ ...page.root, minHeight: '100vh' }}>
                <UserNavbar />
                <div style={{ ...s.page, ...(isMobile ? { padding: '18px 14px' } : {}) }}>
                    <Skeleton width={120} height={16} radius={6} style={{ marginBottom: 24 }} />
                    <div style={{ ...s.heroCard, padding: isMobile ? '20px 18px' : '28px', border: `1px solid ${BRAND.line}` }}>
                        <div style={{ display: 'flex', gap: 18, alignItems: 'center', marginBottom: 22 }}>
                            <Skeleton width={68} height={68} radius={12} style={{ flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <Skeleton width={110} height={22} radius={6} style={{ marginBottom: 12 }} />
                                <Skeleton width="60%" height={26} style={{ marginBottom: 10 }} />
                                <Skeleton width="35%" height={15} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', paddingTop: 20, borderTop: `1px solid ${BRAND.line}` }}>
                            <Skeleton width={120} height={38} radius={8} />
                            <Skeleton width={120} height={38} radius={8} />
                            <Skeleton width={120} height={38} radius={8} />
                        </div>
                    </div>
                    <div style={{ ...s.contentCard, marginTop: 16, padding: isMobile ? '18px 16px' : '24px 28px' }}>
                        <Skeleton width={180} height={18} style={{ marginBottom: 18 }} />
                        <Skeleton width="100%" height={13} style={{ marginBottom: 10 }} />
                        <Skeleton width="98%" height={13} style={{ marginBottom: 10 }} />
                        <Skeleton width="95%" height={13} style={{ marginBottom: 10 }} />
                        <Skeleton width="90%" height={13} style={{ marginBottom: 10 }} />
                        <Skeleton width="70%" height={13} />
                    </div>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div style={s.fullCenter}>
                <Briefcase size={46} color={BRAND.line} strokeWidth={1.5} />
                <p style={s.errorText}>Job not found or no longer available</p>
                <button onClick={() => navigate('/jobs')} style={btn.primary}>Browse Jobs</button>
            </div>
        );
    }

    return (
        <div style={{ ...page.root, minHeight: '100vh' }}>

            {/* ── Navbar ── */}
            <UserNavbar />

            {/* ── Body ── */}
            <div style={{ ...s.page, ...(isMobile ? { padding: '18px 14px' } : {}) }}>

                {/* Back button */}
                <button onClick={() => navigate('/jobs')} style={s.backBtn} className="brand-link">
                    <ArrowLeft size={16} strokeWidth={1.75} /> Back to Jobs
                </button>

                <div style={{ ...s.layout, ...(isCompact ? { flexDirection: 'column' } : {}) }}>

                    {/* ── LEFT: Main Job Content ── */}
                    <div style={s.mainCol}>

                        {/* Hero Card */}
                        <div style={s.heroCard}>
                            <div style={{ ...s.heroTop, ...(isMobile ? { padding: '20px 18px 0', gap: 12, flexWrap: 'wrap' } : {}) }}>
                                <div style={s.heroLogoWrap}>
                                    {job.department_logo
                                        ? <img src={job.department_logo} alt={job.department_name} style={s.heroLogo} />
                                        : <div style={s.heroLogoPlaceholder}>{(job.department_name || 'C')[0]}</div>
                                    }
                                </div>
                                <div style={s.heroInfo}>
                                    <div style={s.heroTopRow}>
                                        <span style={{ ...s.typePill, background: jobTypeStyle.bg, color: jobTypeStyle.text, border: `1px solid ${jobTypeStyle.border}` }}>
                                            {job.job_type?.replace('_', ' ') || 'Full Time'}
                                        </span>
                                        <span style={s.postedDate}>
                                            <Clock size={13} strokeWidth={1.75} /> Posted {new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <h1 style={{ ...s.jobTitle, ...(isMobile ? { fontSize: 21 } : {}) }}>{job.title}</h1>
                                    <p style={s.companyName}>{job.department_name}</p>
                                </div>
                                <div style={s.heroActions}>
                                    {isAuthenticated && (
                                        <button
                                            onClick={handleToggleSave}
                                            disabled={savingBookmark}
                                            title={saved ? 'Remove bookmark' : 'Save job'}
                                            aria-label={saved ? 'Remove bookmark' : 'Save job'}
                                            style={{ ...s.iconBtn, ...(saved ? s.iconBtnSaved : {}) }}
                                        >
                                            <Bookmark size={17} strokeWidth={1.75} fill={saved ? BRAND.green : 'none'} color={saved ? BRAND.green : BRAND.slate} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Stats strip */}
                            <div style={{ ...s.statsStrip, ...(isMobile ? { flexWrap: 'wrap' } : {}) }}>
                                <div style={{ ...s.statBox, ...(isMobile ? { flex: '1 1 45%' } : {}) }}>
                                    <DollarSign size={17} color={BRAND.green} strokeWidth={1.75} />
                                    <div>
                                        <p style={s.statLabel}>Salary</p>
                                        <p style={s.statValue}>{formatSalary(job.salary_range)}</p>
                                    </div>
                                </div>
                                <div style={{ ...s.statDivider, ...(isMobile ? { display: 'none' } : {}) }} />
                                <div style={{ ...s.statBox, ...(isMobile ? { flex: '1 1 45%' } : {}) }}>
                                    <Users size={17} color={BRAND.gold} strokeWidth={1.75} />
                                    <div>
                                        <p style={s.statLabel}>Vacancies</p>
                                        <p style={s.statValue}>{vacanciesLeft} of {job.vacancies} open</p>
                                    </div>
                                </div>
                                <div style={{ ...s.statDivider, ...(isMobile ? { display: 'none' } : {}) }} />
                                <div style={{ ...s.statBox, ...(isMobile ? { flex: '1 1 45%' } : {}) }}>
                                    <Award size={17} color={BRAND.ink} strokeWidth={1.75} />
                                    <div>
                                        <p style={s.statLabel}>Selection</p>
                                        <p style={s.statValue}>{SELECTION_LABELS[job.selection_type] || job.selection_type}</p>
                                    </div>
                                </div>
                                <div style={{ ...s.statDivider, ...(isMobile ? { display: 'none' } : {}) }} />
                                <div style={{ ...s.statBox, ...(isMobile ? { flex: '1 1 45%' } : {}) }}>
                                    <Briefcase size={17} color={BRAND.slate} strokeWidth={1.75} />
                                    <div>
                                        <p style={s.statLabel}>Applications</p>
                                        <p style={s.statValue}>{job.total_applications || 0} applied</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div style={contentCardStyle}>
                            <h2 style={s.sectionTitle}>Job Description</h2>
                            <p style={s.bodyText}>{job.description || 'No description available.'}</p>
                        </div>

                        {/* Required Skills */}
                        {job.required_skills && (
                            <div style={contentCardStyle}>
                                <h2 style={s.sectionTitle}>Required Skills</h2>
                                <div style={s.skillsGrid}>
                                    {job.required_skills.split(',').map((skill, i) => (
                                        <span key={i} style={s.skillChip}>
                                            <CheckCircle size={13} color={BRAND.green} strokeWidth={1.75} />
                                            {skill.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Selection Process */}
                        <div style={contentCardStyle}>
                            <h2 style={s.sectionTitle}>Selection Process</h2>
                            <div style={{ ...s.processRow, ...(isMobile ? { overflowX: 'auto', paddingBottom: 4 } : {}) }}>
                                {selectionSteps.map((step, i) => (
                                    <React.Fragment key={i}>
                                        <div style={s.processStep}>
                                            <div style={{ ...s.processCircle, background: i === 0 ? BRAND.green : BRAND.surfaceAlt, color: i === 0 ? '#fff' : BRAND.muted, border: i === 0 ? 'none' : `1px solid ${BRAND.line}` }}>
                                                {i + 1}
                                            </div>
                                            <span style={s.processLabel}>{step}</span>
                                        </div>
                                        {i < selectionSteps.length - 1 && (
                                            <div style={s.processLine} />
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        {/* About Company */}
                        <div style={companyCardStyle}>
                            <div style={s.companyCardHeader}>
                                {job.department_logo
                                    ? <img src={job.department_logo} alt={job.department_name} style={s.companyCardLogo} />
                                    : <div style={s.companyCardLogoPlaceholder}>{(job.department_name || 'C')[0]}</div>
                                }
                                <div>
                                    <h2 style={s.sectionTitle}>About {job.department_name}</h2>
                                    {job.department_tagline && <p style={s.companyTagline}>{job.department_tagline}</p>}
                                </div>
                            </div>
                            {job.department_bio && <p style={s.bodyText}>{job.department_bio}</p>}
                            <div style={s.companyMeta}>
                                {job.department_ceo && (
                                    <div style={s.companyMetaItem}>
                                        <User size={15} color={BRAND.faint} strokeWidth={1.75} />
                                        <span>CEO: <strong>{job.department_ceo}</strong></span>
                                    </div>
                                )}
                                {job.department_email && (
                                    <div style={s.companyMetaItem}>
                                        <Mail size={15} color={BRAND.faint} strokeWidth={1.75} />
                                        <span>{job.department_email}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT: Sticky Apply Sidebar ── */}
                    <aside style={{ ...s.sidebar, ...(isCompact ? { width: '100%', position: 'static' } : {}) }}>
                        {/* Apply Card */}
                        <div style={s.applyCard}>
                            {applied ? (
                                <div style={s.appliedSuccess}>
                                    <CheckCircle size={38} color={BRAND.green} strokeWidth={1.75} />
                                    <h3 style={s.appliedTitle}>Application Sent!</h3>
                                    <p style={s.appliedSubtitle}>Redirecting to your applications...</p>
                                </div>
                            ) : (
                                <>
                                    <div style={s.applyCardHeader}>
                                        <span style={{ ...s.vacancyBadge, background: vacanciesLeft > 0 ? `${BRAND.green}17` : `${BRAND.crimson}14`, color: vacanciesLeft > 0 ? BRAND.green : BRAND.crimson }}>
                                            {vacanciesLeft > 0 ? `${vacanciesLeft} ${vacanciesLeft === 1 ? 'vacancy' : 'vacancies'} left` : 'No vacancies'}
                                        </span>
                                    </div>
                                    <h3 style={s.applyCardTitle}>{job.title}</h3>
                                    <p style={s.applyCardCompany}>{job.department_name}</p>

                                    <div style={s.applyDetails}>
                                        <div style={s.applyDetailRow}>
                                            <DollarSign size={15} color={BRAND.faint} strokeWidth={1.75} />
                                            <span style={s.applyDetailLabel}>Salary</span>
                                            <span style={s.applyDetailValue}>{formatSalary(job.salary_range)}</span>
                                        </div>
                                        <div style={s.applyDetailRow}>
                                            <Briefcase size={15} color={BRAND.faint} strokeWidth={1.75} />
                                            <span style={s.applyDetailLabel}>Type</span>
                                            <span style={s.applyDetailValue}>{job.job_type?.replace('_', ' ')}</span>
                                        </div>
                                        <div style={s.applyDetailRow}>
                                            <Award size={15} color={BRAND.faint} strokeWidth={1.75} />
                                            <span style={s.applyDetailLabel}>Process</span>
                                            <span style={s.applyDetailValue}>{SELECTION_LABELS[job.selection_type] || job.selection_type}</span>
                                        </div>
                                        <div style={s.applyDetailRow}>
                                            <Calendar size={15} color={BRAND.faint} strokeWidth={1.75} />
                                            <span style={s.applyDetailLabel}>Posted</span>
                                            <span style={s.applyDetailValue}>{new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleApply}
                                        disabled={vacanciesLeft === 0}
                                        style={{ ...btn.primary, width: '100%', ...(vacanciesLeft === 0 ? s.applyBtnDisabled : {}) }}
                                    >
                                        {vacanciesLeft === 0 ? 'No Vacancies' : isAuthenticated ? 'Apply Now' : 'Sign In to Apply'}
                                        {vacanciesLeft > 0 && <ChevronRight size={17} strokeWidth={2} />}
                                    </button>

                                    {!isAuthenticated && (
                                        <p style={s.loginHint}>
                                            Don't have an account? <span onClick={() => navigate('/register')} style={s.loginHintLink}>Register free</span>
                                        </p>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Quick Info Card */}
                        <div style={s.quickInfoCard}>
                            <h4 style={s.quickInfoTitle}>Job Overview</h4>
                            <div style={s.quickInfoRow}>
                                <span style={s.quickInfoLabel}>Status</span>
                                <span style={{ ...s.quickInfoBadge, background: `${BRAND.green}17`, color: BRAND.green }}>Open</span>
                            </div>
                            <div style={s.quickInfoRow}>
                                <span style={s.quickInfoLabel}>Total Vacancies</span>
                                <span style={s.quickInfoVal}>{job.vacancies}</span>
                            </div>
                            <div style={s.quickInfoRow}>
                                <span style={s.quickInfoLabel}>Filled</span>
                                <span style={s.quickInfoVal}>{job.filled_positions || 0}</span>
                            </div>
                            <div style={s.quickInfoRow}>
                                <span style={s.quickInfoLabel}>Remaining</span>
                                <span style={{ ...s.quickInfoVal, fontWeight: 700, color: vacanciesLeft > 0 ? BRAND.green : BRAND.crimson }}>{vacanciesLeft}</span>
                            </div>

                            {/* Vacancy progress bar */}
                            <div style={s.progressBarWrap}>
                                <div style={s.progressBarTrack}>
                                    <div style={{ ...s.progressBarFill, width: `${Math.min(((job.filled_positions || 0) / (job.vacancies || 1)) * 100, 100)}%` }} />
                                </div>
                                <span style={s.progressLabel}>{Math.round(((job.filled_positions || 0) / (job.vacancies || 1)) * 100)}% filled</span>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* ── Apply Modal with Resume Selector ── */}
            {showApplyModal && (
                <div style={s.overlay} onClick={() => setShowApplyModal(false)}>
                    <div style={{ ...s.modal, ...(isMobile ? { padding: '22px 18px', width: '92vw' } : {}) }} onClick={e => e.stopPropagation()}>
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                                <div style={s.modalIcon}><Briefcase size={22} color={BRAND.green} strokeWidth={1.75} /></div>
                                <div>
                                    <h3 style={s.modalTitle}>Apply for this Job</h3>
                                    <p style={{ fontSize: 13, color: BRAND.slate, margin: 0 }}>{job.department_name}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowApplyModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: BRAND.faint }}>
                                <X size={20} strokeWidth={1.75} />
                            </button>
                        </div>

                        <p style={s.modalText}>
                            Applying for <strong>{job.title}</strong>. Select the resume you want to submit with this application.
                        </p>

                        {/* Resume selector */}
                        <div style={{ marginBottom: 20 }}>
                            <p style={{ fontSize: 12, fontWeight: 700, color: BRAND.slate, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                Select Resume
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {resumes.map(r => (
                                    <div
                                        key={r.id}
                                        onClick={() => setSelectedResumeId(r.id)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 12,
                                            padding: '12px 14px', borderRadius: 8, cursor: 'pointer',
                                            border: selectedResumeId === r.id ? `1.5px solid ${BRAND.green}` : `1px solid ${BRAND.line}`,
                                            background: selectedResumeId === r.id ? `${BRAND.green}0d` : BRAND.surface,
                                            transition: 'border-color .15s ease, background .15s ease',
                                        }}
                                    >
                                        <div style={{
                                            width: 18, height: 18, borderRadius: '50%', border: `2px solid ${selectedResumeId === r.id ? BRAND.green : BRAND.line}`,
                                            background: selectedResumeId === r.id ? BRAND.green : BRAND.surface,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                        }}>
                                            {selectedResumeId === r.id && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                                        </div>
                                        <FileText size={16} strokeWidth={1.75} color={selectedResumeId === r.id ? BRAND.green : BRAND.faint} />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontSize: 14, fontWeight: 600, color: BRAND.ink, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: FONT }}>{r.title}</p>
                                            {r.current_job && <p style={{ fontSize: 11, color: BRAND.faint, margin: 0 }}>{r.current_job}</p>}
                                        </div>
                                        {r.is_primary && (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 3, background: `${BRAND.gold}17`, color: BRAND.gold, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6, flexShrink: 0 }}>
                                                <Star size={10} strokeWidth={1.75} fill={BRAND.gold} color={BRAND.gold} /> Primary
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => navigate('/profile')}
                                style={{ ...btn.text, marginTop: 10 }}
                                className="brand-link"
                            >
                                + Create a new resume
                            </button>
                        </div>

                        {job.selection_type && (
                            <div style={s.modalNote}>
                                <Award size={14} strokeWidth={1.75} color={BRAND.gold} />
                                <span style={{ fontSize: 13 }}>Selection: <strong>{SELECTION_LABELS[job.selection_type] || job.selection_type}</strong></span>
                            </div>
                        )}

                        <div style={{ ...s.modalActions, ...(isMobile ? { flexDirection: 'column-reverse' } : {}) }}>
                            <button onClick={() => setShowApplyModal(false)} style={{ ...btn.ghost, ...(isMobile ? { width: '100%' } : {}) }}>Cancel</button>
                            <button onClick={submitApplication} disabled={applying || !selectedResumeId} style={{ ...btn.primary, ...(isMobile ? { width: '100%' } : {}), opacity: !selectedResumeId ? 0.5 : 1 }}>
                                {applying ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const s = {
    // Full page center (loading/error)
    fullCenter: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: 16, fontFamily: FONT },
    spinner: { width: 36, height: 36, border: `2px solid ${BRAND.line}`, borderTop: `2px solid ${BRAND.ink}`, borderRadius: '50%', animation: 'brandSpin .8s linear infinite' },
    loadingText: { color: BRAND.muted, fontSize: 15 },
    errorText: { fontSize: 17, fontWeight: 700, color: BRAND.ink },

    // Page layout
    page: { maxWidth: 1300, margin: '0 auto', padding: '28px 24px', fontFamily: FONT },
    backBtn: { display: 'inline-flex', alignItems: 'center', gap: 7, background: 'none', border: 'none', color: BRAND.slate, fontSize: 14, fontWeight: 500, cursor: 'pointer', marginBottom: 20, padding: '6px 0', fontFamily: FONT },
    layout: { display: 'flex', gap: 24, alignItems: 'flex-start' },

    // Main column
    mainCol: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 },

    // Hero card
    heroCard: { background: BRAND.surface, borderRadius: 10, border: `1px solid ${BRAND.line}`, overflow: 'hidden' },
    heroTop: { display: 'flex', gap: 18, padding: '28px 28px 0', alignItems: 'flex-start' },
    heroLogoWrap: { flexShrink: 0 },
    heroLogo: { width: 68, height: 68, borderRadius: 12, border: `1px solid ${BRAND.line}`, objectFit: 'cover' },
    heroLogoPlaceholder: { width: 68, height: 68, borderRadius: 12, background: BRAND.surfaceAlt, color: BRAND.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, border: `1px solid ${BRAND.line}` },
    heroInfo: { flex: 1, minWidth: 0 },
    heroTopRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' },
    typePill: { fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 6, textTransform: 'capitalize' },
    postedDate: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: BRAND.faint },
    jobTitle: { fontSize: 25, fontWeight: 700, color: BRAND.ink, margin: '0 0 6px', lineHeight: 1.2, letterSpacing: '-0.6px' },
    companyName: { fontSize: 15, color: BRAND.slate, margin: 0 },
    heroActions: { display: 'flex', gap: 8 },
    iconBtn: { width: 38, height: 38, borderRadius: 8, border: `1px solid ${BRAND.line}`, background: BRAND.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
    iconBtnSaved: { background: `${BRAND.green}14`, borderColor: BRAND.green },

    // Stats strip
    statsStrip: { display: 'flex', borderTop: `1px solid ${BRAND.line}`, margin: '20px 0 0' },
    statBox: { flex: 1, display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px' },
    statDivider: { width: 1, background: BRAND.line, margin: '10px 0' },
    statLabel: { fontSize: 11, color: BRAND.muted, fontWeight: 600, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.05em' },
    statValue: { fontSize: 14, fontWeight: 700, color: BRAND.ink, margin: 0 },

    // Content cards
    contentCard: { background: BRAND.surface, borderRadius: 10, border: `1px solid ${BRAND.line}`, padding: '24px 28px' },
    sectionTitle: { fontSize: 16.5, fontWeight: 700, color: BRAND.ink, margin: '0 0 14px', fontFamily: FONT },
    bodyText: { fontSize: 14, color: BRAND.slate, lineHeight: 1.8, margin: 0 },

    // Skills
    skillsGrid: { display: 'flex', flexWrap: 'wrap', gap: 8 },
    skillChip: { display: 'flex', alignItems: 'center', gap: 6, background: `${BRAND.green}0f`, color: BRAND.green, border: `1px solid ${BRAND.green}33`, fontSize: 13, fontWeight: 500, padding: '6px 12px', borderRadius: 6 },

    // Selection process
    processRow: { display: 'flex', alignItems: 'center', gap: 0 },
    processStep: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 },
    processCircle: { width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13.5, fontWeight: 700, flexShrink: 0 },
    processLabel: { fontSize: 12, color: BRAND.slate, fontWeight: 500, textAlign: 'center', whiteSpace: 'nowrap' },
    processLine: { flex: 1, height: 1, background: BRAND.line, margin: '0 8px', marginBottom: 24, minWidth: 24 },

    // Company card
    companyCard: { background: BRAND.surface, borderRadius: 10, border: `1px solid ${BRAND.line}`, padding: '24px 28px' },
    companyCardHeader: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 },
    companyCardLogo: { width: 50, height: 50, borderRadius: 8, objectFit: 'cover', border: `1px solid ${BRAND.line}` },
    companyCardLogoPlaceholder: { width: 50, height: 50, borderRadius: 8, background: BRAND.surfaceAlt, color: BRAND.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, fontWeight: 800, border: `1px solid ${BRAND.line}` },
    companyTagline: { fontSize: 13, color: BRAND.slate, margin: 0, fontStyle: 'italic' },
    companyMeta: { display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 16, paddingTop: 16, borderTop: `1px solid ${BRAND.line}` },
    companyMetaItem: { display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: BRAND.slate },

    // Sidebar
    sidebar: { width: 300, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 80 },

    // Apply card
    applyCard: { background: BRAND.surface, borderRadius: 10, border: `1px solid ${BRAND.ink}`, padding: '24px' },
    applyCardHeader: { marginBottom: 12 },
    vacancyBadge: { fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 6 },
    applyCardTitle: { fontSize: 16, fontWeight: 700, color: BRAND.ink, margin: '8px 0 4px', fontFamily: FONT },
    applyCardCompany: { fontSize: 13, color: BRAND.slate, margin: '0 0 16px' },
    applyDetails: { display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20, paddingBottom: 18, borderBottom: `1px solid ${BRAND.line}` },
    applyDetailRow: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 },
    applyDetailLabel: { color: BRAND.faint, flex: 1, fontWeight: 500 },
    applyDetailValue: { color: BRAND.ink, fontWeight: 600, textTransform: 'capitalize' },
    applyBtnDisabled: { background: BRAND.surfaceAlt, color: BRAND.faint, borderColor: BRAND.line, cursor: 'not-allowed' },
    loginHint: { fontSize: 12, color: BRAND.faint, textAlign: 'center', margin: '12px 0 0' },
    loginHintLink: { color: BRAND.green, fontWeight: 600, cursor: 'pointer' },
    appliedSuccess: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '16px 0', textAlign: 'center' },
    appliedTitle: { fontSize: 17, fontWeight: 700, color: BRAND.green, margin: 0, fontFamily: FONT },
    appliedSubtitle: { fontSize: 13, color: BRAND.slate, margin: 0 },

    // Quick info card
    quickInfoCard: { background: BRAND.surface, borderRadius: 10, border: `1px solid ${BRAND.line}`, padding: '20px 22px' },
    quickInfoTitle: { fontSize: 13.5, fontWeight: 700, color: BRAND.ink, margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: FONT },
    quickInfoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    quickInfoLabel: { fontSize: 13, color: BRAND.slate },
    quickInfoVal: { fontSize: 13, fontWeight: 600, color: BRAND.ink },
    quickInfoBadge: { fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 6 },
    progressBarWrap: { marginTop: 14, paddingTop: 14, borderTop: `1px solid ${BRAND.line}` },
    progressBarTrack: { height: 6, background: BRAND.surfaceAlt, borderRadius: 6, overflow: 'hidden', marginBottom: 6, border: `1px solid ${BRAND.line}` },
    progressBarFill: { height: '100%', background: BRAND.green, borderRadius: 6, transition: 'width 0.5s ease' },
    progressLabel: { fontSize: 11, color: BRAND.faint },

    // Modal
    overlay: { position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modal: { background: BRAND.surface, borderRadius: 12, border: `1px solid ${BRAND.line}`, padding: '28px 32px', maxWidth: 540, width: '90%', maxHeight: '90vh', overflowY: 'auto', fontFamily: FONT },
    modalIcon: { width: 52, height: 52, borderRadius: '50%', background: `${BRAND.green}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    modalTitle: { fontSize: 19, fontWeight: 700, color: BRAND.ink, margin: '0 0 8px', fontFamily: FONT },
    modalText: { fontSize: 14, color: BRAND.slate, lineHeight: 1.6, margin: '0 0 16px' },
    modalNote: { display: 'flex', alignItems: 'center', gap: 8, background: `${BRAND.gold}14`, border: `1px solid ${BRAND.gold}33`, borderRadius: 8, padding: '10px 14px', fontSize: 13, color: BRAND.gold, marginBottom: 24 },
    modalActions: { display: 'flex', gap: 10, justifyContent: 'flex-end' },
};

export default JobDetail;