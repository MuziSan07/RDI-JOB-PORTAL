import React, { useState, useEffect } from 'react';
import DepartmentSidebar from './DepartmentSidebar';
import DepartmentNavbar from './DepartmentNavbar';
import Loader from '../common/Loader';
import { testService } from '../../services/testService';
import { useResponsive } from '../../hooks/useResponsive';
import { Search, Plus, X, BookOpen, Pencil, Trash2, CheckCircle } from 'lucide-react';

const DepartmentChapters = () => {
    const { isMobile, isCompact } = useResponsive();
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', subtitle: '', description: '', image: null });
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => { fetchChapters(); }, [searchTerm]);

    const fetchChapters = async () => {
        try {
            setLoading(true);
            const data = await testService.getAllChapters(searchTerm);
            setChapters(data.results);
        } catch (err) {
            setError('Failed to load chapters');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        try {
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('subtitle', formData.subtitle);
            submitData.append('description', formData.description);
            if (formData.image && typeof formData.image !== 'string') submitData.append('image', formData.image);

            if (isEditing) {
                await testService.updateChapter(selectedChapter.id, submitData);
                setSuccess('Chapter updated successfully!');
            } else {
                await testService.createChapter(submitData);
                setSuccess('Chapter created successfully!');
            }
            setShowModal(false);
            resetForm();
            fetchChapters();
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to save chapter');
        }
    };

    const handleEdit = (chapter) => {
        setSelectedChapter(chapter);
        setFormData({ name: chapter.name, subtitle: chapter.subtitle || '', description: chapter.description, image: chapter.image });
        setImagePreview(chapter.image_url);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = async (chapterId) => {
        if (window.confirm('Delete this chapter? This will also delete all associated questions.')) {
            try {
                await testService.deleteChapter(chapterId);
                setSuccess('Chapter deleted successfully!');
                fetchChapters();
            } catch (err) {
                setError('Failed to delete chapter');
            }
        }
    };

    const handleViewDetails = async (chapter) => {
        try {
            const detailData = await testService.getChapterById(chapter.id);
            setSelectedChapter(detailData);
            setShowDetailModal(true);
        } catch (err) {
            setError('Failed to load chapter details');
        }
    };

    const resetForm = () => {
        setFormData({ name: '', subtitle: '', description: '', image: null });
        setImagePreview(null);
        setIsEditing(false);
        setSelectedChapter(null);
    };

    const avatarColors = ['#6366f1', '#a855f7', '#10b981', '#fbbf24', '#f472b6', '#38bdf8'];

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
                            <h1 style={styles.welcomeText}>Test Chapters</h1>
                            <p style={styles.subText}>Manage your test chapters and questions</p>
                        </div>
                        <button onClick={() => { resetForm(); setShowModal(true); }} style={styles.createButton}>
                            <Plus size={14} color="#f8fafc" />
                            <span>Create Chapter</span>
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

                    {/* Search */}
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

                    {/* Cards Grid */}
                    <div style={styles.cardsGrid}>
                        {chapters.length > 0 ? chapters.map((chapter, index) => (
                            <div key={chapter.id} style={styles.card}>
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
                                    {chapter.subtitle && <p style={styles.cardSubtitle}>{chapter.subtitle}</p>}
                                    <p style={styles.cardDescription}>
                                        {chapter.description.length > 100
                                            ? `${chapter.description.substring(0, 100)}...`
                                            : chapter.description}
                                    </p>

                                    <div style={styles.divider} />

                                    <div style={styles.statsRow}>
                                        <div style={styles.statBox}>
                                            <span style={styles.statLabel}>Questions</span>
                                            <span style={{ ...styles.statValue, color: avatarColors[index % avatarColors.length] }}>
                                                {chapter.questions_count}
                                            </span>
                                        </div>
                                        <div style={styles.statBox}>
                                            <span style={styles.statLabel}>Created</span>
                                            <span style={styles.statValue}>{new Date(chapter.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div style={styles.actionButtons}>
                                        <button onClick={() => handleViewDetails(chapter)} style={styles.viewButton}>View Details</button>
                                        <button onClick={() => handleEdit(chapter)} style={styles.editButton}>
                                            <Pencil size={13} />
                                        </button>
                                        <button onClick={() => handleDelete(chapter.id)} style={styles.deleteButton}>
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div style={styles.noData}>
                                <BookOpen size={32} color="#334155" />
                                <p style={{ color: '#475569', marginTop: '12px' }}>No chapters found. Create your first test chapter!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create / Edit Modal */}
            {showModal && (
                <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div style={{ ...styles.modal, ...(isMobile ? { width: '92vw' } : {}) }} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitle}>{isEditing ? 'Edit Chapter' : 'Create New Chapter'}</h2>
                            <button onClick={() => setShowModal(false)} style={styles.closeButton}><X size={18} color="#94a3b8" /></button>
                        </div>
                        <form onSubmit={handleSubmit} style={styles.form}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Chapter Name *</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={styles.input} placeholder="e.g., JavaScript Fundamentals" />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Subtitle (Optional)</label>
                                <input type="text" name="subtitle" value={formData.subtitle} onChange={handleInputChange} style={styles.input} placeholder="e.g., Basic concepts and syntax" />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Description *</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="5" style={styles.textarea} placeholder="Describe what this chapter covers..." />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Chapter Image (Optional)</label>
                                <input type="file" accept="image/*" onChange={handleImageChange} style={styles.fileInput} />
                                {imagePreview && (
                                    <div style={styles.imagePreviewContainer}>
                                        <img src={imagePreview} alt="Preview" style={styles.imagePreview} />
                                    </div>
                                )}
                            </div>
                            <div style={styles.modalFooter}>
                                <button type="button" onClick={() => setShowModal(false)} style={styles.cancelButton}>Cancel</button>
                                <button type="submit" style={styles.submitButton}>{isEditing ? 'Update Chapter' : 'Create Chapter'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {showDetailModal && selectedChapter && (
                <div style={styles.modalOverlay} onClick={() => setShowDetailModal(false)}>
                    <div style={{ ...styles.modal, ...(isMobile ? { width: '92vw' } : {}) }} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitle}>{selectedChapter.name}</h2>
                            <button onClick={() => setShowDetailModal(false)} style={styles.closeButton}><X size={18} color="#94a3b8" /></button>
                        </div>
                        <div style={styles.modalBody}>
                            {selectedChapter.image_url && (
                                <div style={styles.detailImageContainer}>
                                    <img src={selectedChapter.image_url} alt={selectedChapter.name} style={styles.detailImage} />
                                </div>
                            )}

                            {selectedChapter.subtitle && (
                                <div style={styles.section}>
                                    <h4 style={styles.sectionTitle}>Subtitle</h4>
                                    <p style={styles.description}>{selectedChapter.subtitle}</p>
                                </div>
                            )}

                            <div style={styles.section}>
                                <h4 style={styles.sectionTitle}>Description</h4>
                                <p style={styles.description}>{selectedChapter.description}</p>
                            </div>

                            <div style={styles.divider} />

                            <div style={styles.section}>
                                <h4 style={styles.sectionTitle}>Statistics</h4>
                                <div style={{ ...styles.infoGrid, ...(isMobile ? { gridTemplateColumns: '1fr' } : {}) }}>
                                    <div style={styles.infoBox}>
                                        <span style={styles.infoLabel}>Total Questions</span>
                                        <span style={{ ...styles.infoValue, color: '#818cf8' }}>{selectedChapter.questions_count}</span>
                                    </div>
                                    <div style={styles.infoBox}>
                                        <span style={styles.infoLabel}>Created On</span>
                                        <span style={styles.infoValue}>{new Date(selectedChapter.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div style={styles.infoBox}>
                                        <span style={styles.infoLabel}>Last Updated</span>
                                        <span style={styles.infoValue}>{new Date(selectedChapter.updated_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            {selectedChapter.questions && selectedChapter.questions.length > 0 && (
                                <div style={styles.section}>
                                    <h4 style={styles.sectionTitle}>Questions ({selectedChapter.questions.length})</h4>
                                    <div style={styles.questionsList}>
                                        {selectedChapter.questions.map((question, index) => (
                                            <div key={question.id} style={styles.questionItem}>
                                                <span style={styles.qNum}>Q{index + 1}</span>
                                                <div style={styles.qContent}>
                                                    <p style={styles.qText}>{question.question_text}</p>
                                                    <div style={styles.questionMeta}>
                                                        <span style={styles.metaPill}>{question.options_count} options</span>
                                                        <span style={styles.correctPill}>
                                                            <CheckCircle size={10} style={{ marginRight: '3px' }} />
                                                            {question.correct_answers_count} correct
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
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

    searchWrapper: {
        position: 'relative',
        marginBottom: '28px',
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

    cardsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '20px',
    },
    card: {
        backgroundColor: '#0f172a',
        borderRadius: '16px',
        border: '1px solid #1e293b',
        overflow: 'hidden',
    },
    cardImageWrapper: {
        height: '155px',
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
        width: '72px',
        height: '72px',
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '32px',
        fontWeight: '800',
    },
    cardBody: {
        padding: '20px',
    },
    cardTitle: {
        margin: '0 0 5px 0',
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
        margin: '0 0 14px 0',
        fontSize: '13px',
        color: '#64748b',
        lineHeight: '1.6',
    },
    divider: {
        height: '1px',
        backgroundColor: '#1e293b',
        marginBottom: '14px',
    },
    statsRow: {
        display: 'flex',
        gap: '10px',
        marginBottom: '16px',
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
    actionButtons: {
        display: 'flex',
        gap: '8px',
    },
    viewButton: {
        flex: 1,
        padding: '9px 12px',
        fontSize: '12px',
        fontWeight: '600',
        color: '#f8fafc',
        backgroundColor: '#6366f1',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
    },
    editButton: {
        padding: '9px 12px',
        fontSize: '12px',
        fontWeight: '600',
        color: '#86efac',
        backgroundColor: '#052e16',
        border: '1px solid #166534',
        borderRadius: '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteButton: {
        padding: '9px 12px',
        fontSize: '12px',
        fontWeight: '600',
        color: '#fca5a5',
        backgroundColor: '#1c0a0a',
        border: '1px solid #7f1d1d',
        borderRadius: '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    noData: {
        gridColumn: '1 / -1',
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
        maxWidth: '660px',
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
        marginBottom: '18px',
    },
    label: {
        display: 'block',
        marginBottom: '7px',
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
    fileInput: {
        width: '100%',
        padding: '8px',
        fontSize: '13px',
        backgroundColor: '#020617',
        border: '1px solid #1e293b',
        borderRadius: '8px',
        color: '#94a3b8',
        boxSizing: 'border-box',
    },
    imagePreviewContainer: {
        marginTop: '14px',
        textAlign: 'center',
    },
    imagePreview: {
        maxWidth: '100%',
        maxHeight: '180px',
        borderRadius: '10px',
        border: '1px solid #1e293b',
        objectFit: 'cover',
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
    detailImageContainer: {
        marginBottom: '20px',
        textAlign: 'center',
    },
    detailImage: {
        maxWidth: '100%',
        maxHeight: '240px',
        borderRadius: '12px',
        objectFit: 'cover',
        border: '1px solid #1e293b',
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
    infoGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
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
        fontSize: '15px',
        fontWeight: '700',
        color: '#f1f5f9',
    },
    questionsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    questionItem: {
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
        padding: '14px 16px',
        backgroundColor: '#020617',
        borderRadius: '10px',
        border: '1px solid #1e293b',
    },
    qNum: {
        fontSize: '11px',
        fontWeight: '700',
        color: '#6366f1',
        backgroundColor: '#1e1b4b',
        padding: '3px 8px',
        borderRadius: '6px',
        flexShrink: 0,
        marginTop: '1px',
    },
    qContent: {
        flex: 1,
    },
    qText: {
        margin: '0 0 8px 0',
        fontSize: '13px',
        color: '#cbd5e1',
        lineHeight: '1.5',
    },
    questionMeta: {
        display: 'flex',
        gap: '8px',
    },
    metaPill: {
        fontSize: '11px',
        padding: '2px 8px',
        borderRadius: '20px',
        backgroundColor: '#1e293b',
        color: '#94a3b8',
        fontWeight: '600',
    },
    correctPill: {
        fontSize: '11px',
        padding: '2px 8px',
        borderRadius: '20px',
        backgroundColor: '#052e16',
        color: '#86efac',
        border: '1px solid #166534',
        fontWeight: '600',
        display: 'inline-flex',
        alignItems: 'center',
    },
};

export default DepartmentChapters;