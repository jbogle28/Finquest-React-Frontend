import React, { useState } from 'react';
import { TrendingUp, Landmark, ShieldCheck, PieChart, ArrowUpRight, Wallet } from 'lucide-react';

const MarketSimulation = ({ user }) => {
    const [view, setView] = useState('market'); // 'market' or 'portfolio'

    const marketAssets = {
        stocks: [
            { id: 'STK1', name: 'TechGrowth Inc.', price: 150, risk: 'High', return: '12%' },
            { id: 'STK2', name: 'EcoPower Co.', price: 45, risk: 'Medium', return: '8%' },
        ],
        bonds: [
            { id: 'BND1', name: 'Gov Treasury 2026', price: 1000, risk: 'Low', return: '4.5%' },
            { id: 'BND2', name: 'Infrastructure Bond', price: 500, risk: 'Low', return: '5.2%' },
        ],
        deposits: [
            { id: 'DEP1', name: '12-Month Fixed', min: 100, risk: 'Zero', return: '6.0%' },
        ]
    };

    // Dummy Portfolio Data - This would eventually come from your backend
    const myPortfolio = [
        { id: 1, name: 'TechGrowth Inc.', type: 'Stock', quantity: 5, value: 750, change: '+4.2%' },
        { id: 2, name: 'Gov Treasury 2026', type: 'Bond', quantity: 1, value: 1000, change: '0.0%' },
    ];

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div>
                    <h2 style={styles.title}>MARKET SIMULATOR</h2>
                    <p style={styles.subtitle}>Invest your earned coins to grow your wealth.</p>
                </div>
                
                <div style={styles.tabGroup}>
                    <button 
                        style={{ ...styles.tab, borderBottom: view === 'market' ? '2px solid var(--primary-purple)' : 'none' }}
                        onClick={() => setView('market')}
                    >
                        Market
                    </button>
                    <button 
                        style={{ ...styles.tab, borderBottom: view === 'portfolio' ? '2px solid var(--primary-purple)' : 'none' }}
                        onClick={() => setView('portfolio')}
                    >
                        My Portfolio
                    </button>
                </div>
            </header>

            {view === 'market' ? (
                <div style={styles.marketGrid}>
                    {/* Stocks Section */}
                    <section style={styles.marketSection}>
                        <div style={styles.sectionHeader}>
                            <TrendingUp size={20} color="#8b5cf6" />
                            <h3 style={styles.sectionTitle}>Stocks</h3>
                        </div>
                        {marketAssets.stocks.map(stock => (
                            <AssetCard key={stock.id} asset={stock} type="stock" />
                        ))}
                    </section>

                    {/* Bonds Section */}
                    <section style={styles.marketSection}>
                        <div style={styles.sectionHeader}>
                            <ShieldCheck size={20} color="#10b981" />
                            <h3 style={styles.sectionTitle}>Government Bonds</h3>
                        </div>
                        {marketAssets.bonds.map(bond => (
                            <AssetCard key={bond.id} asset={bond} type="bond" />
                        ))}
                    </section>

                    {/* Fixed Deposits Section */}
                    <section style={styles.marketSection}>
                        <div style={styles.sectionHeader}>
                            <Landmark size={20} color="#f59e0b" />
                            <h3 style={styles.sectionTitle}>Fixed Deposits</h3>
                        </div>
                        {marketAssets.deposits.map(dep => (
                            <AssetCard key={dep.id} asset={dep} type="deposit" />
                        ))}
                    </section>
                </div>
            ) : (
                <div style={styles.portfolioWrapper}>
                    <div style={styles.statsRow}>
                        <div style={styles.statCard}>
                            <span style={styles.statLabel}>Total Portfolio Value</span>
                            <span style={styles.statValue}>1,750 Coins</span>
                        </div>
                        <div style={styles.statCard}>
                            <span style={styles.statLabel}>Total Gain/Loss</span>
                            <span style={{ ...styles.statValue, color: 'var(--status-green)' }}>+4.2%</span>
                        </div>
                    </div>

                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.tableHeader}>
                                <th style={styles.th}>Asset</th>
                                <th style={styles.th}>Type</th>
                                <th style={styles.th}>Quantity</th>
                                <th style={styles.th}>Market Value</th>
                                <th style={styles.th}>Change</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myPortfolio.map(item => (
                                <tr key={item.id} style={styles.tableRow}>
                                    <td style={styles.td}>{item.name}</td>
                                    <td style={styles.td}><span style={styles.typeBadge}>{item.type}</span></td>
                                    <td style={styles.td}>{item.quantity}</td>
                                    <td style={styles.td}>{item.value} Coins</td>
                                    <td style={{ ...styles.td, color: 'var(--status-green)' }}>{item.change}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// Sub-component for Asset Cards
const AssetCard = ({ asset, type }) => (
    <div style={styles.assetCard}>
        <div>
            <h4 style={styles.assetName}>{asset.name}</h4>
            <span style={styles.assetRisk}>Risk: {asset.risk}</span>
        </div>
        <div style={styles.assetPriceGroup}>
            <span style={styles.assetPrice}>{asset.price || asset.min} Coins</span>
            <button style={styles.buyBtn}>Invest</button>
        </div>
    </div>
);

const styles = {
    container: { maxWidth: '1200px', margin: '40px auto', padding: '0 40px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' },
    title: { fontSize: '28px', fontWeight: '900', letterSpacing: '1px', marginBottom: '8px' },
    subtitle: { color: 'var(--text-muted)' },
    tabGroup: { display: 'flex', gap: '24px' },
    tab: { background: 'none', border: 'none', color: 'white', padding: '8px 12px', cursor: 'pointer', fontSize: '16px', fontWeight: '600' },
    marketGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' },
    marketSection: { display: 'flex', flexDirection: 'column', gap: '16px' },
    sectionHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' },
    sectionTitle: { fontSize: '18px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' },
    assetCard: { backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: '1px solid var(--bg-hover)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    assetName: { margin: '0 0 4px 0', fontSize: '16px' },
    assetRisk: { fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' },
    assetPriceGroup: { textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '8px' },
    assetPrice: { fontWeight: '700', color: 'var(--status-gold)' },
    buyBtn: { padding: '6px 16px', backgroundColor: 'var(--bg-hover)', border: '1px solid #334155', borderRadius: '6px', color: 'white', fontSize: '12px', cursor: 'pointer' },
    portfolioWrapper: { display: 'flex', flexDirection: 'column', gap: '32px' },
    statsRow: { display: 'flex', gap: '20px' },
    statCard: { flex: 1, backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--bg-hover)', display: 'flex', flexDirection: 'column', gap: '8px' },
    statLabel: { fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' },
    statValue: { fontSize: '24px', fontWeight: '800' },
    table: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'var(--bg-card)', borderRadius: '16px', overflow: 'hidden' },
    th: { textAlign: 'left', padding: '16px 24px', backgroundColor: 'var(--bg-hover)', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase' },
    td: { padding: '16px 24px', borderBottom: '1px solid var(--bg-hover)', fontSize: '14px' },
    typeBadge: { backgroundColor: '#1e293b', padding: '4px 10px', borderRadius: '6px', fontSize: '11px' }
};

export default MarketSimulation;