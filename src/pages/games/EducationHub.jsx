import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, TrendingUp, ArrowRight, GraduationCap } from 'lucide-react';

const EducationHub = () => {
    const navigate = useNavigate();
    const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

    React.useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isDesktop = windowWidth >= 1024;
    const isMobile = windowWidth < 600;

    const hubItems = [
        { 
            id: 'quizzes', 
            title: 'QUIZ PATH', 
            desc: isMobile ? 'Master concepts.' : 'Master financial concepts through structured levels.', 
            icon: <BookOpen size={isDesktop ? 32 : 22} color="#06b6d4" />, 
            path: '/quiz',
            color: '#06b6d4'
        },
        { 
            id: 'scenarios', 
            title: 'SIM LABS', 
            desc: isMobile ? 'Market sims.' : 'Real-world decision making and market simulations.', 
            icon: <TrendingUp size={isDesktop ? 32 : 22} color="#8b5cf6" />, 
            path: '/scenarios',
            color: '#8b5cf6'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
        hover: { y: -8, transition: { type: 'spring', stiffness: 300 } }
    };

    return (
        <div style={{
            ...styles.container,
            paddingBottom: isMobile ? '90px' : '40px' // Margin for mobile navbar
        }}>
            <header style={styles.header}>
                <div style={styles.badge}>
                    <GraduationCap size={14} style={{ marginRight: '6px' }} />
                    ACADEMY
                </div>
                <h2 style={{...styles.title, fontSize: isDesktop ? '2rem' : '1.3rem'}}>EDUCATION HUB</h2>
                <p style={{...styles.subtitle, fontSize: isDesktop ? '1rem' : '0.7rem'}}>Select your modality to begin.</p>
            </header>

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{
                    ...styles.menuGrid,
                    // Force 2 columns on all screen sizes
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: isMobile ? '10px' : '24px'
                }}
            >
                {hubItems.map((item) => (
                    <motion.div 
                        key={item.id} 
                        variants={cardVariants}
                        whileHover={isDesktop ? "hover" : ""}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            ...styles.menuCard,
                            padding: isDesktop ? '40px 30px' : '24px 12px'
                        }} 
                        onClick={() => navigate(item.path)}
                    >
                        <div style={{
                            ...styles.iconWrapper, 
                            backgroundColor: `${item.color}15`,
                            width: isDesktop ? '64px' : '50px',
                            height: isDesktop ? '64px' : '50px',
                            marginBottom: isDesktop ? '24px' : '12px',
                            border: `1px solid ${item.color}30`
                        }}>
                            {item.icon}
                        </div>
                        
                        <h3 style={{...styles.cardTitle, fontSize: isDesktop ? '1.3rem' : '0.85rem'}}>{item.title}</h3>
                        <p style={{...styles.cardDesc, fontSize: isDesktop ? '0.95rem' : '0.65rem'}}>{item.desc}</p>
                        
                        <div style={{...styles.enterBtn, color: item.color, fontSize: isDesktop ? '0.85rem' : '0.6rem'}}>
                            {isMobile ? 'START' : 'Enter Module'} <ArrowRight size={isDesktop ? 16 : 10} style={{ marginLeft: '4px' }} />
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

const styles = {
    container: { 
        maxWidth: '900px', 
        margin: '0 auto', 
        padding: '30px 15px',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    header: { textAlign: 'left', marginBottom: '30px' },
    badge: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 10px',
        backgroundColor: 'rgba(250, 204, 21, 0.1)',
        color: '#facc15',
        borderRadius: '6px',
        fontSize: '0.6rem',
        fontWeight: '900',
        letterSpacing: '1px',
        marginBottom: '10px',
        border: '1px solid rgba(250, 204, 21, 0.2)'
    },
    title: { fontWeight: '900', letterSpacing: '1px', color: 'white', margin: 0 },
    subtitle: { color: '#94a3b8', marginTop: '4px', fontWeight: '500' },
    
    menuGrid: { 
        display: 'grid',
    },
    
    menuCard: { 
        backgroundColor: '#0f172a', 
        borderRadius: '24px', 
        border: '1px solid rgba(255,255,255,0.05)', 
        textAlign: 'center', 
        cursor: 'pointer', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 30px -15px rgba(0,0,0,0.3)',
        transition: 'border-color 0.2s ease'
    },
    
    iconWrapper: { 
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    
    cardTitle: { fontWeight: '900', marginBottom: '6px', color: 'white', letterSpacing: '0.5px' },
    cardDesc: { color: '#64748b', lineHeight: '1.4', marginBottom: '16px', fontWeight: '500' },
    
    enterBtn: { 
        display: 'flex',
        alignItems: 'center',
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    }
};

export default EducationHub;