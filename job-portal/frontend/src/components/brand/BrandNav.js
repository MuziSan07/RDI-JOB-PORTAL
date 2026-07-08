import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, LogOut, ChevronRight, Briefcase } from 'lucide-react';
import { useResponsive } from '../../hooks/useResponsive';
import { jobSeekerAuthService } from '../../services/jobSeekerAuthService';

const RDI_THEME = {
    green: '#0B5D39',
    greenDark: '#083F27',
    gold: '#C9972C',
    goldSoft: 'rgba(201, 151, 44, 0.12)',
    ink: '#16241C',
    inkMuted: '#5C6B62',
    paper: '#FAF8F3',
    line: 'rgba(11, 93, 57, 0.12)',
    white: '#FFFFFF'
};

const LINKS = [
    { label: 'Home', path: '/' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'For Employers', path: '/for-employers' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
];

const NavStyleOverrides = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap');

        .rdi-navbar button {
            background-color: transparent !important;
            background-image: none !important;
            border: none;
            outline: none;
            box-shadow: none !important;
            font-family: inherit;
            -webkit-tap-highlight-color: transparent;
            white-space: nowrap !important;
        }
        .rdi-navlink {
            position: relative;
            appearance: none;
            -webkit-appearance: none;
        }
        .rdi-navlink:hover,
        .rdi-navlink:focus-visible,
        .rdi-navlink:active {
            background-color: transparent !important;
            box-shadow: none !important;
        }
        .rdi-navlink:focus-visible {
            outline: 2px solid ${RDI_THEME.gold};
            outline-offset: 2px;
            border-radius: 6px;
        }
        .rdi-navlink .rdi-underline { transform: scaleX(0); }
        .rdi-navlink:hover .rdi-underline,
        .rdi-navlink.active .rdi-underline { transform: scaleX(1); }
        .rdi-navlink:hover, .rdi-navlink.active { color: ${RDI_THEME.green} !important; }

        .rdi-navlink .rdi-dot { opacity: 0; transform: scale(0.4); }
        .rdi-navlink.active .rdi-dot { opacity: 1; transform: scale(1); }

        .rdi-ghost-btn:hover {
            background-color: ${RDI_THEME.goldSoft} !important;
            color: ${RDI_THEME.green} !important;
        }
        .rdi-signin-btn:hover {
            background-color: transparent !important;
            color: ${RDI_THEME.green} !important;
        }
        .rdi-cta-btn:hover {
            background-color: ${RDI_THEME.green} !important;
            color: ${RDI_THEME.white} !important;
        }
        .rdi-logout-btn:hover { background-color: #FEE2E2 !important; }
    `}</style>
);

const Logo = ({ onClick, compact }) => (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', flexShrink: 0 }}>
        <img
            src="/RDI.png"
            alt="RDI Logo"
            style={{ height: compact ? '38px' : '44px', width: 'auto', objectFit: 'contain', transition: 'height 0.3s ease' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: '-0.2px',
                color: RDI_THEME.greenDark,
                lineHeight: 1.15,
            }}>
                RDI <span style={{ color: RDI_THEME.gold, fontStyle: 'italic', fontWeight: 600 }}>JobPortal</span>
            </span>
            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '1.4px', color: RDI_THEME.inkMuted, textTransform: 'uppercase', marginTop: 2 }}>
                Transforming Lives
            </span>
        </div>
    </div>
);

const BrandNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isCompact } = useResponsive();
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const user = jobSeekerAuthService.getCurrentUser?.();
    const isLoggedIn = !!user;

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        onScroll();
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const go = (path) => { navigate(path); setOpen(false); };
    const isActive = (path) => location.pathname === path;

    const navStyle = {
        position: 'sticky',
        top: 0,
        zIndex: 200,
        background: isCompact
            ? RDI_THEME.white
            : scrolled ? 'rgba(255, 255, 255, 0.78)' : 'rgba(255, 255, 255, 0.5)',
        backdropFilter: isCompact ? 'none' : 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: isCompact ? 'none' : 'saturate(180%) blur(20px)',
        boxShadow: isCompact
            ? '0 1px 0 rgba(11, 93, 57, 0.06)'
            : (scrolled ? '0 8px 30px rgba(11, 93, 57, 0.05)' : 'none'),
        borderBottom: `1px solid ${isCompact ? RDI_THEME.line : (scrolled ? RDI_THEME.line : 'rgba(255,255,255,0.15)')}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    const topRibbon = {
        height: 3,
        width: '100%',
        background: `linear-gradient(90deg, ${RDI_THEME.gold} 0%, ${RDI_THEME.green} 55%, ${RDI_THEME.greenDark} 100%)`,
    };

    const inner = {
        maxWidth: 1240,
        margin: '0 auto',
        padding: '0 24px',
        height: scrolled ? 72 : 82,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'height 0.3s ease'
    };

    return (
        <nav className="rdi-navbar" style={navStyle}>
            <NavStyleOverrides />
            <div style={topRibbon} />
            <div style={inner}>
                <Logo onClick={() => go('/')} compact={scrolled} />

                {!isCompact && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1, marginLeft: 40 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                            {LINKS.map((l) => {
                                const active = isActive(l.path);
                                return (
                                    <button
                                        key={l.path}
                                        className={`rdi-navlink${active ? ' active' : ''}`}
                                        onClick={() => go(l.path)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 6,
                                            cursor: 'pointer',
                                            padding: '8px 12px',
                                            fontSize: 14.5,
                                            fontWeight: 600,
                                            letterSpacing: '0.1px',
                                            color: active ? RDI_THEME.green : RDI_THEME.ink,
                                            transition: 'color 0.2s ease',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        <span className="rdi-dot" style={{
                                            width: 5, height: 5, borderRadius: '50%',
                                            backgroundColor: RDI_THEME.gold,
                                            transition: 'all 0.2s ease',
                                        }} />
                                        {l.label}
                                        <div
                                            className="rdi-underline"
                                            style={{
                                                position: 'absolute',
                                                bottom: -2,
                                                left: 12,
                                                right: 12,
                                                height: 2,
                                                backgroundColor: RDI_THEME.green,
                                                borderRadius: 2,
                                                transformOrigin: 'center',
                                                transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                            }}
                                        />
                                    </button>
                                );
                            })}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                            <button
                                className="rdi-ghost-btn"
                                onClick={() => go('/jobs')}
                                style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 14.5, fontWeight: 600, color: RDI_THEME.ink, padding: '9px 14px', borderRadius: 8, transition: 'all 0.2s ease', whiteSpace: 'nowrap' }}
                            >
                                <Briefcase size={15} /> Browse Jobs
                            </button>

                            <div style={{ width: 1, height: 22, background: RDI_THEME.line, margin: '0 4px' }} />

                            {isLoggedIn ? (
                                <>
                                    <button
                                        className="rdi-ghost-btn"
                                        onClick={() => go('/dashboard')}
                                        style={{ cursor: 'pointer', fontSize: 14.5, fontWeight: 600, color: RDI_THEME.ink, padding: '9px 14px', borderRadius: 8, transition: 'all 0.2s ease', whiteSpace: 'nowrap' }}
                                    >
                                        Dashboard
                                    </button>
                                    <button
                                        className="rdi-logout-btn"
                                        onClick={() => { jobSeekerAuthService.logout(); navigate('/'); }}
                                        style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FEF2F2', color: '#DC2626', border: '1px solid #FEE2E2', padding: '9px 16px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s ease', whiteSpace: 'nowrap' }}
                                    >
                                        <LogOut size={15} /> Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        className="rdi-signin-btn"
                                        onClick={() => go('/login')}
                                        style={{ border: `1.5px solid ${RDI_THEME.green}`, cursor: 'pointer', padding: '9px 20px', borderRadius: 8, fontSize: 14, fontWeight: 700, color: RDI_THEME.green, transition: 'all 0.2s ease', whiteSpace: 'nowrap' }}
                                    >
                                        Login
                                    </button>
                                    <button
                                        className="rdi-cta-btn"
                                        onClick={() => go('/register')}
                                        style={{ display: 'flex', alignItems: 'center', gap: 6, background: `${RDI_THEME.green} !important`, cursor: 'pointer', padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 700, color: `${RDI_THEME.white} !important`, transition: 'all 0.2s ease', whiteSpace: 'nowrap' }}
                                    >
                                        Sign Up 
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {isCompact && (
                    <button
                        aria-label="Open menu"
                        onClick={() => setOpen(true)}
                        style={{ width: 42, height: 42, borderRadius: 8, border: `1px solid ${RDI_THEME.line}`, background: RDI_THEME.white, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: RDI_THEME.green }}
                    >
                        <Menu size={22} />
                    </button>
                )}
            </div>

            {isCompact && open && (
                <>
                    <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(11, 36, 23, 0.35)', zIndex: 300 }} />
                    <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(86vw, 340px)', background: RDI_THEME.paper, zIndex: 310, padding: 24, display: 'flex', flexDirection: 'column', gap: 6, boxShadow: '-10px 0 30px rgba(11, 93, 57, 0.08)' }}>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
                            <Logo onClick={() => go('/')} />
                            <button
                                aria-label="Close menu"
                                onClick={() => setOpen(false)}
                                style={{ width: 38, height: 38, borderRadius: 8, border: `1px solid ${RDI_THEME.line}`, background: RDI_THEME.white, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: RDI_THEME.ink }}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {[...LINKS, { label: 'Browse Jobs', path: '/jobs' }].map((l) => (
                            <button
                                key={l.path}
                                onClick={() => go(l.path)}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left', background: isActive(l.path) ? RDI_THEME.goldSoft : 'none', cursor: 'pointer', padding: '14px 16px', borderRadius: 8, fontSize: 15, fontWeight: 600, color: isActive(l.path) ? RDI_THEME.green : RDI_THEME.ink }}
                            >
                                {l.label}
                                {isActive(l.path) && <ChevronRight size={16} color={RDI_THEME.gold} />}
                            </button>
                        ))}

                        <div style={{ height: 1, background: RDI_THEME.line, margin: '16px 0' }} />

                        {isLoggedIn ? (
                            <>
                                <button onClick={() => go('/dashboard')} style={{ background: RDI_THEME.green, color: RDI_THEME.white, padding: '14px', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>Go to Dashboard</button>
                                <button onClick={() => { jobSeekerAuthService.logout(); go('/'); }} style={{ background: '#FFF5F5', color: '#E53E3E', border: '1px solid #FED7D7', padding: '12px', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 4 }}>Logout</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => go('/register')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: RDI_THEME.green, color: RDI_THEME.white, padding: '14px', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>Sign Up <ArrowRight size={16} /></button>
                                <button onClick={() => go('/login')} style={{ background: RDI_THEME.white, color: RDI_THEME.green, border: `1.5px solid ${RDI_THEME.green}`, padding: '12px', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 4 }}>Login</button>
                            </>
                        )}
                    </div>
                </>
            )}
        </nav>
    );
};

export default BrandNav;
