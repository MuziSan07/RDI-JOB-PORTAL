import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send } from 'lucide-react';
import { useResponsive } from '../../hooks/useResponsive';
import { jobAlertService } from '../../services/jobAlertService';

const RDI_THEME = {
    green: '#0B5D39',
    greenDark: '#083F27',
    greenNight: '#062A1B',
    gold: '#C9972C',
    goldSoft: 'rgba(201, 151, 44, 0.14)',
    paper: '#FAF8F3',
    muted: '#9BB0A4',
    line: 'rgba(255, 255, 255, 0.10)',
    white: '#FFFFFF'
};

const FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

// Authentic brand glyphs as inline SVG.
const S = ({ d, size = 17 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d={d} />
    </svg>
);

const SOCIAL = [
    { label: 'Facebook', href: 'https://www.facebook.com/rdiworld', d: 'M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.08 24 18.09 24 12.07z' },
    { label: 'Instagram', href: 'https://www.instagram.com/rdi_world/', d: 'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 3.68a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/rdiworld/posts/?feedView=all', d: 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z' },
    { label: 'YouTube', href: 'https://www.youtube.com/@rdi_world', d: 'M23.5 6.2a2.99 2.99 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A2.99 2.99 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 2.99 2.99 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a2.99 2.99 0 0 0 2.1-2.1A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8zM9.6 15.6V8.4L15.8 12l-6.2 3.6z' },
];

const COLUMNS = [
    {
        title: 'Company',
        links: [
            { label: 'About Us', path: '/about' },
            { label: 'How It Works', path: '/how-it-works' },
            { label: 'For Employers', path: '/for-employers' },
            { label: 'Contact', path: '/contact' },
        ],
    },
    {
        title: 'Job Seekers',
        links: [
            { label: 'Browse Jobs', path: '/jobs' },
            { label: 'Create Account', path: '/register' },
            { label: 'Sign In', path: '/login' },
            { label: 'My Applications', path: '/my-applications' },
            { label: 'Saved Jobs', path: '/saved-jobs' },
        ],
    },
    {
        title: 'Legal',
        links: [
            { label: 'Privacy Policy', path: '/privacy-policy' },
            { label: 'Terms & Conditions', path: '/terms' },
            { label: 'Cookie Policy', path: '/cookie-policy' },
            { label: 'Contact Sales', path: '/contact' },
        ],
    },
];

const BrandFooter = () => {
    const navigate = useNavigate();
    const { isMobile, isCompact } = useResponsive();
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);

    const submit = async (e) => {
        e?.preventDefault?.();
        const value = email.trim();
        if (!value) return;
        // Optimistic UI — subscribe via the real endpoint; ignore failures so the
        // footer never blocks (the API is idempotent by email).
        setSent(true);
        setEmail('');
        try {
            await jobAlertService.subscribe({ email: value });
        } catch (_) {
            /* no-op: keep the friendly confirmation */
        }
        setTimeout(() => setSent(false), 3500);
    };

    return (
        <footer style={{ background: RDI_THEME.greenNight, color: RDI_THEME.white, fontFamily: FONT }}>
            <style>{`
                .rdi-fnav:hover { color: ${RDI_THEME.gold} !important; }
                .rdi-social { transition: all 0.2s ease; }
                .rdi-social:hover { background: ${RDI_THEME.goldSoft} !important; border-color: ${RDI_THEME.gold} !important; color: ${RDI_THEME.gold} !important; transform: translateY(-2px); }
                .rdi-social:focus-visible { outline: 2px solid ${RDI_THEME.gold}; outline-offset: 2px; }
            `}</style>

            {/* Main footer */}
            <div style={{ maxWidth: 1180, margin: '0 auto', padding: isMobile ? '48px 16px 0' : '64px 24px 0', display: 'grid', gridTemplateColumns: isCompact ? '1fr' : '1.4fr 1fr 1fr 1fr', gap: isCompact ? 36 : 32 }}>
                {/* Brand + newsletter */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                        <img src="/RDI.png" alt="RDI Logo" style={{ height: 36, width: 'auto', objectFit: 'contain' }} />
                        <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.4px' }}>
                            RDI <span style={{ color: RDI_THEME.gold, fontStyle: 'italic' }}>JobPortal</span>
                        </span>
                    </div>
                    <p style={{ fontSize: 14.5, color: RDI_THEME.muted, lineHeight: 1.7, maxWidth: 320, margin: '0 0 20px' }}>
                        The hiring platform connecting ambitious talent with employers building brighter futures part of Rupani Development Initiatives.
                    </p>

                    <p style={{ fontSize: 13, fontWeight: 700, color: '#cfe0d5', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Get job alerts</p>
                    <form onSubmit={submit} style={{ display: 'flex', gap: 8, maxWidth: 360, flexDirection: isMobile ? 'column' : 'row' }}>
                        <input
                            type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com"
                            style={{ flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.16)', borderRadius: 11, padding: '12px 16px', color: '#fff', fontSize: 14, fontFamily: FONT, outline: 'none' }}
                        />
                        <button type="submit" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: sent ? RDI_THEME.green : RDI_THEME.gold, color: sent ? '#fff' : RDI_THEME.greenNight, border: 'none', borderRadius: 11, padding: '12px 18px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: FONT, whiteSpace: 'nowrap' }}>
                            {sent ? 'Subscribed' : <>Subscribe <Send size={15} /></>}
                        </button>
                    </form>
                </div>

                {/* Link columns */}
                {COLUMNS.map((col) => (
                    <div key={col.title}>
                        <h4 style={{ fontSize: 13, fontWeight: 700, color: RDI_THEME.gold, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{col.title}</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                            {col.links.map((l) => (
                                <button key={l.label} onClick={() => navigate(l.path)} className="rdi-fnav" style={{ background: 'none', border: 'none', color: RDI_THEME.muted, fontSize: 14.5, cursor: 'pointer', textAlign: 'left', padding: 0, fontFamily: FONT, transition: 'color .15s ease' }}>
                                    {l.label}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom bar */}
            <div style={{ borderTop: `1px solid ${RDI_THEME.line}`, marginTop: 48 }}>
                <div style={{ maxWidth: 1180, margin: '0 auto', padding: isMobile ? '22px 16px' : '24px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                    <p style={{ fontSize: 13.5, color: RDI_THEME.muted, margin: 0, order: isMobile ? 2 : 1 }}>© {new Date().getFullYear()} RDI JobPortal. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: 10, order: isMobile ? 1 : 2 }}>
                        {SOCIAL.map((s) => (
                            <a
                                key={s.label}
                                href={s.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={s.label}
                                className="rdi-social"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 38,
                                    height: 38,
                                    borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.06)',
                                    border: `1px solid ${RDI_THEME.line}`,
                                    color: RDI_THEME.muted,
                                    textDecoration: 'none',
                                }}
                            >
                                <S d={s.d} size={16} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default BrandFooter;