import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, Briefcase, Users, TrendingUp, DollarSign, ArrowRight, ArrowUpRight,
    ChevronLeft, ChevronRight, Clock, Globe, Lock, Check, Plus, Minus,
} from 'lucide-react';
import BrandNav from '../components/brand/BrandNav';
import BrandFooter from '../components/brand/BrandFooter';
import { BRAND, FONT, page, injectBrandStyles } from '../components/brand/brandTheme';
import { useResponsive } from '../hooks/useResponsive';
import { useCountUp } from '../hooks/useCountUp';
import { jobsService } from '../services/jobsService';
import { jobSeekerAuthService } from '../services/jobSeekerAuthService';

injectBrandStyles();

// ───── Local, minimal-only style helpers (deliberately flat — no glow, no lift) ─────
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
        padding: '12px 22px', borderRadius: 8, fontSize: 14.5, fontWeight: 600,
        cursor: 'pointer', fontFamily: FONT, transition: 'border-color .15s ease',
    },
    text: {
        display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
        color: BRAND.ink, fontSize: 14.5, fontWeight: 600, cursor: 'pointer', fontFamily: FONT, padding: 0,
    },
};

const label = (children, tint = BRAND.muted) => (
    <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: tint }}>
        {children}
    </div>
);

const Landing = () => {
    const navigate = useNavigate();
    const { isMobile, isTablet, isCompact } = useResponsive();
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({ total_jobs: 0, total_companies: 0, total_applications: 0 });
    const [featuredJobs, setFeaturedJobs] = useState([]);
    const [loadingJobs, setLoadingJobs] = useState(true);

    const user = jobSeekerAuthService.getCurrentUser();
    const isLoggedIn = !!user;

    useEffect(() => {
        (async () => {
            try {
                const [statsData, jobsData] = await Promise.all([
                    jobsService.getStatistics(),
                    jobsService.getPublicJobs({ page_size: 6 }),
                ]);
                setStats(statsData);
                setFeaturedJobs(jobsData.results || []);
            } catch (e) {
                console.error('Error loading data:', e);
            } finally {
                setLoadingJobs(false);
            }
        })();
    }, []);

    const handleSearch = () => navigate(`/jobs?search=${encodeURIComponent(searchTerm)}`);

    const heroTitleSize = isMobile ? 34 : isTablet ? 46 : 64;

    return (
        <div style={page.root}>
            <BrandNav />

            {/* ───── HERO ───── */}
            <section style={{ background: BRAND.surface, borderBottom: `1px solid ${BRAND.line}` }}>
                <div style={{ ...page.section, padding: isMobile ? '64px 16px 56px' : '120px 24px 100px' }}>
                    {isLoggedIn ? (
                        <div style={{ marginBottom: 20 }}>{label(`Welcome back, ${user?.first_name || user?.username}`, BRAND.green)}</div>
                    ) : (
                        <div style={{ marginBottom: 20 }}>{label('1,200+ hires this year', BRAND.green)}</div>
                    )}

                    <h1 style={{ fontSize: heroTitleSize, fontWeight: 700, lineHeight: 1.08, letterSpacing: '-2px', margin: '0 0 24px', maxWidth: 820, color: BRAND.ink }}>
                        Where great careers begin, and <span style={{ color: BRAND.green }}>ambitious teams</span> grow.
                    </h1>

                    <p style={{ fontSize: isMobile ? 16 : 18, color: BRAND.slate, lineHeight: 1.65, margin: '0 0 44px', maxWidth: 560 }}>
                        Discover roles across top departments, apply in one click, and track every stage from application to offer.
                    </p>

                    {/* Search */}
                    <div style={{ maxWidth: 620, marginBottom: 20 }}>
                        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 10 : 0, border: `1px solid ${BRAND.ink}`, borderRadius: 8, overflow: isMobile ? 'visible' : 'hidden' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, padding: '14px 16px' }}>
                                <Search size={17} color={BRAND.faint} strokeWidth={1.75} />
                                <input
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder="Job title, skill, or company"
                                    style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, color: BRAND.ink, background: 'transparent', fontFamily: FONT, width: '100%' }}
                                />
                            </div>
                            <button onClick={handleSearch} style={{ ...btn.primary, borderRadius: isMobile ? 8 : 0, border: 'none', padding: '14px 26px' }}>
                                Search
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 22px', color: BRAND.muted, fontSize: 13.5 }}>
                        {['Remote', 'Engineering', 'Design', 'Marketing', 'Finance'].map((t) => (
                            <button key={t} onClick={() => navigate(`/jobs?search=${t}`)} className="brand-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT, fontSize: 13.5, color: BRAND.muted, padding: 0, borderBottom: '1px solid transparent' }}>
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <StatsRow stats={stats} isMobile={isMobile} />
            </section>

            {/* ───── FEATURED JOBS ───── */}
            <section style={{ background: BRAND.surface, padding: isMobile ? '56px 0' : '96px 0' }}>
                <div style={page.section}>
                    <div style={{ display: 'flex', flexDirection: isCompact ? 'column' : 'row', alignItems: isCompact ? 'flex-start' : 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 44 }}>
                        <div>
                            <div style={{ marginBottom: 12 }}>{label('Open positions')}</div>
                            <h2 style={{ fontSize: isMobile ? 28 : 38, fontWeight: 700, letterSpacing: '-1.1px', margin: 0, color: BRAND.ink }}>Featured opportunities</h2>
                        </div>
                        <button onClick={() => navigate('/jobs')} style={btn.text} className="brand-link">
                            View all jobs <ArrowRight size={15} strokeWidth={2} />
                        </button>
                    </div>

                    {loadingJobs ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '70px 0' }}>
                            <div style={{ width: 30, height: 30, border: `2px solid ${BRAND.line}`, borderTop: `2px solid ${BRAND.ink}`, borderRadius: '50%', animation: 'brandSpin .8s linear infinite' }} />
                            <p style={{ color: BRAND.muted, marginTop: 14, fontSize: 14 }}>Loading roles…</p>
                        </div>
                    ) : featuredJobs.length === 0 ? (
                        <div style={{ padding: '64px 0', borderTop: `1px solid ${BRAND.line}`, borderBottom: `1px solid ${BRAND.line}`, textAlign: 'center' }}>
                            <p style={{ color: BRAND.muted, fontSize: 15 }}>No open roles right now — check back soon.</p>
                        </div>
                    ) : (
                        <div style={{ borderTop: `1px solid ${BRAND.line}` }}>
                            {featuredJobs.map((job) => (
                                <JobRow key={job.id} job={job} isLoggedIn={isLoggedIn} navigate={navigate} isMobile={isMobile} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ───── FOR JOB SEEKERS — text left, mark right ───── */}
            <SplitSection
                reverse={false}
                tone="green"
                isMobile={isMobile}
                isCompact={isCompact}
                eyebrowText="For job seekers"
                title="Your next role, without the guesswork."
                body="Build your profile once and let it work for you. See exactly where every application stands, take role-specific assessments inline, and never wonder if your resume disappeared into a black hole."
                bullets={[
                    'One profile, unlimited applications',
                    'Real-time status on every stage',
                    'Skills assessments built into the flow',
                    'Alerts the moment a matching role opens',
                ]}
                cta={{ label: 'Create your profile', onClick: () => navigate('/register') }}
            />

            {/* ───── WHY JOBPORTAL ───── */}
            <section style={{ background: BRAND.surfaceAlt, padding: isMobile ? '56px 0' : '100px 0', borderTop: `1px solid ${BRAND.line}`, borderBottom: `1px solid ${BRAND.line}` }}>
                <div style={{ ...page.section, display: 'grid', gridTemplateColumns: isCompact ? '1fr' : '0.85fr 1.15fr', gap: isCompact ? 40 : 80 }}>
                    <div>
                        <div style={{ marginBottom: 14 }}>{label('Why JobPortal')}</div>
                        <h2 style={{ fontSize: isMobile ? 28 : 36, fontWeight: 700, letterSpacing: '-1.1px', margin: '0 0 16px', color: BRAND.ink }}>
                            Built for people who value their time.
                        </h2>
                        <p style={{ fontSize: 15.5, color: BRAND.slate, lineHeight: 1.7, margin: 0, maxWidth: 340 }}>
                            A hiring experience without the noise for candidates and employers alike.
                        </p>
                    </div>

                    <div>
                        {FEATURES.map((f, i) => (
                            <div key={f.title} style={{ display: 'flex', gap: 24, padding: '26px 0', borderTop: i === 0 ? `1px solid ${BRAND.line}` : 'none', borderBottom: `1px solid ${BRAND.line}` }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.faint, minWidth: 28, paddingTop: 2 }}>0{i + 1}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                        <f.icon size={17} color={BRAND.ink} strokeWidth={1.75} />
                                        <h3 style={{ fontSize: 16.5, fontWeight: 700, margin: 0, color: BRAND.ink }}>{f.title}</h3>
                                    </div>
                                    <p style={{ fontSize: 14.5, color: BRAND.slate, lineHeight: 1.65, margin: 0, maxWidth: 460 }}>{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───── FOR EMPLOYERS — mark left, text right ───── */}
            <SplitSection
                reverse
                tone="gold"
                isMobile={isMobile}
                isCompact={isCompact}
                eyebrowText="For employers"
                title="Hire people who actually fit the role."
                body="Post a role in minutes, screen with built-in assessments, and see every candidate ranked by fit not just by who applied first. RDI JobPortal handles the busywork so your team can focus on the conversation."
                bullets={[
                    'Verified employer profile in one review',
                    'Applicant tracking across every stage',
                    'Custom assessments per role',
                    'Analytics on time-to-hire and drop-off',
                ]}
                cta={{ label: 'Post your first job', onClick: () => navigate('/for-employers') }}
            />

            {/* ───── HOW IT WORKS ───── */}
            <section style={{ background: BRAND.surface, padding: isMobile ? '56px 0' : '100px 0' }}>
                <div style={page.section}>
                    <div style={{ marginBottom: 12 }}>{label('Simple process')}</div>
                    <h2 style={{ fontSize: isMobile ? 28 : 38, fontWeight: 700, letterSpacing: '-1.1px', margin: '0 0 48px', color: BRAND.ink }}>From search to offer in three steps.</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', borderTop: `1px solid ${BRAND.line}` }}>
                        {STEPS.map((s, i) => (
                            <div key={s.title} style={{ padding: isMobile ? '28px 0' : '36px 32px 36px 0', borderBottom: `1px solid ${BRAND.line}`, borderRight: (!isMobile && i < STEPS.length - 1) ? `1px solid ${BRAND.line}` : 'none' }}>
                                <div style={{ fontSize: 34, fontWeight: 700, color: BRAND.line, marginBottom: 18, letterSpacing: '-1px' }}>0{i + 1}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
                                    <s.icon size={18} color={BRAND.ink} strokeWidth={1.75} />
                                    <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: BRAND.ink }}>{s.title}</h3>
                                </div>
                                <p style={{ fontSize: 14.5, color: BRAND.slate, lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
                            </div>
                        ))}
                    </div>

                    <button onClick={() => navigate('/how-it-works')} style={{ ...btn.text, marginTop: 32 }} className="brand-link">
                        See how it works <ArrowRight size={15} />
                    </button>
                </div>
            </section>

            {/* ───── TESTIMONIALS — story-style progress carousel ───── */}
            <section style={{ background: BRAND.surfaceAlt, padding: isMobile ? '64px 0' : '112px 0', borderTop: `1px solid ${BRAND.line}` }}>
                <div style={page.section}>
                    <div style={{ marginBottom: 12, textAlign: isMobile ? 'left' : 'center' }}>{label('Loved by candidates')}</div>
                    <TestimonialCarousel items={TESTIMONIALS} isMobile={isMobile} />
                </div>
            </section>

            {/* ───── FAQ ───── */}
            <section style={{ background: BRAND.surface, padding: isMobile ? '56px 0' : '96px 0', borderTop: `1px solid ${BRAND.line}` }}>
                <div style={{ ...page.section, display: 'grid', gridTemplateColumns: isCompact ? '1fr' : '0.85fr 1.15fr', gap: isCompact ? 32 : 80 }}>
                    <div>
                        <div style={{ marginBottom: 14 }}>{label('Questions')}</div>
                        <h2 style={{ fontSize: isMobile ? 26 : 34, fontWeight: 700, letterSpacing: '-1px', margin: 0, color: BRAND.ink }}>
                            Frequently asked.
                        </h2>
                    </div>
                    <FAQList items={FAQS} />
                </div>
            </section>

            {/* ───── SIGN-UP STRIP (guests) ───── */}
            {!isLoggedIn && (
                <section style={{ background: BRAND.surfaceAlt, padding: isMobile ? '40px 0' : '56px 0', borderTop: `1px solid ${BRAND.line}` }}>
                    <div style={page.section}>
                        <div style={{ display: 'flex', flexDirection: isCompact ? 'column' : 'row', alignItems: isCompact ? 'flex-start' : 'center', justifyContent: 'space-between', gap: 20 }}>
                            <div>
                                <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 6px', color: BRAND.ink }}>Create a free account to apply</h3>
                                <p style={{ fontSize: 14.5, color: BRAND.slate, margin: 0 }}>Browse freely sign up only when you're ready to apply.</p>
                            </div>
                            <div style={{ display: 'flex', gap: 10, flexShrink: 0, width: isCompact ? '100%' : 'auto' }}>
                                <button onClick={() => navigate('/register')} style={{ ...btn.primary, flex: isCompact ? 1 : 'none' }}>Sign Up Free</button>
                                <button onClick={() => navigate('/login')} style={{ ...btn.ghost, flex: isCompact ? 1 : 'none' }}>Sign In</button>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <BrandFooter />
        </div>
    );
};

// ───── Sunburst mark — an abstraction of the RDI logo icon, used in place of stock photography ─────
const Sunburst = ({ tone = 'green', size = 100 }) => {
    const petals = 10;
    const primary = tone === 'green' ? BRAND.green : BRAND.gold;
    const secondary = tone === 'green' ? BRAND.gold : BRAND.green;
    return (
        <svg viewBox="0 0 200 200" width={size} height={size} style={{ display: 'block' }}>
            {[...Array(petals)].map((_, i) => {
                const angle = (360 / petals) * i;
                return (
                    <ellipse
                        key={i}
                        cx="100" cy="52" rx="15" ry="48"
                        fill={i % 2 === 0 ? primary : secondary}
                        opacity={i % 2 === 0 ? 0.92 : 0.55}
                        transform={`rotate(${angle} 100 100)`}
                    />
                );
            })}
            <circle cx="100" cy="100" r="20" fill={BRAND.surface} stroke={primary} strokeWidth="2" />
        </svg>
    );
};

// ───── Split section — alternating text / brand-mark layout ─────
const SplitSection = ({ reverse, tone, isMobile, isCompact, eyebrowText, title, body, bullets, cta }) => {
    const textCol = (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ marginBottom: 14 }}>{label(eyebrowText, tone === 'gold' ? BRAND.gold : BRAND.green)}</div>
            <h2 style={{ fontSize: isMobile ? 26 : 34, fontWeight: 700, letterSpacing: '-1px', margin: '0 0 16px', color: BRAND.ink, maxWidth: 440 }}>{title}</h2>
            <p style={{ fontSize: 15, color: BRAND.slate, lineHeight: 1.7, margin: '0 0 26px', maxWidth: 460 }}>{body}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 30 }}>
                {bullets.map((b) => (
                    <div key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <Check size={16} strokeWidth={2} color={tone === 'gold' ? BRAND.gold : BRAND.green} style={{ marginTop: 2, flexShrink: 0 }} />
                        <span style={{ fontSize: 14.5, color: BRAND.ink }}>{b}</span>
                    </div>
                ))}
            </div>
            <button onClick={cta.onClick} style={btn.primary}>
                {cta.label} <ArrowRight size={15} />
            </button>
        </div>
    );

    const markBg = tone === 'gold' ? `${BRAND.gold}0d` : `${BRAND.green}0d`;

    const markCol = (
        <div style={{
            background: markBg,
            border: `1px solid ${BRAND.line}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: isMobile ? 220 : 380, padding: 40,
        }}>
            <Sunburst tone={tone} size={isMobile ? 140 : 180} />
        </div>
    );

    return (
        <section style={{ background: BRAND.surface, padding: isMobile ? '56px 0' : '0' }}>
            <div style={{
                ...page.section,
                display: 'grid',
                gridTemplateColumns: isCompact ? '1fr' : '1fr 1fr',
                gap: isCompact ? 32 : 0,
            }}>
                {reverse && !isCompact ? markCol : null}
                <div style={{ padding: isCompact ? 0 : (reverse ? '80px 0 80px 64px' : '80px 64px 80px 0') }}>{textCol}</div>
                {!reverse && !isCompact ? markCol : null}
                {isCompact ? markCol : null}
            </div>
        </section>
    );
};

// ───── Stats row ─────
const StatsRow = ({ stats, isMobile }) => {
    const items = [
        { icon: Briefcase, value: stats.total_jobs || 0, label: 'Active Jobs' },
        { icon: Globe, value: stats.total_companies || 0, label: 'Companies Hiring' },
        { icon: Users, value: stats.total_applications || 0, label: 'Applications' },
        { icon: TrendingUp, value: 94, label: 'Match Success %' },
    ];
    return (
        <div style={{ borderTop: `1px solid ${BRAND.line}` }}>
            <div style={{ ...page.section, display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)' }}>
                {items.map((it, i) => <Stat key={it.label} {...it} isMobile={isMobile} isLast={i === items.length - 1} />)}
            </div>
        </div>
    );
};

const Stat = ({ icon: Icon, value, label: text, isMobile, isLast }) => {
    const [n, ref] = useCountUp(value);
    return (
        <div ref={ref} style={{ padding: isMobile ? '20px 0' : '28px 28px 28px 0', borderRight: (!isMobile && !isLast) ? `1px solid ${BRAND.line}` : 'none' }}>
            <Icon size={18} color={BRAND.faint} strokeWidth={1.75} style={{ marginBottom: 10 }} />
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-1px', lineHeight: 1, color: BRAND.ink }}>{n.toLocaleString()}+</div>
            <div style={{ fontSize: 13, color: BRAND.muted, marginTop: 6 }}>{text}</div>
        </div>
    );
};

// ───── Job row ─────
const JobRow = ({ job, isLoggedIn, navigate, isMobile }) => {
    const left = (job.vacancies || 0) - (job.filled_positions || 0);
    const salary = job.salary_range && job.salary_range.trim() ? job.salary_range : null;
    const [hover, setHover] = useState(false);

    return (
        <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={() => navigate(`/jobs/${job.id}`)}
            style={{
                display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center',
                justifyContent: 'space-between', gap: isMobile ? 10 : 24,
                padding: isMobile ? '20px 0' : '26px 4px', borderBottom: `1px solid ${BRAND.line}`,
                cursor: 'pointer', background: hover ? BRAND.surfaceAlt : 'transparent', transition: 'background .15s ease',
            }}
        >
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                    <h3 style={{ fontSize: 17.5, fontWeight: 700, margin: 0, color: BRAND.ink }}>{job.title}</h3>
                    <span style={{ fontSize: 12, fontWeight: 600, color: BRAND.muted, textTransform: 'capitalize' }}>
                        · {job.job_type?.replace('_', ' ') || 'Full time'}
                    </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', fontSize: 13.5, color: BRAND.slate }}>
                    <span>{job.department_name}</span>
                    {salary && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><DollarSign size={13} strokeWidth={1.75} /> {salary}</span>}
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: left > 0 ? BRAND.green : BRAND.crimson }}>
                        <Clock size={13} strokeWidth={1.75} /> {left > 0 ? `${left} ${left === 1 ? 'opening' : 'openings'}` : 'Filled'}
                    </span>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'space-between' : 'flex-end' }}>
                <button
                    onClick={(e) => { e.stopPropagation(); navigate(isLoggedIn ? `/jobs/${job.id}` : '/register'); }}
                    disabled={isLoggedIn && left === 0}
                    style={{
                        ...btn.text,
                        color: (isLoggedIn && left === 0) ? BRAND.faint : BRAND.ink,
                        cursor: (isLoggedIn && left === 0) ? 'not-allowed' : 'pointer',
                    }}
                >
                    {isLoggedIn ? 'Apply' : <><Lock size={13} strokeWidth={1.75} /> Apply</>}
                    <ArrowUpRight size={15} strokeWidth={2} style={{ transform: hover ? 'translate(2px,-2px)' : 'none', transition: 'transform .15s ease' }} />
                </button>
            </div>
        </div>
    );
};

// ───── Testimonial carousel — story-style progress bars ─────
const TestimonialCarousel = ({ items, isMobile }) => {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const DURATION = 6500;
    const timerRef = useRef(null);

    useEffect(() => {
        if (paused) return;
        timerRef.current = setTimeout(() => setIndex((i) => (i + 1) % items.length), DURATION);
        return () => clearTimeout(timerRef.current);
    }, [index, paused, items.length]);

    const go = (i) => setIndex(((i % items.length) + items.length) % items.length);
    const current = items[index];

    return (
        <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            <div style={{ display: 'flex', gap: 6, maxWidth: 480, margin: isMobile ? '0 0 40px' : '0 auto 56px' }}>
                {items.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => go(i)}
                        aria-label={`Go to testimonial ${i + 1}`}
                        style={{ flex: 1, height: 2, background: BRAND.line, border: 'none', cursor: 'pointer', position: 'relative', overflow: 'hidden', padding: 0, borderRadius: 2 }}
                    >
                        <span
                            style={{
                                position: 'absolute', inset: 0, background: BRAND.green, transformOrigin: 'left',
                                transform: i < index ? 'scaleX(1)' : i === index ? 'scaleX(1)' : 'scaleX(0)',
                                transition: i === index ? (paused ? 'none' : `transform ${DURATION}ms linear`) : 'transform .25s ease',
                            }}
                        />
                    </button>
                ))}
            </div>

            <div key={index} className="brand-fade" style={{ textAlign: isMobile ? 'left' : 'center', maxWidth: 760, margin: '0 auto' }}>
                <p style={{ fontSize: isMobile ? 21 : 28, fontWeight: 500, lineHeight: 1.5, letterSpacing: '-0.3px', color: BRAND.ink, margin: '0 0 28px' }}>
                    "{current.quote}"
                </p>
                <div style={{ fontSize: 14.5 }}>
                    <span style={{ fontWeight: 700, color: BRAND.ink }}>{current.name}</span>
                    <span style={{ color: BRAND.muted }}> — {current.role}</span>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: isMobile ? 'flex-start' : 'center', gap: 10, marginTop: 40 }}>
                <button onClick={() => go(index - 1)} aria-label="Previous testimonial" style={{ width: 38, height: 38, borderRadius: '50%', border: `1px solid ${BRAND.line}`, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: BRAND.ink }}>
                    <ChevronLeft size={17} strokeWidth={1.75} />
                </button>
                <button onClick={() => go(index + 1)} aria-label="Next testimonial" style={{ width: 38, height: 38, borderRadius: '50%', border: `1px solid ${BRAND.line}`, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: BRAND.ink }}>
                    <ChevronRight size={17} strokeWidth={1.75} />
                </button>
            </div>
        </div>
    );
};

// ───── FAQ — minimal accordion, no cards ─────
const FAQList = ({ items }) => {
    const [open, setOpen] = useState(0);
    return (
        <div style={{ borderTop: `1px solid ${BRAND.line}` }}>
            {items.map((item, i) => {
                const isOpen = open === i;
                return (
                    <div key={item.q} style={{ borderBottom: `1px solid ${BRAND.line}` }}>
                        <button
                            onClick={() => setOpen(isOpen ? -1 : i)}
                            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, background: 'none', border: 'none', padding: '22px 0', cursor: 'pointer', textAlign: 'left', fontFamily: FONT }}
                        >
                            <span style={{ fontSize: 15.5, fontWeight: 700, color: BRAND.ink }}>{item.q}</span>
                            {isOpen ? <Minus size={17} color={BRAND.green} strokeWidth={2} /> : <Plus size={17} color={BRAND.muted} strokeWidth={2} />}
                        </button>
                        {isOpen && (
                            <p style={{ fontSize: 14.5, color: BRAND.slate, lineHeight: 1.7, margin: '0 0 24px', maxWidth: 560 }}>{item.a}</p>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

// ───── Content data ─────
const FEATURES = [
    { icon: TrendingUp, title: 'Smart job matching', desc: 'Roles surfaced by skills and fit, so you spend time applying not endlessly scrolling.' },
    { icon: ArrowRight, title: 'One-click apply', desc: 'Save your profile and resume once, then apply to any role in seconds.' },
    { icon: Clock, title: 'Live application tracking', desc: 'Watch every stage update in real time applied, test, interview, and offer.' },
    { icon: Lock, title: 'Verified employers', desc: 'Every department and company on the platform is verified before posting.' },
    { icon: Briefcase, title: 'Built-in assessments', desc: 'Showcase your skills with role-specific tests, right inside your application.' },
    { icon: Globe, title: 'Remote & onsite', desc: 'Filter by remote, hybrid, or onsite to find work that fits your life.' },
];

const STEPS = [
    { icon: Search, title: 'Discover', desc: 'Search and filter thousands of openings, or let smart matching bring roles to you.' },
    { icon: ArrowRight, title: 'Apply', desc: 'Build your profile once and apply in one click complete any assessments inline.' },
    { icon: Users, title: 'Get hired', desc: 'Track interviews and offers in real time, and step into your next chapter.' },
];

const TESTIMONIALS = [
    { name: 'Ayesha Khan', role: 'Frontend Engineer', quote: 'I applied on a Monday and had an offer by Friday. The tracking kept me sane the whole way through.' },
    { name: 'Daniyal Raza', role: 'Product Designer', quote: 'The cleanest job platform I have used. One profile, one click, and I could see exactly where I stood.' },
    { name: 'Sana Malik', role: 'Data Analyst', quote: 'The built-in skills test let me prove myself before the interview even started. Game changer.' },
];

const FAQS = [
    { q: 'Is it free to create an account?', a: 'Yes. Creating a profile, browsing roles, and applying are all free for job seekers no hidden fees at any stage.' },
    { q: 'How does application tracking work?', a: 'Every application moves through clear stages applied, under review, assessment, interview, offer and you get notified the moment your status changes.' },
    { q: 'Can employers see my profile before I apply?', a: 'No. Your profile is only shared with an employer once you submit an application to one of their roles.' },
    { q: 'How are employers verified?', a: 'Every department and company is reviewed before their first posting goes live, so listings on JobPortal are always genuine.' },
    { q: 'What if a role has an assessment?', a: 'Assessments are built directly into the application flow you complete them inline, with no separate account or tool required.' },
];

export default Landing;
