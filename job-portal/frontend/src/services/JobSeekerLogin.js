import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Loader } from 'lucide-react';
import { COLORS } from '../constants/colors';
import { jobSeekerAuthService } from '../services/jobSeekerAuthService';

const JobSeekerLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await jobSeekerAuthService.login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={s.container}>
            {/* Left Side - Form */}
            <div style={s.formSection}>
                <div style={s.formContent}>
                    {/* Logo */}
                    <div style={s.logo}>
                        <div style={s.logoIcon}>
                            <div style={{ ...s.triangle, borderBottomColor: COLORS.primary }} />
                            <div style={{ ...s.triangle, borderBottomColor: COLORS.secondary, marginLeft: '-8px' }} />
                            <div style={{ ...s.triangle, borderBottomColor: COLORS.accent, marginLeft: '-8px' }} />
                        </div>
                        <span style={s.logoText}>JobPortal</span>
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <h1 style={s.title}>Welcome Back</h1>
                        <p style={s.subtitle}>Sign in to continue your job search</p>
                    </div>

                    {error && (
                        <div style={s.errorAlert}>
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={s.formGroup}>
                            <label style={s.label}>Email Address</label>
                            <div style={s.inputWrapper}>
                                <Mail size={18} color={COLORS.textMuted} />
                                <input
                                    type="email"
                                    placeholder="your.email@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    style={s.input}
                                />
                            </div>
                        </div>

                        <div style={s.formGroup}>
                            <label style={s.label}>Password</label>
                            <div style={s.inputWrapper}>
                                <Lock size={18} color={COLORS.textMuted} />
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    style={s.input}
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} style={s.submitBtn}>
                            {loading ? <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> : 'Sign In'}
                        </button>
                    </form>

                    <div style={s.footer}>
                        <p style={s.footerText}>
                            Don't have an account?{' '}
                            <Link to="/register" style={s.link}>Sign Up</Link>
                        </p>
                        <Link to="/" style={s.backLink}>← Back to Home</Link>
                    </div>
                </div>
            </div>

            {/* Right Side - Image/Branding */}
            <div style={s.brandSection}>
                <div style={s.brandContent}>
                    <h2 style={s.brandTitle}>Find Your Dream Job</h2>
                    <p style={s.brandText}>Join thousands of job seekers who found their perfect career match with us.</p>
                    <div style={s.features}>
                        <Feature text="10,000+ Active Jobs" />
                        <Feature text="500+ Top Companies" />
                        <Feature text="Easy Application Process" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const Feature = ({ text }) => (
    <div style={s.feature}>
        <div style={s.checkIcon}>✓</div>
        <span>{text}</span>
    </div>
);

const s = {
    container: { display: 'flex', minHeight: '100vh' },
    
    // Form Section
    formSection: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', backgroundColor: '#ffffff' },
    formContent: { width: '100%', maxWidth: '440px' },
    
    // Logo
    logo: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' },
    logoIcon: { display: 'flex', alignItems: 'flex-end' },
    triangle: { width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: '17px solid' },
    logoText: { fontSize: '24px', fontWeight: '800', color: COLORS.textPrimary, letterSpacing: '-0.5px' },
    
    // Title
    title: { fontSize: '32px', fontWeight: '700', color: COLORS.textPrimary, marginBottom: '8px' },
    subtitle: { fontSize: '16px', color: COLORS.textSecondary },
    
    // Error
    errorAlert: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', color: COLORS.error, fontSize: '14px' },
    
    // Form
    formGroup: { marginBottom: '20px' },
    label: { display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: COLORS.textPrimary },
    inputWrapper: { display: 'flex', alignItems: 'center', gap: '12px', padding: '0 16px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', backgroundColor: '#ffffff', transition: 'border-color 0.2s' },
    input: { flex: 1, border: 'none', outline: 'none', padding: '14px 0', fontSize: '15px', color: COLORS.textPrimary, backgroundColor: 'transparent' },
    
    submitBtn: { width: '100%', backgroundColor: COLORS.primary, color: 'white', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '8px', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
    
    // Footer
    footer: { marginTop: '32px', textAlign: 'center' },
    footerText: { fontSize: '14px', color: COLORS.textSecondary, marginBottom: '12px' },
    link: { color: COLORS.primary, textDecoration: 'none', fontWeight: '600' },
    backLink: { fontSize: '14px', color: COLORS.textMuted, textDecoration: 'none', display: 'inline-block', marginTop: '12px' },
    
    // Brand Section
    brandSection: { flex: 1, background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', position: 'relative', overflow: 'hidden' },
    brandContent: { position: 'relative', zIndex: 1, color: 'white', maxWidth: '480px' },
    brandTitle: { fontSize: '48px', fontWeight: '800', marginBottom: '16px', lineHeight: '1.2' },
    brandText: { fontSize: '18px', marginBottom: '40px', opacity: 0.95 },
    features: { display: 'flex', flexDirection: 'column', gap: '16px' },
    feature: { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px' },
    checkIcon: { width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' },
};

export default JobSeekerLogin;