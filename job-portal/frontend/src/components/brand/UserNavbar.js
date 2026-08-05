import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, LayoutDashboard, Briefcase, FileText, User, LogOut, ChevronRight, ChevronDown, Bookmark } from 'lucide-react';
import { useResponsive } from '../../hooks/useResponsive';
import { jobSeekerAuthService } from '../../services/jobSeekerAuthService';
import NotificationBell from '../common/NotificationBell';

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

const NavStyleOverrides = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap');

        .rdi-navbar button, .rdi-navbar input {
            font-family: inherit;
            -webkit-tap-highlight-color: transparent;
        }
        .rdi-navbar button {
            background-color: transparent;
            background-image: none;
            border: none;
            outline: none;
            box-shadow: none;
            white-space: nowrap;
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
        .rdi-menu-item:hover {
            background-color: ${RDI_THEME.goldSoft} !important;
            color: ${RDI_THEME.green} !important;
        }
    `}</style>
);

const Logo = ({ onClick, compact }) => (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', flexShrink: 0 }}>
        <img
            src="/RDI.png"
            alt="RDI Logo"
            style={{ height: compact ? '38px' : '44px', width: 'auto', objectFit: 'contain', transition: 'height 0.3s ease' }}
        />
    </div>
);

const UserNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isCompact, isMobile } = useResponsive();

    const user = jobSeekerAuthService.getCurrentUser?.();
    const isLoggedIn = !!user;

    const [menuOpen, setMenuOpen] = useState(false);
    const [drawer, setDrawer] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [term, setTerm] = useState('');
    const menuRef = useRef(null);

    useEffect(() => {
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setScrolled(window.scrollY > 10);
                    ticking = false;
                });
                ticking = true;
            }
        };
        onScroll();
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const onClick = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
        const onKey = (e) => { if (e.key === 'Escape') { setMenuOpen(false); setDrawer(false); } };
        document.addEventListener('mousedown', onClick);
        document.addEventListener('keydown', onKey);
        return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey); };
    }, []);

    const go = (path) => { navigate(path); setDrawer(false); setMenuOpen(false); };
    const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
    const doSearch = () => { navigate(`/jobs?search=${encodeURIComponent(term)}`); setDrawer(false); };
    const logout = () => { jobSeekerAuthService.logout(); go('/'); };

    const links = isLoggedIn
        ? [
            { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
            { label: 'Find Jobs', path: '/jobs', icon: Briefcase },
            { label: 'My Applications', path: '/my-applications', icon: FileText },
            { label: 'Saved Jobs', path: '/saved-jobs', icon: Bookmark },
          ]
        : [
            { label: 'Find Jobs', path: '/jobs', icon: Briefcase },
            { label: 'How It Works', path: '/how-it-works', icon: FileText },
            { label: 'For Employers', path: '/for-employers', icon: User },
          ];

    const initial = (user?.first_name || user?.username || 'U')[0]?.toUpperCase();

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

    return (
        <nav className="rdi-navbar" style={navStyle}>
            <NavStyleOverrides />
            <div style={{ height: 3, width: '100%', background: `linear-gradient(90deg, ${RDI_THEME.gold} 0%, ${RDI_THEME.green} 55%, ${RDI_THEME.greenDark} 100%)` }} />
            
            <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 24px', height: scrolled ? 72 : 82, display: 'flex', alignItems: 'center', transition: 'height 0.3s ease' }}>
                <Logo onClick={() => go(isLoggedIn ? '/dashboard' : '/')} compact={scrolled} />

                {/* Desktop Links Navigation */}
                {!isCompact && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 32 }}>
                        {links.map((l) => {
                            const active = isActive(l.path);
                            return (
                                <button
                                    key={l.path}
                                    className={`rdi-navlink${active ? ' active' : ''}`}
                                    onClick={() => go(l.path)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                                        padding: '8px 12px', fontSize: 14.5, fontWeight: 600, letterSpacing: '0.1px',
                                        color: active ? RDI_THEME.green : RDI_THEME.ink, transition: 'color 0.2s ease'
                                    }}
                                >
                                    <span className="rdi-dot" style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: RDI_THEME.gold, transition: 'all 0.2s ease' }} />
                                    {l.label}
                                    <div className="rdi-underline" style={{ position: 'absolute', bottom: -2, left: 12, right: 12, height: 2, backgroundColor: RDI_THEME.green, borderRadius: 2, transformOrigin: 'center', transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Main Search Input (Desktop) */}
                {!isCompact && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: RDI_THEME.paper, border: `1px solid ${RDI_THEME.line}`, borderRadius: 999, padding: '8px 14px', width: 240, marginLeft: 'auto', marginRight: 16 }}>
                        <Search size={16} color={RDI_THEME.inkMuted} />
                        <input
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && doSearch()}
                            placeholder="Search jobs..."
                            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 13.5, color: RDI_THEME.ink, width: '100%' }}
                        />
                    </div>
                )}

                {/* Right Profile / CTA Interface Block */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: isCompact ? 'auto' : 0 }}>
                    {isLoggedIn ? (
                        <>
                            {!isMobile && (
                                <NotificationBell
                                    buttonStyle={{ position: 'relative', width: 40, height: 40, borderRadius: 8, border: `1px solid ${RDI_THEME.line}`, background: RDI_THEME.white, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                    iconColor={RDI_THEME.inkMuted}
                                    iconSize={19}
                                    theme="light"
                                />
                            )}

                            {/* Dropdown Frame setup */}
                            <div ref={menuRef} style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setMenuOpen((o) => !o)}
                                    aria-label="Account menu"
                                    className="rdi-ghost-btn"
                                    style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: `1px solid ${RDI_THEME.line}`, borderRadius: 999, padding: '4px 10px 4px 4px', cursor: 'pointer', transition: 'all 0.2s ease' }}
                                >
                                    <span style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', background: `linear-gradient(135deg, ${RDI_THEME.green} 0%, ${RDI_THEME.greenDark} 100%)`, color: RDI_THEME.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13.5, flexShrink: 0 }}>
                                        {user?.profile_picture ? <img src={user.profile_picture} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initial}
                                    </span>
                                    {!isCompact && <ChevronDown size={15} color={RDI_THEME.inkMuted} style={{ transform: menuOpen ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }} />}
                                </button>

                                {menuOpen && (
                                    <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 240, background: RDI_THEME.white, borderRadius: 12, border: `1px solid ${RDI_THEME.line}`, boxShadow: '0 12px 34px rgba(11, 93, 57, 0.08)', overflow: 'hidden', zIndex: 300 }}>
                                        <div style={{ padding: '14px 16px', borderBottom: `1px solid ${RDI_THEME.line}`, background: RDI_THEME.paper }}>
                                            <div style={{ fontSize: 14, fontWeight: 700, color: RDI_THEME.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.username}</div>
                                            <div style={{ fontSize: 12, color: RDI_THEME.inkMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1 }}>{user?.email || 'Job Seeker'}</div>
                                        </div>
                                        {[
                                            { label: 'My Profile', icon: User, path: '/profile' },
                                            { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
                                            { label: 'My Applications', icon: FileText, path: '/my-applications' },
                                            { label: 'Saved Jobs', icon: Bookmark, path: '/saved-jobs' },
                                        ].map((m) => (
                                            <button key={m.path} onClick={() => go(m.path)} className="rdi-menu-item" style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '11px 16px', cursor: 'pointer', fontSize: 13.5, fontWeight: 600, color: RDI_THEME.ink, textAlign: 'left', transition: 'all 0.15s ease' }}>
                                                <m.icon size={16} color={RDI_THEME.inkMuted} /> {m.label}
                                            </button>
                                        ))}
                                        <div style={{ height: 1, background: RDI_THEME.line }} />
                                        <button onClick={logout} className="rdi-menu-item" style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '11px 16px', cursor: 'pointer', fontSize: 13.5, fontWeight: 700, color: '#DC2626', textAlign: 'left', transition: 'all 0.15s ease' }}>
                                            <LogOut size={16} /> Log Out
                                        </button>
                                    </div>
                                )}
                            </div>

                            {isCompact && (
                                <button aria-label="Open menu" onClick={() => setDrawer(true)} style={{ width: 40, height: 40, borderRadius: 8, border: `1px solid ${RDI_THEME.line}`, background: RDI_THEME.white, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: RDI_THEME.green }}>
                                    <Menu size={21} />
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            {!isCompact ? (
                                <>
                                    <button onClick={() => go('/login')} className="rdi-signin-btn" style={{ border: `1.5px solid ${RDI_THEME.green}`, cursor: 'pointer', padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 700, color: RDI_THEME.green, transition: 'all 0.2s ease' }}>Login</button>
                                    <button onClick={() => go('/register')} className="rdi-cta-btn" style={{ background: RDI_THEME.green, cursor: 'pointer', padding: '9px 18px', borderRadius: 8, fontSize: 14, fontWeight: 700, color: RDI_THEME.white, transition: 'all 0.2s ease' }}>Sign Up</button>
                                </>
                            ) : (
                                <button aria-label="Open menu" onClick={() => setDrawer(true)} style={{ width: 40, height: 40, borderRadius: 8, border: `1px solid ${RDI_THEME.line}`, background: RDI_THEME.white, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: RDI_THEME.green }}>
                                    <Menu size={21} />
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Sidebar System Container */}
            {isCompact && drawer && (
                <>
                    <div onClick={() => setDrawer(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(11, 36, 23, 0.35)', zIndex: 300 }} />
                    <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(86vw, 330px)', background: RDI_THEME.paper, zIndex: 310, padding: 20, display: 'flex', flexDirection: 'column', gap: 6, boxShadow: '-10px 0 30px rgba(11, 93, 57, 0.08)', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                            <Logo onClick={() => go(isLoggedIn ? '/dashboard' : '/')} />
                            <button aria-label="Close menu" onClick={() => setDrawer(false)} style={{ width: 38, height: 38, borderRadius: 8, border: `1px solid ${RDI_THEME.line}`, background: RDI_THEME.white, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: RDI_THEME.ink }}>
                                <X size={18} />
                            </button>
                        </div>

                        {/* Search inside drawer context */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: RDI_THEME.white, border: `1px solid ${RDI_THEME.line}`, borderRadius: 10, padding: '10px 14px', marginBottom: 12 }}>
                            <Search size={16} color={RDI_THEME.inkMuted} />
                            <input value={term} onChange={(e) => setTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && doSearch()} placeholder="Search jobs..." style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 14, color: RDI_THEME.ink, width: '100%' }} />
                        </div>

                        {links.map((l) => (
                            <button key={l.path} onClick={() => go(l.path)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left', background: isActive(l.path) ? RDI_THEME.goldSoft : 'none', cursor: 'pointer', padding: '12px 14px', borderRadius: 8, fontSize: 15, fontWeight: 600, color: isActive(l.path) ? RDI_THEME.green : RDI_THEME.ink }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <l.icon size={17} color={isActive(l.path) ? RDI_THEME.green : RDI_THEME.inkMuted} />
                                    {l.label}
                                </div>
                                {isActive(l.path) && <ChevronRight size={16} color={RDI_THEME.gold} />}
                            </button>
                        ))}

                        <div style={{ height: 1, background: RDI_THEME.line, margin: '12px 0' }} />

                        {isLoggedIn ? (
                            <>
                                <button onClick={() => go('/profile')} style={{ display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left', background: 'none', cursor: 'pointer', padding: '12px 14px', borderRadius: 8, fontSize: 15, fontWeight: 600, color: RDI_THEME.ink }}><User size={17} color={RDI_THEME.inkMuted} /> My Profile</button>
                                <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left', background: '#FFF5F5', border: '1px solid #FED7D7', cursor: 'pointer', padding: '12px 14px', borderRadius: 8, fontSize: 15, fontWeight: 600, color: '#E53E3E', marginTop: 8 }}><LogOut size={17} /> Log Out</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => go('/register')} style={{ background: RDI_THEME.green, color: RDI_THEME.white, padding: '12px', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer', textAlign: 'center' }}>Sign Up</button>
                                <button onClick={() => go('/login')} style={{ background: RDI_THEME.white, color: RDI_THEME.green, border: `1.5px solid ${RDI_THEME.green}`, padding: '11px', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer', textAlign: 'center', marginTop: 6 }}>Login</button>
                            </>
                        )}
                    </div>
                </>
            )}
        </nav>
    );
};

export default UserNavbar;