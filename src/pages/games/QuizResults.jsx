import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, animate } from 'framer-motion';
import { TrendingUp, Coins, ChevronRight, Trophy } from 'lucide-react';

const QuizResults = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const summary = state?.summary;

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

        if (!summary) {
            navigate('/quiz');
            return;
        }

        const controls = animate(0, summary.coins_earned || 0, {
            duration: 1.5, // Slightly faster for snappier feel
            onUpdate: (value) => setCount(Math.floor(value)),
        });

        const timer = setTimeout(() => setShowButton(true), 1800);

        return () => {
            window.removeEventListener('resize', handleResize);
            controls.stop();
            clearTimeout(timer);
        };
    }, [summary, navigate]);

    if (!summary) return null;

    const isMobile = windowSize.width < 480;
    const isShort = windowSize.height < 700; // Check for short screens

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
                    padding: isMobile ? '20px 15px' : '30px 40px',
                    maxWidth: isMobile ? '340px' : '450px',
                }}
            >
                <div style={styles.glow} />

                {/* Mascot Section - Smaller to save space */}
                <div style={{
                    ...styles.mascotContainer, 
                    marginBottom: isMobile ? '5px' : '15px' 
                }}>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                    >
                        <img 
                            src="/assets/images/happy.png" 
                            alt="Celebration Mascot" 
                            style={{
                                ...styles.mascotImg,
                                height: isMobile ? (isShort ? '80px' : '100px') : '140px'
                            }} 
                        />
                    </motion.div>
                    
                    <motion.div 
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        style={{
                            ...styles.trophyBadge,
                            padding: isMobile ? '6px' : '10px',
                            right: isMobile ? '-2px' : '-5px',
                            bottom: isMobile ? '0px' : '5px'
                        }}
                    >
                        <Trophy size={isMobile ? 18 : 24} color="#facc15" />
                    </motion.div>
                </div>

                <h1 style={{
                    ...styles.title,
                    fontSize: isMobile ? '1.5rem' : '28px',
                    marginBottom: isMobile ? '4px' : '8px'
                }}>Quest Complete!</h1>
                
                <p style={{
                    ...styles.subtitle,
                    fontSize: isMobile ? '0.8rem' : '0.95rem',
                    marginBottom: isMobile ? '15px' : '25px'
                }}>Financial mastery unlocked.</p>

                {/* Stats Grid - Side-by-side even on mobile to save height */}
                <div style={{
                    ...styles.statsGrid,
                    gridTemplateColumns: '1fr 1fr',
                    gap: isMobile ? '10px' : '15px',
                    marginBottom: isMobile ? '15px' : '25px'
                }}>
                    <div style={{...styles.statBox, padding: isMobile ? '10px' : '15px'}}>
                        <div style={{...styles.iconCircle, width: '28px', height: '28px'}}><Coins color="#facc15" size={16} /></div>
                        <div style={{...styles.statValue, fontSize: isMobile ? '18px' : '22px'}}>+{count}</div>
                        <div style={styles.statLabel}>Gold</div>
                    </div>

                    <div style={{...styles.statBox, padding: isMobile ? '10px' : '15px'}}>
                        <div style={{...styles.iconCircle, width: '28px', height: '28px'}}><TrendingUp color="#a855f7" size={16} /></div>
                        <div style={{...styles.statValue, fontSize: isMobile ? '18px' : '22px'}}>+{summary.xp_gained}</div>
                        <div style={styles.statLabel}>XP</div>
                    </div>
                </div>

                {/* Progress Bar - Slimmer */}
                <div style={{...styles.xpWrapper, marginBottom: isMobile ? '15px' : '25px'}}>
                    <div style={styles.xpHeader}>
                        <span style={{ fontSize: '11px' }}>Level {summary.current_level}</span>
                        <span style={{ fontSize: '11px' }}>{summary.new_xp_total % 100}% to Next</span>
                    </div>
                    <div style={{...styles.xpTrack, height: '6px'}}>
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${summary.new_xp_total % 100}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            style={styles.xpFill}
                        />
                    </div>
                </div>

                <div style={{ minHeight: '50px' }}> {/* Reserved space for button */}
                    {showButton && (
                        <motion.button
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(`/quiz/review/${summary.history_id}`)}
                            style={{
                                ...styles.reviewBtn,
                                padding: isMobile ? '12px' : '16px',
                                fontSize: isMobile ? '14px' : '16px'
                            }}
                        >
                            Review <ChevronRight size={isMobile ? 18 : 20} />
                        </motion.button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

const styles = {
    container: { 
        minHeight: '100vh', 
        width: '100vw', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        background: '#0f172a',
        overflow: 'hidden' // Prevent page bounce
    },
    card: { 
        backgroundColor: 'rgba(30, 41, 59, 0.8)', 
        borderRadius: '24px', 
        textAlign: 'center', 
        width: '95%', 
        border: '1px solid rgba(255, 255, 255, 0.1)', 
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(16px)',
        position: 'relative',
    },
    glow: {
        position: 'absolute', top: '0', left: '0', width: '100%', height: '100%',
        background: 'radial-gradient(circle at 50% 0%, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
        zIndex: -1, pointerEvents: 'none'
    },
    mascotContainer: { position: 'relative', display: 'inline-block' },
    mascotImg: { width: 'auto', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' },
    trophyBadge: {
        position: 'absolute',
        backgroundColor: '#1e293b', borderRadius: '12px',
        border: '2px solid #facc15', boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
    },
    title: { fontWeight: '900', color: 'white', letterSpacing: '-0.5px' },
    subtitle: { color: '#94a3b8' },
    statsGrid: { display: 'grid' },
    statBox: { 
        backgroundColor: 'rgba(15, 23, 42, 0.5)', 
        borderRadius: '16px', 
        border: '1px solid rgba(255, 255, 255, 0.05)' 
    },
    iconCircle: { 
        borderRadius: '50%', 
        backgroundColor: 'rgba(255,255,255,0.05)', 
        display: 'flex', justifyContent: 'center', alignItems: 'center', 
        margin: '0 auto 8px' 
    },
    statValue: { fontWeight: '800', color: 'white' },
    statLabel: { fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' },
    xpWrapper: { textAlign: 'left' },
    xpHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontWeight: '600', color: '#94a3b8' },
    xpTrack: { background: 'rgba(15, 23, 42, 0.8)', borderRadius: '3px', overflow: 'hidden' },
    xpFill: { height: '100%', background: 'linear-gradient(90deg, #a855f7, #6366f1)', borderRadius: '3px' },
    reviewBtn: { 
        backgroundColor: 'white', color: 'black', border: 'none', 
        borderRadius: '12px', fontWeight: '800', cursor: 'pointer', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        gap: '8px', width: '100%'
    }
};

export default QuizResults;
