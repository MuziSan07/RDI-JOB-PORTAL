import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
    ArrowLeft, CheckCircle, XCircle, Award, User,
    Trophy, Target, Zap, Clock, BookOpen, ChevronDown, ChevronUp,
    BarChart2, Briefcase
} from 'lucide-react';
import { COLORS } from '../constants/colors';
import { testService } from '../services/testService';
import { jobSeekerAuthService } from '../services/jobSeekerAuthService';
import { useResponsive } from '../hooks/useResponsive';
import UserNavbar from '../components/brand/UserNavbar';

// ─── Animated Score Ring ──────────────────────────────────────────────────────

const ScoreRing = ({ percentage, passed, size = 160 }) => {
    const [animated, setAnimated] = useState(0);
    const r = (size / 2) - 12;
    const circ = 2 * Math.PI * r;

    useEffect(() => {
        const timeout = setTimeout(() => setAnimated(percentage), 200);
        return () => clearTimeout(timeout);
    }, [percentage]);

    const stroke = passed ? COLORS.secondary : '#EF4444';
    const offset = circ - (animated / 100) * circ;

    return (
        <div style={{ position: 'relative', width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Track */}
                <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E2E8F0" strokeWidth="10" />
                {/* Glow */}
                <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={stroke} strokeWidth="10"
                    strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
                    transform={`rotate(-90 ${size/2} ${size/2})`}
                    style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 6px ${stroke}80)` }}
                />
            </svg>
            {/* Center text */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 34, fontWeight: 900, color: stroke, lineHeight: 1 }}>{Math.round(percentage)}%</span>
                <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Score</span>
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const TestResults = () => {
    const navigate  = useNavigate();
    const { isMobile } = useResponsive();
    const { applicationId } = useParams();
    const location  = useLocation();
    const [results, setResults] = useState(location.state?.result || null);
    const [loading, setLoading] = useState(!results);
    const [user,    setUser]    = useState(null);
    const [expandedQ, setExpandedQ] = useState(null); // question index expanded

    useEffect(() => {
        const u = jobSeekerAuthService.getCurrentUser();
        if (!u) { navigate('/login'); return; }
        setUser(u);
        if (!results) loadResults();
    }, [applicationId]);

    const loadResults = async () => {
        setLoading(true);
        try {
            const data = await testService.getTestResults(applicationId);
            setResults(data);
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to load results');
            navigate('/my-applications');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div style={s.fullCenter}>
            <div style={s.loadingRing} />
            <p style={{ color: '#94A3B8', marginTop: 14 }}>Loading your results...</p>
        </div>
    );

    if (!results) return (
        <div style={s.fullCenter}>
            <p style={{ color: '#64748B' }}>Results not found</p>
        </div>
    );

    const { passed, percentage, total_questions, correct_answers, pass_percentage,
            chapter_name, job_title, company_name, completed_at, detailed_answers = [] } = results;

    const wrong = total_questions - correct_answers;
    const accuracy = total_questions > 0 ? Math.round((correct_answers / total_questions) * 100) : 0;
    const correctAnswers = detailed_answers.filter(a => a.is_correct).length;
    const wrongAnswers   = detailed_answers.filter(a => !a.is_correct).length;

    return (
        <div style={s.root}>

            {/* Navbar */}
            <UserNavbar />

            <div style={{ ...s.page, ...(isMobile ? { padding: '16px' } : {}) }}>
                <button onClick={() => navigate(`/my-applications/${applicationId}`)} style={s.backBtn}>
                    <ArrowLeft size={16} /> Back to Application
                </button>

                {/* ── Hero Result Card ── */}
                <div style={{ ...s.heroCard, borderTop: `4px solid ${passed ? COLORS.secondary : '#EF4444'}` }}>
                    {/* Confetti / fail overlay */}
                    <div style={{ ...s.heroInner, ...(isMobile ? { padding: '24px 18px 20px', gap: 20, justifyContent: 'center' } : {}) }}>

                        {/* Score ring */}
                        <div style={s.heroLeft}>
                            <ScoreRing percentage={percentage} passed={passed} size={160} />
                            <div style={{ ...s.resultBadge, background: passed ? '#F0FDF4' : '#FEF2F2', border: `1px solid ${passed ? '#86EFAC' : '#FECACA'}`, color: passed ? '#14532D' : '#991B1B' }}>
                                {passed ? <Trophy size={18} fill="#F59E0B" color="#F59E0B" /> : <XCircle size={18} />}
                                <span>{passed ? 'Test Passed!' : 'Test Failed'}</span>
                            </div>
                        </div>

                        {/* Details */}
                        <div style={s.heroCenter}>
                            <p style={s.heroChapter}>{chapter_name}</p>
                            <h1 style={s.heroJobTitle}>{job_title}</h1>
                            <p style={s.heroCompany}><Briefcase size={13} /> {company_name}</p>
                            {completed_at && (
                                <p style={s.heroDate}><Clock size={13} /> Completed {new Date(completed_at).toLocaleString()}</p>
                            )}
                        </div>

                        {/* Stats strip */}
                        <div style={s.heroStats}>
                            <StatBox label="Total Questions" value={total_questions}           icon={<BookOpen size={16} />}     color="#6366F1" />
                            <StatBox label="Correct"         value={correct_answers}            icon={<CheckCircle size={16} />}  color={COLORS.secondary} />
                            <StatBox label="Wrong"           value={wrong}                      icon={<XCircle size={16} />}      color="#EF4444" />
                            <StatBox label="Pass Mark"        value={`${pass_percentage}%`}      icon={<Target size={16} />}       color="#F59E0B" />
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div style={{ ...s.heroProgressWrap, ...(isMobile ? { padding: '0 18px 20px' } : {}) }}>
                        <div style={s.heroProgressLabels}>
                            <span style={{ fontSize: 12, color: '#64748B' }}>Your score: {Math.round(percentage)}%</span>
                            <span style={{ fontSize: 12, color: '#64748B' }}>Pass mark: {pass_percentage}%</span>
                        </div>
                        <div style={s.heroProgressTrack}>
                            {/* Pass mark line */}
                            <div style={{ ...s.passMarkLine, left: `${pass_percentage}%` }} />
                            {/* Score fill */}
                            <div style={{ ...s.heroProgressFill, width: `${Math.min(percentage, 100)}%`, background: passed ? `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})` : 'linear-gradient(90deg, #F87171, #EF4444)' }} />
                        </div>
                    </div>
                </div>

                {/* ── Action Buttons ── */}
                <div style={{ ...s.actionsRow, ...(isMobile ? { flexDirection: 'column', alignItems: 'stretch' } : {}) }}>
                    <button onClick={() => navigate('/my-applications')} style={{ ...s.actionBtn, ...(isMobile ? { justifyContent: 'center' } : {}) }}>
                        <BarChart2 size={16} /> View My Applications
                    </button>
                    <button onClick={() => navigate('/jobs')} style={{ ...s.actionBtnPrimary, ...(isMobile ? { justifyContent: 'center' } : {}) }}>
                        <Zap size={16} /> Browse More Jobs
                    </button>
                </div>

                {/* ── Detailed Answers ── */}
                {detailed_answers.length > 0 && (
                    <div style={s.answersSection}>
                        <div style={{ ...s.answersSectionHeader, ...(isMobile ? { flexDirection: 'column', alignItems: 'flex-start', gap: 10 } : {}) }}>
                            <h2 style={s.answersSectionTitle}>
                                <BookOpen size={18} /> Answer Review
                            </h2>
                            <div style={{ ...s.answersLegend, ...(isMobile ? { flexWrap: 'wrap' } : {}) }}>
                                <span style={s.legendItem}><span style={{ ...s.legendDot, background: COLORS.secondary }} /> Correct</span>
                                <span style={s.legendItem}><span style={{ ...s.legendDot, background: '#EF4444' }} /> Wrong</span>
                                <span style={s.legendItem}><span style={{ ...s.legendDot, background: '#E2E8F0' }} /> Not selected</span>
                            </div>
                        </div>

                        <div style={s.answersList}>
                            {detailed_answers.map((answer, idx) => (
                                <QuestionReview
                                    key={answer.question_id}
                                    answer={answer}
                                    index={idx}
                                    expanded={expandedQ === idx}
                                    onToggle={() => setExpandedQ(expandedQ === idx ? null : idx)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Stat Box ─────────────────────────────────────────────────────────────────

const StatBox = ({ label, value, icon, color }) => (
    <div style={s.statBox}>
        <div style={{ ...s.statBoxIcon, background: `${color}12`, color }}>
            {icon}
        </div>
        <div>
            <p style={{ ...s.statBoxValue, color }}>{value}</p>
            <p style={s.statBoxLabel}>{label}</p>
        </div>
    </div>
);

// ─── Question Review Card ─────────────────────────────────────────────────────

const LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

const QuestionReview = ({ answer, index, expanded, onToggle }) => {
    const { is_correct, question_text, options = [], selected_options = [], correct_options = [] } = answer;

    return (
        <div style={{ ...s.qCard, borderLeft: `4px solid ${is_correct ? COLORS.secondary : '#EF4444'}` }}>
            {/* Header — always visible */}
            <div style={s.qCardHeader} onClick={onToggle}>
                <div style={s.qCardLeft}>
                    <div style={{ ...s.qIndexBadge, background: is_correct ? `${COLORS.secondary}15` : '#FEF2F2', color: is_correct ? '#166534' : '#991B1B' }}>
                        {is_correct ? <CheckCircle size={13} /> : <XCircle size={13} />}
                        Q{index + 1}
                    </div>
                    <p style={s.qCardText}>{question_text}</p>
                </div>
                <div style={s.qCardToggle}>
                    {expanded ? <ChevronUp size={16} color="#94A3B8" /> : <ChevronDown size={16} color="#94A3B8" />}
                </div>
            </div>

            {/* Expanded options */}
            {expanded && (
                <div style={s.qCardOptions}>
                    {options.map((opt, i) => {
                        const isSelected = selected_options.includes(opt.id);
                        const isCorrect  = correct_options.includes(opt.id);

                        let bg     = 'white';
                        let border = '1px solid #E2E8F0';
                        let color  = '#334155';

                        if (isCorrect) {
                            bg = '#F0FDF4'; border = `1px solid ${COLORS.secondary}`; color = '#166534';
                        } else if (isSelected && !isCorrect) {
                            bg = '#FEF2F2'; border = '1px solid #FECACA'; color = '#991B1B';
                        }

                        return (
                            <div key={opt.id} style={{ ...s.optRow, background: bg, border, color }}>
                                <div style={{ ...s.optLetter, background: isCorrect ? COLORS.secondary : isSelected ? '#EF4444' : '#E2E8F0', color: (isCorrect || isSelected) ? 'white' : '#64748B' }}>
                                    {LABELS[i] || i + 1}
                                </div>
                                <span style={{ ...s.optRowText, fontWeight: (isCorrect || isSelected) ? 600 : 400 }}>
                                    {opt.option_text}
                                </span>
                                <div style={s.optRowIcon}>
                                    {isCorrect  && <CheckCircle size={16} color={COLORS.secondary} />}
                                    {isSelected && !isCorrect && <XCircle size={16} color="#EF4444" />}
                                </div>
                                {isSelected && <span style={s.yourAnswerTag}>Your answer</span>}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = {
    root:      { minHeight: '100vh', background: '#F1F5F9', fontFamily: "system-ui, -apple-system, sans-serif" },
    fullCenter:{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 12 },
    loadingRing:{ width: 40, height: 40, border: `4px solid #E2E8F0`, borderTop: `4px solid ${COLORS.primary}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' },

    navbar:    { background: 'white', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 200, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
    navInner:  { maxWidth: 1300, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', gap: 20 },
    logo:      { display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flexShrink: 0 },
    logoMark:  { display: 'flex', gap: 3 },
    dot:       { width: 10, height: 10, borderRadius: '50%' },
    logoText:  { fontSize: 20, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' },
    navRight:  { display: 'flex', alignItems: 'center', gap: 16, marginLeft: 'auto' },
    navTextBtn:{ background: 'none', border: 'none', color: '#475569', fontSize: 14, fontWeight: 500, cursor: 'pointer' },
    logoutBtn: { display: 'flex', alignItems: 'center', gap: 6, background: '#FEF2F2', color: '#DC2626', border: 'none', padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' },
    avatarWrap:{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', border: '2px solid #E2E8F0' },
    avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
    avatarInitial:{ width: '100%', height: '100%', background: '#EFF6FF', color: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 },

    page:     { maxWidth: 1000, margin: '0 auto', padding: '28px 24px' },
    backBtn:  { display: 'inline-flex', alignItems: 'center', gap: 7, background: 'none', border: 'none', color: '#64748B', fontSize: 14, fontWeight: 500, cursor: 'pointer', marginBottom: 20, padding: '6px 0' },

    // Hero card
    heroCard:        { background: 'white', borderRadius: 20, border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', marginBottom: 16 },
    heroInner:       { display: 'flex', gap: 32, padding: '36px 36px 28px', alignItems: 'flex-start', flexWrap: 'wrap' },
    heroLeft:        { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, flexShrink: 0 },
    resultBadge:     { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 18px', borderRadius: 20, fontSize: 13, fontWeight: 700 },
    heroCenter:      { flex: 1, minWidth: 200 },
    heroChapter:     { fontSize: 12, fontWeight: 700, color: COLORS.primary, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' },
    heroJobTitle:    { fontSize: 24, fontWeight: 800, color: '#0F172A', margin: '0 0 6px', letterSpacing: '-0.3px' },
    heroCompany:     { display: 'flex', alignItems: 'center', gap: 5, fontSize: 14, color: '#64748B', margin: '0 0 8px' },
    heroDate:        { display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#94A3B8', margin: 0 },
    heroStats:       { display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 },

    statBox:         { display: 'flex', alignItems: 'center', gap: 12 },
    statBoxIcon:     { width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    statBoxValue:    { fontSize: 20, fontWeight: 800, lineHeight: 1, margin: '0 0 2px' },
    statBoxLabel:    { fontSize: 11, color: '#94A3B8', margin: 0, fontWeight: 500 },

    heroProgressWrap:  { padding: '0 36px 24px' },
    heroProgressLabels:{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 },
    heroProgressTrack: { position: 'relative', height: 10, background: '#E2E8F0', borderRadius: 10, overflow: 'visible' },
    heroProgressFill:  { height: '100%', borderRadius: 10, transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)', position: 'relative', zIndex: 1 },
    passMarkLine:      { position: 'absolute', top: -4, bottom: -4, width: 2, background: '#F59E0B', borderRadius: 2, zIndex: 2 },

    actionsRow:      { display: 'flex', gap: 12, marginBottom: 28 },
    actionBtn:       { display: 'flex', alignItems: 'center', gap: 7, background: 'white', border: '1px solid #E2E8F0', color: '#475569', padding: '11px 22px', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
    actionBtnPrimary:{ display: 'flex', alignItems: 'center', gap: 7, background: COLORS.primary, color: 'white', border: 'none', padding: '11px 22px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' },

    answersSection:      { background: 'white', borderRadius: 16, border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
    answersSectionHeader:{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #F1F5F9' },
    answersSectionTitle: { display: 'flex', alignItems: 'center', gap: 9, fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 },
    answersLegend:       { display: 'flex', gap: 16 },
    legendItem:          { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748B', fontWeight: 500 },
    legendDot:           { width: 8, height: 8, borderRadius: '50%' },
    answersList:         { padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 },

    // Question review card
    qCard:       { borderRadius: 12, border: '1px solid #E2E8F0', overflow: 'hidden', transition: 'box-shadow 0.15s' },
    qCardHeader: { display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', cursor: 'pointer', background: 'white' },
    qCardLeft:   { display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 },
    qIndexBadge: { display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, flexShrink: 0, whiteSpace: 'nowrap' },
    qCardText:   { fontSize: 14, color: '#334155', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 },
    qCardToggle: { flexShrink: 0 },
    qCardOptions:{ padding: '0 18px 16px', background: '#FAFAFA', display: 'flex', flexDirection: 'column', gap: 8 },

    optRow:      { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 9, transition: 'all 0.15s', position: 'relative' },
    optLetter:   { width: 30, height: 30, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0, transition: 'all 0.15s' },
    optRowText:  { flex: 1, fontSize: 14, lineHeight: 1.4 },
    optRowIcon:  { flexShrink: 0 },
    yourAnswerTag:{ position: 'absolute', right: 44, top: '50%', transform: 'translateY(-50%)', fontSize: 10, fontWeight: 700, color: '#94A3B8', background: '#F1F5F9', padding: '2px 8px', borderRadius: 20 },
};

const styleEl = document.createElement('style');
styleEl.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
document.head.appendChild(styleEl);

export default TestResults;