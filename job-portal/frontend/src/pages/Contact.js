import React, { useState } from 'react';
import {
    Mail, Phone, MapPin, Clock, Send, CheckCircle2,
    Building2, ArrowUpRight
} from 'lucide-react';
import BrandNav from '../components/brand/BrandNav';
import BrandFooter from '../components/brand/BrandFooter';
import { BRAND, FONT, injectBrandStyles } from '../components/brand/brandTheme';
import { useResponsive } from '../hooks/useResponsive';

injectBrandStyles();

const SUBJECTS = [
    'General inquiry',
    'Job seeker support',
    'Employer / hiring',
    'Partnership',
    'Feedback',
];

const CONTACT_INFO = [
    { icon: Mail, label: 'Email us', value: 'hello@jobportal.com', sub: 'We reply within one business day.' },
    { icon: Phone, label: 'Call us', value: '+92 300 1234567', sub: 'Mon–Fri, during working hours.' },
    { icon: Clock, label: 'Working hours', value: 'Mon–Fri · 9am–6pm PKT', sub: 'Weekends & public holidays closed.' },
];

const FAQS = [
    { q: 'How long does it take to get a reply?', a: 'Our support team monitors incoming requests systematically. You will receive an actionable response within 24 business hours.' },
    { q: 'Can I change my account type later?', a: 'Accounts are explicitly partitioned between seekers and employers to maintain pristine data logs. You can create separate profiles using separate email credentials.' },
    
];

const Contact = () => {
    const { isMobile, isCompact, isTablet } = useResponsive();
    const [activeFaq, setActiveFaq] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: '',
        email: '',
        subject: 'General inquiry',
        message: '',
        company: '',
        role: 'seeker'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 1200);
    };

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
                        fontSize: 12, 
                        fontWeight: 700, 
                        letterSpacing: '0.12em', 
                        textTransform: 'uppercase', 
                        color: BRAND.green, 
                        marginBottom: 20 
                    }}>
                        Contact our desk
                    </div>
                    <h1 style={{
                        fontSize: isMobile ? '38px' : isTablet ? '48px' : '64px',
                        fontWeight: 700,
                        letterSpacing: '-2.5px',
                        lineHeight: 1.06,
                        color: BRAND.ink,
                        margin: '0 0 24px 0',
                        maxWidth: '920px'
                    }}>
                        Where clear answers begin, and <span style={{ color: BRAND.green }}>ambitious partnerships</span> grow.
                    </h1>
                    <p style={{ 
                        fontSize: isMobile ? '16px' : '18px', 
                        color: BRAND.slate, 
                        maxWidth: '620px', 
                        margin: 0, 
                        lineHeight: 1.65 
                    }}>
                        Have questions about our verification process, step-by-step role tracking, or enterprise platform onboarding? Drop a transmission below and track every stage.
                    </p>
                </div>
            </section>

            {/* 2. DYNAMIC SPLIT GRID SECTION */}
            <section style={{ 
                padding: isMobile ? '40px 16px' : '72px 24px',
                width: '100%',
                boxSizing: 'border-box',
                flexGrow: 1
            }}>
                <div style={{ 
                    maxWidth: '1200px', 
                    margin: '0 auto', 
                    display: 'grid', 
                    gridTemplateColumns: isCompact ? '1fr' : '1fr 1.1fr', 
                    gap: isCompact ? '40px' : '64px',
                    alignItems: 'start'
                }}>
                    
                    {/* Left Panel: Information Metrics */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: '100%' }}>
                        <div>
                            <h2 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 12, margin: 0 }}>
                                Communication Lines
                            </h2>
                            <p style={{ color: BRAND.slate, lineHeight: 1.55, margin: 0, fontSize: '14.5px' }}>
                                Use our direct channels for formal queries or platform performance logs.
                            </p>
                        </div>

                        {/* Info Grid Cards */}
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
                            gap: '16px',
                            width: '100%'
                        }}>
                            {CONTACT_INFO.map((item, idx) => {
                                const Icon = item.icon;
                                return (
                                    <div 
                                        key={idx}
                                        style={{
                                            border: `1px solid ${BRAND.line}`,
                                            padding: '20px',
                                            borderRadius: 8,
                                            backgroundColor: BRAND.surface,
                                            boxSizing: 'border-box'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                                            <div style={{ color: BRAND.green, display: 'flex', alignItems: 'center' }}><Icon size={18} strokeWidth={2} /></div>
                                            <span style={{ fontSize: '11px', fontWeight: 700, color: BRAND.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</span>
                                        </div>
                                        <div style={{ fontSize: '15px', fontWeight: 700, color: BRAND.ink, marginBottom: 4, wordBreak: 'break-word' }}>{item.value}</div>
                                        <div style={{ fontSize: '12.5px', color: BRAND.slate, lineHeight: 1.4 }}>{item.sub}</div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* High Contrast Brand Office Box */}
                        <div style={{
                            border: `1px solid ${BRAND.line}`,
                            borderRadius: 8,
                            backgroundColor: BRAND.green,
                            color: '#ffffff',
                            padding: isMobile ? '24px' : '32px',
                            boxSizing: 'border-box'
                        }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: 999, fontSize: '11.5px', fontWeight: 700, marginBottom: 16 }}>
                                <MapPin size={13} /> Our Head Office
                            </div>
                            <h3 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.5px', margin: '0 0 10px', color: '#ffffff' }}>
                                Come say hello
                            </h3>
                            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.55, margin: '0 0 20px' }}>
                                Our verification desk handles physical enterprise routing processing loops systematically here.
                            </p>
                            {/* <a 
                                href="https://maps.google.com" 
                                target="_blank" 
                                rel="noreferrer"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: BRAND.gold, textDecoration: 'none', fontSize: '13.5px', fontWeight: 700 }}
                            >
                                Open Google Maps <ArrowUpRight size={13} />
                            </a> */}
                        </div>
                    </div>

                    {/* Right Panel: Functional Dispatch Control Container */}
                    <div style={{ 
                        border: `1px solid ${BRAND.line}`, 
                        borderRadius: 8, 
                        padding: isMobile ? '24px' : '32px', 
                        backgroundColor: BRAND.surface,
                        width: '100%',
                        boxSizing: 'border-box'
                    }}>
                        {submitted ? (
                            <div style={{ textAlign: 'center', padding: '32px 0' }}>
                                <div style={{ color: BRAND.green, marginBottom: 16, display: 'flex', justifyContent: 'center' }}><CheckCircle2 size={44} strokeWidth={1.5} /></div>
                                <h3 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 10, margin: 0 }}>Message dispatched</h3>
                                <p style={{ color: BRAND.slate, fontSize: '14.5px', lineHeight: 1.55, maxWidth: '340px', margin: '0 auto 20px' }}>
                                    Thank you for writing. A validation specialist from our desk will evaluate your file and reply shortly.
                                </p>
                                <button 
                                    onClick={() => setSubmitted(false)} 
                                    style={{ background: 'transparent', color: BRAND.ink, border: `1px solid ${BRAND.line}`, padding: '10px 20px', borderRadius: 6, fontSize: '13.5px', fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <div>
                                    <h3 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.4px', margin: '0 0 4px' }}>Send a direct dispatch</h3>
                                    <p style={{ fontSize: '13.5px', color: BRAND.slate, margin: 0 }}>Fill out the details below to route your query instantly.</p>
                                </div>

                                {/* Dual Mode Toggle Component Segment */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, border: `1px solid ${BRAND.line}`, padding: 4, borderRadius: 6, backgroundColor: BRAND.surfaceAlt }}>
                                    <button
                                        type="button"
                                        onClick={() => setForm({ ...form, role: 'seeker' })}
                                        style={{
                                            padding: '8px', borderRadius: 4, border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: FONT,
                                            background: form.role === 'seeker' ? BRAND.surface : 'transparent',
                                            color: form.role === 'seeker' ? BRAND.ink : BRAND.muted,
                                            border: form.role === 'seeker' ? `1px solid ${BRAND.line}` : '1px solid transparent'
                                        }}
                                    >
                                        I am a Job Seeker
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setForm({ ...form, role: 'employer' })}
                                        style={{
                                            padding: '8px', borderRadius: 4, border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: FONT,
                                            background: form.role === 'employer' ? BRAND.surface : 'transparent',
                                            color: form.role === 'employer' ? BRAND.ink : BRAND.muted,
                                            border: form.role === 'employer' ? `1px solid ${BRAND.line}` : '1px solid transparent'
                                        }}
                                    >
                                        I am an Employer
                                    </button>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: 6 }}>Full Name</label>
                                        <input
                                            type="text" required placeholder="Waqas Ali"
                                            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            style={{ width: '100%', boxSizing: 'border-box', border: `1px solid ${BRAND.line}`, borderRadius: 6, padding: '11px 14px', fontSize: '14px', outline: 'none', background: BRAND.surface, fontFamily: FONT }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: 6 }}>Email Address</label>
                                        <input
                                            type="email" required placeholder="waqas@example.com"
                                            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            style={{ width: '100%', boxSizing: 'border-box', border: `1px solid ${BRAND.line}`, borderRadius: 6, padding: '11px 14px', fontSize: '14px', outline: 'none', background: BRAND.surface, fontFamily: FONT }}
                                        />
                                    </div>
                                </div>

                                {form.role === 'employer' && (
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: 6 }}>Company Name</label>
                                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                            <Building2 size={15} color={BRAND.faint} style={{ position: 'absolute', left: 14 }} />
                                            <input
                                                type="text" required placeholder="Rupani Foundations"
                                                value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                                                style={{ width: '100%', boxSizing: 'border-box', border: `1px solid ${BRAND.line}`, borderRadius: 6, padding: '11px 14px 11px 38px', fontSize: '14px', outline: 'none', background: BRAND.surface, fontFamily: FONT }}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: 6 }}>Topic of Dispatch</label>
                                    <select
                                        value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                        style={{ width: '100%', boxSizing: 'border-box', border: `1px solid ${BRAND.line}`, borderRadius: 6, padding: '11px 14px', fontSize: '14px', outline: 'none', background: BRAND.surface, fontFamily: FONT, cursor: 'pointer' }}
                                    >
                                        {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: 6 }}>Message Body</label>
                                    <textarea
                                        required rows={4} placeholder="Type your inquiry logs or notes clean here..."
                                        value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        style={{ width: '100%', boxSizing: 'border-box', border: `1px solid ${BRAND.line}`, borderRadius: 6, padding: '11px 14px', fontSize: '14px', outline: 'none', background: BRAND.surface, fontFamily: FONT, resize: 'vertical' }}
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading} 
                                    style={{ 
                                        width: '100%', backgroundColor: BRAND.green, color: '#ffffff', border: 'none',
                                        padding: '13px', borderRadius: 6, fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: FONT
                                    }}
                                >
                                    {loading ? 'Dispatching...' : <>Send Dispatch <Send size={14} /></>}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* 3. RESPONSIVE ACCORDION FAQ SECTION */}
            <section style={{ 
                borderTop: `1px solid ${BRAND.line}`, 
                backgroundColor: BRAND.surfaceAlt,
                padding: isMobile ? '48px 16px' : '72px 24px',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <div style={{ maxWidth: '680px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 36 }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: BRAND.green, marginBottom: 8 }}>
                            Quick Answers
                        </div>
                        <h2 style={{ fontSize: isMobile ? '24px' : '30px', fontWeight: 700, letterSpacing: '-0.5px', margin: 0 }}>Frequently Asked Questions</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', borderTop: `1px solid ${BRAND.line}` }}>
                        {FAQS.map((faq, idx) => {
                            const isOpen = activeFaq === idx;
                            return (
                                <div key={idx} style={{ borderBottom: `1px solid ${BRAND.line}` }}>
                                    <button
                                        onClick={() => setActiveFaq(isOpen ? null : idx)}
                                        style={{
                                            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            padding: '20px 0', background: 'transparent', border: 'none', outline: 'none',
                                            cursor: 'pointer', textAlign: 'left', fontFamily: FONT
                                        }}
                                    >
                                        <span style={{ fontSize: '15px', fontWeight: 700, color: BRAND.ink, paddingRight: '12px' }}>{faq.q}</span>
                                        <span style={{ fontSize: '18px', fontWeight: 600, color: BRAND.muted, flexShrink: 0 }}>{isOpen ? '−' : '+'}</span>
                                    </button>
                                    <div style={{
                                        maxHeight: isOpen ? '300px' : '0', 
                                        overflow: 'hidden',
                                        transition: 'max-height 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}>
                                        <p style={{ fontSize: '14px', color: BRAND.slate, lineHeight: 1.6, margin: '0 0 20px 0' }}>
                                            {faq.a}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <BrandFooter />
        </div>
    );
};

export default Contact;