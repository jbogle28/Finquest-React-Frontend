import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw, Home, XCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Unsuccessful = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const word = state?.word || "the term";

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
                    maxWidth: isMobile ? '340px' : '450px',
                    borderRadius: isMobile ? '24px' : '32px'
                }}
            >
                <div style={styles.glow} />

                {/* Mascot Section - Height Responsive */}
                <div style={{
                    ...styles.mascotContainer,
                    marginBottom: isMobile ? '10px' : '20px'
                }}>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                    >
                        <img 
                            src="/assets/images/supportive.png" 
                            alt="Supportive Mascot" 
                            style={{
                                ...styles.mascotImg,
                                height: isMobile ? (isShort ? '100px' : '130px') : '180px'
                            }} 
                        />
                    </motion.div>
                    
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 }}
                        style={{
                            ...styles.errorBadge,
                            right: isMobile ? '-5px' : '-10px',
                            bottom: isMobile ? '5px' : '10px'
                        }}
                    >
                        <XCircle size={isMobile ? 20 : 32} color="#ef4444" />
                    </motion.div>
                </div>
                
                <h1 style={{
                    ...styles.title,
                    fontSize: isMobile ? '1.8rem' : '36px',
                    marginBottom: isMobile ? '8px' : '12px'
                }}>Not Quite!</h1>

                <p style={{
                    ...styles.text,
                    fontSize: isMobile ? '0.95rem' : '1.1rem',
                    marginBottom: isMobile ? '15px' : '10px'
                }}>
                    The financial term was: <br/>
                    <strong style={{
                        ...styles.word,
                        fontSize: isMobile ? '1.1rem' : '1.4rem'
                    }}>{word}</strong>
                </p>

                <p style={{
                    ...styles.subtext,
                    fontSize: isMobile ? '0.8rem' : '0.9rem',
                    marginBottom: isMobile ? '20px' : '35px'
                }}>
                    Knowledge is an investment that pays the best interest! Ready to reinvest?
                </p>

                <div style={{
                    ...styles.buttonGroup,
                    gap: isMobile ? '8px' : '12px'
                }}>
                    <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/arcade/hangman')} 
                        style={{
                            ...styles.retryBtn,
                            padding: isMobile ? '12px' : '16px',
                            fontSize: isMobile ? '15px' : '16px'
                        }}
                    >
                        <RefreshCcw size={isMobile ? 18 : 20} /> Try Again
                    </motion.button>
                    
                    <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/arcade')} 
                        style={{
                            ...styles.backBtn,
                            padding: isMobile ? '12px' : '16px',
                            fontSize: isMobile ? '15px' : '16px'
                        }}
                    >
                        <Home size={isMobile ? 18 : 20} /> Arcade Hub
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

const styles = {
    container: { 
        minHeight: '100vh', width: '100vw', background: '#0f172a', 
        display: 'flex', justifyContent: 'center', alignItems: 'center', 
        overflow: 'hidden'
    },
    card: { 
        backgroundColor: 'rgba(30, 41, 59, 0.8)', textAlign: 'center', width: '90%',
        border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(16px)', position: 'relative'
    },
    glow: {
        position: 'absolute', top: '0', left: '0', width: '100%', height: '100%',
        background: 'radial-gradient(circle at 50% 0%, rgba(239, 68, 68, 0.1) 0%, transparent 70%)',
        zIndex: -1, pointerEvents: 'none', borderRadius: '24px'
    },
    mascotContainer: { position: 'relative', display: 'inline-block' },
    mascotImg: { width: 'auto', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.4))' },
    errorBadge: {
        position: 'absolute', backgroundColor: '#1e293b', borderRadius: '50%',
        padding: '3px', border: '2px solid #ef4444', boxShadow: '0 8px 15px rgba(0,0,0,0.3)'
    },
    title: { color: 'white', fontWeight: '900', letterSpacing: '-1px' },
    text: { color: '#94a3b8', lineHeight: '1.4' },
    word: { color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '1px' },
    subtext: { color: '#64748b', padding: '0 10px' },
    buttonGroup: { display: 'flex', flexDirection: 'column' },
    retryBtn: { 
        background: '#fbbf24', color: '#0f172a', borderRadius: '12px', 
        border: 'none', fontWeight: '800', display: 'flex', 
        alignItems: 'center', justifyContent: 'center', gap: '10px',
        cursor: 'pointer'
    },
    backBtn: { 
        background: 'rgba(255, 255, 255, 0.05)', color: 'white', 
        borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', 
        fontWeight: '700', display: 'flex', alignItems: 'center', 
        justifyContent: 'center', gap: '10px', cursor: 'pointer'
    }
};

export default Unsuccessful;