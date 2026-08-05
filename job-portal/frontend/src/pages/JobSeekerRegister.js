import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, AlertCircle, Loader, ArrowRight, Check } from 'lucide-react';
import { BRAND, FONT, injectBrandStyles } from '../components/brand/brandTheme';
import { useResponsive } from '../hooks/useResponsive';
import { jobSeekerAuthService } from '../services/jobSeekerAuthService';

injectBrandStyles();

const sOverrides = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap');
        
        .rdi-input-wrap:focus-within {
            border-color: ${BRAND.ink} !important;
        }
        .rdi-register-btn:hover {
            background: #083F27 !important;
        }
        .rdi-text-link {
            color: ${BRAND.ink};
            text-decoration: none;
            font-weight: 600;
            border-bottom: 1px solid transparent;
            transition: border-color 0.15s ease;
        }
        .rdi-text-link:hover {
            border-bottom-color: ${BRAND.ink};
        }
    `}</style>
);

const Logo = ({ onClick }) => (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', marginBottom: 40 }}>
        <img
            src="/RDI.png"
            alt="RDI Logo"
            style={{ height: '44px', width: 'auto', objectFit: 'contain' }}
        />
    </div>
);

const JobSeekerRegister = () => {
    const navigate = useNavigate();
    const { isMobile, isCompact } = useResponsive();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirm_password: '',
        first_name: '',
        last_name: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirm_password) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setLoading(true);

        try {
            await jobSeekerAuthService.register(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.email?.[0] || err.response?.data?.username?.[0] || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: FONT, backgroundColor: BRAND.surface }}>
            {sOverrides()}

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '40px 20px' : '60px 40px', backgroundColor: BRAND.surface, overflowY: 'auto' }}>
                <div style={{ width: '100%', maxWidth: '460px', padding: '20px 0' }}>
                    
                    <Logo onClick={() => navigate('/')} />

                    <div style={{ marginBottom: 32 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: BRAND.green, marginBottom: 8 }}>
                            Get Started
                        </div>
                        <h1 style={{ fontSize: isMobile ? 28 : 34, fontWeight: 700, letterSpacing: '-1px', margin: 0, color: BRAND.ink }}>
                            Create your account.
                        </h1>
                    </div>

                    {error && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, backgroundColor: '#FFF5F5', border: '1px solid #FED7D7', borderRadius: 8, padding: '12px 16px', marginBottom: 24, color: BRAND.crimson || '#DC2626', fontSize: 14 }}>
                            <AlertCircle size={17} strokeWidth={2} style={{ flexShrink: 0 }} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 700, color: BRAND.ink }}>
                                    First Name
                                </label>
                                <div className="rdi-input-wrap" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', border: `1px solid ${BRAND.line}`, borderRadius: 8, backgroundColor: BRAND.surface, transition: 'border-color 0.15s ease' }}>
                                    <User size={15} color={BRAND.faint} strokeWidth={1.75} />
                                    <input
                                        type="text"
                                        placeholder="John"
                                        value={formData.first_name}
                                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                        required
                                        style={{ flex: 1, border: 'none', outline: 'none', padding: '12px 0', fontSize: 14, color: BRAND.ink, background: 'transparent', fontFamily: FONT }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 700, color: BRAND.ink }}>
                                    Last Name
                                </label>
                                <div className="rdi-input-wrap" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', border: `1px solid ${BRAND.line}`, borderRadius: 8, backgroundColor: BRAND.surface, transition: 'border-color 0.15s ease' }}>
                                    <User size={15} color={BRAND.faint} strokeWidth={1.75} />
                                    <input
                                        type="text"
                                        placeholder="Doe"
                                        value={formData.last_name}
                                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                        required
                                        style={{ flex: 1, border: 'none', outline: 'none', padding: '12px 0', fontSize: 14, color: BRAND.ink, background: 'transparent', fontFamily: FONT }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 700, color: BRAND.ink }}>
                                Username
                            </label>
                            <div className="rdi-input-wrap" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', border: `1px solid ${BRAND.line}`, borderRadius: 8, backgroundColor: BRAND.surface, transition: 'border-color 0.15s ease' }}>
                                <User size={15} color={BRAND.faint} strokeWidth={1.75} />
                                <input
                                    type="text"
                                    placeholder="johndoe"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                    style={{ flex: 1, border: 'none', outline: 'none', padding: '12px 0', fontSize: 14, color: BRAND.ink, background: 'transparent', fontFamily: FONT }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 700, color: BRAND.ink }}>
                                Email Address
                            </label>
                            <div className="rdi-input-wrap" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', border: `1px solid ${BRAND.line}`, borderRadius: 8, backgroundColor: BRAND.surface, transition: 'border-color 0.15s ease' }}>
                                <Mail size={15} color={BRAND.faint} strokeWidth={1.75} />
                                <input
                                    type="email"
                                    placeholder="john.doe@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    style={{ flex: 1, border: 'none', outline: 'none', padding: '12px 0', fontSize: 14, color: BRAND.ink, background: 'transparent', fontFamily: FONT }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 700, color: BRAND.ink }}>
                                Password
                            </label>
                            <div className="rdi-input-wrap" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', border: `1px solid ${BRAND.line}`, borderRadius: 8, backgroundColor: BRAND.surface, transition: 'border-color 0.15s ease' }}>
                                <Lock size={15} color={BRAND.faint} strokeWidth={1.75} />
                                <input
                                    type="password"
                                    placeholder="Min. 8 characters"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    style={{ flex: 1, border: 'none', outline: 'none', padding: '12px 0', fontSize: 14, color: BRAND.ink, background: 'transparent', fontFamily: FONT }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 700, color: BRAND.ink }}>
                                Confirm Password
                            </label>
                            <div className="rdi-input-wrap" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', border: `1px solid ${BRAND.line}`, borderRadius: 8, backgroundColor: BRAND.surface, transition: 'border-color 0.15s ease' }}>
                                <Lock size={15} color={BRAND.faint} strokeWidth={1.75} />
                                <input
                                    type="password"
                                    placeholder="Re-enter password"
                                    value={formData.confirm_password}
                                    onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                                    required
                                    style={{ flex: 1, border: 'none', outline: 'none', padding: '12px 0', fontSize: 14, color: BRAND.ink, background: 'transparent', fontFamily: FONT }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rdi-register-btn"
                            style={{
                                width: '100%', backgroundColor: BRAND.green, color: '#ffffff', border: 'none',
                                padding: '14px', borderRadius: 8, fontSize: 14.5, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                                marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                fontFamily: FONT, transition: 'background .15s ease'
                            }}
                        >
                            {loading ? (
                                <Loader size={17} style={{ animation: 'brandSpin .8s linear infinite' }} />
                            ) : (
                                <>Create Account <ArrowRight size={15} strokeWidth={2} /></>
                            )}
                        </button>
                    </form>

                    <div style={{ marginTop: 32, borderTop: `1px solid ${BRAND.line}`, paddingTop: 24, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
                        <p style={{ color: BRAND.slate, margin: 0 }}>
                            Already have an account?{' '}
                            <Link to="/login" className="rdi-text-link">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>

            {!isCompact && (
                <div style={{
                    flex: 1,
                    backgroundColor: BRAND.surfaceAlt,
                    borderLeft: `1px solid ${BRAND.line}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '40px', position: 'relative'
                }}>
                    <div style={{ maxWidth: '420px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <div style={{ marginBottom: 40 }}>
                            <img 
                                src="/RDI.png" 
                                alt="RDI Pattern Identity" 
                                style={{ width: '160px', height: '160px', objectFit: 'contain' }}
                            />
                        </div>
                        
                        <h2 style={{
                            fontFamily: "'Fraunces', Georgia, serif",
                            fontSize: 32, fontWeight: 600, color: BRAND.ink,
                            margin: '0 0 16px', lineHeight: 1.25, letterSpacing: '-0.5px'
                        }}>
                            Join our structural ecosystem.
                        </h2>
                        
                        <p style={{ fontSize: 15, color: BRAND.slate, lineHeight: 1.65, margin: '0 0 36px' }}>
                            Discover premium verified placement pipelines built purely on transparency, flat data profiles, and targeted interactions.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', alignItems: 'flex-start', borderTop: `1px solid ${BRAND.line}`, paddingTop: 28 }}>
                            {[
                                'Free to join for verified builders',
                                'Direct linear enterprise application routing',
                                'Interactive placement stage tracking tools',
                                'Fast-tracked profile matching algorithms'
                            ].map((text) => (
                                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <Check size={16} strokeWidth={2.5} color={BRAND.green} style={{ flexShrink: 0 }} />
                                    <span style={{ fontSize: 14, fontWeight: 600, color: BRAND.ink }}>{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobSeekerRegister;