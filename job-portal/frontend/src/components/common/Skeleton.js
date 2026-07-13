import React from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Reusable loading skeleton primitives. Neutral brand-line colors with a
// subtle shimmer that respects prefers-reduced-motion.
// ─────────────────────────────────────────────────────────────────────────────

const STYLE_ID = 'skeleton-styles';

// Inject the shimmer keyframes + base class exactly once.
const injectSkeletonStyles = () => {
    if (typeof document === 'undefined') return;
    if (document.getElementById(STYLE_ID)) return;

    const el = document.createElement('style');
    el.id = STYLE_ID;
    el.textContent = `
        @keyframes skeletonShimmer {
            0% { background-position: -180% 0; }
            100% { background-position: 180% 0; }
        }
        .rdi-skeleton {
            display: block;
            background-color: #E6EBF1;
            background-image: linear-gradient(
                90deg,
                #E6EBF1 0%,
                #F1F5F9 50%,
                #E6EBF1 100%
            );
            background-size: 200% 100%;
            animation: skeletonShimmer 1.4s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
            .rdi-skeleton {
                animation: none;
                background-image: none;
                background-color: #EEF2F7;
            }
        }
    `;
    document.head.appendChild(el);
};

injectSkeletonStyles();

/**
 * Base skeleton block.
 * @param {string|number} width   - CSS width (default '100%')
 * @param {string|number} height  - CSS height (default 16)
 * @param {string|number} radius  - border radius (default 6)
 * @param {object} style          - extra style overrides
 */
export const Skeleton = ({ width = '100%', height = 16, radius = 6, style = {} }) => (
    <span
        className="rdi-skeleton"
        aria-hidden="true"
        style={{ width, height, borderRadius: radius, ...style }}
    />
);

/**
 * Mimics a single job list card: logo block + title lines + meta chips.
 */
export const JobCardSkeleton = () => (
    <div
        aria-hidden="true"
        style={{
            background: '#FFFFFF',
            borderRadius: 10,
            border: '1px solid #E6EBF1',
            padding: '20px 22px',
            marginBottom: 14,
        }}
    >
        {/* Header: avatar + title lines */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <Skeleton width={48} height={48} radius={8} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
                <Skeleton width="55%" height={16} style={{ marginBottom: 8 }} />
                <Skeleton width="35%" height={12} />
            </div>
            <Skeleton width={70} height={22} radius={6} style={{ flexShrink: 0 }} />
        </div>

        {/* Meta row */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 14, flexWrap: 'wrap' }}>
            <Skeleton width={90} height={12} />
            <Skeleton width={80} height={12} />
            <Skeleton width={100} height={12} />
        </div>

        {/* Description lines */}
        <Skeleton width="100%" height={12} style={{ marginBottom: 8 }} />
        <Skeleton width="92%" height={12} style={{ marginBottom: 16 }} />

        {/* Chips */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Skeleton width={64} height={22} radius={6} />
            <Skeleton width={54} height={22} radius={6} />
            <Skeleton width={72} height={22} radius={6} />
            <Skeleton width={48} height={22} radius={6} />
        </div>
    </div>
);

/**
 * Renders N JobCardSkeletons.
 * @param {number} count - number of card skeletons (default 5)
 */
export const JobListSkeleton = ({ count = 5 }) => (
    <div aria-busy="true" aria-live="polite">
        {Array.from({ length: count }).map((_, i) => (
            <JobCardSkeleton key={i} />
        ))}
    </div>
);

const SkeletonExports = { Skeleton, JobCardSkeleton, JobListSkeleton };
export default SkeletonExports;
