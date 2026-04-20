import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, TrendingUp } from 'lucide-react';
import quizService from '../../services/quizService';

const ScenarioSelection = () => {
    const navigate = useNavigate();
    const [completedScenarios, setCompletedScenarios] = useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const scenarios = [
        { id: 1, title: 'CoreSoft vs FlashWave', xp: 50 },
        { id: 2, title: 'SkyMint vs Northline', xp: 50 },
        { id: 3, title: 'The Diversification Test', xp: 75 },
        { id: 4, title: 'PrimeAxis Strategy', xp: 100 },
        { id: 5, title: 'Recurring Revenue Sim', xp: 100 },
        { id: 6, title: 'Utility Demand Check', xp: 150 },
        { id: 7, title: 'The Product Recall', xp: 150 },
        { id: 8, title: 'Policy & Subsidies', xp: 200 },
        { id: 9, title: 'Subscription Models', xp: 200 },
        { id: 10, title: 'EV Market Volatility', xp: 500 },
    ];

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);

        const fetchProgress = async () => {
            try {
                const history = await quizService.getUserHistory();
                const finishedIds = history
                    .filter(h => h.game_type === 'Scenario')
                    .map(h => {
                        if (h.quiz_snapshot && h.quiz_snapshot.scenario_id) {
                            return parseInt(h.quiz_snapshot.scenario_id);
                        }
                        return parseInt(h.topic) || parseInt(h.score);
                    });
                setCompletedScenarios(finishedIds);
            } catch (err) {
                console.error("Failed to sync scenario progress:", err);
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
                    fontSize: isMobile ? '20px' : '28px',
                    marginBottom: isMobile ? '20px' : '60px'
                }}>
                    Simulation Labs
                </h2>
                
                {scenarios.map((scenario, index) => {
                    const isCompleted = completedScenarios.includes(scenario.id);
                    
                    const offset = isMobile ? '10px' : '80px';
                    const marginLeft = index % 2 === 0 ? '0px' : offset;
                    const marginRight = index % 2 === 0 ? offset : '0px';

                    return (
                        <div key={scenario.id} style={{
                            ...styles.nodeContainer,
                            marginBottom: isMobile ? '25px' : '40px'
                        }}>
                            {index !== scenarios.length - 1 && (
                                <div style={{
                                    ...styles.connectorLine,
                                    height: isMobile ? '35px' : '55px',
                                    top: isMobile ? '40px' : '70px',
                                    backgroundColor: isCompleted ? '#facc15' : '#1e293b'
                                }} />
                            )}

                            <div style={{ 
                                ...styles.nodeRow, 
                                gap: isMobile ? '12px' : '25px',
                                marginLeft: isMobile ? '0px' : marginLeft, 
                                marginRight: isMobile ? '0px' : marginRight,
                                transform: isMobile && index % 2 !== 0 
                                    ? 'translateX(10px)' 
                                    : (isMobile ? 'translateX(-10px)' : 'none')
                            }}>
                                <button
                                    onClick={() => navigate(`/scenario/${scenario.id}`)}
                                    style={{
                                        ...styles.nodeCircle,
                                        width: isMobile ? '45px' : '75px',
                                        height: isMobile ? '45px' : '75px',
                                        backgroundColor: isCompleted ? '#facc15' : '#0f172a',
                                        border: isCompleted ? '4px solid rgba(250, 204, 21, 0.3)' : '3px solid #1e293b',
                                        cursor: 'pointer',
                                        boxShadow: isCompleted ? '0 0 15px rgba(250, 204, 21, 0.4)' : 'none'
                                    }}
                                >
                                    {isCompleted ? (
                                        <CheckCircle2 size={isMobile ? 20 : 28} color="#020617" />
                                    ) : (
                                        <TrendingUp size={isMobile ? 20 : 28} color="#94a3b8" />
                                    )}
                                </button>

                                <div style={{
                                    ...styles.nodeLabel,
                                    width: isMobile ? '120px' : '200px'
                                }}>
                                    <span style={{
                                        ...styles.levelNum,
                                        fontSize: isMobile ? '9px' : '11px',
                                        color: isCompleted ? '#facc15' : '#94a3b8'
                                    }}>
                                        Scenario {scenario.id}
                                    </span>

                                    <h4 style={{ 
                                        ...styles.levelTitle, 
                                        fontSize: isMobile ? '13px' : '17px',
                                        color: 'white'
                                    }}>
                                        {scenario.title}
                                    </h4>

                                    <span style={{
                                        ...styles.xpText,
                                        fontSize: isMobile ? '10px' : '12px'
                                    }}>
                                        {isCompleted ? 'COMPLETED' : `+${scenario.xp} XP`}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const styles = {
    scrollContainer: {
        height: 'calc(100vh - 80px)',
        overflowY: 'auto',
        backgroundColor: '#020617',
        scrollbarWidth: 'none',
    },
    pathWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '420px',
        margin: '0 auto',
        paddingBottom: '90px' // Added extra margin for mobile navbar
    },
    headerTitle: {
        fontWeight: '900',
        color: 'white',
        textAlign: 'center',
        letterSpacing: '1px',
        textTransform: 'uppercase'
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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        flexShrink: 0
    },
    connectorLine: {
        position: 'absolute',
        width: '4px',
        zIndex: 1
    },
    nodeLabel: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    levelNum: {
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    levelTitle: {
        fontWeight: '700',
        margin: '2px 0',
        lineHeight: '1.2'
    },
    xpText: {
        color: '#fbbf24',
        fontWeight: '800',
        letterSpacing: '0.5px'
    }
};

export default ScenarioSelection;