import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User, Camera, Save, Plus, Trash2, Edit3, Star,
    Briefcase, FileText, CheckCircle, AlertCircle, ChevronRight,
    X, Eye, EyeOff, Award, MapPin, Phone, Mail, BookOpen, Clock,
    Upload, Download, Globe
} from 'lucide-react';
import { COLORS } from '../constants/colors';
import { COUNTRIES, idLabelFor, placeholderFor, validateNationalId, getCountry } from '../constants/countries';
import { DEGREES } from '../constants/degrees';
import SearchableSelect from '../components/common/SearchableSelect';
import { profileService } from '../services/profileService';
import { jobSeekerAuthService } from '../services/jobSeekerAuthService';
import { useResponsive } from '../hooks/useResponsive';
import UserNavbar from '../components/brand/UserNavbar';

const COUNTRY_OPTIONS = COUNTRIES.map(c => ({ value: c.code, label: c.name }));

// ─── Helpers ─────────────────────────────────────────────────────────────────

const Toast = ({ msg, type, onClose }) => (
    <div style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
        background: type === 'error' ? '#FEF2F2' : '#F0FDF4',
        color: type === 'error' ? '#991B1B' : '#14532D',
        border: `1px solid ${type === 'error' ? '#FECACA' : '#86EFAC'}`,
        borderRadius: 12, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10,
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontWeight: 600, fontSize: 14, maxWidth: 360,
    }}>
        {type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
        {msg}
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: 8, color: 'inherit' }}>
            <X size={16} />
        </button>
    </div>
);

const emptyResume = { title: '', first_name: '', last_name: '', father_name: '', country: '', cnic: '', address: '', current_job: '', experience: '', education: '' };

// ─── Main Component ──────────────────────────────────────────────────────────

const ProfilePage = () => {
    const navigate = useNavigate();
    const { isMobile, isCompact } = useResponsive();
    const fileInputRef = useRef(null);

    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingPic, setUploadingPic] = useState(false);
    const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'resumes'
    const [toast, setToast] = useState(null);
    const [editingResume, setEditingResume] = useState(null); // null | resume object | 'new'
    const [resumeForm, setResumeForm] = useState(emptyResume);
    const [resumeFile, setResumeFile] = useState(null); // uploaded PDF (File) to attach
    const [previewPic, setPreviewPic] = useState(null);

    // Profile form state
    const [profileForm, setProfileForm] = useState({
        first_name: '', last_name: '', father_name: '', country: '', cnic: '',
        address: '', current_job: '', experience: '', education: '',
    });

    useEffect(() => {
        const u = jobSeekerAuthService.getCurrentUser();
        if (!u) { navigate('/login'); return; }
        setUser(u);
        loadAll();
    }, []);

    const loadAll = async () => {
        setLoading(true);
        try {
            const [profileData, resumesData] = await Promise.all([
                profileService.getProfile(),
                profileService.getResumes(),
            ]);
            setProfile(profileData);
            setResumes(resumesData);
            setProfileForm({
                first_name: profileData.first_name || '',
                last_name: profileData.last_name || '',
                father_name: profileData.father_name || '',
                country: profileData.country || '',
                cnic: profileData.cnic || '',
                address: profileData.address || '',
                current_job: profileData.current_job || '',
                experience: profileData.experience || '',
                education: profileData.education || '',
            });
        } catch (err) {
            showToast('Failed to load profile', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    // ── Profile Picture ───────────────────────────────────────────────────────

    const handlePicSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPreviewPic(URL.createObjectURL(file));
        setUploadingPic(true);
        try {
            const result = await profileService.uploadProfilePicture(file);
            // Update stored user
            const updatedUser = { ...jobSeekerAuthService.getCurrentUser(), profile_picture: result.profile_picture_url };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setProfile(p => ({ ...p, profile_picture_url: result.profile_picture_url }));
            showToast('Profile picture updated!');
        } catch (err) {
            showToast(err.response?.data?.error || 'Failed to upload picture', 'error');
            setPreviewPic(null);
        } finally {
            setUploadingPic(false);
        }
    };

    // ── Profile Save ──────────────────────────────────────────────────────────

    const handleProfileSave = async () => {
        if (profileForm.cnic) {
            if (!profileForm.country) { showToast('Please select your country first', 'error'); return; }
            const check = validateNationalId(profileForm.country, profileForm.cnic);
            if (!check.valid) { showToast(check.message, 'error'); return; }
        }
        setSaving(true);
        try {
            await profileService.updateProfile(profileForm);
            const updatedUser = { ...jobSeekerAuthService.getCurrentUser(), ...profileForm };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            showToast('Profile saved successfully!');
        } catch (err) {
            showToast(err.response?.data?.error || 'Failed to save profile', 'error');
        } finally {
            setSaving(false);
        }
    };

    // ── Resume CRUD ───────────────────────────────────────────────────────────

    const openNewResume = () => {
        // Auto-fill details from the profile to save re-typing (all editable afterwards)
        setResumeForm({
            ...emptyResume,
            first_name: profileForm.first_name || '',
            last_name: profileForm.last_name || '',
            father_name: profileForm.father_name || '',
            country: profileForm.country || '',
            cnic: profileForm.cnic || '',
            address: profileForm.address || '',
            current_job: profileForm.current_job || '',
            experience: profileForm.experience || '',
            education: profileForm.education || '',
        });
        setResumeFile(null);
        setEditingResume('new');
    };

    const openEditResume = (r) => {
        setResumeForm({
            title: r.title, first_name: r.first_name || '', last_name: r.last_name || '',
            father_name: r.father_name, country: r.country || '', cnic: r.cnic,
            address: r.address, current_job: r.current_job || '',
            experience: r.experience, education: r.education,
        });
        setResumeFile(null);
        setEditingResume(r);
    };

    const handleResumeSave = async () => {
        if (!resumeForm.title || !resumeForm.father_name || !resumeForm.cnic ||
            !resumeForm.address || !resumeForm.experience || !resumeForm.education) {
            showToast('Please fill all required fields', 'error');
            return;
        }
        if (!resumeForm.country) { showToast('Please select a country', 'error'); return; }
        const idCheck = validateNationalId(resumeForm.country, resumeForm.cnic);
        if (!idCheck.valid) { showToast(idCheck.message, 'error'); return; }
        if (resumeFile && resumeFile.size > 5 * 1024 * 1024) {
            showToast('PDF must be under 5 MB', 'error');
            return;
        }
        const payload = { ...resumeForm, ...(resumeFile ? { resume_file: resumeFile } : {}) };
        setSaving(true);
        try {
            if (editingResume === 'new') {
                const created = await profileService.createResume(payload);
                setResumes(prev => [created, ...prev]);
                showToast('Resume created!');
            } else {
                const updated = await profileService.updateResume(editingResume.id, payload);
                setResumes(prev => prev.map(r => r.id === editingResume.id
                    ? { ...r, ...resumeForm, resume_file: updated?.resume_file ?? r.resume_file }
                    : r));
                showToast('Resume updated!');
            }
            setEditingResume(null);
            setResumeFile(null);
        } catch (err) {
            showToast(err.response?.data?.error || 'Failed to save resume', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteResume = async (r) => {
        if (!window.confirm(`Delete resume "${r.title}"?`)) return;
        try {
            await profileService.deleteResume(r.id);
            setResumes(prev => prev.filter(x => x.id !== r.id));
            showToast('Resume deleted');
        } catch (err) {
            showToast(err.response?.data?.error || 'Failed to delete resume', 'error');
        }
    };

    const handleSetPrimary = async (r) => {
        try {
            await profileService.setPrimaryResume(r.id);
            setResumes(prev => prev.map(x => ({ ...x, is_primary: x.id === r.id })));
            showToast(`"${r.title}" is now your primary resume`);
        } catch (err) {
            showToast('Failed to set primary', 'error');
        }
    };

    // ─── Computed ──────────────────────────────────────────────────────────────

    const picSrc = previewPic || profile?.profile_picture_url || user?.profile_picture;
    const hasPicture = !!picSrc;
    const primaryResume = resumes.find(r => r.is_primary);
    const profileComplete = hasPicture && resumes.length > 0;

    if (loading) {
        return (
            <div style={s.fullCenter}>
                <div style={s.spinner} />
                <p style={{ color: '#94A3B8', marginTop: 12 }}>Loading profile...</p>
            </div>
        );
    }

    return (
        <div style={s.root}>
            {/* Navbar */}
            <UserNavbar />

            <div style={{ ...s.page, ...(isCompact ? { flexDirection: 'column', padding: isMobile ? '16px' : '24px' } : {}) }}>

                {/* ── LEFT SIDEBAR ── */}
                <aside style={{ ...s.sidebar, ...(isCompact ? { width: '100%', position: 'static' } : {}) }}>
                    {/* Avatar + upload */}
                    <div style={s.avatarCard}>
                        <div style={s.avatarWrap}>
                            {picSrc
                                ? <img src={picSrc} alt="" style={s.avatarImg} />
                                : <div style={s.avatarPlaceholder}><User size={40} color="#94A3B8" /></div>
                            }
                            <button
                                style={s.cameraBtn}
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploadingPic}
                                title="Upload profile picture"
                            >
                                {uploadingPic ? <div style={s.miniSpinner} /> : <Camera size={16} color="white" />}
                            </button>
                            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePicSelect} />
                        </div>
                        <h3 style={s.sidebarName}>
                            {profileForm.first_name && profileForm.last_name
                                ? `${profileForm.first_name} ${profileForm.last_name}`
                                : user?.username}
                        </h3>
                        <p style={s.sidebarEmail}>{profile?.email}</p>
                        {profileForm.current_job && <p style={s.sidebarRole}>{profileForm.current_job}</p>}
                    </div>

                    {/* Profile completeness */}
                    <div style={s.completenessCard}>
                        <h4 style={s.completenessTitle}>Profile Completeness</h4>
                        <div style={s.checkRow}>
                            <span style={{ ...s.checkDot, background: hasPicture ? COLORS.secondary : '#E2E8F0' }}>
                                {hasPicture ? <CheckCircle size={12} color="white" /> : <span style={{ fontSize: 10, color: '#94A3B8' }}>!</span>}
                            </span>
                            <span style={{ ...s.checkLabel, color: hasPicture ? '#0F172A' : '#94A3B8' }}>Profile picture</span>
                            {!hasPicture && <button onClick={() => fileInputRef.current?.click()} style={s.fixBtn}>Upload</button>}
                        </div>
                        <div style={s.checkRow}>
                            <span style={{ ...s.checkDot, background: profileForm.first_name ? COLORS.secondary : '#E2E8F0' }}>
                                {profileForm.first_name ? <CheckCircle size={12} color="white" /> : <span style={{ fontSize: 10, color: '#94A3B8' }}>!</span>}
                            </span>
                            <span style={{ ...s.checkLabel, color: profileForm.first_name ? '#0F172A' : '#94A3B8' }}>Full name</span>
                        </div>
                        <div style={s.checkRow}>
                            <span style={{ ...s.checkDot, background: resumes.length > 0 ? COLORS.secondary : '#E2E8F0' }}>
                                {resumes.length > 0 ? <CheckCircle size={12} color="white" /> : <span style={{ fontSize: 10, color: '#94A3B8' }}>!</span>}
                            </span>
                            <span style={{ ...s.checkLabel, color: resumes.length > 0 ? '#0F172A' : '#94A3B8' }}>At least 1 resume</span>
                            {resumes.length === 0 && <button onClick={() => { setActiveTab('resumes'); openNewResume(); }} style={s.fixBtn}>Create</button>}
                        </div>
                        <div style={s.checkRow}>
                            <span style={{ ...s.checkDot, background: profileForm.experience ? COLORS.secondary : '#E2E8F0' }}>
                                {profileForm.experience ? <CheckCircle size={12} color="white" /> : <span style={{ fontSize: 10, color: '#94A3B8' }}>!</span>}
                            </span>
                            <span style={{ ...s.checkLabel, color: profileForm.experience ? '#0F172A' : '#94A3B8' }}>Experience</span>
                        </div>

                        {profileComplete && (
                            <div style={s.readyBadge}>
                                <CheckCircle size={14} color={COLORS.secondary} />
                                Ready to apply!
                            </div>
                        )}
                        {!profileComplete && (
                            <div style={s.notReadyBadge}>
                                <AlertCircle size={14} color="#C2410C" />
                                Complete profile to apply
                            </div>
                        )}
                    </div>

                    {/* Quick nav */}
                    <div style={s.quickNav}>
                        {[
                            { tab: 'profile', icon: <User size={15} />, label: 'Edit Profile' },
                            { tab: 'resumes', icon: <FileText size={15} />, label: `Resumes (${resumes.length})` },
                        ].map(({ tab, icon, label }) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{ ...s.quickNavBtn, ...(activeTab === tab ? s.quickNavBtnActive : {}) }}
                            >
                                {icon} {label}
                                <ChevronRight size={14} style={{ marginLeft: 'auto' }} />
                            </button>
                        ))}
                        <button onClick={() => navigate('/my-applications')} style={s.quickNavBtn}>
                            <Briefcase size={15} /> My Applications <ChevronRight size={14} style={{ marginLeft: 'auto' }} />
                        </button>
                        <button onClick={() => navigate('/jobs')} style={s.quickNavBtn}>
                            <Award size={15} /> Browse Jobs <ChevronRight size={14} style={{ marginLeft: 'auto' }} />
                        </button>
                    </div>
                </aside>

                {/* ── MAIN CONTENT ── */}
                <main style={s.main}>
                    {/* Tabs */}
                    <div style={s.tabs}>
                        <button onClick={() => setActiveTab('profile')} style={{ ...s.tab, ...(activeTab === 'profile' ? s.tabActive : {}) }}>
                            <User size={16} /> Profile
                        </button>
                        <button onClick={() => setActiveTab('resumes')} style={{ ...s.tab, ...(activeTab === 'resumes' ? s.tabActive : {}) }}>
                            <FileText size={16} /> Resumes
                            {resumes.length > 0 && <span style={s.tabBadge}>{resumes.length}</span>}
                        </button>
                    </div>

                    {/* ── PROFILE TAB ── */}
                    {activeTab === 'profile' && (
                        <div style={{ ...s.card, ...(isMobile ? { padding: '20px 18px' } : {}) }}>
                            <div style={{ ...s.cardHeader, ...(isMobile ? { flexDirection: 'column', alignItems: 'stretch' } : {}) }}>
                                <div>
                                    <h2 style={s.cardTitle}>Personal Information</h2>
                                    <p style={s.cardSub}>This information is visible to employers when you apply</p>
                                </div>
                                <button onClick={handleProfileSave} disabled={saving} style={{ ...s.saveBtn, ...(isMobile ? { justifyContent: 'center' } : {}) }}>
                                    {saving ? 'Saving...' : <><Save size={15} /> Save Changes</>}
                                </button>
                            </div>

                            <div style={{ ...s.formGrid, ...(isMobile ? { gridTemplateColumns: '1fr' } : {}) }}>
                                <Field label="First Name *" icon={<User size={14} />}>
                                    <input style={s.input} value={profileForm.first_name} onChange={e => setProfileForm(p => ({ ...p, first_name: e.target.value }))} placeholder="Your first name" />
                                </Field>
                                <Field label="Last Name *" icon={<User size={14} />}>
                                    <input style={s.input} value={profileForm.last_name} onChange={e => setProfileForm(p => ({ ...p, last_name: e.target.value }))} placeholder="Your last name" />
                                </Field>
                                <Field label="Father's Name *" icon={<User size={14} />}>
                                    <input style={s.input} value={profileForm.father_name} onChange={e => setProfileForm(p => ({ ...p, father_name: e.target.value }))} placeholder="Father's full name" />
                                </Field>
                                <Field label="Country *" icon={<Globe size={14} />}>
                                    <SearchableSelect
                                        value={profileForm.country}
                                        onChange={(v) => setProfileForm(p => ({ ...p, country: v, cnic: '' }))}
                                        options={COUNTRY_OPTIONS}
                                        placeholder="Select your country…"
                                        searchPlaceholder="Search countries…"
                                    />
                                </Field>
                                <Field label={`${idLabelFor(profileForm.country)} *`} icon={<FileText size={14} />}>
                                    <input
                                        style={{ ...s.input, ...(profileForm.cnic && !validateNationalId(profileForm.country, profileForm.cnic).valid ? { borderColor: '#EF4444' } : {}) }}
                                        value={profileForm.cnic}
                                        onChange={e => setProfileForm(p => ({ ...p, cnic: e.target.value }))}
                                        placeholder={placeholderFor(profileForm.country)}
                                        disabled={!profileForm.country}
                                    />
                                    {profileForm.cnic && !validateNationalId(profileForm.country, profileForm.cnic).valid && (
                                        <span style={s.fieldError}>{validateNationalId(profileForm.country, profileForm.cnic).message}</span>
                                    )}
                                </Field>
                                <Field label="Current Job Title" icon={<Briefcase size={14} />}>
                                    <input style={s.input} value={profileForm.current_job} onChange={e => setProfileForm(p => ({ ...p, current_job: e.target.value }))} placeholder="e.g. Software Engineer" />
                                </Field>
                                <Field label="Address *" icon={<MapPin size={14} />}>
                                    <input style={s.input} value={profileForm.address} onChange={e => setProfileForm(p => ({ ...p, address: e.target.value }))} placeholder="Your full address" />
                                </Field>
                            </div>

                            <Field label="Degree / Education *" icon={<BookOpen size={14} />} full>
                                <SearchableSelect
                                    value={profileForm.education}
                                    onChange={(v) => setProfileForm(p => ({ ...p, education: v }))}
                                    options={DEGREES}
                                    placeholder="Select your degree…"
                                    searchPlaceholder="Search degrees…"
                                    allowOther
                                />
                            </Field>
                            <Field label="Experience *" icon={<Clock size={14} />} full>
                                <textarea style={s.textarea} rows={4} value={profileForm.experience} onChange={e => setProfileForm(p => ({ ...p, experience: e.target.value }))} placeholder="Describe your work experience, skills, and achievements..." />
                            </Field>

                            <div style={{ ...s.hintBox, marginTop: 8 }}>
                                <AlertCircle size={15} color="#1D4ED8" />
                                <span>Your profile data is separate from resumes. Resumes let you tailor applications per job.</span>
                            </div>
                        </div>
                    )}

                    {/* ── RESUMES TAB ── */}
                    {activeTab === 'resumes' && (
                        <div>
                            {/* Header */}
                            <div style={{ ...s.resumeHeader, ...(isMobile ? { flexDirection: 'column', alignItems: 'stretch', gap: 12 } : {}) }}>
                                <div>
                                    <h2 style={s.cardTitle}>My Resumes</h2>
                                    <p style={s.cardSub}>You must have at least one resume to apply for jobs. Mark your best one as Primary.</p>
                                </div>
                                <button onClick={openNewResume} style={{ ...s.addResumeBtn, ...(isMobile ? { justifyContent: 'center' } : {}) }}>
                                    <Plus size={16} /> New Resume
                                </button>
                            </div>

                            {resumes.length === 0 && !editingResume && (
                                <div style={s.emptyResume}>
                                    <FileText size={48} color="#CBD5E1" />
                                    <h3 style={s.emptyTitle}>No resumes yet</h3>
                                    <p style={s.emptySub}>Create your first resume to start applying for jobs</p>
                                    <button onClick={openNewResume} style={s.saveBtn}><Plus size={15} /> Create Resume</button>
                                </div>
                            )}

                            {/* Resume list */}
                            <div style={s.resumeList}>
                                {resumes.map(r => (
                                    <ResumeCard
                                        key={r.id}
                                        resume={r}
                                        isMobile={isMobile}
                                        onEdit={() => openEditResume(r)}
                                        onDelete={() => handleDeleteResume(r)}
                                        onSetPrimary={() => handleSetPrimary(r)}
                                    />
                                ))}
                            </div>

                            {/* Resume form (inline) */}
                            {editingResume && (
                                <div style={{ ...s.resumeFormCard, ...(isMobile ? { padding: '20px 18px' } : {}) }}>
                                    <div style={s.cardHeader}>
                                        <h3 style={s.cardTitle}>
                                            {editingResume === 'new' ? 'Create New Resume' : `Edit: ${editingResume.title}`}
                                        </h3>
                                        <button onClick={() => setEditingResume(null)} style={s.closeBtn}><X size={18} /></button>
                                    </div>

                                    <div style={{ ...s.formGrid, ...(isMobile ? { gridTemplateColumns: '1fr' } : {}) }}>
                                        <Field label="Resume Title *" icon={<FileText size={14} />} full>
                                            <input style={s.input} value={resumeForm.title} onChange={e => setResumeForm(p => ({ ...p, title: e.target.value }))} placeholder='e.g. "Senior Dev Resume" or "Management Application"' />
                                        </Field>
                                        <Field label="First Name" icon={<User size={14} />}>
                                            <input style={s.input} value={resumeForm.first_name} onChange={e => setResumeForm(p => ({ ...p, first_name: e.target.value }))} placeholder="First name" />
                                        </Field>
                                        <Field label="Last Name" icon={<User size={14} />}>
                                            <input style={s.input} value={resumeForm.last_name} onChange={e => setResumeForm(p => ({ ...p, last_name: e.target.value }))} placeholder="Last name" />
                                        </Field>
                                        <Field label="Father's Name *" icon={<User size={14} />}>
                                            <input style={s.input} value={resumeForm.father_name} onChange={e => setResumeForm(p => ({ ...p, father_name: e.target.value }))} placeholder="Father's full name" />
                                        </Field>
                                        <Field label="Country *" icon={<Globe size={14} />}>
                                            <SearchableSelect
                                                value={resumeForm.country}
                                                onChange={(v) => setResumeForm(p => ({ ...p, country: v, cnic: '' }))}
                                                options={COUNTRY_OPTIONS}
                                                placeholder="Select country…"
                                                searchPlaceholder="Search countries…"
                                            />
                                        </Field>
                                        <Field label={`${idLabelFor(resumeForm.country)} *`} icon={<FileText size={14} />}>
                                            <input
                                                style={{ ...s.input, ...(resumeForm.cnic && !validateNationalId(resumeForm.country, resumeForm.cnic).valid ? { borderColor: '#EF4444' } : {}) }}
                                                value={resumeForm.cnic}
                                                onChange={e => setResumeForm(p => ({ ...p, cnic: e.target.value }))}
                                                placeholder={placeholderFor(resumeForm.country)}
                                                disabled={!resumeForm.country}
                                            />
                                            {resumeForm.cnic && !validateNationalId(resumeForm.country, resumeForm.cnic).valid && (
                                                <span style={s.fieldError}>{validateNationalId(resumeForm.country, resumeForm.cnic).message}</span>
                                            )}
                                        </Field>
                                        <Field label="Current Job Title" icon={<Briefcase size={14} />}>
                                            <input style={s.input} value={resumeForm.current_job} onChange={e => setResumeForm(p => ({ ...p, current_job: e.target.value }))} placeholder="e.g. Software Engineer" />
                                        </Field>
                                        <Field label="Address *" icon={<MapPin size={14} />} full>
                                            <input style={s.input} value={resumeForm.address} onChange={e => setResumeForm(p => ({ ...p, address: e.target.value }))} placeholder="Your address" />
                                        </Field>
                                    </div>
                                    <Field label="Degree / Education *" icon={<BookOpen size={14} />} full>
                                        <SearchableSelect
                                            value={resumeForm.education}
                                            onChange={(v) => setResumeForm(p => ({ ...p, education: v }))}
                                            options={DEGREES}
                                            placeholder="Select your degree…"
                                            searchPlaceholder="Search degrees…"
                                            allowOther
                                        />
                                    </Field>
                                    <Field label="Experience *" icon={<Clock size={14} />} full>
                                        <textarea style={s.textarea} rows={5} value={resumeForm.experience} onChange={e => setResumeForm(p => ({ ...p, experience: e.target.value }))} placeholder="Work experience, skills, achievements..." />
                                    </Field>

                                    {/* Optional PDF/DOC upload — attached alongside the structured resume */}
                                    <Field label="Attach Resume File (PDF/DOC — optional)" icon={<Upload size={14} />} full>
                                        <label style={s.uploadBox}>
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx,application/pdf"
                                                style={{ display: 'none' }}
                                                onChange={e => setResumeFile(e.target.files?.[0] || null)}
                                            />
                                            <Upload size={18} color={COLORS.primary} />
                                            <span style={s.uploadBoxText}>
                                                {resumeFile
                                                    ? resumeFile.name
                                                    : 'Click to upload a PDF or DOC (max 5 MB)'}
                                            </span>
                                        </label>
                                        {/* existing / newly-selected file indicators */}
                                        {resumeFile ? (
                                            <div style={s.fileHint}>
                                                <CheckCircle size={13} color={COLORS.secondary} /> New file selected — save to upload.
                                                <button type="button" onClick={() => setResumeFile(null)} style={s.fileRemoveBtn}>Remove</button>
                                            </div>
                                        ) : editingResume?.resume_file ? (
                                            <div style={s.fileHint}>
                                                <FileText size={13} color={COLORS.primary} />
                                                <a href={editingResume.resume_file} target="_blank" rel="noopener noreferrer" style={s.fileLink}>View current file</a>
                                                <span style={{ color: '#94A3B8' }}>· upload a new one to replace it</span>
                                            </div>
                                        ) : null}
                                    </Field>

                                    <div style={s.resumeFormActions}>
                                        <button onClick={() => setEditingResume(null)} style={s.cancelBtn}>Cancel</button>
                                        <button onClick={handleResumeSave} disabled={saving} style={s.saveBtn}>
                                            {saving ? 'Saving...' : <><Save size={15} /> {editingResume === 'new' ? 'Create Resume' : 'Save Changes'}</>}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

// ─── Field wrapper ────────────────────────────────────────────────────────────

const Field = ({ label, icon, children, full }) => (
    <div style={{ gridColumn: full ? '1 / -1' : undefined, marginBottom: 4 }}>
        <label style={s.fieldLabel}>{icon}{label}</label>
        {children}
    </div>
);

// ─── Resume Card ──────────────────────────────────────────────────────────────

const ResumeCard = ({ resume: r, isMobile, onEdit, onDelete, onSetPrimary }) => {
    const [expanded, setExpanded] = useState(false);
    return (
        <div style={{ ...s.resumeCard, ...(r.is_primary ? s.resumeCardPrimary : {}) }}>
            <div style={s.resumeCardTop}>
                <div style={s.resumeCardLeft}>
                    <div style={s.resumeCardIcon}>
                        <FileText size={20} color={r.is_primary ? COLORS.primary : '#64748B'} />
                    </div>
                    <div>
                        <div style={s.resumeCardTitleRow}>
                            <h4 style={s.resumeCardTitle}>{r.title}</h4>
                            {r.is_primary && (
                                <span style={s.primaryBadge}><Star size={11} fill="#F59E0B" color="#F59E0B" /> Primary</span>
                            )}
                        </div>
                        {r.current_job && <p style={s.resumeCardSub}>{r.current_job}</p>}
                        <p style={s.resumeCardDate}>Created {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                </div>
                <div style={s.resumeCardActions}>
                    {r.resume_file && (
                        <a href={r.resume_file} target="_blank" rel="noopener noreferrer" style={{ ...s.rcBtn, color: COLORS.secondary, textDecoration: 'none' }} title="View attached PDF/DOC">
                            <Download size={15} />
                        </a>
                    )}
                    <button onClick={() => setExpanded(v => !v)} style={s.rcBtn} title="Preview">
                        {expanded ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    {!r.is_primary && (
                        <button onClick={onSetPrimary} style={{ ...s.rcBtn, color: '#F59E0B' }} title="Set as primary">
                            <Star size={15} />
                        </button>
                    )}
                    <button onClick={onEdit} style={{ ...s.rcBtn, color: COLORS.primary }} title="Edit">
                        <Edit3 size={15} />
                    </button>
                    <button onClick={onDelete} style={{ ...s.rcBtn, color: '#EF4444' }} title="Delete">
                        <Trash2 size={15} />
                    </button>
                </div>
            </div>

            {/* Expanded preview */}
            {expanded && (
                <div style={s.resumePreview}>
                    <div style={{ ...s.previewGrid, ...(isMobile ? { gridTemplateColumns: '1fr' } : {}) }}>
                        <PreviewRow label="Name" value={[r.first_name, r.last_name].filter(Boolean).join(' ') || '—'} />
                        <PreviewRow label="Father's Name" value={r.father_name} />
                        <PreviewRow label="Country" value={getCountry(r.country)?.name || r.country || '—'} />
                        <PreviewRow label={idLabelFor(r.country)} value={r.cnic} />
                        <PreviewRow label="Address" value={r.address} />
                        {r.current_job && <PreviewRow label="Current Job" value={r.current_job} />}
                    </div>
                    <PreviewSection label="Education" value={r.education} />
                    <PreviewSection label="Experience" value={r.experience} />
                </div>
            )}
        </div>
    );
};

const PreviewRow = ({ label, value }) => (
    <div style={s.previewRow}><span style={s.previewLabel}>{label}</span><span style={s.previewValue}>{value}</span></div>
);
const PreviewSection = ({ label, value }) => (
    <div style={{ marginTop: 12 }}>
        <p style={s.previewSectionLabel}>{label}</p>
        <p style={s.previewSectionValue}>{value}</p>
    </div>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = {
    root: { minHeight: '100vh', background: '#F1F5F9', fontFamily: "system-ui, -apple-system, sans-serif" },
    fullCenter: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' },
    spinner: { width: 36, height: 36, border: '4px solid #E2E8F0', borderTop: `4px solid ${COLORS.primary}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
    miniSpinner: { width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },

    navbar: { background: 'white', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 200, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
    navInner: { maxWidth: 1400, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', gap: 20 },
    logo: { display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flexShrink: 0 },
    logoMark: { display: 'flex', gap: 3 },
    dot: { width: 10, height: 10, borderRadius: '50%' },
    logoText: { fontSize: 20, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' },
    navRight: { display: 'flex', alignItems: 'center', gap: 16, marginLeft: 'auto' },
    navTextBtn: { background: 'none', border: 'none', color: '#475569', fontSize: 14, fontWeight: 500, cursor: 'pointer' },
    logoutBtn: { display: 'flex', alignItems: 'center', gap: 6, background: '#FEF2F2', color: '#DC2626', border: 'none', padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' },

    page: { maxWidth: 1300, margin: '0 auto', padding: '28px 24px', display: 'flex', gap: 24, alignItems: 'flex-start' },

    sidebar: { width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 80 },

    avatarCard: { background: 'white', borderRadius: 14, border: '1px solid #E2E8F0', padding: '24px 20px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
    avatarWrap: { position: 'relative', width: 90, height: 90, margin: '0 auto 14px' },
    avatarImg: { width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', border: '3px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' },
    avatarPlaceholder: { width: 90, height: 90, borderRadius: '50%', background: '#F1F5F9', border: '3px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
    cameraBtn: { position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderRadius: '50%', background: COLORS.primary, border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
    sidebarName: { fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 3px' },
    sidebarEmail: { fontSize: 12, color: '#94A3B8', margin: 0 },
    sidebarRole: { fontSize: 12, color: '#64748B', margin: '4px 0 0', fontStyle: 'italic' },

    completenessCard: { background: 'white', borderRadius: 14, border: '1px solid #E2E8F0', padding: '16px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
    completenessTitle: { fontSize: 13, fontWeight: 700, color: '#0F172A', margin: '0 0 12px' },
    checkRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 },
    checkDot: { width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    checkLabel: { fontSize: 12, flex: 1 },
    fixBtn: { background: 'none', border: 'none', color: COLORS.primary, fontSize: 11, fontWeight: 700, cursor: 'pointer', padding: 0 },
    readyBadge: { display: 'flex', alignItems: 'center', gap: 6, background: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0', borderRadius: 8, padding: '8px 12px', fontSize: 12, fontWeight: 600, marginTop: 4 },
    notReadyBadge: { display: 'flex', alignItems: 'center', gap: 6, background: '#FFF7ED', color: '#9A3412', border: '1px solid #FED7AA', borderRadius: 8, padding: '8px 12px', fontSize: 12, fontWeight: 600, marginTop: 4 },

    quickNav: { background: 'white', borderRadius: 14, border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
    quickNavBtn: { display: 'flex', alignItems: 'center', gap: 9, width: '100%', background: 'none', border: 'none', borderBottom: '1px solid #F1F5F9', padding: '12px 16px', fontSize: 13, fontWeight: 500, color: '#374151', cursor: 'pointer', textAlign: 'left' },
    quickNavBtnActive: { background: '#EFF6FF', color: COLORS.primary, fontWeight: 700 },

    main: { flex: 1, minWidth: 0 },
    tabs: { display: 'flex', gap: 4, marginBottom: 20, background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: 4 },
    tab: { display: 'flex', alignItems: 'center', gap: 7, flex: 1, justifyContent: 'center', padding: '10px 0', borderRadius: 9, border: 'none', background: 'none', fontSize: 14, fontWeight: 500, color: '#64748B', cursor: 'pointer' },
    tabActive: { background: COLORS.primary, color: 'white', fontWeight: 700 },
    tabBadge: { background: 'rgba(255,255,255,0.3)', color: 'white', fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 20 },

    card: { background: 'white', borderRadius: 14, border: '1px solid #E2E8F0', padding: '24px 28px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, gap: 16 },
    cardTitle: { fontSize: 18, fontWeight: 700, color: '#0F172A', margin: '0 0 4px' },
    cardSub: { fontSize: 13, color: '#64748B', margin: 0 },
    saveBtn: { display: 'flex', alignItems: 'center', gap: 7, background: COLORS.primary, color: 'white', border: 'none', padding: '10px 20px', borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: 'pointer', flexShrink: 0 },
    cancelBtn: { background: '#F1F5F9', color: '#475569', border: 'none', padding: '10px 20px', borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
    closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 4 },

    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px', marginBottom: 14 },
    fieldLabel: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 },
    input: { width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14, color: '#0F172A', outline: 'none', background: '#FAFAFA', boxSizing: 'border-box' },
    fieldError: { display: 'block', marginTop: 5, fontSize: 12, color: '#DC2626', fontWeight: 500 },
    textarea: { width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14, color: '#0F172A', outline: 'none', background: '#FAFAFA', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' },
    uploadBox: { display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', border: '1.5px dashed #CBD5E1', borderRadius: 10, background: '#F8FAFC', cursor: 'pointer', boxSizing: 'border-box' },
    uploadBoxText: { fontSize: 13.5, color: '#475569', fontWeight: 500, wordBreak: 'break-all' },
    fileHint: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginTop: 8, fontSize: 12.5, color: '#475569' },
    fileLink: { color: COLORS.primary, fontWeight: 600, textDecoration: 'none' },
    fileRemoveBtn: { background: 'none', border: 'none', color: '#EF4444', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', padding: 0, marginLeft: 4 },
    hintBox: { display: 'flex', alignItems: 'flex-start', gap: 8, background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#1E40AF' },

    resumeHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
    addResumeBtn: { display: 'flex', alignItems: 'center', gap: 7, background: COLORS.primary, color: 'white', border: 'none', padding: '10px 18px', borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
    resumeList: { display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 },
    emptyResume: { background: 'white', borderRadius: 14, border: '1px solid #E2E8F0', padding: '60px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 16 },
    emptyTitle: { fontSize: 17, fontWeight: 700, color: '#0F172A', margin: 0 },
    emptySub: { fontSize: 13, color: '#64748B', margin: 0 },

    resumeCard: { background: 'white', borderRadius: 13, border: '1px solid #E2E8F0', padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
    resumeCardPrimary: { border: `2px solid ${COLORS.primary}`, background: '#FAFCFF' },
    resumeCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    resumeCardLeft: { display: 'flex', gap: 12, flex: 1, minWidth: 0 },
    resumeCardIcon: { width: 42, height: 42, borderRadius: 10, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    resumeCardTitleRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 },
    resumeCardTitle: { fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 },
    primaryBadge: { display: 'flex', alignItems: 'center', gap: 4, background: '#FFFBEB', color: '#92400E', border: '1px solid #FDE68A', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 },
    resumeCardSub: { fontSize: 12, color: '#64748B', margin: '0 0 2px' },
    resumeCardDate: { fontSize: 11, color: '#94A3B8', margin: 0 },
    resumeCardActions: { display: 'flex', gap: 4, flexShrink: 0 },
    rcBtn: { width: 32, height: 32, borderRadius: 7, border: '1px solid #E2E8F0', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B' },

    resumePreview: { marginTop: 16, paddingTop: 16, borderTop: '1px solid #F1F5F9' },
    previewGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' },
    previewRow: { display: 'flex', flexDirection: 'column' },
    previewLabel: { fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 },
    previewValue: { fontSize: 13, color: '#334155' },
    previewSectionLabel: { fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' },
    previewSectionValue: { fontSize: 13, color: '#334155', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-line' },

    resumeFormCard: { background: 'white', borderRadius: 14, border: `2px solid ${COLORS.primary}`, padding: '24px 28px', boxShadow: '0 4px 16px rgba(43,107,230,0.12)' },
    resumeFormActions: { display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 },
};

const styleEl = document.createElement('style');
styleEl.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
document.head.appendChild(styleEl);

export default ProfilePage;
