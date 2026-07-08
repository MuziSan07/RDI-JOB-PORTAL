// ─────────────────────────────────────────────────────────────────────────────
// Shared brand design system for all public/marketing ("branding") pages.
// Colors sampled directly from the RDI logo: forest green, gold sunburst,
// and a small crimson accent. No blue — it isn't part of the mark.
// ─────────────────────────────────────────────────────────────────────────────

export const BRAND = {
    green: '#0E7A42',       // primary — RDI wordmark green
    greenDark: '#0B5D39',   // deeper shade for hover/dark surfaces
    gold: '#C9972C',        // sunburst icon
    crimson: '#C8303C',     // small accent from the logo — use sparingly
    ink: '#12201A',         // near-black heading color, green-tinted
    slate: '#475569',
    muted: '#64748B',
    faint: '#94A3B8',
    line: '#E6EBF1',
    surface: '#FFFFFF',
    surfaceAlt: '#F6F9F7',
    night: '#062A1B',       // dark footer / dark sections
};

export const GRAD = {
    brand: `linear-gradient(135deg, ${BRAND.green} 0%, ${BRAND.greenDark} 100%)`,
    brandSoft: `linear-gradient(135deg, ${BRAND.green}14, ${BRAND.gold}14)`,
    hero: `radial-gradient(1200px 600px at 80% -10%, ${BRAND.green}16, transparent 60%), radial-gradient(900px 500px at -10% 20%, ${BRAND.gold}12, transparent 55%), linear-gradient(180deg, #FBFDFB 0%, #F3F8F4 100%)`,
    sunrise: `linear-gradient(135deg, ${BRAND.gold} 0%, ${BRAND.green} 100%)`,
    night: `linear-gradient(160deg, #0B2A1C 0%, ${BRAND.night} 100%)`,
};

export const SHADOW = {
    sm: '0 1px 3px rgba(18,32,26,0.06)',
    md: '0 8px 24px rgba(18,32,26,0.08)',
    lg: '0 24px 60px rgba(18,32,26,0.14)',
    glow: `0 18px 50px ${BRAND.green}2e`,
};

export const FONT = "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

// Page-level helpers reused by every branding page.
export const page = {
    root: { minHeight: '100vh', background: BRAND.surface, fontFamily: FONT, color: BRAND.ink, overflowX: 'hidden' },
    section: { maxWidth: 1180, margin: '0 auto', padding: '0 24px', width: '100%', boxSizing: 'border-box' },
};

// Reusable eyebrow pill ("badge") above section titles.
export const eyebrow = (tint = BRAND.green) => ({
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: `${tint}14`, color: tint, border: `1px solid ${tint}2e`,
    padding: '6px 14px', borderRadius: 999, fontSize: 13, fontWeight: 700,
    letterSpacing: '0.02em',
});

// Primary gradient button.
export const btnPrimary = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9,
    background: GRAD.brand, color: '#fff', border: 'none',
    padding: '14px 26px', borderRadius: 12, fontSize: 15, fontWeight: 700,
    cursor: 'pointer', boxShadow: SHADOW.glow, fontFamily: FONT,
    transition: 'transform .15s ease, box-shadow .15s ease',
};

// Secondary outline button.
export const btnGhost = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9,
    background: '#fff', color: BRAND.ink, border: `1.5px solid ${BRAND.line}`,
    padding: '13px 24px', borderRadius: 12, fontSize: 15, fontWeight: 700,
    cursor: 'pointer', fontFamily: FONT, transition: 'all .15s ease',
};

// Inject brand fonts, keyframes and a few hover rules once.
export const injectBrandStyles = () => {
    if (typeof document === 'undefined') return;
    if (document.getElementById('brand-styles')) return;

    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap';
    document.head.appendChild(fontLink);

    const el = document.createElement('style');
    el.id = 'brand-styles';
    el.textContent = `
        @keyframes brandFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
        @keyframes brandFloatSlow { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-22px) rotate(6deg); } }
        @keyframes brandFadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes brandSpin { to { transform: rotate(360deg); } }
        @keyframes brandMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .brand-fade { animation: brandFadeUp .7s cubic-bezier(.2,.7,.2,1) both; }
        .brand-lift { transition: transform .2s ease, box-shadow .2s ease; }
        .brand-lift:hover { transform: translateY(-6px); box-shadow: 0 24px 60px rgba(18,32,26,0.16); }
        .brand-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 22px 60px ${BRAND.green}44; }
        .brand-btn-ghost:hover { border-color: ${BRAND.green}; color: ${BRAND.green}; }
        .brand-link:hover { color: ${BRAND.green} !important; }
       
        .brand-fnav:hover { color: #fff !important; }
        html { scroll-behavior: smooth; }
    `;
    document.head.appendChild(el);
};
