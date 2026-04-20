import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';
import { 
    LogOut, 
    Coins, 
    ShoppingBag, 
    Home, 
    Trophy, 
    UserCircle, 
    PieChart
} from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [liveUser, setLiveUser] = useState(user);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const BASE_URL = process.env.REACT_APP_API_URL?.replace(/\/$/, '') || 'http://127.0.0.1:5000';

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        
        const syncData = async () => {
            try {
                const data = await authService.getUserProfile();
                if (data && data.user) {
                    setLiveUser(authService.getCurrentUser());
                }
            } catch (error) {
                console.error("Navbar failed to sync:", error);
            }
        };

        syncData();
        window.addEventListener('userUpdate', syncData);
        return () => {
            window.removeEventListener('userUpdate', syncData);
            window.removeEventListener('resize', handleResize);
        };
    }, [location.pathname]);

    const handleLogout = () => {
        authService.logout();
        if (onLogout) onLogout();
        navigate('/login');
    };

    const userData = liveUser?.user;
    const xp_total = userData?.xp_total || 0;
    const currentLevel = Math.floor(xp_total / 100) + 1;
    const xpPercentage = xp_total % 100; 

    const coinBalance = Number(userData?.coin_balance || 0).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });

    const activeStyle = (path, activeColor) => ({
        color: location.pathname === path ? activeColor : 'var(--text-muted)',
    });

    return (
        <>
            {/* TOP BAR */}
            <nav style={styles.nav}>
                <div style={styles.leftSection}>
                    {/* Desktop Brand */}
                    {!isMobile && (
                        <div style={styles.brand} onClick={() => navigate('/dashboard')}>
                            <img 
                                src="/assets/images/Nav-Bar.png" 
                                alt="FinQuest Bird" 
                                style={styles.navLogo} 
                            />
                            <h1 style={styles.logoText}>FINQUEST</h1>
                        </div>
                    )}

                    {/* Mobile Brand - Now includes text */}
                    {isMobile && (
                        <div style={styles.brand} onClick={() => navigate('/dashboard')}>
                            <img 
                                src="/assets/images/Nav-Bar.png" 
                                alt="FinQuest" 
                                style={{ height: '40px', width: 'auto' }} 
                            />
                            <h1 style={styles.logoText}>FINQUEST</h1>
                        </div>
                    )}

                    {/* Desktop-Only Nav Links */}
                    {!isMobile && (
                        <div style={styles.desktopNavLinks}>
                            <button 
                                onClick={() => navigate('/dashboard')} 
                                style={{...styles.navBtn, ...activeStyle('/dashboard', 'var(--primary-purple)')}}
                            >
                                <Home size={18} />
                                <span style={styles.btnText}>Home</span>
                            </button>
                            <button 
                                onClick={() => navigate('/leaderboard')} 
                                style={{...styles.navBtn, ...activeStyle('/leaderboard', '#fbbf24')}}
                            >
                                <Trophy size={18} />
                                <span style={styles.btnText}>Ranks</span>
                            </button>
                        </div>
                    )}
                </div>

                <div style={styles.statusCluster}>
                    <div style={styles.pill}>
                        <Coins size={isMobile ? 12 : 14} color="var(--status-gold)" style={{ marginRight: '4px' }} />
                        <span style={styles.pillText}>{coinBalance}</span>
                    </div>

                    <div style={{...styles.levelGroup, width: isMobile ? '50px' : '100px'}}>
                        <div style={styles.levelTextGroup}>
                            <span style={styles.levelLabel}>LVL {currentLevel}</span>
                            {!isMobile && <span style={styles.xpLabel}>{xp_total} XP</span>}
                        </div>
                        <div style={styles.xpTrack}>
                            <div style={{ ...styles.xpFill, width: `${xpPercentage}%` }}></div>
                        </div>
                    </div>

                    {!isMobile && (
                        <div style={styles.desktopIconGroup}>
                            <div style={styles.divider}></div>
                            <button onClick={() => navigate('/portfolio')} style={{...styles.iconBtn, ...activeStyle('/portfolio', '#10b981')}}>
                                <PieChart size={18} />
                            </button>
                            <button onClick={() => navigate('/store')} style={styles.iconBtn}>
                                <ShoppingBag size={18} />
                            </button>
                            {/* Desktop Profile Pic Replacement */}
                            <button onClick={() => navigate('/profile')} style={styles.profileBtn}>
                                {userData?.profile_image ? (
                                    <img 
                                        src={`${BASE_URL}/${userData.profile_image}`} 
                                        alt="Profile" 
                                        style={styles.profileImg} 
                                    />
                                ) : (
                                    <UserCircle size={22} style={activeStyle('/profile', 'var(--primary-purple)')} />
                                )}
                            </button>
                            <button onClick={handleLogout} style={styles.logoutBtn}>
                                <LogOut size={18} />
                            </button>
                        </div>
                    )}

                    {isMobile && (
                        <button onClick={handleLogout} style={styles.logoutBtn}>
                            <LogOut size={18} />
                        </button>
                    )}
                </div>
            </nav>

            {/* BOTTOM NAV (Mobile Only) */}
            {isMobile && (
                <div style={styles.bottomNav}>
                    <button onClick={() => navigate('/dashboard')} style={{...styles.mobileBtn, ...activeStyle('/dashboard', 'var(--primary-purple)')}}>
                        <Home size={22} />
                        <span style={styles.mobileLabel}>Home</span>
                    </button>
                    <button onClick={() => navigate('/portfolio')} style={{...styles.mobileBtn, ...activeStyle('/portfolio', '#10b981')}}>
                        <PieChart size={22} />
                        <span style={styles.mobileLabel}>Portfolio</span>
                    </button>
                    <button onClick={() => navigate('/leaderboard')} style={{...styles.mobileBtn, ...activeStyle('/leaderboard', '#fbbf24')}}>
                        <Trophy size={22} />
                        <span style={styles.mobileLabel}>Ranks</span>
                    </button>
                    <button onClick={() => navigate('/store')} style={{...styles.mobileBtn, ...activeStyle('/store', 'white')}}>
                        <ShoppingBag size={22} />
                        <span style={styles.mobileLabel}>Store</span>
                    </button>
                    {/* Mobile Profile Pic Replacement */}
                    <button onClick={() => navigate('/profile')} style={styles.mobileBtn}>
                        <div style={styles.mobileAvatarWrapper}>
                            {userData?.profile_image ? (
                                <img 
                                    src={`${BASE_URL}/${userData.profile_image}`} 
                                    alt="Profile" 
                                    style={styles.profileImg} 
                                />
                            ) : (
                                <UserCircle size={22} style={activeStyle('/profile', 'var(--primary-purple)')} />
                            )}
                        </div>
                        <span style={{...styles.mobileLabel, ...activeStyle('/profile', 'var(--primary-purple)')}}>Profile</span>
                    </button>
                </div>
            )}
        </>
    );
};

const styles = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 20px',
        borderBottom: '1px solid var(--bg-hover)',
        backgroundColor: 'rgba(2, 6, 23, 0.9)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        boxSizing: 'border-box'
    },
    leftSection: { display: 'flex', alignItems: 'center', gap: '40px' },
    brand: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        cursor: 'pointer' 
    },
    navLogo: { 
        height: '80px', 
        width: 'auto', 
        display: 'block',
        objectFit: 'contain'
    },
    logoText: {
        fontSize: '20px',
        fontWeight: '900',
        letterSpacing: '2px',
        color: 'white',
        margin: 0,
        textTransform: 'uppercase'
    },
    desktopNavLinks: { display: 'flex', gap: '20px', alignItems: 'center' },
    navBtn: { display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '14px' },
    btnText: { color: 'inherit' },
    statusCluster: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        backgroundColor: 'var(--bg-card)',
        padding: '6px 12px',
        borderRadius: '12px',
        border: '1px solid var(--bg-hover)'
    },
    desktopIconGroup: { display: 'flex', alignItems: 'center', gap: '12px' },
    divider: { width: '1px', height: '20px', backgroundColor: '#334155', margin: '0 5px' },
    iconBtn: { background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' },
    profileBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '0', width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    profileImg: { width: '100%', height: '100%', objectFit: 'cover' },
    logoutBtn: { background: 'none', border: 'none', color: 'var(--status-red)', cursor: 'pointer', padding: '4px' },
    pill: { display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-hover)', padding: '4px 8px', borderRadius: '6px' },
    pillText: { fontSize: '12px', fontWeight: '700', color: 'var(--status-gold)' },
    levelGroup: { display: 'flex', flexDirection: 'column', gap: '2px' },
    levelTextGroup: { display: 'flex', justifyContent: 'space-between' },
    levelLabel: { fontSize: '9px', fontWeight: '800', color: 'var(--primary-purple)' },
    xpLabel: { fontSize: '9px', color: 'var(--text-muted)' },
    xpTrack: { width: '100%', height: '3px', backgroundColor: '#334155', borderRadius: '2px', overflow: 'hidden' },
    xpFill: { height: '100%', backgroundColor: 'var(--primary-purple)' },
    bottomNav: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '65px',
        backgroundColor: 'var(--bg-card)',
        borderTop: '1px solid var(--bg-hover)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 1000,
        paddingBottom: 'env(safe-area-inset-bottom)'
    },
    mobileBtn: { display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'none', border: 'none', gap: '4px' },
    mobileLabel: { fontSize: '10px', fontWeight: '600' },
    mobileAvatarWrapper: { width: '24px', height: '24px', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};

export default Navbar;
