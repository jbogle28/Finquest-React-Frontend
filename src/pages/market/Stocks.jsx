import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    TrendingUp, Zap, ShieldCheck, AlertCircle, 
    PlayCircle, Loader2, BarChart3, Castle, X, ShoppingCart
} from 'lucide-react';
import financeService from '../../services/financeService';
import StocksTutorial from './StocksTutorial';

const Stocks = () => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTutorial, setShowTutorial] = useState(false);
    const [selectedStock, setSelectedStock] = useState(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    
    // Custom Trade Modal State
    const [tradeModal, setTradeModal] = useState({ show: false, stock: null, quantity: 1 });
    const [tradeStatus, setTradeStatus] = useState(null);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        loadMarket();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const loadMarket = async () => {
        try {
            const data = await financeService.getStockMarket();
            setStocks(data);
            if (data.length > 0) setSelectedStock(data[0]);
        } catch (err) {
            console.error("Market fetch failed", err);
        } finally {
            setLoading(false);
        }
    };

    const initiateTrade = (stock) => {
        setTradeModal({ show: true, stock, quantity: 1 });
    };

    const confirmTrade = async () => {
        const { stock, quantity } = tradeModal;
        try {
            const result = await financeService.tradeStock(stock.id, 'BUY', parseInt(quantity));
            setTradeStatus({ type: 'success', msg: result.msg });
            setTradeModal({ show: false, stock: null, quantity: 1 });
            loadMarket(); 
        } catch (err) {
            setTradeStatus({ type: 'error', msg: "Trade failed: Insufficient funds or server error." });
        }
        setTimeout(() => setTradeStatus(null), 4000);
    };

    const renderSparkline = (price, intrinsic) => {
        const isUp = price < intrinsic;
        const color = isUp ? "#10b981" : "#f43f5e";
        return (
            <svg width="40" height="20" viewBox="0 0 60 30">
                <path 
                    d={isUp ? "M5 25 L20 18 L35 22 L55 5" : "M5 5 L20 12 L35 8 L55 25"} 
                    fill="none" 
                    stroke={color} 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                />
            </svg>
        );
    };

    const isDesktop = windowWidth >= 1024;
    const gridColumns = isDesktop ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)';

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h1 style={styles.title}>Stock Market</h1>
                        <TrendingUp size={isDesktop ? 24 : 18} color="#10b981" />
                    </div>
                    <p style={styles.subtitle}>Identify high-quality businesses with strong moats.</p>
                </div>
                <button 
                    onClick={() => setShowTutorial(true)} 
                    style={styles.tutorialBtn}
                >
                    <PlayCircle size={16} />
                    {isDesktop ? 'Learn to Trade' : 'Learn'}
                </button>
            </div>

            {loading ? (
                <div style={styles.loaderContainer}>
                    <Loader2 size={40} className="animate-spin" color="#a855f7" />
                    <p>Fetching Live Market Data...</p>
                </div>
            ) : (
                <div style={{
                    ...styles.marketGrid,
                    gridTemplateColumns: gridColumns,
                    gap: isDesktop ? '20px' : '10px'
                }}>
                    {stocks.map((stock, index) => (
                        <motion.div 
                            key={stock.id} 
                            id={index === 0 ? "tutorial-anchor-card" : null}
                            whileHover={{ y: -5 }}
                            style={{
                                ...styles.stockCard,
                                padding: isDesktop ? '20px' : '12px'
                            }}
                        >
                            <div style={styles.cardHeader}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px' }}>
                                    <span style={styles.ticker}>{stock.ticker}</span>
                                    <div style={styles.moatBadge} title={stock.metrics.moat}>
                                        <Castle size={10} color="#f59e0b" />
                                        <span>Moat</span>
                                    </div>
                                </div>
                                {renderSparkline(stock.price, stock.intrinsic_value)}
                            </div>
                            
                            <div style={{ marginBottom: '12px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <span style={{...styles.price, fontSize: isDesktop ? '1.5rem' : '1.1rem'}}>${stock.price}</span>
                                    <span style={{ 
                                        ...styles.intrinsicLabel, 
                                        fontSize: isDesktop ? '0.75rem' : '0.65rem',
                                        color: stock.price < stock.intrinsic_value ? '#10b981' : '#64748b' 
                                    }}>
                                        Value: ${stock.intrinsic_value}
                                    </span>
                                </div>
                                <h3 style={{...styles.companyName, fontSize: isDesktop ? '0.9rem' : '0.7rem'}}>{stock.company}</h3>
                            </div>
                            
                            <div style={{...styles.metricsGrid, gap: isDesktop ? '12px' : '6px', padding: isDesktop ? '12px' : '8px'}}>
                                <div id={index === 0 ? "step-roe" : null} style={styles.metric}>
                                    <div style={styles.labelGroup}>
                                        <Zap size={10} color="#a855f7" />
                                        <span style={styles.label}>ROE</span>
                                    </div>
                                    <span style={{...styles.value, fontSize: isDesktop ? '0.9rem' : '0.75rem'}}>{stock.metrics.roe}</span>
                                </div>

                                <div id={index === 0 ? "step-safety" : null} style={styles.metric}>
                                    <div style={styles.labelGroup}>
                                        <ShieldCheck size={10} color={stock.margin_of_safety > 20 ? '#10b981' : '#f43f5e'} />
                                        <span style={styles.label}>Safety</span>
                                    </div>
                                    <span style={{
                                        ...styles.value, 
                                        fontSize: isDesktop ? '0.9rem' : '0.75rem',
                                        color: stock.margin_of_safety > 20 ? '#10b981' : '#f43f5e'
                                    }}>
                                        {stock.margin_of_safety}%
                                    </span>
                                </div>

                                <div style={styles.metric}>
                                    <div style={styles.labelGroup}>
                                        <BarChart3 size={10} color="#3b82f6" />
                                        <span style={styles.label}>Margin</span>
                                    </div>
                                    <span style={{...styles.value, fontSize: isDesktop ? '0.9rem' : '0.75rem'}}>{stock.metrics.profit_margin}</span>
                                </div>

                                <div id={index === 0 ? "step-debt" : null} style={styles.metric}>
                                    <div style={styles.labelGroup}>
                                        <AlertCircle size={10} color="#f59e0b" />
                                        <span style={styles.label}>Debt</span>
                                    </div>
                                    <span style={{...styles.value, fontSize: isDesktop ? '0.9rem' : '0.75rem'}}>{stock.metrics.debt_to_equity}</span>
                                </div>
                            </div>

                            <div style={{...styles.moatBox, padding: isDesktop ? '10px' : '6px'}}>
                                <p style={{...styles.moatText, fontSize: isDesktop ? '0.7rem' : '0.6rem'}}>
                                    {stock.metrics.moat}
                                </p>
                            </div>

                            <button 
                                onClick={() => initiateTrade(stock)}
                                style={{...styles.buyBtn, fontSize: isDesktop ? '0.85rem' : '0.75rem'}}
                            >
                                Buy {stock.ticker}
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Custom Trade Modal */}
            <AnimatePresence>
                {tradeModal.show && (
                    <div style={styles.modalOverlay}>
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{
                                ...styles.modalContent,
                                width: isDesktop ? '400px' : 'calc(50% - 15px)', // Matches container logic
                                minWidth: isDesktop ? '400px' : '160px',
                                padding: isDesktop ? '24px' : '16px'
                            }}
                        >
                            <div style={styles.modalHeader}>
                                <h2 style={{...styles.modalTitle, fontSize: isDesktop ? '1.2rem' : '0.9rem'}}>
                                    {tradeModal.stock.ticker}
                                </h2>
                                <button onClick={() => setTradeModal({ ...tradeModal, show: false })} style={styles.closeBtn}>
                                    <X size={18} />
                                </button>
                            </div>

                            <div style={styles.modalBody}>
                                <div style={styles.orderDetail}>
                                    <span style={styles.orderLabel}>Price</span>
                                    <span style={styles.orderValue}>${tradeModal.stock.price}</span>
                                </div>

                                <div style={styles.inputGroup}>
                                    <label style={styles.orderLabel}>Qty</label>
                                    <input 
                                        type="number" 
                                        min="1"
                                        value={tradeModal.quantity}
                                        onChange={(e) => setTradeModal({ ...tradeModal, quantity: e.target.value })}
                                        style={{...styles.modalInput, padding: isDesktop ? '12px' : '8px'}}
                                    />
                                </div>

                                <div style={{...styles.totalBox, padding: isDesktop ? '16px' : '10px'}}>
                                    <span style={styles.totalLabel}>Total</span>
                                    <span style={{...styles.totalValue, fontSize: isDesktop ? '1.5rem' : '1.1rem'}}>
                                        ${(tradeModal.stock.price * (tradeModal.quantity || 0)).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <button onClick={confirmTrade} style={{...styles.confirmBtn, fontSize: isDesktop ? '0.85rem' : '0.7rem'}}>
                                <ShoppingCart size={14} />
                                Confirm
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Custom Toast Notifications */}
            <AnimatePresence>
                {tradeStatus && (
                    <motion.div 
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 100, opacity: 0 }}
                        style={{
                            ...styles.toast,
                            borderLeft: `4px solid ${tradeStatus.type === 'success' ? '#10b981' : '#f43f5e'}`,
                            fontSize: isDesktop ? '0.9rem' : '0.75rem'
                        }}
                    >
                        {tradeStatus.msg}
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showTutorial && selectedStock && (
                    <StocksTutorial 
                        sampleStock={selectedStock} 
                        onClose={() => setShowTutorial(false)} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const styles = {
    container: { padding: '20px 10px', maxWidth: '1400px', margin: '0 auto', color: 'white', minHeight: '100vh', paddingBottom: '100px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    title: { fontSize: '1.4rem', fontWeight: '900', margin: 0 },
    subtitle: { color: '#94a3b8', margin: '2px 0 0 0', fontSize: '0.75rem' },
    tutorialBtn: { 
        display: 'flex', alignItems: 'center', gap: '6px', background: '#a855f7', 
        color: 'white', border: 'none', padding: '8px 12px', borderRadius: '10px', 
        fontWeight: '700', cursor: 'pointer', fontSize: '0.75rem'
    },
    loaderContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', gap: '15px', color: '#94a3b8' },
    marketGrid: { display: 'grid' },
    stockCard: { 
        background: '#1e293b', borderRadius: '20px', 
        border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column',
    },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' },
    ticker: { background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', padding: '2px 6px', borderRadius: '4px', fontWeight: '800', fontSize: '0.65rem' },
    moatBadge: { display: 'flex', alignItems: 'center', gap: '2px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px', fontSize: '0.55rem', fontWeight: '800', textTransform: 'uppercase' },
    price: { fontWeight: '900', color: '#f8fafc' },
    intrinsicLabel: { fontWeight: '600' },
    companyName: { color: '#94a3b8', fontWeight: '600', margin: '2px 0 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    metricsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', marginBottom: '12px', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px' },
    metric: { display: 'flex', flexDirection: 'column', gap: '1px' },
    labelGroup: { display: 'flex', alignItems: 'center', gap: '3px' },
    label: { fontSize: '0.5rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' },
    value: { fontWeight: '800', color: '#f1f5f9' },
    moatBox: { background: 'rgba(168, 85, 247, 0.05)', borderRadius: '8px', borderLeft: '2px solid #a855f7', marginBottom: '12px' },
    moatText: { color: '#cbd5e1', lineHeight: '1.3', margin: 0, display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' },
    buyBtn: { 
        width: '100%', padding: '10px', borderRadius: '8px', border: 'none',
        background: '#a855f7', color: 'white', fontWeight: '800', cursor: 'pointer',
        marginTop: 'auto', transition: 'opacity 0.2s'
    },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, backdropFilter: 'blur(4px)' },
    modalContent: { background: '#1e293b', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', boxSizing: 'border-box' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
    modalTitle: { fontWeight: '800', margin: 0 },
    closeBtn: { background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' },
    modalBody: { display: 'flex', flexDirection: 'column', gap: '12px' },
    orderDetail: { display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.8rem' },
    orderValue: { color: 'white', fontWeight: '700' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
    orderLabel: { fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', color: '#64748b' },
    modalInput: { background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: 'white', fontSize: '1rem', fontWeight: '700' },
    totalBox: { background: 'rgba(168, 85, 247, 0.1)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '2px', border: '1px dashed #a855f7' },
    totalLabel: { fontSize: '0.6rem', color: '#a855f7', fontWeight: '800', textTransform: 'uppercase' },
    totalValue: { fontWeight: '900', color: 'white' },
    confirmBtn: { width: '100%', marginTop: '16px', padding: '12px', borderRadius: '10px', background: '#a855f7', color: 'white', border: 'none', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' },
    toast: { position: 'fixed', bottom: '20px', right: '20px', background: '#1e293b', padding: '12px 20px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 10001, fontWeight: '600' }
};

export default Stocks;
