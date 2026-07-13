import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cookie, Check } from 'lucide-react';

// Brand tokens (kept local so this component has no hard dependency on the
// branding theme module — matches the RDI green + gold palette).
const THEME = {
    green: '#0B5D39',
    greenDark: '#083F27',
    gold: '#C9972C',
    ink: '#16241C',
    slate: '#475569',
    line: '#E6EBF1',
    white: '#FFFFFF',
};

const FONT = "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
const STORAGE_KEY = 'cookie_consent';

const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CookieConsent = () => {
    const navigate = useNavigate();
    // undefined = not yet determined; false = hidden; true = show banner
    const [visible, setVisible] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined' ? window.innerWidth <= 640 : false
    );
    const reduceMotion = prefersReducedMotion();

    useEffect(() => {
        let stored = null;
        try {
            stored = window.localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            stored = null;
        }
        if (!stored) {
            setVisible(true);
            // Trigger the slide-in transition on the next frame.
            const id = requestAnimationFrame(() => setMounted(true));
            return () => cancelAnimationFrame(id);
        }
    }, []);

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth <= 640);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const decide = (choice) => {
        try {
            window.localStorage.setItem(STORAGE_KEY, choice);
        } catch (e) {
            /* storage unavailable — fail silently */
        }
        if (reduceMotion) {
            setVisible(false);
        } else {
            setMounted(false);
            window.setTimeout(() => setVisible(false), 260);
        }
    };

    if (!visible) return null;

    const transition = reduceMotion ? 'none' : 'transform .3s cubic-bezier(.2,.7,.2,1), opacity .3s ease';
    const hiddenTransform = reduceMotion ? 'none' : 'translateY(24px)';

    const wrap = {
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 400,
        display: 'flex',
        justifyContent: 'center',
        padding: isMobile ? '12px' : '18px',
        pointerEvents: 'none',
        fontFamily: FONT,
    };

    const card = {
        pointerEvents: 'auto',
        width: '100%',
        maxWidth: 720,
        display: 'flex',
        alignItems: isMobile ? 'stretch' : 'center',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 14 : 20,
        background: THEME.white,
        border: `1px solid ${THEME.line}`,
        borderLeft: `4px solid ${THEME.green}`,
        borderRadius: 16,
        padding: isMobile ? '18px' : '18px 22px',
        boxShadow: '0 18px 50px rgba(11, 93, 57, 0.18)',
        transform: mounted ? 'translateY(0)' : hiddenTransform,
        opacity: mounted ? 1 : 0,
        transition,
        boxSizing: 'border-box',
    };

    const linkStyle = {
        color: THEME.green,
        fontWeight: 700,
        textDecoration: 'underline',
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        padding: 0,
        font: 'inherit',
    };

    const acceptBtn = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
        background: THEME.green,
        color: THEME.white,
        border: 'none',
        borderRadius: 10,
        padding: '11px 20px',
        fontSize: 14.5,
        fontWeight: 700,
        cursor: 'pointer',
        fontFamily: FONT,
        flex: isMobile ? 1 : 'initial',
        transition: reduceMotion ? 'none' : 'background .15s ease, transform .15s ease',
    };

    const declineBtn = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
        background: THEME.white,
        color: THEME.slate,
        border: `1.5px solid ${THEME.line}`,
        borderRadius: 10,
        padding: '11px 18px',
        fontSize: 14.5,
        fontWeight: 700,
        cursor: 'pointer',
        fontFamily: FONT,
        flex: isMobile ? 1 : 'initial',
        transition: reduceMotion ? 'none' : 'border-color .15s ease, color .15s ease',
    };

    return (
        <div style={wrap} role="dialog" aria-live="polite" aria-label="Cookie consent">
            <div style={card}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1 }}>
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                        background: `${THEME.gold}1F`, color: THEME.green,
                    }}>
                        <Cookie size={20} />
                    </span>
                    <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: THEME.slate }}>
                        We use cookies to keep you signed in and improve your experience.{' '}
                        <button
                            type="button"
                            style={linkStyle}
                            onClick={() => navigate('/cookie-policy')}
                        >
                            Learn more
                        </button>
                        .
                    </p>
                </div>

                <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                    <button
                        type="button"
                        style={declineBtn}
                        onClick={() => decide('declined')}
                        onMouseEnter={(e) => { if (!reduceMotion) { e.currentTarget.style.borderColor = THEME.green; e.currentTarget.style.color = THEME.green; } }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = THEME.line; e.currentTarget.style.color = THEME.slate; }}
                    >
                        Decline
                    </button>
                    <button
                        type="button"
                        style={acceptBtn}
                        onClick={() => decide('accepted')}
                        onMouseEnter={(e) => { if (!reduceMotion) e.currentTarget.style.background = THEME.greenDark; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = THEME.green; }}
                    >
                        <Check size={15} /> Accept
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
