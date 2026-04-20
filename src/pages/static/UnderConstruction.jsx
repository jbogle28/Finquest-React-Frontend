import React from 'react';
import { motion } from 'framer-motion';
import { HardHat, ArrowLeft, Construction, Cone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UnderConstruction = ({ featureName = "This Feature" }) => {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="fin-card" // Using your global class for the hover effect and borders
                style={styles.card}
            >
                {/* Visual Icon Section */}
                <div style={styles.iconContainer}>
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    >
                        <HardHat size={70} color="var(--status-gold)" />
                    </motion.div>
                    
                    <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
                        style={styles.subIconLeft}
                    >
                        <Cone size={24} color="#f97316" />
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: 0.8 }}
                        style={styles.subIconRight}
                    >
                        <Construction size={24} color="var(--primary-purple)" />
                    </motion.div>
                </div>

                {/* Text Content */}
                <h1 style={styles.title}>Pardon Our Dust!</h1>
                <div className="glass-pill" style={styles.pillOverride}>
                    <span style={styles.highlight}>{featureName}</span>
                </div>
                
                <p style={styles.description}>
                    We are currently engineering a premium financial experience. 
                    This module is being audited and will be deployed shortly.
                </p>

                {/* Action Button */}
                <button 
                    onClick={() => navigate('/arcade')} 
                    style={styles.backBtn}
                >
                    <ArrowLeft size={18} /> Return to Arcade Hub
                </button>
            </motion.div>
        </div>
    );
};

const styles = {
    container: { 
        minHeight: '100vh', 
        background: 'var(--bg-deep)', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '20px',
        color: 'var(--text-main)'
    },
    card: { 
        padding: '60px 50px', 
        textAlign: 'center', 
        maxWidth: '550px', 
        width: '100%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    iconContainer: {
        position: 'relative',
        marginBottom: '30px',
    },
    subIconLeft: { position: 'absolute', bottom: '-5px', left: '-25px' },
    subIconRight: { position: 'absolute', top: '-5px', right: '-25px' },
    title: { 
        fontSize: '2.5rem', 
        fontWeight: '800',
        marginBottom: '15px',
        letterSpacing: '-1px',
        color: 'var(--text-main)'
    },
    pillOverride: {
        marginBottom: '20px',
        border: '1px solid var(--primary-purple)',
    },
    highlight: {
        color: 'var(--primary-purple)',
        fontWeight: '700',
        fontSize: '1.1rem'
    },
    description: { 
        color: 'var(--text-muted)',
        fontSize: '1rem',
        lineHeight: '1.6',
        maxWidth: '400px',
        marginBottom: '40px'
    },
    backBtn: { 
        background: 'var(--bg-hover)', 
        color: 'var(--text-main)', 
        padding: '14px 28px', 
        borderRadius: 'var(--radius-md)', 
        border: '1px solid var(--bg-hover)', 
        fontWeight: '700', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px',
        cursor: 'pointer',
        transition: 'var(--transition)'
    }
};

export default UnderConstruction;