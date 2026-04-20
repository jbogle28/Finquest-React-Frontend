import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match.' });
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/auth/reset-password-confirm`, {
                token: token,
                password: password
            });
            
            setMessage({ type: 'success', text: response.data.msg });
            // Redirect to login after 3 seconds
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setMessage({ 
                type: 'error', 
                text: err.response?.data?.msg || 'Failed to reset password. Link may be expired.' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <ShieldCheck size={40} color="var(--primary-purple)" />
                    <h2 style={styles.title}>NEW PASSWORD</h2>
                    <p style={styles.subtitle}>Enter a secure password for your account</p>
                </div>

                {message.text && (
                    <div style={{
                        ...styles.messageBox,
                        backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        borderColor: message.type === 'success' ? 'var(--status-green)' : '#ef4444'
                    }}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>New Password</label>
                        <div style={styles.passwordWrapper}>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                style={styles.input}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                                style={styles.eyeBtn}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Confirm New Password</label>
                        <input 
                            type="password" 
                            style={styles.input}
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required 
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{
                            ...styles.submitBtn,
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>

                <div style={styles.footer}>
                    <Link to="/login" style={styles.backLink}>
                        <ArrowLeft size={16} />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

const styles = {
    pageWrapper: { 
        display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh',
        width: '100vw', margin: 0, padding: '20px', boxSizing: 'border-box',
        backgroundColor: 'var(--bg-deep)', 
        backgroundImage: 'url("/assets/images/Background_img.png")',
        backgroundSize: '1000px auto', backgroundRepeat: 'repeat', 
        backgroundPosition: 'top left', backgroundAttachment: 'fixed',
    },
    card: { width: '100%', maxWidth: '400px', backgroundColor: 'var(--bg-card)', padding: '40px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--bg-hover)' },
    header: { textAlign: 'center', marginBottom: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    title: { fontSize: '24px', fontWeight: '800', letterSpacing: '2px', margin: '16px 0 8px 0', color: 'white' },
    subtitle: { color: 'var(--text-muted)', fontSize: '14px' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' },
    passwordWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
    input: { width: '100%', padding: '12px', backgroundColor: 'var(--bg-hover)', border: '1px solid #334155', borderRadius: '8px', color: 'white', outline: 'none' },
    eyeBtn: { position: 'absolute', right: '12px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' },
    submitBtn: { padding: '14px', backgroundColor: 'var(--primary-purple)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', marginTop: '10px' },
    messageBox: { padding: '12px', border: '1px solid', borderRadius: '8px', fontSize: '13px', textAlign: 'center', marginBottom: '10px', color: 'white' },
    footer: { marginTop: '32px', textAlign: 'center' },
    backLink: { color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px' }
};

export default ResetPasswordPage;