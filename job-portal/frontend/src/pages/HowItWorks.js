import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, Briefcase, Users, User, TrendingUp, ArrowRight, ChevronDown,
    CheckCircle2, Sparkles, Rocket, Target, ShieldCheck, Building2, Clock,
    Globe, Award, Zap, FileText, MessageSquare, Send, Star, Terminal, ArrowRightCircle
} from 'lucide-react';
import BrandNav from '../components/brand/BrandNav';
import BrandFooter from '../components/brand/BrandFooter';
import { BRAND, FONT, injectBrandStyles } from '../components/brand/brandTheme';
import { useResponsive } from '../hooks/useResponsive';

injectBrandStyles();

// ── Flat Data Bar Component ──────────────────────────────────────────────────
const DataBar = ({ percentage }) => (
    <div style={{ width: '100%', height: '4px', backgroundColor: BRAND.line, marginTop: '12px', overflow: 'hidden' }}>
        <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: BRAND.green }} />
    </div>
);

// ── Left-Aligned Pure Editorial Section Header ────────────────────────────────
const SectionHead = ({ eyebrowText, title, subtitle, isMobile }) => (
    <div style={{ textAlign: 'left', maxWidth: '820px', marginBottom: isMobile ? '36px' : '56px', borderLeft: `2px solid ${BRAND.green}`, paddingLeft: '20px' }}>
        <div style={{ 
            fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', 
            textTransform: 'uppercase', color: BRAND.green, marginBottom: 12 
        }}>
            {eyebrowText}
        </div>
        <h2 style={{
            fontSize: isMobile ? '32px' : '44px', fontWeight: 700, letterSpacing: '-1.5px',
            lineHeight: 1.1, margin: '0 0 16px 0', color: BRAND.ink,
        }}>
            {title}
        </h2>
        {subtitle && (
            <p style={{ fontSize: isMobile ? '15px' : '17px', lineHeight: 1.6, margin: 0, color: BRAND.slate, maxWidth: '600px' }}>
                {subtitle}
            </p>
        )}
    </div>
);

const SEEKER_STEPS = [
    { title: 'Build Your Master Profile', desc: 'Set up a verified professional profile with your qualifications, skills, and experience to serve as your standardized application portfolio.' },
    { title: 'Targeted Opportunity Discovery', desc: 'Explore requisitions matched by skill set, domain, and location—filtering by onsite, hybrid, or remote operational models.' },
    { title: 'Apply & Complete Evaluations', desc: 'Submit your application directly and complete inline, role-tailored competency assessments to demonstrate practical capability.' },
    { title: 'Transparent Stage Tracking', desc: 'Monitor evaluation updates in real time across screening, technical review, interviews, and final candidate selection.' },
];

const DEEP_DIVES = [
    {
        eyebrowText: 'Selection Visibility',
        icon: TrendingUp,
        title: 'End-to-End Application Transparency',
        body: 'Eliminate uncertainty throughout the recruitment process. Each application moves through structured, visible milestones, providing candidate update synchronization on a unified status dashboard.',
        bullets: ['Real-time progression tracking from submission to offer', 'Automated portal notifications and direct stage alerts', 'Comprehensive application history and evaluation records'],
        mock: 'tracking',
    },
    {
        eyebrowText: 'Skills Verification',
        icon: ShieldCheck,
        title: 'Demonstrate Competency Through In-Line Evaluations',
        body: 'Highlight practical capabilities through role-tailored evaluations embedded directly into the application flow. Candidates demonstrate verified technical aptitude, giving selection committees objective merit metrics over static resume data.',
        bullets: ['Role-specific practical evaluations', 'Standardized scoring and immediate review submission', 'Equitable, merit-based candidate shortlisting'],
        mock: 'assessment',
    },
    {
        eyebrowText: 'Streamlined Submission',
        icon: Zap,
        title: 'Unified Profile & Rapid Requisition Submission',
        body: 'Establish a centralized professional profile once to streamline future applications. Verified credentials, skill matrices, and documentation transfer seamlessly across all open requisitions within the network.',
        bullets: ['Centralized master portfolio and credentials', 'Zero redundant data entry across partner requisitions', 'Bookmark requisitions for targeted application'],
        mock: 'oneclick',
    },
];

const WHY_STATS = [
    { value: 'Instant', label: 'Once master profile is verified', percentage: 100 },
    { value: '< 5 Min', label: 'Average institutional requisition setup', percentage: 85 },
    { value: '94%', label: 'Competency match precision rate', percentage: 94 },
    { value: '100%', label: 'Vetted partner entities & departments', percentage: 100 },
];

const FAQS = [
    { q: 'How do I submit an application for an active role?', a: 'Create a free account, complete your profile and upload a resume, then open any role and hit Apply Once your profile is set, applying to future roles is a single click' },
    { q: 'What do the integrated competency assessments entail?', a: 'Select requisitions incorporate practical, role-tailored evaluations completed directly within the application workflow. Responses are scored using standardized criteria, allowing selection committees to evaluate candidates objectively based on verified capability rather than resume credentials alone.' },
    { q: 'Is candidate registration and application free of charge?', a: 'Yes Browsing roles, creating a profile, applying, taking assessments, and tracking your applications are all completely free for candidates there are no hidden fees' },
    { q: 'How does the real-time application tracking system operate?', a: 'Every application moves through clear, visible stages applied, screening, assessment, interview, and offer The moment an employer updates your status you see it in real time, with email and in-app notifications' },
    { q: 'Can I explore active requisitions without an account?', a: 'You can browse and search every open role without an account You only need to sign up when you are ready to apply, take an assessment, or track your progress' },
    { q: 'How do enterprise partners publish new requisitions?', a: 'Employers sign in to the employer dashboard, click Post a Job, and publish a verified opening in minutes setting requirements, vacancies, salary, and work type Applicants then arrive with complete profiles ready to review' },
];

const HowItWorks = () => {
    const navigate = useNavigate();
    const { isMobile, isTablet, isCompact } = useResponsive();
    const [openFaq, setOpenFaq] = useState(0);

    return (
        <div style={{ backgroundColor: BRAND.surface, minHeight: '100vh', fontFamily: FONT, color: BRAND.ink, display: 'flex', flexDirection: 'column' }}>
            <BrandNav />

            {/* 1. HERO */}
            <section style={{ 
                borderBottom: `1px solid ${BRAND.line}`, 
                backgroundColor: BRAND.surface, 
                padding: isMobile ? '56px 16px' : '96px 24px',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'left' }}>
                    <div style={{ 
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', 
                        textTransform: 'uppercase', color: BRAND.green, marginBottom: 20 
                    }}>
                        <Terminal size={14} /> Execution Architecture
                    </div>
                    <h1 style={{
                        fontSize: isMobile ? '38px' : isTablet ? '48px' : '64px',
                        fontWeight: 700, letterSpacing: '-2.5px', lineHeight: 1.06,
                        color: BRAND.ink, margin: '0 0 24px 0', maxWidth: '960px'
                    }}>
                        Your Career Pathway, <span style={{ color: BRAND.green }}>From Initial Application to Placement</span>
                    </h1>
                    <p style={{
                        fontSize: isMobile ? '16px' : '18px', color: BRAND.slate,
                        maxWidth: '620px', margin: '0 0 36px 0', lineHeight: 1.65
                    }}>
                        The RDI Talent Portal provides a structured, merit-based selection framework—connecting skilled professionals with high-impact roles across our enterprise ecosystem.
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'flex-start', marginBottom: 40 }}>
                        <button 
                            onClick={() => navigate('/register')} 
                            style={{ 
                                display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: BRAND.green, color: '#ffffff', 
                                border: 'none', padding: '13px 24px', borderRadius: 6, fontSize: '14.5px', fontWeight: 600, cursor: 'pointer', fontFamily: FONT 
                            }}
                        >
                            Get Started <ArrowRight size={16} />
                        </button>
                        <button 
                            onClick={() => navigate('/jobs')} 
                            style={{ 
                                display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: 'transparent', color: BRAND.ink, 
                                border: `1px solid ${BRAND.line}`, padding: '13px 24px', borderRadius: 6, fontSize: '14.5px', fontWeight: 600, cursor: 'pointer', fontFamily: FONT 
                            }}
                        >
                            Explore Open Roles
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, borderTop: `1px solid ${BRAND.line}`, paddingTop: 24 }}>
                        {[
                            { icon: Search, label: 'For job seekers' },
                            { icon: Briefcase, label: 'For institutional employers' },
                        ].map((a, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '13px', fontWeight: 700, color: BRAND.slate, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                <a.icon size={14} style={{ color: BRAND.green }} /> {a.label}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 2. FOR JOB SEEKERS (ROADMAP FLOWCHART EDITION) */}
            <section style={{ 
                borderBottom: `1px solid ${BRAND.line}`, 
                padding: isMobile ? '48px 16px' : '80px 24px',
                width: '100%',
                boxSizing: 'border-box',
                backgroundColor: BRAND.surface
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <SectionHead
                        eyebrowText="Candidate Selection Pipeline"
                        title="A Transparent 4-Step Path to Placement"
                        subtitle="Build a unified professional profile once to unlock opportunities across partner enterprises without administrative friction."
                        isMobile={isMobile}
                    />
                    
                    {/* Roadmap Track Container */}
                    <div style={{ 
                        position: 'relative', 
                        display: 'grid', 
                        gridTemplateColumns: isCompact ? '1fr' : 'repeat(4, 1fr)', 
                        gap: '32px',
                        paddingTop: '20px'
                    }}>
                        
                        {/* Flow connection line background for desktop */}
                        {!isCompact && (
                            <div style={{
                                position: 'absolute',
                                top: '52px',
                                left: '40px',
                                right: '40px',
                                height: '4px',
                                backgroundColor: BRAND.line,
                                zIndex: 1
                            }}>
                                <div style={{ width: '75%', height: '100%', backgroundColor: BRAND.green }} />
                            </div>
                        )}

                        {SEEKER_STEPS.map((m, i) => (
                            <div key={i} style={{ 
                                position: 'relative', 
                                zIndex: 2, 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: isCompact ? 'flex-start' : 'center',
                                textAlign: isCompact ? 'left' : 'center',
                                borderLeft: isCompact ? `4px solid ${BRAND.line}` : 'none',
                                paddingLeft: isCompact ? '24px' : '0px',
                                paddingBottom: isCompact ? '24px' : '0px'
                            }}>
                                {/* Roadmap Map Node Pointer */}
                                <div style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '50%',
                                    backgroundColor: BRAND.surface,
                                    border: `3px solid ${BRAND.green}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '14px',
                                    fontWeight: 700,
                                    color: BRAND.ink,
                                    fontFamily: 'monospace',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                    marginBottom: '20px',
                                    position: isCompact ? 'absolute' : 'static',
                                    left: '-24px',
                                    top: '0px'
                                }}>
                                    0{i + 1}
                                </div>

                                <div style={{ marginTop: isCompact ? '0px' : '12px' }}>
                                    <h3 style={{ 
                                        fontSize: '17px', 
                                        fontWeight: 700, 
                                        color: BRAND.ink, 
                                        margin: '0 0 10px 0',
                                        letterSpacing: '-0.3px'
                                    }}>
                                        {m.title}
                                    </h3>
                                    <p style={{ 
                                        fontSize: '13.5px', 
                                        lineHeight: 1.6, 
                                        color: BRAND.slate, 
                                        margin: 0,
                                        maxWidth: isCompact ? '100%' : '260px'
                                    }}>
                                        {m.desc}
                                    </p>
                                </div>

                                {/* Flow indicators */}
                                {!isCompact && i < 3 && (
                                    <div style={{ position: 'absolute', top: '42px', right: '-24px', zIndex: 3, color: BRAND.slate }}>
                                        <ArrowRightCircle size={20} style={{ backgroundColor: BRAND.surface, borderRadius: '50%' }} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. UNDER THE HOOD DEEP DIVES */}
            <section style={{ 
                borderBottom: `1px solid ${BRAND.line}`, 
                backgroundColor: BRAND.surfaceAlt,
                padding: isMobile ? '48px 16px' : '80px 24px',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <SectionHead
                        eyebrowText="Platform Capabilities"
                        title="Infrastructure Built for Efficiency and Merit"
                        subtitle="Core functional modules designed to streamline candidate evaluation, ensure transparency, and accelerate time-to-placement."
                        isMobile={isMobile}
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                        {DEEP_DIVES.map((d, i) => {
                            const reverse = !isCompact && i % 2 === 1;
                            return (
                                <div key={d.title} style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : 'repeat(2,1fr)', gap: '48px', alignItems: 'center' }}>
                                    <div style={{ order: reverse ? 2 : 1 }}>
                                        <div style={{ fontSize: '11px', fontWeight: 700, color: BRAND.green, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
                                            // {d.eyebrowText}
                                        </div>
                                        <h3 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.8px', margin: '0 0 16px 0', color: BRAND.ink }}>
                                            {d.title}
                                        </h3>
                                        <p style={{ fontSize: '15px', lineHeight: 1.6, color: BRAND.slate, margin: '0 0 24px 0' }}>
                                            {d.body}
                                        </p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {d.bullets.map((b) => (
                                                <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '14px', fontWeight: 600, color: BRAND.ink }}>
                                                    <div style={{ width: 6, height: 6, backgroundColor: BRAND.green, borderRadius: '50%' }} /> {b}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ order: reverse ? 1 : 2 }}>
                                        <DeepDiveMock kind={d.mock} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 4. WHY IT WORKS / PERFORMANCE METRICS */}
            <section style={{ 
                borderBottom: `1px solid ${BRAND.line}`, 
                backgroundColor: BRAND.surfaceAlt,
                padding: isMobile ? '48px 16px' : '80px 24px',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <SectionHead
                        eyebrowText="Performance & Impact Metrics"
                        title="Engineered for Efficiency, Merit, and Operational Scale"
                        subtitle="Key operational indicators reflecting system efficiency and merit-based recruitment throughput."
                        isMobile={isMobile}
                    />
                    <div style={{
                        border: `1px solid ${BRAND.line}`,
                        backgroundColor: BRAND.surface,
                        display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', 
                        gap: '0px', width: '100%', boxSizing: 'border-box'
                    }}>
                        {WHY_STATS.map((s, i) => (
                            <div key={i} style={{ textAlign: 'left', padding: '24px', borderRight: i === 3 ? 'none' : `1px solid ${BRAND.line}`, borderBottom: isMobile && i !== 3 ? `1px solid ${BRAND.line}` : 'none' }}>
                                <div style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-1.5px', lineHeight: 1, color: BRAND.ink }}>
                                    {s.value}
                                </div>
                                <div style={{ marginTop: 8, fontSize: '12px', fontWeight: 700, color: BRAND.slate, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    {s.label}
                                </div>
                                <DataBar percentage={s.percentage} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. FAQ INTERFACE */}
            <section style={{ 
                borderBottom: `1px solid ${BRAND.line}`, 
                padding: isMobile ? '48px 16px' : '80px 24px',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <div style={{ maxWidth: '860px', margin: '0 auto' }}>
                    <SectionHead
                        eyebrowText="Knowledge Base & Support"
                        title="Frequently Asked Questions"
                        subtitle="Essential information regarding candidate registration, evaluation procedures, and institutional participation."
                        isMobile={isMobile}
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', backgroundColor: BRAND.line, border: `1px solid ${BRAND.line}` }}>
                        {FAQS.map((item, i) => {
                            const open = openFaq === i;
                            return (
                                <div key={item.q} style={{ background: BRAND.surface, overflow: 'hidden' }}>
                                    <button
                                        onClick={() => setOpenFaq(open ? -1 : i)}
                                        aria-expanded={open}
                                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifycontent: 'space-between', gap: 16, background: 'transparent', border: 'none', cursor: 'pointer', padding: '24px', textAlign: 'left', fontFamily: FONT }}
                                    >
                                        <span style={{ fontSize: '16px', fontWeight: 700, color: BRAND.ink, letterSpacing: '-0.2px' }}>{item.q}</span>
                                        <span style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', color: BRAND.slate, display: 'flex', alignItems: 'center' }}>
                                            <ChevronDown size={18} />
                                        </span>
                                    </button>
                                    <div style={{ maxHeight: open ? '200px' : 0, overflow: 'hidden', transition: 'max-height .25s ease' }}>
                                        <p style={{ margin: 0, padding: '0 24px 24px 24px', fontSize: '14.5px', color: BRAND.slate, lineHeight: 1.6 }}>{item.a}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 6. CTA TERMINAL */}
            <section style={{ 
                backgroundColor: BRAND.surfaceAlt, 
                padding: isMobile ? '56px 16px' : '96px 24px',
                width: '100%',
                boxSizing: 'border-box',
                textAlign: 'left',
                borderBottom: `1px solid ${BRAND.line}`
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: BRAND.green, marginBottom: 16 }}>
                        // Candidate Onboarding
                    </div>
                    <h2 style={{ fontSize: isMobile ? '32px' : '44px', fontWeight: 700, letterSpacing: '-1.5px', lineHeight: 1.1, margin: '0 0 16px 0', color: BRAND.ink }}>
                        Create Your Professional Profile
                    </h2>
                    <p style={{ fontSize: isMobile ? '15px' : '17px', lineHeight: 1.6, color: BRAND.slate, margin: '0 0 32px 0', maxWidth: '600px' }}>
                        Begin exploring opportunities across the RDI enterprise ecosystem by setting up your master candidate portfolio today.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'flex-start' }}>
                        <button onClick={() => navigate('/register')} style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: BRAND.green, color: '#ffffff',
                            border: 'none', padding: '14px 28px', borderRadius: 6, fontSize: '14.5px', fontWeight: 600,
                            cursor: 'pointer', fontFamily: FONT,
                        }}>
                            Register Candidate Account
                        </button>
                    </div>
                </div>
            </section>

            <BrandFooter />
        </div>
    );
};

// ── STRUCTURAL PLATFORM MODULE MOCKS ─────────────────────────────────────────
const DeepDiveMock = ({ kind }) => {
    const shell = {
        background: BRAND.surface,
        border: `1px solid ${BRAND.line}`,
        padding: '24px',
        boxSizing: 'border-box',
        width: '100%'
    };

    if (kind === 'tracking') {
        const stages = [
            { label: 'Application registered', done: true },
            { label: 'Credential review', done: true },
            { label: 'Competency evaluation', done: true },
            { label: 'Panel interview', done: false, active: true },
            { label: 'Selection offer', done: false },
        ];
        return (
            <div style={shell}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, borderBottom: `1px solid ${BRAND.line}`, paddingBottom: 12 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: BRAND.ink, fontFamily: 'monospace' }}>CANDIDATE_PIPELINE // SELECTION_STAGE</div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: BRAND.green, fontFamily: 'monospace' }}>[IN_EVALUATION]</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {stages.map((s, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ 
                                width: 12, height: 12, 
                                border: `1px solid ${BRAND.line}`, 
                                backgroundColor: s.done ? BRAND.green : s.active ? BRAND.surfaceAlt : 'transparent',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                {s.active && <div style={{ width: 4, height: 4, backgroundColor: BRAND.green }} />}
                            </div>
                            <span style={{ fontSize: '13.5px', fontFamily: 'monospace', fontWeight: s.active ? 700 : 500, color: s.done || s.active ? BRAND.ink : BRAND.slate }}>
                                {s.label.toUpperCase().replace(/ /g, '_')}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (kind === 'assessment') {
        return (
            <div style={shell}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, borderBottom: `1px solid ${BRAND.line}`, paddingBottom: 12 }}>
                    <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: BRAND.ink, fontFamily: 'monospace' }}>TEST_ENG // REACT_CORE</div>
                        <div style={{ fontSize: '11px', color: BRAND.slate, fontFamily: 'monospace' }}>QUEUE_PTR: 03 / 08</div>
                    </div>
                </div>
                <div style={{ height: 4, backgroundColor: BRAND.line, marginBottom: 20, overflow: 'hidden' }}>
                    <div style={{ width: '38%', height: '100%', backgroundColor: BRAND.green }} />
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: BRAND.ink, marginBottom: 16, fontFamily: 'monospace' }}>Q: Which hook manages side effects?</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[{ t: 'useState', sel: false }, { t: 'useEffect', sel: true }, { t: 'useMemo', sel: false }].map((o, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px', border: `1px solid ${o.sel ? BRAND.green : BRAND.line}`, backgroundColor: BRAND.surface, color: BRAND.ink, fontFamily: 'monospace', fontSize: '13px' }}>
                            <div style={{ width: 10, height: 10, border: `1px solid ${BRAND.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {o.sel && <div style={{ width: 4, height: 4, backgroundColor: BRAND.green }} />}
                            </div>
                            {o.t}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div style={shell}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, borderBottom: `1px solid ${BRAND.line}`, paddingBottom: 12 }}>
                <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: BRAND.ink, fontFamily: 'monospace' }}>RECORD // KHA_A</div>
                    <div style={{ fontSize: '11px', color: BRAND.green, fontFamily: 'monospace' }}>STATUS: VALIDATED_100%</div>
                </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
                {['React', 'TypeScript', 'Node.js', 'Interface'].map((s) => (
                    <span key={s} style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 700, padding: '4px 8px', border: `1px solid ${BRAND.line}`, color: BRAND.ink }}>{s.toUpperCase()}</span>
                ))}
            </div>
            <button style={{ 
                width: '100%', padding: '12px 0', border: 'none', backgroundColor: BRAND.green, color: '#fff', 
                fontFamily: 'monospace', fontWeight: 700, fontSize: '13px', cursor: 'default' 
            }}>
                SUBMIT_UNIFIED_APPLICATION
            </button>
        </div>
    );
};

export default HowItWorks;