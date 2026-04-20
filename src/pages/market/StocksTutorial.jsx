import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, Zap, ShieldCheck, Info, TrendingUp, AlertCircle } from 'lucide-react';

const StocksTutorial = ({ sampleStock, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, height: 0 });
    const isMobile = window.innerWidth < 768;

const tutorialSteps = [
    {
        id: 'tutorial-anchor-card',
        title: "Analysis",
        content: `Reviewing ${sampleStock.ticker}.`,
        icon: <Info size={14} color="#a855f7" />
    },
    {
        id: 'step-roe', // Highlight the ROE metric first in the grid
        title: "ROE",
        content: "Checks profit efficiency.",
        icon: <Zap size={14} color="#a855f7" />
    },
    {
        id: 'step-safety', // Highlight the Safety metric
        title: "Safety",
        content: "Aim for 20% protection.",
        icon: <ShieldCheck size={14} color="#10b981" />
    },
    {
        id: 'step-debt', // Added this to match your UI code
        title: "Debt/Eq",
        content: "Check company leverage.",
        icon: <AlertCircle size={14} color="#f59e0b" />
    },
    {
        id: 'step-intrinsic', // Highlight the Intrinsic Value
        title: "Value",
        content: "Price < Value = Bargain.",
        icon: <TrendingUp size={14} color="#94a3b8" />
    }
];

    useEffect(() => {
        const updateCoords = () => {
            const element = document.getElementById(tutorialSteps[currentStep].id);
            if (element) {
                const rect = element.getBoundingClientRect();
                setCoords({
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height
                });
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        };

        const timer = setTimeout(updateCoords, 150);
        window.addEventListener('resize', updateCoords);
        return () => {
            window.removeEventListener('resize', updateCoords);
            clearTimeout(timer);
        };
    }, [currentStep]);

    const getTooltipStyles = () => {
        if (isMobile) {
            return { 
                bottom: '220px', 
                left: '60%', 
                right: '10px', 
                width: 'calc(30% - 20px)' 
            };
        }

// MANUALLY ADJUST DESKTOP WIDTH HERE
    const boxWidth = 140; 
    let left = coords.left + coords.width + 10;
    let top = coords.top;

    // Flip logic if box goes off screen
    if (left + boxWidth > window.innerWidth) {
        left = coords.left - (boxWidth + 10);
    }

    return { top, left, width: `${boxWidth}px` };
    };

    return (
        <div style={styles.overlay}>
            {/* The Spotlight - No background color on overlay avoids double-tinting */}
            <motion.div 
                animate={{ 
                    top: coords.top - 4, 
                    left: coords.left - 4, 
                    width: coords.width + 8, 
                    height: coords.height + 8 
                }}
                style={styles.spotlight}
            />

            <AnimatePresence mode="wait">
                <motion.div 
                    key={currentStep}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0, ...getTooltipStyles() }}
                    exit={{ opacity: 0, y: 5 }}
                    style={styles.tooltip}
                >
                    <div style={styles.header}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {tutorialSteps[currentStep].icon}
                            <span style={styles.title}>{tutorialSteps[currentStep].title}</span>
                        </div>
                        <button onClick={onClose} style={styles.closeBtn}><X size={12} /></button>
                    </div>

                    <p style={styles.content}>{tutorialSteps[currentStep].content}</p>

                    <div style={styles.footer}>
                        <span style={styles.stepCount}>{currentStep + 1}/{tutorialSteps.length}</span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {currentStep > 0 && (
                                <button onClick={() => setCurrentStep(prev => prev - 1)} style={styles.navBtn}>
                                    <ChevronLeft size={12} />
                                </button>
                            )}
                            <button 
                                onClick={() => currentStep === tutorialSteps.length - 1 ? onClose() : setCurrentStep(prev => prev + 1)} 
                                style={styles.nextBtn}
                            >
                                {currentStep === tutorialSteps.length - 1 ? "End" : "Next"}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'transparent', zIndex: 9999, pointerEvents: 'none'
    },
    spotlight: {
        position: 'fixed', borderRadius: '8px',
        boxShadow: '0 0 0 9999px rgba(2, 6, 23, 0.8)', // Unified dark tint
        border: '1.5px solid #a855f7', pointerEvents: 'none', zIndex: 10000
    },
    tooltip: {
        position: 'fixed', background: '#1e293b', borderRadius: '10px',
        padding: '8px 12px', border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 20px rgba(0,0,0,0.6)', zIndex: 10001, pointerEvents: 'auto'
    },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' },
    title: { color: 'white', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' },
    closeBtn: { background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 },
    content: { fontSize: '0.7rem', color: '#94a3b8', lineHeight: '1.3', margin: '0 0 8px 0' },
    footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px solid #334155' },
    stepCount: { fontSize: '0.6rem', color: '#64748b', fontWeight: '700' },
    navBtn: { background: '#334155', border: 'none', color: 'white', padding: '2px', borderRadius: '4px', cursor: 'pointer' },
    nextBtn: { 
        background: '#a855f7', border: 'none', color: 'white', padding: '2px 4px', 
        borderRadius: '4px', fontWeight: '800', cursor: 'pointer', fontSize: '0.65rem'
    }
};

export default StocksTutorial;