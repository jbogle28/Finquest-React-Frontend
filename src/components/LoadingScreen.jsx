import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
    return (
        <div style={styles.container}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={styles.contentBox}
            >
                <div style={styles.videoWrapper}>
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={styles.video}
                    >
                        <source src="/assets/videos/jasper-loading-bg.webm" type="video/webm" />
                    </video>
                </div>

                <motion.h2 
                    style={styles.message}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    LOADING...
                </motion.h2>
            </motion.div>
        </div>
    );
};

const styles = {
    container: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        backgroundColor: 'rgba(15, 23, 42, 0.85)', // Tinted overlay
        backdropFilter: 'blur(8px)', // Added a slight blur for a premium feel
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        padding: 0,
        overflow: 'hidden'
    },
    contentBox: {
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    videoWrapper: {
        position: 'relative',
        /* Scalable sizing: small on mobile, capped on desktop */
        width: 'clamp(100px, 25vw, 140px)', 
        height: 'clamp(100px, 25vw, 140px)',
        marginBottom: '16px',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid rgba(168, 85, 247, 0.2)', // Subtler purple border
        boxShadow: '0 0 20px rgba(168, 85, 247, 0.15)'
    },
    video: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    message: { 
        color: 'white', 
        fontWeight: '800', 
        fontSize: '14px', // Smaller, more modern font size
        letterSpacing: '3px', // Spaced out for a clean look
        margin: 0,
        textTransform: 'uppercase'
    }
};

export default LoadingScreen;