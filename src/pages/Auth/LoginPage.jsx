import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';

const LoginPage = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await authService.login(username, password);
            onLoginSuccess();
            navigate('/dashboard'); 
        } catch (err) {
            setError(err.response?.data?.msg || "Invalid credentials");
        }
    };

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.loginCard}>
                <div style={styles.header}>
                    <div style={styles.logoContainer}>
                        <img 
                            src="/assets/images/faceview.png" 
                            alt="FinQuest Logo" 
                            style={styles.logoImage} 
                        />
                    </div>
                    <h2 style={styles.title}>FINQUEST</h2>
                    <p style={styles.subtitle}>Enter credentials to access portal</p>
                </div>

                {error && <div style={styles.errorBox}>{error}</div>}
                
                <form onSubmit={handleLogin} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Username</label>
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={styles.input}
                            placeholder="username"
                            required 
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            placeholder="••••••••"
                            required 
                        />
                    </div>
                    <button type="submit" style={styles.submitBtn}>
                        Sign In
                    </button>
                </form>

                <div style={styles.footer}>
                    <Link to="/register" style={styles.link}>Create Account</Link>
                    <Link to="/forgot-password" style={styles.linkMuted}>Forgot Password?</Link>
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
        overflow: 'hidden',
        backgroundColor: 'var(--bg-deep)', 
        backgroundImage: 'url("/assets/images/Background_img.png")',
        backgroundSize: '1000px auto', 
        backgroundRepeat: 'repeat', 
        backgroundPosition: 'top left',
        backgroundAttachment: 'fixed',
    },
    loginCard: {
        width: '100%',
        maxWidth: '350px', // Tightened for better focus
        backgroundColor: 'rgba(30, 30, 46, 0.85)', // Matched your register card opacity
        backdropFilter: 'blur(16px)',
        borderRadius: '20px', // Matched register card radius
        padding: '24px 28px', 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box'
    },
    header: { 
        textAlign: 'center', 
        marginBottom: '16px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
    },
    logoContainer: { // Added container to match register style
        width: '60px',
        height: '60px',
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
        border: '2px solid var(--bg-deep)', // Matches the cut-out look
    },
    title: { 
        fontSize: '18px', 
        fontWeight: '800', 
        letterSpacing: '1px', 
        margin: '0', 
        color: 'white' 
    },
    subtitle: { 
        color: 'var(--text-muted)', 
        fontSize: '12px',
        marginTop: '4px'
    },
    form: { 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px' 
    },
    inputGroup: { 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '4px' 
    },
    label: { 
        fontSize: '10px', 
        fontWeight: '700', 
        color: 'var(--primary-purple)', // Matched color to Register
        textTransform: 'uppercase',
        marginLeft: '2px'
    },
    input: { 
        padding: '10px 12px', 
        backgroundColor: 'rgba(0, 0, 0, 0.25)', 
        border: '1px solid rgba(255, 255, 255, 0.1)', 
        borderRadius: '10px', 
        color: 'white',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box'
    },
    submitBtn: { 
        padding: '12px', 
        backgroundColor: 'var(--primary-purple)', 
        color: 'white', 
        border: 'none', 
        borderRadius: '10px', 
        cursor: 'pointer', 
        fontWeight: 'bold',
        fontSize: '14px',
        marginTop: '6px'
    },
    errorBox: { 
        backgroundColor: 'rgba(239, 68, 68, 0.15)', 
        color: '#ff6b6b', 
        padding: '8px', 
        borderRadius: '10px', 
        marginBottom: '12px',
        fontSize: '12px',
        textAlign: 'center',
        border: '1px solid rgba(239, 68, 68, 0.2)'
    },
    footer: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginTop: '16px' 
    },
    link: { color: 'var(--primary-purple)', textDecoration: 'none', fontSize: '12px', fontWeight: '700' },
    linkMuted: { color: 'var(--text-muted)', textDecoration: 'none', fontSize: '12px' }
};

export default LoginPage;