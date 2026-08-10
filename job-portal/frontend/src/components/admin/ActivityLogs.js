import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Loader from '../common/Loader';
import { activityService } from '../../services/activityService';
import { useAuth } from '../../context/AuthContext';
import { useResponsive } from '../../hooks/useResponsive';
import { Search, Trash2, Activity, ChevronLeft, ChevronRight, X } from 'lucide-react';

const ActivityLogs = () => {
    const { user } = useAuth();
    const { isMobile, isTablet, isCompact } = useResponsive();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [userTypeFilter, setUserTypeFilter] = useState('');
    const [actionFilter, setActionFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [uniqueActions, setUniqueActions] = useState([]);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const pageSize = 50;

    useEffect(() => {
        fetchLogs();
    }, [searchTerm, userTypeFilter, actionFilter, startDate, endDate, currentPage]);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const data = await activityService.getActivityLogs(
                currentPage, pageSize, searchTerm, userTypeFilter, actionFilter, startDate, endDate
            );
            setLogs(data.results);
            setTotalPages(data.total_pages);
            setTotalCount(data.count);
            setUniqueActions(data.unique_actions);
        } catch (err) {
            console.error('Failed to load activity logs:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleClearLogs = async () => {
        try {
            await activityService.clearActivityLogs();
            setShowClearConfirm(false);
            fetchLogs();
        } catch (err) {
            console.error('Failed to clear logs:', err);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
    };

    const getUserTypeBadge = (userType) => {
        const map = {
            super_admin: { bg: '#1e1b4b', color: '#818cf8', border: '#312e81', label: 'Super Admin' },
            department:  { bg: '#2e1065', color: '#c084fc', border: '#4c1d95', label: 'Department' },
            job_seeker:  { bg: '#052e16', color: '#86efac', border: '#166534', label: 'Job Seeker' },
        };
        const s = map[userType] || { bg: '#1e293b', color: '#94a3b8', border: '#334155', label: userType };
        return (
            <span style={{
                padding: '3px 10px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '700',
                backgroundColor: s.bg,
                color: s.color,
                border: `1px solid ${s.border}`,
                display: 'inline-block',
            }}>
                {s.label}
            </span>
        );
    };

    if (loading && currentPage === 1) return <Loader />;

    return (
        <div style={styles.container}>
            <Sidebar />
            <div style={{ ...styles.mainContent, ...(isCompact ? { marginLeft: 0 } : {}) }}>
                <Navbar />
                <div style={{ ...styles.scrollArea, ...(isMobile ? { padding: '90px 16px 24px 16px' } : {}) }}>

                    {/* Header */}
                    <header style={{ ...styles.dashboardHeader, ...(isMobile ? { flexDirection: 'column', alignItems: 'stretch', gap: '16px', flexWrap: 'wrap' } : {}) }}>
                        <div>
                            <h1 style={styles.welcomeText}>Activity Logs</h1>
                            <p style={styles.subText}>
                                {user?.user_type === 'super_admin'
                                    ? 'View all platform activities'
                                    : 'View your activity history'}
                            </p>
                        </div>
                        {user?.user_type === 'super_admin' && (
                            <button onClick={() => setShowClearConfirm(true)} style={{ ...styles.clearButton, ...(isMobile ? { justifyContent: 'center' } : {}) }}>
                                <Trash2 size={14} color="#fca5a5" />
                                <span>Clear All Logs</span>
                            </button>
                        )}
                    </header>

                    {/* Stats */}
                    <div style={{ ...styles.statsRow, ...(isMobile ? { gridTemplateColumns: '1fr' } : isTablet ? { gridTemplateColumns: 'repeat(2, 1fr)' } : {}) }}>
                        <div style={styles.statCard}>
                            <span style={styles.statLabel}>Total Logs</span>
                            <span style={styles.statValue}>{totalCount.toLocaleString()}</span>
                        </div>
                        <div style={styles.statCard}>
                            <span style={styles.statLabel}>Current Page</span>
                            <span style={styles.statValue}>{currentPage} / {totalPages}</span>
                        </div>
                        <div style={styles.statCard}>
                            <span style={styles.statLabel}>Showing</span>
                            <span style={styles.statValue}>{logs.length} logs</span>
                        </div>
                    </div>

                    {/* Filters */}
                    <div style={styles.filtersContainer}>
                        <div style={styles.searchWrapper}>
                            <Search size={15} color="#475569" style={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Search by user, action, or details..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                style={styles.searchInput}
                            />
                        </div>
                        <div style={styles.filterRow}>
                            {user?.user_type === 'super_admin' && (
                                <select value={userTypeFilter} onChange={(e) => { setUserTypeFilter(e.target.value); setCurrentPage(1); }} style={styles.select}>
                                    <option value="">All User Types</option>
                                    <option value="super_admin">Super Admin</option>
                                    <option value="department">Department</option>
                                    <option value="job_seeker">Job Seeker</option>
                                </select>
                            )}
                            <select value={actionFilter} onChange={(e) => { setActionFilter(e.target.value); setCurrentPage(1); }} style={styles.select}>
                                <option value="">All Actions</option>
                                {uniqueActions.map((action) => (
                                    <option key={action} value={action}>{action}</option>
                                ))}
                            </select>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
                                style={styles.dateInput}
                            />
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
                                style={styles.dateInput}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div style={styles.tableContainer}>
                        {logs.length > 0 ? (
                            <>
                                <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                                <table style={{ ...styles.table, minWidth: '900px' }}>
                                    <thead>
                                        <tr>
                                            {['Timestamp', 'User', 'User Type', 'Action', 'Details', 'IP Address'].map(h => (
                                                <th key={h} style={styles.th}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logs.map((log) => (
                                            <tr key={log.id} style={styles.tr}>
                                                <td style={styles.td}>
                                                    <div style={styles.dateText}>
                                                        {new Date(log.timestamp).toLocaleDateString()}
                                                    </div>
                                                    <div style={styles.timeText}>
                                                        {new Date(log.timestamp).toLocaleTimeString()}
                                                    </div>
                                                </td>
                                                <td style={{ ...styles.td, fontWeight: '600', color: '#f1f5f9' }}>
                                                    {log.user_username || 'Unknown'}
                                                </td>
                                                <td style={styles.td}>
                                                    {getUserTypeBadge(log.user_type)}
                                                </td>
                                                <td style={styles.td}>
                                                    <span style={styles.actionText}>{log.action}</span>
                                                </td>
                                                <td style={styles.td}>
                                                    <div style={styles.detailsText}>{log.details || '—'}</div>
                                                </td>
                                                <td style={styles.td}>
                                                    <code style={styles.ipAddress}>{log.ip_address || '—'}</code>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                </div>

                                {/* Pagination */}
                                <div style={styles.pagination}>
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        style={{ ...styles.pageBtn, opacity: currentPage === 1 ? 0.4 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                                    >
                                        <ChevronLeft size={15} />
                                        <span>Previous</span>
                                    </button>
                                    <span style={styles.pageInfo}>Page {currentPage} of {totalPages}</span>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        style={{ ...styles.pageBtn, opacity: currentPage === totalPages ? 0.4 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                                    >
                                        <span>Next</span>
                                        <ChevronRight size={15} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div style={styles.noData}>
                                <Activity size={32} color="#334155" />
                                <p style={{ color: '#475569', marginTop: '12px' }}>No activity logs found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Clear Confirm Modal */}
            {showClearConfirm && (
                <div style={styles.modalOverlay} onClick={() => setShowClearConfirm(false)}>
                    <div style={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.confirmIconWrap}>
                            <Trash2 size={22} color="#f87171" />
                        </div>
                        <h3 style={styles.confirmTitle}>Clear All Activity Logs?</h3>
                        <p style={styles.confirmText}>
                            This will permanently delete all {totalCount.toLocaleString()} activity log entries. This action cannot be undone.
                        </p>
                        <div style={styles.confirmButtons}>
                            <button onClick={() => setShowClearConfirm(false)} style={styles.cancelButton}>Cancel</button>
                            <button onClick={handleClearLogs} style={styles.deleteButton}>Clear All Logs</button>
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
    clearButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#1c0a0a',
        border: '1px solid #7f1d1d',
        padding: '10px 16px',
        borderRadius: '10px',
        color: '#fca5a5',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
    },

    // Stats
    statsRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        marginBottom: '28px',
    },
    statCard: {
        backgroundColor: '#0f172a',
        border: '1px solid #1e293b',
        borderRadius: '14px',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    statLabel: {
        fontSize: '11px',
        color: '#475569',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    statValue: {
        fontSize: '24px',
        fontWeight: '800',
        color: '#f1f5f9',
    },

    // Filters
    filtersContainer: {
        marginBottom: '24px',
    },
    searchWrapper: {
        position: 'relative',
        marginBottom: '12px',
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
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
    dateInput: {
        padding: '10px 14px',
        fontSize: '13px',
        backgroundColor: '#0f172a',
        border: '1px solid #1e293b',
        borderRadius: '10px',
        color: '#cbd5e1',
        outline: 'none',
        colorScheme: 'dark',
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
        whiteSpace: 'nowrap',
    },
    tr: {
        borderBottom: '1px solid #1e293b',
    },
    td: {
        padding: '13px 18px',
        fontSize: '13px',
        color: '#94a3b8',
        verticalAlign: 'middle',
    },
    dateText: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#cbd5e1',
    },
    timeText: {
        fontSize: '11px',
        color: '#475569',
        marginTop: '2px',
    },
    actionText: {
        fontWeight: '600',
        color: '#818cf8',
        fontSize: '12px',
    },
    detailsText: {
        maxWidth: '280px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        color: '#64748b',
        fontSize: '12px',
    },
    ipAddress: {
        fontSize: '11px',
        padding: '3px 8px',
        backgroundColor: '#020617',
        border: '1px solid #1e293b',
        borderRadius: '6px',
        color: '#64748b',
        fontFamily: 'monospace',
    },

    // Pagination
    pagination: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        borderTop: '1px solid #1e293b',
    },
    pageBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 16px',
        fontSize: '13px',
        fontWeight: '600',
        color: '#f8fafc',
        backgroundColor: '#6366f1',
        border: 'none',
        borderRadius: '8px',
    },
    pageInfo: {
        fontSize: '13px',
        color: '#64748b',
        fontWeight: '500',
    },
    noData: {
        textAlign: 'center',
        padding: '80px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },

    // Confirm Modal
    modalOverlay: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.75)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    confirmModal: {
        backgroundColor: '#0f172a',
        border: '1px solid #7f1d1d',
        borderRadius: '16px',
        padding: '32px',
        width: '90%',
        maxWidth: '460px',
        textAlign: 'center',
    },
    confirmIconWrap: {
        width: '52px',
        height: '52px',
        borderRadius: '50%',
        backgroundColor: '#1c0a0a',
        border: '1px solid #7f1d1d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px auto',
    },
    confirmTitle: {
        margin: '0 0 12px 0',
        fontSize: '18px',
        fontWeight: '700',
        color: '#f1f5f9',
    },
    confirmText: {
        margin: '0 0 28px 0',
        fontSize: '14px',
        color: '#64748b',
        lineHeight: '1.6',
    },
    confirmButtons: {
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
    },
    cancelButton: {
        padding: '10px 22px',
        fontSize: '13px',
        fontWeight: '600',
        color: '#94a3b8',
        backgroundColor: '#1e293b',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
    },
    deleteButton: {
        padding: '10px 22px',
        fontSize: '13px',
        fontWeight: '600',
        color: '#fca5a5',
        backgroundColor: '#1c0a0a',
        border: '1px solid #7f1d1d',
        borderRadius: '8px',
        cursor: 'pointer',
    },
};

export default ActivityLogs;