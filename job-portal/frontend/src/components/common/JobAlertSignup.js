import React, { useState } from 'react';
import { Bell, Mail, Send, Check, ArrowRight } from 'lucide-react';
import { BRAND, FONT } from '../brand/brandTheme';
import useResponsive from '../../hooks/useResponsive';
import { jobAlertService } from '../../services/jobAlertService';

const JOB_TYPES = [
    { value: '', label: 'Any job type' },
    { value: 'onsite', label: 'On site' },
    { value: 'remote', label: 'Remote' },
    { value: 'hybrid', label: 'Hybrid' },
];

// Basic client-side email sanity check (server re-validates).
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || '').trim());

/**
 * Standalone "Get job alerts" card. Drop it anywhere (footer, jobs page, etc.).
 * Self-contained: talks to jobAlertService, manages its own state and styling.
 */
export default function JobAlertSignup() {
    const { isMobile } = useResponsive();

    const [email, setEmail] = useState('');
    const [keywords, setKeywords] = useState('');
    const [jobType, setJobType] = useState('');
    const [status, setStatus] = useState('idle'); // idle | loading | success | error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (status === 'loading') return;

        if (!isValidEmail(email)) {
            setStatus('error');
            setMessage('Please enter a valid email address.');
            return;
        }

        setStatus('loading');
        setMessage('');
        try {
            const data = await jobAlertService.subscribe({
                email: email.trim(),
                keywords: keywords.trim(),
                job_type: jobType,
            });
            setStatus('success');
            setMessage(
                (data && data.message) ||
                "You're subscribed! We'll email you when matching jobs are posted."
            );
        } catch (err) {
            setStatus('error');
            const apiMsg =
                err?.response?.data?.error ||
                err?.response?.data?.email ||
                err?.response?.data?.message;
            setMessage(apiMsg || 'Something went wrong. Please try again.');
        }
    };

    // ── styles ────────────────────────────────────────────────────────────────
    const card = {
        fontFamily: FONT,
        color: BRAND.ink,
        background: BRAND.surfaceAlt,
        border: `1px solid ${BRAND.line}`,
        borderRadius: 18,
        padding: isMobile ? '24px 20px' : '32px 34px',
        maxWidth: 640,
        width: '100%',
        boxSizing: 'border-box',
        boxShadow: '0 8px 24px rgba(18,32,26,0.06)',
    };

    const iconBadge = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 44,
        height: 44,
        borderRadius: 12,
        background: `${BRAND.green}14`,
        color: BRAND.green,
        flexShrink: 0,
    };

    const heading = {
        margin: 0,
        fontSize: isMobile ? 20 : 24,
        fontWeight: 800,
        lineHeight: 1.2,
        color: BRAND.ink,
    };

    const blurb = {
        margin: '6px 0 0',
        fontSize: 14.5,
        lineHeight: 1.55,
        color: BRAND.muted,
    };

    const label = {
        display: 'block',
        fontSize: 12.5,
        fontWeight: 700,
        letterSpacing: '0.02em',
        color: BRAND.muted,
        marginBottom: 6,
    };

    const inputBase = {
        width: '100%',
        boxSizing: 'border-box',
        fontFamily: FONT,
        fontSize: 14.5,
        color: BRAND.ink,
        background: BRAND.surface,
        border: `1.5px solid ${BRAND.line}`,
        borderRadius: 10,
        padding: '12px 14px',
        outline: 'none',
        transition: 'border-color .15s ease',
    };

    const button = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,
        width: '100%',
        background: status === 'loading' ? BRAND.greenDark : BRAND.green,
        color: '#fff',
        border: 'none',
        padding: '13px 22px',
        borderRadius: 10,
        fontSize: 15,
        fontWeight: 700,
        fontFamily: FONT,
        cursor: status === 'loading' ? 'default' : 'pointer',
        opacity: status === 'loading' ? 0.85 : 1,
        transition: 'background .15s ease, transform .15s ease',
    };

    // Success state — replace the form with a confirmation.
    if (status === 'success') {
        return (
            <div style={card}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ ...iconBadge, background: `${BRAND.green}1f` }}>
                        <Check size={22} />
                    </span>
                    <div>
                        <h3 style={heading}>You're all set!</h3>
                        <p style={blurb}>{message}</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => {
                        setStatus('idle');
                        setMessage('');
                        setEmail('');
                        setKeywords('');
                        setJobType('');
                    }}
                    style={{
                        ...button,
                        marginTop: 20,
                        background: 'transparent',
                        color: BRAND.green,
                        border: `1.5px solid ${BRAND.green}`,
                    }}
                >
                    Subscribe another email <ArrowRight size={17} />
                </button>
            </div>
        );
    }

    return (
        <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <span style={iconBadge}>
                    <Bell size={22} />
                </span>
                <div>
                    <h3 style={heading}>Get job alerts by email</h3>
                    <p style={blurb}>
                        Be the first to know. We'll email you when new jobs matching your
                        interests are posted.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} noValidate>
                <div style={{ marginBottom: 14 }}>
                    <label style={label} htmlFor="jobalert-email">Email address</label>
                    <div style={{ position: 'relative' }}>
                        <Mail
                            size={17}
                            style={{
                                position: 'absolute',
                                left: 13,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: BRAND.faint,
                                pointerEvents: 'none',
                            }}
                        />
                        <input
                            id="jobalert-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            style={{ ...inputBase, paddingLeft: 40 }}
                            onFocus={(e) => (e.target.style.borderColor = BRAND.green)}
                            onBlur={(e) => (e.target.style.borderColor = BRAND.line)}
                        />
                    </div>
                </div>

                <div
                    style={{
                        display: isMobile ? 'block' : 'flex',
                        gap: 14,
                        marginBottom: 18,
                    }}
                >
                    <div style={{ flex: 1, marginBottom: isMobile ? 14 : 0 }}>
                        <label style={label} htmlFor="jobalert-keywords">
                            Keywords <span style={{ fontWeight: 500 }}>(optional)</span>
                        </label>
                        <input
                            id="jobalert-keywords"
                            type="text"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            placeholder="e.g. react, python, design"
                            style={inputBase}
                            onFocus={(e) => (e.target.style.borderColor = BRAND.green)}
                            onBlur={(e) => (e.target.style.borderColor = BRAND.line)}
                        />
                    </div>
                    <div style={{ flex: '0 0 auto', minWidth: isMobile ? 'auto' : 170 }}>
                        <label style={label} htmlFor="jobalert-type">Job type</label>
                        <select
                            id="jobalert-type"
                            value={jobType}
                            onChange={(e) => setJobType(e.target.value)}
                            style={{ ...inputBase, cursor: 'pointer', appearance: 'auto' }}
                            onFocus={(e) => (e.target.style.borderColor = BRAND.green)}
                            onBlur={(e) => (e.target.style.borderColor = BRAND.line)}
                        >
                            {JOB_TYPES.map((t) => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {status === 'error' && message && (
                    <div
                        style={{
                            marginBottom: 14,
                            fontSize: 13.5,
                            color: BRAND.crimson,
                            fontWeight: 600,
                        }}
                        role="alert"
                    >
                        {message}
                    </div>
                )}

                <button
                    type="submit"
                    style={button}
                    disabled={status === 'loading'}
                >
                    {status === 'loading' ? 'Subscribing…' : (
                        <>Notify me <Send size={17} /></>
                    )}
                </button>

                <p
                    style={{
                        margin: '12px 0 0',
                        fontSize: 12,
                        color: BRAND.faint,
                        textAlign: 'center',
                    }}
                >
                    No spam. Unsubscribe anytime from any email.
                </p>
            </form>
        </div>
    );
}
