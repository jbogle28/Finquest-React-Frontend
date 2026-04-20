import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ 
        username: '', 
        password: '', 
        email: '',
        f_name: '', 
        l_name: '' 
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await authService.register(formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.msg || "Registration failed");
        }
    };

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.logoContainer}>
                        <img 
                            src="/assets/images/faceview.png" 
                            alt="FinQuest Logo" 
                            style={styles.logoImage} 
                        />
                    </div>
                    <h2 style={styles.title}>JOIN FINQUEST</h2>
                    <p style={styles.subtitle}>Begin your financial literacy journey</p>
                </div>

                {error && <div style={styles.errorBox}>{error}</div>}
                
                <form onSubmit={handleRegister} style={styles.form}>
                    <div style={styles.responsiveRow}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>First Name</label>
                            <input 
                                type="text" 
                                placeholder="John"
                                style={styles.input}
                                onChange={(e) => setFormData({...formData, f_name: e.target.value})} 
                                required 
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Last Name</label>
                            <input 
                                type="text" 
                                placeholder="Doe"
                                style={styles.input}
                                onChange={(e) => setFormData({...formData, l_name: e.target.value})} 
                                required 
                            />
                        </div>
                    </div>

                    <div style={styles.responsiveRow}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Username</label>
                            <input 
                                type="text" 
                                placeholder="johndoe123"
                                style={styles.input}
                                onChange={(e) => setFormData({...formData, username: e.target.value})} 
                                required 
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email</label>
                            <input 
                                type="email" 
                                placeholder="name@email.com"
                                style={styles.input}
                                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                required 
                            />
                        </div>
                    </div>
                    
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            style={styles.input}
                            onChange={(e) => setFormData({...formData, password: e.target.value})} 
                            required 
                        />
                    </div>
                    
                    <button type="submit" style={styles.submitBtn}>
                        Create Account
                    </button>
                </form>
                
                <div style={styles.footer}>
                    <p style={styles.footerText}>
                        Already a member? <Link to="/login" style={styles.link}>Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    pageWrapper: { 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        width: '100vw',
        padding: '10px',
        boxSizing: 'border-box',
        backgroundColor: 'var(--bg-deep)', 
        backgroundImage: 'url("/assets/images/Background_img.png")',
        backgroundSize: '1000px auto', 
        backgroundRepeat: 'repeat', 
        backgroundAttachment: 'fixed',
        overflow: 'hidden'
    },
    card: { 
        width: '100%', 
        maxWidth: '480px', 
        maxHeight: '96vh', 
        backgroundColor: 'rgba(30, 30, 46, 0.85)', 
        backdropFilter: 'blur(16px)',
        padding: '18px 24px', 
        borderRadius: '20px', 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto'
    },
    header: { textAlign: 'center', marginBottom: '12px' },
    logoContainer: {
        width: '55px', 
        height: '55px',
        margin: '0 auto 10px auto',
        borderRadius: '50%',
        padding: '3px',
        background: 'linear-gradient(135deg, var(--primary-purple), var(--primary-glow))',
    },
    logoImage: {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '2px solid var(--bg-deep)',
    },
    title: { 
        fontSize: '17px', 
        fontWeight: '800', 
        color: '#fff',
        margin: 0,
        letterSpacing: '1px'
    },
    subtitle: { 
        color: 'var(--text-muted)', 
        fontSize: '12px', 
        marginTop: '2px',
    },
    form: { display: 'flex', flexDirection: 'column', gap: '10px' },
    responsiveRow: { 
        display: 'flex', 
        flexDirection: 'row',
        gap: '10px',
        width: '100%'
    },
    inputGroup: { 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '3px',
        flex: '1',
        minWidth: '0'
    },
    label: { 
        fontSize: '10px', 
        fontWeight: '600', 
        color: 'var(--primary-purple)', 
        textTransform: 'uppercase',
        marginLeft: '2px' 
    },
    input: { 
        padding: '8px 12px', 
        backgroundColor: 'rgba(0, 0, 0, 0.25)', 
        border: '1px solid rgba(255, 255, 255, 0.1)', 
        borderRadius: '10px', 
        color: 'white', 
        fontSize: '13px', 
        outline: 'none',
        boxSizing: 'border-box'
    },
    submitBtn: { 
        padding: '11px', 
        backgroundColor: 'var(--primary-purple)', 
        color: 'white', 
        border: 'none', 
        borderRadius: '10px', 
        cursor: 'pointer', 
        fontWeight: '700', 
        fontSize: '14px',
        marginTop: '4px',
    },
    errorBox: { 
        backgroundColor: 'rgba(239, 68, 68, 0.15)', 
        color: '#ff6b6b', 
        padding: '6px', 
        borderRadius: '10px', 
        border: '1px solid rgba(239, 68, 68, 0.2)',
        marginBottom: '10px', 
        fontSize: '12px', 
        textAlign: 'center' 
    },
    footer: { marginTop: '12px', textAlign: 'center' },
    footerText: { fontSize: '12px', color: 'var(--text-muted)' },
    link: { 
        color: 'var(--primary-purple)', 
        textDecoration: 'none', 
        fontWeight: '700',
    }
};

export default RegisterPage;