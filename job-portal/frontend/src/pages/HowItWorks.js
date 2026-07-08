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
    { title: 'Create your profile', desc: 'Set up a free account, add your resume, skills, and experience once Your profile becomes your reusable, one-click application kit' },
    { title: 'Discover & match', desc: 'Search by title, skill, or department or let smart matching surface roles that actually fit Filter by remote, hybrid, salary, and more' },
    { title: 'Apply + take assessment', desc: 'Apply in a single click For relevant roles, complete a short, role-specific skills assessment right inside your application no extra logins' },
    { title: 'Track & get hired', desc: 'Follow every stage update in real time applied, screening, assessment, interview, and offer then step into your next chapter' },
];

const DEEP_DIVES = [
    {
        eyebrowText: 'Real-time tracking',
        icon: TrendingUp,
        title: 'Always know exactly where you stand',
        body: 'No more refreshing your inbox or guessing Every application moves through clear, visible stages, and the moment an employer updates your status, you see it One timeline, one source of truth',
        bullets: ['Live status from applied to offer', 'Email + in-app notifications', 'Full history for every application'],
        mock: 'tracking',
    },
    {
        eyebrowText: 'Built-in assessments',
        icon: ShieldCheck,
        title: 'Prove your skills before the interview',
        body: 'Stand out with role-specific assessments that run right inside your application Candidates show real ability, and employers get objective signal instead of guesswork from a resume alone',
        bullets: ['Role-tailored questions', 'Auto-scored, instant submission', 'Fairer shortlisting for everyone'],
        mock: 'assessment',
    },
    {
        eyebrowText: 'One-click apply',
        icon: Zap,
        title: 'Apply to your next role in seconds',
        body: 'Build your profile and upload your resume once From then on, applying to any open role is a single click your details, skills, and documents travel with you automatically',
        bullets: ['Reusable profile & resume', 'No repetitive forms', 'Save roles and apply later'],
        mock: 'oneclick',
    },
];

const WHY_STATS = [
    { value: '1-click', label: 'to apply once your profile is set', percentage: 100 },
    { value: '< 5 min', label: 'average time to post a job', percentage: 85 },
    { value: '94%', label: 'match success rate', percentage: 94 },
    { value: '100%', label: 'verified employers & departments', percentage: 100 },
];

const FAQS = [
    { q: 'How do I apply to a job?', a: 'Create a free account, complete your profile and upload a resume, then open any role and hit Apply Once your profile is set, applying to future roles is a single click' },
    { q: 'What are the skill assessments?', a: 'Some roles include a short, role-specific assessment that runs right inside your application It is auto-scored on submission and helps employers fairly compare candidates on real ability rather than resumes alone' },
    { q: 'Is JobPortal free for job seekers?', a: 'Yes Browsing roles, creating a profile, applying, taking assessments, and tracking your applications are all completely free for candidates there are no hidden fees' },
    { q: 'How does application tracking work?', a: 'Every application moves through clear, visible stages applied, screening, assessment, interview, and offer The moment an employer updates your status you see it in real time, with email and in-app notifications' },
    { q: 'Do I need an account to browse jobs?', a: 'You can browse and search every open role without an account You only need to sign up when you are ready to apply, take an assessment, or track your progress' },
    { q: 'How do employers post a job?', a: 'Employers sign in to the employer dashboard, click Post a Job, and publish a verified opening in minutes setting requirements, vacancies, salary, and work type Applicants then arrive with complete profiles ready to review' },
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
                        Your next role, from <span style={{ color: BRAND.green }}>first click</span> to first day.
                    </h1>
                    <p style={{ 
                        fontSize: isMobile ? '16px' : '18px', color: BRAND.slate, 
                        maxWidth: '620px', margin: '0 0 36px 0', lineHeight: 1.65 
                    }}>
                        JobPortal turns the messy hiring journey into a few clear steps whether you are searching for the role that changes everything, or building the team that will.
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'flex-start', marginBottom: 40 }}>
                        <button 
                            onClick={() => navigate('/register')} 
                            style={{ 
                                display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: BRAND.green, color: '#ffffff', 
                                border: 'none', padding: '13px 24px', borderRadius: 6, fontSize: '14.5px', fontWeight: 600, cursor: 'pointer', fontFamily: FONT 
                            }}
                        >
                            Get started free <ArrowRight size={16} />
                        </button>
                        <button 
                            onClick={() => navigate('/jobs')} 
                            style={{ 
                                display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: 'transparent', color: BRAND.ink, 
                                border: `1px solid ${BRAND.line}`, padding: '13px 24px', borderRadius: 6, fontSize: '14.5px', fontWeight: 600, cursor: 'pointer', fontFamily: FONT 
                            }}
                        >
                            Browse open roles
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, borderTop: `1px solid ${BRAND.line}`, paddingTop: 24 }}>
                        {[
                            { icon: Search, label: 'For job seekers' },
                            { icon: Briefcase, label: 'For employers' },
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
                        eyebrowText="Candidate Pipeline"
                        title="Find, apply, and get hired in four steps"
                        subtitle="One profile powers everything Build it once, then move from discovery to offer without the busywork"
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
                        eyebrowText="System Architecture"
                        title="The features that make it feel effortless"
                        subtitle="A closer look at the algorithmic modules built to handle processing volume"
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
                        eyebrowText="Metrics & Signal"
                        title="Built to respect everyone's time"
                        subtitle="Aggregated system parameters proving platform optimization performance values"
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
                        eyebrowText="Documentation"
                        title="Questions, answered"
                        subtitle="Everything you might want to know before you get started"
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
                        // Initialization Module
                    </div>
                    <h2 style={{ fontSize: isMobile ? '32px' : '44px', fontWeight: 700, letterSpacing: '-1.5px', lineHeight: 1.1, margin: '0 0 16px 0', color: BRAND.ink }}>
                        Deploy your profile
                    </h2>
                    <p style={{ fontSize: isMobile ? '15px' : '17px', lineHeight: 1.6, color: BRAND.slate, margin: '0 0 32px 0', maxWidth: '600px' }}>
                        Still have questions? The best way to learn is to dive in and compile your account environment parameters
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'flex-start' }}>
                        <button onClick={() => navigate('/register')} style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: BRAND.green, color: '#ffffff',
                            border: 'none', padding: '14px 28px', borderRadius: 6, fontSize: '14.5px', fontWeight: 600,
                            cursor: 'pointer', fontFamily: FONT,
                        }}>
                            Create a free account
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
            { label: 'Application submitted', done: true },
            { label: 'Screening', done: true },
            { label: 'Skills assessment', done: true },
            { label: 'Interview', done: false, active: true },
            { label: 'Offer', done: false },
        ];
        return (
            <div style={shell}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, borderBottom: `1px solid ${BRAND.line}`, paddingBottom: 12 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: BRAND.ink, fontFamily: 'monospace' }}>MODULE // FRONTEND_ENG</div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: BRAND.green, fontFamily: 'monospace' }}>[IN_PROGRESS]</span>
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
                EXECUTE_ONE_CLICK_APPLICATION
            </button>
        </div>
    );
};

export default HowItWorks;