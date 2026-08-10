import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Loader from '../common/Loader';
import { departmentService } from '../../services/departmentService';
import { useResponsive } from '../../hooks/useResponsive';
import { Building2, Search, Plus, X, Mail, User, Calendar, Pencil } from 'lucide-react';
import PasswordInput from '../common/PasswordInput';

const Departments = () => {
    const { isMobile, isCompact } = useResponsive();
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);   // null = create, id = edit
    const [formData, setFormData] = useState({
        name: '',
        tagline: '',
        bio: '',
        ceo_name: '',
        email: '',
        password: '',
        logo: null,
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Sync the search box when arrived-at via the navbar search (?search=).
    useEffect(() => { setSearchTerm(searchParams.get('search') || ''); }, [searchParams]);

        useEffect(() => {
        fetchDepartments();
    }, [searchTerm]);

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const data = await departmentService.getAllDepartments(searchTerm);
            setDepartments(data.results);
        } catch (err) {
            setError('Failed to load departments');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, logo: e.target.files[0] });
    };

    const emptyForm = { name: '', tagline: '', bio: '', ceo_name: '', email: '', password: '', logo: null };

    const openCreate = () => {
        setEditingId(null);
        setFormData(emptyForm);
        setError('');
        setShowModal(true);
    };

    const handleEdit = (dept) => {
        setEditingId(dept.id);
        setFormData({
            name: dept.name || '',
            tagline: dept.tagline || '',
            bio: dept.bio || '',
            ceo_name: dept.ceo_name || '',
            email: dept.email || '',
            password: '',
            logo: null,   // only sent if a new file is chosen
        });
        setError('');
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const data = new FormData();
        data.append('name', formData.name);
        data.append('tagline', formData.tagline);
        data.append('bio', formData.bio);
        data.append('ceo_name', formData.ceo_name);
        data.append('email', formData.email);
        if (formData.logo) data.append('logo', formData.logo);

        try {
            if (editingId) {
                await departmentService.updateDepartment(editingId, data);
                setSuccess('Department updated successfully!');
            } else {
                data.append('password', formData.password);
                await departmentService.createDepartment(data);
                setSuccess('Department created successfully!');
            }
            setShowModal(false);
            setEditingId(null);
            setFormData(emptyForm);
            fetchDepartments();
        } catch (err) {
            setError(
                err.response?.data?.email?.[0] ||
                err.response?.data?.error ||
                `Failed to ${editingId ? 'update' : 'create'} department`
            );
        }
    };

    if (loading) return <Loader />;

    const avatarColors = ['#6366f1', '#a855f7', '#10b981', '#fbbf24', '#f472b6', '#38bdf8'];

    return (
        <div style={styles.container}>
            <Sidebar />
            <div style={{ ...styles.mainContent, ...(isCompact ? { marginLeft: 0 } : {}) }}>
                <Navbar />
                <div style={{ ...styles.scrollArea, ...(isMobile ? { padding: '90px 16px 24px 16px' } : {}) }}>

                    {/* Header */}
                    <header style={{ ...styles.dashboardHeader, ...(isMobile ? { flexDirection: 'column', alignItems: 'stretch', gap: '16px', flexWrap: 'wrap' } : {}) }}>
                        <div>
                            <h1 style={styles.welcomeText}>Departments</h1>
                            <p style={styles.subText}>Manage all company departments</p>
                        </div>
                        <button onClick={openCreate} style={{ ...styles.createButton, ...(isMobile ? { justifyContent: 'center' } : {}) }}>
                            <Plus size={14} color="#f8fafc" />
                            <span>Create Department</span>
                        </button>
                    </header>

                    {/* Alerts */}
                    {success && (
                        <div style={styles.successAlert}>{success}</div>
                    )}
                    {error && (
                        <div style={styles.errorAlert}>{error}</div>
                    )}

                    {/* Search */}
                    <div style={styles.searchWrapper}>
                        <Search size={15} color="#475569" style={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search departments by name, CEO, email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={styles.searchInput}
                        />
                    </div>

                    {/* Cards Grid */}
                    <div style={styles.cardsGrid}>
                        {departments.length > 0 ? departments.map((dept, index) => (
                            <div key={dept.id} style={styles.card}>
                                <div style={styles.cardTop}>
                                    {dept.logo_url ? (
                                        <img src={dept.logo_url} alt={dept.name} style={styles.logo} />
                                    ) : (
                                        <div style={{
                                            ...styles.logoPlaceholder,
                                            backgroundColor: avatarColors[index % avatarColors.length] + '22',
                                            border: `1px solid ${avatarColors[index % avatarColors.length]}44`,
                                            color: avatarColors[index % avatarColors.length],
                                        }}>
                                            {dept.name.charAt(0)}
                                        </div>
                                    )}
                                    <div style={styles.cardMeta}>
                                        <h3 style={styles.cardTitle}>{dept.name}</h3>
                                        {dept.tagline && <p style={styles.cardTagline}>{dept.tagline}</p>}
                                    </div>
                                    <button onClick={() => handleEdit(dept)} style={styles.editButton} title="Edit department">
                                        <Pencil size={15} color="#818cf8" />
                                    </button>
                                </div>

                                <div style={styles.divider} />

                                <div style={styles.cardBody}>
                                    <div style={styles.infoRow}>
                                        <User size={13} color="#475569" />
                                        <span style={styles.infoLabel}>CEO</span>
                                        <span style={styles.infoValue}>{dept.ceo_name}</span>
                                    </div>
                                    <div style={styles.infoRow}>
                                        <Mail size={13} color="#475569" />
                                        <span style={styles.infoLabel}>Email</span>
                                        <span style={styles.infoValue}>{dept.email}</span>
                                    </div>
                                    <div style={styles.infoRow}>
                                        <Calendar size={13} color="#475569" />
                                        <span style={styles.infoLabel}>Created</span>
                                        <span style={styles.infoValue}>{new Date(dept.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div style={styles.noData}>
                                <Building2 size={32} color="#334155" />
                                <p style={{ color: '#475569', marginTop: '12px' }}>No departments found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div style={{ ...styles.modal, ...(isMobile ? { width: '92vw' } : {}) }} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitle}>{editingId ? 'Edit Department' : 'Create New Department'}</h2>
                            <button onClick={() => setShowModal(false)} style={styles.closeButton}>
                                <X size={18} color="#94a3b8" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={styles.form}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Company Logo {editingId ? '(leave empty to keep current)' : ''}</label>
                                <input type="file" accept="image/*" onChange={handleFileChange} style={styles.fileInput} />
                            </div>
                            <div style={{ ...styles.formRow, ...(isMobile ? { gridTemplateColumns: '1fr' } : {}) }}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Company Name *</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={styles.input} placeholder="Enter company name" />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Tagline</label>
                                    <input type="text" name="tagline" value={formData.tagline} onChange={handleInputChange} style={styles.input} placeholder="Enter tagline" />
                                </div>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Bio *</label>
                                <textarea name="bio" value={formData.bio} onChange={handleInputChange} required rows="3" style={styles.textarea} placeholder="Enter company bio" />
                            </div>
                            <div style={{ ...styles.formRow, ...(isMobile ? { gridTemplateColumns: '1fr' } : {}) }}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>CEO Name *</label>
                                    <input type="text" name="ceo_name" value={formData.ceo_name} onChange={handleInputChange} required style={styles.input} placeholder="CEO name" />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Email *</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required style={styles.input} placeholder="Company email" />
                                </div>
                            </div>
                            {!editingId && (
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Password *</label>
                                    <PasswordInput name="password" value={formData.password} onChange={handleInputChange} required minLength="8" style={styles.input} placeholder="Min 8 characters" iconColor="#64748b" />
                                </div>
                            )}

                            <div style={styles.modalFooter}>
                                <button type="button" onClick={() => setShowModal(false)} style={styles.cancelButton}>Cancel</button>
                                <button type="submit" style={styles.submitButton}>{editingId ? 'Save Changes' : 'Create Department'}</button>
                            </div>
                        </form>
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

    // Alerts
    successAlert: {
        backgroundColor: '#052e16',
        border: '1px solid #166534',
        borderRadius: '10px',
        padding: '12px 16px',
        marginBottom: '20px',
        color: '#86efac',
        fontSize: '13px',
    },
    errorAlert: {
        backgroundColor: '#1c0a0a',
        border: '1px solid #7f1d1d',
        borderRadius: '10px',
        padding: '12px 16px',
        marginBottom: '20px',
        color: '#fca5a5',
        fontSize: '13px',
    },

    // Search
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

    // Cards
    cardsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
    },
    card: {
        backgroundColor: '#0f172a',
        borderRadius: '16px',
        border: '1px solid #1e293b',
        overflow: 'hidden',
        transition: 'border-color 0.2s, transform 0.2s',
    },
    cardTop: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '22px 22px 18px 22px',
    },
    logo: {
        width: '52px',
        height: '52px',
        objectFit: 'contain',
        borderRadius: '10px',
        flexShrink: 0,
    },
    logoPlaceholder: {
        width: '52px',
        height: '52px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '22px',
        fontWeight: '700',
        flexShrink: 0,
    },
    cardMeta: {
        flex: 1,
        minWidth: 0,
    },
    editButton: {
        flexShrink: 0,
        width: '34px',
        height: '34px',
        borderRadius: '9px',
        border: '1px solid #1e293b',
        backgroundColor: '#0b1220',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
    },
    cardTitle: {
        margin: '0 0 4px 0',
        fontSize: '15px',
        fontWeight: '700',
        color: '#f1f5f9',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    cardTagline: {
        margin: 0,
        fontSize: '12px',
        color: '#64748b',
        fontStyle: 'italic',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    divider: {
        height: '1px',
        backgroundColor: '#1e293b',
        margin: '0 22px',
    },
    cardBody: {
        padding: '16px 22px 20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    infoRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    infoLabel: {
        fontSize: '12px',
        color: '#475569',
        width: '48px',
        flexShrink: 0,
        textTransform: 'uppercase',
        letterSpacing: '0.4px',
    },
    infoValue: {
        fontSize: '13px',
        color: '#cbd5e1',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
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
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
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
        maxWidth: '620px',
        maxHeight: '90vh',
        overflow: 'auto',
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px 28px',
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
    formRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
    },
    formGroup: {
        marginBottom: '18px',
    },
    label: {
        display: 'block',
        marginBottom: '7px',
        fontSize: '12px',
        fontWeight: '600',
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
    modalFooter: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        marginTop: '8px',
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
};

export default Departments;