import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowLeft, Info } from 'lucide-react';
import quizService from '../../services/quizService';

const QuizReview = () => {
    const { historyId } = useParams();
    const navigate = useNavigate();
    const [reviewData, setReviewData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        
        const fetchReview = async () => {
            try {
                const data = await quizService.getReview(historyId);
                setReviewData(data);
            } catch (err) {
                console.error("Failed to load review:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReview();
        return () => window.removeEventListener('resize', handleResize);
    }, [historyId]);

    const isMobile = windowWidth < 600;

    if (loading) return <div style={styles.loading}>Loading Review...</div>;
    if (!reviewData) return <div style={styles.loading}>Review not found.</div>;

    return (
        <div style={{
            ...styles.container,
            padding: isMobile ? '20px 15px' : '40px 20px'
        }}>
            <div style={{...styles.header, marginBottom: isMobile ? '25px' : '40px'}}>
                <button onClick={() => navigate('/quiz')} style={styles.backBtn}>
                    <ArrowLeft size={18} /> {isMobile ? 'Back' : 'Back to Path'}
                </button>
                <h1 style={{
                    ...styles.title,
                    fontSize: isMobile ? '24px' : '32px'
                }}>Performance Review</h1>
                <div style={styles.scoreBadge}>
                    Accuracy: {Math.round(reviewData.score)}%
                </div>
            </div>

            <div style={styles.list}>
                {reviewData.questions.map((q, index) => {
                    const isCorrect = q.user_answer === q.correct_answer;
                    
                    return (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            style={{
                                ...styles.questionCard,
                                padding: isMobile ? '16px' : '24px',
                                borderLeft: `6px solid ${isCorrect ? '#22c55e' : '#ef4444'}`
                            }}
                        >
                            <div style={styles.qHeader}>
                                <span style={styles.qNumber}>Question {index + 1}</span>
                                {isCorrect ? 
                                    <div style={styles.tagCorrect}><CheckCircle2 size={14}/> Correct</div> : 
                                    <div style={styles.tagWrong}><XCircle size={14}/> Incorrect</div>
                                }
                            </div>
                            
                            <h3 style={{
                                ...styles.qText,
                                fontSize: isMobile ? '16px' : '18px',
                                marginBottom: isMobile ? '15px' : '20px'
                            }}>{q.question_text}</h3>

                            <div style={{
                                ...styles.optionsGrid,
                                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' // Stack on mobile
                            }}>
                                {Object.entries(q.options).map(([key, val]) => {
                                    const isUserChoice = q.user_answer === key;
                                    const isRightChoice = q.correct_answer === key;

                                    let bg = '#1a1a24'; // Using hex to ensure consistency
                                    let border = '#2d2d3d';
                                    
                                    if (isRightChoice) {
                                        bg = 'rgba(34, 197, 94, 0.1)';
                                        border = '#22c55e';
                                    } else if (isUserChoice && !isCorrect) {
                                        bg = 'rgba(239, 68, 68, 0.1)';
                                        border = '#ef4444';
                                    }

                                    return (
                                        <div key={key} style={{
                                            ...styles.option, 
                                            backgroundColor: bg, 
                                            borderColor: border,
                                            padding: isMobile ? '10px 12px' : '12px 16px'
                                        }}>
                                            <span style={styles.optionKey}>{key}</span>
                                            <span style={{...styles.optionVal, fontSize: isMobile ? '13px' : '14px'}}>{val}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            {!isCorrect && (
                                <div style={{...styles.explanation, fontSize: isMobile ? '12px' : '13px'}}>
                                    <Info size={16} style={{flexShrink: 0}} />
                                    <span>The correct answer was <strong>{q.correct_answer}</strong>. Keep practicing!</span>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
            
            <button 
                onClick={() => navigate('/dashboard')} 
                style={{
                    ...styles.doneBtn,
                    padding: isMobile ? '14px' : '16px',
                    marginTop: isMobile ? '20px' : '40px'
                }}
            >
                Return to Dashboard
            </button>
        </div>
    );
};

const styles = {
    container: { maxWidth: '800px', margin: '0 auto' },
    loading: { color: 'white', textAlign: 'center', marginTop: '100px', fontWeight: 'bold' },
    header: { display: 'flex', flexDirection: 'column', gap: '8px' },
    backBtn: { background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', width: 'fit-content', padding: 0 },
    title: { fontWeight: '800', color: 'white', margin: 0 },
    scoreBadge: { backgroundColor: '#a855f7', color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', width: 'fit-content', fontWeight: 'bold' },
    list: { display: 'flex', flexDirection: 'column', gap: '16px' },
    questionCard: { backgroundColor: '#1e1e2d', borderRadius: '16px', border: '1px solid #2d2d3d' },
    qHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' },
    qNumber: { fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase' },
    tagCorrect: { color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 'bold' },
    tagWrong: { color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 'bold' },
    qText: { color: 'white', lineHeight: '1.5', fontWeight: '600' },
    optionsGrid: { display: 'grid', gap: '8px' },
    option: { borderRadius: '10px', border: '1px solid', display: 'flex', gap: '10px', alignItems: 'center' },
    optionKey: { fontWeight: 'bold', color: '#a855f7' },
    optionVal: { color: '#e2e8f0' },
    explanation: { marginTop: '16px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'flex-start', color: '#94a3b8' },
    doneBtn: { width: '100%', borderRadius: '12px', border: 'none', backgroundColor: 'white', color: 'black', fontWeight: '800', cursor: 'pointer', fontSize: '16px', marginBottom: '70px' }
};

export default QuizReview;