import React, { useState, useEffect } from 'react';
import { CheckCircle2, Coins, Sparkles, X, AlertCircle, CheckCircle } from 'lucide-react';
import storeService from '../../services/storeService';

const Store = () => {
    const [items, setItems] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        fetchStoreData();
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Auto-hide notifications after 3 seconds
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const fetchStoreData = async () => {
        try {
            const data = await storeService.getStoreItems();
            const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
            setItems(sorted);
        } catch (err) {
            showNotification("Failed to load store inventory", "error");
        }
    };

    const showNotification = (message, type) => {
        setNotification({ message, type });
    };

    const handleItemAction = async (item) => {
        try {
            if (!item.owned) {
                await storeService.purchaseItem(item.id);
                showNotification(`Purchased ${item.name}!`, "success");
            } else if (!item.equipped) {
                await storeService.equipItem(item.id);
                showNotification(`${item.name} equipped!`, "success");
            }
            await fetchStoreData();
        } catch (err) {
            const errorMsg = err.response?.data?.msg || "Transaction failed";
            showNotification(errorMsg, "error");
        }
    };

    return (
        <div style={styles.container}>
            {/* Custom Notification Toast */}
            {notification && (
                <div style={{
                    ...styles.notification,
                    backgroundColor: notification.type === 'success' ? '#065f46' : '#991b1b',
                    border: `1px solid ${notification.type === 'success' ? '#10b981' : '#ef4444'}`
                }}>
                    {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    <span style={{ flex: 1 }}>{notification.message}</span>
                    <X size={14} onClick={() => setNotification(null)} style={{ cursor: 'pointer' }} />
                </div>
            )}

            <div style={styles.header}>
                <div style={styles.headerIcon}>
                    <Sparkles size={isMobile ? 18 : 24} color="var(--primary-purple)" />
                </div>
                <h1 style={{...styles.title, fontSize: isMobile ? '1.4rem' : '2.2rem'}}>Avatar Gallery</h1>
                <p style={styles.subtitle}>Personalize your presence in the FinQuest world</p>
            </div>

            <div style={{
                ...styles.grid,
                // 4 columns on mobile, 6 columns on desktop
                gridTemplateColumns: isMobile ? 'repeat(4, 1fr)' : 'repeat(6, 1fr)',
                gap: isMobile ? '8px' : '20px'
            }}>
                {items.map((item) => (
                    <div key={item.id} style={{
                        ...styles.card,
                        padding: isMobile ? '12px 6px' : '20px',
                        border: item.equipped ? '2px solid var(--primary-purple)' : '1px solid rgba(255,255,255,0.05)'
                    }}>
                        <div style={{...styles.avatarWrapper, marginBottom: isMobile ? '8px' : '15px'}}>
                            <div style={{
                                ...styles.avatarCircle,
                                width: isMobile ? '55px' : '110px', // Slightly smaller on mobile to ensure 4 fit
                                height: isMobile ? '55px' : '110px',
                            }}>
                                <img 
                                    src={`http://127.0.0.1:5000/${item.image}`} 
                                    alt={item.name} 
                                    style={styles.avatarImg} 
                                />
                            </div>
                            {item.owned && (
                                <div style={{
                                    ...styles.ownedBadge,
                                    width: isMobile ? '16px' : '24px',
                                    height: isMobile ? '16px' : '24px',
                                }}>
                                    <CheckCircle2 size={isMobile ? 10 : 14} />
                                </div>
                            )}
                        </div>

                        <div style={styles.info}>
                            <h3 style={{...styles.itemName, fontSize: isMobile ? '0.6rem' : '0.9rem', marginBottom: isMobile ? '8px' : '12px'}}>
                                {item.name}
                            </h3>
                            <div style={{...styles.footer, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '6px' : '10px'}}>
                                {!item.owned ? (
                                    <div style={styles.priceContainer}>
                                        <Coins size={isMobile ? 10 : 14} color="var(--primary-purple)" />
                                        <span style={{...styles.priceText, fontSize: isMobile ? '0.7rem' : '0.9rem'}}>{item.cost}</span>
                                    </div>
                                ) : (
                                    <span style={{...styles.statusText, fontSize: isMobile ? '0.55rem' : '0.7rem'}}>
                                        {item.equipped ? 'Active' : 'Owned'}
                                    </span>
                                )}

                                <button 
                                    onClick={() => handleItemAction(item)}
                                    disabled={item.equipped}
                                    style={{
                                        ...styles.button,
                                        // Button is no longer 100% width on mobile, making it much smaller
                                        padding: isMobile ? '3px 8px' : '6px 14px',
                                        fontSize: isMobile ? '0.6rem' : '0.8rem',
                                        backgroundColor: item.owned ? (item.equipped ? 'transparent' : 'var(--bg-hover)') : 'var(--primary-purple)',
                                        color: item.owned ? 'white' : 'black',
                                        opacity: item.equipped ? 0.4 : 1
                                    }}
                                >
                                    {item.owned ? (item.equipped ? 'Use' : 'Equip') : 'Buy'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: { padding: 'var(--container-padding)', maxWidth: '1400px', margin: '0 auto', minHeight: '100vh', position: 'relative' },
    notification: {
        position: 'fixed', top: '20px', right: '20px', zIndex: 1000,
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '12px 20px', borderRadius: '12px', color: 'white',
        fontWeight: '700', fontSize: '0.9rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
        animation: 'slideIn 0.3s ease-out'
    },
    header: { textAlign: 'center', marginBottom: '40px', marginTop: '10px' },
    headerIcon: { display: 'inline-flex', padding: '12px', backgroundColor: 'rgba(250, 204, 21, 0.1)', borderRadius: '50%', marginBottom: '12px' },
    title: { fontWeight: '900', color: 'white', margin: '0 0 5px 0', letterSpacing: '-0.8px' },
    subtitle: { color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, opacity: 0.8 },
    grid: { display: 'grid', paddingBottom: '80px' },
    card: { backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'var(--transition)', textAlign: 'center' },
    avatarWrapper: { position: 'relative' },
    avatarCircle: { borderRadius: '50%', backgroundColor: 'var(--bg-deep)', border: '2px solid var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
    ownedBadge: { position: 'absolute', bottom: '2px', right: '2px', backgroundColor: 'var(--status-green)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid var(--bg-card)' },
    info: { width: '100%' },
    itemName: { fontWeight: '800', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    priceContainer: { display: 'flex', alignItems: 'center', gap: '3px' },
    priceText: { fontWeight: '900', color: 'white' },
    statusText: { fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' },
    button: { border: 'none', borderRadius: '6px', fontWeight: '900', transition: 'var(--transition)', cursor: 'pointer' }
};

export default Store;