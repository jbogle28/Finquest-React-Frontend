import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, RefreshCcw, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import quizService from '../../services/quizService';

const TOPICS = [
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

const QuizModule = ({ user }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const currentTopic = TOPICS.find(t => t.id === parseInt(id)) || TOPICS[0];

    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [attempts, setAttempts] = useState(0);
    const [historySnapshot, setHistorySnapshot] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);

        const fetchQuiz = async () => {
            setLoading(true);
            setCurrentIndex(0);
            setSelectedOption(null);
            setIsCorrect(null);
            setAttempts(0);
            setHistorySnapshot([]);

            try {
                const difficulty = currentTopic.id <= 4 ? 1 : 1; 
                const data = await quizService.getQuestions(currentTopic.title, difficulty);
                setQuestions(data);
                setLoading(false);
            } catch (err) {
                console.error("Quiz Fetch Error:", err);
                navigate('/quiz');
            }
        };
        fetchQuiz();
        return () => window.removeEventListener('resize', handleResize);
    }, [id, currentTopic.id, currentTopic.title, navigate]);

    const isMobile = windowWidth < 600;

    const handleOptionSelect = (optionKey) => {
        if (isCorrect === true) return; 
        
        const currentQ = questions[currentIndex];
        const isAnswerRight = optionKey === currentQ.answer;
        
        setSelectedOption(optionKey);
        setIsCorrect(isAnswerRight);
        setAttempts(prev => prev + 1);

        if (isAnswerRight) {
            setHistorySnapshot(prev => [
                ...prev,
                {
                    question_text: currentQ.question,
                    options: currentQ.options,
                    correct_answer: currentQ.answer,
                    user_answer: optionKey,
                    topic: currentTopic.title
                }
            ]);
        }
    };

    const handleNext = async () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsCorrect(null);
        } else {
            const payload = {
                quiz_snapshot: historySnapshot, 
                total_attempts: attempts,
                xp_reward: currentTopic.xp
            };

            try {
                const result = await quizService.submitQuiz(payload);
                navigate(`/quiz/results`, { state: { summary: result } });
            } catch (err) {
                console.error("Failed to submit quiz:", err);
            }
        }
    };

    if (loading) return <div style={styles.container}><h2 style={{color: 'white', textAlign: 'center'}}>Loading {currentTopic.title}...</h2></div>;

    const currentQ = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
        <div style={{
            ...styles.container,
            padding: isMobile ? '10px 14px' : '20px 10px'
        }}>
            {/* Header & Progress */}
            <div style={{...styles.header, marginBottom: isMobile ? '10px' : '30px'}}>
                <button onClick={() => navigate('/quiz')} style={styles.backBtn}>
                    <ArrowLeft size={isMobile ? 18 : 20} />
                </button>
                <div style={styles.progressWrapper}>
                    <div style={{...styles.topicTitle, fontSize: isMobile ? '10px' : '12px'}}>{currentTopic.title}</div>
                    <div style={styles.progressBar}>
                        <div style={{...styles.progressFill, width: `${progress}%`}} />
                    </div>
                </div>
                <div style={{...styles.qCount, fontSize: isMobile ? '14px' : '16px'}}>
                    {currentIndex + 1}/{questions.length}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div 
                    key={`${id}-${currentIndex}`} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={{
                        ...styles.quizCard,
                        padding: isMobile ? '15px' : '20px'
                    }}
                >
                    <h2 style={{
                        ...styles.questionText,
                        fontSize: isMobile ? '16px' : '18px',
                        marginBottom: isMobile ? '20px' : '22px'
                    }}>
                        {currentQ.question}
                    </h2>

                    <div style={{...styles.optionsGrid, gap: isMobile ? '10px' : '12px'}}>
                        {Object.entries(currentQ.options).map(([key, value]) => {
                            const isSelected = selectedOption === key;
                            const showSuccess = isSelected && isCorrect;
                            const showError = isSelected && isCorrect === false;

                            return (
                                <motion.button
                                    whileHover={{ scale: isCorrect ? 1 : 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    key={key}
                                    onClick={() => handleOptionSelect(key)}
                                    style={{
                                        ...styles.optionBtn,
                                        padding: isMobile ? '12px 16px' : '16px 22px',
                                        borderColor: showSuccess ? '#22c55e' : showError ? '#ef4444' : '#2d2d3d',
                                        backgroundColor: showSuccess ? 'rgba(34, 197, 94, 0.1)' : showError ? 'rgba(239, 68, 68, 0.1)' : '#1a1a24'
                                    }}
                                >
                                    <span style={{...styles.optionKey, fontSize: isMobile ? '12px' : '14px'}}>{key}</span>
                                    <span style={{...styles.optionValue, fontSize: isMobile ? '12px' : '14px'}}>{value}</span>
                                    {showSuccess && <CheckCircle2 size={isMobile ? 16 : 18} color="#22c55e" />}
                                    {showError && <XCircle size={isMobile ? 16 : 18} color="#ef4444" />}
                                </motion.button>
                            );
                        })}
                    </div>

                    <div style={{...styles.feedbackArea, marginTop: isMobile ? '30px' : '42px'}}>
                        {isCorrect === false && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.retryMsg}>
                                <RefreshCcw size={14} /> Try again!
                            </motion.div>
                        )}
                        
                        {isCorrect === true && (
                            <motion.button 
                                initial={{ scale: 0.9 }} animate={{ scale: 1 }} 
                                onClick={handleNext}
                                style={{
                                    ...styles.nextBtn,
                                    width: isMobile ? '100%' : 'auto', // Full width button on mobile
                                    padding: isMobile ? '10px' : '14px 32px'
                                }}
                            >
                                {currentIndex === questions.length - 1 ? 'Finish Quest' : 'Next Question'}
                                <ChevronRight size={20} />
                            </motion.button>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

const styles = {
    container: { maxWidth: '800px', margin: '0 auto', minHeight: '65vh' },
    header: { display: 'flex', alignItems: 'center', gap: '15px' },
    backBtn: { background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 },
    progressWrapper: { flex: 1 },
    topicTitle: { fontWeight: '800', color: '#a855f7', textTransform: 'uppercase', marginBottom: '4px' },
    progressBar: { height: '6px', background: '#1e1e2d', borderRadius: '4px', overflow: 'hidden' },
    progressFill: { height: '100%', background: '#a855f7', transition: 'width 0.3s ease' },
    qCount: { fontWeight: 'bold', color: '#94a3b8' },
    quizCard: { backgroundColor: '#1e1e2d', borderRadius: '20px', border: '1px solid #2d2d3d' },
    questionText: { lineHeight: '1.4', color: 'white', fontWeight: '600' },
    optionsGrid: { display: 'flex', flexDirection: 'column' },
    optionBtn: { display: 'flex', alignItems: 'center', borderRadius: '12px', border: '2px solid transparent', cursor: 'pointer', transition: 'all 0.2s ease', textAlign: 'left', gap: '12px' },
    optionKey: { fontWeight: '800', color: '#a855f7', width: '20px' },
    optionValue: { flex: 1, color: '#e2e8f0' },
    feedbackArea: { height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    retryMsg: { color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', fontSize: '14px' },
    nextBtn: { backgroundColor: '#a855f7', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold' }
};

export default QuizModule;
