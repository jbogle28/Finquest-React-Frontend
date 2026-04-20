import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, animate } from 'framer-motion';
import { TrendingUp, Coins, RotateCcw, LayoutGrid } from 'lucide-react';

const TimeChallengeSuccess = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const stats = state;

    const [count, setCount] = useState(0);
    const [showButton, setShowButton] = useState(false);
    const [windowSize, setWindowSize] = useState({ 
        width: window.innerWidth, 
        height: window.innerHeight 
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);

        if (!stats) {
            navigate('/arcade');
            return;
        }

        const controls = animate(0, stats.coinsEarned || 0, {
            duration: 1.2, // Snappier animation
            onUpdate: (value) => setCount(Math.floor(value)),
        });

        const timer = setTimeout(() => setShowButton(true), 1500);

        return () => {
            window.removeEventListener('resize', handleResize);
            controls.stop();
            clearTimeout(timer);
        };
    }, [stats, navigate]);

    if (!stats) return null;

    const isMobile = windowSize.width < 480;
    const isShort = windowSize.height < 700;

    const handlePlayAgain = () => {
        navigate('/arcade/time-challenge', { 
            state: { 
                restart: true, 
                difficulty: stats.difficulty 
            } 
        });
    };

    return (
        <div style={{
            ...styles.container,
            padding: isMobile ? '10px' : '16px'
        }}>
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                    ...styles.card,
                    padding: isMobile ? '20px 15px' : '40px 40px',
                    maxWidth: isMobile ? '340px' : '440px',
                }}
            >
                <div style={styles.glow} />

                {/* Mascot - Size scales based on screen height */}
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
                            src="/assets/images/happy.png" 
                            alt="Success Mascot" 
                            style={{
                                ...styles.mascotImg,
                                height: isMobile ? (isShort ? '80px' : '110px') : '150px'
                            }} 
                        />
                    </motion.div>
                </div>

                <h1 style={{
                    ...styles.title,
                    fontSize: isMobile ? '1.5rem' : '28px',
                    marginBottom: isMobile ? '4px' : '8px'
                }}>Challenge Crushed!</h1>
                <p style={{
                    ...styles.subtitle,
                    fontSize: isMobile ? '0.85rem' : '0.95rem',
                    marginBottom: isMobile ? '20px' : '30px'
                }}>Elite matching speed. Capital secured.</p>

                {/* Stats Grid - Always 2 columns */}
                <div style={{
                    ...styles.statsGrid,
                    gap: isMobile ? '10px' : '15px',
                    marginBottom: isMobile ? '20px' : '30px'
                }}>
                    <div style={{...styles.statBox, padding: isMobile ? '12px' : '18px'}}>
                        <div style={{...styles.iconCircle, width: isMobile ? '28px' : '36px', height: isMobile ? '28px' : '36px'}}>
                            <Coins color="#facc15" size={isMobile ? 16 : 20} />
                        </div>
                        <div style={{...styles.statValue, fontSize: isMobile ? '18px' : '22px'}}>+{count}</div>
                        <div style={styles.statLabel}>Gold</div>
                    </div>

                    <div style={{...styles.statBox, padding: isMobile ? '12px' : '18px'}}>
                        <div style={{...styles.iconCircle, width: isMobile ? '28px' : '36px', height: isMobile ? '28px' : '36px'}}>
                            <TrendingUp color="#a855f7" size={isMobile ? 16 : 20} />
                        </div>
                        <div style={{...styles.statValue, fontSize: isMobile ? '18px' : '22px'}}>+{stats.xpEarned}</div>
                        <div style={styles.statLabel}>XP Gained</div>
                    </div>
                </div>

                {/* Button Container - Minimum height to prevent layout shift */}
                <div style={{ minHeight: isMobile ? '100px' : '125px' }}>
                    {showButton && (
                        <div style={styles.buttonGroup}>
                            <motion.button
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handlePlayAgain}
                                style={{
                                    ...styles.primaryBtn,
                                    padding: isMobile ? '12px' : '16px',
                                    fontSize: isMobile ? '14px' : '16px'
                                }}
                            >
                                <RotateCcw size={isMobile ? 18 : 20} /> Play Again
                            </motion.button>

                            <motion.button
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/arcade')}
                                style={{
                                    ...styles.secondaryBtn,
                                    padding: isMobile ? '12px' : '16px',
                                    fontSize: isMobile ? '14px' : '16px'
                                }}
                            >
                                <LayoutGrid size={isMobile ? 18 : 20} /> Arcade
                            </motion.button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

const styles = {
    container: { 
        minHeight: '100vh', width: '100vw', display: 'flex', 
        justifyContent: 'center', alignItems: 'center',
        background: '#0f172a', overflow: 'hidden'
    },
    card: { 
        backgroundColor: 'rgba(30, 41, 59, 0.8)', borderRadius: '24px', 
        textAlign: 'center', width: '95%', 
        border: '1px solid rgba(255, 255, 255, 0.1)', 
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)', backdropFilter: 'blur(16px)', 
        position: 'relative'
    },
    glow: {
        position: 'absolute', top: '0', left: '0', width: '100%', height: '100%',
        background: 'radial-gradient(circle at 50% 0%, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
        zIndex: -1, pointerEvents: 'none'
    },
    mascotContainer: { position: 'relative', display: 'inline-block' },
    mascotImg: { width: 'auto', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' },
    title: { fontWeight: '900', color: 'white', letterSpacing: '-0.5px' },
    subtitle: { color: '#94a3b8' },
    statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr' },
    statBox: { 
        backgroundColor: 'rgba(15, 23, 42, 0.5)', borderRadius: '16px', 
        border: '1px solid rgba(255, 255, 255, 0.05)' 
    },
    iconCircle: { 
        borderRadius: '50%', 
        backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', 
        justifyContent: 'center', alignItems: 'center', margin: '0 auto 8px' 
    },
    statValue: { fontWeight: '800', color: 'white' },
    statLabel: { fontSize: '9px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' },
    buttonGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    primaryBtn: { 
        backgroundColor: 'white', color: 'black', border: 'none', 
        borderRadius: '12px', fontWeight: '800', cursor: 'pointer', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        gap: '10px', width: '100%'
    },
    secondaryBtn: { 
        backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px', fontWeight: '700', cursor: 'pointer', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        gap: '10px', width: '100%'
    }
};

export default TimeChallengeSuccess;