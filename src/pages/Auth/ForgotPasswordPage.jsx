import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';
            await axios.post(`${API_URL}/auth/forgot-password`, { email });
            setSubmitted(true);
        } catch (err) {
            setSubmitted(true);
        }
    };

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.iconContainer}>
                        <KeyRound size={28} color="white" />
                    </div>
                    <h2 style={styles.title}>RESET ACCESS</h2>
                    <p style={styles.subtitle}>Enter email for recovery link</p>
                </div>

                {!submitted ? (
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email Address</label>
                            <input 
                                type="email" 
                                style={styles.input}
                                placeholder="name@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                        </div>
                        <button type="submit" style={styles.submitBtn}>Send Recovery Link</button>
                    </form>
                ) : (
                    <div style={styles.successBox}>
                        <p>If an account exists for <strong>{email}</strong>, you will receive instructions shortly.</p>
                    </div>
                )}

                <div style={styles.footer}>
                    <Link to="/login" style={styles.backLink}>
                        <ArrowLeft size={14} />
                        Back to Login
                    </Link>
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
        backgroundPosition: 'top left',
        backgroundAttachment: 'fixed',
        overflow: 'hidden'
    },
    card: { 
        width: '100%', 
        maxWidth: '350px', 
        backgroundColor: 'rgba(30, 30, 46, 0.85)', 
        backdropFilter: 'blur(16px)',
        padding: '24px 28px', 
        borderRadius: '20px', 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column',
    },
    header: { textAlign: 'center', marginBottom: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    iconContainer: {
        width: '55px',
        height: '55px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--primary-purple), var(--primary-glow))',
        marginBottom: '10px'
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
    form: { display: 'flex', flexDirection: 'column', gap: '12px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '4px' },
    label: { 
        fontSize: '10px', 
        fontWeight: '700', 
        color: 'var(--primary-purple)', 
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
    successBox: { 
        padding: '16px', 
        backgroundColor: 'rgba(16, 185, 129, 0.1)', 
        border: '1px solid var(--status-green)', 
        borderRadius: '12px', 
        color: 'white', 
        fontSize: '13px', 
        lineHeight: '1.5',
        textAlign: 'center'
    },
    footer: { marginTop: '16px', textAlign: 'center' },
    backLink: { 
        color: 'var(--primary-purple)', 
        textDecoration: 'none', 
        fontSize: '12px', 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '6px',
        fontWeight: '700'
    }
};

export default ForgotPasswordPage;