import React, { useState, useEffect } from 'react';
import DepartmentSidebar from './DepartmentSidebar';
import DepartmentNavbar from './DepartmentNavbar';
import Loader from '../common/Loader';
import { employeeService } from '../../services/employeeService';
import { jobService } from '../../services/jobsService';
import { getCurrencies, formatMoney } from '../../utils/currency';
import { useResponsive } from '../../hooks/useResponsive';
import {
    Users,
    Search,
    Plus,
    Eye,
    Pencil,
    Trash2,
    X,
    Calendar,
    UserCircle,
    Briefcase,
    Building2,
} from 'lucide-react';

const DepartmentEmployees = () => {
    const { isMobile, isCompact } = useResponsive();
    const [employees, setEmployees] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [imagePreview, setImagePreview] = useState(null);

    const emptyForm = {
        name: '',
        father_name: '',
        cnic: '',
        profile_picture: null,
        job: '',
        designation: '',
        salary: '',
        salary_currency: 'USD',
        joining_date: new Date().toISOString().split('T')[0],
    };
    const [formData, setFormData] = useState(emptyForm);

    useEffect(() => {
        fetchEmployees();
        fetchJobs();
    }, [searchTerm]);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const data = await employeeService.getAllEmployees(searchTerm);
            setEmployees(data.results);
        } catch (err) {
            setError('Failed to load employees');
        } finally {
            setLoading(false);
        }
    };

    const fetchJobs = async () => {
        try {
            const data = await jobService.getAllJobs();
            setJobs(data.results);
        } catch (err) {
            console.error('Failed to load jobs:', err);
        }
    };

    const handleViewDetails = async (employee) => {
        try {
            const detailData = await employeeService.getEmployeeById(employee.id);
            setSelectedEmployee(detailData);
            setShowDetailModal(true);
        } catch (err) {
            setError('Failed to load employee details');
        }
    };

    const handleCreate = () => {
        setFormData(emptyForm);
        setImagePreview(null);
        setShowCreateModal(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, profile_picture: file });
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const buildFormData = (data) => {
        const fd = new FormData();
        fd.append('name', data.name);
        fd.append('father_name', data.father_name);
        fd.append('cnic', data.cnic);
        if (data.profile_picture) fd.append('profile_picture', data.profile_picture);
        if (data.job) fd.append('job', data.job);
        fd.append('designation', data.designation);
        fd.append('salary', data.salary);
        fd.append('salary_currency', data.salary_currency || 'USD');
        fd.append('joining_date', data.joining_date);
        return fd;
    };

    const submitCreate = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        try {
            await employeeService.createEmployee(buildFormData(formData));
            setSuccess('Employee created successfully!');
            setShowCreateModal(false);
            fetchEmployees();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create employee');
        }
    };

    const handleEdit = (employee) => {
        setSelectedEmployee(employee);
        setFormData({
            name: employee.name,
            father_name: employee.father_name || '',
            cnic: employee.cnic || '',
            profile_picture: null,
            job: employee.job || '',
            designation: employee.designation,
            salary: employee.salary,
            salary_currency: employee.salary_currency || 'USD',
            joining_date: employee.joining_date,
        });
        setImagePreview(employee.profile_picture_url);
        setShowEditModal(true);
    };

    const submitEdit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        try {
            await employeeService.updateEmployee(selectedEmployee.id, buildFormData(formData));
            setSuccess('Employee updated successfully!');
            setShowEditModal(false);
            fetchEmployees();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update employee');
        }
    };

    const handleDelete = async (employeeId, employeeName) => {
        if (window.confirm(`Are you sure you want to delete ${employeeName}? This action cannot be undone.`)) {
            try {
                await employeeService.deleteEmployee(employeeId);
                setSuccess('Employee deleted successfully!');
                fetchEmployees();
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to delete employee');
            }
        }
    };

    if (loading) return <Loader />;

    return (
        <div style={s.container}>
            <DepartmentSidebar />
            <div style={{ ...s.mainContent, ...(isCompact ? { marginLeft: 0 } : {}) }}>
                <DepartmentNavbar />
                <div style={{ ...s.content, ...(isMobile ? { padding: '90px 16px 32px 16px' } : {}) }}>

                    {/* Header */}
                    <header style={{ ...s.pageHeader, ...(isMobile ? { flexDirection: 'column', alignItems: 'flex-start', gap: '14px' } : {}) }}>
                        <div style={s.headerLeft}>
                            <div style={s.headerIconWrap}>
                                <Users size={20} color="#818cf8" />
                            </div>
                            <div>
                                <h1 style={s.pageTitle}>Employees</h1>
                                <p style={s.pageSubtitle}>Manage your department staff</p>
                            </div>
                        </div>
                        <div style={s.headerRight}>
                            <div style={s.dateBadge}>
                                <Calendar size={14} color="#6366f1" />
                                <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <button onClick={handleCreate} style={s.createBtn}>
                                <Plus size={16} />
                                Add Employee
                            </button>
                        </div>
                    </header>

                    {/* Alerts */}
                    {success && (
                        <div style={s.successAlert}>
                            <span>{success}</span>
                            <button onClick={() => setSuccess('')} style={s.alertClose}><X size={16} /></button>
                        </div>
                    )}
                    {error && (
                        <div style={s.errorAlert}>
                            <span>{error}</span>
                            <button onClick={() => setError('')} style={s.alertClose}><X size={16} /></button>
                        </div>
                    )}

                    {/* Search */}
                    <div style={s.searchWrap}>
                        <Search size={16} color="#475569" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            placeholder="Search by name, father name, CNIC, designation..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={s.searchInput}
                        />
                    </div>

                    {/* Table */}
                    <div style={s.tableCard}>
                      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                        {employees.length > 0 ? (
                            <table style={{ ...s.table, minWidth: '900px' }}>
                                <thead>
                                    <tr>
                                        <th style={s.th}>Employee</th>
                                        <th style={s.th}>Father Name</th>
                                        <th style={s.th}>CNIC</th>
                                        <th style={s.th}>Designation</th>
                                        <th style={s.th}>Salary</th>
                                        <th style={s.th}>Joining Date</th>
                                        <th style={s.th}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.map((employee) => (
                                        <tr key={employee.id} style={s.tr}>
                                            <td style={s.td}>
                                                <div style={s.empCell}>
                                                    {employee.profile_picture_url ? (
                                                        <img src={employee.profile_picture_url} alt={employee.name} style={s.avatar} />
                                                    ) : (
                                                        <div style={s.avatarPlaceholder}>
                                                            {employee.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <span style={s.empName}>{employee.name}</span>
                                                </div>
                                            </td>
                                            <td style={{ ...s.td, color: '#94a3b8' }}>{employee.father_name || '—'}</td>
                                            <td style={{ ...s.td, color: '#94a3b8', fontFamily: 'monospace', fontSize: '13px' }}>{employee.cnic || '—'}</td>
                                            <td style={s.td}>
                                                <span style={s.designationBadge}>{employee.designation}</span>
                                            </td>
                                            <td style={{ ...s.td, color: '#4ade80', fontWeight: '700' }}>
                                                {employee.salary ? formatMoney(employee.salary, employee.salary_currency) : '—'}
                                            </td>
                                            <td style={{ ...s.td, color: '#64748b', fontSize: '13px' }}>
                                                {new Date(employee.joining_date).toLocaleDateString()}
                                            </td>
                                            <td style={s.td}>
                                                <div style={s.actions}>
                                                    <ActionBtn icon={<Eye size={13} />} label="View" color="#6366f1" onClick={() => handleViewDetails(employee)} />
                                                    <ActionBtn icon={<Pencil size={13} />} label="Edit" color="#4ade80" onClick={() => handleEdit(employee)} />
                                                    <ActionBtn icon={<Trash2 size={13} />} label="Delete" color="#f87171" onClick={() => handleDelete(employee.id, employee.name)} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div style={s.noData}>
                                <Users size={40} color="#1e293b" />
                                <p style={{ color: '#334155', marginTop: '12px', fontSize: '14px' }}>No employees found</p>
                            </div>
                        )}
                      </div>
                    </div>

                    {/* Create Modal */}
                    {showCreateModal && (
                        <Modal title="Add New Employee" icon={<Plus size={18} color="#818cf8" />} onClose={() => setShowCreateModal(false)}>
                            <EmployeeForm
                                formData={formData}
                                setFormData={setFormData}
                                jobs={jobs}
                                imagePreview={imagePreview}
                                handleImageChange={handleImageChange}
                                isMobile={isMobile}
                                onSubmit={submitCreate}
                                onClose={() => setShowCreateModal(false)}
                                submitLabel="Add Employee"
                            />
                        </Modal>
                    )}

                    {/* Edit Modal */}
                    {showEditModal && (
                        <Modal title="Edit Employee" icon={<Pencil size={18} color="#4ade80" />} onClose={() => setShowEditModal(false)}>
                            <EmployeeForm
                                formData={formData}
                                setFormData={setFormData}
                                jobs={jobs}
                                imagePreview={imagePreview}
                                handleImageChange={handleImageChange}
                                isMobile={isMobile}
                                onSubmit={submitEdit}
                                onClose={() => setShowEditModal(false)}
                                submitLabel="Update Employee"
                            />
                        </Modal>
                    )}

                    {/* Detail Modal */}
                    {showDetailModal && selectedEmployee && (
                        <Modal title="Employee Details" icon={<Eye size={18} color="#6366f1" />} onClose={() => setShowDetailModal(false)}>
                            <div>
                                {/* Avatar hero */}
                                <div style={s.detailHero}>
                                    {selectedEmployee.profile_picture_url ? (
                                        <img src={selectedEmployee.profile_picture_url} alt={selectedEmployee.name} style={s.detailAvatar} />
                                    ) : (
                                        <div style={{ ...s.avatarPlaceholder, width: '80px', height: '80px', fontSize: '28px' }}>
                                            {selectedEmployee.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <div style={{ fontSize: '20px', fontWeight: '800', color: '#f1f5f9' }}>{selectedEmployee.name}</div>
                                        <div style={{ fontSize: '13px', color: '#6366f1', fontWeight: '600', marginTop: '4px' }}>{selectedEmployee.designation}</div>
                                    </div>
                                </div>

                                <DetailSection title="Personal Information" icon={<UserCircle size={14} color="#818cf8" />}>
                                    <InfoGrid>
                                        <InfoItem label="Full Name" value={selectedEmployee.name} />
                                        <InfoItem label="Father Name" value={selectedEmployee.father_name || '—'} />
                                        <InfoItem label="CNIC" value={selectedEmployee.cnic || '—'} mono />
                                    </InfoGrid>
                                </DetailSection>

                                <DetailSection title="Employment Details" icon={<Briefcase size={14} color="#818cf8" />} last>
                                    <InfoGrid>
                                        <InfoItem label="Designation" value={selectedEmployee.designation} />
                                        <InfoItem label="Job Title" value={selectedEmployee.job_title || '—'} />
                                        <InfoItem label="Salary" value={selectedEmployee.salary ? formatMoney(selectedEmployee.salary, selectedEmployee.salary_currency) : '—'} highlight />
                                        <InfoItem label="Joining Date" value={new Date(selectedEmployee.joining_date).toLocaleDateString()} />
                                        <InfoItem label="Department" value={selectedEmployee.department_name} />
                                    </InfoGrid>
                                </DetailSection>
                            </div>
                        </Modal>
                    )}

                </div>
            </div>
        </div>
    );
};

/* ─── Sub-components ──────────────────────────────── */

// Declared at module scope on purpose: defining it inside DepartmentEmployees would
// create a new component type on every keystroke, remounting the inputs and losing focus.
const EmployeeForm = ({ formData, setFormData, jobs, imagePreview, handleImageChange, isMobile, onSubmit, onClose, submitLabel }) => (
    <form onSubmit={onSubmit}>
        {/* Profile Picture */}
        <div style={s.formGroup}>
            <label style={s.label}>Profile Picture</label>
            <div style={s.fileInputWrap}>
                {imagePreview ? (
                    <img src={imagePreview} alt="Preview" style={s.imagePreview} />
                ) : (
                    <div style={s.avatarPlaceholderLg}>
                        <UserCircle size={40} color="#334155" />
                    </div>
                )}
                <label style={s.fileLabel}>
                    <span style={s.fileLabelText}>Choose image</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                </label>
            </div>
        </div>

        <div style={{ ...s.formGrid, ...(isMobile ? { gridTemplateColumns: '1fr' } : {}) }}>
            <FormGroup label="Name *">
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required style={s.input} placeholder="Employee name" />
            </FormGroup>
            <FormGroup label="Father Name">
                <input type="text" value={formData.father_name} onChange={(e) => setFormData({ ...formData, father_name: e.target.value })} style={s.input} placeholder="Father name" />
            </FormGroup>
            <FormGroup label="CNIC">
                <input type="text" value={formData.cnic} onChange={(e) => setFormData({ ...formData, cnic: e.target.value })} style={s.input} placeholder="XXXXX-XXXXXXX-X" />
            </FormGroup>
            <FormGroup label="Job (Optional)">
                <select value={formData.job} onChange={(e) => setFormData({ ...formData, job: e.target.value })} style={s.input}>
                    <option value="">Select a job</option>
                    {jobs.map((job) => (
                        <option key={job.id} value={job.id}>{job.title}</option>
                    ))}
                </select>
            </FormGroup>
            <FormGroup label="Designation *">
                <input type="text" value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} required style={s.input} placeholder="e.g., Senior Developer" />
            </FormGroup>
            <FormGroup label="Currency *">
                <select value={formData.salary_currency} onChange={(e) => setFormData({ ...formData, salary_currency: e.target.value })} required style={s.input}>
                    {getCurrencies().map((c) => (
                        <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
                    ))}
                </select>
            </FormGroup>
            <FormGroup label="Salary *">
                <input type="number" min="0" step="0.01" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} required style={s.input} placeholder={`Amount in ${formData.salary_currency || 'USD'}`} />
            </FormGroup>
            <FormGroup label="Joining Date *">
                <input type="date" value={formData.joining_date} onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })} required style={s.input} />
            </FormGroup>
        </div>

        <div style={s.modalFooter}>
            <button type="button" onClick={onClose} style={s.cancelBtn}>Cancel</button>
            <button type="submit" style={s.submitBtn}>{submitLabel}</button>
        </div>
    </form>
);

const ActionBtn = ({ icon, label, color, onClick }) => (
    <button
        onClick={onClick}
        style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            padding: '5px 10px', fontSize: '11px', fontWeight: '700',
            color, backgroundColor: `${color}18`, border: `1px solid ${color}40`,
            borderRadius: '6px', cursor: 'pointer', whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = `${color}30`; e.currentTarget.style.borderColor = `${color}80`; }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = `${color}18`; e.currentTarget.style.borderColor = `${color}40`; }}
    >
        {icon}{label}
    </button>
);

const Modal = ({ title, icon, onClose, children }) => (
    <div style={s.modalOverlay} onClick={onClose}>
        <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={s.modalIconWrap}>{icon}</div>
                    <h2 style={s.modalTitle}>{title}</h2>
                </div>
                <button onClick={onClose} style={s.closeBtn}><X size={18} /></button>
            </div>
            <div style={s.modalBody}>{children}</div>
        </div>
    </div>
);

const FormGroup = ({ label, children }) => (
    <div style={s.formGroup}>
        <label style={s.label}>{label}</label>
        {children}
    </div>
);

const DetailSection = ({ title, icon, children, last }) => (
    <div style={{ marginBottom: last ? 0 : '24px', paddingBottom: last ? 0 : '24px', borderBottom: last ? 'none' : '1px solid #1e293b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            {icon}
            <h3 style={s.sectionTitle}>{title}</h3>
        </div>
        {children}
    </div>
);

const InfoGrid = ({ children }) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
        {children}
    </div>
);

const InfoItem = ({ label, value, highlight, mono }) => (
    <div>
        <div style={s.infoLabel}>{label}</div>
        <div style={{
            ...s.infoValue,
            ...(highlight ? { color: '#4ade80', fontWeight: '700' } : {}),
            ...(mono ? { fontFamily: 'monospace', fontSize: '13px' } : {}),
        }}>{value}</div>
    </div>
);

/* ─── Styles ──────────────────────────────────────── */

const s = {
    container: { display: 'flex', backgroundColor: '#020617', minHeight: '100vh' },
    mainContent: {
        minWidth: 0, marginLeft: '280px', flex: 1, display: 'flex', flexDirection: 'column' },
    content: { padding: '100px 40px 40px 40px' },

    pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px' },
    headerLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
    headerRight: { display: 'flex', alignItems: 'center', gap: '12px' },
    headerIconWrap: { width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#0f172a', border: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    pageTitle: { fontSize: '26px', fontWeight: '800', color: '#f8fafc', margin: 0, letterSpacing: '-0.5px' },
    pageSubtitle: { color: '#64748b', fontSize: '14px', margin: '4px 0 0 0' },
    dateBadge: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '10px 16px', borderRadius: '10px', color: '#f8fafc', fontSize: '13px', fontWeight: '600' },
    createBtn: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: '700', color: 'white', background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)', border: 'none', borderRadius: '10px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' },

    successAlert: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#052e16', border: '1px solid #14532d', borderRadius: '10px', padding: '12px 18px', marginBottom: '24px', color: '#4ade80', fontSize: '14px', fontWeight: '500' },
    errorAlert: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#2d0a0a', border: '1px solid #5a1a1a', borderRadius: '10px', padding: '12px 18px', marginBottom: '24px', color: '#f87171', fontSize: '14px', fontWeight: '500' },
    alertClose: { background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', alignItems: 'center', padding: '2px', opacity: 0.7 },

    searchWrap: { position: 'relative', marginBottom: '24px' },
    searchInput: { width: '100%', padding: '11px 16px 11px 42px', fontSize: '14px', backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', color: '#f1f5f9', outline: 'none', boxSizing: 'border-box' },

    tableCard: { backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b', overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '16px 20px', fontSize: '11px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.7px', backgroundColor: '#020617', borderBottom: '1px solid #1e293b' },
    tr: { borderBottom: '1px solid #1e293b' },
    td: { padding: '14px 20px', fontSize: '14px', color: '#cbd5e1', verticalAlign: 'middle' },

    empCell: { display: 'flex', alignItems: 'center', gap: '12px' },
    avatar: { width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #312e81' },
    avatarPlaceholder: { width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #4338ca, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '15px', fontWeight: '700', flexShrink: 0 },
    avatarPlaceholderLg: { width: '80px', height: '80px', borderRadius: '12px', backgroundColor: '#1e293b', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    empName: { fontWeight: '600', color: '#f1f5f9' },
    designationBadge: { display: 'inline-block', padding: '4px 10px', backgroundColor: '#1a1a2e', border: '1px solid #312e81', borderRadius: '6px', color: '#818cf8', fontSize: '12px', fontWeight: '600' },
    actions: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
    noData: { textAlign: 'center', padding: '64px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center' },

    /* Modal */
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modal: { backgroundColor: '#0f172a', borderRadius: '18px', width: '90%', maxWidth: '620px', maxHeight: '90vh', overflow: 'auto', border: '1px solid #1e293b', boxShadow: '0 25px 60px rgba(0,0,0,0.6)' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 28px', borderBottom: '1px solid #1e293b' },
    modalIconWrap: { width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#020617', border: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    modalTitle: { margin: 0, fontSize: '18px', fontWeight: '700', color: '#f1f5f9', letterSpacing: '-0.3px' },
    closeBtn: { background: 'none', border: '1px solid #1e293b', borderRadius: '8px', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '6px' },
    modalBody: { padding: '28px' },

    /* Form */
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' },
    formGroup: { marginBottom: '18px' },
    label: { display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' },
    input: { width: '100%', padding: '11px 14px', fontSize: '14px', backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', color: '#f1f5f9', outline: 'none', boxSizing: 'border-box' },

    fileInputWrap: { display: 'flex', alignItems: 'center', gap: '16px' },
    imagePreview: { width: '72px', height: '72px', borderRadius: '12px', objectFit: 'cover', border: '2px solid #312e81' },
    fileLabel: { cursor: 'pointer' },
    fileLabelText: { display: 'inline-block', padding: '8px 16px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#94a3b8', fontSize: '13px', fontWeight: '600' },

    modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '28px' },
    cancelBtn: { padding: '11px 22px', fontSize: '13px', fontWeight: '600', color: '#64748b', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px', cursor: 'pointer' },
    submitBtn: { padding: '11px 22px', fontSize: '13px', fontWeight: '700', color: 'white', background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)', border: 'none', borderRadius: '10px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' },

    /* Detail modal */
    detailHero: { display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', backgroundColor: '#020617', borderRadius: '14px', border: '1px solid #1e293b', marginBottom: '24px' },
    detailAvatar: { width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #312e81' },
    sectionTitle: { margin: 0, fontSize: '11px', fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.8px' },
    infoLabel: { fontSize: '10px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '5px' },
    infoValue: { fontSize: '14px', color: '#f1f5f9', fontWeight: '500' },
};

export default DepartmentEmployees;