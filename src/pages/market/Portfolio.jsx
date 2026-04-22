import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    TrendingUp, TrendingDown, Briefcase, Trash2, PieChart, 
    X, AlertTriangle, CheckCircle, ChevronDown, ChevronUp 
} from 'lucide-react';
import financeService from '../../services/financeService';

const Portfolio = () => {
    const [portfolio, setPortfolio] = useState({ 
        items: [], 
        summary: { net_position: 0, market_value: 0, total_invested: 0 } 
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    
    // Collapsible states
    const [expanded, setExpanded] = useState({ stocks: true, fds: true, bonds: true });

    // Custom Modal State
    const [sellModal, setSellModal] = useState({ show: false, item: null });

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        loadPortfolioData();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const loadPortfolioData = async () => {
        setLoading(true);
        try {
            const data = await financeService.getPortfolioDetails();
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

    const toggleSection = (section) => {
        setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const initiateSell = (item) => {
        setSellModal({ show: true, item });
    };

    const confirmLiquidation = async () => {
        const { item } = sellModal;
        if (!item) return;
    
        try {
            let result;
            if (item.type === 'Stock') {
                result = await financeService.tradeStock(item.asset_id, 'SELL', item.qty);
            } else if (item.type === 'Bond') {
                result = await financeService.sellBond(item.id); 
            } else if (item.type === 'Fixed Deposit') {
                // Fixed Deposits use withdrawFD with the specific fd_id
                result = await financeService.withdrawFD(item.fd_id);
            }
            
            showToast(result?.msg || "Asset liquidated successfully!", 'success');
            setSellModal({ show: false, item: null });
            loadPortfolioData(); 
        } catch (err) {
            console.error("Liquidation Error:", err);
            const errorMsg = err.response?.data?.msg || "Transaction failed. Please try again.";
            showToast(errorMsg, 'error');
        }
    };

    const isDesktop = windowWidth >= 1024;

    // Categorize Items
    const stocks = portfolio.items.filter(i => i.type === 'Stock');
    const fds = portfolio.items.filter(i => i.type === 'Fixed Deposit');
    const bonds = portfolio.items.filter(i => i.type === 'Bond');

    const renderAssetSection = (title, items, key, type) => (
        <div style={styles.collapsibleWrapper}>
            <button onClick={() => toggleSection(key)} style={styles.collapseHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={styles.sectionTitle}>{title} ({items.length})</span>
                </div>
                {expanded[key] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            
            <AnimatePresence>
                {expanded[key] && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div style={{
                            ...styles.assetGrid, 
                            gridTemplateColumns: isDesktop ? 'repeat(auto-fill, minmax(300px, 1fr))' : '1fr',
                            gap: isDesktop ? '20px' : '10px',
                            padding: '10px 0 30px 0'
                        }}>
                            {items.map((item, idx) => (
                                <div key={item.portfolio_id || item.fd_id || idx} style={styles.assetCard}>
                                    <div style={styles.assetHeader}>
                                        <div>
                                            <span style={styles.assetType}>{item.type}</span>
                                            <h3 style={{...styles.assetName, fontSize: isDesktop ? '1.2rem' : '0.9rem'}}>{item.ticker || item.name || item.institution_name}</h3>
                                        </div>
                                        <p style={styles.assetQty}>{item.qty || '1'} {isDesktop ? 'Units' : 'Qty'}</p>
                                    </div>
                                    <div style={styles.assetBody}>
                                        {item.type === 'Stock' ? (
                                            <>
                                                <div style={styles.detailRow}><span>Avg Price</span><span>${parseFloat(item.avg_price).toFixed(2)}</span></div>
                                                <div style={styles.detailRow}>
                                                    <span>Market</span>
                                                    <span style={{ color: item.current_price >= item.avg_price ? '#10b981' : '#f43f5e' }}>
                                                        ${parseFloat(item.current_price).toFixed(2)}
                                                    </span>
                                                </div>
                                            </>
                                        ) : item.type === 'Bond' ? (
                                            <>
                                                <div style={styles.detailRow}><span>Face Value</span><span>${parseFloat(item.price).toFixed(2)}</span></div>
                                                <div style={styles.detailRow}><span>Coupon</span><span style={{ color: '#a855f7', fontWeight: '700' }}>{item.coupon}</span></div>
                                            </>
                                        ) : (
                                            <>
                                                <div style={styles.detailRow}><span>Principal</span><span>${parseFloat(item.principal).toFixed(2)}</span></div>
                                                <div style={styles.detailRow}><span>Rate</span><span style={{ color: '#a855f7', fontWeight: '700' }}>{(item.interest_rate * 100).toFixed(1)}%</span></div>
                                            </>
                                        )}
                                    </div>
                                    <button onClick={() => initiateSell(item)} style={styles.sellBtn}>
                                        <Trash2 size={16} style={{ marginRight: '6px' }} />
                                        {item.type === 'Fixed Deposit' ? 'Withdraw' : 'Liquidate'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

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
                        <span style={{ ...styles.sumValue, color: portfolio.summary.net_position >= 0 ? '#10b981' : '#f43f5e' }}>
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

            {loading ? (
                <p style={styles.loadingText}>Analyzing holdings...</p>
            ) : portfolio.items.length === 0 ? (
                <div style={styles.emptyState}><p>No active investments found.</p></div>
            ) : (
                <>
                    {stocks.length > 0 && renderAssetSection("Stocks", stocks, 'stocks')}
                    {fds.length > 0 && renderAssetSection("Fixed Deposits", fds, 'fds')}
                    {bonds.length > 0 && renderAssetSection("Bonds", bonds, 'bonds')}
                </>
            )}

            {/* Modals and Toasts remain largely the same, logic updated in confirmLiquidation */}
            <AnimatePresence>
                {sellModal.show && (
                    <div style={styles.modalOverlay}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={styles.modalContent}>
                            <div style={styles.modalHeader}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <AlertTriangle size={18} color="#f59e0b" />
                                    <h2 style={styles.modalTitle}>Confirm Transaction</h2>
                                </div>
                                <button onClick={() => setSellModal({ show: false, item: null })} style={styles.closeBtn}><X size={18} /></button>
                            </div>
                            <div style={styles.modalBody}>
                                <p style={styles.modalWarning}>
                                    Are you sure you want to {sellModal.item.type === 'Fixed Deposit' ? 'withdraw from' : 'liquidate your position in'} <strong>{sellModal.item.ticker || sellModal.item.name || sellModal.item.institution_name}</strong>?
                                </p>
                            </div>
                            <button onClick={confirmLiquidation} style={styles.confirmBtn}>Confirm Action</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {message && (
                    <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 100, opacity: 0 }} 
                        style={{...styles.toast, borderLeft: `4px solid ${message.type === 'success' ? '#10b981' : '#f43f5e'}`}}>
                        {message.type === 'success' ? <CheckCircle size={16} color="#10b981"/> : <AlertTriangle size={16} color="#f43f5e"/>}
                        {message.text}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const styles = {
    // ... existing styles ...
    container: { padding: '20px 15px', maxWidth: '1200px', margin: '0 auto', color: 'white', minHeight: '100vh', paddingBottom: '100px' },
    header: { marginBottom: '30px' },
    titleArea: { display: 'flex', alignItems: 'center', gap: '12px' },
    title: { fontWeight: '900', margin: 0, letterSpacing: '-0.5px' },
    summaryGrid: { display: 'grid', gap: '15px', marginBottom: '40px' },
    sumCard: { background: 'rgba(30, 41, 59, 0.5)', padding: '20px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '4px' },
    sumLabel: { color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' },
    sumValue: { fontSize: '1.6rem', fontWeight: '900' },
    collapsibleWrapper: { marginBottom: '10px' },
    collapseHeader: { 
        width: '100%', background: 'rgba(30, 41, 59, 0.3)', border: '1px solid rgba(255,255,255,0.05)', 
        padding: '15px 20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', 
        alignItems: 'center', color: 'white', cursor: 'pointer', marginBottom: '10px' 
    },
    sectionTitle: { fontSize: '1rem', fontWeight: '800', color: '#cbd5e1' },
    assetGrid: { display: 'grid' },
    assetCard: { background: '#1e293b', padding: '18px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' },
    assetHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '18px' },
    assetType: { fontSize: '0.65rem', color: '#a855f7', fontWeight: '900', textTransform: 'uppercase' },
    assetName: { color: 'white', margin: '2px 0 0 0', fontWeight: '700' },
    assetQty: { color: '#94a3b8', fontSize: '0.8rem', fontWeight: '600', margin: 0 },
    assetBody: { borderTop: '1px solid rgba(255,255,255,0.08)', padding: '14px 0' },
    detailRow: { display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' },
    sellBtn: { width: '100%', padding: '12px', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', color: '#fb7185', borderRadius: '10px', cursor: 'pointer', fontWeight: '800', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    loadingText: { color: '#64748b', textAlign: 'center', marginTop: '40px' },
    emptyState: { textAlign: 'center', color: '#64748b', padding: '40px', background: 'rgba(30, 41, 59, 0.3)', borderRadius: '18px' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, backdropFilter: 'blur(4px)' },
    modalContent: { background: '#1e293b', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', padding: '24px', width: '400px' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
    modalTitle: { fontWeight: '800', margin: 0, color: 'white' },
    closeBtn: { background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' },
    modalBody: { display: 'flex', flexDirection: 'column', gap: '12px' },
    modalWarning: { color: '#94a3b8', lineHeight: '1.4', margin: 0 },
    confirmBtn: { width: '100%', marginTop: '16px', padding: '14px', borderRadius: '12px', background: '#f43f5e', color: 'white', border: 'none', fontWeight: '800', cursor: 'pointer' },
    toast: { position: 'fixed', bottom: '40px', right: '40px', background: '#1e293b', padding: '16px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 10001, fontWeight: '700' }
};

export default Portfolio;
