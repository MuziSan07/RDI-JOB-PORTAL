// ─────────────────────────────────────────────────────────────────────────────
// Shared layout + prose primitives for the legal pages (Privacy, Terms, Cookies).
// Deliberately flat and minimal to match the Landing page: hairline rules, small
// uppercase labels, tight-tracked bold headings — no gradients, pills, or cards.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import BrandNav from '../brand/BrandNav';
import BrandFooter from '../brand/BrandFooter';
import { BRAND, page, injectBrandStyles } from '../brand/brandTheme';
import { useResponsive } from '../../hooks/useResponsive';

injectBrandStyles();

export const PROSE_MAX = 780;

// Small uppercase eyebrow label, identical in spirit to Landing's label().
export const Label = ({ children, tint = BRAND.muted }) => (
    <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: tint }}>
        {children}
    </div>
);

// Section heading — a hairline rule above, flat bold type. The section number
// lives in the text (e.g. "1. Introduction").
export const H2 = ({ id, children }) => (
    <h2
        id={id}
        style={{
            scrollMarginTop: 96,
            borderTop: `1px solid ${BRAND.line}`,
            paddingTop: 40, margin: '44px 0 16px',
            fontSize: 'clamp(21px, 2.6vw, 26px)', fontWeight: 700,
            letterSpacing: '-0.7px', lineHeight: 1.25, color: BRAND.ink,
        }}
    >
        {children}
    </h2>
);

export const H3 = ({ children }) => (
    <h3 style={{ fontSize: 16.5, fontWeight: 700, color: BRAND.ink, margin: '26px 0 8px' }}>
        {children}
    </h3>
);

export const P = ({ children }) => (
    <p style={{ fontSize: 15.5, lineHeight: 1.75, color: BRAND.slate, margin: '0 0 16px' }}>
        {children}
    </p>
);

// Inline emphasis that reads as ink (default <strong> would stay slate).
export const B = ({ children }) => (
    <strong style={{ color: BRAND.ink, fontWeight: 700 }}>{children}</strong>
);

export const UL = ({ children }) => (
    <ul style={{ margin: '0 0 16px', paddingLeft: 0, listStyle: 'none' }}>{children}</ul>
);

export const LI = ({ children }) => (
    <li style={{ position: 'relative', paddingLeft: 22, marginBottom: 11, fontSize: 15.5, lineHeight: 1.7, color: BRAND.slate }}>
        <span style={{ position: 'absolute', left: 0, top: 10, width: 6, height: 6, borderRadius: '50%', background: BRAND.gold }} />
        {children}
    </li>
);

// Emphasis block for the load-bearing clauses (disclaimers, liability caps).
export const Callout = ({ children }) => (
    <div style={{ borderLeft: `3px solid ${BRAND.green}`, background: BRAND.surfaceAlt, padding: '16px 20px', margin: '4px 0 20px' }}>
        <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.7, color: BRAND.slate }}>{children}</p>
    </div>
);

// Full page scaffold: nav → flat hero → table of contents → body → footer.
export const LegalPage = ({ badge, title, intro, lastUpdated, sections, children }) => {
    const { isMobile } = useResponsive();

    return (
        <div style={page.root}>
            <BrandNav />

            {/* Hero — flat surface with a single bottom rule, like the Landing hero */}
            <section style={{ background: BRAND.surface, borderBottom: `1px solid ${BRAND.line}` }}>
                <div style={{ ...page.section, paddingTop: isMobile ? 56 : 96, paddingBottom: isMobile ? 40 : 64 }}>
                    <div style={{ maxWidth: PROSE_MAX, margin: '0 auto' }}>
                        <div style={{ marginBottom: 18 }}><Label tint={BRAND.green}>Legal · {badge}</Label></div>
                        <h1 style={{ fontSize: isMobile ? 34 : 52, fontWeight: 700, letterSpacing: '-2px', lineHeight: 1.06, color: BRAND.ink, margin: '0 0 20px', maxWidth: 720 }}>
                            {title}
                        </h1>
                        <p style={{ fontSize: isMobile ? 16 : 18, lineHeight: 1.65, color: BRAND.slate, margin: 0, maxWidth: 640 }}>
                            {intro}
                        </p>
                        <div style={{ marginTop: 22, fontSize: 13.5, color: BRAND.muted }}>Last updated: {lastUpdated}</div>
                    </div>
                </div>
            </section>

            {/* Body */}
            <main style={{ ...page.section, paddingTop: isMobile ? 40 : 56, paddingBottom: 80 }}>
                <div style={{ maxWidth: PROSE_MAX, margin: '0 auto' }}>

                    {/* Table of contents — ruled top, plain two-column links */}
                    <nav aria-label="Table of contents" style={{ borderTop: `1px solid ${BRAND.line}`, padding: '26px 0 4px' }}>
                        <div style={{ marginBottom: 16 }}><Label>On this page</Label></div>
                        <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '11px 32px' }}>
                            {sections.map((s) => (
                                <li key={s.id}>
                                    <a href={`#${s.id}`} className="brand-link" style={{ fontSize: 14.5, fontWeight: 600, color: BRAND.slate, textDecoration: 'none' }}>
                                        {s.label}
                                    </a>
                                </li>
                            ))}
                        </ol>
                    </nav>

                    {children}
                </div>
            </main>

            <BrandFooter />
        </div>
    );
};
