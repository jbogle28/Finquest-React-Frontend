import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ChevronRight, CheckCircle2, XCircle, 
    Trophy, ArrowLeft, Lightbulb, Target, RotateCcw, TrendingUp 
} from 'lucide-react';
import quizService from '../../services/quizService';

const ScenarioModule = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [scenario, setScenario] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScenario = async () => {
            setLoading(true);
            setShowFeedback(false);
            setSelectedOption(null);
            try {
                const data = await quizService.getScenario(id);
                setScenario(data);
            } catch (err) {
                console.error("Error loading scenario:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchScenario();
    }, [id]);

    const handleChoice = async (optionKey) => {
        if (showFeedback) return;
        setSelectedOption(optionKey);
        
        try {
            const isCorrect = optionKey === scenario.correct_option;
            const res = await quizService.submitScenarioResult({
                id: scenario.id,
                choice: optionKey,
                is_correct: isCorrect
            });
            setResult(res);
            setShowFeedback(true);
        } catch (err) {
            console.error("Submission failed:", err);
        }
    };

    const handleNavigation = () => {
        if (result?.is_correct) {
            navigate('/scenarios');
        } else {
            // Reset for retry
            setShowFeedback(false);
            setSelectedOption(null);
        }
    };

    if (loading) return <div style={styles.loader}>Analyzing Market Conditions...</div>;
    if (!scenario) return <div style={styles.loader}>Scenario not found.</div>;

    return (
        <div style={styles.container}>
            <style>
                {`
                @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes scaleUp { from { transform: scale(0.95); } to { transform: scale(1); } }
                .animate-in { animation: slideIn 0.4s ease-out forwards; }
                `}
            </style>

            <div style={styles.header}>
                <button onClick={() => navigate('/scenarios')} style={styles.backBtn}>
                    <ArrowLeft size={20} />
                </button>
                <div style={styles.headerTitleArea}>
                    <span style={styles.categoryTag}>{scenario.category}</span>
                    <h2 style={styles.headerTitle}>Module {id}</h2>
                </div>
            </div>

            <div style={styles.mainCard} className="animate-in">
                <div style={styles.promptContainer}>
                    <div style={styles.iconCircle}>
                        <Target size={24} color="#facc15" />
                    </div>
                    <p style={styles.promptText}>{scenario.prompt}</p>
                </div>

                <div style={styles.optionsList}>
                    {scenario.options.map((opt) => (
                        <button
                            key={opt.id}
                            disabled={showFeedback}
                            onClick={() => handleChoice(opt.id)}
                            style={{
                                ...styles.optionBtn,
                                borderColor: selectedOption === opt.id 
                                    ? (showFeedback ? (opt.id === scenario.correct_option ? '#10b981' : '#ef4444') : '#facc15') 
                                    : '#1e293b',
                                background: selectedOption === opt.id ? 'rgba(250, 204, 21, 0.05)' : '#0f172a'
                            }}
                        >
                            <div style={styles.optRow}>
                                <span style={{
                                    ...styles.optLetter,
                                    backgroundColor: selectedOption === opt.id ? '#facc15' : '#1e293b',
                                    color: selectedOption === opt.id ? '#020617' : '#94a3b8'
                                }}>{opt.id}</span>
                                <div style={styles.optContent}>
                                    <span style={styles.optTitle}>{opt.title}</span>
                                    <p style={styles.optDesc}>{opt.description}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {showFeedback && (
                <div style={styles.feedbackOverlay}>
                    <div style={{
                        ...styles.feedbackCard,
                        borderTop: `4px solid ${result?.is_correct ? '#10b981' : '#ef4444'}`
                    }}>
                        <div style={styles.feedbackHeader}>
                            {result?.is_correct ? (
                                <><CheckCircle2 color="#10b981" size={24} /> <span style={{color: '#10b981'}}>Excellent Choice!</span></>
                            ) : (
                                <><XCircle color="#ef4444" size={24} /> <span style={{color: '#ef4444'}}>Not Quite Right</span></>
                            )}
                        </div>

                        <p style={styles.feedbackBody}>{result?.feedback}</p>

                        <div style={styles.lessonCard}>
                            <div style={styles.lessonHeader}>
                                <Lightbulb size={16} color="#facc15" />
                                <span>FINANCIAL INSIGHT</span>
                            </div>
                            <p style={styles.lessonText}>{result?.lesson}</p>
                        </div>

                        {result?.is_correct && (
                            <div style={styles.rewardRow}>
                                <div style={styles.rewardPill}>
                                    <Trophy size={14} /> +{result?.xp_earned} XP
                                </div>
                                <div style={styles.rewardPill}>
                                    <TrendingUp size={14} /> +{result?.coins_earned} Coins
                                </div>
                            </div>
                        )}

                        <button 
                            onClick={handleNavigation}
                            style={{
                                ...styles.actionBtn,
                                backgroundColor: result?.is_correct ? '#a855f7' : '#1e293b'
                            }}
                        >
                            {result?.is_correct ? (
                                <>Next Scenario <ChevronRight size={18} /></>
                            ) : (
                                <>Try Again <RotateCcw size={18} /></>
                            )}
                        </button>
                    </div>
                </div>
            )}
            
            {/* Safe Area Spacer for Mobile Navbars */}
            <div style={styles.bottomSpacer} />
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#020617',
        color: '#f8fafc',
        padding: '20px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: "'Inter', sans-serif",
        paddingBottom: '80px' // Added base padding for safety
    },
    header: {
        width: '100%',
        maxWidth: '480px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '24px'
    },
    backBtn: {
        background: '#0f172a',
        border: '1px solid #1e293b',
        borderRadius: '12px',
        color: 'white',
        padding: '8px',
        cursor: 'pointer'
    },
    headerTitleArea: {
        display: 'flex',
        flexDirection: 'column'
    },
    categoryTag: {
        fontSize: '10px',
        fontWeight: '800',
        color: '#facc15',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    },
    headerTitle: {
        fontSize: '18px',
        margin: 0,
        fontWeight: '800'
    },
    mainCard: {
        width: '100%',
        maxWidth: '480px',
        backgroundColor: '#0f172a',
        borderRadius: '24px',
        padding: '24px',
        border: '1px solid #1e293b',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
    },
    promptContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        marginBottom: '30px'
    },
    iconCircle: {
        width: '56px',
        height: '56px',
        backgroundColor: 'rgba(250, 204, 21, 0.1)',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '16px'
    },
    promptText: {
        fontSize: '18px',
        fontWeight: '600',
        lineHeight: '1.5',
        color: '#f8fafc',
        margin: 0
    },
    optionsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    optionBtn: {
        width: '100%',
        padding: '16px',
        borderRadius: '16px',
        border: '2px solid',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        color: 'white'
    },
    optRow: {
        display: 'flex',
        gap: '12px'
    },
    optLetter: {
        width: '28px',
        height: '28px',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: '800',
        flexShrink: 0
    },
    optContent: {
        flex: 1
    },
    optTitle: {
        display: 'block',
        fontSize: '15px',
        fontWeight: '700',
        marginBottom: '4px'
    },
    optDesc: {
        fontSize: '13px',
        color: '#94a3b8',
        margin: 0,
        lineHeight: '1.4'
    },
    feedbackOverlay: {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(2, 6, 23, 0.8)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 100
    },
    feedbackCard: {
        width: '100%',
        maxWidth: '500px',
        backgroundColor: '#0f172a',
        borderRadius: '24px 24px 0 0',
        padding: '24px',
        paddingBottom: '90px',
        animation: 'slideIn 0.3s ease-out'
    },
    feedbackHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '18px',
        fontWeight: '800',
        marginBottom: '16px'
    },
    feedbackBody: {
        fontSize: '14px',
        color: '#cbd5e1',
        lineHeight: '1.6',
        marginBottom: '20px'
    },
    lessonCard: {
        backgroundColor: '#020617',
        borderRadius: '16px',
        padding: '16px',
        border: '1px solid #1e293b',
        marginBottom: '20px'
    },
    lessonHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '11px',
        fontWeight: '800',
        color: '#facc15',
        marginBottom: '8px',
        textTransform: 'uppercase'
    },
    lessonText: {
        fontSize: '13px',
        color: '#94a3b8',
        margin: 0,
        lineHeight: '1.5'
    },
    rewardRow: {
        display: 'flex',
        gap: '12px',
        marginBottom: '24px'
    },
    rewardPill: {
        backgroundColor: 'rgba(250, 204, 21, 0.1)',
        color: '#facc15',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
    },
    actionBtn: {
        width: '100%',
        border: 'none',
        borderRadius: '14px',
        padding: '16px',
        color: 'white',
        fontWeight: '800',
        fontSize: '15px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer'
    },
    bottomSpacer: {
        height: '75px',
        width: '100%'
    },
    loader: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#020617',
        color: '#facc15',
        fontWeight: '800'
    }
};

export default ScenarioModule;