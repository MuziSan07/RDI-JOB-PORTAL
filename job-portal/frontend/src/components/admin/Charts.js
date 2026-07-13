import React from 'react';

/**
 * Lightweight, dependency-free inline-SVG charts for the dark admin dashboard.
 * All charts are responsive (viewBox + width:100%), accessible (<title>),
 * use tabular-nums for figures and degrade gracefully on empty/zero data.
 */

const NUM = { fontVariantNumeric: 'tabular-nums', fontFeatureSettings: '"tnum"' };
const FONT =
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

// Shown when there is nothing to plot.
const EmptyState = ({ label = 'No data yet', height = 180 }) => (
    <div
        style={{
            height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            fontSize: '13px',
            fontWeight: 600,
            fontFamily: FONT,
            letterSpacing: '0.02em',
        }}
    >
        {label}
    </div>
);

const hasData = (data) =>
    Array.isArray(data) && data.some((d) => Number(d && d.value) > 0);

/* ─────────────────────────── BarChart ─────────────────────────── */

export const BarChart = ({ data = [], color = '#818cf8', title = 'Bar chart' }) => {
    if (!hasData(data)) return <EmptyState />;

    const W = 520;
    const H = 240;
    const padX = 16;
    const padTop = 24;
    const padBottom = 44; // room for labels + values
    const chartW = W - padX * 2;
    const chartH = H - padTop - padBottom;

    const max = Math.max(...data.map((d) => Number(d.value) || 0), 1);
    const n = data.length;
    const slot = chartW / n;
    const barW = Math.min(46, slot * 0.6);
    const baselineY = padTop + chartH;

    return (
        <svg
            viewBox={`0 0 ${W} ${H}`}
            width="100%"
            role="img"
            aria-label={title}
            style={{ display: 'block', fontFamily: FONT }}
            preserveAspectRatio="xMidYMid meet"
        >
            <title>{title}</title>
            {/* faint baseline */}
            <line
                x1={padX}
                y1={baselineY}
                x2={W - padX}
                y2={baselineY}
                stroke="#1e293b"
                strokeWidth="1"
            />
            {data.map((d, i) => {
                const value = Number(d.value) || 0;
                const h = Math.max(2, (value / max) * chartH);
                const x = padX + slot * i + (slot - barW) / 2;
                const y = baselineY - h;
                return (
                    <g key={i}>
                        <rect
                            x={x}
                            y={y}
                            width={barW}
                            height={h}
                            rx={Math.min(6, barW / 2)}
                            fill={color}
                            opacity="0.9"
                        />
                        <text
                            x={x + barW / 2}
                            y={y - 7}
                            textAnchor="middle"
                            fill="#e2e8f0"
                            fontSize="12"
                            fontWeight="700"
                            style={NUM}
                        >
                            {value}
                        </text>
                        <text
                            x={x + barW / 2}
                            y={baselineY + 18}
                            textAnchor="middle"
                            fill="#94a3b8"
                            fontSize="11"
                        >
                            {truncate(String(d.label), 10)}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
};

/* ─────────────────────────── DonutChart ─────────────────────────── */

export const DonutChart = ({ data = [], title = 'Donut chart' }) => {
    const clean = (Array.isArray(data) ? data : []).filter(
        (d) => Number(d.value) > 0
    );
    const total = clean.reduce((s, d) => s + Number(d.value), 0);

    if (!clean.length || total === 0) return <EmptyState />;

    const size = 200;
    const cx = size / 2;
    const cy = size / 2;
    const r = 74;
    const stroke = 26;
    const circ = 2 * Math.PI * r;

    let offset = 0;
    const palette = ['#818cf8', '#34d399', '#fbbf24', '#f472b6', '#60a5fa', '#f87171', '#a78bfa', '#2dd4bf'];

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                flexWrap: 'wrap',
                justifyContent: 'center',
            }}
        >
            <svg
                viewBox={`0 0 ${size} ${size}`}
                width="180"
                height="180"
                role="img"
                aria-label={title}
                style={{ flexShrink: 0, maxWidth: '180px' }}
            >
                <title>{title}</title>
                {/* track */}
                <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth={stroke}
                />
                {clean.map((d, i) => {
                    const frac = Number(d.value) / total;
                    const dash = frac * circ;
                    const seg = (
                        <circle
                            key={i}
                            cx={cx}
                            cy={cy}
                            r={r}
                            fill="none"
                            stroke={d.color || palette[i % palette.length]}
                            strokeWidth={stroke}
                            strokeDasharray={`${dash} ${circ - dash}`}
                            strokeDashoffset={-offset}
                            transform={`rotate(-90 ${cx} ${cy})`}
                            strokeLinecap="butt"
                        />
                    );
                    offset += dash;
                    return seg;
                })}
                <text
                    x={cx}
                    y={cy - 4}
                    textAnchor="middle"
                    fill="#f8fafc"
                    fontSize="30"
                    fontWeight="800"
                    fontFamily={FONT}
                    style={NUM}
                >
                    {total}
                </text>
                <text
                    x={cx}
                    y={cy + 18}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="11"
                    fontFamily={FONT}
                    letterSpacing="0.08em"
                >
                    TOTAL
                </text>
            </svg>

            {/* legend */}
            <ul
                style={{
                    listStyle: 'none',
                    margin: 0,
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    minWidth: '140px',
                }}
            >
                {clean.map((d, i) => (
                    <li
                        key={i}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '13px',
                            fontFamily: FONT,
                        }}
                    >
                        <span
                            style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '3px',
                                background: d.color || palette[i % palette.length],
                                flexShrink: 0,
                            }}
                        />
                        <span style={{ color: '#cbd5e1', flex: 1 }}>{d.label}</span>
                        <span style={{ color: '#f1f5f9', fontWeight: 700, ...NUM }}>
                            {d.value}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

/* ─────────────────────────── LineChart ─────────────────────────── */

export const LineChart = ({ data = [], color = '#34d399', title = 'Line chart' }) => {
    if (!Array.isArray(data) || data.length === 0) return <EmptyState />;

    const W = 520;
    const H = 220;
    const padX = 18;
    const padTop = 22;
    const padBottom = 34;
    const chartW = W - padX * 2;
    const chartH = H - padTop - padBottom;

    const values = data.map((d) => Number(d.value) || 0);
    const max = Math.max(...values, 1);
    const n = data.length;
    const stepX = n > 1 ? chartW / (n - 1) : 0;
    const baselineY = padTop + chartH;

    const points = data.map((d, i) => {
        const x = padX + stepX * i;
        const y = baselineY - ((Number(d.value) || 0) / max) * chartH;
        return { x, y, label: d.label, value: Number(d.value) || 0 };
    });

    const linePath = points
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
        .join(' ');
    const areaPath =
        `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${baselineY} ` +
        `L ${points[0].x.toFixed(1)} ${baselineY} Z`;

    const gid = 'lc-grad-' + Math.abs(hashStr(title));
    const gridLines = 3;
    const last = points[points.length - 1];

    return (
        <svg
            viewBox={`0 0 ${W} ${H}`}
            width="100%"
            role="img"
            aria-label={title}
            style={{ display: 'block', fontFamily: FONT }}
            preserveAspectRatio="xMidYMid meet"
        >
            <title>{title}</title>
            <defs>
                <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.35" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>

            {/* faint horizontal grid */}
            {Array.from({ length: gridLines + 1 }).map((_, i) => {
                const y = padTop + (chartH / gridLines) * i;
                return (
                    <line
                        key={i}
                        x1={padX}
                        y1={y}
                        x2={W - padX}
                        y2={y}
                        stroke="#1e293b"
                        strokeWidth="1"
                        strokeDasharray={i === gridLines ? '0' : '3 5'}
                    />
                );
            })}

            {/* area fill */}
            <path d={areaPath} fill={`url(#${gid})`} />
            {/* line */}
            <path
                d={linePath}
                fill="none"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* emphasized endpoint dot */}
            <circle cx={last.x} cy={last.y} r="6" fill={color} opacity="0.25" />
            <circle cx={last.x} cy={last.y} r="3.5" fill={color} />
            <text
                x={Math.min(last.x, W - padX - 4)}
                y={Math.max(last.y - 12, padTop + 4)}
                textAnchor="end"
                fill="#f1f5f9"
                fontSize="12"
                fontWeight="700"
                style={NUM}
            >
                {last.value}
            </text>

            {/* x labels */}
            {points.map((p, i) => (
                <text
                    key={i}
                    x={p.x}
                    y={baselineY + 18}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="11"
                >
                    {truncate(String(p.label), 6)}
                </text>
            ))}
        </svg>
    );
};

/* ─────────────────────────── helpers ─────────────────────────── */

function truncate(str, max) {
    if (str.length <= max) return str;
    return str.slice(0, Math.max(1, max - 1)) + '…';
}

function hashStr(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
        h = (h << 5) - h + s.charCodeAt(i);
        h |= 0;
    }
    return h;
}

export default { BarChart, DonutChart, LineChart };
