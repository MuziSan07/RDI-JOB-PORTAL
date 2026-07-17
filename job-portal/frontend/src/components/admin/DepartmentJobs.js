import React, { useState, useEffect } from 'react';
import DepartmentSidebar from './DepartmentSidebar';
import DepartmentNavbar from './DepartmentNavbar';
import Loader from '../common/Loader';
import { jobService } from '../../services/jobsService';
import { useResponsive } from '../../hooks/useResponsive';
import { getCurrencies, formatJobSalary, formatMoney } from '../../utils/currency';
import { Search, Plus, X, Briefcase, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

const DepartmentJobs = () => {
    const { isMobile, isCompact } = useResponsive();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        required_skills: '',
        job_type: 'onsite',
        selection_type: 'test',
        employment_type: 'FULL_TIME',
        salary_range: '',
        salary_currency: 'USD',
        salary_min: '',
        salary_max: '',
        salary_period: 'MONTH',
        location_city: '',
        location_country: '',
        vacancies: 1,
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchJobs();
    }, [searchTerm, statusFilter]);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const data = await jobService.getAllJobs(searchTerm, statusFilter);
            setJobs(data.results);
        } catch (err) {
            setError('Failed to load jobs');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            if (isEditing) {
                await jobService.updateJob(selectedJob.id, formData);
                setSuccess('Job updated successfully!');
            } else {
                await jobService.createJob(formData);
                setSuccess('Job created successfully!');
            }
            setShowModal(false);
            resetForm();
            fetchJobs();
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to save job');
        }
    };

    const handleEdit = (job) => {
        setSelectedJob(job);
        setFormData({
            title: job.title,
            description: job.description,
            required_skills: job.required_skills,
            job_type: job.job_type,
            selection_type: job.selection_type,
            employment_type: job.employment_type || 'FULL_TIME',
            salary_range: job.salary_range || '',
            salary_currency: job.salary_currency || 'USD',
            salary_min: job.salary_min ?? '',
            salary_max: job.salary_max ?? '',
            salary_period: job.salary_period || 'MONTH',
            location_city: job.location_city || '',
            location_country: job.location_country || '',
            vacancies: job.vacancies,
        });
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = async (jobId) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            try {
                await jobService.deleteJob(jobId);
                setSuccess('Job deleted successfully!');
                fetchJobs();
            } catch (err) {
                setError('Failed to delete job');
            }
        }
    };

    const handleStatusChange = async (jobId, newStatus) => {
        try {
            await jobService.updateJobStatus(jobId, newStatus);
            setSuccess(`Job ${newStatus === 'open' ? 'opened' : 'closed'} successfully!`);
            fetchJobs();
        } catch (err) {
            setError('Failed to update job status');
        }
    };

    const handleViewDetails = (job) => {
        setSelectedJob(job);
        setShowDetailModal(true);
    };

    const resetForm = () => {
        setFormData({ title: '', description: '', required_skills: '', job_type: 'onsite', selection_type: 'test', employment_type: 'FULL_TIME', salary_range: '', salary_currency: 'USD', salary_min: '', salary_max: '', salary_period: 'MONTH', location_city: '', location_country: '', vacancies: 1 });
        setIsEditing(false);
        setSelectedJob(null);
    };

    const getStatusBadge = (status) => status === 'open'
        ? { ...styles.badge, backgroundColor: '#052e16', color: '#86efac', border: '1px solid #166534' }
        : { ...styles.badge, backgroundColor: '#1c0a0a', color: '#fca5a5', border: '1px solid #7f1d1d' };

    const getJobTypeLabel = (type) => ({ onsite: 'On Site', remote: 'Remote', hybrid: 'Hybrid' })[type] || type;
    const getSelectionTypeLabel = (type) => ({ test: 'Test', interview: 'Interview', test_interview: 'Test + Interview' })[type] || type;

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
                            <h1 style={styles.welcomeText}>Jobs</h1>
                            <p style={styles.subText}>Manage your job postings</p>
                        </div>
                        <button onClick={() => { resetForm(); setShowModal(true); }} style={styles.createButton}>
                            <Plus size={14} color="#f8fafc" />
                            <span>Create Job</span>
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
                                placeholder="Search jobs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={styles.searchInput}
                            />
                        </div>
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={styles.select}>
                            <option value="">All Status</option>
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>

                    {/* Table */}
                    <div style={styles.tableContainer}>
                      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                        {jobs.length > 0 ? (
                            <table style={{ ...styles.table, minWidth: '900px' }}>
                                <thead>
                                    <tr>
                                        {['Job Title', 'Type', 'Selection', 'Status', 'Vacancies', 'Posted On', 'Actions'].map(h => (
                                            <th key={h} style={styles.th}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobs.map((job) => (
                                        <tr key={job.id} style={styles.tr}>
                                            <td style={styles.td}>
                                                <span style={styles.jobTitle}>{job.title}</span>
                                            </td>
                                            <td style={styles.td}>
                                                <span style={styles.typeBadge}>{getJobTypeLabel(job.job_type)}</span>
                                            </td>
                                            <td style={styles.td}>
                                                <span style={styles.typeBadge}>{getSelectionTypeLabel(job.selection_type)}</span>
                                            </td>
                                            <td style={styles.td}>
                                                <span style={getStatusBadge(job.status)}>{job.status.toUpperCase()}</span>
                                            </td>
                                            <td style={{ ...styles.td, color: '#818cf8', fontWeight: '600' }}>
                                                {job.filled_positions}/{job.vacancies}
                                            </td>
                                            <td style={{ ...styles.td, color: '#64748b' }}>
                                                {new Date(job.created_at).toLocaleDateString()}
                                            </td>
                                            <td style={styles.td}>
                                                <div style={styles.actionButtons}>
                                                    <button onClick={() => handleViewDetails(job)} style={styles.viewBtn} title="View">View</button>
                                                    <button onClick={() => handleEdit(job)} style={styles.editBtn} title="Edit">
                                                        <Pencil size={12} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(job.id, job.status === 'open' ? 'closed' : 'open')}
                                                        style={job.status === 'open' ? styles.closeBtn : styles.openBtn}
                                                        title={job.status === 'open' ? 'Close' : 'Open'}
                                                    >
                                                        {job.status === 'open' ? 'Close' : 'Open'}
                                                    </button>
                                                    <button onClick={() => handleDelete(job.id)} style={styles.deleteBtn} title="Delete">
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div style={styles.noData}>
                                <Briefcase size={32} color="#334155" />
                                <p style={{ color: '#475569', marginTop: '12px' }}>No jobs found. Create your first job posting!</p>
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
                            <h2 style={styles.modalTitle}>{isEditing ? 'Edit Job' : 'Create New Job'}</h2>
                            <button onClick={() => setShowModal(false)} style={styles.closeButton}><X size={18} color="#94a3b8" /></button>
                        </div>
                        <form onSubmit={handleSubmit} style={styles.form}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Job Title *</label>
                                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required style={styles.input} placeholder="e.g., Senior React Developer" />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Job Description *</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="5" style={styles.textarea} placeholder="Describe the role and responsibilities..." />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Required Skills *</label>
                                <textarea name="required_skills" value={formData.required_skills} onChange={handleInputChange} required rows="3" style={styles.textarea} placeholder="e.g., React, Node.js, Python..." />
                            </div>
                            <div style={{ ...styles.formRow, ...(isMobile ? { flexDirection: 'column', gap: 0 } : {}) }}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Job Type *</label>
                                    <select name="job_type" value={formData.job_type} onChange={handleInputChange} required style={styles.input}>
                                        <option value="onsite">On Site</option>
                                        <option value="remote">Remote</option>
                                        <option value="hybrid">Hybrid</option>
                                    </select>
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Selection Type *</label>
                                    <select name="selection_type" value={formData.selection_type} onChange={handleInputChange} required style={styles.input}>
                                        <option value="test">Test Only</option>
                                        <option value="interview">Interview Only</option>
                                        <option value="test_interview">Test + Interview</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ ...styles.formRow, ...(isMobile ? { flexDirection: 'column', gap: 0 } : {}) }}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Employment Type *</label>
                                    <select name="employment_type" value={formData.employment_type} onChange={handleInputChange} required style={styles.input}>
                                        <option value="FULL_TIME">Full-time</option>
                                        <option value="PART_TIME">Part-time</option>
                                        <option value="CONTRACTOR">Contract</option>
                                        <option value="TEMPORARY">Temporary</option>
                                        <option value="INTERN">Internship</option>
                                        <option value="VOLUNTEER">Volunteer</option>
                                    </select>
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Vacancies *</label>
                                    <input type="number" name="vacancies" value={formData.vacancies} onChange={handleInputChange} required min="1" style={styles.input} />
                                </div>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Salary Range (display text, optional)</label>
                                <input type="text" name="salary_range" value={formData.salary_range} onChange={handleInputChange} style={styles.input} placeholder={`e.g., ${formatMoney(50000, formData.salary_currency)} - ${formatMoney(80000, formData.salary_currency)}`} />
                            </div>
                            <div style={{ ...styles.formRow, ...(isMobile ? { flexDirection: 'column', gap: 0 } : {}) }}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Currency</label>
                                    <select name="salary_currency" value={formData.salary_currency} onChange={handleInputChange} style={styles.input}>
                                        {getCurrencies().map((c) => (
                                            <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Salary Min</label>
                                    <input type="number" name="salary_min" value={formData.salary_min} onChange={handleInputChange} min="0" step="0.01" style={styles.input} placeholder="e.g., 50000" />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Salary Max</label>
                                    <input type="number" name="salary_max" value={formData.salary_max} onChange={handleInputChange} min="0" step="0.01" style={styles.input} placeholder="e.g., 80000" />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Pay Period</label>
                                    <select name="salary_period" value={formData.salary_period} onChange={handleInputChange} style={styles.input}>
                                        <option value="HOUR">Per hour</option>
                                        <option value="DAY">Per day</option>
                                        <option value="WEEK">Per week</option>
                                        <option value="MONTH">Per month</option>
                                        <option value="YEAR">Per year</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ ...styles.formRow, ...(isMobile ? { flexDirection: 'column', gap: 0 } : {}) }}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Location City {formData.job_type !== 'remote' ? '' : '(ignored for remote)'}</label>
                                    <input type="text" name="location_city" value={formData.location_city} onChange={handleInputChange} style={styles.input} placeholder="e.g., Dubai" />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Location Country</label>
                                    <input type="text" name="location_country" value={formData.location_country} onChange={handleInputChange} style={styles.input} placeholder="e.g., UAE" />
                                </div>
                            </div>
                            <div style={styles.modalFooter}>
                                <button type="button" onClick={() => setShowModal(false)} style={styles.cancelButton}>Cancel</button>
                                <button type="submit" style={styles.submitButton}>{isEditing ? 'Update Job' : 'Create Job'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {showDetailModal && selectedJob && (
                <div style={styles.modalOverlay} onClick={() => setShowDetailModal(false)}>
                    <div style={{ ...styles.modal, ...(isMobile ? { width: '92vw' } : {}) }} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitle}>{selectedJob.title}</h2>
                            <button onClick={() => setShowDetailModal(false)} style={styles.closeButton}><X size={18} color="#94a3b8" /></button>
                        </div>
                        <div style={styles.modalBody}>
                            <div style={styles.badgesRow}>
                                <span style={getStatusBadge(selectedJob.status)}>{selectedJob.status.toUpperCase()}</span>
                                <span style={styles.infoBadge}>{getJobTypeLabel(selectedJob.job_type)}</span>
                                <span style={styles.infoBadge}>{getSelectionTypeLabel(selectedJob.selection_type)}</span>
                            </div>

                            <div style={styles.divider} />

                            <div style={styles.section}>
                                <h4 style={styles.sectionTitle}>Job Description</h4>
                                <p style={styles.description}>{selectedJob.description}</p>
                            </div>
                            <div style={styles.section}>
                                <h4 style={styles.sectionTitle}>Required Skills</h4>
                                <p style={styles.description}>{selectedJob.required_skills}</p>
                            </div>
                            <div style={styles.section}>
                                <h4 style={styles.sectionTitle}>Additional Information</h4>
                                <div style={{ ...styles.infoGrid, ...(isMobile ? { gridTemplateColumns: '1fr' } : {}) }}>
                                    <div style={styles.infoBox}>
                                        <span style={styles.infoLabel}>Salary Range</span>
                                        <span style={styles.infoValue}>{formatJobSalary(selectedJob) || 'Not specified'}</span>
                                    </div>
                                    <div style={styles.infoBox}>
                                        <span style={styles.infoLabel}>Vacancies</span>
                                        <span style={styles.infoValue}>{selectedJob.vacancies}</span>
                                    </div>
                                    <div style={styles.infoBox}>
                                        <span style={styles.infoLabel}>Filled Positions</span>
                                        <span style={styles.infoValue}>{selectedJob.filled_positions}</span>
                                    </div>
                                    <div style={styles.infoBox}>
                                        <span style={styles.infoLabel}>Posted On</span>
                                        <span style={styles.infoValue}>{new Date(selectedJob.created_at).toLocaleDateString()}</span>
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
        padding: '2px',
        opacity: 0.7,
    },

    // Filters
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
        minWidth: '150px',
    },

    // Table
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
    jobTitle: {
        fontWeight: '600',
        color: '#f1f5f9',
    },
    badge: {
        padding: '3px 10px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '700',
        display: 'inline-block',
    },
    typeBadge: {
        padding: '3px 10px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '600',
        backgroundColor: '#1e293b',
        color: '#94a3b8',
        display: 'inline-block',
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
        fontSize: '11px',
        fontWeight: '600',
        color: '#86efac',
        backgroundColor: '#052e16',
        border: '1px solid #166534',
        borderRadius: '6px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
    },
    closeBtn: {
        padding: '5px 10px',
        fontSize: '11px',
        fontWeight: '600',
        color: '#fed7aa',
        backgroundColor: '#1c0a00',
        border: '1px solid #9a3412',
        borderRadius: '6px',
        cursor: 'pointer',
    },
    openBtn: {
        padding: '5px 10px',
        fontSize: '11px',
        fontWeight: '600',
        color: '#86efac',
        backgroundColor: '#052e16',
        border: '1px solid #166534',
        borderRadius: '6px',
        cursor: 'pointer',
    },
    deleteBtn: {
        padding: '5px 8px',
        fontSize: '11px',
        fontWeight: '600',
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

    // Modal shared
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
        maxWidth: '700px',
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

    // Form
    form: {
        padding: '24px 28px',
    },
    formGroup: {
        marginBottom: '18px',
        flex: 1,
    },
    formRow: {
        display: 'flex',
        gap: '16px',
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

    // Detail modal body
    modalBody: {
        padding: '24px 28px',
    },
    badgesRow: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        marginBottom: '20px',
    },
    infoBadge: {
        padding: '3px 10px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '600',
        backgroundColor: '#1e293b',
        color: '#818cf8',
        border: '1px solid #312e81',
    },
    divider: {
        height: '1px',
        backgroundColor: '#1e293b',
        marginBottom: '20px',
    },
    section: {
        marginBottom: '22px',
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
        gridTemplateColumns: 'repeat(2, 1fr)',
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
};

export default DepartmentJobs;