import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Loader from '../common/Loader';
import { testService } from '../../services/testService';
import { departmentService } from '../../services/departmentService';
import { useAuth } from '../../context/AuthContext';
import { useResponsive } from '../../hooks/useResponsive';
import { Search, X, BookOpen, CheckCircle } from 'lucide-react';

const Tests = () => {
    const { user } = useAuth();
    const { isMobile, isCompact } = useResponsive();
    const [chapters, setChapters] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [showQuestionsModal, setShowQuestionsModal] = useState(false);

    useEffect(() => {
        fetchChapters();
        if (user?.user_type === 'super_admin') fetchDepartments();
    }, [searchTerm, departmentFilter]);

    const fetchChapters = async () => {
        try {
            setLoading(true);
            const data = await testService.getAllChapters(searchTerm, departmentFilter);
            setChapters(data.results);
        } catch (err) {
            console.error('Failed to load chapters:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const data = await departmentService.getAllDepartments();
            setDepartments(data.results);
        } catch (err) {
            console.error('Failed to load departments:', err);
        }
    };

    const handleViewQuestions = async (chapter) => {
        try {
            const detailData = await testService.getChapterById(chapter.id);
            setSelectedChapter(detailData);
            setShowQuestionsModal(true);
        } catch (err) {
            console.error('Failed to load chapter details:', err);
        }
    };

    const avatarColors = ['#6366f1', '#a855f7', '#10b981', '#fbbf24', '#f472b6', '#38bdf8'];

    if (loading) return <Loader />;

    return (
        <div style={styles.container}>
            <Sidebar />
            <div style={{ ...styles.mainContent, ...(isCompact ? { marginLeft: 0 } : {}) }}>
                <Navbar />
                <div style={{ ...styles.scrollArea, ...(isMobile ? { padding: '90px 16px 24px 16px' } : {}) }}>

                    {/* Header */}
                    <header style={styles.dashboardHeader}>
                        <div>
                            <h1 style={styles.welcomeText}>Tests & Chapters</h1>
                            <p style={styles.subText}>
                                {user?.user_type === 'super_admin'
                                    ? 'View all test chapters and questions'
                                    : 'Manage your test chapters and questions'}
                            </p>
                        </div>
                    </header>

                    {/* Filters */}
                    <div style={{ ...styles.filtersContainer, ...(isMobile ? { flexDirection: 'column', alignItems: 'stretch' } : {}) }}>
                        <div style={styles.searchWrapper}>
                            <Search size={15} color="#475569" style={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Search chapters..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={styles.searchInput}
                            />
                        </div>
                        {user?.user_type === 'super_admin' && (
                            <select
                                value={departmentFilter}
                                onChange={(e) => setDepartmentFilter(e.target.value)}
                                style={{ ...styles.select, ...(isMobile ? { minWidth: 0, width: '100%' } : {}) }}
                            >
                                <option value="">All Departments</option>
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Chapter Cards Grid */}
                    <div style={styles.cardsGrid}>
                        {chapters.length > 0 ? chapters.map((chapter, index) => (
                            <div key={chapter.id} style={styles.card}>

                                {/* Image / Placeholder */}
                                <div style={styles.cardImageWrapper}>
                                    {chapter.image_url ? (
                                        <img src={chapter.image_url} alt={chapter.name} style={styles.chapterImage} />
                                    ) : (
                                        <div style={{
                                            ...styles.imagePlaceholder,
                                            backgroundColor: avatarColors[index % avatarColors.length] + '18',
                                            color: avatarColors[index % avatarColors.length],
                                        }}>
                                            {chapter.name.charAt(0)}
                                        </div>
                                    )}
                                </div>

                                <div style={styles.cardBody}>
                                    <h3 style={styles.cardTitle}>{chapter.name}</h3>
                                    {chapter.subtitle && (
                                        <p style={styles.cardSubtitle}>{chapter.subtitle}</p>
                                    )}
                                    <p style={styles.cardDescription}>
                                        {chapter.description.length > 100
                                            ? `${chapter.description.substring(0, 100)}...`
                                            : chapter.description}
                                    </p>

                                    <div style={styles.divider} />

                                    {/* Company + Stats */}
                                    <div style={styles.companyRow}>
                                        {chapter.department_logo ? (
                                            <img src={chapter.department_logo} alt={chapter.department_name} style={styles.companyLogo} />
                                        ) : (
                                            <div style={{
                                                ...styles.companyLogoPlaceholder,
                                                backgroundColor: avatarColors[index % avatarColors.length] + '22',
                                                color: avatarColors[index % avatarColors.length],
                                            }}>
                                                {chapter.department_name.charAt(0)}
                                            </div>
                                        )}
                                        <span style={styles.companyName}>{chapter.department_name}</span>
                                    </div>

                                    <div style={styles.statsRow}>
                                        <div style={styles.statBox}>
                                            <span style={styles.statLabel}>Questions</span>
                                            <span style={{ ...styles.statValue, color: avatarColors[index % avatarColors.length] }}>
                                                {chapter.questions_count}
                                            </span>
                                        </div>
                                        <div style={styles.statBox}>
                                            <span style={styles.statLabel}>Created</span>
                                            <span style={styles.statValue}>
                                                {new Date(chapter.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <button onClick={() => handleViewQuestions(chapter)} style={styles.viewButton}>
                                        View Questions ({chapter.questions_count})
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div style={styles.noData}>
                                <BookOpen size={32} color="#334155" />
                                <p style={{ color: '#475569', marginTop: '12px' }}>No chapters found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Questions Modal */}
            {showQuestionsModal && selectedChapter && (
                <div style={styles.modalOverlay} onClick={() => setShowQuestionsModal(false)}>
                    <div style={{ ...styles.modal, ...(isMobile ? { width: '92vw' } : {}) }} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <div>
                                <h2 style={styles.modalTitle}>{selectedChapter.name}</h2>
                                <p style={styles.modalSubtitle}>{selectedChapter.questions_count} Questions</p>
                            </div>
                            <button onClick={() => setShowQuestionsModal(false)} style={styles.closeButton}>
                                <X size={18} color="#94a3b8" />
                            </button>
                        </div>
                        <div style={styles.modalBody}>
                            {selectedChapter.questions.length > 0 ? (
                                <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                                <table style={{ ...styles.table, minWidth: '700px' }}>
                                    <thead>
                                        <tr>
                                            {['#', 'Question', 'Options', 'Correct Answers', 'Created'].map(h => (
                                                <th key={h} style={styles.th}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedChapter.questions.map((question, index) => (
                                            <tr key={question.id} style={styles.tr}>
                                                <td style={{ ...styles.td, color: '#475569', fontWeight: '700' }}>{index + 1}</td>
                                                <td style={styles.td}>
                                                    <div style={styles.questionText}>{question.question_text}</div>
                                                </td>
                                                <td style={{ ...styles.td, color: '#818cf8', fontWeight: '600', textAlign: 'center' }}>
                                                    {question.options_count}
                                                </td>
                                                <td style={{ ...styles.td, textAlign: 'center' }}>
                                                    <span style={styles.correctBadge}>
                                                        <CheckCircle size={11} style={{ marginRight: '4px' }} />
                                                        {question.correct_answers_count}
                                                    </span>
                                                </td>
                                                <td style={{ ...styles.td, color: '#64748b' }}>
                                                    {new Date(question.created_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                </div>
                            ) : (
                                <div style={styles.noQuestionsMessage}>
                                    <BookOpen size={28} color="#334155" />
                                    <p style={{ color: '#475569', marginTop: '12px' }}>No questions available for this chapter</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        backgroundColor: '#020617',
        minHeight: '100vh',
    },
    mainContent: {
        minWidth: 0,
        marginLeft: '280px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    scrollArea: {
        padding: '100px 40px 40px 40px',
    },

    // Header
    dashboardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
    },
    welcomeText: {
        fontSize: '26px',
        fontWeight: '800',
        color: '#f8fafc',
        margin: 0,
        letterSpacing: '-0.5px',
    },
    subText: {
        color: '#64748b',
        fontSize: '14px',
        margin: '4px 0 0 0',
    },

    // Filters
    filtersContainer: {
        display: 'flex',
        gap: '12px',
        marginBottom: '28px',
        alignItems: 'center',
    },
    searchWrapper: {
        position: 'relative',
        flex: 1,
    },
    searchIcon: {
        position: 'absolute',
        left: '14px',
        top: '50%',
        transform: 'translateY(-50%)',
    },
    searchInput: {
        width: '100%',
        padding: '11px 16px 11px 40px',
        fontSize: '14px',
        backgroundColor: '#0f172a',
        border: '1px solid #1e293b',
        borderRadius: '10px',
        color: '#f1f5f9',
        outline: 'none',
        boxSizing: 'border-box',
    },
    select: {
        padding: '10px 14px',
        fontSize: '13px',
        backgroundColor: '#0f172a',
        border: '1px solid #1e293b',
        borderRadius: '10px',
        color: '#cbd5e1',
        outline: 'none',
        cursor: 'pointer',
        minWidth: '200px',
    },

    // Cards
    cardsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
        gap: '20px',
    },
    card: {
        backgroundColor: '#0f172a',
        borderRadius: '16px',
        border: '1px solid #1e293b',
        overflow: 'hidden',
    },
    cardImageWrapper: {
        height: '160px',
        backgroundColor: '#020617',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderBottom: '1px solid #1e293b',
    },
    chapterImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    imagePlaceholder: {
        width: '80px',
        height: '80px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '36px',
        fontWeight: '800',
    },
    cardBody: {
        padding: '20px',
    },
    cardTitle: {
        margin: '0 0 6px 0',
        fontSize: '16px',
        fontWeight: '700',
        color: '#f1f5f9',
    },
    cardSubtitle: {
        margin: '0 0 8px 0',
        fontSize: '12px',
        color: '#64748b',
        fontStyle: 'italic',
    },
    cardDescription: {
        margin: '0 0 16px 0',
        fontSize: '13px',
        color: '#64748b',
        lineHeight: '1.6',
    },
    divider: {
        height: '1px',
        backgroundColor: '#1e293b',
        marginBottom: '16px',
    },
    companyRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '16px',
    },
    companyLogo: {
        width: '26px',
        height: '26px',
        borderRadius: '6px',
        objectFit: 'contain',
        flexShrink: 0,
    },
    companyLogoPlaceholder: {
        width: '26px',
        height: '26px',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '11px',
        fontWeight: '700',
        flexShrink: 0,
    },
    companyName: {
        fontSize: '12px',
        color: '#94a3b8',
        fontWeight: '500',
    },
    statsRow: {
        display: 'flex',
        gap: '12px',
        marginBottom: '18px',
    },
    statBox: {
        flex: 1,
        backgroundColor: '#020617',
        borderRadius: '10px',
        border: '1px solid #1e293b',
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    statLabel: {
        fontSize: '10px',
        color: '#475569',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        fontWeight: '600',
    },
    statValue: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#f1f5f9',
    },
    viewButton: {
        width: '100%',
        padding: '11px',
        fontSize: '13px',
        fontWeight: '600',
        color: '#f8fafc',
        backgroundColor: '#6366f1',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
    },
    noData: {
        gridColumn: '1 / -1',
        textAlign: 'center',
        padding: '80px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },

    // Modal
    modalOverlay: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.75)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: '#0f172a',
        border: '1px solid #1e293b',
        borderRadius: '16px',
        width: '90%',
        maxWidth: '900px',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '22px 28px',
        borderBottom: '1px solid #1e293b',
    },
    modalTitle: {
        margin: '0 0 4px 0',
        fontSize: '17px',
        fontWeight: '700',
        color: '#f1f5f9',
    },
    modalSubtitle: {
        margin: 0,
        fontSize: '12px',
        color: '#64748b',
    },
    closeButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '4px',
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
    },
    modalBody: {
        padding: '0',
        overflowY: 'auto',
        flex: 1,
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        textAlign: 'left',
        padding: '13px 20px',
        fontSize: '11px',
        fontWeight: '700',
        color: '#475569',
        backgroundColor: '#020617',
        borderBottom: '1px solid #1e293b',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        whiteSpace: 'nowrap',
    },
    tr: {
        borderBottom: '1px solid #1e293b',
    },
    td: {
        padding: '14px 20px',
        fontSize: '13px',
        color: '#cbd5e1',
        verticalAlign: 'middle',
    },
    questionText: {
        maxWidth: '380px',
        lineHeight: '1.6',
        color: '#e2e8f0',
    },
    correctBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 10px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '700',
        backgroundColor: '#052e16',
        color: '#86efac',
        border: '1px solid #166534',
    },
    noQuestionsMessage: {
        textAlign: 'center',
        padding: '64px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
};

export default Tests;