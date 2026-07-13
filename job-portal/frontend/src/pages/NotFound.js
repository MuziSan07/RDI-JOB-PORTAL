import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Search, Compass, ArrowRight, Briefcase } from 'lucide-react';
import BrandNav from '../components/brand/BrandNav';
import BrandFooter from '../components/brand/BrandFooter';
import {
    BRAND, GRAD, SHADOW, FONT, page,
    eyebrow, btnPrimary, btnGhost, injectBrandStyles,
} from '../components/brand/brandTheme';
import { useResponsive } from '../hooks/useResponsive';

injectBrandStyles();

// Quick links surfaced beneath the primary actions.
const QUICK_LINKS = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Jobs', path: '/jobs', icon: Briefcase },
    { label: 'About', path: '/about', icon: Compass },
    { label: 'Contact', path: '/contact', icon: Search },
];

const NotFound = () => {
    const navigate = useNavigate();
    const { isMobile } = useResponsive();

    return (
        <div style={{ ...page.root, display: 'flex', flexDirection: 'column' }}>
            <BrandNav />

            <main
                style={{
                    flex: 1,
                    background: GRAD.hero,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: isMobile ? '56px 18px' : '96px 24px',
                }}
            >
                <div
                    className="brand-fade"
                    style={{
                        ...page.section,
                        maxWidth: 680,
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <span style={eyebrow(BRAND.gold)}>Error 404</span>

                    {/* Big 404 */}
                    <div
                        style={{
                            fontSize: isMobile ? 108 : 168,
                            fontWeight: 900,
                            lineHeight: 1,
                            letterSpacing: '-0.04em',
                            margin: isMobile ? '18px 0 6px' : '22px 0 8px',
                            background: GRAD.brand,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            fontFamily: FONT,
                        }}
                    >
                        404
                    </div>

                    <h1
                        style={{
                            fontSize: isMobile ? 26 : 34,
                            fontWeight: 800,
                            color: BRAND.ink,
                            margin: '0 0 12px',
                            letterSpacing: '-0.5px',
                            fontFamily: FONT,
                        }}
                    >
                        This page took a career break
                    </h1>

                    <p
                        style={{
                            fontSize: isMobile ? 15 : 16.5,
                            color: BRAND.slate,
                            lineHeight: 1.7,
                            maxWidth: 480,
                            margin: '0 0 32px',
                        }}
                    >
                        The page you're looking for moved on, got filled, or never existed.
                        Let's get you back to opportunities that are still hiring.
                    </p>

                    {/* Primary actions */}
                    <div
                        style={{
                            display: 'flex',
                            gap: 12,
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            width: isMobile ? '100%' : 'auto',
                        }}
                    >
                        <button
                            className="brand-btn-primary"
                            onClick={() => navigate('/')}
                            style={{ ...btnPrimary, ...(isMobile ? { width: '100%' } : {}) }}
                        >
                            <Home size={18} strokeWidth={2} /> Back to Home
                        </button>
                        <button
                            className="brand-btn-ghost"
                            onClick={() => navigate('/jobs')}
                            style={{ ...btnGhost, ...(isMobile ? { width: '100%' } : {}) }}
                        >
                            <Briefcase size={18} strokeWidth={2} /> Browse Jobs
                        </button>
                    </div>

                    {/* Quick links */}
                    <div
                        style={{
                            marginTop: 40,
                            paddingTop: 28,
                            borderTop: `1px solid ${BRAND.line}`,
                            width: '100%',
                            maxWidth: 460,
                        }}
                    >
                        <p
                            style={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: BRAND.muted,
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                                margin: '0 0 16px',
                            }}
                        >
                            Popular destinations
                        </p>
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 10,
                                justifyContent: 'center',
                            }}
                        >
                            {QUICK_LINKS.map(({ label, path, icon: Icon }) => (
                                <button
                                    key={label}
                                    onClick={() => navigate(path)}
                                    className="brand-lift"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        background: BRAND.surface,
                                        color: BRAND.ink,
                                        border: `1px solid ${BRAND.line}`,
                                        borderRadius: 10,
                                        padding: '10px 16px',
                                        fontSize: 14,
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        fontFamily: FONT,
                                        boxShadow: SHADOW.sm,
                                    }}
                                >
                                    <Icon size={15} color={BRAND.green} strokeWidth={2} />
                                    {label}
                                    <ArrowRight size={14} color={BRAND.faint} strokeWidth={2} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <BrandFooter />
        </div>
    );
};

export default NotFound;
