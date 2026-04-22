import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Briefcase, Trash2, PieChart, X, AlertTriangle, CheckCircle } from 'lucide-react';
import financeService from '../../services/financeService';

const Portfolio = () => {
    const [portfolio, setPortfolio] = useState({ 
        items: [], 
        summary: { net_position: 0, market_value: 0, total_invested: 0 } 
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    
    // Custom Modal State
    const [sellModal, setSellModal] = useState({ show: false, item: null });

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        loadPortfolioData();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const loadPortfolioData = async () => {
        try {
            // Using getPortfolioSummary from your financeService
            const data = await financeService.getPortfolioSummary();
            setPortfolio(data);
        } catch (err) {
            console.error("Portfolio Load Error:", err);
            showToast("Failed to load portfolio details.", 'error');
        } finally {
            setLoading(false);
        }
    };

    const showToast = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 4000);
    };

    const initiateSell = (item) => {
        setSellModal({ show: true, item });
    };

    const confirmLiquidation = async () => {
        const { item } = sellModal;
        try {
            let result;
            // FIXED: Using asset_type as defined in your market.py / finance_routes
            if (item.asset_type === 'Stock') {
                result = await financeService.tradeStock(item.asset_id, 'SELL', item.quantity);
            } else if (item.asset_type === 'Bond') {
                // FIXED: Passing portfolio_id to match financeService.sellBond(portfolioId)
                result = await financeService.sellBond(item.id); 
            }
            
            showToast(result.msg || "Asset liquidated successfully!", 'success');
            setSellModal({ show: false, item: null });
            loadPortfolioData();
        } catch (err) {
            console.error("Liquidation Error:", err);
            showToast("Transaction failed. Please try again.", 'error');
        }
    };

    const isDesktop = windowWidth >= 1024;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={styles.titleArea}>
                    <Briefcase color="#a855f7" size={isDesktop ? 28 : 20} />
                    <h1 style={{...styles.title, fontSize: isDesktop ? '1.8rem' : '1.3rem'}}>My Portfolio</h1>
                </div>
            </div>

            {/* Summary Cards */}
            <div style={{...styles.summaryGrid, gridTemplateColumns: isDesktop ? 'repeat(3, 1fr)' : '1fr'}}>
                <div style={styles.sumCard}>
                    <span style={styles.sumLabel}>Total Market Value</span>
                    <span style={styles.sumValue}>${portfolio.summary.market_value?.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
                <div style={styles.sumCard}>
                    <span style={styles.sumLabel}>Net Position</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ 
                            ...styles.sumValue, 
                            color: portfolio.summary.net_position >= 0 ? '#10b981' : '#f43f5e' 
                        }}>
                            {portfolio.summary.net_position >= 0 ? '+' : ''}${portfolio.summary.net_position?.toLocaleString(undefined, {minimumFractionDigits: 2})}
                        </span>
                        {portfolio.summary.net_position >= 0 ? <TrendingUp color="#10b981" size={20}/> : <TrendingDown color="#f43f5e" size={20}/>}
                    </div>
                </div>
                <div style={styles.sumCard}>
                    <span style={styles.sumLabel}>Invested Capital</span>
                    <span style={styles.sumValue}>${portfolio.summary.total_invested?.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
            </div>

            <div style={styles.sectionHeader}>
                <PieChart size={18} color="#a855f7" />
                <h2 style={styles.sectionTitle}>Asset Allocation</h2>
            </div>

            {loading ? (
                <p style={styles.loadingText}>Analyzing holdings...</p>
            ) : (
                <div style={{
                    ...styles.assetGrid, 
                    gridTemplateColumns: isDesktop ? 'repeat(auto-fill, minmax(300px, 1fr))' : 'repeat(2, 1fr)',
                    gap: isDesktop ? '20px' : '10px'
                }}>
                    {portfolio.items.map((item, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={styles.assetCard}
                        >
                            <div style={styles.assetHeader}>
                                <div>
                                    <span style={styles.assetType}>{item.asset_type}</span>
                                    <h3 style={{...styles.assetName, fontSize: isDesktop ? '1.2rem' : '0.9rem'}}>
                                        {item.ticker || item.issuer_name || "Investment"}
                                    </h3>
                                </div>
                                <p style={styles.assetQty}>{item.quantity} {isDesktop ? 'Units' : 'Qty'}</p>
                            </div>

                            <div style={styles.assetBody}>
                                <div style={styles.detailRow}>
                                    <span>Avg Price</span>
                                    <span>${parseFloat(item.purchase_price).toFixed(2)}</span>
                                </div>
                                <div style={styles.detailRow}>
                                    {/* FIXED: Dynamic Cash Value Display */}
                                    <span>Cash Value</span>
                                    <span style={{ color: '#10b981', fontWeight: '700' }}>
                                        ${(item.asset_type === 'Stock' 
                                            ? (item.current_price * item.quantity) 
                                            : item.purchase_price).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                    </span>
                                </div>
                            </div>

                            <button 
                                onClick={() => initiateSell(item)}
                                style={{...styles.sellBtn, fontSize: isDesktop ? '0.9rem' : '0.75rem'}}
                            >
                                <Trash2 size={isDesktop ? 16 : 14} style={{ marginRight: '6px' }} />
                                Liquidate
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Custom Liquidation Modal */}
            <AnimatePresence>
                {sellModal.show && (
                    <div style={styles.modalOverlay}>
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{
                                ...styles.modalContent,
                                width: isDesktop ? '400px' : '90%',
                                padding: isDesktop ? '24px' : '16px'
                            }}
                        >
                            <div style={styles.modalHeader}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <AlertTriangle size={18} color="#f59e0b" />
                                    <h2 style={{...styles.modalTitle, fontSize: isDesktop ? '1.1rem' : '0.85rem'}}>Confirm Sale</h2>
                                </div>
                                <button onClick={() => setSellModal({ show: false, item: null })} style={styles.closeBtn}>
                                    <X size={18} />
                                </button>
                            </div>

                            <div style={styles.modalBody}>
                                <p style={{...styles.modalWarning, fontSize: isDesktop ? '0.9rem' : '0.7rem'}}>
                                    Are you sure you want to sell your position in <strong>{sellModal.item.ticker || sellModal.item.issuer_name}</strong>?
                                </p>
                                
                                <div style={{...styles.saleSummary, padding: isDesktop ? '16px' : '10px'}}>
                                    <div style={styles.orderDetail}>
                                        <span style={styles.orderLabel}>Units</span>
                                        <span style={styles.orderValue}>{sellModal.item.quantity}</span>
                                    </div>
                                    <div style={styles.totalBox}>
                                        <span style={styles.totalLabel}>Estimated Payout</span>
                                        <span style={{...styles.totalValue, fontSize: isDesktop ? '1.4rem' : '1.1rem'}}>
                                            ${(sellModal.item.asset_type === 'Stock' 
                                                ? (sellModal.item.quantity * sellModal.item.current_price) 
                                                : sellModal.item.purchase_price).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button onClick={confirmLiquidation} style={{...styles.confirmBtn, fontSize: isDesktop ? '0.9rem' : '0.75rem'}}>
                                Confirm Liquidation
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Toast Notifications */}
            <AnimatePresence>
                {message && (
                    <motion.div 
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 100, opacity: 0 }}
                        style={{
                            ...styles.toast,
                            borderLeft: `4px solid ${message.type === 'success' ? '#10b981' : '#f43f5e'}`
                        }}
                    >
                        {message.type === 'success' ? <CheckCircle size={16} color="#10b981"/> : <AlertTriangle size={16} color="#f43f5e"/>}
                        {message.text}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const styles = {
    container: { padding: '20px 15px', maxWidth: '1200px', margin: '0 auto', color: 'white', minHeight: '100vh', paddingBottom: '100px' },
    header: { marginBottom: '30px' },
    titleArea: { display: 'flex', alignItems: 'center', gap: '12px' },
    title: { fontWeight: '900', margin: 0, letterSpacing: '-0.5px' },
    summaryGrid: { display: 'grid', gap: '15px', marginBottom: '40px' },
    sumCard: { background: 'rgba(30, 41, 59, 0.5)', padding: '20px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '4px' },
    sumLabel: { color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' },
    sumValue: { fontSize: '1.6rem', fontWeight: '900' },
    sectionHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' },
    sectionTitle: { fontSize: '1rem', fontWeight: '800', color: '#cbd5e1', margin: 0 },
    assetGrid: { display: 'grid' },
    assetCard: { background: '#1e293b', padding: '18px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' },
    assetHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '18px' },
    assetType: { fontSize: '0.65rem', color: '#a855f7', fontWeight: '900', textTransform: 'uppercase' },
    assetName: { color: 'white', margin: '2px 0 0 0', fontWeight: '700' },
    assetQty: { color: '#94a3b8', fontSize: '0.8rem', fontWeight: '600', margin: 0 },
    assetBody: { borderTop: '1px solid rgba(255,255,255,0.08)', padding: '14px 0' },
    detailRow: { display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' },
    sellBtn: { width: '100%', padding: '12px', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', color: '#fb7185', borderRadius: '10px', cursor: 'pointer', fontWeight: '800', transition: 'all 0.2s', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    loadingText: { color: '#64748b', textAlign: 'center', marginTop: '40px' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, backdropFilter: 'blur(4px)' },
    modalContent: { background: '#1e293b', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', boxSizing: 'border-box' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
    modalTitle: { fontWeight: '800', margin: 0, color: 'white' },
    closeBtn: { background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' },
    modalBody: { display: 'flex', flexDirection: 'column', gap: '12px' },
    modalWarning: { color: '#94a3b8', lineHeight: '1.4', margin: 0 },
    saleSummary: { background: 'rgba(15, 23, 42, 0.4)', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '10px' },
    orderDetail: { display: 'flex', justifyContent: 'space-between' },
    orderLabel: { fontSize: '0.7rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' },
    orderValue: { fontSize: '0.85rem', color: 'white', fontWeight: '700' },
    totalBox: { borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '2px' },
    totalLabel: { fontSize: '0.65rem', color: '#f43f5e', fontWeight: '800', textTransform: 'uppercase' },
    totalValue: { fontWeight: '900', color: 'white' },
    confirmBtn: { width: '100%', marginTop: '16px', padding: '14px', borderRadius: '12px', background: '#f43f5e', color: 'white', border: 'none', fontWeight: '800', cursor: 'pointer' },
    toast: { position: 'fixed', bottom: '40px', right: '40px', background: '#1e293b', padding: '16px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 10001, fontWeight: '700' }
};

export default Portfolio;
