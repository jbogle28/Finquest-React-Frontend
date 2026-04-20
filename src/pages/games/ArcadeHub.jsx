import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Type, Grid3X3, Timer, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const ArcadeHub = () => {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const games = [
        {
            id: 'hangman',
            title: 'Term Terminator',
            subtitle: 'Hangman',
            desc: 'Guess financial terms.',
            icon: <Type size={isMobile ? 18 : 28} />,
            color: '#10b981',
            path: '/arcade/hangman',
            difficulty: 'Med'
        },
        {
            id: 'crossword',
            title: 'Wealth Words',
            subtitle: 'Crossword',
            desc: 'Navigate fiscal grids.',
            icon: <Grid3X3 size={isMobile ? 18 : 28} />,
            color: '#8b5cf6',
            path: '/arcade/crossword/Budgeting',
            difficulty: 'Hard'
        },
        {
            id: 'time-challenge',
            title: 'Flash Finance',
            subtitle: 'Timed',
            desc: 'Match under pressure.',
            icon: <Timer size={isMobile ? 18 : 28} />,
            color: '#f59e0b',
            path: '/arcade/time-challenge',
            difficulty: 'Fast'
        }
    ];

    return (
        <div style={{
            ...styles.container,
            margin: isMobile ? '20px auto 0' : '40px auto',
            paddingLeft: isMobile ? '10px' : '20px',
            paddingRight: isMobile ? '10px' : '20px',
            paddingBottom: isMobile ? '90px' : '40px' 
        }}>
            <header style={{
                ...styles.header,
                marginBottom: isMobile ? '25px' : '40px'
            }}>
                <motion.div 
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    style={styles.titleRow}
                >
                    <Gamepad2 size={isMobile ? 24 : 36} color="#facc15" />
                    <h2 style={{
                        ...styles.title,
                        fontSize: isMobile ? '18px' : '32px'
                    }}>FINQUEST ARCADE</h2>
                </motion.div>
                <p style={{
                    ...styles.subtitle,
                    fontSize: isMobile ? '11px' : '16px'
                }}>Master markets and stack bonus coins.</p>
            </header>

            <div style={{
                ...styles.grid,
                // Force 3 columns for both modes
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: isMobile ? '8px' : '25px'
            }}>
                {games.map((game) => (
                    <motion.div 
                        key={game.id} 
                        whileHover={!isMobile ? { y: -8 } : {}}
                        whileTap={{ scale: 0.96 }}
                        style={styles.card} 
                        onClick={() => navigate(game.path)}
                    >
                        {/* Difficulty Badge moved to top of card since image is gone */}
                        <div style={{
                            ...styles.difficultyBadge, 
                            backgroundColor: `${game.color}20`,
                            color: game.color,
                            position: 'relative',
                            top: 'auto',
                            right: 'auto',
                            alignSelf: 'flex-start',
                            margin: isMobile ? '8px 0 0 8px' : '15px 0 0 15px'
                        }}>
                            {game.difficulty}
                        </div>

                        <div style={{
                            ...styles.cardContent,
                            padding: isMobile ? '12px 8px' : '30px 20px'
                        }}>
                            <div style={{ 
                                ...styles.miniIcon, 
                                backgroundColor: `${game.color}15`, 
                                color: game.color,
                                width: isMobile ? '40px' : '70px',
                                height: isMobile ? '40px' : '70px',
                                marginBottom: isMobile ? '12px' : '20px'
                            }}>
                                {game.icon}
                            </div>
                            
                            <h3 style={{
                                ...styles.gameTitle,
                                fontSize: isMobile ? '11px' : '18px'
                            }}>{game.title}</h3>
                            <span style={{
                                ...styles.gameSubtitle,
                                fontSize: isMobile ? '8px' : '11px'
                            }}>{game.subtitle}</span>

                            {!isMobile && <p style={styles.gameDesc}>{game.desc}</p>}
                            
                            <div style={{
                                ...styles.cardFooter,
                                marginTop: isMobile ? '12px' : '20px'
                            }}>
                                <div style={{
                                    ...styles.rewardTag,
                                    padding: isMobile ? '3px 6px' : '6px 12px',
                                    fontSize: isMobile ? '9px' : '12px'
                                }}>
                                    <Trophy size={isMobile ? 9 : 12} />
                                    <span>+50</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: { maxWidth: '1100px', boxSizing: 'border-box' },
    header: { textAlign: 'center' },
    titleRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '4px' },
    title: { fontWeight: '900', letterSpacing: '1px', color: 'white', margin: 0 },
    subtitle: { color: 'var(--text-muted)', fontWeight: '500', margin: 0 },
    grid: { display: 'grid' },
    card: { 
        backgroundColor: 'var(--bg-card)', 
        borderRadius: '20px', 
        cursor: 'pointer', 
        border: '1px solid var(--bg-hover)',
        boxShadow: '0 8px 20px rgba(0,0,0,0.3)', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'border-color 0.2s ease'
    },
    difficultyBadge: {
        padding: '3px 8px',
        borderRadius: '6px', 
        fontSize: '9px', 
        fontWeight: '900', 
        textTransform: 'uppercase'
    },
    cardContent: { textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    miniIcon: { 
        borderRadius: '16px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    gameTitle: { fontWeight: '900', color: 'white', margin: '0 0 2px 0' },
    gameSubtitle: { color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' },
    gameDesc: { color: 'var(--text-muted)', lineHeight: '1.4', margin: '15px 0 0 0', fontSize: '13px' },
    cardFooter: { display: 'flex', justifyContent: 'center', width: '100%' },
    rewardTag: { 
        display: 'flex', alignItems: 'center', gap: '4px', 
        backgroundColor: 'rgba(250, 204, 21, 0.1)', 
        borderRadius: '8px', color: '#facc15', fontWeight: '800' 
    }
};

export default ArcadeHub;