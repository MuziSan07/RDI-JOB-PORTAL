import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Clock, CheckCircle, ChevronLeft, ChevronRight,
    AlertTriangle, Send, BookOpen, Target, Zap
} from 'lucide-react';
import { COLORS } from '../constants/colors';
import { testService } from '../services/testService';
import { jobSeekerAuthService } from '../services/jobSeekerAuthService';
import { useResponsive } from '../hooks/useResponsive';

// ─── Timer helpers ────────────────────────────────────────────────────────────

const formatTime = (ms) => {
    if (ms <= 0) return '00:00:00';
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const getTimerColor = (ms, deadline) => {
    if (!deadline) return COLORS.primary;
    const total = new Date(deadline).getTime() - (Date.now() - ms);
    const pct = ms / total;
    if (pct < 0.15) return '#EF4444';
    if (pct < 0.30) return '#F59E0B';
    return COLORS.secondary;
};

// ─── Main Component ───────────────────────────────────────────────────────────

const TakeTest = () => {
    const navigate = useNavigate();
    const { isMobile, isCompact } = useResponsive();
    const { applicationId } = useParams();

    const [testData,         setTestData]         = useState(null);
    const [loading,          setLoading]          = useState(true);
    const [currentQ,         setCurrentQ]         = useState(0);
    const [answers,          setAnswers]           = useState({});     // { questionId: [optionId] }
    const [timeRemaining,    setTimeRemaining]     = useState(null);
    const [submitting,       setSubmitting]        = useState(false);
    const [showConfirm,      setShowConfirm]       = useState(false);
    const [timerColor,       setTimerColor]        = useState(COLORS.secondary);
    const [paletteVisible,   setPaletteVisible]   = useState(true);

    useEffect(() => {
        if (!jobSeekerAuthService.getCurrentUser()) { navigate('/login'); return; }
        loadTest();
    }, [applicationId]);

    // Countdown timer
    useEffect(() => {
        if (!testData?.deadline) return;
        const deadline = new Date(testData.deadline).getTime();

        const tick = () => {
            const diff = deadline - Date.now();
            if (diff <= 0) { handleAutoSubmit(); return; }
            setTimeRemaining(diff);
            // Color urgency
            const total = new Date(testData.deadline).getTime() - new Date(testData.deadline).getTime() + diff;
            if (diff < 5 * 60 * 1000)       setTimerColor('#EF4444');
            else if (diff < 15 * 60 * 1000) setTimerColor('#F59E0B');
            else                             setTimerColor(COLORS.secondary);
        };

        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [testData]);

    const loadTest = async () => {
        setLoading(true);
        try {
            const data = await testService.getTestQuestions(applicationId);
            setTestData(data);
            const deadline = new Date(data.deadline).getTime();
            setTimeRemaining(deadline - Date.now());
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to load test');
            navigate('/my-applications');
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (questionId, optionId) => {
        setAnswers(prev => ({ ...prev, [questionId]: [optionId] }));
    };

    const handleAutoSubmit = useCallback(async () => {
        await doSubmit(true);
    }, [answers, applicationId]);

    const doSubmit = async (auto = false) => {
        setSubmitting(true);
        try {
            const formatted = Object.keys(answers).map(qId => ({
                question_id: parseInt(qId),
                selected_options: answers[qId],
            }));
            const result = await testService.submitTest(applicationId, formatted);
            navigate(`/test-results/${applicationId}`, { state: { result } });
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to submit test');
            setSubmitting(false);
        }
    };

    const handleSubmitClick = () => {
        const unanswered = testData.questions.length - Object.keys(answers).length;
        if (unanswered > 0 || true) setShowConfirm(true);
        else doSubmit();
    };

    if (loading) return (
        <div style={s.fullCenter}>
            <div style={s.loadingPulse}>
                <BookOpen size={32} color={COLORS.primary} />
            </div>
            <p style={s.loadingText}>Preparing your test...</p>
        </div>
    );

    if (!testData) return (
        <div style={s.fullCenter}>
            <p style={{ color: '#94A3B8' }}>Test not found</p>
        </div>
    );

    const questions     = testData.questions || [];
    const question      = questions[currentQ];
    const totalQ        = questions.length;
    const answeredCount = Object.keys(answers).length;
    const progress      = (answeredCount / totalQ) * 100;
    const isLast        = currentQ === totalQ - 1;
    const isFirst       = currentQ === 0;
    const isAnswered    = question && !!answers[question.id];
    const unanswered    = totalQ - answeredCount;

    return (
        <div style={s.root}>

            {/* ── Top Bar ── */}
            <header style={{ ...s.topBar, ...(isMobile ? { padding: '0 16px', gap: 12 } : {}) }}>
                {/* Logo + test info */}
                <div style={s.topLeft}>
                    <div style={s.logoMark}>
                        <span style={{ ...s.dot, background: COLORS.primary }} />
                        <span style={{ ...s.dot, background: COLORS.secondary }} />
                        <span style={{ ...s.dot, background: COLORS.accent }} />
                    </div>
                    <div style={s.topDivider} />
                    <div>
                        <p style={s.topChapter}>{testData.chapter_name}</p>
                        <p style={s.topJob}>{testData.job_title} · {testData.company_name}</p>
                    </div>
                </div>

                {/* Center: progress */}
                {!isCompact && (
                    <div style={s.topCenter}>
                        <div style={s.topProgressTrack}>
                            <div style={{ ...s.topProgressFill, width: `${progress}%` }} />
                        </div>
                        <p style={s.topProgressText}>
                            {answeredCount}/{totalQ} answered
                        </p>
                    </div>
                )}

                {/* Timer */}
                <div style={{ ...s.timerBox, ...(isMobile ? { marginLeft: 'auto' } : {}), borderColor: `${timerColor}40`, background: `${timerColor}10` }}>
                    <Clock size={16} color={timerColor} />
                    <span style={{ ...s.timerText, color: timerColor }}>
                        {timeRemaining !== null ? formatTime(timeRemaining) : '--:--:--'}
                    </span>
                    {timeRemaining !== null && timeRemaining < 5 * 60 * 1000 && (
                        <span style={{ ...s.timerWarning, color: timerColor }}>!</span>
                    )}
                </div>
            </header>

            {/* ── Body ── */}
            <div style={{ ...s.body, ...(isCompact ? { flexDirection: 'column', padding: isMobile ? '16px' : '24px' } : {}) }}>

                {/* ── Question Panel ── */}
                <main style={{ ...s.questionPanel, ...(isMobile ? { padding: '20px 18px', borderRadius: 16 } : {}) }}>

                    {/* Question header */}
                    <div style={s.qHeader}>
                        <div style={s.qNumberWrap}>
                            <span style={s.qNumber}>Q{currentQ + 1}</span>
                            <span style={s.qOf}>of {totalQ}</span>
                        </div>
                        {isAnswered && (
                            <div style={s.answeredPill}>
                                <CheckCircle size={13} color={COLORS.secondary} />
                                <span>Answered</span>
                            </div>
                        )}
                    </div>

                    {/* Question text */}
                    <div style={s.qTextWrap}>
                        <p style={s.qText}>{question?.question_text}</p>
                    </div>

                    {/* Options */}
                    <div style={s.optionsWrap}>
                        {question?.options?.map((opt, idx) => {
                            const selected = answers[question.id]?.includes(opt.id);
                            return (
                                <OptionCard
                                    key={opt.id}
                                    option={opt}
                                    index={idx}
                                    selected={selected}
                                    onSelect={() => handleOptionSelect(question.id, opt.id)}
                                />
                            );
                        })}
                    </div>

                    {/* Navigation */}
                    <div style={{ ...s.navRow, ...(isMobile ? { flexWrap: 'wrap' } : {}) }}>
                        <button
                            onClick={() => setCurrentQ(q => Math.max(0, q - 1))}
                            disabled={isFirst}
                            style={{ ...s.navBtn, opacity: isFirst ? 0.4 : 1, ...(isMobile ? { flex: 1, justifyContent: 'center' } : {}) }}
                        >
                            <ChevronLeft size={18} /> Previous
                        </button>

                        <button onClick={handleSubmitClick} style={{ ...s.submitTriggerBtn, ...(isMobile ? { order: 3, width: '100%', marginLeft: 0, justifyContent: 'center' } : {}) }}>
                            <Send size={15} /> Submit Test
                        </button>

                        <button
                            onClick={() => setCurrentQ(q => Math.min(totalQ - 1, q + 1))}
                            disabled={isLast}
                            style={{ ...s.navBtnPrimary, opacity: isLast ? 0.4 : 1, ...(isMobile ? { flex: 1, justifyContent: 'center' } : {}) }}
                        >
                            Next <ChevronRight size={18} />
                        </button>
                    </div>
                </main>

                {/* ── Right Sidebar ── */}
                <aside style={{ ...s.rightPanel, ...(isCompact ? { width: '100%', position: 'static' } : {}) }}>

                    {/* Stats */}
                    <div style={s.statsCard}>
                        <div style={s.statRow}>
                            <Target size={14} color="#64748B" />
                            <span style={s.statLabel}>Pass mark</span>
                            <span style={s.statValue}>{testData.pass_percentage}%</span>
                        </div>
                        <div style={s.statRow}>
                            <Zap size={14} color="#64748B" />
                            <span style={s.statLabel}>Answered</span>
                            <span style={{ ...s.statValue, color: COLORS.secondary }}>{answeredCount}</span>
                        </div>
                        <div style={s.statRow}>
                            <AlertTriangle size={14} color="#64748B" />
                            <span style={s.statLabel}>Remaining</span>
                            <span style={{ ...s.statValue, color: unanswered > 0 ? '#F59E0B' : COLORS.secondary }}>
                                {unanswered}
                            </span>
                        </div>

                        {/* Mini progress ring */}
                        <div style={s.ringWrap}>
                            <svg width="80" height="80" viewBox="0 0 80 80">
                                <circle cx="40" cy="40" r="32" fill="none" stroke="#E2E8F0" strokeWidth="6" />
                                <circle
                                    cx="40" cy="40" r="32" fill="none"
                                    stroke={progress === 100 ? COLORS.secondary : COLORS.primary}
                                    strokeWidth="6"
                                    strokeDasharray={`${2 * Math.PI * 32}`}
                                    strokeDashoffset={`${2 * Math.PI * 32 * (1 - progress / 100)}`}
                                    strokeLinecap="round"
                                    transform="rotate(-90 40 40)"
                                    style={{ transition: 'stroke-dashoffset 0.4s ease' }}
                                />
                                <text x="40" y="44" textAnchor="middle" fontSize="14" fontWeight="800" fill="#0F172A">
                                    {Math.round(progress)}%
                                </text>
                            </svg>
                            <p style={s.ringLabel}>Completion</p>
                        </div>
                    </div>

                    {/* Question Palette */}
                    <div style={s.paletteCard}>
                        <div style={s.paletteHeader}>
                            <h4 style={s.paletteTitle}>Question Map</h4>
                            <div style={s.paletteLegend}>
                                <span style={s.legendItem}><span style={{ ...s.legendDot, background: COLORS.secondary }} />Done</span>
                                <span style={s.legendItem}><span style={{ ...s.legendDot, background: COLORS.primary }} />Current</span>
                                <span style={s.legendItem}><span style={{ ...s.legendDot, background: '#E2E8F0' }} />Skipped</span>
                            </div>
                        </div>
                        <div style={s.paletteGrid}>
                            {questions.map((q, i) => {
                                const done    = !!answers[q.id];
                                const current = i === currentQ;
                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => setCurrentQ(i)}
                                        style={{
                                            ...s.paletteBtn,
                                            background: current ? COLORS.primary : done ? COLORS.secondary : '#F1F5F9',
                                            color:      current || done ? 'white' : '#64748B',
                                            boxShadow:  current ? `0 0 0 3px ${COLORS.primary}30` : 'none',
                                            fontWeight: current ? 800 : 600,
                                        }}
                                        title={`Question ${i + 1}${done ? ' (answered)' : ''}`}
                                    >
                                        {i + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Submit button */}
                    <button onClick={handleSubmitClick} style={s.bigSubmitBtn}>
                        <Send size={17} />
                        {submitting ? 'Submitting...' : 'Submit Test'}
                    </button>
                </aside>
            </div>

            {/* ── Confirm Modal ── */}
            {showConfirm && (
                <div style={s.overlay} onClick={() => !submitting && setShowConfirm(false)}>
                    <div style={s.confirmModal} onClick={e => e.stopPropagation()}>
                        <div style={s.confirmIcon}>
                            <Send size={26} color={COLORS.primary} />
                        </div>
                        <h2 style={s.confirmTitle}>Submit Test?</h2>
                        <p style={s.confirmText}>
                            You've answered <strong style={{ color: COLORS.secondary }}>{answeredCount}</strong> of <strong>{totalQ}</strong> questions.
                            {unanswered > 0 && (
                                <span style={{ color: '#F59E0B' }}> {unanswered} question{unanswered > 1 ? 's' : ''} left unanswered.</span>
                            )}
                        </p>
                        <p style={s.confirmWarn}>
                            ⚠️ Once submitted, you cannot retake this test.
                        </p>
                        <div style={s.confirmBtns}>
                            <button onClick={() => setShowConfirm(false)} disabled={submitting} style={s.confirmCancel}>
                                Keep Reviewing
                            </button>
                            <button onClick={() => { setShowConfirm(false); doSubmit(); }} disabled={submitting} style={s.confirmSubmit}>
                                {submitting ? 'Submitting...' : 'Yes, Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Option Card ──────────────────────────────────────────────────────────────

const LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

const OptionCard = ({ option, index, selected, onSelect }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            onClick={onSelect}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                ...s.optCard,
                border: selected
                    ? `2px solid ${COLORS.primary}`
                    : hovered
                        ? `2px solid #CBD5E1`
                        : '2px solid #F1F5F9',
                background: selected ? `${COLORS.primary}08` : hovered ? '#FAFCFF' : 'white',
                transform: hovered && !selected ? 'translateX(3px)' : 'none',
            }}
        >
            <div style={{
                ...s.optLabel,
                background: selected ? COLORS.primary : hovered ? '#E2E8F0' : '#F1F5F9',
                color: selected ? 'white' : '#64748B',
            }}>
                {LABELS[index] || index + 1}
            </div>
            <span style={{ ...s.optText, color: selected ? '#0F172A' : '#334155', fontWeight: selected ? 600 : 400 }}>
                {option.option_text}
            </span>
            {selected && (
                <div style={s.optCheck}>
                    <CheckCircle size={20} color={COLORS.primary} fill={`${COLORS.primary}20`} />
                </div>
            )}
        </div>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = {
    root:       { minHeight: '100vh', background: '#F8FAFC', fontFamily: "system-ui, -apple-system, sans-serif", display: 'flex', flexDirection: 'column' },
    fullCenter: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 16 },
    loadingPulse:{ width: 72, height: 72, borderRadius: '50%', background: `${COLORS.primary}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse 1.5s ease-in-out infinite' },
    loadingText: { color: '#64748B', fontSize: 15 },

    // Top bar
    topBar:     { background: 'white', borderBottom: '1px solid #E2E8F0', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, position: 'sticky', top: 0, zIndex: 200, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' },
    topLeft:    { display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 },
    logoMark:   { display: 'flex', gap: 3, alignItems: 'center' },
    dot:        { width: 9, height: 9, borderRadius: '50%' },
    topDivider: { width: 1, height: 28, background: '#E2E8F0' },
    topChapter: { fontSize: 14, fontWeight: 700, color: '#0F172A', margin: 0 },
    topJob:     { fontSize: 12, color: '#94A3B8', margin: '2px 0 0' },
    topCenter:  { flex: 1, maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' },
    topProgressTrack: { width: '100%', height: 6, background: '#E2E8F0', borderRadius: 10, overflow: 'hidden' },
    topProgressFill:  { height: '100%', background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`, borderRadius: 10, transition: 'width 0.4s ease' },
    topProgressText:  { fontSize: 11, color: '#94A3B8', fontWeight: 500 },
    timerBox:   { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 10, border: '1px solid', transition: 'all 0.3s', flexShrink: 0 },
    timerText:  { fontSize: 15, fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.05em' },
    timerWarning:{ fontSize: 16, fontWeight: 900 },

    // Body layout
    body:           { flex: 1, maxWidth: 1300, margin: '0 auto', padding: '28px 24px', width: '100%', display: 'flex', gap: 24, alignItems: 'flex-start', boxSizing: 'border-box' },

    // Question panel
    questionPanel:  { flex: 1, minWidth: 0, background: 'white', borderRadius: 20, border: '1px solid #E2E8F0', padding: '36px 40px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' },
    qHeader:        { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
    qNumberWrap:    { display: 'flex', alignItems: 'baseline', gap: 6 },
    qNumber:        { fontSize: 28, fontWeight: 900, color: COLORS.primary, letterSpacing: '-0.5px' },
    qOf:            { fontSize: 14, color: '#94A3B8', fontWeight: 500 },
    answeredPill:   { display: 'flex', alignItems: 'center', gap: 6, background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#166534', fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 20 },
    qTextWrap:      { background: '#F8FAFC', borderRadius: 14, padding: '24px 28px', marginBottom: 28, border: '1px solid #F1F5F9' },
    qText:          { fontSize: 18, fontWeight: 600, color: '#0F172A', lineHeight: 1.65, margin: 0 },
    optionsWrap:    { display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 },
    navRow:         { display: 'flex', gap: 12, paddingTop: 24, borderTop: '1px solid #F1F5F9' },
    navBtn:         { display: 'flex', alignItems: 'center', gap: 6, background: 'white', border: '1px solid #E2E8F0', color: '#475569', padding: '12px 22px', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' },
    navBtnPrimary:  { display: 'flex', alignItems: 'center', gap: 6, background: COLORS.primary, color: 'white', border: 'none', padding: '12px 22px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' },
    submitTriggerBtn:{ display: 'flex', alignItems: 'center', gap: 6, background: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0', padding: '12px 22px', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', marginLeft: 'auto' },

    // Option card
    optCard:    { display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderRadius: 12, cursor: 'pointer', transition: 'all 0.15s' },
    optLabel:   { width: 36, height: 36, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0, transition: 'all 0.15s' },
    optText:    { flex: 1, fontSize: 15, lineHeight: 1.5, transition: 'all 0.15s' },
    optCheck:   { flexShrink: 0 },

    // Right sidebar
    rightPanel:     { width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 80 },
    statsCard:      { background: 'white', borderRadius: 16, border: '1px solid #E2E8F0', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
    statRow:        { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 },
    statLabel:      { fontSize: 13, color: '#64748B', flex: 1 },
    statValue:      { fontSize: 15, fontWeight: 700, color: '#0F172A' },
    ringWrap:       { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, paddingTop: 12, borderTop: '1px solid #F1F5F9', marginTop: 4 },
    ringLabel:      { fontSize: 11, color: '#94A3B8', fontWeight: 500 },

    paletteCard:    { background: 'white', borderRadius: 16, border: '1px solid #E2E8F0', padding: '16px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
    paletteHeader:  { marginBottom: 14 },
    paletteTitle:   { fontSize: 13, fontWeight: 700, color: '#0F172A', margin: '0 0 8px' },
    paletteLegend:  { display: 'flex', gap: 10, flexWrap: 'wrap' },
    legendItem:     { display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#64748B', fontWeight: 500 },
    legendDot:      { width: 8, height: 8, borderRadius: '50%' },
    paletteGrid:    { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 7 },
    paletteBtn:     { width: '100%', aspectRatio: '1', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, transition: 'all 0.15s' },

    bigSubmitBtn:   { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`, color: 'white', border: 'none', padding: '14px 0', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 14px ${COLORS.primary}40` },

    // Confirm modal
    overlay:        { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    confirmModal:   { background: 'white', borderRadius: 20, padding: '36px', maxWidth: 440, width: '90%', boxShadow: '0 24px 60px rgba(0,0,0,0.2)', textAlign: 'center' },
    confirmIcon:    { width: 64, height: 64, borderRadius: '50%', background: `${COLORS.primary}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' },
    confirmTitle:   { fontSize: 22, fontWeight: 800, color: '#0F172A', margin: '0 0 10px' },
    confirmText:    { fontSize: 15, color: '#475569', lineHeight: 1.6, margin: '0 0 10px' },
    confirmWarn:    { fontSize: 13, color: '#F59E0B', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 9, padding: '10px 14px', margin: '0 0 24px' },
    confirmBtns:    { display: 'flex', gap: 10 },
    confirmCancel:  { flex: 1, background: '#F1F5F9', color: '#475569', border: 'none', padding: '13px 0', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
    confirmSubmit:  { flex: 1, background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`, color: 'white', border: 'none', padding: '13px 0', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 12px ${COLORS.primary}40` },
};

const styleEl = document.createElement('style');
styleEl.textContent = `
    @keyframes pulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.08); opacity: 0.8; } }
`;
document.head.appendChild(styleEl);

export default TakeTest;