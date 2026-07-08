import React, { useState, useEffect } from 'react';
import DepartmentSidebar from './DepartmentSidebar';
import DepartmentNavbar from './DepartmentNavbar';
import Loader from '../common/Loader';
import { applicantService } from '../../services/applicantService';
import { jobService } from '../../services/jobsService';
import { testService } from '../../services/testService';
import { useResponsive } from '../../hooks/useResponsive';
import {
    Users, Search, Filter, Eye, ClipboardList, Video, Clock,
    Bell, UserCheck, UserX, ChevronDown, X, Calendar,
    FileText, Briefcase, MapPin, Phone, BookOpen, Award,
    Download,
} from 'lucide-react';

const DepartmentApplicants = () => {
    const { isMobile, isCompact } = useResponsive();
    const [applicants, setApplicants]         = useState([]);
    const [jobs, setJobs]                     = useState([]);
    const [chapters, setChapters]             = useState([]);
    const [loading, setLoading]               = useState(true);
    const [searchTerm, setSearchTerm]         = useState('');
    const [statusFilter, setStatusFilter]     = useState('');
    const [jobFilter, setJobFilter]           = useState('');
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [showDetailModal, setShowDetailModal]     = useState(false);
    const [showTestModal, setShowTestModal]         = useState(false);
    const [showInterviewModal, setShowInterviewModal] = useState(false);
    const [showHireModal, setShowHireModal]         = useState(false);
    const [error, setError]     = useState('');
    const [success, setSuccess] = useState('');
    const [exporting, setExporting] = useState('');

    const [testFormData,      setTestFormData]      = useState({ chapter: '', deadline: '', pass_percentage: 70 });
    const [interviewFormData, setInterviewFormData] = useState({ interview_link: '', interview_datetime: '', message: '' });
    const [hireFormData,      setHireFormData]      = useState({ designation: '', salary: '', joining_date: '' });

    useEffect(() => {
        fetchApplicants();
        fetchJobs();
        fetchChapters();
    }, [searchTerm, statusFilter, jobFilter]);

    const handleExport = async (format) => {
        setExporting(format);
        try {
            await applicantService.exportApplications(format, searchTerm, statusFilter, jobFilter);
        } catch (err) {
            setError('Export failed. Please try again.');
        } finally {
            setExporting('');
        }
    };

    const fetchApplicants = async () => {
        try {
            setLoading(true);
            const data = await applicantService.getAllApplications(searchTerm, statusFilter, jobFilter);
            setApplicants(data.results || []);
        } catch (err) {
            setError('Failed to load applicants');
        } finally {
            setLoading(false);
        }
    };

    const fetchJobs = async () => {
        try {
            const data = await jobService.getAllJobs();
            setJobs(data.results || []);
        } catch (err) { console.error('Failed to load jobs:', err); }
    };

    const fetchChapters = async () => {
        try {
            const data = await testService.getAllChapters();
            setChapters(data.results || []);
        } catch (err) { console.error('Failed to load chapters:', err); }
    };

    const handleViewDetails = async (applicant) => {
        try {
            const detail = await applicantService.getApplicationById(applicant.id);
            setSelectedApplicant(detail);
            setShowDetailModal(true);
        } catch (err) { setError('Failed to load applicant details'); }
    };

    const handleAssignTest = (applicant) => {
        setSelectedApplicant(applicant);
        setTestFormData({ chapter: '', deadline: '', pass_percentage: 70 });
        setShowTestModal(true);
    };

    const submitAssignTest = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        try {
            await applicantService.assignTest(selectedApplicant.id, {
                chapter: parseInt(testFormData.chapter),
                deadline: testFormData.deadline,
                pass_percentage: parseInt(testFormData.pass_percentage),
            });
            setSuccess('Test assigned successfully!');
            setShowTestModal(false);
            fetchApplicants();
        } catch (err) { setError(err.response?.data?.error || 'Failed to assign test'); }
    };

    const handleScheduleInterview = (applicant) => {
        setSelectedApplicant(applicant);
        setInterviewFormData({ interview_link: '', interview_datetime: '', message: '' });
        setShowInterviewModal(true);
    };

    const submitScheduleInterview = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        try {
            await applicantService.scheduleInterview(selectedApplicant.id, interviewFormData);
            setSuccess('Interview scheduled successfully!');
            setShowInterviewModal(false);
            fetchApplicants();
        } catch (err) { setError(err.response?.data?.error || 'Failed to schedule interview'); }
    };

    const handleStatusChange = async (applicantId, newStatus) => {
        try {
            await applicantService.updateStatus(applicantId, newStatus);
            setSuccess(`Status updated to ${newStatus}!`);
            fetchApplicants();
        } catch (err) { setError('Failed to update status'); }
    };

    const handleHire = (applicant) => {
        setSelectedApplicant(applicant);
        setHireFormData({
            designation: applicant.job_title || '',
            salary: '',
            joining_date: new Date().toISOString().split('T')[0],
        });
        setShowHireModal(true);
    };

    const submitHire = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        try {
            await applicantService.hireApplicant(selectedApplicant.id, hireFormData);
            setSuccess('Applicant hired successfully!');
            setShowHireModal(false);
            fetchApplicants();
        } catch (err) { setError(err.response?.data?.error || 'Failed to hire applicant'); }
    };

    const handleReject = async (applicantId) => {
        const reason = window.prompt('Please provide a reason for rejection:');
        if (reason) {
            try {
                await applicantService.rejectApplicant(applicantId, reason);
                setSuccess('Applicant rejected successfully!');
                fetchApplicants();
            } catch (err) { setError('Failed to reject applicant'); }
        }
    };

    // ── Status helpers ──────────────────────────────────────────────────────
    const statusConfig = {
        applied:              { bg: '#0f1e35', color: '#60a5fa', border: '#1e3a5f', label: 'Applied' },
        test_assigned:        { bg: '#1f1505', color: '#fbbf24', border: '#3d2a0a', label: 'Test Assigned' },
        test_completed:       { bg: '#0a1a2a', color: '#38bdf8', border: '#0e3a5c', label: 'Test Completed' },
        test_passed:          { bg: '#052e16', color: '#4ade80', border: '#14532d', label: 'Test Passed' },
        test_failed:          { bg: '#2d0a0a', color: '#f87171', border: '#5a1a1a', label: 'Test Failed' },
        interview_scheduled:  { bg: '#0c1f2c', color: '#67e8f9', border: '#164e63', label: 'Interview Scheduled' },
        interview_completed:  { bg: '#042f2e', color: '#5eead4', border: '#134e4a', label: 'Interviewed' },
        waiting:              { bg: '#1a1200', color: '#facc15', border: '#3b2f00', label: 'Waiting' },
        notice_period:        { bg: '#1a0a2e', color: '#a78bfa', border: '#3b0764', label: 'Notice Period' },
        hired:                { bg: '#042f2e', color: '#2dd4bf', border: '#134e4a', label: 'Hired' },
        rejected:             { bg: '#2d0a0a', color: '#fb7185', border: '#5a1a1a', label: 'Rejected' },
    };

    const getStatusBadge = (status) => {
        const cfg = statusConfig[status] || { bg: '#1e293b', color: '#94a3b8', border: '#334155' };
        return {
            display: 'inline-flex', alignItems: 'center',
            padding: '4px 12px', borderRadius: '20px',
            fontSize: '11px', fontWeight: '700',
            letterSpacing: '0.5px', textTransform: 'uppercase',
            backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
        };
    };

    const getStatusLabel = (status) =>
        statusConfig[status]?.label || status.replace(/_/g, ' ').toUpperCase();

    const canAssignTest        = (a) => a.status === 'applied';
    const canScheduleInterview = (a) => ['test_passed', 'applied'].includes(a.status);
    const canMoveToWaiting     = (a) => a.status === 'interview_scheduled';
    const canMoveToNotice      = (a) => a.status === 'waiting';
    const canHire              = (a) => a.status === 'notice_period';
    const canReject            = (a) => !['hired', 'rejected'].includes(a.status);

    // ── helper: get name from list item (applicant_name) or detail (applicant_details)
    const getName  = (a) => a.applicant_name  || a.applicant_details?.full_name  || a.applicant_details?.username || '—';
    const getEmail = (a) => a.applicant_email || a.applicant_details?.email || '—';

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
                            <div style={s.headerIconWrap}><Users size={20} color="#6366f1" /></div>
                            <div>
                                <h1 style={s.pageTitle}>Applicants</h1>
                                <p style={s.pageSubtitle}>Manage job applications and hiring pipeline</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={s.dateBadge}>
                                <Calendar size={14} color="#6366f1" />
                                <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <button
                                onClick={() => handleExport('csv')}
                                disabled={!!exporting}
                                style={s.exportBtn}
                                title="Download CSV with current filters"
                            >
                                <Download size={14} />
                                {exporting === 'csv' ? 'Exporting...' : 'CSV'}
                            </button>
                            <button
                                onClick={() => handleExport('pdf')}
                                disabled={!!exporting}
                                style={{ ...s.exportBtn, background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white', border: 'none' }}
                                title="Download PDF with current filters"
                            >
                                <Download size={14} />
                                {exporting === 'pdf' ? 'Exporting...' : 'PDF'}
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

                    {/* Filters */}
                    <div style={{ ...s.filtersRow, ...(isMobile ? { flexDirection: 'column' } : {}) }}>
                        <div style={s.searchWrap}>
                            <Search size={16} color="#475569" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="text" placeholder="Search applicants..."
                                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                style={s.searchInput}
                            />
                        </div>
                        <div style={s.selectWrap}>
                            <Filter size={14} color="#475569" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={s.select}>
                                <option value="">All Status</option>
                                {Object.entries(statusConfig).map(([key, cfg]) => (
                                    <option key={key} value={key}>{cfg.label}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} color="#475569" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        </div>
                        <div style={s.selectWrap}>
                            <ClipboardList size={14} color="#475569" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                            <select value={jobFilter} onChange={(e) => setJobFilter(e.target.value)} style={s.select}>
                                <option value="">All Jobs</option>
                                {jobs.map((job) => (
                                    <option key={job.id} value={job.id}>{job.title}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} color="#475569" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        </div>
                    </div>

                    {/* Count */}
                    <p style={{ color: '#475569', fontSize: '13px', marginBottom: '16px' }}>
                        {applicants.length} applicant{applicants.length !== 1 ? 's' : ''} found
                    </p>

                    {/* Table */}
                    <div style={s.tableCard}>
                      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                        {applicants.length > 0 ? (
                            <table style={{ ...s.table, minWidth: '900px' }}>
                                <thead>
                                    <tr>
                                        <th style={s.th}>Applicant</th>
                                        <th style={s.th}>Job Title</th>
                                        <th style={s.th}>Status</th>
                                        <th style={s.th}>Applied On</th>
                                        <th style={s.th}>Score</th>
                                        <th style={s.th}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applicants.map((applicant) => (
                                        <tr key={applicant.id} style={s.tr}>
                                            <td style={s.td}>
                                                <div style={s.applicantCell}>
                                                    {applicant.applicant_profile_picture ? (
                                                        <img src={applicant.applicant_profile_picture} alt="" style={s.applicantAvatar} />
                                                    ) : (
                                                        <div style={s.applicantAvatarPlaceholder}>
                                                            {(getName(applicant))[0]?.toUpperCase() || '?'}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div style={s.applicantName}>{getName(applicant)}</div>
                                                        <div style={s.applicantEmail}>{getEmail(applicant)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ ...s.td, color: '#94a3b8' }}>{applicant.job_title}</td>
                                            <td style={s.td}>
                                                <span style={getStatusBadge(applicant.status)}>
                                                    {getStatusLabel(applicant.status)}
                                                </span>
                                            </td>
                                            <td style={{ ...s.td, color: '#64748b', fontSize: '13px' }}>
                                                {new Date(applicant.applied_at).toLocaleDateString()}
                                            </td>
                                            <td style={s.td}>
                                                {applicant.test_score != null ? (
                                                    <span style={{
                                                        fontSize: '13px', fontWeight: '700',
                                                        color: applicant.test_score >= 70 ? '#4ade80' : '#f87171',
                                                    }}>
                                                        {Math.round(applicant.test_score)}%
                                                    </span>
                                                ) : (
                                                    <span style={{ color: '#334155', fontSize: '12px' }}>—</span>
                                                )}
                                            </td>
                                            <td style={s.td}>
                                                <div style={s.actions}>
                                                    <ActionBtn icon={<Eye size={13} />} label="View" color="#6366f1" onClick={() => handleViewDetails(applicant)} />
                                                    {canAssignTest(applicant) && (
                                                        <ActionBtn icon={<ClipboardList size={13} />} label="Assign Test" color="#fbbf24" onClick={() => handleAssignTest(applicant)} />
                                                    )}
                                                    {canScheduleInterview(applicant) && (
                                                        <ActionBtn icon={<Video size={13} />} label="Interview" color="#38bdf8" onClick={() => handleScheduleInterview(applicant)} />
                                                    )}
                                                    {canMoveToWaiting(applicant) && (
                                                        <ActionBtn icon={<Clock size={13} />} label="Waiting" color="#facc15" onClick={() => handleStatusChange(applicant.id, 'waiting')} />
                                                    )}
                                                    {canMoveToNotice(applicant) && (
                                                        <ActionBtn icon={<Bell size={13} />} label="Notice Period" color="#a78bfa" onClick={() => handleStatusChange(applicant.id, 'notice_period')} />
                                                    )}
                                                    {canHire(applicant) && (
                                                        <ActionBtn icon={<UserCheck size={13} />} label="Hire" color="#4ade80" onClick={() => handleHire(applicant)} />
                                                    )}
                                                    {canReject(applicant) && (
                                                        <ActionBtn icon={<UserX size={13} />} label="Reject" color="#f87171" onClick={() => handleReject(applicant.id)} />
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div style={s.noData}>
                                <Users size={40} color="#1e293b" />
                                <p style={{ color: '#334155', marginTop: '12px', fontSize: '14px' }}>No applicants found</p>
                            </div>
                        )}
                      </div>
                    </div>

                    {/* ── Assign Test Modal ── */}
                    {showTestModal && (
                        <Modal title="Assign Test" icon={<ClipboardList size={18} color="#fbbf24" />} onClose={() => setShowTestModal(false)}>
                            <form onSubmit={submitAssignTest}>
                                <FormGroup label="Chapter *">
                                    <select value={testFormData.chapter} onChange={(e) => setTestFormData({ ...testFormData, chapter: e.target.value })} required style={s.input}>
                                        <option value="">Select a chapter</option>
                                        {chapters.map((ch) => (
                                            <option key={ch.id} value={ch.id}>{ch.name} ({ch.questions_count} questions)</option>
                                        ))}
                                    </select>
                                </FormGroup>
                                <FormGroup label="Deadline *">
                                    <input type="datetime-local" value={testFormData.deadline} onChange={(e) => setTestFormData({ ...testFormData, deadline: e.target.value })} required style={s.input} />
                                </FormGroup>
                                <FormGroup label="Pass Percentage *">
                                    <input type="number" min="0" max="100" value={testFormData.pass_percentage} onChange={(e) => setTestFormData({ ...testFormData, pass_percentage: e.target.value })} required style={s.input} />
                                </FormGroup>
                                <ModalFooter onCancel={() => setShowTestModal(false)} submitLabel="Assign Test" />
                            </form>
                        </Modal>
                    )}

                    {/* ── Schedule Interview Modal ── */}
                    {showInterviewModal && (
                        <Modal title="Schedule Interview" icon={<Video size={18} color="#38bdf8" />} onClose={() => setShowInterviewModal(false)}>
                            <form onSubmit={submitScheduleInterview}>
                                <FormGroup label="Interview Link *">
                                    <input type="url" value={interviewFormData.interview_link} onChange={(e) => setInterviewFormData({ ...interviewFormData, interview_link: e.target.value })} required style={s.input} placeholder="https://meet.google.com/..." />
                                </FormGroup>
                                <FormGroup label="Date & Time *">
                                    <input type="datetime-local" value={interviewFormData.interview_datetime} onChange={(e) => setInterviewFormData({ ...interviewFormData, interview_datetime: e.target.value })} required style={s.input} />
                                </FormGroup>
                                <FormGroup label="Message (Optional)">
                                    <textarea value={interviewFormData.message} onChange={(e) => setInterviewFormData({ ...interviewFormData, message: e.target.value })} rows="4" style={s.textarea} placeholder="Additional instructions..." />
                                </FormGroup>
                                <ModalFooter onCancel={() => setShowInterviewModal(false)} submitLabel="Schedule Interview" />
                            </form>
                        </Modal>
                    )}

                    {/* ── Hire Modal ── */}
                    {showHireModal && (
                        <Modal title="Hire Applicant" icon={<UserCheck size={18} color="#4ade80" />} onClose={() => setShowHireModal(false)}>
                            <form onSubmit={submitHire}>
                                <FormGroup label="Designation *">
                                    <input type="text" value={hireFormData.designation} onChange={(e) => setHireFormData({ ...hireFormData, designation: e.target.value })} required style={s.input} />
                                </FormGroup>
                                <FormGroup label="Salary *">
                                    <input type="number" value={hireFormData.salary} onChange={(e) => setHireFormData({ ...hireFormData, salary: e.target.value })} required style={s.input} placeholder="Enter salary amount" />
                                </FormGroup>
                                <FormGroup label="Joining Date *">
                                    <input type="date" value={hireFormData.joining_date} onChange={(e) => setHireFormData({ ...hireFormData, joining_date: e.target.value })} required style={s.input} />
                                </FormGroup>
                                <ModalFooter onCancel={() => setShowHireModal(false)} submitLabel="Hire Applicant" />
                            </form>
                        </Modal>
                    )}

                    {/* ── Detail Modal ── */}
                    {showDetailModal && selectedApplicant && (() => {
                        const ad = selectedApplicant.applicant_details || {};
                        const rd = selectedApplicant.resume_details || {};
                        const td = selectedApplicant.test_details || {};
                        const iv = selectedApplicant.interview_details || {};
                        const jd = selectedApplicant.job_details || {};
                        return (
                            <Modal title="Applicant Details" icon={<Eye size={18} color="#6366f1" />} onClose={() => setShowDetailModal(false)} wide>
                                <div>
                                    {/* ── Applicant Header ── */}
                                    <div style={{ ...s.detailHeader, ...(isMobile ? { flexDirection: 'column', alignItems: 'flex-start', gap: '14px' } : {}) }}>
                                        {ad.profile_picture ? (
                                            <img src={ad.profile_picture} alt="" style={s.detailAvatar} />
                                        ) : (
                                            <div style={s.detailAvatarPlaceholder}>
                                                {(ad.full_name || ad.username || '?')[0]?.toUpperCase()}
                                            </div>
                                        )}
                                        <div style={s.detailHeaderInfo}>
                                            <h3 style={s.detailName}>{ad.full_name || ad.username || '—'}</h3>
                                            <p style={s.detailSubInfo}>{ad.email}</p>
                                            {ad.current_job && <p style={s.detailSubInfo}>{ad.current_job}</p>}
                                            <span style={getStatusBadge(selectedApplicant.status)}>
                                                {getStatusLabel(selectedApplicant.status)}
                                            </span>
                                        </div>
                                        <div style={{ ...s.detailJobBox, ...(isMobile ? { textAlign: 'left' } : {}) }}>
                                            <p style={s.detailJobLabel}>Applied For</p>
                                            <p style={s.detailJobTitle}>{jd.title || selectedApplicant.job_title}</p>
                                            <p style={s.detailJobSub}>{new Date(selectedApplicant.applied_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                        </div>
                                    </div>

                                    {/* ── Personal Info ── */}
                                    <DetailSection title="Personal Information">
                                        <InfoGrid>
                                            <InfoItem label="Full Name"    value={ad.full_name || ad.username} />
                                            <InfoItem label="Email"        value={ad.email} />
                                            <InfoItem label="Father's Name" value={ad.father_name || rd.father_name || '—'} />
                                            <InfoItem label="CNIC"         value={ad.cnic || rd.cnic || '—'} />
                                            <InfoItem label="Address"      value={ad.address || rd.address || '—'} />
                                            <InfoItem label="Current Job"  value={ad.current_job || rd.current_job || '—'} />
                                        </InfoGrid>
                                    </DetailSection>

                                    {/* ── Resume ── */}
                                    <DetailSection title={`Resume${rd.title ? ': ' + rd.title : ''}`} icon={<FileText size={13} color="#6366f1" />}>
                                        {rd.education && (
                                            <div style={{ marginBottom: '16px' }}>
                                                <div style={s.infoLabel}><BookOpen size={11} style={{ marginRight: 4 }} />Education</div>
                                                <p style={s.textContent}>{rd.education}</p>
                                            </div>
                                        )}
                                        {rd.experience && (
                                            <div>
                                                <div style={s.infoLabel}><Briefcase size={11} style={{ marginRight: 4 }} />Experience</div>
                                                <p style={s.textContent}>{rd.experience}</p>
                                            </div>
                                        )}
                                        {!rd.education && !rd.experience && (
                                            <p style={{ color: '#475569', fontSize: '13px' }}>No resume data available</p>
                                        )}
                                    </DetailSection>

                                    {/* ── Test ── */}
                                    {td.has_test && (
                                        <DetailSection title="Test Details">
                                            <InfoGrid>
                                                <InfoItem label="Chapter"    value={td.chapter_name} />
                                                <InfoItem label="Deadline"   value={new Date(td.deadline).toLocaleString()} />
                                                <InfoItem label="Pass %"     value={`${td.pass_percentage}%`} />
                                                <InfoItem label="Completed"  value={td.test_completed ? 'Yes' : 'Pending'} />
                                            </InfoGrid>
                                            {td.result && (
                                                <div style={{ marginTop: '16px', padding: '14px', background: '#020617', borderRadius: '10px', border: '1px solid #1e293b' }}>
                                                    <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
                                                        <div>
                                                            <div style={s.infoLabel}>Score</div>
                                                            <div style={{ fontSize: '28px', fontWeight: '800', color: td.result.passed ? '#4ade80' : '#f87171' }}>
                                                                {Math.round(td.result.percentage)}%
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div style={s.infoLabel}>Correct Answers</div>
                                                            <div style={{ fontSize: '18px', fontWeight: '700', color: '#f1f5f9' }}>
                                                                {td.result.correct_answers} / {td.result.total_questions}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div style={s.infoLabel}>Result</div>
                                                            <span style={{
                                                                display: 'inline-block', padding: '4px 14px', borderRadius: '20px',
                                                                fontSize: '12px', fontWeight: '700',
                                                                ...(td.result.passed
                                                                    ? { backgroundColor: '#052e16', color: '#4ade80', border: '1px solid #14532d' }
                                                                    : { backgroundColor: '#2d0a0a', color: '#f87171', border: '1px solid #5a1a1a' })
                                                            }}>
                                                                {td.result.passed ? '✓ PASSED' : '✗ FAILED'}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <div style={s.infoLabel}>Completed At</div>
                                                            <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                                                                {new Date(td.result.completed_at).toLocaleString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </DetailSection>
                                    )}

                                    {/* ── Interview ── */}
                                    {iv.has_interview && (
                                        <DetailSection title="Interview Details" last>
                                            <InfoGrid>
                                                <div>
                                                    <div style={s.infoLabel}>Link</div>
                                                    <a href={iv.interview_link} target="_blank" rel="noopener noreferrer" style={s.link}>
                                                        Join Interview →
                                                    </a>
                                                </div>
                                                <InfoItem label="Date & Time" value={new Date(iv.interview_datetime).toLocaleString()} />
                                            </InfoGrid>
                                            {iv.message && (
                                                <div style={{ marginTop: '16px' }}>
                                                    <div style={s.infoLabel}>Message</div>
                                                    <p style={s.textContent}>{iv.message}</p>
                                                </div>
                                            )}
                                        </DetailSection>
                                    )}

                                    {/* No test / interview yet */}
                                    {!td.has_test && !iv.has_interview && (
                                        <DetailSection title="Pipeline" last>
                                            <p style={{ color: '#475569', fontSize: '13px', margin: 0 }}>
                                                No test or interview assigned yet.
                                            </p>
                                        </DetailSection>
                                    )}
                                </div>
                            </Modal>
                        );
                    })()}

                </div>
            </div>
        </div>
    );
};

/* ─── Sub-components ──────────────────────────────────────── */

const ActionBtn = ({ icon, label, color, onClick }) => (
    <button
        onClick={onClick}
        style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            padding: '5px 10px', fontSize: '11px', fontWeight: '700',
            color, backgroundColor: `${color}18`, border: `1px solid ${color}40`,
            borderRadius: '6px', cursor: 'pointer', letterSpacing: '0.3px',
            transition: 'all 0.15s', whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = `${color}30`; e.currentTarget.style.borderColor = `${color}80`; }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = `${color}18`; e.currentTarget.style.borderColor = `${color}40`; }}
    >
        {icon}{label}
    </button>
);

const Modal = ({ title, icon, onClose, children, wide }) => (
    <div style={s.modalOverlay} onClick={onClose}>
        <div style={{ ...s.modal, maxWidth: wide ? '800px' : '560px' }} onClick={(e) => e.stopPropagation()}>
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

const FormGroup    = ({ label, children })          => <div style={{ marginBottom: '20px' }}><label style={s.label}>{label}</label>{children}</div>;
const ModalFooter  = ({ onCancel, submitLabel })    => <div style={s.modalFooter}><button type="button" onClick={onCancel} style={s.cancelBtn}>Cancel</button><button type="submit" style={s.submitBtn}>{submitLabel}</button></div>;
const DetailSection = ({ title, children, last, icon }) => (
    <div style={{ marginBottom: last ? 0 : '24px', paddingBottom: last ? 0 : '24px', borderBottom: last ? 'none' : '1px solid #1e293b' }}>
        <h3 style={s.sectionTitle}>{icon && <span style={{ marginRight: 6 }}>{icon}</span>}{title}</h3>
        {children}
    </div>
);
const InfoGrid  = ({ children }) => <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>{children}</div>;
const InfoItem  = ({ label, value }) => <div><div style={s.infoLabel}>{label}</div><div style={s.infoValue}>{value || '—'}</div></div>;

/* ─── Styles ──────────────────────────────────────────────── */

const s = {
    container:   { display: 'flex', backgroundColor: '#020617', minHeight: '100vh' },
    mainContent: { marginLeft: '280px', flex: 1, display: 'flex', flexDirection: 'column' },
    content:     { padding: '100px 40px 40px 40px' },

    pageHeader:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px' },
    headerLeft:    { display: 'flex', alignItems: 'center', gap: '16px' },
    headerIconWrap:{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#0f172a', border: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    pageTitle:     { fontSize: '26px', fontWeight: '800', color: '#f8fafc', margin: 0, letterSpacing: '-0.5px' },
    pageSubtitle:  { color: '#64748b', fontSize: '14px', margin: '4px 0 0 0' },
    dateBadge:     { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '10px 16px', borderRadius: '10px', color: '#f8fafc', fontSize: '13px', fontWeight: '600' },
    exportBtn:     { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 16px', fontSize: '12px', fontWeight: '700', color: '#4ade80', backgroundColor: '#052e16', border: '1px solid #14532d', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.15s' },

    successAlert: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#052e16', border: '1px solid #14532d', borderRadius: '10px', padding: '12px 18px', marginBottom: '24px', color: '#4ade80', fontSize: '14px' },
    errorAlert:   { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#2d0a0a', border: '1px solid #5a1a1a', borderRadius: '10px', padding: '12px 18px', marginBottom: '24px', color: '#f87171', fontSize: '14px' },
    alertClose:   { background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', alignItems: 'center', opacity: 0.7 },

    filtersRow:  { display: 'flex', gap: '14px', marginBottom: '24px' },
    searchWrap:  { position: 'relative', flex: 1 },
    searchInput: { width: '100%', padding: '11px 16px 11px 42px', fontSize: '14px', backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', color: '#f1f5f9', outline: 'none', boxSizing: 'border-box' },
    selectWrap:  { position: 'relative', minWidth: '190px' },
    select:      { width: '100%', padding: '11px 36px 11px 38px', fontSize: '14px', backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', color: '#f1f5f9', outline: 'none', appearance: 'none', cursor: 'pointer', boxSizing: 'border-box' },

    tableCard:  { backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b', overflow: 'hidden' },
    table:      { width: '100%', borderCollapse: 'collapse' },
    th:         { textAlign: 'left', padding: '16px 20px', fontSize: '11px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.7px', backgroundColor: '#020617', borderBottom: '1px solid #1e293b' },
    tr:         { borderBottom: '1px solid #1e293b', transition: 'background 0.15s' },
    td:         { padding: '16px 20px', fontSize: '14px', color: '#cbd5e1', verticalAlign: 'middle' },

    applicantCell:          { display: 'flex', alignItems: 'center', gap: '12px' },
    applicantAvatar:        { width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #1e293b', flexShrink: 0 },
    applicantAvatarPlaceholder: { width: '38px', height: '38px', borderRadius: '50%', background: '#1e3a5f', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '700', flexShrink: 0 },
    applicantName:  { fontWeight: '600', color: '#f1f5f9', marginBottom: '3px' },
    applicantEmail: { fontSize: '12px', color: '#475569' },
    actions:        { display: 'flex', gap: '6px', flexWrap: 'wrap' },
    noData:         { textAlign: 'center', padding: '64px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center' },

    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modal:        { backgroundColor: '#0f172a', borderRadius: '18px', width: '90%', maxHeight: '90vh', overflow: 'auto', border: '1px solid #1e293b', boxShadow: '0 25px 60px rgba(0,0,0,0.6)' },
    modalHeader:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 28px', borderBottom: '1px solid #1e293b' },
    modalIconWrap:{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#020617', border: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    modalTitle:   { margin: 0, fontSize: '18px', fontWeight: '700', color: '#f1f5f9', letterSpacing: '-0.3px' },
    closeBtn:     { background: 'none', border: '1px solid #1e293b', borderRadius: '8px', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '6px' },
    modalBody:    { padding: '28px' },
    label:        { display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' },
    input:        { width: '100%', padding: '12px 16px', fontSize: '14px', backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', color: '#f1f5f9', outline: 'none', boxSizing: 'border-box' },
    textarea:     { width: '100%', padding: '12px 16px', fontSize: '14px', backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', color: '#f1f5f9', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' },
    modalFooter:  { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '28px' },
    cancelBtn:    { padding: '11px 22px', fontSize: '13px', fontWeight: '600', color: '#64748b', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px', cursor: 'pointer' },
    submitBtn:    { padding: '11px 22px', fontSize: '13px', fontWeight: '700', color: 'white', background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)', border: 'none', borderRadius: '10px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' },

    // Detail modal
    detailHeader:      { display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '28px', padding: '20px', background: '#020617', borderRadius: '12px', border: '1px solid #1e293b' },
    detailAvatar:      { width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #1e293b', flexShrink: 0 },
    detailAvatarPlaceholder: { width: '72px', height: '72px', borderRadius: '50%', background: '#1e3a5f', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '800', flexShrink: 0 },
    detailHeaderInfo:  { flex: 1 },
    detailName:        { fontSize: '20px', fontWeight: '800', color: '#f1f5f9', margin: '0 0 4px' },
    detailSubInfo:     { fontSize: '13px', color: '#64748b', margin: '0 0 6px' },
    detailJobBox:      { textAlign: 'right', flexShrink: 0 },
    detailJobLabel:    { fontSize: '10px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' },
    detailJobTitle:    { fontSize: '15px', fontWeight: '700', color: '#818cf8', margin: 0 },
    detailJobSub:      { fontSize: '12px', color: '#475569', margin: '3px 0 0' },

    sectionTitle: { margin: '0 0 16px 0', fontSize: '12px', fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'flex', alignItems: 'center' },
    infoLabel:    { fontSize: '10px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '5px', display: 'flex', alignItems: 'center' },
    infoValue:    { fontSize: '14px', color: '#f1f5f9', fontWeight: '500' },
    textContent:  { margin: '6px 0 0 0', fontSize: '14px', color: '#94a3b8', lineHeight: '1.6', whiteSpace: 'pre-wrap' },
    link:         { color: '#818cf8', textDecoration: 'none', fontSize: '14px', fontWeight: '600' },
};

export default DepartmentApplicants;