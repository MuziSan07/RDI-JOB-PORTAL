import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Rocket, Target, ShieldCheck, Users, Heart, Zap, Award,
    CheckCircle2, ArrowRight, TrendingUp, Building2, Clock, Star, Globe,
    ChevronLeft, ChevronRight
} from 'lucide-react';
import { BRAND, FONT, injectBrandStyles } from '../components/brand/brandTheme';
import BrandNav from '../components/brand/BrandNav';
import BrandFooter from '../components/brand/BrandFooter';
import { useResponsive } from '../hooks/useResponsive';
import { useCountUp } from '../hooks/useCountUp';



injectBrandStyles();

// ── Flat, High-Contrast Stat Item (No box-shadow or background pill) ──────────────────────────────────────
const Stat = ({ target, suffix = '+', label, decimals = 0 }) => {
    const [n, ref] = useCountUp(target);
    const display = decimals
    ? (n / Math.pow(10, decimals)).toFixed(decimals)
    : n.toLocaleString();
    return (
        <div style={{ textAlign: 'left', padding: '12px 0' }}>
            <div
                ref={ref}
                style={{
                    fontSize: 'clamp(32px, 4.5vw, 44px)', fontWeight: 700, letterSpacing: '-1.5px',
                    lineHeight: 1, color: BRAND.ink,
                }}
                >
                {display}{suffix}
            </div>
            <div style={{ marginTop: 8, fontSize: '13px', fontWeight: 700, color: BRAND.slate, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {label}
            </div>
        </div>
    );
};

// ── Left-Aligned Pure Editorial Section Header ─────────────────────────────────────────────────
const SectionHead = ({ eyebrowText, title, subtitle, isMobile }) => (
    <div style={{ textAlign: 'left', maxWidth: '820px', marginBottom: isMobile ? '36px' : '56px' }}>
        <div style={{ 
            fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', 
            textTransform: 'uppercase', color: BRAND.green, marginBottom: 16 
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

const TEAM = [
  { name: "Nasruddin Rupani", role: "Chairman Rupani Foundation USA", image: "/Chairman.png" },
  { name: "GM Shah", role: "Global Director Strategic Results", image: "/GM Shah.jpeg" },
  { name: "Muhammad Ikram", role: "Group Chief Operating Officer", image: "/IKRAM.png" },
  { name: "Mr Jalal-Ud-Din", role: "CEO Rupani Foundation", image: "/Jalal Uddin.png" },
  { name: "Ms. Khadija Khan", role: "Pakistan Alliance for Early Childhood", image: "/Khadija.jpeg" },
  { name: "Mr Abdul Rehman Methani", role: "Director, Rupani Foundation", image: "/Methani.png" },
  { name: "Mr Azizullah Baig", role: "CEO, Rupani Foundation USA", image: "/Mr Azizullah Baig.png" },
  { name: "Mr. Sajjad Hyder", role: "CEO, Gbeetechive", image: "/Sajjad Haider.jpeg" },
  { name: "Soha Islam", role: "Lead Full Stack Developer", image: "/Soha Islam.jpeg" },
  { name: "Syed Jalal Uddin Shah", role: "Global CEO Rupani Development Initiatives", image: "/Syed Jalal uddin.png" },
  { name: "Syed Surush Ul Kamil", role: "Deputy Group CEO", image: "/Syed Surush Kamil.png" },
  { name: "Tabbasum Karim", role: "Lead Marketing & Project Manager", image: "/Tabbasum Karim.jpeg" },
  { name: "Waseem Samad", role: "Group CEO", image: "/Waseem Sajad.png" },
  { name: "Zaib Alam", role: "Senior Economic Lead", image: "/Zaib Alam.png" },
];

const VALUES = [
    { icon: ShieldCheck, title: 'Transparency', text: 'Authenticated enterprise requisitions, clear compensation parameters, and real-time status visibility across all evaluation stages.' },
    { icon: Zap, title: 'Operational Efficiency', text: 'Unified candidate portfolios, streamlined application processing, and rapid shortlisting to accelerate placement timelines.' },
    { icon: Target, title: 'Meritocracy', text: 'Competency-based evaluation frameworks that prioritize practical capability and demonstrated expertise over subjective factors.' },
    { icon: Award, title: 'Platform Excellence', text: 'Purpose-built infrastructure designed for reliable performance, intuitive accessibility, and seamless device compatibility.' },
    { icon: Heart, title: 'Human-Centric Design', text: 'Recognizing each application as a vital step in a professional career, we foster respectful and equitable engagement across all stakeholders.' },
    { icon: Star, title: 'Data Integrity & Privacy', text: 'Comprehensive data security and strict privacy protocols, safeguarding candidate and organizational information at every level.' },
];

const MILESTONES = [
    { year: '2021', title: 'Platform Conceptualization', text: 'Initiated research to address structural inefficiencies in regional recruitment and design an equitable, merit-based selection model.' },
    { year: '2022', title: 'Initial Platform Deployment', text: 'Launched platform operations with 40 vetted partner organizations, establishing guaranteed candidate feedback and onboarding over 1,000 job seekers.' },
    { year: '2023', title: 'Integration of Competency Frameworks', text: 'Introduced department-level verification and standardized skills assessments, significantly reducing average time-to-placement.' },
    { year: '2024', title: 'Ecosystem & Regional Expansion', text: 'Expanded institutional partnerships across regional development hubs, tailoring localized roles and optimizing mobile access for diverse candidate pools.' },
    { year: '2025', title: 'Operational Scale & Institutional Impact', text: 'Achieved over 50,000 successful candidate placements while maintaining a 96% participant satisfaction rating across enterprise partners.' },
];

const About = () => {
    const navigate = useNavigate();
    const { isMobile, isTablet, isCompact } = useResponsive();

    const gridCols = isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(3,1fr)';

    return (
        <div style={{ backgroundColor: BRAND.surface, minHeight: '100vh', fontFamily: FONT, color: BRAND.ink, display: 'flex', flexDirection: 'column' }}>
            <BrandNav />

            {/* 1. LEFT-ALIGNED MINIMALIST HERO HEADER SECTION */}
            <section style={{ 
                borderBottom: `1px solid ${BRAND.line}`, 
                backgroundColor: BRAND.surface, 
                padding: isMobile ? '56px 16px' : '96px 24px',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'left' }}>
                    <div style={{ 
                        fontSize: 11, 
                        fontWeight: 700, 
                        letterSpacing: '0.14em', 
                        textTransform: 'uppercase', 
                        color: BRAND.green, 
                        marginBottom: 20 
                    }}>
                        1,200+ Professional Placements Across the RDI Network
                    </div>
                    <h1 style={{
                        fontSize: isMobile ? '38px' : isTablet ? '48px' : '64px',
                        fontWeight: 700,
                        letterSpacing: '-2.5px',
                        lineHeight: 1.06,
                        color: BRAND.ink,
                        margin: '0 0 24px 0',
                        maxWidth: '960px'
                    }}>
                        Where Professional Pathways Begin and <span style={{ color: BRAND.green }}>Sustainable Organizations Grow</span>
                    </h1>
                    <p style={{ 
                        fontSize: isMobile ? '16px' : '18px', 
                        color: BRAND.slate, 
                        maxWidth: '620px', 
                        margin: '0 0 36px 0', 
                        lineHeight: 1.65 
                    }}>
                      
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'flex-start', borderBottom: `1px solid ${BRAND.line}`, paddingBottom: '48px', marginBottom: '40px' }}>
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

                    {/* Quick Metric Inline Row */}
                    <div style={{
                        display: 'grid', 
                        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, auto)',
                        gap: isMobile ? '24px' : '64px', 
                        justifyContent: 'flex-start', 
                        alignItems: 'center'
                    }}>
                        {[
                            { big: '50K+', small: 'Careers advanced successfully' },
                            { big: '1,200+', small: 'Verified enterprise partners' },
                            { big: '96%', small: 'Candidate satisfaction rate' },
                        ].map((s, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <div style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-1px', color: BRAND.ink }}>{s.big}</div>
                                <div style={{ fontSize: '13px', fontWeight: 600, color: BRAND.slate }}>{s.small}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 2. MISSION SPLIT GRID SECTION */}
            <section style={{ 
                borderBottom: `1px solid ${BRAND.line}`,
                padding: isMobile ? '48px 16px' : '80px 24px',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: isCompact ? '1fr' : '1.1fr 0.9fr', gap: isCompact ? '40px' : '80px', alignItems: 'center' }}>
                    <div style={{ width: '100%' }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: BRAND.green, marginBottom: 16 }}>
                            Our Mission
                        </div>
                        <h2 style={{ fontSize: isMobile ? '30px' : '40px', fontWeight: 700, letterSpacing: '-1.5px', lineHeight: 1.1, margin: '0 0 20px 0' }}>
                            Establish Transparent, Efficient, and Merit-Based Recruitment Frameworks
                        </h2>
                        <p style={{ fontSize: isMobile ? '15px' : '16.5px', lineHeight: 1.65, color: BRAND.slate, margin: '0 0 32px 0' }}>
                            Traditional recruitment processes often introduce unnecessary administrative friction, delayed communication, and unaligned placement. The RDI Talent Portal bridges skilled professionals with verified institutional requisitions—providing operational transparency at every stage and evaluating candidates strictly on merit and practical capability.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {[
                                'Every applicant receives direct, timely updates throughout the evaluation lifecycle.',
                                'Enterprise partners undergo thorough verification before posting active requisitions.',
                                'Skills-based evaluation matrices ensure precise candidate-role alignment.',
                            ].map((line, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                                    <CheckCircle2 size={18} color={BRAND.green} style={{ flexShrink: 0, marginTop: 3 }} />
                                    <span style={{ fontSize: '15px', fontWeight: 600, color: BRAND.ink, lineHeight: 1.5 }}>{line}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Crisp Flat Visual Data Box — No Glow / Shadows */}
                    <div style={{
                        border: `1px solid ${BRAND.line}`, 
                        borderRadius: 8, 
                        padding: isMobile ? '24px' : '36px',
                        color: BRAND.ink, 
                        backgroundColor: BRAND.surfaceAlt, 
                        boxSizing: 'border-box',
                        width: '100%'
                    }}>
                        <Globe size={32} color={BRAND.green} style={{ marginBottom: 16 }} />
                        <div style={{ fontSize: '56px', fontWeight: 700, letterSpacing: '-2px', lineHeight: 1, color: BRAND.ink }}>11</div>
                        <p style={{ fontSize: '16px', fontWeight: 700, margin: '6px 0 16px 0', color: BRAND.ink }}>Average Days to Offer</p>
                        <div style={{ height: '1px', backgroundColor: BRAND.line, margin: '0 0 16px 0' }} />
                        <p style={{ fontSize: '14px', lineHeight: 1.6, color: BRAND.slate, margin: 0 }}>
                            This efficiency significantly outperforms regional benchmarks by replacing manual administrative overhead with structured evaluation workflows and direct candidate communication.
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. IMPACT STATS ROW SECTION */}
            <section style={{ 
                borderBottom: `1px solid ${BRAND.line}`, 
                backgroundColor: BRAND.surfaceAlt, 
                padding: isMobile ? '48px 16px' : '80px 24px',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <SectionHead
                        eyebrowText="By the numbers"
                        title="Measurable Ecosystem Impact"
                        subtitle="Quantifiable outcomes reflecting operational performance and talent deployment across regional and institutional initiatives."
                        isMobile={isMobile}
                    />
                    <div style={{
                        border: `1px solid ${BRAND.line}`,
                        borderRadius: 8, 
                        backgroundColor: BRAND.surface, 
                        padding: isMobile ? '24px' : '36px 40px',
                        display: 'grid', 
                        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', 
                        gap: '24px',
                        width: '100%',
                        boxSizing: 'border-box'
                    }}>
                        <Stat target={51200} label="Successful Placements" />
                        <Stat target={1200} label="Enterprise & Partner Entities" />
                        <Stat target={11} suffix="" label="Average Days to Offer" />
                        <Stat target={96} suffix="%" label="Satisfaction Score" />
                    </div>
                </div>
            </section>

            {/* 4. SIX-COLUMN VALUES GRID */}
            <section style={{ 
                borderBottom: `1px solid ${BRAND.line}`, 
                padding: isMobile ? '48px 16px' : '80px 24px',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <SectionHead
                        eyebrowText="What we stand for"
                        title="Core Principles Driving Organizational Selection"
                        subtitle="Core operational values that govern platform architecture, evaluation protocols, and candidate engagements."
                        isMobile={isMobile}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: '20px', width: '100%' }}>
                        {VALUES.map((v, idx) => {
                            const Icon = v.icon;
                            return (
                                <div key={idx} style={{
                                    background: BRAND.surface, 
                                    border: `1px solid ${BRAND.line}`,
                                    borderRadius: 8, 
                                    padding: '24px',
                                    boxSizing: 'border-box'
                                }}>
                                    <div style={{ color: BRAND.green, marginBottom: 16, display: 'flex', alignItems: 'center' }}>
                                        <Icon size={22} strokeWidth={2} />
                                    </div>
                                    <h3 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.4px', margin: '0 0 8px 0' }}>{v.title}</h3>
                                    <p style={{ fontSize: '14px', lineHeight: 1.55, color: BRAND.slate, margin: 0 }}>{v.text}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 5. FLAT STEP TIMELINE MILESTONES */}
            <section style={{ 
                borderBottom: `1px solid ${BRAND.line}`, 
                backgroundColor: BRAND.surfaceAlt, 
                padding: isMobile ? '48px 16px' : '80px 24px',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <SectionHead
                        eyebrowText="Our journey"
                        title="Evolution of the RDI Talent Network"
                        subtitle="A chronicle tracking the strategic expansion and institutional growth of our recruitment infrastructure."
                        isMobile={isMobile}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                        {MILESTONES.map((m, i) => (
                            <div key={i} style={{
                                background: BRAND.surface, 
                                border: `1px solid ${BRAND.line}`, 
                                borderRadius: 8,
                                padding: isMobile ? '20px' : '24px 32px',
                                display: 'grid', 
                                gridTemplateColumns: isCompact ? '1fr' : '140px 1fr', 
                                gap: isCompact ? '12px' : '32px',
                                alignItems: 'start',
                                boxSizing: 'border-box'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ fontSize: '13px', fontWeight: 700, color: BRAND.green }}>0{i + 1} //</span>
                                    <span style={{ fontSize: '20px', fontWeight: 700, color: BRAND.ink, letterSpacing: '-0.5px' }}>{m.year}</span>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '17px', fontWeight: 700, letterSpacing: '-0.3px', margin: '0 0 4px 0' }}>{m.title}</h3>
                                    <p style={{ fontSize: '14px', lineHeight: 1.55, color: BRAND.slate, margin: 0 }}>{m.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

 {/* 6. TEAM MATRIX SECTION (MINIMALIST CAROUSEL) */}
<section
    style={{
        borderBottom: `1px solid ${BRAND.line}`,
        padding: isMobile ? "48px 16px" : "80px 24px",
        width: "100%",
        boxSizing: "border-box",
    }}
>
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header containing the Section Details and Navigation Controls */}
        <div
            style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                justifyContent: "space-between",
                alignItems: isMobile ? "flex-start" : "flex-end",
                marginBottom: "32px",
                gap: "20px",
            }}
        >
            <div style={{ maxWidth: "720px" }}>
                <div
                    style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: BRAND.green,
                        marginBottom: 16,
                    }}
                >
                    The people
                </div>

                <h2
                    style={{
                        fontSize: isMobile ? "32px" : "40px",
                        fontWeight: 700,
                        letterSpacing: "-1.5px",
                        lineHeight: 1.1,
                        margin: "0 0 12px 0",
                    }}
                >
                    A small team with a big obsession
                </h2>

                <p
                    style={{
                        fontSize: "15px",
                        lineHeight: 1.6,
                        color: BRAND.slate,
                        margin: 0,
                    }}
                >
                    Engineers, product designers, and hiring specialists who
                    genuinely care about structural placement loop tracking.
                </p>
            </div>

            {/* Minimalist Slide Controls */}
            <div style={{ display: "flex", gap: "8px" }}>
                <button
                    onClick={() => {
                        const el = document.getElementById(
                            "team-carousel-track"
                        );
                        if (el)
                            el.scrollBy({
                                left: -300,
                                behavior: "smooth",
                            });
                    }}
                    style={{
                        background: "transparent",
                        border: `1px solid ${BRAND.line}`,
                        borderRadius: 6,
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: BRAND.ink,
                    }}
                    aria-label="Previous slide"
                >
                    <ChevronLeft size={18} />
                </button>

                <button
                    onClick={() => {
                        const el = document.getElementById(
                            "team-carousel-track"
                        );
                        if (el)
                            el.scrollBy({
                                left: 300,
                                behavior: "smooth",
                            });
                    }}
                    style={{
                        background: "transparent",
                        border: `1px solid ${BRAND.line}`,
                        borderRadius: 6,
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: BRAND.ink,
                    }}
                    aria-label="Next slide"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>

        {/* Carousel Scroll Track Layout */}
        <div
            id="team-carousel-track"
            style={{
                display: "flex",
                gap: "20px",
                overflowX: "auto",
                scrollSnapType: "x mandatory",
                scrollbarWidth: "none",
                WebkitOverflowScrolling: "touch",
                paddingBottom: "24px",
                width: "100%",
            }}
        >
            <style>{`
                #team-carousel-track::-webkit-scrollbar {
                    display: none;
                }
            `}</style>

            {TEAM.map((member, idx) => (
                <div
                    key={idx}
                    style={{
                        background: BRAND.surfaceAlt,
                        border: `1px solid ${BRAND.line}`,
                        borderRadius: 8,
                        padding: "20px",
                        textAlign: "left",
                        boxSizing: "border-box",
                        flex: "0 0 280px",
                        scrollSnapAlign: "start",
                    }}
                >
                    {/* Team Image */}
                    <div
                        style={{
                            width: "100%",
                            aspectRatio: "1 / 1",
                            position: "relative",
                            overflow: "hidden",
                            borderRadius: 4,
                            marginBottom: "16px",
                            backgroundColor: BRAND.line,
                        }}
                    >
<img
    src={member.image}
    alt={member.name}
    style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
    }}
/>
                    </div>

                    <h3
                        style={{
                            fontSize: "17px",
                            fontWeight: 700,
                            letterSpacing: "-0.3px",
                            margin: "0 0 2px 0",
                            color: BRAND.ink,
                        }}
                    >
                        {member.name}
                    </h3>

                    <p
                        style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: BRAND.green,
                            margin: 0,
                        }}
                    >
                        {member.role}
                    </p>
                </div>
            ))}
        </div>
    </div>
</section>

            {/* 7. MINIMAL HIGH CONTRAST CALL TO ACTION SECTION */}
            <section style={{ 
                backgroundColor: BRAND.surface, 
                padding: isMobile ? '56px 16px' : '96px 24px',
                width: '100%',
                boxSizing: 'border-box',
                textAlign: 'left',
                borderBottom: `1px solid ${BRAND.line}`
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: BRAND.green, marginBottom: 16 }}>
                        Join the mission
                    </div>
                    <h2 style={{ fontSize: isMobile ? '32px' : '44px', fontWeight: 700, letterSpacing: '-1.5px', lineHeight: 1.1, margin: '0 0 16px 0', color: BRAND.ink }}>
                        Advance Your Career or Strengthen Your Organizational Team
                    </h2>
                    <p style={{ fontSize: isMobile ? '15px' : '17px', lineHeight: 1.6, color: BRAND.slate, margin: '0 0 32px 0', maxWidth: '600px' }}>
                        Whether seeking a transformative career opportunity or recruiting professionals to drive organizational growth, the RDI Talent Portal provides the framework to achieve your objectives.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'flex-start' }}>
                        <button onClick={() => navigate('/register')} style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: BRAND.green, color: '#ffffff',
                            border: 'none', padding: '14px 28px', borderRadius: 6, fontSize: '14.5px', fontWeight: 600,
                            cursor: 'pointer', fontFamily: FONT,
                        }}>
                            Create Candidate Account <ArrowRight size={16} />
                        </button>
                        <button onClick={() => navigate('/jobs')} style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: 'transparent',
                            color: BRAND.ink, border: `1px solid ${BRAND.line}`, padding: '13px 26px',
                            borderRadius: 6, fontSize: '14.5px', fontWeight: 600, cursor: 'pointer', fontFamily: FONT,
                        }}>
                            Explore Open Roles
                        </button>
                    </div>
                </div>
            </section>

            <BrandFooter />
        </div>
    );
};

export default About;