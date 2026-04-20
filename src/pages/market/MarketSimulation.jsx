import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, ShieldCheck, Landmark, ArrowRight } from 'lucide-react';

const MarketSimulation = () => {
    const navigate = useNavigate();
    const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

    React.useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isDesktop = windowWidth >= 1024;

    const menuItems = [
        { 
            id: 'stocks', 
            title: 'STOCKS', 
            desc: 'Equity in top companies.', 
            icon: <TrendingUp size={isDesktop ? 32 : 20} color="#8b5cf6" />, 
            path: '/market/stocks',
            color: '#8b5cf6'
        },
        { 
            id: 'bonds', 
            title: 'BONDS', 
            desc: 'Fixed-rate securities.', 
            icon: <ShieldCheck size={isDesktop ? 32 : 20} color="#10b981" />, 
            path: '/market/bonds',
            color: '#10b981'
        },
        { 
            id: 'deposits', 
            title: 'DEPOSITS', 
            desc: 'Guaranteed returns.', 
            icon: <Landmark size={isDesktop ? 32 : 20} color="#f59e0b" />, 
            path: '/market/deposits',
            color: '#f59e0b'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const cardVariants = {
        hidden: { y: 15, opacity: 0 },
        visible: { y: 0, opacity: 1 },
        hover: { y: -5, transition: { type: 'spring', stiffness: 300 } }
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h2 style={{...styles.title, fontSize: isDesktop ? '1.8rem' : '1.3rem'}}>MARKET TERMINAL</h2>
                <p style={{...styles.subtitle, fontSize: isDesktop ? '1rem' : '0.75rem'}}>Explore asset classes and growth opportunities.</p>
            </header>

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{
                    ...styles.menuGrid,
                    gridTemplateColumns: isDesktop ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
                    gap: isDesktop ? '20px' : '10px'
                }}
            >
                {menuItems.map((item) => (
                    <motion.div 
                        key={item.id} 
                        variants={cardVariants}
                        whileHover={isDesktop ? "hover" : ""}
                        whileTap={{ scale: 0.97 }}
                        style={{
                            ...styles.menuCard,
                            padding: isDesktop ? '32px 24px' : '16px 12px'
                        }} 
                        onClick={() => navigate(item.path)}
                    >
                        <div style={{
                            ...styles.iconWrapper, 
                            backgroundColor: `${item.color}15`,
                            width: isDesktop ? '60px' : '44px',
                            height: isDesktop ? '60px' : '44px',
                            marginBottom: isDesktop ? '20px' : '12px'
                        }}>
                            {item.icon}
                        </div>
                        <h3 style={{...styles.cardTitle, fontSize: isDesktop ? '1.2rem' : '0.85rem'}}>{item.title}</h3>
                        <p style={{...styles.cardDesc, fontSize: isDesktop ? '0.9rem' : '0.65rem'}}>{item.desc}</p>
                        
                        <div style={{...styles.enterBtn, fontSize: isDesktop ? '0.8rem' : '0.65rem'}}>
                            Open <ArrowRight size={isDesktop ? 16 : 12} style={{ marginLeft: '6px' }} />
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

const styles = {
    container: { 
        maxWidth: '1100px', 
        margin: '0 auto', 
        padding: '20px 15px' 
    },
    header: { textAlign: 'left', marginBottom: '30px' },
    title: { fontWeight: '900', letterSpacing: '1px', color: 'white', margin: 0 },
    subtitle: { color: '#94a3b8', marginTop: '4px' },
    
    menuGrid: { 
        display: 'grid',
    },
    
    menuCard: { 
        backgroundColor: '#1e293b', 
        borderRadius: '20px', 
        border: '1px solid rgba(255,255,255,0.05)', 
        textAlign: 'center', 
        cursor: 'pointer', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'center'
    },
    
    iconWrapper: { 
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    
    cardTitle: { fontWeight: '800', marginBottom: '6px', color: 'white' },
    cardDesc: { color: '#64748b', lineHeight: '1.4', marginBottom: '16px', fontWeight: '500' },
    
    enterBtn: { 
        display: 'flex',
        alignItems: 'center',
        color: '#3b82f6', 
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    }
};

export default MarketSimulation;