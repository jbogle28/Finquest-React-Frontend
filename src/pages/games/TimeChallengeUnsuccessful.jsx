import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw, Home, XCircle, BarChart2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const TimeChallUnsuccessful = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    
    const matches = state?.matches || 0;
    const total = state?.total || 0;
    const difficulty = state?.difficulty || 'easy';

    const [windowSize, setWindowSize] = useState({ 
        width: window.innerWidth, 
        height: window.innerHeight 
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = windowSize.width < 480;
    const isShort = windowSize.height < 700;

    return (
        <div style={{
            ...styles.container,
            padding: isMobile ? '10px' : '20px'
        }}>
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                    ...styles.card,
                    padding: isMobile ? '25px 20px' : '50px 40px',
                    maxWidth: isMobile ? '340px' : '480px',
                    borderRadius: isMobile ? '32px' : '40px',
                }}
            >
                <div style={styles.glow} />

                {/* Mascot Section - Scaled dynamically to fit height */}
                <div style={{
                    ...styles.mascotContainer,
                    marginBottom: isMobile ? '10px' : '20px'
                }}>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1, type: "spring", bounce: 0.5 }}
                    >
                        <img 
                            src="/assets/images/supportive.png" 
                            alt="Supportive Mascot" 
                            style={{
                                ...styles.mascotImg,
                                height: isMobile ? (isShort ? '130px' : '170px') : '240px'
                            }} 
                        />
                    </motion.div>
                    
                    <motion.div 
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.4, type: "spring" }}
                        style={{
                            ...styles.errorBadge,
                            right: isMobile ? '-5px' : '15px',
                            bottom: isMobile ? '5px' : '20px',
                            padding: isMobile ? '4px' : '6px',
                        }}
                    >
                        <XCircle size={isMobile ? 24 : 36} color="#ef4444" />
                    </motion.div>
                </div>

                <h1 style={{
                    ...styles.title,
                    fontSize: isMobile ? '1.8rem' : '36px',
                    marginBottom: isMobile ? '10px' : '15px'
                }}>Out of Time!</h1>
                
                <div style={{
                    ...styles.statsContainer,
                    padding: isMobile ? '10px 18px' : '14px 24px',
                    marginBottom: isMobile ? '20px' : '25px'
                }}>
                    <div style={styles.statBox}>
                        <BarChart2 size={isMobile ? 16 : 20} color="#a855f7" />
                        <p style={{...styles.text, fontSize: isMobile ? '0.9rem' : '1.1rem'}}>
                            Matched: <strong style={styles.highlight}>{matches} / {total}</strong>
                        </p>
                    </div>
                </div>

                <p style={{
                    ...styles.subtext,
                    fontSize: isMobile ? '0.85rem' : '1rem',
                    marginBottom: isMobile ? '25px' : '40px',
                    lineHeight: isMobile ? '1.5' : '1.7'
                }}>
                    The clock ran out, but you're getting faster! Ready for another round?
                </p>

                <div style={{
                    ...styles.buttonGroup,
                    gap: isMobile ? '10px' : '14px'
                }}>
                    <motion.button 
                        whileTap={{ scale: 0.96 }}
                        onClick={() => navigate('/arcade/time-challenge', { state: { restart: true, difficulty } })} 
                        style={{
                            ...styles.retryBtn, 
                            padding: isMobile ? '14px' : '18px',
                            fontSize: isMobile ? '16px' : '18px'
                        }}
                    >
                        <RefreshCcw size={isMobile ? 18 : 22} /> Try Again
                    </motion.button>
                    
                    <motion.button 
                        whileTap={{ scale: 0.96 }}
                        onClick={() => navigate('/arcade')} 
                        style={{
                            ...styles.backBtn, 
                            padding: isMobile ? '14px' : '18px',
                            fontSize: isMobile ? '15px' : '17px'
                        }}
                    >
                        <Home size={isMobile ? 18 : 22} /> Arcade Hub
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

const styles = {
    container: { 
        minHeight: '100vh', width: '100%', background: '#0f172a', 
        display: 'flex', justifyContent: 'center', alignItems: 'center', 
        overflow: 'hidden', boxSizing: 'border-box'
    },
    card: { 
        backgroundColor: 'rgba(30, 41, 59, 0.8)', textAlign: 'center', width: '95%',
        border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 40px 80px rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(20px)', position: 'relative', boxSizing: 'border-box'
    },
    glow: {
        position: 'absolute', top: '0', left: '0', width: '100%', height: '100%',
        background: 'radial-gradient(circle at 50% 0%, rgba(239, 68, 68, 0.15) 0%, transparent 70%)',
        zIndex: -1, pointerEvents: 'none', borderRadius: '40px'
    },
    mascotContainer: { position: 'relative', display: 'inline-block' },
    mascotImg: { width: 'auto', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))' },
    errorBadge: {
        position: 'absolute', backgroundColor: '#1e293b', borderRadius: '50%',
        border: '2px solid #ef4444', boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
        display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2
    },
    title: { color: 'white', fontWeight: '900', letterSpacing: '-1px' },
    statsContainer: {
        background: 'rgba(15, 23, 42, 0.6)', borderRadius: '20px',
        display: 'inline-block', border: '1px solid rgba(255, 255, 255, 0.08)'
    },
    statBox: { display: 'flex', alignItems: 'center', gap: '10px' },
    text: { color: '#94a3b8', margin: 0, fontWeight: '500' },
    highlight: { color: '#fbbf24', fontWeight: '900' },
    subtext: { color: '#64748b', padding: '0 10px' },
    buttonGroup: { display: 'flex', flexDirection: 'column' },
    retryBtn: { 
        background: '#fbbf24', color: '#0f172a', borderRadius: '16px', 
        border: 'none', fontWeight: '900', display: 'flex', 
        alignItems: 'center', justifyContent: 'center', gap: '10px',
        cursor: 'pointer', boxShadow: '0 8px 20px rgba(251, 191, 36, 0.2)'
    },
    backBtn: { 
        background: 'rgba(255, 255, 255, 0.05)', color: 'white', 
        borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', 
        fontWeight: '700', display: 'flex', alignItems: 'center', 
        justifyContent: 'center', gap: '10px', cursor: 'pointer'
    }
};

export default TimeChallUnsuccessful;