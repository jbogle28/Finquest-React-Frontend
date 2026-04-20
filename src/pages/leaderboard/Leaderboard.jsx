import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Zap, User, Loader2, Gamepad2, Brain, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import WealthLeaderboard from './WealthLeaderboard';

const Leaderboard = () => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('xp'); // 'xp' or 'wealth'
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth });
    const navigate = useNavigate();
    
    const currentUser = authService.getCurrentUser();
    const currentUsername = currentUser?.user?.username;

    const fetchLeaderboard = async () => {
        setLoading(true);
        setPlayers([]);
        try {
            // Logic to switch between endpoints based on viewMode
            const data = viewMode === 'xp' 
                ? await authService.getLeaderboard() 
                : await authService.getWealthLeaderboard();
            setPlayers(data);
        } catch (err) {
            console.error("Failed to load leaderboard:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
    }, [viewMode]);

    useEffect(() => {
        const handleResize = () => setWindowSize({ width: window.innerWidth });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = windowSize.width < 900;

    const getRankIcon = (index) => {
        if (index === 0) return <Trophy size={isMobile ? 18 : 22} color="#fbbf24" />;
        if (index === 1) return <Medal size={isMobile ? 18 : 22} color="#94a3b8" />;
        if (index === 2) return <Medal size={isMobile ? 18 : 22} color="#b45309" />;
        return <span style={styles.rankNumber}>{index + 1}</span>;
    };

    if (loading && players.length === 0) {
        return (
            <div style={styles.loadingContainer}>
                <Loader2 className="animate-spin" size={40} color="#a855f7" />
            </div>
        );
    }

    return (
        <div style={{...styles.container, paddingBottom: isMobile ? '80px' : '2rem'}}>
            <div style={{...styles.content, display: isMobile ? 'block' : 'grid'}}>
                {/* Main Leaderboard Section */}
                <div style={styles.leaderboardCard}>
                    <div style={styles.header}>
                        <div style={styles.headerTop}>
                            <div style={styles.titleSection}>
                                {viewMode === 'xp' ? (
                                    <Trophy size={isMobile ? 24 : 32} color="#fbbf24" />
                                ) : (
                                    <DollarSign size={isMobile ? 24 : 32} color="#10b981" />
                                )}
                                <div>
                                    <h1 style={styles.title}>
                                        {viewMode === 'xp' ? 'CHAMPIONS LEADERBOARD' : 'WEALTH LEADERBOARD'}
                                    </h1>
                                    <p style={styles.subtitle}>
                                        {viewMode === 'xp' ? 'Top financial masters this season' : 'The richest players in the realm'}
                                    </p>
                                </div>
                            </div>

                            {/* View Switcher Toggle */}
                            <div style={styles.toggleContainer}>
                                <button 
                                    onClick={() => setViewMode('xp')}
                                    style={{
                                        ...styles.toggleBtn,
                                        backgroundColor: viewMode === 'xp' ? '#a855f7' : 'transparent',
                                        color: viewMode === 'xp' ? 'white' : '#64748b'
                                    }}
                                >
                                    <Zap size={16} />
                                    {!isMobile && "XP"}
                                </button>
                                <button 
                                    onClick={() => setViewMode('wealth')}
                                    style={{
                                        ...styles.toggleBtn,
                                        backgroundColor: viewMode === 'wealth' ? '#10b981' : 'transparent',
                                        color: viewMode === 'wealth' ? 'white' : '#64748b'
                                    }}
                                >
                                    <DollarSign size={16} />
                                    {!isMobile && "Wealth"}
                                </button>
                            </div>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div 
                                key="loader"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={styles.loadingInner}
                            >
                                <Loader2 className="animate-spin" size={30} color="#a855f7" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key={viewMode}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {viewMode === 'xp' ? (
                                    <div style={styles.listContainer}>
                                        {players.map((player, index) => (
                                            <motion.div 
                                                key={player.username}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.03 }}
                                                style={{
                                                    ...styles.playerRow,
                                                    backgroundColor: player.username === currentUsername ? 'rgba(168, 85, 247, 0.08)' : 'transparent',
                                                    border: player.username === currentUsername ? '1px solid rgba(168, 85, 247, 0.3)' : '1px solid transparent'
                                                }}
                                            >
                                                <div style={styles.rankSection}>
                                                    {getRankIcon(index)}
                                                </div>

                                                <div style={styles.playerInfo}>
                                                    <div style={{
                                                        ...styles.avatarCircle,
                                                        width: isMobile ? '38px' : '48px',
                                                        height: isMobile ? '38px' : '48px',
                                                        borderColor: index === 0 ? '#fbbf24' : (player.username === currentUsername ? '#a855f7' : '#334155')
                                                    }}>
                                                        {player.avatar_url ? (
                                                            <img 
                                                                src={`http://127.0.0.1:5000/${player.avatar_url}`} 
                                                                alt={player.username} 
                                                                style={styles.avatarImg}
                                                            />
                                                        ) : (
                                                            <User size={isMobile ? 18 : 24} color="#64748b" />
                                                        )}
                                                    </div>
                                                    <div style={styles.nameGroup}>
                                                        <div style={styles.usernameRow}>
                                                            <span style={{
                                                                ...styles.username,
                                                                fontSize: isMobile ? '0.9rem' : '1rem'
                                                            }}>{player.username}</span>
                                                            <span style={styles.levelBadge}>Lvl {player.level}</span>
                                                            {player.username === currentUsername && (
                                                                <span style={styles.meBadge}>YOU</span>
                                                            )}
                                                        </div>
                                                        <span style={styles.roleBadge}>{player.role}</span>
                                                    </div>
                                                </div>

                                                <div style={styles.statsSection}>
                                                    <div style={styles.statItem}>
                                                        <Zap size={14} color="#a855f7" />
                                                        <span style={styles.statText}>
                                                            {(player.xp_total || 0).toLocaleString()} XP
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <WealthLeaderboard 
                                        players={players} 
                                        currentUsername={currentUsername} 
                                        isMobile={isMobile} 
                                    />
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Sidebar - Desktop Only */}
                {!isMobile && (
                    <div style={styles.sidebar}>
                        <div style={styles.miniCard}>
                            <h3 style={styles.sidebarTitle}>LEVEL UP</h3>
                            <div style={styles.linkGrid}>
                                <div onClick={() => navigate('/dashboard')} style={styles.gameLink}>
                                    <Brain size={20} color="#a855f7" />
                                    <span>Take Quiz</span>
                                </div>
                                <div onClick={() => navigate('/store')} style={styles.gameLink}>
                                    <Gamepad2 size={20} color="#10b981" />
                                    <span>Visit Store</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' },
    content: { gridTemplateColumns: '1fr 300px', gap: '2rem' },
    loadingContainer: { height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' },
    loadingInner: { padding: '5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' },
    leaderboardCard: { backgroundColor: 'var(--bg-card)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' },
    header: { padding: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(to right, rgba(168, 85, 247, 0.05), transparent)' },
    headerTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' },
    titleSection: { display: 'flex', alignItems: 'center', gap: '1rem' },
    title: { color: 'white', margin: 0, fontSize: '1.5rem', fontWeight: '900', letterSpacing: '-0.02em' },
    subtitle: { color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem', fontWeight: '500' },
    toggleContainer: { display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' },
    toggleBtn: { 
        display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', border: 'none', 
        borderRadius: '8px', cursor: 'pointer', fontWeight: '800', fontSize: '0.75rem', transition: 'all 0.2s' 
    },
    listContainer: { padding: '1rem' },
    playerRow: { display: 'flex', alignItems: 'center', padding: '12px 16px', borderRadius: '16px', marginBottom: '8px', transition: 'all 0.2s' },
    rankSection: { width: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
    rankNumber: { color: '#64748b', fontWeight: '900', fontSize: '1.1rem' },
    playerInfo: { flex: 1, display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '8px' },
    avatarCircle: { borderRadius: '50%', background: 'var(--bg-deep)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0, overflow: 'hidden', border: '2px solid' },
    avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
    nameGroup: { display: 'flex', flexDirection: 'column', gap: '2px' },
    usernameRow: { display: 'flex', alignItems: 'center', gap: '8px' },
    username: { color: '#f8fafc', fontWeight: '800' },
    levelBadge: { fontSize: '0.65rem', color: '#a855f7', fontWeight: 'bold', border: '1px solid #a855f7', padding: '1px 5px', borderRadius: '4px' },
    meBadge: { background: '#a855f7', color: 'white', fontSize: '0.6rem', padding: '2px 6px', borderRadius: '6px', fontWeight: '900' },
    roleBadge: { color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.05em' },
    statsSection: { display: 'flex', alignItems: 'center', gap: '1.5rem' },
    statItem: { display: 'flex', alignItems: 'center', gap: '6px' },
    statText: { color: 'white', fontWeight: '900', fontSize: '0.9rem' },
    sidebar: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    miniCard: { backgroundColor: 'var(--bg-card)', borderRadius: '24px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' },
    sidebarTitle: { color: 'white', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em' },
    linkGrid: { display: 'grid', gap: '10px' },
    gameLink: { display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-deep)', border: '1px solid var(--bg-hover)', borderRadius: '16px', padding: '14px', cursor: 'pointer', color: 'white', fontWeight: '700', fontSize: '0.9rem', transition: '0.2s' }
};

export default Leaderboard;