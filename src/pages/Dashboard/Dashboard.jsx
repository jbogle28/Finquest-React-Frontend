import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Gamepad2, 
    TrendingUp, 
    BookOpen, 
    Trophy, 
    PieChart, 
    ShoppingBag, 
    ArrowRight 
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = ({ user }) => {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 992);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!user) return <div style={styles.loading}>Initializing session...</div>;

    const firstName = user.user?.f_name || user.user?.username || "Explorer";

    return (
        <main style={{
            ...styles.mainContent,
            margin: isMobile ? '10px auto 0' : '20px auto',
            /* 90px padding for mobile to clear the bottom navbar */
            paddingBottom: isMobile ? '90px' : '40px' 
        }}>
            <div style={{
                ...styles.layoutGrid,
                /* Desktop now stacks them (1 column), Mobile stays 1 column */
                gridTemplateColumns: '1fr', 
                gap: isMobile ? '12px' : '25px'
            }}>
                {/* TOP: HERO & MODULES */}
                <div style={styles.leftCol}>
                    <section style={{
                        ...styles.heroSection,
                        padding: isMobile ? '15px 18px' : '25px 30px'
                    }}>
                        <div style={styles.headerContainer}>
                            <div style={styles.textWrapper}>
                                <h2 style={{
                                    ...styles.greeting,
                                    fontSize: isMobile ? '20px' : '28px'
                                }}>Welcome, {firstName}</h2>
                                <p style={{
                                    ...styles.subtitle,
                                    fontSize: isMobile ? '12px' : '15px'
                                }}>Select a training module.</p>
                            </div>
                            
                            <motion.img 
                                src="/assets/images/flying.png" 
                                alt="Mascot"
                                style={{
                                    ...styles.mascot,
                                    height: isMobile ? '50px' : '100px'
                                }}
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </div>
                    </section>

                    <div style={{
                        ...styles.moduleGrid,
                        /* Row of 3 on Desktop, 2x2 on Mobile */
                        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)'
                    }}>
                        {/* UPDATED: Education Card now points to the Hub */}
                        <div style={styles.moduleCard} onClick={() => navigate('/edu-hub')}>
                            <div style={styles.iconCircle}><BookOpen size={18} /></div>
                            <h3 style={styles.cardTitle}>Education</h3>
                            <p style={styles.cardDesc}>Quizzes & simulations.</p>
                            <div style={styles.cardFooter}>Explore <ArrowRight size={12} /></div>
                        </div>

                        <div style={styles.moduleCard} onClick={() => navigate('/arcade')}>
                            <div style={styles.iconCircle}><Gamepad2 size={18} /></div>
                            <h3 style={styles.cardTitle}>Arcade</h3>
                            <p style={styles.cardDesc}>Play learning games.</p>
                            <div style={styles.cardFooter}>Play <ArrowRight size={12} /></div>
                        </div>

                        <div style={{
                            ...styles.moduleCard,
                            gridColumn: isMobile ? 'span 2' : 'auto' 
                        }} onClick={() => navigate('/market')}>
                            <div style={styles.iconCircle}><TrendingUp size={18} /></div>
                            <h3 style={styles.cardTitle}>Market Sim</h3>
                            <p style={styles.cardDesc}>Manage your simulated asset portfolio.</p>
                            <div style={styles.cardFooter}>Trade <ArrowRight size={12} /></div>
                        </div>
                    </div>
                </div>

                {/* BOTTOM (DESKTOP) / SIDEBAR: QUICK ACTIONS */}
                <aside style={styles.sidebar}>
                    <h4 style={styles.sidebarTitle}>Quick Actions</h4>
                    <div style={{
                        ...styles.actionList,
                        display: 'grid',
                        /* Grid row on Desktop too now */
                        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)',
                        gap: isMobile ? '8px' : '12px'
                    }}>
                        <button style={styles.actionBtn} onClick={() => navigate('/portfolio')}>
                            <div style={{...styles.actionIcon, color: '#10b981'}}><PieChart size={16} /></div>
                            <span style={styles.actionText}>Portfolio</span>
                        </button>
                        <button style={styles.actionBtn} onClick={() => navigate('/leaderboard')}>
                            <div style={{...styles.actionIcon, color: '#fbbf24'}}><Trophy size={16} /></div>
                            <span style={styles.actionText}>Ranks</span>
                        </button>
                        <button style={{
                            ...styles.actionBtn, 
                            gridColumn: isMobile ? 'span 2' : 'auto' 
                        }} onClick={() => navigate('/store')}>
                            <div style={{...styles.actionIcon, color: 'var(--primary-purple)'}}><ShoppingBag size={16} /></div>
                            <span style={styles.actionText}>Store</span>
                        </button>
                    </div>

                    {!isMobile && (
                        <div style={styles.tipCard}>
                            <span style={styles.tipLabel}>PRO TIP</span>
                            <p style={styles.tipText}>Daily quizzes yield more XP! Stack your coins for the shop.</p>
                        </div>
                    )}
                </aside>
            </div>
        </main>
    );
};

const styles = {
    mainContent: { maxWidth: '1100px', padding: '0 12px', boxSizing: 'border-box' },
    layoutGrid: { display: 'grid' },
    leftCol: { display: 'flex', flexDirection: 'column', gap: '12px' },
    
    heroSection: { 
        backgroundColor: 'rgba(30, 41, 59, 0.5)', 
        borderRadius: '16px', 
        border: '1px solid var(--bg-hover)',
        position: 'relative',
    },
    headerContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' },
    textWrapper: { flex: 1 },
    greeting: { fontWeight: '800', margin: '0 0 2px 0', letterSpacing: '-0.5px', color: 'white' },
    subtitle: { color: 'var(--text-muted)', margin: 0, lineHeight: '1.2' },
    mascot: { width: 'auto', objectFit: 'contain' },

    moduleGrid: { display: 'grid', gap: '10px' },
    moduleCard: { 
        backgroundColor: 'var(--bg-card)', padding: '14px', borderRadius: '14px', 
        border: '1px solid var(--bg-hover)', cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
    },
    cardTitle: { fontSize: '14px', fontWeight: '800', margin: '0 0 4px 0', color: 'white' },
    cardDesc: { color: 'var(--text-muted)', fontSize: '11px', lineHeight: '1.3', marginBottom: '8px' },
    cardFooter: { 
        marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '4px', 
        fontSize: '11px', fontWeight: '700', color: 'var(--primary-purple)' 
    },
    iconCircle: {
        width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--bg-hover)',
        display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px', color: 'var(--primary-purple)'
    },

    sidebar: { display: 'flex', flexDirection: 'column', gap: '10px' },
    sidebarTitle: { fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' },
    actionList: { },
    actionBtn: {
        display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', 
        backgroundColor: 'var(--bg-card)', border: '1px solid var(--bg-hover)',
        borderRadius: '10px', color: 'white', cursor: 'pointer',
        fontWeight: '600', fontSize: '12px'
    },
    actionText: { whiteSpace: 'nowrap' },
    actionIcon: { width: '22px', height: '22px', borderRadius: '6px', backgroundColor: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    
    tipCard: { 
        padding: '12px', borderRadius: '12px', marginTop: '5px',
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.05), rgba(59, 130, 246, 0.05))',
        border: '1px solid rgba(168, 85, 247, 0.1)' 
    },
    tipLabel: { fontSize: '9px', fontWeight: '900', color: 'var(--primary-purple)', letterSpacing: '1px' },
    tipText: { fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.3' },

    loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', color: 'var(--text-muted)' }
};

export default Dashboard;