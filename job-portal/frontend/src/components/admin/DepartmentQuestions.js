import React, { useState, useEffect } from 'react';
import DepartmentSidebar from './DepartmentSidebar';
import DepartmentNavbar from './DepartmentNavbar';
import Loader from '../common/Loader';
import { testService } from '../../services/testService';
import { useResponsive } from '../../hooks/useResponsive';
import { Search, Plus, X, HelpCircle, Pencil, Trash2, CheckCircle } from 'lucide-react';

const DepartmentQuestions = () => {
    const { isMobile, isCompact } = useResponsive();
    const [questions, setQuestions] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [chapterFilter, setChapterFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        chapter: '',
        question_text: '',
        options: [
            { option_text: '', is_correct: false },
            { option_text: '', is_correct: false },
            { option_text: '', is_correct: false },
            { option_text: '', is_correct: false },
        ],
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchChapters();
        fetchQuestions();
    }, [searchTerm, chapterFilter]);

    const fetchChapters = async () => {
        try {
            const data = await testService.getAllChapters();
            setChapters(data.results);
        } catch (err) { console.error('Failed to load chapters:', err); }
    };

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const data = await testService.getAllQuestions(chapterFilter, searchTerm);
            setQuestions(data.results);
        } catch (err) {
            setError('Failed to load questions');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleOptionChange = (index, field, value) => {
        const newOptions = [...formData.options];
        newOptions[index][field] = value;
        setFormData({ ...formData, options: newOptions });
    };

    const addOption = () => {
        if (formData.options.length < 5) {
            setFormData({ ...formData, options: [...formData.options, { option_text: '', is_correct: false }] });
        }
    };

    const removeOption = (index) => {
        if (formData.options.length > 2) {
            setFormData({ ...formData, options: formData.options.filter((_, i) => i !== index) });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');

        if (!formData.chapter) { setError('Please select a chapter'); return; }
        if (!formData.question_text.trim()) { setError('Please enter a question'); return; }
        const filledOptions = formData.options.filter((opt) => opt.option_text.trim() !== '');
        if (filledOptions.length < 2) { setError('Please provide at least 2 options'); return; }
        if (!filledOptions.some((opt) => opt.is_correct)) { setError('Please mark at least one option as correct'); return; }

        try {
            const submitData = { chapter: parseInt(formData.chapter), question_text: formData.question_text, options: filledOptions };
            if (isEditing) {
                await testService.updateQuestion(selectedQuestion.id, submitData);
                setSuccess('Question updated successfully!');
            } else {
                await testService.createQuestion(submitData);
                setSuccess('Question created successfully!');
            }
            setShowModal(false);
            resetForm();
            fetchQuestions();
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to save question');
        }
    };

    const handleEdit = async (question) => {
        try {
            const detailData = await testService.getQuestionById(question.id);
            setSelectedQuestion(detailData);
            setFormData({
                chapter: detailData.chapter,
                question_text: detailData.question_text,
                options: detailData.options.map((opt) => ({ option_text: opt.option_text, is_correct: opt.is_correct })),
            });
            setIsEditing(true);
            setShowModal(true);
        } catch (err) { setError('Failed to load question details'); }
    };

    const handleDelete = async (questionId) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            try {
                await testService.deleteQuestion(questionId);
                setSuccess('Question deleted successfully!');
                fetchQuestions();
            } catch (err) { setError('Failed to delete question'); }
        }
    };

    const handleViewDetails = async (question) => {
        try {
            const detailData = await testService.getQuestionById(question.id);
            setSelectedQuestion(detailData);
            setShowDetailModal(true);
        } catch (err) { setError('Failed to load question details'); }
    };

    const resetForm = () => {
        setFormData({
            chapter: '',
            question_text: '',
            options: [
                { option_text: '', is_correct: false },
                { option_text: '', is_correct: false },
                { option_text: '', is_correct: false },
                { option_text: '', is_correct: false },
            ],
        });
        setIsEditing(false);
        setSelectedQuestion(null);
    };

    if (loading) return <Loader />;

    return (
        <div style={styles.container}>
            <DepartmentSidebar />
            <div style={{ ...styles.mainContent, ...(isCompact ? { marginLeft: 0 } : {}) }}>
                <DepartmentNavbar />
                <div style={{ ...styles.scrollArea, ...(isMobile ? { padding: '90px 16px 32px 16px' } : {}) }}>

                    {/* Header */}
                    <header style={{ ...styles.dashboardHeader, ...(isMobile ? { flexDirection: 'column', alignItems: 'stretch', gap: '14px' } : {}) }}>
                        <div>
                            <h1 style={styles.welcomeText}>Questions</h1>
                            <p style={styles.subText}>Manage test questions and MCQ options</p>
                        </div>
                        <button onClick={() => { resetForm(); setShowModal(true); }} style={styles.createButton}>
                            <Plus size={14} color="#f8fafc" />
                            <span>Create Question</span>
                        </button>
                    </header>

                    {/* Alerts */}
                    {success && (
                        <div style={styles.successAlert}>
                            <span>{success}</span>
                            <button onClick={() => setSuccess('')} style={styles.alertClose}><X size={14} /></button>
                        </div>
                    )}
                    {error && (
                        <div style={styles.errorAlert}>
                            <span>{error}</span>
                            <button onClick={() => setError('')} style={styles.alertClose}><X size={14} /></button>
                        </div>
                    )}

                    {/* Filters */}
                    <div style={{ ...styles.filtersContainer, ...(isMobile ? { flexDirection: 'column' } : {}) }}>
                        <div style={styles.searchWrapper}>
                            <Search size={15} color="#475569" style={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Search questions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={styles.searchInput}
                            />
                        </div>
                        <select value={chapterFilter} onChange={(e) => setChapterFilter(e.target.value)} style={styles.select}>
                            <option value="">All Chapters</option>
                            {chapters.map((chapter) => (
                                <option key={chapter.id} value={chapter.id}>{chapter.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Table */}
                    <div style={styles.tableContainer}>
                      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                        {questions.length > 0 ? (
                            <table style={{ ...styles.table, minWidth: '850px' }}>
                                <thead>
                                    <tr>
                                        {['#', 'Question', 'Chapter', 'Options', 'Correct', 'Created', 'Actions'].map(h => (
                                            <th key={h} style={styles.th}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {questions.map((question, index) => (
                                        <tr key={question.id} style={styles.tr}>
                                            <td style={{ ...styles.td, color: '#475569', fontWeight: '700' }}>{index + 1}</td>
                                            <td style={styles.td}>
                                                <div style={styles.questionText}>
                                                    {question.question_text.length > 80
                                                        ? `${question.question_text.substring(0, 80)}...`
                                                        : question.question_text}
                                                </div>
                                            </td>
                                            <td style={styles.td}>
                                                <span style={styles.chapterBadge}>{question.chapter_name}</span>
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
                                            <td style={styles.td}>
                                                <div style={styles.actionButtons}>
                                                    <button onClick={() => handleViewDetails(question)} style={styles.viewBtn}>View</button>
                                                    <button onClick={() => handleEdit(question)} style={styles.editBtn}><Pencil size={12} /></button>
                                                    <button onClick={() => handleDelete(question.id)} style={styles.deleteBtn}><Trash2 size={12} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div style={styles.noData}>
                                <HelpCircle size={32} color="#334155" />
                                <p style={{ color: '#475569', marginTop: '12px' }}>No questions found. Create your first question!</p>
                            </div>
                        )}
                      </div>
                    </div>
                </div>
            </div>

            {/* Create / Edit Modal */}
            {showModal && (
                <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div style={{ ...styles.modal, ...(isMobile ? { width: '92vw' } : {}) }} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitle}>{isEditing ? 'Edit Question' : 'Create New Question'}</h2>
                            <button onClick={() => setShowModal(false)} style={styles.closeButton}><X size={18} color="#94a3b8" /></button>
                        </div>
                        <form onSubmit={handleSubmit} style={styles.form}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Chapter *</label>
                                <select name="chapter" value={formData.chapter} onChange={handleInputChange} required style={styles.input}>
                                    <option value="">Select a chapter</option>
                                    {chapters.map((chapter) => (
                                        <option key={chapter.id} value={chapter.id}>{chapter.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Question Text *</label>
                                <textarea name="question_text" value={formData.question_text} onChange={handleInputChange} required rows="4" style={styles.textarea} placeholder="Enter your question here..." />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Options * — check the correct answer(s)</label>
                                {formData.options.map((option, index) => (
                                    <div key={index} style={styles.optionRow}>
                                        <div style={{
                                            ...styles.optionLetter,
                                            backgroundColor: option.is_correct ? '#6366f1' : '#1e293b',
                                            color: option.is_correct ? '#fff' : '#64748b',
                                        }}>
                                            {String.fromCharCode(65 + index)}
                                        </div>
                                        <input
                                            type="text"
                                            value={option.option_text}
                                            onChange={(e) => handleOptionChange(index, 'option_text', e.target.value)}
                                            style={{
                                                ...styles.optionInput,
                                                borderColor: option.is_correct ? '#6366f1' : '#1e293b',
                                            }}
                                            placeholder={`Option ${index + 1}`}
                                        />
                                        <input
                                            type="checkbox"
                                            checked={option.is_correct}
                                            onChange={(e) => handleOptionChange(index, 'is_correct', e.target.checked)}
                                            style={styles.checkbox}
                                            title="Mark as correct"
                                        />
                                        {formData.options.length > 2 && (
                                            <button type="button" onClick={() => removeOption(index)} style={styles.removeOptionBtn}>
                                                <X size={12} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {formData.options.length < 5 && (
                                    <button type="button" onClick={addOption} style={styles.addOptionBtn}>
                                        <Plus size={13} style={{ marginRight: '6px' }} />
                                        Add Option
                                    </button>
                                )}
                            </div>
                            <div style={styles.modalFooter}>
                                <button type="button" onClick={() => setShowModal(false)} style={styles.cancelButton}>Cancel</button>
                                <button type="submit" style={styles.submitButton}>{isEditing ? 'Update Question' : 'Create Question'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {showDetailModal && selectedQuestion && (
                <div style={styles.modalOverlay} onClick={() => setShowDetailModal(false)}>
                    <div style={{ ...styles.modal, maxWidth: '580px', ...(isMobile ? { width: '92vw' } : {}) }} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitle}>Question Details</h2>
                            <button onClick={() => setShowDetailModal(false)} style={styles.closeButton}><X size={18} color="#94a3b8" /></button>
                        </div>
                        <div style={styles.modalBody}>
                            <div style={styles.section}>
                                <h4 style={styles.sectionTitle}>Chapter</h4>
                                <span style={styles.chapterBadge}>{selectedQuestion.chapter_name}</span>
                            </div>

                            <div style={styles.section}>
                                <h4 style={styles.sectionTitle}>Question</h4>
                                <p style={styles.description}>{selectedQuestion.question_text}</p>
                            </div>

                            <div style={styles.divider} />

                            <div style={styles.section}>
                                <h4 style={styles.sectionTitle}>Options ({selectedQuestion.options.length})</h4>
                                <div style={styles.optionsList}>
                                    {selectedQuestion.options.map((option, index) => (
                                        <div key={option.id} style={{
                                            ...styles.optionItem,
                                            borderColor: option.is_correct ? '#6366f1' : '#1e293b',
                                            backgroundColor: option.is_correct ? '#1e1b4b' : '#020617',
                                        }}>
                                            <div style={{
                                                ...styles.optionCircle,
                                                backgroundColor: option.is_correct ? '#6366f1' : '#1e293b',
                                                color: option.is_correct ? '#fff' : '#64748b',
                                            }}>
                                                {String.fromCharCode(65 + index)}
                                            </div>
                                            <div style={styles.optionContent}>{option.option_text}</div>
                                            {option.is_correct && (
                                                <span style={styles.correctLabel}>
                                                    <CheckCircle size={11} style={{ marginRight: '4px' }} />
                                                    Correct
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={styles.divider} />

                            <div style={styles.section}>
                                <h4 style={styles.sectionTitle}>Metadata</h4>
                                <div style={{ ...styles.infoGrid, ...(isMobile ? { gridTemplateColumns: '1fr' } : {}) }}>
                                    <div style={styles.infoBox}>
                                        <span style={styles.infoLabel}>Created</span>
                                        <span style={styles.infoValue}>{new Date(selectedQuestion.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div style={styles.infoBox}>
                                        <span style={styles.infoLabel}>Last Updated</span>
                                        <span style={styles.infoValue}>{new Date(selectedQuestion.updated_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
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
    createButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#6366f1',
        border: 'none',
        padding: '10px 18px',
        borderRadius: '10px',
        color: '#f8fafc',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
    },

    successAlert: {
        backgroundColor: '#052e16',
        border: '1px solid #166534',
        borderRadius: '10px',
        padding: '12px 16px',
        marginBottom: '20px',
        color: '#86efac',
        fontSize: '13px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    errorAlert: {
        backgroundColor: '#1c0a0a',
        border: '1px solid #7f1d1d',
        borderRadius: '10px',
        padding: '12px 16px',
        marginBottom: '20px',
        color: '#fca5a5',
        fontSize: '13px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    alertClose: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'inherit',
        display: 'flex',
        alignItems: 'center',
        opacity: 0.7,
    },

    filtersContainer: {
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
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

    tableContainer: {
        backgroundColor: '#0f172a',
        borderRadius: '16px',
        border: '1px solid #1e293b',
        overflow: 'hidden',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        textAlign: 'left',
        padding: '13px 18px',
        fontSize: '11px',
        fontWeight: '700',
        color: '#475569',
        backgroundColor: '#020617',
        borderBottom: '1px solid #1e293b',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    tr: {
        borderBottom: '1px solid #1e293b',
    },
    td: {
        padding: '13px 18px',
        fontSize: '13px',
        color: '#cbd5e1',
        verticalAlign: 'middle',
    },
    questionText: {
        maxWidth: '360px',
        lineHeight: '1.5',
        color: '#e2e8f0',
        fontWeight: '500',
    },
    chapterBadge: {
        padding: '3px 10px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '600',
        backgroundColor: '#1e293b',
        color: '#94a3b8',
        display: 'inline-block',
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
    actionButtons: {
        display: 'flex',
        gap: '6px',
        alignItems: 'center',
    },
    viewBtn: {
        padding: '5px 12px',
        fontSize: '11px',
        fontWeight: '600',
        color: '#f8fafc',
        backgroundColor: '#6366f1',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
    },
    editBtn: {
        padding: '5px 8px',
        color: '#86efac',
        backgroundColor: '#052e16',
        border: '1px solid #166534',
        borderRadius: '6px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
    },
    deleteBtn: {
        padding: '5px 8px',
        color: '#fca5a5',
        backgroundColor: '#1c0a0a',
        border: '1px solid #7f1d1d',
        borderRadius: '6px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
    },
    noData: {
        textAlign: 'center',
        padding: '80px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },

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
        maxWidth: '680px',
        maxHeight: '90vh',
        overflow: 'auto',
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '22px 28px',
        borderBottom: '1px solid #1e293b',
    },
    modalTitle: {
        margin: 0,
        fontSize: '17px',
        fontWeight: '700',
        color: '#f1f5f9',
    },
    closeButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '4px',
        display: 'flex',
        alignItems: 'center',
    },
    form: {
        padding: '24px 28px',
    },
    formGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontSize: '11px',
        fontWeight: '700',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    input: {
        width: '100%',
        padding: '10px 14px',
        fontSize: '14px',
        backgroundColor: '#020617',
        border: '1px solid #1e293b',
        borderRadius: '8px',
        color: '#f1f5f9',
        outline: 'none',
        boxSizing: 'border-box',
    },
    textarea: {
        width: '100%',
        padding: '10px 14px',
        fontSize: '14px',
        backgroundColor: '#020617',
        border: '1px solid #1e293b',
        borderRadius: '8px',
        color: '#f1f5f9',
        outline: 'none',
        fontFamily: 'inherit',
        resize: 'vertical',
        boxSizing: 'border-box',
    },
    optionRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '10px',
    },
    optionLetter: {
        width: '30px',
        height: '30px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: '700',
        flexShrink: 0,
        transition: 'all 0.15s',
    },
    optionInput: {
        flex: 1,
        padding: '9px 12px',
        fontSize: '13px',
        backgroundColor: '#020617',
        border: '1px solid',
        borderRadius: '8px',
        color: '#f1f5f9',
        outline: 'none',
    },
    checkbox: {
        width: '18px',
        height: '18px',
        cursor: 'pointer',
        accentColor: '#6366f1',
        flexShrink: 0,
    },
    removeOptionBtn: {
        width: '28px',
        height: '28px',
        backgroundColor: '#1c0a0a',
        border: '1px solid #7f1d1d',
        borderRadius: '6px',
        cursor: 'pointer',
        color: '#fca5a5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    addOptionBtn: {
        marginTop: '8px',
        padding: '9px 16px',
        fontSize: '13px',
        fontWeight: '600',
        color: '#818cf8',
        backgroundColor: 'transparent',
        border: '1px dashed #312e81',
        borderRadius: '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center',
    },
    modalFooter: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        paddingTop: '20px',
        borderTop: '1px solid #1e293b',
    },
    cancelButton: {
        padding: '10px 20px',
        fontSize: '13px',
        fontWeight: '600',
        color: '#94a3b8',
        backgroundColor: '#1e293b',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
    },
    submitButton: {
        padding: '10px 20px',
        fontSize: '13px',
        fontWeight: '600',
        color: '#f8fafc',
        backgroundColor: '#6366f1',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
    },

    modalBody: {
        padding: '24px 28px',
    },
    section: {
        marginBottom: '20px',
    },
    sectionTitle: {
        margin: '0 0 10px 0',
        fontSize: '11px',
        fontWeight: '700',
        color: '#475569',
        textTransform: 'uppercase',
        letterSpacing: '0.6px',
    },
    description: {
        margin: 0,
        fontSize: '14px',
        color: '#94a3b8',
        lineHeight: '1.7',
        whiteSpace: 'pre-wrap',
    },
    divider: {
        height: '1px',
        backgroundColor: '#1e293b',
        marginBottom: '20px',
    },
    optionsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    optionItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 14px',
        borderRadius: '10px',
        border: '1px solid',
    },
    optionCircle: {
        width: '30px',
        height: '30px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: '700',
        flexShrink: 0,
    },
    optionContent: {
        flex: 1,
        fontSize: '13px',
        color: '#cbd5e1',
    },
    correctLabel: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 10px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '700',
        backgroundColor: '#052e16',
        color: '#86efac',
        border: '1px solid #166534',
        flexShrink: 0,
    },
    infoGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
    },
    infoBox: {
        backgroundColor: '#020617',
        borderRadius: '10px',
        border: '1px solid #1e293b',
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    infoLabel: {
        fontSize: '11px',
        color: '#475569',
        textTransform: 'uppercase',
        letterSpacing: '0.4px',
        fontWeight: '600',
    },
    infoValue: {
        fontSize: '14px',
        fontWeight: '700',
        color: '#f1f5f9',
    },
};

export default DepartmentQuestions;