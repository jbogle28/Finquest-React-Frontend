import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Building2, Timer, ArrowRight, 
    X, Wallet, Landmark, AlertTriangle,
} from 'lucide-react';
import financeService from '../../services/financeService';

const FixedDeposits = () => {
    const [marketFDs, setMarketFDs] = useState([]);
    const [activeFDs, setActiveFDs] = useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    
    // Real-time ticker state
    const [currentTime, setCurrentTime] = useState(new Date());
    
    // Modals
    const [purchaseModal, setPurchaseModal] = useState({ show: false, fd: null });
    const [withdrawModal, setWithdrawModal] = useState({ show: false, fd: null });
    const [amount, setAmount] = useState('');
    const [status, setStatus] = useState(null);

    const loadData = useCallback(async () => {
        try {
            const [marketData, userData] = await Promise.all([
                financeService.getFDMarket(),
                financeService.getFDStatus()
            ]);
            setMarketFDs(marketData);
            setActiveFDs(userData);
        } catch (err) {
            console.error("Data sync failed", err);
        }
    }, []);

    // Ticker Effect: Forces re-render every second to update "isMatured" status
    useEffect(() => {
        const ticker = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(ticker);
    }, []);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        
        loadData(); 
        
        return () => window.removeEventListener('resize', handleResize);
    }, [loadData]);

    
    const handleCreate = async () => {
        if (!amount || amount <= 0 || !purchaseModal.fd) return;
        try {
            await financeService.createFD(parseFloat(amount), purchaseModal.fd.id);
            
            setStatus({ type: 'success', msg: "Investment locked successfully!" });
            setPurchaseModal({ show: false, fd: null });
            setAmount('');
            loadData();
        } catch (err) {
            setStatus({ type: 'error', msg: err.response?.data?.msg || "Transaction failed." });
        }
        setTimeout(() => setStatus(null), 4000);
    };

    const handleWithdraw = async () => {
        try {
            const result = await financeService.withdrawFD(withdrawModal.fd.id);
            setStatus({ type: 'success', msg: result.msg });
            setWithdrawModal({ show: false, fd: null });
            loadData();
        } catch (err) {
            setStatus({ type: 'error', msg: "Withdrawal failed." });
        }
        setTimeout(() => setStatus(null), 4000);
    };

    return (
        <div style={styles.container}>
            <div style={styles.headerSection}>
                <h1 style={styles.title}>Fixed Deposit Market</h1>
                <p style={styles.subtitle}>Secure guaranteed returns with Jamaica's top financial institutions.</p>
            </div>

            {/* --- ACTIVE INVESTMENTS --- */}
            {activeFDs.length > 0 && (
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={styles.sectionLabel}>Your Active Deposits</h2>
                    <div style={styles.grid}>
                        {activeFDs.map(fd => {
                            // Uses currentTime from state to trigger UI updates automatically
                            const isMatured = currentTime >= new Date(fd.end_time);
                            return (
                                <motion.div key={fd.id} style={styles.activeCard} layout>
                                    <div style={styles.activeTop}>
                                        <Building2 size={18} color="#a855f7" />
                                        <span style={styles.activeInst}>{fd.institution}</span>
                                        <div style={{
                                            ...styles.statusBadge,
                                            background: isMatured ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                            color: isMatured ? '#10b981' : '#f59e0b'
                                        }}>
                                            {isMatured ? 'MATURED' : 'LOCKED'}
                                        </div>
                                    </div>
                                    <div style={styles.activeMain}>
                                        <div style={styles.activeValue}>${fd.principal}</div>
                                        <div style={styles.activeYield}>+{(fd.interest_rate * 100).toFixed(1)}% APY</div>
                                    </div>
                                    <button 
                                        onClick={() => setWithdrawModal({ show: true, fd })}
                                        style={isMatured ? styles.claimBtn : styles.breakBtn}
                                    >
                                        {isMatured ? "Claim Returns" : "Break Early (-10%)"}
                                    </button>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* --- MARKET OFFERINGS --- */}
            <h2 style={styles.sectionLabel}>Available Offerings</h2>
            <div style={styles.grid}>
                {marketFDs.map((fd) => (
                    <motion.div 
                        key={fd.id} 
                        whileHover={{ y: -5 }} 
                        style={styles.marketCard}
                    >
                        <div style={styles.cardHeader}>
                            <div style={styles.iconBox}>
                                <Landmark size={20} color="#3b82f6" />
                            </div>
                            <div style={styles.instDetails}>
                                <span style={styles.institutionName}>{fd.institution}</span>
                                <div style={styles.termTag}>
                                    <Timer size={12} /> {fd.term}h Lock Period
                                </div>
                            </div>
                        </div>

                        <div style={styles.metricsRow}>
                            <div style={styles.metric}>
                                <span style={styles.metricLabel}>Interest Rate</span>
                                <span style={styles.metricValue}>{(fd.rate * 100).toFixed(2)}%</span>
                            </div>
                            <div style={styles.metric}>
                                <span style={styles.metricLabel}>Risk Level</span>
                                <span style={styles.riskValue}>Low</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => setPurchaseModal({ show: true, fd })}
                            style={styles.investBtn}
                        >
                            Invest Principal <ArrowRight size={16} />
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* --- PURCHASE MODAL --- */}
            <AnimatePresence>
                {purchaseModal.show && (
                    <div style={styles.modalOverlay}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={styles.modalContent}>
                            <div style={styles.modalHeader}>
                                <h2 style={styles.modalTitle}>New Deposit</h2>
                                <button onClick={() => setPurchaseModal({ show: false, fd: null })} style={styles.closeBtn}><X /></button>
                            </div>
                            
                            <div style={styles.modalBody}>
                                <div style={styles.orderDetail}>
                                    <span>Institution</span>
                                    <span style={styles.orderValue}>{purchaseModal.fd.institution}</span>
                                </div>
                                
                                <div style={styles.inputSection}>
                                    <label style={styles.label}>Investment Amount</label>
                                    <div style={styles.inputWrapper}>
                                        <Wallet size={18} color="#94a3b8" />
                                        <input 
                                            type="number" 
                                            placeholder="Enter amount..." 
                                            value={amount} 
                                            onChange={(e) => setAmount(e.target.value)} 
                                            style={styles.modalInput}
                                        />
                                    </div>
                                </div>

                                <div style={styles.projectionBox}>
                                    <div style={styles.projRow}>
                                        <span style={styles.projLabel}>Yield ({purchaseModal.fd.rate * 100}%)</span>
                                        <span style={styles.projValue}>
                                            +${(amount * purchaseModal.fd.rate || 0).toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <button onClick={handleCreate} style={styles.confirmBtn}>
                                    Confirm Investment
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- WITHDRAWAL MODAL --- */}
            <AnimatePresence>
                {withdrawModal.show && (
                    <div style={styles.modalOverlay}>
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={styles.miniModal}>
                            <AlertTriangle size={32} color="#f43f5e" style={{ marginBottom: '15px' }} />
                            <h3 style={styles.modalTitle}>Confirm Action</h3>
                            <p style={styles.warningText}>
                                {currentTime < new Date(withdrawModal.fd.end_time) 
                                    ? "This deposit is still locked. Early withdrawal will result in a 10% penalty on your principal."
                                    : "Your investment has matured! Ready to claim your returns?"}
                            </p>
                            <div style={styles.buttonGroup}>
                                <button onClick={() => setWithdrawModal({ show: false, fd: null })} style={styles.cancelBtn}>Cancel</button>
                                <button onClick={handleWithdraw} style={styles.finalBtn}>Confirm</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- TOAST NOTIFICATION --- */}
            <AnimatePresence>
                {status && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
                        style={{...styles.toast, background: status.type === 'success' ? '#10b981' : '#f43f5e'}}
                    >
                        {status.msg}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const styles = {
    container: { padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' },
    headerSection: { marginBottom: '40px' },
    title: { fontSize: '2.5rem', fontWeight: '900', color: 'white', margin: 0, letterSpacing: '-1px' },
    subtitle: { color: '#94a3b8', fontSize: '1.1rem', marginTop: '8px' },
    sectionLabel: { color: '#64748b', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' },
    marketCard: { background: '#1e293b', borderRadius: '24px', padding: '24px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '20px' },
    cardHeader: { display: 'flex', gap: '16px', alignItems: 'center' },
    iconBox: { width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    instDetails: { display: 'flex', flexDirection: 'column' },
    institutionName: { color: 'white', fontWeight: '800', fontSize: '1.1rem' },
    termTag: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#64748b', marginTop: '2px' },
    metricsRow: { display: 'flex', justifyContent: 'space-between', background: 'rgba(15, 23, 42, 0.4)', padding: '15px', borderRadius: '16px' },
    metric: { display: 'flex', flexDirection: 'column', gap: '4px' },
    metricLabel: { fontSize: '0.65rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' },
    metricValue: { color: '#10b981', fontWeight: '900', fontSize: '1.2rem' },
    riskValue: { color: '#3b82f6', fontWeight: '800', fontSize: '1rem' },
    investBtn: { width: '100%', padding: '14px', borderRadius: '14px', border: 'none', background: 'rgba(255,255,255,0.05)', color: 'white', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' },
    activeCard: { background: 'linear-gradient(145deg, #1e293b, #0f172a)', borderRadius: '24px', padding: '20px', border: '1px solid #a855f7' },
    activeTop: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' },
    activeInst: { color: 'white', fontWeight: '700', flex: 1 },
    statusBadge: { fontSize: '0.6rem', fontWeight: '900', padding: '4px 10px', borderRadius: '50px' },
    activeMain: { marginBottom: '20px' },
    activeValue: { fontSize: '2rem', fontWeight: '900', color: 'white' },
    activeYield: { fontSize: '0.85rem', color: '#10b981', fontWeight: '700' },
    claimBtn: { width: '100%', padding: '12px', borderRadius: '12px', border: 'none', background: '#10b981', color: 'white', fontWeight: '800', cursor: 'pointer' },
    breakBtn: { width: '100%', padding: '12px', borderRadius: '12px', border: 'none', background: 'rgba(244, 63, 94, 0.1)', color: '#fb7185', fontWeight: '800', cursor: 'pointer' },
    modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' },
    modalContent: { background: '#1e293b', width: '90%', maxWidth: '450px', padding: '30px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    modalTitle: { fontSize: '1.5rem', fontWeight: '900', color: 'white', margin: 0 },
    closeBtn: { background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' },
    orderDetail: { display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.9rem' },
    orderValue: { color: 'white', fontWeight: '700' },
    inputSection: { marginTop: '20px' },
    label: { color: '#64748b', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' },
    inputWrapper: { display: 'flex', alignItems: 'center', background: '#0f172a', padding: '0 15px', borderRadius: '16px', marginTop: '8px' },
    modalInput: { background: 'none', border: 'none', padding: '18px 10px', color: 'white', fontSize: '1.2rem', fontWeight: '800', width: '100%', outline: 'none' },
    projectionBox: { background: 'rgba(16, 185, 129, 0.05)', padding: '20px', borderRadius: '20px', margin: '20px 0', border: '1px dashed #10b981' },
    projRow: { display: 'flex', justifyContent: 'space-between' },
    projLabel: { color: '#10b981', fontWeight: '700' },
    projValue: { color: 'white', fontWeight: '900' },
    confirmBtn: { width: '100%', padding: '18px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '18px', fontWeight: '900', cursor: 'pointer' },
    miniModal: { background: '#1e293b', width: '90%', maxWidth: '400px', padding: '40px', borderRadius: '32px', textAlign: 'center' },
    warningText: { color: '#cbd5e1', lineHeight: '1.6', marginBottom: '30px' },
    buttonGroup: { display: 'flex', gap: '12px' },
    cancelBtn: { flex: 1, padding: '14px', borderRadius: '14px', background: '#334155', color: 'white', border: 'none', fontWeight: '700' },
    finalBtn: { flex: 1, padding: '14px', borderRadius: '14px', background: '#f43f5e', color: 'white', border: 'none', fontWeight: '700' },
    toast: { position: 'fixed', bottom: '40px', left: '50%', transform: 'translateX(-50%)', padding: '15px 35px', borderRadius: '50px', color: 'white', fontWeight: '800', zIndex: 2000 }
};

export default FixedDeposits;
