import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useResponsive } from '../../hooks/useResponsive';

const Login = () => {
    const { isMobile, isCompact } = useResponsive();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await authService.adminLogin(formData.email, formData.password);
            
            // AGGRESSIVE DEBUG

            
            // Check exact user type
            if (data.user_type === 'super_admin') {
                setTimeout(() => {
                    window.location.href = '/admin/dashboard';
                }, 500);
            } else if (data.user_type === 'department') {
                setTimeout(() => {
                    window.location.href = '/department/dashboard';
                }, 500);
            } else {
                setError('Invalid user type: ' + data.user_type);
            }
        } catch (err) {
            alert('Login error: ' + (err.response?.data?.error || err.message));
            setError(err.response?.data?.error || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            {!isCompact && (
                <div style={styles.leftSection}>
                    <div style={styles.brandSection}>
                        <h1 style={styles.brandName}>RDI</h1>
                        <p style={styles.brandFullName}>Rupani Development Initiative</p>
                        <p style={styles.tagline}>Empowering Careers, Building Futures</p>
                    </div>
                </div>
            )}

            <div style={{ ...styles.rightSection, ...(isMobile ? { padding: '24px 16px' } : {}) }}>
                <div style={{ ...styles.loginCard, ...(isMobile ? { padding: '32px 24px' } : {}) }}>
                    <div style={styles.loginHeader}>
                        <h2 style={{ ...styles.loginTitle, ...(isMobile ? { fontSize: '26px' } : {}) }}>Admin Portal</h2>
                        <p style={styles.loginSubtitle}>Sign in to access your dashboard</p>
                    </div>

                    {error && (
                        <div style={styles.errorAlert}>
                            <span style={styles.errorIcon}>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Email Address</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                placeholder="admin@rdi.com"
                                style={styles.input}
                                disabled={loading}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Password</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                placeholder="••••••••"
                                style={styles.input}
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                ...styles.submitButton,
                                ...(loading ? styles.submitButtonDisabled : {}),
                            }}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div style={styles.footer}>
                        <p style={styles.footerText}>Protected by RDI Security</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        minHeight: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    leftSection: {
        flex: 1,
        background: 'linear-gradient(135deg,  #0E7A42 0%, #4FA758 100%)',
        // #4FA758
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        color: 'white',
    },
    brandSection: {
        textAlign: 'center',
        maxWidth: '500px',
    },
    brandName: {
        fontSize: '72px',
        fontWeight: '800',
        margin: '0',
        letterSpacing: '4px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
    },
    brandFullName: {
        fontSize: '24px',
        fontWeight: '300',
        margin: '20px 0',
        letterSpacing: '2px',
    },
    tagline: {
        fontSize: '18px',
        fontWeight: '300',
        margin: '30px 0',
        opacity: 0.9,
        fontStyle: 'italic',
    },
    rightSection: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        backgroundColor: '#f8f9fa',
    },
    loginCard: {
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        padding: '48px',
        width: '100%',
        maxWidth: '450px',
    },
    loginHeader: {
        marginBottom: '32px',
        textAlign: 'center',
    },
    loginTitle: {
        fontSize: '32px',
        fontWeight: '700',
        color: '#1a202c',
        margin: '0 0 8px 0',
    },
    loginSubtitle: {
        fontSize: '16px',
        color: '#718096',
        margin: '0',
    },
    errorAlert: {
        backgroundColor: '#fee',
        border: '1px solid #fcc',
        borderRadius: '8px',
        padding: '12px 16px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#c53030',
        fontSize: '14px',
    },
    errorIcon: {
        fontSize: '18px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    label: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#2d3748',
    },
    input: {
        padding: '12px 16px',
        fontSize: '16px',
        border: '2px solid #e2e8f0',
        borderRadius: '8px',
        outline: 'none',
        transition: 'all 0.2s',
        fontFamily: 'inherit',
    },
    submitButton: {
        padding: '14px 24px',
        fontSize: '16px',
        fontWeight: '600',
        color: 'white',
        background: 'linear-gradient(135deg, #4FA758 0%, #4FA758 100%)',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.3s',
        marginTop: '8px',
    },
    submitButtonDisabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
    },
    footer: {
        marginTop: '32px',
        textAlign: 'center',
    },
    footerText: {
        fontSize: '13px',
        color: '#a0aec0',
        margin: '0',
    },
};

const styleSheet = document.createElement('style');
styleSheet.textContent = `
    input:focus {
        border-color: #667eea !important;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
    }
    button[type="submit"]:not(:disabled):hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }
`;
document.head.appendChild(styleSheet);

export default Login;