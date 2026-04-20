import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, CheckCircle2, Play } from 'lucide-react';
import quizService from '../../services/quizService';

const QuizSelection = () => {
    const navigate = useNavigate();
    const [completedTopics, setCompletedTopics] = useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const levels = [
        { id: 1, title: 'Budgeting Basics', xp: 50 },
        { id: 2, title: 'Emergency Funds', xp: 50 },
        { id: 3, title: 'Savings Accounts', xp: 75 },
        { id: 4, title: 'Debt Management', xp: 100 },
        { id: 5, title: 'Credit Score 101', xp: 100 },
        { id: 6, title: 'Stock Market Intro', xp: 150 },
        { id: 7, title: 'Compound Interest', xp: 150 },
        { id: 8, title: 'Retirement Plans', xp: 200 },
        { id: 9, title: 'Tax Strategies', xp: 200 },
        { id: 10, title: 'Financial Freedom', xp: 500 },
    ];

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);

        const fetchProgress = async () => {
            try {
                const history = await quizService.getUserHistory();
                const finished = history
                    .filter(h => h.game_type === 'Quiz')
                    .map(h => h.topic);
                setCompletedTopics(finished);
            } catch (err) {
                console.error("Failed to sync progress:", err);
            }
        };

        fetchProgress();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = windowWidth < 400;

    return (
        <div style={{
            ...styles.scrollContainer,
            padding: isMobile ? '10px 4px' : '40px 10px'
        }}>
            <div style={styles.pathWrapper}>
                <h2 style={{
                    ...styles.headerTitle,
                    fontSize: isMobile ? '10px' : '28px', // Smaller header
                    marginBottom: isMobile ? '10px' : '60px'
                }}>
                    Learning Path
                </h2>
                
                {levels.map((level, index) => {
                    const isCompleted = completedTopics.includes(level.title);
                    const isFirst = index === 0;
                    const prevIsCompleted = index > 0 && completedTopics.includes(levels[index - 1].title);
                    
                    const isLocked = !isFirst && !prevIsCompleted && !isCompleted;
                    const isCurrent = !isLocked && !isCompleted;

                    // Reduced offset for mobile to keep items centered
                    const offset = isMobile ? '10px' : '80px';
                    const marginLeft = index % 2 === 0 ? '0px' : offset;
                    const marginRight = index % 2 === 0 ? offset : '0px';

                    return (
                        <div key={level.id} style={{
                            ...styles.nodeContainer,
                            marginBottom: isMobile ? '10px' : '30px' // Tighter vertical spacing
                        }}>
                            {index !== levels.length - 1 && (
                                <div style={{
                                    ...styles.connectorLine,
                                    height: isMobile ? '15px' : '45px', // Shorter lines
                                    top: isMobile ? '36px' : '60px',    // Adjusted start position
                                    width: isMobile ? '2px' : '4px',
                                    backgroundColor: isCompleted ? 'var(--primary-purple)' : 'var(--bg-hover)'
                                }} />
                            )}

                            <div style={{ 
                                ...styles.nodeRow, 
                                gap: isMobile ? '8px' : '25px',
                                marginLeft: isMobile ? '0px' : marginLeft, 
                                marginRight: isMobile ? '0px' : marginRight,
                                // Very subtle zigzag on mobile
                                transform: isMobile && index % 2 !== 0 
                                    ? 'translateX(5px)' 
                                    : (isMobile ? 'translateX(-5px)' : 'none')
                            }}>
                                <button
                                    disabled={isLocked}
                                    onClick={() => navigate(`/quiz/${level.id}`)}
                                    style={{
                                        ...styles.nodeCircle,
                                        width: isMobile ? '36px' : '70px',  // Scaled down significantly
                                        height: isMobile ? '36px' : '70px', // Scaled down significantly
                                        backgroundColor: isLocked ? 'var(--bg-hover)' : 'var(--primary-purple)',
                                        transform: isCurrent ? 'scale(1.05)' : 'scale(1)',
                                        boxShadow: isCurrent && !isMobile ? '0 0 15px var(--primary-purple)' : 'none',
                                        cursor: isLocked ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    {isLocked ? <Lock size={isMobile ? 12 : 20} color="#64748b" /> : 
                                     isCompleted ? <CheckCircle2 size={isMobile ? 14 : 24} color="white" /> : 
                                     <Play size={isMobile ? 14 : 24} fill="white" />}
                                </button>

                                <div style={{
                                    ...styles.nodeLabel,
                                    width: isMobile ? '90px' : '180px' // Narrower label area
                                }}>
                                    <span style={{
                                        ...styles.levelNum,
                                        fontSize: isMobile ? '7px' : '9px'
                                    }}>
                                        Unit {level.id}
                                    </span>

                                    <h4 style={{ 
                                        ...styles.levelTitle, 
                                        fontSize: isMobile ? '11px' : '16px', // Clearer small font
                                        color: isLocked ? 'var(--text-muted)' : 'var(--text-main)' 
                                    }}>
                                        {level.title}
                                    </h4>

                                    {!isLocked && (
                                        <span style={{
                                            ...styles.xpText,
                                            fontSize: isMobile ? '8px' : '11px'
                                        }}>
                                            +{level.xp} XP
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ... styles object remains the same as your original ...
const styles = {
    scrollContainer: {
        height: 'calc(100vh - 80px)',
        overflowY: 'auto',
        backgroundColor: 'var(--bg-deep)',
        scrollbarWidth: 'none',
    },

    pathWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '420px',
        margin: '0 auto',
        paddingBottom: '60px'
    },

    headerTitle: {
        fontWeight: '800',
        color: 'white',
        textAlign: 'center',
        letterSpacing: '1px'
    },

    nodeContainer: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },

    nodeRow: {
        display: 'flex',
        alignItems: 'center',
        transition: 'all 0.3s ease'
    },

    nodeCircle: {
        borderRadius: '50%',
        border: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        transition: 'transform 0.2s',
        flexShrink: 0
    },

    connectorLine: {
        position: 'absolute',
        backgroundColor: 'var(--bg-hover)',
        zIndex: 1
    },

    nodeLabel: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },

    levelNum: {
        fontWeight: '800',
        color: 'var(--primary-purple)',
        textTransform: 'uppercase'
    },

    levelTitle: {
        fontWeight: '700',
        margin: '2px 0',
        lineHeight: '1.2'
    },

    xpText: {
        color: '#fbbf24',
        fontWeight: '600'
    }
};

export default QuizSelection;