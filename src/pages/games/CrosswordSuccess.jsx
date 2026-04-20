import React, { useState, useEffect } from 'react';
import { motion, animate } from 'framer-motion';
import { Home, ChevronRight, Trophy, Star, Coins } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Confetti from 'react-confetti';

const CrosswordSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { xpEarned = 150, coinsEarned = 50, nextTopic = "Investing" } = location.state || {};

    const [xp, setXp] = useState(0);
    const [coins, setCoins] = useState(0);
    const [windowSize, setWindowSize] = useState({ 
        width: window.innerWidth, 
        height: window.innerHeight 
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);

        const xpControls = animate(0, xpEarned, {
            duration: 1.5,
            ease: "easeOut",
            onUpdate: (value) => setXp(Math.round(value)),
        });
        
        const coinControls = animate(0, coinsEarned, {
            duration: 1.5,
            delay: 0.3,
            ease: "easeOut",
            onUpdate: (value) => setCoins(Math.round(value)),
        });

        return () => {
            window.removeEventListener('resize', handleResize);
            xpControls.stop();
            coinControls.stop();
        };
    }, [xpEarned, coinsEarned]);

    const isMobile = windowSize.width < 600;

    return (
        <div style={styles.overlay}>
            {/* Confetti now explicitly covers the full window on both platforms */}
            <Confetti 
                width={windowSize.width} 
                height={windowSize.height} 
                recycle={false} 
                numberOfPieces={isMobile ? 120 : 200}
                gravity={0.15}
            />

            <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                    ...styles.card,
                    maxWidth: isMobile ? '90%' : '320px', // Smaller desktop footprint
                    padding: isMobile ? '2px 16px' : '12px 24px',
                }}
            >
                <div style={styles.glow} />
                
                <div style={styles.mascotContainer}>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 12 }}
                    >
                        <img 
                            src="/assets/images/happy.png" 
                            alt="Success" 
                            style={{
                                ...styles.mascotImg,
                                height: isMobile ? '70px' : '85px' 
                            }} 
                        />
                    </motion.div>
                    
                    <motion.div 
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={styles.trophyBadge}
                    >
                        <Trophy size={14} color="#facc15" />
                    </motion.div>
                </div>

                <h1 style={{
                    ...styles.congratsText,
                    fontSize: isMobile ? '1.25rem' : '1.5rem'
                }}>
                    Masterpiece!
                </h1>
                
                <p style={{
                    ...styles.subText,
                    fontSize: isMobile ? '0.8rem' : '0.85rem'
                }}>
                    Financial literacy leveled up.
                </p>

                <div style={styles.rewardContainer}>
                    <div style={styles.rewardItem}>
                        <Star color="#a855f7" fill="#a855f7" size={12} />
                        <div>
                            <span style={styles.rewardLabel}>XP</span>
                            <div style={styles.rewardValue}>{xp}</div>
                        </div>
                    </div>

                    <div style={styles.rewardItem}>
                        <Coins color="#facc15" size={12} />
                        <div>
                            <span style={styles.rewardLabel}>COINS</span>
                            <div style={styles.rewardValue}>{coins}</div>
                        </div>
                    </div>
                </div>

                <div style={{
                    ...styles.buttonGroup,
                    flexDirection: isMobile ? 'column' : 'row'
                }}>
                    <button 
                        onClick={() => navigate(`/arcade/crossword/${nextTopic}`)} 
                        style={styles.primaryButton}
                    >
                        Next <ChevronRight size={14} />
                    </button>
                    
                    <button 
                        onClick={() => navigate('/dashboard')} 
                        style={styles.secondaryButton}
                    >
                        <Home size={14} /> Home
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const styles = {
    overlay: {
        minHeight: '100vh', 
        width: '100vw', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: '#0f172a',
        padding: '20px',
        boxSizing: 'border-box'
    },
    card: {
        backgroundColor: 'rgba(30, 41, 59, 0.95)', 
        textAlign: 'center', 
        width: '100%', 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)', 
        position: 'relative', 
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        borderRadius: '20px',
        overflow: 'hidden'
    },
    glow: {
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        background: 'radial-gradient(circle at 50% 0%, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
        zIndex: -1
    },
    mascotContainer: { position: 'relative', marginBottom: '10px', display: 'inline-block' },
    mascotImg: { width: 'auto' },
    trophyBadge: {
        position: 'absolute', bottom: '0px', right: '-5px',
        backgroundColor: '#1e293b', padding: '6px', borderRadius: '10px',
        border: '2px solid #facc15'
    },
    congratsText: { fontWeight: '800', margin: '4px 0', color: 'white' },
    subText: { color: '#94a3b8', marginBottom: '16px' },
    rewardContainer: { 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '8px', 
        marginBottom: '20px' 
        
    },
    rewardItem: { 
        display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(15, 23, 42, 0.6)', 
        borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '8px'
    },
    rewardLabel: { display: 'block', fontSize: '7px', fontWeight: '800', color: '#64748b' },
    rewardValue: { fontWeight: '900', color: 'white', fontSize: '0.9rem' },
    buttonGroup: { display: 'flex', gap: '8px' },
    primaryButton: {
        backgroundColor: '#a855f7', color: 'white', border: 'none', padding: '10px 16px',
        borderRadius: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', 
        justifyContent: 'center', gap: '4px', cursor: 'pointer', flex: 1, fontSize: '0.85rem'
    },
    secondaryButton: {
        backgroundColor: 'transparent', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.1)', 
        padding: '10px 16px', borderRadius: '12px', fontWeight: '600', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', 
        cursor: 'pointer', flex: 1, fontSize: '0.85rem'
    }
};

export default CrosswordSuccess;