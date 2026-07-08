import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, Target, BarChart2, Clock, ShieldCheck, FileText,
    Send, Quote, ArrowLeft, ArrowRight, Activity, Terminal, Cpu
} from 'lucide-react';
import BrandNav from '../components/brand/BrandNav';
import BrandFooter from '../components/brand/BrandFooter';
import { BRAND, FONT, injectBrandStyles } from '../components/brand/brandTheme';
import { useResponsive } from '../hooks/useResponsive';
import { useCountUp } from '../hooks/useCountUp';

injectBrandStyles();

// ── Flat Data Bar Component ──────────────────────────────────────────────────
const DataBar = ({ percentage }) => (
    <div style={{ width: '100%', height: '6px', backgroundColor: BRAND.line, borderRadius: '3px', marginTop: '12px', overflow: 'hidden' }}>
        <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: BRAND.green, borderRadius: '3px' }} />
    </div>
);

// ── Flat, High-Contrast Stat Item with Data Bar ──────────────────────────────
const Stat = ({ value, suffix = '+', label, percentage = 75 }) => {
    const [n, ref] = useCountUp(value);
    return (
        <div style={{ textAlign: 'left', padding: '20px', borderRight: `1px solid ${BRAND.line}`, lastChild: { borderRight: 'none' } }}>
            <div
                ref={ref}
                style={{
                    fontSize: 'clamp(32px, 4.5vw, 44px)', fontWeight: 700, letterSpacing: '-1.5px',
                    lineHeight: 1, color: BRAND.ink,
                }}
            >
                {n.toLocaleString()}{suffix}
            </div>
            <div style={{ marginTop: 8, fontSize: '12px', fontWeight: 700, color: BRAND.slate, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {label}
            </div>
            <DataBar percentage={percentage} />
        </div>
    );
};

// ── Left-Aligned Pure Editorial Section Header ────────────────────────────────
const SectionHead = ({ eyebrowText, title, subtitle, isMobile }) => (
    <div style={{ textAlign: 'left', maxWidth: '820px', marginBottom: isMobile ? '36px' : '56px', borderLeft: `3px solid ${BRAND.green}`, paddingLeft: '20px' }}>
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

const ForEmployers = () => {
    const navigate = useNavigate();
    const { isMobile, isTablet, isCompact } = useResponsive();
    const [activeStory, setActiveStory] = useState(0);

    // ── Data ──
    const valueProps = [
        { icon: Search, title: 'Reach qualified candidates', body: 'Publish to a curated pool of active, work-ready job seekers and surface your roles to people whose skills actually match.' },
        { icon: Target, title: 'Built-in skill assessments', body: 'Attach role-specific tests to any posting and let scored results rank applicants automatically before the first call.' },
        { icon: BarChart2, title: 'Applicant tracking dashboard', body: 'Move candidates through stages, leave notes, and keep your whole hiring team aligned in one shared pipeline.' },
        { icon: Clock, title: 'Faster time-to-hire', body: 'Automated screening, one-click shortlists, and templated outreach cut weeks off your average requisition cycle.' },
        { icon: ShieldCheck, title: 'Verified candidate profiles', body: 'Profiles include validated contact details, work history, and completed assessments less noise, more signal.' },
        { icon: FileText, title: 'Activity & audit logs', body: 'Every action is timestamped and traceable, giving HR and compliance a clear record of each hiring decision.' },
    ];

    const steps = [
        { stepNum: '01', title: 'Post a role', body: 'Create a polished job listing in minutes with smart templates, salary ranges, and required skills.' },
        { stepNum: '02', title: 'Receive & screen', body: 'Applications flow straight into your dashboard, auto-sorted by match score and completeness.' },
        { stepNum: '03', title: 'Assess & interview', body: 'Send assessments, compare results side by side, and schedule interviews with your top candidates.' },
        { stepNum: '04', title: 'Hire & log', body: 'Extend the offer, mark the role filled, and keep a full audit trail of how the decision was made.' },
    ];

    const stats = [
        { value: 12, suffix: ' Days', label: 'Avg days to hire', percentage: 85 },
        { value: 25000, suffix: '+', label: 'Candidate pool', percentage: 95 },
        { value: 92, suffix: '%', label: 'Qualified-match rate', percentage: 92 },
        { value: 40, suffix: '+', label: 'Partner departments', percentage: 70 },
    ];

    const stories = [
        {
            initials: 'MR',
            name: 'Maria Reyes',
            role: 'Head of Talent, Northwind Logistics',
            quote: '“We filled three roles in under two weeks. The built-in assessments meant every candidate on our shortlist was already vetted interviews went from guesswork to genuinely productive conversations.”'
        },
        {
            initials: 'AH',
            name: 'Asif Haroon',
            role: 'HR Director, Rupani Foundation',
            quote: '“The compliance tracking and clear audit trails simplified our department expansions. We eliminated overhead processing times completely while landing top-tier engineers.”'
        },
        {
            initials: 'ZN',
            name: 'Zainab Nabil',
            role: 'Talent Acquisition, Shoppoint Inc',
            quote: '“Auto-sorted dashboard screening matches candidates straight against real operational requirements. No time wasted filtering unvetted applications anymore.”'
        }
    ];

    const handlePrevStory = () => {
        setActiveStory((prev) => (prev === 0 ? stories.length - 1 : prev - 1));
    };

    const handleNextStory = () => {
        setActiveStory((prev) => (prev === stories.length - 1 ? 0 : prev + 1));
    };

    return (
        <div style={{ backgroundColor: BRAND.surface, minHeight: '100vh', fontFamily: FONT, color: BRAND.ink, display: 'flex', flexDirection: 'column' }}>
            <BrandNav />

            {/* 1. LEFT-ALIGNED MINIMALIST HERO WITH MATRIX MATRIX BACKGROUND */}
            <section style={{ 
                borderBottom: `1px solid ${BRAND.line}`, 
                backgroundColor: BRAND.surface, 
                padding: isMobile ? '56px 16px' : '96px 24px',
                width: '100%',
                boxSizing: 'border-box',
                position: 'relative'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'left' }}>
                    <div style={{ 
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', 
                        textTransform: 'uppercase', color: BRAND.green, marginBottom: 20 
                    }}>
                        <Terminal size={14} /> Pipeline Optimization Engine
                    </div>
                    <h1 style={{
                        fontSize: isMobile ? '38px' : isTablet ? '48px' : '64px',
                        fontWeight: 700, letterSpacing: '-2.5px', lineHeight: 1.06,
                        color: BRAND.ink, margin: '0 0 24px 0', maxWidth: '960px'
                    }}>
                        Hire exceptional talent, <span style={{ color: BRAND.green }}>faster.</span>
                    </h1>
                    <p style={{ 
                        fontSize: isMobile ? '16px' : '18px', color: BRAND.slate, 
                        maxWidth: '620px', margin: '0 0 36px 0', lineHeight: 1.65 
                    }}>
                        Reach thousands of verified, assessment-ready candidates and run your entire hiring process postings, screening, interviews, and offers on one structured platform.
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'flex-start' }}>
                        <button 
                            onClick={() => navigate('/admin/login')} 
                            style={{ 
                                display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: BRAND.green, color: '#ffffff', 
                                border: 'none', padding: '13px 24px', borderRadius: 6, fontSize: '14.5px', fontWeight: 600, cursor: 'pointer', fontFamily: FONT 
                            }}
                        >
                            Post a job <ArrowRight size={16} />
                        </button>
                        <button 
                            onClick={() => navigate('/contact')} 
                            style={{ 
                                display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: 'transparent', color: BRAND.ink, 
                                border: `1px solid ${BRAND.line}`, padding: '13px 24px', borderRadius: 6, fontSize: '14.5px', fontWeight: 600, cursor: 'pointer', fontFamily: FONT 
                            }}
                        >
                            Talk to sales
                        </button>
                    </div>
                </div>
            </section>

            {/* 2. VALUE PROPS GRID MATRIX */}
            <section style={{ 
                borderBottom: `1px solid ${BRAND.line}`, 
                padding: isMobile ? '48px 16px' : '80px 24px',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <SectionHead
                        eyebrowText="System Features"
                        title="Everything you need to hire with confidence"
                        subtitle="Powerful, recruiter-friendly tools that turn a flood of applications into a clear, ranked shortlist."
                        isMobile={isMobile}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: '1px', backgroundColor: BRAND.line, width: '100%' }}>
                        {valueProps.map((v, idx) => {
                            const Icon = v.icon;
                            return (
                                <div key={idx} style={{
                                    background: BRAND.surface, 
                                    padding: '32px 24px', boxSizing: 'border-box'
                                }}>
                                    <div style={{ color: BRAND.green, marginBottom: 16, display: 'flex', alignItems: 'center' }}>
                                        <Icon size={22} strokeWidth={2} />
                                    </div>
                                    <h3 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.4px', margin: '0 0 8px 0' }}>{v.title}</h3>
                                    <p style={{ fontSize: '14px', lineHeight: 1.55, color: BRAND.slate, margin: 0 }}>{v.body}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 3. ALGORITHMIC STEP FLOW CHART SECTION */}
            <section style={{ 
                borderBottom: `1px solid ${BRAND.line}`, 
                backgroundColor: BRAND.surfaceAlt, 
                padding: isMobile ? '48px 16px' : '80px 24px',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <SectionHead
                        eyebrowText="Execution Protocol"
                        title="From open role to signed offer"
                        subtitle="A clear four-step flow that keeps candidates moving and your team in sync."
                        isMobile={isMobile}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', width: '100%', borderLeft: `2px solid ${BRAND.line}` }}>
                        {steps.map((m, i) => (
                            <div key={i} style={{
                                background: BRAND.surface, 
                                borderBottom: i === steps.length - 1 ? `1px solid ${BRAND.line}` : `1px solid ${BRAND.line}`,
                                borderTop: i === 0 ? `1px solid ${BRAND.line}` : 'none',
                                borderRight: `1px solid ${BRAND.line}`,
                                padding: '32px 40px',
                                display: 'grid', 
                                gridTemplateColumns: isCompact ? '1fr' : '180px 1fr', 
                                gap: isCompact ? '16px' : '40px', 
                                alignItems: 'center', 
                                boxSizing: 'border-box',
                                position: 'relative'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '8px', height: '8px', backgroundColor: BRAND.green, borderRadius: '50%', position: 'absolute', left: '-5px' }} />
                                    <span style={{ fontSize: '14px', fontWeight: 700, color: BRAND.green, letterSpacing: '0.05em', fontFamily: 'monospace' }}>
                                        [{m.stepNum}]
                                    </span>
                                    <span style={{ fontSize: '16px', fontWeight: 700, color: BRAND.ink }}>
                                        STAGE
                                    </span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: BRAND.ink }}>
                                        {m.title}
                                    </h3>
                                    <p style={{ fontSize: '14px', lineHeight: 1.6, color: BRAND.slate, margin: 0 }}>
                                        {m.body}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. ALGORITHMIC PERFORMANCE METRICS CHART BLOCK */}
            <section style={{ 
                borderBottom: `1px solid ${BRAND.line}`, 
                padding: isMobile ? '48px 16px' : '80px 24px',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <SectionHead
                        eyebrowText="Performance Metrics"
                        title="Hiring outcomes you can measure"
                        subtitle="Aggregated metrics from employers running their requisitions on our platform."
                        isMobile={isMobile}
                    />
                    <div style={{
                        border: `1px solid ${BRAND.line}`,
                        backgroundColor: BRAND.surface,
                        display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', 
                        gap: '0px', width: '100%', boxSizing: 'border-box'
                    }}>
                        {stats.map((st, i) => <Stat key={i} {...st} />)}
                    </div>
                </div>
            </section>

            {/* 5. SLIDER CAROUSEL TESTIMONIALS */}
            <section style={{ 
                borderBottom: `1px solid ${BRAND.line}`, 
                backgroundColor: BRAND.surfaceAlt,
                padding: isMobile ? '48px 16px' : '80px 24px',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    
                    <div style={{ 
                        border: `1px solid ${BRAND.line}`, 
                        borderRadius: 0, 
                        padding: isMobile ? '32px 24px' : '56px',
                        backgroundColor: BRAND.surface, 
                        position: 'relative',
                        boxSizing: 'border-box'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>

                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: BRAND.slate, fontFamily: 'monospace' }}>
                                     0{activeStory + 1} / 0{stories.length}
                                </span>
                                <div style={{ display: 'flex', border: `1px solid ${BRAND.line}`, borderRadius: 0, overflow: 'hidden' }}>
                                    <button 
                                        onClick={handlePrevStory}
                                        style={{
                                            background: 'transparent', border: 'none', borderRight: `1px solid ${BRAND.line}`,
                                            width: '36px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', color: BRAND.ink
                                        }}
                                        aria-label="Previous story"
                                    >
                                        <ArrowLeft size={14} />
                                    </button>
                                    <button 
                                        onClick={handleNextStory}
                                        style={{
                                            background: 'transparent', border: 'none',
                                            width: '36px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', color: BRAND.ink
                                        }}
                                        aria-label="Next story"
                                    >
                                        <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div style={{ minHeight: isMobile ? '180px' : '140px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <blockquote style={{ 
                                fontSize: isMobile ? '19px' : '26px', 
                                fontWeight: 700, 
                                lineHeight: 1.4, 
                                letterSpacing: '-0.5px', 
                                color: BRAND.ink, 
                                margin: '0 0 32px 0' 
                            }}>
                                {stories[activeStory].quote}
                            </blockquote>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ 
                                width: 48, 
                                height: 48, 
                                borderRadius: 0, 
                                backgroundColor: BRAND.surfaceAlt, 
                                border: `1px solid ${BRAND.line}`,
                                color: BRAND.ink, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                fontWeight: 700, 
                                fontSize: '15px',
                                fontFamily: 'monospace'
                            }}>
                                {stories[activeStory].initials}
                            </div>
                            <div>
                                <div style={{ fontSize: '15px', fontWeight: 700, color: BRAND.ink }}>
                                    {stories[activeStory].name}
                                </div>
                                <div style={{ fontSize: '13px', color: BRAND.slate, fontWeight: 600 }}>
                                    {stories[activeStory].role}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* 6. HIGH CONTRAST FLAT INTERFACE CTA */}
            <section style={{ 
                backgroundColor: BRAND.surface, 
                padding: isMobile ? '56px 16px' : '96px 24px',
                width: '100%',
                boxSizing: 'border-box',
                textAlign: 'left',
                borderBottom: `1px solid ${BRAND.line}`
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: BRAND.green, marginBottom: 16 }}>
                        <Activity size={14} /> Initialization Terminal
                    </div>
                    <h2 style={{ fontSize: isMobile ? '32px' : '44px', fontWeight: 700, letterSpacing: '-1.5px', lineHeight: 1.1, margin: '0 0 16px 0', color: BRAND.ink }}>
                        Start hiring today
                    </h2>
                    <p style={{ fontSize: isMobile ? '15px' : '17px', lineHeight: 1.6, color: BRAND.slate, margin: '0 0 32px 0', maxWidth: '600px' }}>
                        Post your first role in minutes and meet a pipeline of verified, assessment-ready candidates.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'flex-start' }}>
                        <button onClick={() => navigate('/admin/login')} style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: BRAND.green, color: '#ffffff',
                            border: 'none', padding: '14px 28px', borderRadius: 6, fontSize: '14.5px', fontWeight: 600,
                            cursor: 'pointer', fontFamily: FONT,
                        }}>
                            <Send size={16} /> Start hiring today
                        </button>
                        <button onClick={() => navigate('/contact')} style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: 'transparent',
                            color: BRAND.ink, border: `1px solid ${BRAND.line}`, padding: '13px 26px',
                            borderRadius: 6, fontSize: '14.5px', fontWeight: 600, cursor: 'pointer', fontFamily: FONT,
                        }}>
                            Talk to sales
                        </button>
                    </div>
                </div>
            </section>

            <BrandFooter />
        </div>
    );
};

export default ForEmployers;