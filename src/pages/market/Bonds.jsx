import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Building2, ShieldCheck, Timer, Percent, 
    ArrowRight, Loader2, Info, X, Wallet 
} from 'lucide-react';
import financeService from '../../services/financeService';

const Bonds = () => {
    const [bonds, setBonds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    
    // Custom Purchase Modal State
    const [purchaseModal, setPurchaseModal] = useState({ show: false, bond: null });
    const [status, setStatus] = useState(null);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        loadBonds();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const loadBonds = async () => {
        try {
            const data = await financeService.getBondMarket();
            setBonds(data);
        } catch (err) {
            console.error("Bond fetch failed", err);
        } finally {
            setLoading(false);
        }
    };

    const initiatePurchase = (bond) => {
        setPurchaseModal({ show: true, bond });
    };

    const confirmPurchase = async () => {
        const { bond } = purchaseModal;
        try {
            const result = await financeService.purchaseBond(bond.id);
            setStatus({ type: 'success', msg: result.msg || "Bond purchased successfully!" });
            setPurchaseModal({ show: false, bond: null });
        } catch (err) {
            setStatus({ type: 'error', msg: "Purchase failed. Check your balance." });
        }
        setTimeout(() => setStatus(null), 4000);
    };

    const isDesktop = windowWidth >= 1024;
    const gridColumns = isDesktop ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)';

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h1 style={styles.title}>Bond Market</h1>
                        <ShieldCheck size={isDesktop ? 24 : 18} color="#3b82f6" />
                    </div>
                    <p style={styles.subtitle}>Fixed-income securities for steady, low-risk growth.</p>
                </div>
            </div>

            {loading ? (
                <div style={styles.loaderContainer}>
                    <Loader2 size={40} className="animate-spin" color="#3b82f6" />
                    <p>Loading Bond Offerings...</p>
                </div>
            ) : (
                <div style={{
                    ...styles.marketGrid,
                    gridTemplateColumns: gridColumns,
                    gap: isDesktop ? '20px' : '10px'
                }}>
                    {bonds.map((bond) => (
                        <motion.div 
                            key={bond.id} 
                            whileHover={{ y: -5 }}
                            style={{
                                ...styles.bondCard,
                                padding: isDesktop ? '20px' : '12px'
                            }}
                        >
                            <div style={styles.cardHeader}>
                                <div style={styles.issuerGroup}>
                                    <Building2 size={isDesktop ? 16 : 12} color="#94a3b8" />
                                    <span style={styles.issuerName}>{bond.issuer}</span>
                                </div>
                                <div style={{
                                    ...styles.riskBadge,
                                    color: bond.risk === 'Low' ? '#10b981' : '#f59e0b',
                                    backgroundColor: bond.risk === 'Low' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)'
                                }}>
                                    {bond.risk} Risk
                                </div>
                            </div>

                            <div style={styles.priceSection}>
                                <span style={styles.priceLabel}>Face Value</span>
                                <h2 style={{...styles.priceValue, fontSize: isDesktop ? '1.8rem' : '1.2rem'}}>${bond.price}</h2>
                            </div>

                            <div style={styles.statsGrid}>
                                <div style={styles.statBox}>
                                    <Percent size={12} color="#3b82f6" />
                                    <div style={styles.statInfo}>
                                        <span style={styles.statLabel}>Coupon</span>
                                        <span style={styles.statValue}>{bond.coupon_rate}</span>
                                    </div>
                                </div>
                                <div style={styles.statBox}>
                                    <Timer size={12} color="#a855f7" />
                                    <div style={styles.statInfo}>
                                        <span style={styles.statLabel}>Term</span>
                                        <span style={styles.statValue}>{bond.duration_hours}h</span>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => initiatePurchase(bond)}
                                style={{...styles.buyBtn, fontSize: isDesktop ? '0.9rem' : '0.75rem'}}
                            >
                                Invest Now
                                <ArrowRight size={14} />
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Custom Purchase Modal */}
            <AnimatePresence>
                {purchaseModal.show && (
                    <div style={styles.modalOverlay}>
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{
                                ...styles.modalContent,
                                width: isDesktop ? '400px' : 'calc(50% - 15px)',
                                minWidth: isDesktop ? '400px' : '160px',
                                padding: isDesktop ? '24px' : '16px'
                            }}
                        >
                            <div style={styles.modalHeader}>
                                <h2 style={{...styles.modalTitle, fontSize: isDesktop ? '1.2rem' : '0.9rem'}}>
                                    Confirm Investment
                                </h2>
                                <button onClick={() => setPurchaseModal({ show: false, bond: null })} style={styles.closeBtn}>
                                    <X size={18} />
                                </button>
                            </div>

                            <div style={styles.modalBody}>
                                <div style={styles.orderDetail}>
                                    <span style={styles.orderLabel}>Issuer</span>
                                    <span style={styles.orderValue}>{purchaseModal.bond.issuer}</span>
                                </div>

                                <div style={{...styles.totalBox, padding: isDesktop ? '16px' : '10px'}}>
                                    <span style={styles.totalLabel}>Investment Amount</span>
                                    <span style={{...styles.totalValue, fontSize: isDesktop ? '1.5rem' : '1.2rem'}}>
                                        ${purchaseModal.bond.price}
                                    </span>
                                    <p style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '4px' }}>
                                        Returns {purchaseModal.bond.coupon_rate} after {purchaseModal.bond.duration_hours} hours.
                                    </p>
                                </div>
                            </div>

                            <button onClick={confirmPurchase} style={{...styles.confirmBtn, fontSize: isDesktop ? '0.85rem' : '0.75rem'}}>
                                <Wallet size={14} />
                                Confirm Purchase
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Notifications */}
            <AnimatePresence>
                {status && (
                    <motion.div 
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 100, opacity: 0 }}
                        style={{
                            ...styles.toast,
                            borderLeft: `4px solid ${status.type === 'success' ? '#10b981' : '#f43f5e'}`,
                            fontSize: isDesktop ? '0.9rem' : '0.75rem'
                        }}
                    >
                        {status.msg}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const styles = {
    container: { padding: '20px 10px', maxWidth: '1200px', margin: '0 auto', color: 'white', minHeight: '100vh', paddingBottom: '100px' },
    header: { marginBottom: '30px' },
    title: { fontSize: '1.4rem', fontWeight: '900', margin: 0 },
    subtitle: { color: '#94a3b8', margin: '2px 0 0 0', fontSize: '0.75rem' },
    loaderContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', gap: '15px', color: '#94a3b8' },
    marketGrid: { display: 'grid' },
    bondCard: { 
        background: '#1e293b', borderRadius: '24px', 
        border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' 
    },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
    issuerGroup: { display: 'flex', alignItems: 'center', gap: '6px' },
    issuerName: { color: '#94a3b8', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase' },
    riskBadge: { padding: '4px 8px', borderRadius: '6px', fontSize: '0.6rem', fontWeight: '800' },
    priceSection: { marginBottom: '20px' },
    priceLabel: { fontSize: '0.65rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' },
    priceValue: { fontWeight: '900', color: '#f8fafc', margin: 0 },
    statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' },
    statBox: { background: 'rgba(15, 23, 42, 0.4)', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' },
    statInfo: { display: 'flex', flexDirection: 'column' },
    statLabel: { fontSize: '0.55rem', color: '#64748b', fontWeight: '700' },
    statValue: { fontSize: '0.8rem', fontWeight: '800', color: 'white' },
    buyBtn: { 
        width: '100%', padding: '12px', borderRadius: '12px', border: 'none',
        background: '#3b82f6', color: 'white', fontWeight: '800', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        transition: 'opacity 0.2s', marginTop: 'auto'
    },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, backdropFilter: 'blur(4px)' },
    modalContent: { background: '#1e293b', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', boxSizing: 'border-box' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
    modalTitle: { fontWeight: '800', margin: 0 },
    closeBtn: { background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' },
    modalBody: { display: 'flex', flexDirection: 'column', gap: '12px' },
    orderDetail: { display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.8rem' },
    orderValue: { color: 'white', fontWeight: '700' },
    totalBox: { background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '2px', border: '1px dashed #3b82f6' },
    totalLabel: { fontSize: '0.6rem', color: '#3b82f6', fontWeight: '800', textTransform: 'uppercase' },
    totalValue: { fontWeight: '900', color: 'white' },
    confirmBtn: { width: '100%', marginTop: '16px', padding: '12px', borderRadius: '10px', background: '#3b82f6', color: 'white', border: 'none', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' },
    toast: { position: 'fixed', bottom: '20px', right: '20px', background: '#1e293b', padding: '12px 20px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 10001, fontWeight: '600' }
};

export default Bonds;