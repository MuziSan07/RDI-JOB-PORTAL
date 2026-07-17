import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Loader from '../common/Loader';
import { employeeService } from '../../services/employeeService';
import { departmentService } from '../../services/departmentService';
import { formatMoney } from '../../utils/currency';
import { useAuth } from '../../context/AuthContext';
import { useResponsive } from '../../hooks/useResponsive';
import { Search, X, Users } from 'lucide-react';

const Employees = () => {
    const { user } = useAuth();
    const { isMobile, isCompact } = useResponsive();
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        fetchEmployees();
        if (user?.user_type === 'super_admin') fetchDepartments();
    }, [searchTerm, departmentFilter]);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const data = await employeeService.getAllEmployees(searchTerm, departmentFilter);
            setEmployees(data.results || []);
        } catch (err) {
            console.error('Failed to load employees:', err);
            setEmployees([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const data = await departmentService.getAllDepartments();
            setDepartments(data.results || []);
        } catch (err) {
            console.error('Failed to load departments:', err);
            setDepartments([]);
        }
    };

    const handleViewDetails = async (employee) => {
        try {
            const detailData = await employeeService.getEmployeeById(employee.id);
            setSelectedEmployee(detailData);
            setShowDetailModal(true);
        } catch (err) {
            console.error('Failed to load employee details:', err);
        }
    };

    const formatSalary = (salary, currency) => {
        if (!salary) return 'N/A';
        return formatMoney(salary, currency);
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
                            <h1 style={styles.welcomeText}>Employees</h1>
                            <p style={styles.subText}>
                                {user?.user_type === 'super_admin'
                                    ? 'View all employees across departments'
                                    : 'View your company employees'}
                            </p>
                        </div>
                    </header>

                    {/* Filters */}
                    <div style={{ ...styles.filtersContainer, ...(isMobile ? { flexDirection: 'column', alignItems: 'stretch' } : {}) }}>
                        <div style={styles.searchWrapper}>
                            <Search size={15} color="#475569" style={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Search by name, father name, CNIC, or designation..."
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
                                    <option key={dept.id} value={dept.id}>{dept.name || 'N/A'}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Table */}
                    <div style={styles.tableContainer}>
                        {employees.length > 0 ? (
                            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                            <table style={{ ...styles.table, minWidth: '900px' }}>
                                <thead>
                                    <tr>
                                        {['Employee', 'Father Name', 'CNIC', 'Designation', 'Company', 'Salary', 'Joining Date', 'Actions'].map(h => (
                                            <th key={h} style={styles.th}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.map((employee, index) => (
                                        <tr key={employee.id} style={styles.tr}>
                                            <td style={styles.td}>
                                                <div style={styles.employeeCell}>
                                                    {employee.profile_picture_url ? (
                                                        <img src={employee.profile_picture_url} alt={employee.name || 'Employee'} style={styles.avatar} />
                                                    ) : (
                                                        <div style={{
                                                            ...styles.avatarPlaceholder,
                                                            backgroundColor: avatarColors[index % avatarColors.length] + '22',
                                                            color: avatarColors[index % avatarColors.length],
                                                        }}>
                                                            {(employee.name || 'E').charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <span style={styles.employeeName}>{employee.name || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td style={styles.td}>{employee.father_name || 'N/A'}</td>
                                            <td style={{ ...styles.td, fontFamily: 'monospace', color: '#94a3b8' }}>{employee.cnic || 'N/A'}</td>
                                            <td style={styles.td}>
                                                <span style={styles.designationBadge}>{employee.designation || 'N/A'}</span>
                                            </td>
                                            <td style={styles.td}>{employee.department_name || 'N/A'}</td>
                                            <td style={{ ...styles.td, color: '#10b981', fontWeight: '600' }}>
                                                {formatSalary(employee.salary, employee.salary_currency)}
                                            </td>
                                            <td style={{ ...styles.td, color: '#64748b' }}>
                                                {employee.joining_date ? new Date(employee.joining_date).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td style={styles.td}>
                                                <button onClick={() => handleViewDetails(employee)} style={styles.viewButton}>
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
                                <Users size={32} color="#334155" />
                                <p style={{ color: '#475569', marginTop: '12px' }}>No employees found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedEmployee && (
                <div style={styles.modalOverlay} onClick={() => setShowDetailModal(false)}>
                    <div style={{ ...styles.modal, ...(isMobile ? { width: '92vw' } : {}) }} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitle}>Employee Details</h2>
                            <button onClick={() => setShowDetailModal(false)} style={styles.closeButton}>
                                <X size={18} color="#94a3b8" />
                            </button>
                        </div>
                        <div style={styles.modalBody}>

                            {/* Profile Picture + Name Hero */}
                            <div style={styles.profileHero}>
                                {selectedEmployee.profile_picture_url ? (
                                    <img
                                        src={selectedEmployee.profile_picture_url}
                                        alt={selectedEmployee.name || 'Employee'}
                                        style={styles.profilePicture}
                                    />
                                ) : (
                                    <div style={styles.profilePlaceholder}>
                                        {(selectedEmployee.name || 'E').charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <h3 style={styles.profileName}>{selectedEmployee.name || 'N/A'}</h3>
                                    <p style={styles.profileDesignation}>{selectedEmployee.designation || selectedEmployee.job_title || ''}</p>
                                    <p style={styles.profileDept}>{selectedEmployee.department_name || ''}</p>
                                </div>
                            </div>

                            <div style={styles.divider} />

                            {/* Personal Info */}
                            <div style={styles.section}>
                                <h4 style={styles.sectionTitle}>Personal Information</h4>
                                <div style={styles.infoGrid}>
                                    <div style={styles.infoBox}>
                                        <span style={styles.infoLabel}>Full Name</span>
                                        <span style={styles.infoValue}>{selectedEmployee.name || 'N/A'}</span>
                                    </div>
                                    {selectedEmployee.father_name && (
                                        <div style={styles.infoBox}>
                                            <span style={styles.infoLabel}>Father Name</span>
                                            <span style={styles.infoValue}>{selectedEmployee.father_name}</span>
                                        </div>
                                    )}
                                    {selectedEmployee.cnic && (
                                        <div style={styles.infoBox}>
                                            <span style={styles.infoLabel}>CNIC</span>
                                            <span style={{ ...styles.infoValue, fontFamily: 'monospace', fontSize: '13px' }}>{selectedEmployee.cnic}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={styles.divider} />

                            {/* Employment Details */}
                            <div style={styles.section}>
                                <h4 style={styles.sectionTitle}>Employment Details</h4>
                                <div style={styles.infoGrid}>
                                    <div style={styles.infoBox}>
                                        <span style={styles.infoLabel}>Designation</span>
                                        <span style={styles.infoValue}>{selectedEmployee.designation || 'N/A'}</span>
                                    </div>
                                    {selectedEmployee.job_title && (
                                        <div style={styles.infoBox}>
                                            <span style={styles.infoLabel}>Job Title</span>
                                            <span style={styles.infoValue}>{selectedEmployee.job_title}</span>
                                        </div>
                                    )}
                                    <div style={styles.infoBox}>
                                        <span style={styles.infoLabel}>Salary</span>
                                        <span style={{ ...styles.infoValue, color: '#10b981' }}>{formatSalary(selectedEmployee.salary, selectedEmployee.salary_currency)}</span>
                                    </div>
                                    <div style={styles.infoBox}>
                                        <span style={styles.infoLabel}>Joining Date</span>
                                        <span style={styles.infoValue}>
                                            {selectedEmployee.joining_date ? new Date(selectedEmployee.joining_date).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </div>
                                    <div style={styles.infoBox}>
                                        <span style={styles.infoLabel}>Department</span>
                                        <span style={styles.infoValue}>{selectedEmployee.department_name || 'N/A'}</span>
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
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
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
    },
    td: {
        padding: '14px 18px',
        fontSize: '13px',
        color: '#cbd5e1',
        verticalAlign: 'middle',
    },
    employeeCell: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    avatar: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        objectFit: 'cover',
        flexShrink: 0,
    },
    avatarPlaceholder: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: '700',
        flexShrink: 0,
    },
    employeeName: {
        fontWeight: '600',
        color: '#f1f5f9',
        fontSize: '13px',
    },
    designationBadge: {
        padding: '3px 10px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '600',
        backgroundColor: '#1e293b',
        color: '#94a3b8',
        display: 'inline-block',
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
    modalBody: {
        padding: '24px 28px',
    },
    profileHero: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '24px',
    },
    profilePicture: {
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '2px solid #6366f1',
        flexShrink: 0,
    },
    profilePlaceholder: {
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        backgroundColor: '#6366f122',
        border: '2px solid #6366f144',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '28px',
        fontWeight: '700',
        color: '#6366f1',
        flexShrink: 0,
    },
    profileName: {
        margin: '0 0 4px 0',
        fontSize: '18px',
        fontWeight: '700',
        color: '#f1f5f9',
    },
    profileDesignation: {
        margin: '0 0 2px 0',
        fontSize: '13px',
        color: '#818cf8',
        fontWeight: '600',
    },
    profileDept: {
        margin: 0,
        fontSize: '12px',
        color: '#64748b',
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
        margin: '0 0 14px 0',
        fontSize: '11px',
        fontWeight: '700',
        color: '#475569',
        textTransform: 'uppercase',
        letterSpacing: '0.6px',
    },
    infoGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
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
        fontWeight: '600',
        color: '#f1f5f9',
    },
};

export default Employees;