import React, { useState } from 'react';
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
} from 'lucide-react';

const DepartmentSettings = () => {
    const { isMobile, isCompact } = useResponsive();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: '',
    });

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

const FormField = ({ label, icon, value, onChange, type = 'text', required, placeholder }) => (
    <div style={s.formGroup}>
        <label style={s.label}>{label}</label>
        <div style={s.inputWrap}>
            <div style={s.inputIcon}>{icon}</div>
            <input
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                style={s.input}
            />
        </div>
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
};

export default DepartmentSettings;