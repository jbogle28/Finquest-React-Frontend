import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Info, Trophy, ChevronRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import gameService from '../../services/gameService';

const TOPIC_MAP = {
    "Budgeting": "Budgeting Basics",
    "Banking": "Banking & Accounts",
    "Credit": "Credit & Debt",
    "Retirement": "Retirement & Future",
    "Taxes": "Taxes & Freedom"
};

const TOPIC_SEQUENCE = Object.values(TOPIC_MAP);

const Crossword = () => {
    const { topic } = useParams();
    const navigate = useNavigate();
    const inputRefs = useRef({}); 
    
    const [gridData, setGridData] = useState(null);
    const [userGrid, setUserGrid] = useState({});
    const [completedWords, setCompletedWords] = useState([]);
    const [focusedCell, setFocusedCell] = useState(null);
    const [direction, setDirection] = useState('across'); 
    
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        cellSize: 20
    });

    const updateDimensions = useCallback(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const gridCols = gridData?.grid_size || 12;
        const gridRows = 12;
        
        const isMobileView = width < 1024;

        // 1. Calculate height-based cell size first to ensure it fits the screen
        // Subtracting headers (80px) and padding/margins (60px)
        const verticalPadding = isMobileView ? 120 : 220;
        const availableHeight = height - verticalPadding;
        const maxHeightCell = Math.floor(availableHeight / gridRows);

        // 2. Calculate width-based cell size
        const availableWidth = isMobileView ? width * 0.5 : width * 0.35;
        const maxWidthCell = Math.floor((availableWidth - 40) / gridCols);
        
        // 3. Take the smaller of the two, and cap the max size for desktop
        let newCellSize = Math.min(maxWidthCell, maxHeightCell);
        
        // Cap cell size so it doesn't get "massive" on high-res monitors
        const absoluteMax = isMobileView ? 35 : 24;
        newCellSize = Math.min(Math.max(newCellSize, 16), absoluteMax);

        setDimensions({ width, cellSize: newCellSize });
    }, [gridData?.grid_size]);

    useEffect(() => {
        window.addEventListener('resize', updateDimensions);
        updateDimensions();
        return () => window.removeEventListener('resize', updateDimensions);
    }, [updateDimensions, gridData]);

    const isMobile = dimensions.width < 1024;
    const currentTopic = topic ? (TOPIC_MAP[topic] || topic) : TOPIC_SEQUENCE[0];

    const handleFinish = useCallback(async () => {
        try {
            await gameService.submitCrossword({ topic: currentTopic, time_taken: 0, xp_reward: 150 });
            navigate('/crossword-success', { state: { xpEarned: 150, topic: currentTopic } });
        } catch (err) { console.error("Error saving progress:", err); }
    }, [currentTopic, navigate]);

    const checkWordCompletion = useCallback((currentGrid, data) => {
        if (!data) return;
        const newlyCompleted = [];
        ['across', 'down'].forEach(dir => {
            if (!data[dir]) return;
            Object.entries(data[dir]).forEach(([id, item]) => {
                let isFull = true;
                for (let i = 0; i < item.word.length; i++) {
                    const r = dir === 'across' ? item.y : item.y + i;
                    const c = dir === 'across' ? item.x + i : item.x;
                    if (currentGrid[`${r}-${c}`] !== item.word[i].toUpperCase()) {
                        isFull = false;
                        break;
                    }
                }
                if (isFull) newlyCompleted.push(`${dir}-${id}`);
            });
        });
        setCompletedWords(newlyCompleted);
        const totalWords = (Object.keys(data.across || {}).length) + (Object.keys(data.down || {}).length);
        if (newlyCompleted.length === totalWords && totalWords > 0) handleFinish();
    }, [handleFinish]);

    const moveFocus = (r, c, dir) => {
        // Increment row only if going 'down', increment col only if going 'across'
        const nextR = dir === 'down' ? r + 1 : r;
        const nextC = dir === 'across' ? c + 1 : c;
        
        const nextKey = `${nextR}-${nextC}`;
        if (inputRefs.current[nextKey]) {
            inputRefs.current[nextKey].focus();
        }
    };

    const handleInput = (row, col, value) => {
        // Only take the last character typed
        const char = value.slice(-1).toUpperCase();
        
        // Validation: Only allow A-Z
        if (char && !/[A-Z]/.test(char)) return; 
    
        const key = `${row}-${col}`;
        const newUserGrid = { ...userGrid, [key]: char };
        setUserGrid(newUserGrid);
    
        // AUTO-MOVE LOGIC:
        // If the user typed a letter (not deleting), move the focus
        if (char !== "") {
            moveFocus(row, col, direction);
        }
        
        checkWordCompletion(newUserGrid, gridData);
    };

    const handleKeyDown = (e, r, c) => {
        if (e.key === 'Backspace') {
            // If the current cell is empty, jump to the previous one
            if (!userGrid[`${r}-${c}`]) {
                const prevR = direction === 'down' ? r - 1 : r;
                const prevC = direction === 'across' ? c - 1 : c;
                const prevKey = `${prevR}-${prevC}`;
                
                if (inputRefs.current[prevKey]) {
                    inputRefs.current[prevKey].focus();
                }
            }
        } 
        // Allow manual direction switching with arrows
        else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            setDirection('across');
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            setDirection('down');
        }
    };
    
    useEffect(() => {
        const loadPuzzle = async () => {
            try {
                const data = await gameService.getCrossword(currentTopic);
                setGridData(data);
            } catch (err) { console.error("Failed to load:", err); }
        };
        loadPuzzle();
    }, [currentTopic]);

    const findCellData = (data, r, c) => {
        if (!data) return { number: null, isBlack: true, wordIds: [] };
        let number = null; let isBlack = true; let wordIds = [];
        ['across', 'down'].forEach(dir => {
            if (!data[dir]) return;
            Object.entries(data[dir]).forEach(([id, item]) => {
                const isPart = dir === 'across' 
                    ? (r === item.y && c >= item.x && c < item.x + item.word.length)
                    : (c === item.x && r >= item.y && r < item.y + item.word.length);
                if (isPart) { isBlack = false; wordIds.push(`${dir}-${id}`); }
                if (item.y === r && item.x === c) number = item.clue_number; 
            });
        });
        return { number, isBlack, wordIds };
    };

    if (!gridData) return null;

    const gridCols = gridData.grid_size || 12;
    const gridRows = 12;

    const currentStyles = isMobile ? mobileStyles : desktopStyles;

    return (
        <div style={currentStyles.container}>
            <header style={currentStyles.header}>
                <div style={{ flex: 1 }}>
                    <h2 style={currentStyles.title}>{currentTopic}</h2>
                    <div style={currentStyles.statItem}>
                        <Trophy size={isMobile ? 10 : 14} color="#fbbf24" />
                        <span style={{ fontSize: isMobile ? '9px' : '12px' }}>{completedWords.length} Solved</span>
                    </div>
                </div>
                <div 
                    style={currentStyles.directionToggle} 
                    onClick={() => setDirection(direction === 'across' ? 'down' : 'across')}
                >
                    <span style={currentStyles.dirText}>{direction}</span>
                    <ChevronRight size={isMobile ? 10 : 14} style={{ transform: direction === 'down' ? 'rotate(90deg)' : 'none' }}/>
                </div>
            </header>

            <div style={{
                ...currentStyles.gameLayout, 
                gridTemplateColumns: isMobile ? '1.5fr 1fr' : '1fr 280px'
            }}>
                <div style={currentStyles.gridWrapper}>
                    <div style={{
                        ...currentStyles.crosswordGrid,
                        gridTemplateColumns: `repeat(${gridCols}, ${dimensions.cellSize}px)`,
                        gridTemplateRows: `repeat(${gridRows}, ${dimensions.cellSize}px)`,
                    }}>
                        {Array.from({ length: gridRows }).map((_, r) => (
                            Array.from({ length: gridCols }).map((_, c) => {
                                const cell = findCellData(gridData, r, c);
                                if (cell.isBlack) return <div key={`b-${r}-${c}`} style={sharedStyles.hiddenCell} />;
                                const isFinished = cell.wordIds.some(id => completedWords.includes(id));
                                const isFocused = focusedCell === `${r}-${c}`;
                                return (
                                    <div key={`${r}-${c}`} style={sharedStyles.cellContainer}>
                                        {cell.number && (
                                            <span style={{
                                                ...sharedStyles.cellNum, 
                                                fontSize: dimensions.cellSize < 20 ? '5px' : '7px'
                                            }}>{cell.number}</span>
                                        )}
                                        <input
                                            ref={el => inputRefs.current[`${r}-${c}`] = el}
                                            onFocus={() => setFocusedCell(`${r}-${c}`)}
                                            onBlur={() => setFocusedCell(null)}
                                            onKeyDown={(e) => handleKeyDown(e, r, c)}
                                            style={{
                                                ...currentStyles.cellInput,
                                                width: dimensions.cellSize,
                                                height: dimensions.cellSize,
                                                fontSize: dimensions.cellSize < 22 ? '0.6rem' : '0.9rem',
                                                backgroundColor: isFinished ? '#064e3b' : isFocused ? '#2d3748' : '#1e293b',
                                                borderColor: isFocused ? '#a855f7' : isFinished ? '#059669' : '#334155',
                                                color: isFinished ? '#34d399' : 'white'
                                            }}
                                            maxLength={1}
                                            inputMode="text"
                                            value={userGrid[`${r}-${c}`] || ''}
                                            onChange={(e) => handleInput(r, c, e.target.value)}
                                        />
                                    </div>
                                );
                            })
                        ))}
                    </div>
                </div>

                <div style={currentStyles.cluesContainer}>
                    <h3 style={currentStyles.clueHeader}>
                        <Info size={isMobile ? 11 : 14} /> Clues
                    </h3>
                    <div style={sharedStyles.clueScroll}>
                        {['across', 'down'].map(dir => (
                            <div key={dir}>
                                <h4 style={currentStyles.dirLabel}>{dir}</h4>
                                {Object.entries(gridData[dir] || {}).map(([id, item]) => {
                                    const isDone = completedWords.includes(`${dir}-${id}`);
                                    return (
                                        <div key={id} style={currentStyles.clueRow}>
                                            <span style={{
                                                ...currentStyles.clueNum,
                                                color: isDone ? '#10b981' : '#a855f7',
                                                opacity: isDone ? 0.4 : 1
                                            }}>{item.clue_number}</span>
                                            <p style={{
                                                ...currentStyles.clueText,
                                                textDecoration: isDone ? 'line-through' : 'none',
                                                opacity: isDone ? 0.4 : 1
                                            }}>{item.clue}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const sharedStyles = {
    hiddenCell: { background: 'transparent' },
    cellContainer: { position: 'relative' },
    clueScroll: { overflowY: 'auto', flex: 1, paddingRight: '4px' },
    cellNum: { position: 'absolute', top: '1px', left: '2px', color: '#a855f7', fontWeight: '900', zIndex: 2, pointerEvents: 'none' },
};

const mobileStyles = {
    container: { width: '100%', padding: '5px 8px', boxSizing: 'border-box', height: '70vh', display: 'flex', flexDirection: 'column' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
    title: { fontWeight: '800', margin: 0, color: 'white', fontSize: '0.85rem' },
    statItem: { display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8' },
    directionToggle: { display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#1e293b', padding: '2px 8px', borderRadius: '15px', border: '1px solid #334155' },
    dirText: { fontSize: '8px', fontWeight: '900', textTransform: 'uppercase', color: '#a855f7' },
    gameLayout: { display: 'grid', gap: '6px', flex: 1, overflow: 'hidden' },
    gridWrapper: { backgroundColor: '#0f172a', borderRadius: '12px', padding: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #1e293b' },
    crosswordGrid: { display: 'grid', gap: '3px' },
    cellInput: { textAlign: 'center', borderRadius: '2px', border: '1px solid', fontWeight: '800', textTransform: 'uppercase', outline: 'none' },
    cluesContainer: { backgroundColor: '#1e293b', padding: '6px', borderRadius: '8px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    clueHeader: { fontSize: '0.7rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px', color: 'white' },
    dirLabel: { color: '#a855f7', textTransform: 'uppercase', fontSize: '7px', fontWeight: '900', marginBottom: '4px' },
    clueRow: { display: 'flex', gap: '4px', marginBottom: '4px' },
    clueNum: { fontWeight: '900', fontSize: '9px', minWidth: '10px' },
    clueText: { fontSize: '9px', margin: 0, color: '#cbd5e1', lineHeight: '1.1' }
};

const desktopStyles = {
    // Height set to 85% of viewport height to ensure visibility of the container end
    container: { width: '100%', maxWidth: '900px', margin: '0 auto', padding: '15px', boxSizing: 'border-box', height: '80vh', display: 'flex', flexDirection: 'column' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
    title: { fontWeight: '800', margin: 0, color: 'white', fontSize: '1.3rem' },
    statItem: { display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8' },
    directionToggle: { display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#1e293b', padding: '4px 12px', borderRadius: '15px', border: '1px solid #334155', cursor: 'pointer' },
    dirText: { fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#a855f7' },
    gameLayout: { display: 'grid', gap: '12px', flex: 1, overflow: 'hidden' },
    gridWrapper: { backgroundColor: '#0f172a', borderRadius: '16px', padding: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #1e293b' },
    crosswordGrid: { display: 'grid', gap: '3.5px' },
    cellInput: { textAlign: 'center', borderRadius: '3px', border: '1px solid', fontWeight: '800', textTransform: 'uppercase', outline: 'none' },
    cluesContainer: { backgroundColor: '#1e293b', padding: '12px', borderRadius: '12px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    clueHeader: { fontSize: '0.9rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: 'white' },
    dirLabel: { color: '#a855f7', textTransform: 'uppercase', fontSize: '9px', fontWeight: '900', marginBottom: '6px', marginTop: '4px' },
    clueRow: { display: 'flex', gap: '6px', marginBottom: '8px' },
    clueNum: { fontWeight: '900', fontSize: '11px', minWidth: '15px' },
    clueText: { fontSize: '11px', margin: 0, color: '#cbd5e1', lineHeight: '1.3' }
};

export default Crossword;
