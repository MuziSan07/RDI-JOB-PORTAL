import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Bookmark, Briefcase, Building2, Banknote, Trash2,
    ArrowRight, Search
} from 'lucide-react';
import { BRAND, FONT, page } from '../components/brand/brandTheme';
import { savedJobsService } from '../services/savedJobsService';
import { useResponsive } from '../hooks/useResponsive';
import UserNavbar from '../components/brand/UserNavbar';
import { formatJobSalary } from '../utils/currency';

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatSalary = (job) => formatJobSalary(job) || 'Not specified';

const JOB_TYPE_COLORS = {
    remote: { bg: `${BRAND.green}14`, text: BRAND.green, border: `${BRAND.green}33` },
    onsite: { bg: `${BRAND.ink}0d`, text: BRAND.ink, border: BRAND.line },
    hybrid: { bg: `${BRAND.gold}17`, text: BRAND.gold, border: `${BRAND.gold}33` },
};

const SavedJobs = () => {
    const navigate = useNavigate();
    const { isMobile } = useResponsive();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState(null);

    useEffect(() => {
        loadSaved();
    }, []);

    const loadSaved = async () => {
        setLoading(true);
        try {
            const data = await savedJobsService.list();
            setJobs(data?.results || []);
        } catch (error) {
            console.error('Error loading saved jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUnsave = async (jobId) => {
        setRemovingId(jobId);
        try {
            await savedJobsService.toggle(jobId);
            setJobs(prev => prev.filter(j => j.id !== jobId));
        } catch (error) {
            console.error('Error removing saved job:', error);
        } finally {
            setRemovingId(null);
        }
    };

    const goToJob = (job) => navigate(`/jobs/${job.slug || job.id}`);

    // ─── Styles ───────────────────────────────────────────────────────────────
    const s = {
        root: { ...page.root },
        wrap: {
            maxWidth: 1080, margin: '0 auto',
            padding: isMobile ? '24px 16px 64px' : '40px 24px 80px',
            width: '100%', boxSizing: 'border-box',
        },
        header: { marginBottom: 28 },
        eyebrow: {
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: `${BRAND.green}14`, color: BRAND.green,
            border: `1px solid ${BRAND.green}2e`, padding: '6px 14px',
            borderRadius: 999, fontSize: 13, fontWeight: 700, marginBottom: 14,
        },
        title: {
            fontSize: isMobile ? 24 : 30, fontWeight: 800, color: BRAND.ink,
            margin: '0 0 6px', fontFamily: FONT,
        },
        subtitle: { fontSize: 15, color: BRAND.muted, margin: 0, fontFamily: FONT },
        grid: {
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 18,
        },
        card: {
            background: BRAND.surface, border: `1px solid ${BRAND.line}`,
            borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column',
            gap: 14, boxShadow: '0 1px 3px rgba(18,32,26,0.05)',
        },
        cardTop: { display: 'flex', gap: 14, alignItems: 'flex-start' },
        logoWrap: {
            width: 48, height: 48, borderRadius: 12, overflow: 'hidden', flexShrink: 0,
            border: `1px solid ${BRAND.line}`, display: 'flex',
            alignItems: 'center', justifyContent: 'center', background: BRAND.surfaceAlt,
        },
        logo: { width: '100%', height: '100%', objectFit: 'cover' },
        logoPlaceholder: { fontSize: 20, fontWeight: 800, color: BRAND.green, fontFamily: FONT },
        jobTitle: {
            fontSize: 17, fontWeight: 700, color: BRAND.ink, margin: '0 0 3px',
            fontFamily: FONT, lineHeight: 1.3,
        },
        company: {
            fontSize: 13.5, color: BRAND.muted, margin: 0, fontFamily: FONT,
            display: 'inline-flex', alignItems: 'center', gap: 6,
        },
        typePill: {
            display: 'inline-flex', alignItems: 'center', padding: '4px 10px',
            borderRadius: 999, fontSize: 12, fontWeight: 700, textTransform: 'capitalize',
            fontFamily: FONT, alignSelf: 'flex-start',
        },
        metaRow: {
            display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5,
            color: BRAND.slate, fontFamily: FONT,
        },
        actions: {
            display: 'flex', gap: 10, marginTop: 4,
            borderTop: `1px solid ${BRAND.line}`, paddingTop: 14,
        },
        viewBtn: {
            flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            gap: 7, background: BRAND.green, color: '#fff', border: `1px solid ${BRAND.green}`,
            padding: '10px 16px', borderRadius: 8, fontSize: 14, fontWeight: 600,
            cursor: 'pointer', fontFamily: FONT,
        },
        unsaveBtn: {
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            background: 'transparent', color: BRAND.crimson || '#C8303C',
            border: `1px solid ${BRAND.line}`, padding: '10px 16px', borderRadius: 8,
            fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: FONT,
        },
        // states
        centerBox: {
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', textAlign: 'center', padding: '72px 24px',
        },
        emptyIcon: {
            width: 72, height: 72, borderRadius: 20, background: `${BRAND.green}12`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18,
        },
        emptyTitle: { fontSize: 19, fontWeight: 700, color: BRAND.ink, margin: '0 0 8px', fontFamily: FONT },
        emptyText: { fontSize: 14.5, color: BRAND.muted, margin: '0 0 22px', maxWidth: 420, fontFamily: FONT },
        browseBtn: {
            display: 'inline-flex', alignItems: 'center', gap: 8, background: BRAND.green,
            color: '#fff', border: 'none', padding: '12px 22px', borderRadius: 10,
            fontSize: 14.5, fontWeight: 600, cursor: 'pointer', fontFamily: FONT,
        },
        spinner: {
            width: 40, height: 40, border: `3px solid ${BRAND.line}`,
            borderTopColor: BRAND.green, borderRadius: '50%',
            animation: 'sj-spin 0.8s linear infinite',
        },
    };

    const typeStyle = (t) => JOB_TYPE_COLORS[t] || JOB_TYPE_COLORS.onsite;

    return (
        <div style={s.root}>
            <style>{`@keyframes sj-spin { to { transform: rotate(360deg); } }`}</style>
            <UserNavbar />

            <div style={s.wrap}>
                <div style={s.header}>
                    <span style={s.eyebrow}><Bookmark size={14} strokeWidth={2} /> Saved Jobs</span>
                    <h1 style={s.title}>Your saved roles</h1>
                    <p style={s.subtitle}>
                        {loading ? 'Loading your bookmarks…'
                            : jobs.length > 0
                                ? `${jobs.length} job${jobs.length === 1 ? '' : 's'} bookmarked`
                                : 'Bookmark jobs to revisit them later.'}
                    </p>
                </div>

                {loading ? (
                    <div style={s.centerBox}>
                        <div style={s.spinner} />
                    </div>
                ) : jobs.length === 0 ? (
                    <div style={s.centerBox}>
                        <div style={s.emptyIcon}>
                            <Bookmark size={30} color={BRAND.green} strokeWidth={1.75} />
                        </div>
                        <h2 style={s.emptyTitle}>No saved jobs yet</h2>
                        <p style={s.emptyText}>Browse and bookmark roles you like — they'll show up here.</p>
                        <button style={s.browseBtn} onClick={() => navigate('/jobs')}>
                            <Search size={16} strokeWidth={2} /> Browse Jobs
                        </button>
                    </div>
                ) : (
                    <div style={s.grid}>
                        {jobs.map(job => {
                            const ts = typeStyle(job.job_type);
                            return (
                                <div key={job.id} style={s.card}>
                                    <div style={s.cardTop}>
                                        <div style={s.logoWrap}>
                                            {job.department_logo
                                                ? <img src={job.department_logo} alt={job.department_name} style={s.logo} />
                                                : <span style={s.logoPlaceholder}>{(job.department_name || 'C')[0]}</span>}
                                        </div>
                                        <div style={{ minWidth: 0, flex: 1 }}>
                                            <h3 style={s.jobTitle}>{job.title}</h3>
                                            <p style={s.company}>
                                                <Building2 size={13} strokeWidth={1.75} /> {job.department_name}
                                            </p>
                                        </div>
                                    </div>

                                    <span style={{ ...s.typePill, background: ts.bg, color: ts.text, border: `1px solid ${ts.border}` }}>
                                        {(job.job_type || 'onsite').replace('_', ' ')}
                                    </span>

                                    <div style={s.metaRow}>
                                        <Banknote size={15} color={BRAND.green} strokeWidth={1.75} />
                                        {formatSalary(job)}
                                    </div>

                                    <div style={s.actions}>
                                        <button style={s.viewBtn} onClick={() => goToJob(job)}>
                                            View Details <ArrowRight size={15} strokeWidth={2} />
                                        </button>
                                        <button
                                            style={s.unsaveBtn}
                                            onClick={() => handleUnsave(job.id)}
                                            disabled={removingId === job.id}
                                        >
                                            <Trash2 size={15} strokeWidth={1.75} />
                                            {removingId === job.id ? 'Removing…' : 'Unsave'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedJobs;
