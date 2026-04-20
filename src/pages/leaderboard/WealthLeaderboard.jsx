import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, User } from 'lucide-react';

const WealthLeaderboard = ({ players, currentUsername, isMobile }) => {
    return (
        <div style={styles.listContainer}>
            {players.map((player, index) => (
                <motion.div 
                    key={player.username}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    style={{
                        ...styles.playerRow,
                        backgroundColor: player.username === currentUsername ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                        border: player.username === currentUsername ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent'
                    }}
                >
                    <div style={styles.rankSection}>
                        <span style={{...styles.rankNumber, color: index < 3 ? '#10b981' : '#64748b'}}>#{index + 1}</span>
                    </div>

                    <div style={styles.playerInfo}>
                        <div style={{
                            ...styles.avatarCircle,
                            width: isMobile ? '38px' : '48px',
                            height: isMobile ? '38px' : '48px',
                            borderColor: player.username === currentUsername ? '#10b981' : '#334155'
                        }}>
                            {player.avatar_url ? (
                                <img src={`http://127.0.0.1:5000/${player.avatar_url}`} alt="" style={styles.avatarImg} />
                            ) : (
                                <User size={isMobile ? 18 : 24} color="#64748b" />
                            )}
                        </div>
                        <div style={styles.nameGroup}>
                            <div style={styles.usernameRow}>
                                <span style={{...styles.username, fontSize: isMobile ? '0.9rem' : '1rem'}}>{player.username}</span>
                                <span style={styles.levelBadge}>Lvl {player.level}</span>
                            </div>
                            <span style={styles.roleBadge}>{player.role}</span>
                        </div>
                    </div>

                    <div style={styles.statsSection}>
                        <div style={styles.wealthGroup}>
                            <div style={styles.statItem}>
                                <DollarSign size={14} color="#10b981" />
                                <span style={styles.statText}>
                                    {(player.coin_balance || 0).toLocaleString()}
                                </span>
                            </div>
                            <div style={styles.profitBadge}>
                                <TrendingUp size={10} />
                                <span>+${player.recent_earnings}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

const styles = {
    listContainer: { padding: '1rem' },
    playerRow: { display: 'flex', alignItems: 'center', padding: '12px 16px', borderRadius: '16px', marginBottom: '8px' },
    rankSection: { width: '40px', display: 'flex', justifyContent: 'center' },
    rankNumber: { fontWeight: '900', fontSize: '1rem' },
    playerInfo: { flex: 1, display: 'flex', alignItems: 'center', gap: '12px' },
    avatarCircle: { borderRadius: '50%', background: '#0f172a', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', border: '2px solid' },
    avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
    nameGroup: { display: 'flex', flexDirection: 'column' },
    usernameRow: { display: 'flex', alignItems: 'center', gap: '8px' },
    username: { color: '#f8fafc', fontWeight: '800' },
    levelBadge: { fontSize: '0.65rem', color: '#a855f7', fontWeight: 'bold', border: '1px solid #a855f7', padding: '1px 5px', borderRadius: '4px' },
    roleBadge: { color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase' },
    statsSection: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' },
    wealthGroup: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' },
    statItem: { display: 'flex', alignItems: 'center', gap: '4px' },
    statText: { color: 'white', fontWeight: '900', fontSize: '1rem' },
    profitBadge: { display: 'flex', alignItems: 'center', gap: '4px', color: '#facc15', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '6px' }
};

export default WealthLeaderboard;