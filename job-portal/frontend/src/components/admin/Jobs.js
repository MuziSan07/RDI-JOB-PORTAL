import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Loader from '../common/Loader';
import { jobService } from '../../services/jobsService';
import { useAuth } from '../../context/AuthContext';
import { useResponsive } from '../../hooks/useResponsive';
import { Search, X, Briefcase } from 'lucide-react';

const Jobs = () => {
    const { user } = useAuth();
    const { isMobile, isCompact } = useResponsive();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [jobTypeFilter, setJobTypeFilter] = useState('');
    const [selectionTypeFilter, setSelectionTypeFilter] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        fetchJobs();
    }, [searchTerm, statusFilter, jobTypeFilter, selectionTypeFilter]);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const data = await jobService.getAllJobs(searchTerm, statusFilter, jobTypeFilter, selectionTypeFilter);
            setJobs(data.results);
        } catch (err) {
            console.error('Failed to load jobs:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (job) => {
        setSelectedJob(job);
        setShowDetailModal(true);
    };

    const getStatusBadgeStyle = (status) => status === 'open'
        ? { ...styles.badge, backgroundColor: '#052e16', color: '#86efac', border: '1px solid #166534' }
        : { ...styles.badge, backgroundColor: '#1c0a0a', color: '#fca5a5', border: '1px solid #7f1d1d' };

    const getJobTypeLabel = (type) => ({ onsite: 'On Site', remote: 'Remote', hybrid: 'Hybrid' })[type] || type;
    const getSelectionTypeLabel = (type) => ({ test: 'Test', interview: 'Interview', test_interview: 'Test + Interview' })[type] || type;

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
                            <h1 style={styles.welcomeText}>Jobs</h1>
                            <p style={styles.subText}>
                                {user?.user_type === 'super_admin'
                                    ? 'View all jobs posted by departments'
                                    : 'Manage your job postings'}
                            </p>
                        </div>
                    </header>

                    {/* Filters */}
                    <div style={styles.filtersContainer}>
                        <div style={styles.searchWrapper}>
                            <Search size={15} color="#475569" style={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Search jobs by title, skills, or company..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={styles.searchInput}
                            />
                        </div>
                        <div style={{ ...styles.filterRow, ...(isMobile ? { gridTemplateColumns: '1fr' } : {}) }}>
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={styles.select}>
                                <option value="">All Status</option>
                                <option value="open">Open</option>
                                <option value="closed">Closed</option>
                            </select>
                            <select value={jobTypeFilter} onChange={(e) => setJobTypeFilter(e.target.value)} style={styles.select}>
                                <option value="">All Job Types</option>
                                <option value="onsite">On Site</option>
                                <option value="remote">Remote</option>
                                <option value="hybrid">Hybrid</option>
                            </select>
                            <select value={selectionTypeFilter} onChange={(e) => setSelectionTypeFilter(e.target.value)} style={styles.select}>
                                <option value="">All Selection Types</option>
                                <option value="test">Test</option>
                                <option value="interview">Interview</option>
                                <option value="test_interview">Test + Interview</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div style={styles.tableContainer}>
                        {jobs.length > 0 ? (
                            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                            <table style={{ ...styles.table, minWidth: '900px' }}>
                                <thead>
                                    <tr>
                                        {['Job Title', 'Company', 'Type', 'Selection', 'Status', 'Vacancies', 'Posted On', 'Actions'].map(h => (
                                            <th key={h} style={styles.th}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobs.map((job, index) => (
                                        <tr key={job.id} style={styles.tr}>
                                            <td style={styles.td}>
                                                <span style={styles.jobTitle}>{job.title}</span>
                                            </td>
                                            <td style={styles.td}>
                                                <div style={styles.companyCell}>
                                                    {job.department_logo ? (
                                                        <img src={job.department_logo} alt={job.department_name} style={styles.companyLogo} />
                                                    ) : (
                                                        <div style={{
                                                            ...styles.companyLogoPlaceholder,
                                                            backgroundColor: avatarColors[index % avatarColors.length] + '22',
                                                            color: avatarColors[index % avatarColors.length],
                                                        }}>
                                                            {job.department_name.charAt(0)}
                                                        </div>
                                                    )}
                                                    <span style={styles.companyName}>{job.department_name}</span>
                                                </div>
                                            </td>
                                            <td style={styles.td}>
                                                <span style={styles.typeBadge}>{getJobTypeLabel(job.job_type)}</span>
                                            </td>
                                            <td style={styles.td}>
                                                <span style={styles.typeBadge}>{getSelectionTypeLabel(job.selection_type)}</span>
                                            </td>
                                            <td style={styles.td}>
                                                <span style={getStatusBadgeStyle(job.status)}>
                                                    {job.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td style={styles.td}>
                                                <span style={styles.vacancyText}>{job.filled_positions}/{job.vacancies}</span>
                                            </td>
                                            <td style={{ ...styles.td, color: '#64748b' }}>
                                                {new Date(job.created_at).toLocaleDateString()}
                                            </td>
                                            <td style={styles.td}>
                                                <button onClick={() => handleViewDetails(job)} style={styles.viewButton}>
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            </div>
                        ) : (
                            <div style={styles.noData}>
                                <Briefcase size={32} color="#334155" />
                                <p style={{ color: '#475569', marginTop: '12px' }}>No jobs found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedJob && (
                <div style={styles.modalOverlay} onClick={() => setShowDetailModal(false)}>
                    <div style={{ ...styles.modal, ...(isMobile ? { width: '92vw' } : {}) }} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitle}>{selectedJob.title}</h2>
                            <button onClick={() => setShowDetailModal(false)} style={styles.closeButton}>
                                <X size={18} color="#94a3b8" />
                            </button>
                        </div>
                        <div style={styles.modalBody}>

                            {/* Company Info */}
                            <div style={styles.companyInfoRow}>
                                {selectedJob.department_logo ? (
                                    <img src={selectedJob.department_logo} alt={selectedJob.department_name} style={styles.modalLogo} />
                                ) : (
                                    <div style={{ ...styles.modalLogoPlaceholder, backgroundColor: '#6366f122', color: '#6366f1' }}>
                                        {selectedJob.department_name.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <h3 style={styles.modalCompanyName}>{selectedJob.department_name}</h3>
                                    <p style={styles.postedDate}>Posted on {new Date(selectedJob.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>

                            {/* Badges */}
                            <div style={styles.badgesRow}>
                                <span style={getStatusBadgeStyle(selectedJob.status)}>{selectedJob.status.toUpperCase()}</span>
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
                                        <span style={styles.infoValue}>{selectedJob.salary_range || 'Not specified'}</span>
                                    </div>
                                    <div style={styles.infoBox}>
                                        <span style={styles.infoLabel}>Vacancies</span>
                                        <span style={styles.infoValue}>{selectedJob.vacancies}</span>
                                    </div>
                                    <div style={styles.infoBox}>
                                        <span style={styles.infoLabel}>Filled Positions</span>
                                        <span style={styles.infoValue}>{selectedJob.filled_positions}</span>
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

    // Filters
    filtersContainer: {
        marginBottom: '24px',
    },
    searchWrapper: {
        position: 'relative',
        marginBottom: '14px',
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
    filterRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
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
        padding: '14px 18px',
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
        transition: 'background 0.15s',
    },
    td: {
        padding: '14px 18px',
        fontSize: '13px',
        color: '#cbd5e1',
        verticalAlign: 'middle',
    },
    jobTitle: {
        fontWeight: '600',
        color: '#f1f5f9',
    },
    companyCell: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    companyLogo: {
        width: '30px',
        height: '30px',
        borderRadius: '6px',
        objectFit: 'contain',
        flexShrink: 0,
    },
    companyLogoPlaceholder: {
        width: '30px',
        height: '30px',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '13px',
        fontWeight: '700',
        flexShrink: 0,
    },
    companyName: {
        color: '#cbd5e1',
        fontSize: '13px',
    },
    badge: {
        padding: '3px 10px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '700',
        display: 'inline-block',
        letterSpacing: '0.3px',
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
    vacancyText: {
        fontWeight: '600',
        color: '#818cf8',
    },
    viewButton: {
        padding: '7px 14px',
        fontSize: '12px',
        fontWeight: '600',
        color: '#f8fafc',
        backgroundColor: '#6366f1',
        border: 'none',
        borderRadius: '7px',
        cursor: 'pointer',
    },
    noData: {
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
    modalBody: {
        padding: '24px 28px',
    },
    companyInfoRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '18px',
    },
    modalLogo: {
        width: '56px',
        height: '56px',
        borderRadius: '10px',
        objectFit: 'contain',
        flexShrink: 0,
    },
    modalLogoPlaceholder: {
        width: '56px',
        height: '56px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '22px',
        fontWeight: '700',
        flexShrink: 0,
    },
    modalCompanyName: {
        margin: '0 0 4px 0',
        fontSize: '16px',
        fontWeight: '700',
        color: '#f1f5f9',
    },
    postedDate: {
        margin: 0,
        fontSize: '12px',
        color: '#64748b',
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
        fontSize: '12px',
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
};

export default Jobs;