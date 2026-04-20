import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircleDollarSign, Lightbulb, ArrowLeft, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gameService from '../../services/gameService';
import { LoadingManager } from '../../context/LoadingContext';

const Hangman = () => {
    const navigate = useNavigate();
    
    const winProcessed = useRef(false); 
    const initializationRef = useRef(false);

    const [gameData, setGameData] = useState(null);
    const [guessedLetters, setGuessedLetters] = useState([]);
    const [wrongGuesses, setWrongGuesses] = useState(0);
    const [hintsUsed, setHintsUsed] = useState(0);
    const [isInitialized, setIsInitialized] = useState(false);

    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    
    const [streak, setStreak] = useState(() => {
        return parseInt(sessionStorage.getItem('hangman_streak') || '0', 10);
    });
    
    const maxTries = 6;

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = windowSize.width < 768;
    // Helper to adjust layout for very short screens
    const isShortScreen = windowSize.height < 700;

    const fetchWord = useCallback(async () => {
        if (initializationRef.current) return;
        initializationRef.current = true;

        LoadingManager.start();
        try {
            const data = await gameService.startHangman();
            setGameData(data);
            setGuessedLetters([]);
            setWrongGuesses(0);
            setHintsUsed(0);
            winProcessed.current = false; 
            setIsInitialized(true);
        } catch (err) {
            console.error("Failed to fetch word:", err);
            initializationRef.current = false;
        } finally {
            LoadingManager.stop();
        }
    }, []);

    useEffect(() => {
        fetchWord();
    }, [fetchWord]);

    const handleWin = useCallback(async (currentStreak) => {
        if (!gameData || winProcessed.current) return;
        winProcessed.current = true; 
        LoadingManager.start(); 
        
        try {
            const newStreak = currentStreak + 1;
            const bonusXP = 150 + (newStreak * 10);
            await gameService.submitHangmanResult(true, gameData.term_id);
            setStreak(newStreak);
            sessionStorage.setItem('hangman_streak', newStreak.toString());

            navigate('/hangman-success', { 
                state: { 
                    xpEarned: bonusXP, 
                    coinsEarned: 50, 
                    streak: newStreak,
                    nextTopic: "Investing"
                } 
            });
        } catch (err) {
            console.error("Failed to submit result:", err);
            winProcessed.current = false; 
        } finally {
            LoadingManager.stop();
        }
    }, [gameData, navigate]);

    const handleLoss = useCallback(() => {
        setStreak(0);
        sessionStorage.removeItem('hangman_streak');
        navigate('/hangman-unsuccessful', { state: { word: gameData.word } });
    }, [gameData, navigate]);

    const submitGuess = async (letter) => {
        if (guessedLetters.includes(letter) || wrongGuesses >= maxTries || winProcessed.current) return;
        
        try {
            const res = await gameService.guessLetter(gameData.term_id, letter);
            const newGuessedLetters = [...guessedLetters, letter];
            setGuessedLetters(newGuessedLetters);

            if (!res.correct) {
                const newWrongCount = wrongGuesses + 1;
                setWrongGuesses(newWrongCount);
                if (newWrongCount >= maxTries) {
                    handleLoss();
                }
            } else {
                const wordChars = gameData.word.toLowerCase().split('').filter(char => char !== ' ');
                const isWinner = wordChars.every(char => newGuessedLetters.includes(char));
                if (isWinner) {
                    handleWin(streak);
                }
            }
        } catch (err) { 
            console.error("Guess error:", err); 
        }
    };

    const useHint = async () => {
        if (hintsUsed >= 2 || winProcessed.current) return;
        try {
            await gameService.deductCoins(50, 'Hangman Hint');
            window.dispatchEvent(new Event('userUpdate'));
            const fullWord = gameData.word.toLowerCase();
            const availableLetters = fullWord.split('').filter(
                char => char !== ' ' && !guessedLetters.includes(char)
            );
            if (availableLetters.length > 0) {
                const randomLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)];
                submitGuess(randomLetter);
                setHintsUsed(prev => prev + 1);
            }
        } catch (err) { 
            alert(err.response?.data?.msg || "Insufficient coins."); 
        }
    };

    if (!isInitialized || !gameData) return null;

    return (
        <div style={{...styles.container, padding: isMobile ? '30px' : '24px'}}>
            {/* Header Section */}
            <div style={styles.nav}>
                <button onClick={() => navigate('/arcade')} style={styles.backBtn}>
                    <ArrowLeft size={isMobile ? 18 : 20}/> {isMobile ? '' : 'Arcade Hub'}
                </button>
                
                <div style={{display: 'flex', gap: '10px'}}>
                    {streak > 0 && (
                        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={styles.streakBadge}>
                            <Flame size={isMobile ? 16 : 20} fill="#f97316" color="#f97316" />
                            <span style={{fontSize: isMobile ? '12px' : '14px'}}>{streak}</span>
                        </motion.div>
                    )}

                    <button 
                        onClick={useHint} 
                        disabled={hintsUsed >= 2}
                        style={{...styles.hintBtn, opacity: hintsUsed >= 2 ? 0.5 : 1}}
                    >
                        <Lightbulb size={isMobile ? 16 : 18} /> {isMobile ? 'Hint' : 'Get Hint (-50 🪙)'}
                    </button>
                </div>
            </div>

            {/* Game Content Area: flex-grow ensures this takes up available space */}
            <div style={styles.gameContent}>
                <div style={{...styles.balloonStage, height: isMobile ? '100px' : '140px'}}>
                    <AnimatePresence>
                        {[...Array(maxTries - wrongGuesses)].map((_, i) => (
                            <motion.div
                                key={`balloon-${i}`}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1, y: [0, -10, 0], rotate: [0, 2, -2, 0] }}
                                exit={{ scale: 1.5, opacity: 0, filter: 'blur(10px)' }}
                                transition={{ 
                                    y: { repeat: Infinity, duration: 2.5 + i, ease: "easeInOut" },
                                    rotate: { repeat: Infinity, duration: 3 + i, ease: "easeInOut" }
                                }}
                                style={styles.balloon}
                            >
                                <CircleDollarSign size={isMobile ? 32 : 48} color="#fbbf24" fill="#fbbf2433" />
                                <div style={{...styles.string, height: isMobile ? '20px' : '30px'}} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <div style={{...styles.wordDisplay, gap: isMobile ? '6px' : '12px'}}>
                    {(gameData?.word || "").split('').map((char, i) => (
                        <span key={i} style={{
                            ...styles.letterSlot, 
                            fontSize: isMobile ? '1.2rem' : '1.5rem',
                            minWidth: isMobile ? '20px' : '40px',
                            color: guessedLetters.includes(char.toLowerCase()) ? '#fbbf24' : 'white'
                        }}>
                            {char === ' ' ? '\u00A0' : (guessedLetters.includes(char.toLowerCase()) ? char : '_')}
                        </span>
                    ))}
                </div>

                <div style={{...styles.hintBox, padding: isMobile ? '12px' : '20px', marginBottom: isShortScreen ? '10px' : '20px'}}>
                    <p style={{...styles.hintText, fontSize: isMobile ? '0.9rem' : '1.1rem'}}>
                        <span style={{color: '#fbbf24', fontWeight: '900', display: 'block', marginBottom: '4px', fontSize: '0.7rem', letterSpacing: '1px'}}>DEFINITION</span> 
                        {gameData.definition || gameData.hint}
                    </p>
                </div>
            </div>

            {/* Keyboard pinned to bottom */}
            <div style={{
                ...styles.keyboard, 
                gridTemplateColumns: isMobile ? 'repeat(9, 1fr)' : 'repeat(auto-fit, minmax(50px, 1fr))',
                gap: isMobile ? '2px' : '10px'
            }}>
                {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').map(letter => {
                    const isUsed = guessedLetters.includes(letter.toLowerCase());
                    return (
                        <motion.button
                            whileTap={!isUsed ? { scale: 0.9 } : {}}
                            key={letter}
                            onClick={() => submitGuess(letter.toLowerCase())}
                            disabled={isUsed}
                            style={{
                                ...styles.key,
                                padding: isMobile ? '6px 0' : '15px',
                                fontSize: isMobile ? '0.8rem' : '1.1rem',
                                height: isMobile ? '35px' : '50px',
                                backgroundColor: isUsed ? '#1e293b' : '#334155',
                                opacity: isUsed ? 0.3 : 1,
                                cursor: isUsed ? 'default' : 'pointer',
                                border: isUsed ? '1px solid transparent' : '1px solid #475569',
                                boxShadow: isUsed ? 'none' : '0 3px 0 #1e293b'
                            }}
                        >
                            {letter}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

const styles = {
    container: { 
        height: '100vh', 
        background: '#0f172a', 
        color: 'white', 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden',
        boxSizing: 'border-box'
    },
    nav: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '10px',
        flexShrink: 0 
    },
    backBtn: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 12px', borderRadius: '10px', fontWeight: '600' },
    streakBadge: { display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(249, 115, 22, 0.1)', padding: '6px 12px', borderRadius: '10px', color: '#f97316', fontWeight: '900', border: '1px solid rgba(249, 115, 22, 0.2)' },
    hintBtn: { background: '#1e293b', border: '1px solid #fbbf2444', color: '#fbbf24', padding: '6px 12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '700' },
    gameContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', // Centers balloons and word in the middle space
        alignItems: 'center',
        width: '100%',
        overflow: 'hidden'
    },
    balloonStage: { display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'flex-end', marginBottom: '20px' },
    balloon: { position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    string: { width: '2px', background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)', marginTop: '5px' },
    wordDisplay: { display: 'flex', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px', padding: '0 10px' },
    letterSlot: { fontWeight: '900', borderBottom: '3px solid #334155', textAlign: 'center', textTransform: 'uppercase' },
    hintBox: { background: 'rgba(30, 41, 59, 0.5)', borderRadius: '20px', maxWidth: '600px', border: '1px solid rgba(255,255,255,0.05)', width: '100%', boxSizing: 'border-box' },
    hintText: { textAlign: 'center', color: '#cbd5e1', margin: 0, lineHeight: '1.4', fontWeight: '500' },
    keyboard: { 
        display: 'grid', 
        width: '100%', 
        maxWidth: '800px', 
        margin: '0 auto',
        flexShrink: 0,
        paddingBottom: '50px' 
    },
    key: { borderRadius: '10px', color: 'white', fontWeight: '800', display: 'flex', justifyContent: 'center', alignItems: 'center' },
};

export default Hangman;