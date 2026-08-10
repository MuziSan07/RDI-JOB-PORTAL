import React, { useState, useEffect } from 'react';
import DepartmentSidebar from './DepartmentSidebar';
import DepartmentNavbar from './DepartmentNavbar';
import { authService } from '../../services/authService';
import { useResponsive } from '../../hooks/useResponsive';
import {
    Settings,
    Calendar,
    Lock,
    X,
    AlertCircle,
    CheckCircle,
    Building2,
    User,
    Image as ImageIcon,
    Save,
    Eye,
    EyeOff,
} from 'lucide-react';

const DepartmentSettings = () => {
    const { isMobile, isCompact } = useResponsive();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Department profile
    const [profile, setProfile] = useState({ username: '', email: '', name: '', tagline: '', bio: '', ceo_name: '', logo_url: null });
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [savingProfile, setSavingProfile] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(true);

    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: '',
    });

    useEffect(() => {
        (async () => {
            try {
                const data = await authService.getDepartmentProfile();
                setProfile(data);
            } catch (err) {
                setError('Failed to load department profile');
            } finally {
                setLoadingProfile(false);
            }
        })();
    }, []);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setLogoPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSavingProfile(true);
        try {
            const fd = new FormData();
            fd.append('username', profile.username);
            fd.append('name', profile.name);
            fd.append('tagline', profile.tagline || '');
            fd.append('ceo_name', profile.ceo_name);
            fd.append('bio', profile.bio);
            if (logoFile) fd.append('logo', logoFile);
            const updated = await authService.updateDepartmentProfile(fd);
            setProfile(updated);
            setLogoFile(null);
            setLogoPreview(null);
            setSuccess('Department profile updated successfully!');
            setTimeout(() => setSuccess(''), 5000);
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.detail || 'Failed to update profile');
        } finally {
            setSavingProfile(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (passwordData.new_password !== passwordData.confirm_password) {
            setError('New passwords do not match');
            return;
        }

        if (passwordData.new_password.length < 8) {
            setError('New password must be at least 8 characters long');
            return;
        }

        setSaving(true);
        try {
            await authService.changePassword(passwordData);
            setSuccess('Password changed successfully!');
            setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
            setTimeout(() => setSuccess(''), 5000);
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.detail || 'Failed to change password');
        } finally {
            setSaving(false);
        }
    };

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
                                <Settings size={20} color="#818cf8" />
                            </div>
                            <div>
                                <h1 style={s.pageTitle}>Settings</h1>
                                <p style={s.pageSubtitle}>Manage your account settings</p>
                            </div>
                        </div>
                        <div style={s.headerRight}>
                            <div style={s.dateBadge}>
                                <Calendar size={14} color="#6366f1" />
                                <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                        </div>
                    </header>

                    {/* Alerts */}
                    {success && (
                        <div style={s.successAlert}>
                            <CheckCircle size={16} />
                            <span>{success}</span>
                            <button onClick={() => setSuccess('')} style={s.alertClose}><X size={16} /></button>
                        </div>
                    )}
                    {error && (
                        <div style={s.errorAlert}>
                            <AlertCircle size={16} />
                            <span>{error}</span>
                            <button onClick={() => setError('')} style={s.alertClose}><X size={16} /></button>
                        </div>
                    )}

                    {/* Department Profile Card */}
                    <div style={{ ...s.settingsCard, ...(isMobile ? { padding: '20px 16px' } : {}), marginBottom: 24 }}>
                        <div style={s.cardHeader}>
                            <Building2 size={18} color="#818cf8" />
                            <h2 style={s.cardTitle}>Department Profile</h2>
                        </div>
                        {loadingProfile ? (
                            <p style={{ color: '#64748b', fontSize: 14 }}>Loading…</p>
                        ) : (
                        <form onSubmit={handleSaveProfile}>
                            {/* Logo */}
                            <div style={s.formGroup}>
                                <label style={s.label}>Department Logo</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <div style={s.logoPreviewWrap}>
                                        {(logoPreview || profile.logo_url) ? (
                                            <img src={logoPreview || profile.logo_url} alt="logo" style={s.logoPreviewImg} />
                                        ) : (
                                            <ImageIcon size={26} color="#334155" />
                                        )}
                                    </div>
                                    <label style={s.uploadBtn}>
                                        <ImageIcon size={14} /> Choose logo
                                        <input type="file" accept="image/*" onChange={handleLogoChange} style={{ display: 'none' }} />
                                    </label>
                                </div>
                            </div>

                            <FormField label="Department Name" icon={<Building2 size={14} />} value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })} required placeholder="Department name" />
                            <FormField label="Login Username" icon={<User size={14} />} value={profile.username}
                                onChange={(e) => setProfile({ ...profile, username: e.target.value })} required placeholder="Username" />
                            <FormField label="Email (login — read-only)" icon={<User size={14} />} value={profile.email}
                                onChange={() => {}} disabled placeholder="Email" />
                            <FormField label="Tagline" icon={<Settings size={14} />} value={profile.tagline}
                                onChange={(e) => setProfile({ ...profile, tagline: e.target.value })} placeholder="Short tagline (optional)" />
                            <FormField label="CEO / Head Name" icon={<User size={14} />} value={profile.ceo_name}
                                onChange={(e) => setProfile({ ...profile, ceo_name: e.target.value })} required placeholder="Name of the department head" />
                            <TextAreaField label="Bio" value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })} required placeholder="About the department" />

                            <button type="submit" disabled={savingProfile} style={s.saveBtn}>
                                <Save size={16} />
                                {savingProfile ? 'Saving…' : 'Save Profile'}
                            </button>
                        </form>
                        )}
                    </div>

                    {/* Password Change Card */}
                    <div style={{ ...s.settingsCard, ...(isMobile ? { padding: '20px 16px' } : {}) }}>
                        <div style={s.cardHeader}>
                            <Lock size={18} color="#818cf8" />
                            <h2 style={s.cardTitle}>Change Password</h2>
                        </div>
                        <form onSubmit={handleChangePassword}>
                            <FormField
                                label="Current Password"
                                icon={<Lock size={14} />}
                                type="password"
                                value={passwordData.current_password}
                                onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                                required
                                placeholder="Enter current password"
                            />
                            <FormField
                                label="New Password"
                                icon={<Lock size={14} />}
                                type="password"
                                value={passwordData.new_password}
                                onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                required
                                placeholder="Enter new password (min 8 characters)"
                            />
                            <FormField
                                label="Confirm New Password"
                                icon={<Lock size={14} />}
                                type="password"
                                value={passwordData.confirm_password}
                                onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                                required
                                placeholder="Confirm new password"
                            />

                            <button type="submit" disabled={saving} style={s.saveBtn}>
                                <Lock size={16} />
                                {saving ? 'Changing...' : 'Change Password'}
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

/* ─── Sub-components ──────────────────────────────── */

const FormField = ({ label, icon, value, onChange, type = 'text', required, placeholder, disabled }) => {
    const [show, setShow] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (show ? 'text' : 'password') : type;
    return (
        <div style={s.formGroup}>
            <label style={s.label}>{label}</label>
            <div style={s.inputWrap}>
                <div style={s.inputIcon}>{icon}</div>
                <input
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    required={required}
                    placeholder={placeholder}
                    disabled={disabled}
                    style={{ ...s.input, ...(isPassword ? { paddingRight: 42 } : {}), ...(disabled ? { opacity: 0.6, cursor: 'not-allowed' } : {}) }}
                />
                {isPassword && (
                    <button type="button" onClick={() => setShow((v) => !v)} tabIndex={-1} aria-label={show ? 'Hide password' : 'Show password'} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', padding: 4 }}>
                        {show ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                )}
            </div>
        </div>
    );
};

const TextAreaField = ({ label, value, onChange, required, placeholder }) => (
    <div style={s.formGroup}>
        <label style={s.label}>{label}</label>
        <textarea
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            rows={4}
            style={{ ...s.input, paddingLeft: 14, resize: 'vertical', fontFamily: 'inherit' }}
        />
    </div>
);

/* ─── Styles ──────────────────────────────────────── */

const s = {
    container: { display: 'flex', backgroundColor: '#020617', minHeight: '100vh' },
    mainContent: { marginLeft: '280px', flex: 1, display: 'flex', flexDirection: 'column' },
    content: { padding: '100px 40px 40px 40px', maxWidth: '800px' },

    pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px' },
    headerLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
    headerRight: { display: 'flex', alignItems: 'center', gap: '12px' },
    headerIconWrap: { width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#0f172a', border: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    pageTitle: { fontSize: '26px', fontWeight: '800', color: '#f8fafc', margin: 0, letterSpacing: '-0.5px' },
    pageSubtitle: { color: '#64748b', fontSize: '14px', margin: '4px 0 0 0' },
    dateBadge: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '10px 16px', borderRadius: '10px', color: '#f8fafc', fontSize: '13px', fontWeight: '600' },

    successAlert: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#052e16', border: '1px solid #14532d', borderRadius: '10px', padding: '12px 18px', marginBottom: '24px', color: '#4ade80', fontSize: '14px', fontWeight: '500' },
    errorAlert: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#2d0a0a', border: '1px solid #5a1a1a', borderRadius: '10px', padding: '12px 18px', marginBottom: '24px', color: '#f87171', fontSize: '14px', fontWeight: '500' },
    alertClose: { marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', alignItems: 'center', padding: '2px', opacity: 0.7 },

    settingsCard: { backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b', padding: '28px' },
    cardHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #1e293b' },
    cardTitle: { margin: 0, fontSize: '16px', fontWeight: '700', color: '#f1f5f9', letterSpacing: '-0.3px' },

    formGroup: { marginBottom: '20px' },
    label: { display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' },
    inputWrap: { position: 'relative' },
    inputIcon: { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569' },
    input: { width: '100%', padding: '11px 14px 11px 40px', fontSize: '14px', backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', color: '#f1f5f9', outline: 'none', boxSizing: 'border-box' },

    saveBtn: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '11px 24px', fontSize: '13px', fontWeight: '700', color: 'white', background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)', border: 'none', borderRadius: '10px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.35)', marginTop: '8px' },

    logoPreviewWrap: { width: 64, height: 64, borderRadius: 12, backgroundColor: '#020617', border: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 },
    logoPreviewImg: { width: '100%', height: '100%', objectFit: 'cover' },
    uploadBtn: { display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 16px', fontSize: 13, fontWeight: 600, color: '#c7d2fe', background: '#1e293b', border: '1px solid #334155', borderRadius: 10, cursor: 'pointer' },
};

export default DepartmentSettings;