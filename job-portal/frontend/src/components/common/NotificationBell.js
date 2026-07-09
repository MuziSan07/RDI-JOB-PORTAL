import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Bell, CheckCheck, Trash2, Info, AlertCircle, Calendar,
    Briefcase, FileText, CheckCircle2
} from 'lucide-react';
import { notificationService } from '../../services/notificationService';

// Category → icon + accent color
const CAT = {
    application: { icon: Briefcase,   color: '#2B6BE6' },
    test:        { icon: FileText,    color: '#7C3AED' },
    interview:   { icon: Calendar,    color: '#0891B2' },
    success:     { icon: CheckCircle2, color: '#16A34A' },
    warning:     { icon: AlertCircle, color: '#DC2626' },
    system:      { icon: Info,        color: '#6366F1' },
    info:        { icon: Bell,        color: '#64748B' },
};

const timeAgo = (iso) => {
    const d = new Date(iso);
    const s = Math.floor((Date.now() - d.getTime()) / 1000);
    if (s < 60) return 'just now';
    const m = Math.floor(s / 60); if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
    const days = Math.floor(h / 24); if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
};

const POLL_MS = 45000;

/**
 * Self-contained notification bell + dropdown. Works for every role.
 * Pass the host navbar's existing button/badge styles so the look is unchanged.
 *
 * Props:
 *   buttonStyle  - style object for the bell button (use the navbar's own)
 *   iconColor    - bell icon color (default #64748B)
 *   iconSize     - default 20
 *   theme        - 'light' | 'dark' (dropdown panel look; default 'light')
 *   align        - 'right' | 'left' (default 'right')
 */
const NotificationBell = ({
    buttonStyle = {},
    iconColor = '#64748B',
    iconSize = 20,
    theme = 'light',
    align = 'right',
}) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [unread, setUnread] = useState(0);
    const [loading, setLoading] = useState(false);
    const wrapRef = useRef(null);

    const dark = theme === 'dark';
    const P = dark
        ? { bg: '#0f172a', border: '#1e293b', text: '#e2e8f0', sub: '#94a3b8', hover: '#1e293b', head: '#0b1220' }
        : { bg: '#ffffff', border: '#E6EBF1', text: '#0F172A', sub: '#64748B', hover: '#F6F9FC', head: '#F8FAFC' };

    const loadCount = useCallback(async () => {
        try { setUnread(await notificationService.unreadCount()); } catch (_) { /* ignore */ }
    }, []);

    const loadList = useCallback(async () => {
        setLoading(true);
        try {
            const data = await notificationService.list({ limit: 20 });
            setItems(data.results || []);
            setUnread(data.unread_count || 0);
        } catch (_) { /* ignore */ }
        finally { setLoading(false); }
    }, []);

    // poll unread count
    useEffect(() => {
        loadCount();
        const t = setInterval(loadCount, POLL_MS);
        return () => clearInterval(t);
    }, [loadCount]);

    // outside click / escape
    useEffect(() => {
        const onClick = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
        const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
        document.addEventListener('mousedown', onClick);
        document.addEventListener('keydown', onKey);
        return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey); };
    }, []);

    const toggle = () => {
        const next = !open;
        setOpen(next);
        if (next) loadList();
    };

    const onItemClick = async (n) => {
        if (!n.is_read) {
            setItems(prev => prev.map(x => x.id === n.id ? { ...x, is_read: true } : x));
            setUnread(c => Math.max(0, c - 1));
            try { await notificationService.markRead(n.id); } catch (_) { /* ignore */ }
        }
        setOpen(false);
        if (n.link) navigate(n.link);
    };

    const markAll = async () => {
        setItems(prev => prev.map(x => ({ ...x, is_read: true })));
        setUnread(0);
        try { await notificationService.markAllRead(); } catch (_) { /* ignore */ }
    };

    const clearAll = async () => {
        setItems([]);
        setUnread(0);
        try { await notificationService.clear(); } catch (_) { /* ignore */ }
    };

    return (
        <div ref={wrapRef} style={{ position: 'relative', display: 'inline-flex' }}>
            <button onClick={toggle} style={buttonStyle} title="Notifications" aria-label="Notifications">
                <Bell size={iconSize} color={iconColor} />
                {unread > 0 && (
                    <span style={{
                        position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18, padding: '0 5px',
                        borderRadius: 9, background: 'linear-gradient(135deg, #EF4444, #DC2626)', color: '#fff',
                        fontSize: 10.5, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '2px solid ' + (dark ? '#1a202c' : '#ffffff'), lineHeight: 1, boxSizing: 'border-box',
                    }}>
                        {unread > 99 ? '99+' : unread}
                    </span>
                )}
            </button>

            {open && (
                <div style={{
                    position: 'absolute', top: 'calc(100% + 12px)', [align]: 0, width: 360, maxWidth: '92vw',
                    background: P.bg, border: `1px solid ${P.border}`, borderRadius: 14,
                    boxShadow: '0 20px 55px rgba(8,17,30,0.28)', zIndex: 500, overflow: 'hidden',
                    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                }}>
                    {/* header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', borderBottom: `1px solid ${P.border}`, background: P.head }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 15, fontWeight: 800, color: P.text }}>Notifications</span>
                            {unread > 0 && (
                                <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: '#EF4444', borderRadius: 999, padding: '1px 8px' }}>{unread} new</span>
                            )}
                        </div>
                        {items.length > 0 && (
                            <button onClick={markAll} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', color: '#2B6BE6', fontSize: 12.5, fontWeight: 700, fontFamily: 'inherit' }}>
                                <CheckCheck size={14} /> Mark all read
                            </button>
                        )}
                    </div>

                    {/* list */}
                    <div style={{ maxHeight: 380, overflowY: 'auto' }}>
                        {loading ? (
                            <div style={{ padding: '40px 0', textAlign: 'center', color: P.sub, fontSize: 13.5 }}>Loading…</div>
                        ) : items.length === 0 ? (
                            <div style={{ padding: '44px 20px', textAlign: 'center' }}>
                                <div style={{ width: 52, height: 52, borderRadius: '50%', background: dark ? '#1e293b' : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                                    <Bell size={24} color={P.sub} />
                                </div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: P.text, marginBottom: 4 }}>You're all caught up</div>
                                <div style={{ fontSize: 12.5, color: P.sub }}>New notifications will show up here.</div>
                            </div>
                        ) : items.map((n) => {
                            const meta = CAT[n.category] || CAT.info;
                            const Icon = meta.icon;
                            return (
                                <div
                                    key={n.id}
                                    onClick={() => onItemClick(n)}
                                    className="notif-item"
                                    style={{
                                        display: 'flex', gap: 12, padding: '13px 16px', cursor: 'pointer',
                                        borderBottom: `1px solid ${P.border}`,
                                        background: n.is_read ? 'transparent' : (dark ? 'rgba(43,107,230,0.10)' : 'rgba(43,107,230,0.05)'),
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = P.hover; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = n.is_read ? 'transparent' : (dark ? 'rgba(43,107,230,0.10)' : 'rgba(43,107,230,0.05)'); }}
                                >
                                    <div style={{ width: 38, height: 38, borderRadius: 10, background: `${meta.color}1a`, color: meta.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Icon size={18} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <span style={{ fontSize: 13.5, fontWeight: n.is_read ? 600 : 800, color: P.text }}>{n.title}</span>
                                            {!n.is_read && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#EF4444', flexShrink: 0 }} />}
                                        </div>
                                        {n.message && <div style={{ fontSize: 12.5, color: P.sub, lineHeight: 1.5, marginTop: 2 }}>{n.message}</div>}
                                        <div style={{ fontSize: 11, color: P.sub, marginTop: 5, opacity: 0.8 }}>{timeAgo(n.created_at)}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* footer */}
                    {items.length > 0 && (
                        <div style={{ padding: '10px 16px', borderTop: `1px solid ${P.border}`, background: P.head, display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={clearAll} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', color: P.sub, fontSize: 12, fontWeight: 700, fontFamily: 'inherit' }}>
                                <Trash2 size={13} /> Clear all
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
