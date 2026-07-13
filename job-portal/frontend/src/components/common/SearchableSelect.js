import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronDown, Search, Check, Plus, X } from 'lucide-react';

/**
 * A searchable dropdown (combobox) with an in-menu search field and an optional
 * "Other" choice that reveals a free-text input for a custom value.
 *
 * Props:
 *   value            current value (string)
 *   onChange(value)  called with the chosen/typed value
 *   options          array of strings OR array of { value, label }
 *   placeholder      trigger placeholder when nothing is selected
 *   searchPlaceholder search-box placeholder (default "Search…")
 *   allowOther       show an "Other" option that opens a custom-text input
 *   otherLabel       label for the other option (default "Other (type your own)")
 *   accent           accent color (default brand blue)
 *   disabled
 */
const SearchableSelect = ({
    value = '',
    onChange,
    options = [],
    placeholder = 'Select…',
    searchPlaceholder = 'Search…',
    allowOther = false,
    otherLabel = 'Other (type your own)',
    accent = '#2B6BE6',
    disabled = false,
}) => {
    const norm = useMemo(
        () => options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o)),
        [options]
    );

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [customMode, setCustomMode] = useState(false);
    const [customText, setCustomText] = useState('');
    const wrapRef = useRef(null);
    const searchRef = useRef(null);

    const selected = norm.find((o) => o.value === value);
    const isCustom = !!value && !selected;
    const displayLabel = selected ? selected.label : (isCustom ? value : '');

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return norm;
        return norm.filter((o) => o.label.toLowerCase().includes(q));
    }, [norm, query]);

    // close on outside click / Escape
    useEffect(() => {
        const onDoc = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) close(); };
        const onKey = (e) => { if (e.key === 'Escape') close(); };
        document.addEventListener('mousedown', onDoc);
        document.addEventListener('keydown', onKey);
        return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
    }, []);

    useEffect(() => {
        if (open && searchRef.current && !customMode) searchRef.current.focus();
    }, [open, customMode]);

    const close = () => { setOpen(false); setQuery(''); setCustomMode(false); };
    const toggle = () => { if (disabled) return; open ? close() : setOpen(true); };

    const pick = (v) => { onChange && onChange(v); close(); };

    const startCustom = () => { setCustomMode(true); setCustomText(isCustom ? value : ''); };
    const submitCustom = () => {
        const v = customText.trim();
        if (!v) return;
        onChange && onChange(v);
        close();
    };

    const s = {
        trigger: {
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
            padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: 8, background: disabled ? '#F1F5F9' : '#FAFAFA',
            fontSize: 14, color: displayLabel ? '#0F172A' : '#94A3B8', cursor: disabled ? 'not-allowed' : 'pointer',
            boxSizing: 'border-box', fontFamily: 'inherit', textAlign: 'left',
            outline: open ? `2px solid ${accent}55` : 'none',
        },
        panel: {
            position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 400, background: '#fff',
            border: '1px solid #E2E8F0', borderRadius: 10, boxShadow: '0 14px 40px rgba(15,23,42,0.16)', overflow: 'hidden',
        },
        searchWrap: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderBottom: '1px solid #EEF2F6' },
        search: { flex: 1, border: 'none', outline: 'none', fontSize: 14, color: '#0F172A', background: 'transparent', fontFamily: 'inherit' },
        list: { maxHeight: 240, overflowY: 'auto', padding: 4 },
        opt: (active) => ({
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '9px 11px',
            borderRadius: 7, fontSize: 14, cursor: 'pointer', color: '#334155',
            background: active ? `${accent}12` : 'transparent', fontWeight: active ? 700 : 500,
        }),
        empty: { padding: '16px 12px', fontSize: 13, color: '#94A3B8', textAlign: 'center' },
        otherRow: {
            display: 'flex', alignItems: 'center', gap: 8, padding: '11px 12px', borderTop: '1px solid #EEF2F6',
            fontSize: 13.5, fontWeight: 600, color: accent, cursor: 'pointer', background: '#F8FAFC',
        },
        customWrap: { display: 'flex', gap: 8, padding: 10, borderTop: '1px solid #EEF2F6', background: '#F8FAFC' },
        customInput: { flex: 1, border: '1px solid #E2E8F0', borderRadius: 8, padding: '9px 11px', fontSize: 14, outline: 'none', fontFamily: 'inherit' },
        addBtn: { display: 'inline-flex', alignItems: 'center', gap: 5, background: accent, color: '#fff', border: 'none', borderRadius: 8, padding: '0 14px', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
    };

    return (
        <div ref={wrapRef} style={{ position: 'relative' }}>
            <button type="button" onClick={toggle} disabled={disabled} style={s.trigger} aria-haspopup="listbox" aria-expanded={open}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {displayLabel || placeholder}{isCustom && <span style={{ color: accent, fontWeight: 600, fontSize: 11.5, marginLeft: 6 }}>· custom</span>}
                </span>
                <ChevronDown size={17} color="#94A3B8" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }} />
            </button>

            {open && (
                <div style={s.panel}>
                    {!customMode && (
                        <div style={s.searchWrap}>
                            <Search size={16} color="#94A3B8" />
                            <input
                                ref={searchRef}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter' && filtered[0]) pick(filtered[0].value); }}
                                placeholder={searchPlaceholder}
                                style={s.search}
                            />
                            {query && <X size={15} color="#CBD5E1" style={{ cursor: 'pointer' }} onClick={() => setQuery('')} />}
                        </div>
                    )}

                    {!customMode ? (
                        <>
                            <div style={s.list}>
                                {filtered.length === 0 ? (
                                    <div style={s.empty}>No matches{allowOther ? ' — use “Other” below' : ''}</div>
                                ) : filtered.map((o) => {
                                    const active = o.value === value;
                                    return (
                                        <div key={o.value} onClick={() => pick(o.value)} style={s.opt(active)}
                                            onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = '#F1F5F9'; }}
                                            onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
                                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.label}</span>
                                            {active && <Check size={16} color={accent} style={{ flexShrink: 0 }} />}
                                        </div>
                                    );
                                })}
                            </div>
                            {allowOther && (
                                <div style={s.otherRow} onClick={startCustom}>
                                    <Plus size={15} /> {isCustom ? `Edit custom: “${value}”` : otherLabel}
                                </div>
                            )}
                        </>
                    ) : (
                        <div style={s.customWrap}>
                            <input
                                autoFocus
                                value={customText}
                                onChange={(e) => setCustomText(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') submitCustom(); }}
                                placeholder="Type your degree…"
                                style={s.customInput}
                            />
                            <button type="button" onClick={submitCustom} style={s.addBtn}><Plus size={14} /> Add</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchableSelect;
