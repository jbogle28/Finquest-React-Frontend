import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, ArrowLeft, Zap, Target, Trophy, Info, RefreshCw } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import gameService from "../../services/gameService";

const SETTINGS = {
  easy: { time: 60, pairCount: 4, label: "Beginner", icon: <Zap size={20} /> },
  medium: { time: 45, pairCount: 6, label: "Professional", icon: <Target size={20} /> },
  hard: { time: 30, pairCount: 8, label: "Expert", icon: <Trophy size={20} /> },
};

const TimeChallenge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [difficulty, setDifficulty] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [termCards, setTermCards] = useState([]);
  const [defCards, setDefCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [matchedPairIds, setMatchedPairIds] = useState([]);
  const [wrongCardIds, setWrongCardIds] = useState([]);
  const [gameState, setGameState] = useState("setup");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Responsive Hook
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;


  const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

  const resetUI = useCallback(() => {
    setSelectedCard(null);
    setMatchedPairIds([]);
    setWrongCardIds([]);
  }, []);

  const startGame = useCallback(async (level) => {
    try {
      resetUI();
      const data = await gameService.getTimeChallengePairs(SETTINGS[level].pairCount);
      
      const terms = data.map(p => ({ id: `term-${p.term_id}`, pairId: p.term_id, type: "term", text: p.term }));
      const defs = data.map(p => ({ id: `def-${p.term_id}`, pairId: p.term_id, type: "definition", text: p.definition }));
      
      setTermCards(shuffleArray(terms));
      setDefCards(shuffleArray(defs));
      setDifficulty(level);
      setTimeLeft(SETTINGS[level].time);
      setGameState("playing");
    } catch (err) { 
      console.error("Failed to load game:", err); 
    }
  }, [resetUI]);

  const handleGameOver = useCallback(async (isWin) => {
    setGameState(isWin ? "won" : "lost");
    if (isWin) {
      const xp = difficulty === 'hard' ? 50 : difficulty === 'medium' ? 35 : 20;
      try {
        await gameService.submitTimeChallengeResult({
          xp, coins: 20, difficulty,
          pairs_matched: SETTINGS[difficulty].pairCount,
          time_remaining: timeLeft
        });
        window.dispatchEvent(new Event('userUpdate'));
        navigate("/time-challenge-success", { state: { xpEarned: xp, coinsEarned: 20, type: 'Time Challenge' } });
      } catch (err) { console.error(err); }
    } else {
      navigate("/time-challenge-unsuccessful", { 
        state: { 
          matches: matchedPairIds.length, 
          total: SETTINGS[difficulty].pairCount,
          difficulty: difficulty 
        } 
      });
    }
  }, [difficulty, timeLeft, navigate, matchedPairIds.length]);

  useEffect(() => {
    if (location.state?.restart && location.state?.difficulty) {
      startGame(location.state.difficulty);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, startGame, navigate]);

  useEffect(() => {
    if (gameState !== "playing" || timeLeft <= 0) {
      if (timeLeft === 0 && gameState === "playing") handleGameOver(false);
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [gameState, timeLeft, handleGameOver]);

  useEffect(() => {
    if (difficulty && matchedPairIds.length === SETTINGS[difficulty].pairCount) {
      handleGameOver(true);
    }
  }, [matchedPairIds, difficulty, handleGameOver]);

  const handleCardClick = (clickedCard) => {
    if (gameState !== "playing" || matchedPairIds.includes(clickedCard.pairId) || wrongCardIds.includes(clickedCard.id)) return;
    if (selectedCard?.id === clickedCard.id) { setSelectedCard(null); return; }
    if (!selectedCard) { setSelectedCard(clickedCard); return; }
    if (selectedCard.type === clickedCard.type) { setSelectedCard(clickedCard); return; }

    if (selectedCard.pairId === clickedCard.pairId) {
      setMatchedPairIds((prev) => [...prev, clickedCard.pairId]);
      setSelectedCard(null);
    } else {
      setWrongCardIds([selectedCard.id, clickedCard.id]);
      setSelectedCard(null);
      setTimeout(() => setWrongCardIds([]), 800);
    }
  };

  if (gameState === "setup") {
    return (
      <div style={{...styles.container, padding: isMobile ? '20px' : '40px'}}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
          style={{...styles.setupCard, padding: isMobile ? '30px 20px' : '50px'}} className="fin-card">
          <h1 style={{...styles.title, fontSize: isMobile ? '1.8rem' : '2.5rem'}}>Time Challenge</h1>
          <p style={styles.subtitle}>Speed-match financial concepts to secure your capital.</p>
          
          <div style={{
            ...styles.diffGrid, 
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)'
          }}>
            {Object.entries(SETTINGS).map(([key, config]) => (
              <button key={key} onClick={() => startGame(key)} style={styles.diffBtn} className="fin-card">
                <div style={{ color: 'var(--primary-purple)' }}>{config.icon}</div>
                <h3 style={{ margin: '10px 0 5px', color: 'var(--text-main)', fontSize: '16px' }}>{config.label}</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{config.pairCount} Pairs • {config.time}s</span>
              </button>
            ))}
          </div>
          <button onClick={() => navigate('/arcade')} style={styles.backBtn}><ArrowLeft size={18} /> Back</button>
        </motion.div>
      </div>
    );
  }

  const renderCard = (card) => {
    const isSelected = selectedCard?.id === card.id;
    const isWrong = wrongCardIds.includes(card.id);

    return (
      <motion.button
        key={card.id}
        layout
        onClick={() => handleCardClick(card)}
        className="fin-card"
        style={{
          ...styles.card,
          minHeight: isMobile ? '60px' : '80px',
          padding: isMobile ? '10px 15px' : '15px 20px',
          border: isSelected ? '2px solid var(--primary-purple)' : isWrong ? '2px solid var(--status-red)' : '1px solid var(--bg-hover)',
          backgroundColor: isSelected ? 'rgba(111, 66, 193, 0.1)' : 'var(--bg-card)',
        }}
        animate={{ 
          scale: isSelected ? 1.02 : 1,
          x: isWrong ? [0, -5, 5, -5, 5, 0] : 0,
        }}
      >
        <p style={{ 
          ...styles.cardText, 
          fontSize: isMobile ? '0.8rem' : '0.9rem',
          color: isSelected ? 'var(--primary-purple)' : 'var(--text-main)' 
        }}>{card.text}</p>
      </motion.button>
    );
  };

  return (
    <div style={{...styles.container, padding: isMobile ? '15px' : '40px'}}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
        style={{...styles.instructionHeader, fontSize: isMobile ? '12px' : '14px', width: '100%', justifyContent: 'center'}}>
        <Info size={isMobile ? 16 : 20} color="var(--primary-purple)" />
        <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>Match Terms with Definitions!</span>
      </motion.div>

      <div style={styles.header}>
        <div className="glass-pill" style={{...styles.timerPill, padding: '8px 15px'}}>
          <Timer size={18} color={timeLeft < 10 ? "var(--status-red)" : "var(--status-gold)"} />
          <span style={{ fontWeight: '800', marginLeft: '8px', color: 'var(--text-main)' }}>{timeLeft}s</span>
        </div>
        
        <button onClick={() => startGame(difficulty)} style={styles.refreshBtn} className="glass-pill">
           <RefreshCw size={16} /> {isMobile ? "Reset" : "New Set"}
        </button>
      </div>

      <div style={{
        ...styles.dualColumnGrid, 
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? '20px' : '40px'
      }}>
        <div style={{...styles.column, minWidth: 'auto'}}>
          <h4 style={styles.columnTitle}>TERMS</h4>
          <AnimatePresence mode="popLayout">
            {termCards.filter(c => !matchedPairIds.includes(c.pairId)).map(renderCard)}
          </AnimatePresence>
        </div>
        <div style={{...styles.column, minWidth: 'auto'}}>
          <h4 style={styles.columnTitle}>DEFINITIONS</h4>
          <AnimatePresence mode="popLayout">
            {defCards.filter(c => !matchedPairIds.includes(c.pairId)).map(renderCard)}
          </AnimatePresence>
        </div>
      </div>
      
      <button onClick={() => setGameState("setup")} style={{ ...styles.backBtn, marginTop: isMobile ? '20px' : '40px' }}>
        <ArrowLeft size={16} /> Exit Challenge
      </button>
    </div>
  );
};

const styles = {
  container: { minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  instructionHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', padding: '10px', borderRadius: '12px', background: 'var(--bg-card)', border: '1px solid var(--bg-hover)' },
  setupCard: { textAlign: 'center', maxWidth: '700px', width: '100%' },
  title: { fontWeight: '800', marginBottom: '10px', color: 'var(--text-main)' },
  subtitle: { color: 'var(--text-muted)', marginBottom: '30px', fontSize: '14px' },
  diffGrid: { display: 'grid', gap: '12px', marginBottom: '30px' },
  diffBtn: { padding: '15px', cursor: 'pointer', background: 'var(--bg-card)', border: '1px solid var(--bg-hover)', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  header: { display: 'flex', gap: '12px', marginBottom: '25px' },
  refreshBtn: { border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 15px', background: 'transparent' },
  dualColumnGrid: { display: 'grid', width: '100%', maxWidth: '1000px' },
  column: { display: 'flex', flexDirection: 'column', gap: '10px' },
  columnTitle: { textAlign: 'center', fontSize: '11px', letterSpacing: '2px', color: 'var(--primary-purple)', marginBottom: '5px', fontWeight: '800' },
  card: { cursor: 'pointer', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', transition: 'border 0.2s' },
  cardText: { fontWeight: '600', lineHeight: '1.4' },
  backBtn: { background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', margin: '10px auto 0' }
};

export default TimeChallenge;