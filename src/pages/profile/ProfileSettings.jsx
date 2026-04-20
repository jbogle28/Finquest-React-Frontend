import React, { useState, useEffect, useCallback } from 'react';
import { User, Save, Edit2, X, CheckCircle, AlertCircle, Camera } from 'lucide-react';
import authService from '../../services/authService';
import profileService from '../../services/profileService';

const BASE_URL = process.env.REACT_APP_API_URL?.replace(/\/$/, '') || 'http://127.0.0.1:5000';

const ProfileSettings = () => {
    const [userData, setUserData] = useState(null);
    const [inventory, setInventory] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ f_name: '', l_name: '' });
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const loadData = useCallback(async () => {
        try {
            const [profile, inventoryResponse] = await Promise.all([
                authService.getUserProfile(),
                profileService.getOwnedAvatars()
            ]);

            if (profile && profile.user) {
                // Refreshing userData ensures active_cosmetic_id is up to date
                setUserData(profile.user);
                
                // Only reset form fields if not currently typing
                if (!isEditing) {
                    setFormData({ 
                        f_name: profile.user.f_name, 
                        l_name: profile.user.l_name 
                    });
                }
            }

            setInventory(inventoryResponse?.inventory || []);
        } catch (err) {
            console.error("Profile Load Error:", err);
            showNotification("Failed to load profile data", "error");
        }
    }, [isEditing]);

    useEffect(() => {
        loadData();
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [loadData]);

    const handleUpdateInfo = async (e) => {
        e.preventDefault();
        try {
            await profileService.updateInfo(formData);
            setIsEditing(false);
            await loadData();
            showNotification("Profile updated successfully!", "success");
        } catch (err) {
            showNotification(err.response?.data?.msg || "Update failed", "error");
        }
    };

    const handleSelectAvatar = async (cosmeticId) => {
        try {
            await profileService.equipAvatar(cosmeticId);
            // Re-fetching data here triggers the UI update for the top section
            await loadData();
            showNotification("Avatar updated!", "success");
        } catch (err) {
            showNotification("Failed to change avatar", "error");
        }
    };

    // Derived state: find the active avatar object based on the current user data
    const activeAvatar = inventory.find(item => item.cosmetic_id === userData?.active_cosmetic_id);

    if (!userData) return null;

    return (
        <div style={{...styles.container, paddingBottom: isMobile ? '75px' : '2rem'}}>
            {notification && (
                <div style={{
                    ...styles.notification,
                    backgroundColor: notification.type === 'success' ? '#065f46' : '#991b1b',
                    border: `1px solid ${notification.type === 'success' ? '#10b981' : '#ef4444'}`
                }}>
                    {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    <span>{notification.message}</span>
                </div>
            )}

            <div style={styles.header}>
                <div style={styles.headerMain}>
                    <div style={styles.avatarCircle}>
                        <img 
                            src={activeAvatar ? `${BASE_URL}/${activeAvatar.image_url}` : '/assets/images/default-avatar.png'} 
                            alt="Profile" 
                            style={styles.headerAvatarImg}
                        />
                    </div>
                    <div>
                        <h1 style={{...styles.title, fontSize: isMobile ? '1.4rem' : '2rem'}}>
                            {userData.f_name} {userData.l_name}
                        </h1>
                        <p style={{...styles.subtitle, fontSize: isMobile ? '0.75rem' : '0.9rem'}}>
                            @{userData.username}
                        </p>
                    </div>
                </div>
            </div>

            <div style={styles.layout}>
                <div style={{...styles.sectionCard, padding: isMobile ? '16px' : '24px'}}>
                    <div style={styles.cardHeader}>
                        <h2 style={{...styles.sectionTitle, fontSize: isMobile ? '0.85rem' : '1rem'}}>
                            <User size={isMobile ? 16 : 20} color="var(--primary-purple)"/> PERSONAL INFO
                        </h2>
                        <button onClick={() => setIsEditing(!isEditing)} style={styles.editToggle}>
                            {isEditing ? <X size={16}/> : <Edit2 size={16}/>}
                        </button>
                    </div>

                    {!isEditing ? (
                        <div style={styles.infoDisplay}>
                            {[
                                { label: 'Full Name', value: `${userData.f_name} ${userData.l_name}` },
                                { label: 'Username', value: `@${userData.username}` },
                                { label: 'Email Address', value: userData.email }
                            ].map((row, idx) => (
                                <div key={idx} style={styles.infoRow}>
                                    <label style={styles.label}>{row.label}</label>
                                    <p style={{...styles.value, fontSize: isMobile ? '0.85rem' : '1rem'}}>{row.value}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <form onSubmit={handleUpdateInfo} style={styles.form}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>First Name</label>
                                <input 
                                    style={styles.input}
                                    value={formData.f_name}
                                    onChange={(e) => setFormData({...formData, f_name: e.target.value})}
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Last Name</label>
                                <input 
                                    style={styles.input}
                                    value={formData.l_name}
                                    onChange={(e) => setFormData({...formData, l_name: e.target.value})}
                                />
                            </div>
                            <button type="submit" style={styles.saveBtn}>
                                <Save size={16} /> SAVE CHANGES
                            </button>
                        </form>
                    )}
                </div>

                <div style={{...styles.sectionCard, padding: isMobile ? '16px' : '24px'}}>
                    <div style={styles.cardHeader}>
                        <h2 style={{...styles.sectionTitle, fontSize: isMobile ? '0.85rem' : '1rem'}}>
                            <Camera size={isMobile ? 16 : 20} color="var(--primary-purple)"/> AVATAR GALLERY
                        </h2>
                    </div>
                    <div style={{
                        ...styles.grid,
                        gridTemplateColumns: isMobile ? 'repeat(4, 1fr)' : 'repeat(6, 1fr)',
                        gap: isMobile ? '10px' : '15px'
                    }}>
                        {inventory.map((item) => (
                            <div 
                                key={item.cosmetic_id} 
                                onClick={() => handleSelectAvatar(item.cosmetic_id)}
                                style={{
                                    ...styles.avatarOption,
                                    borderColor: item.cosmetic_id === userData.active_cosmetic_id ? 'var(--primary-purple)' : 'transparent',
                                    opacity: item.cosmetic_id === userData.active_cosmetic_id ? 1 : 0.6,
                                }}
                            >
                                <img 
                                    src={`${BASE_URL}/${item.image_url}`} 
                                    alt={item.name} 
                                    style={styles.avatarImg} 
                                />
                                {item.cosmetic_id === userData.active_cosmetic_id && (
                                    <div style={styles.checkOverlay}><CheckCircle size={14}/></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { padding: 'var(--container-padding)', maxWidth: '1000px', margin: '0 auto', minHeight: '100vh' },
    notification: { position: 'fixed', top: '20px', right: '20px', zIndex: 1001, display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', borderRadius: '10px', color: 'white', fontWeight: '800', fontSize: '0.85rem' },
    header: { marginBottom: '25px', paddingBottom: '20px' },
    headerMain: { display: 'flex', alignItems: 'center', gap: '16px' },
    avatarCircle: { width: '64px', height: '64px', borderRadius: '50%', border: '2.5px solid var(--primary-purple)', padding: '2px', backgroundColor: 'var(--bg-deep)' },
    headerAvatarImg: { width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' },
    title: { fontWeight: '900', color: 'white', margin: 0, letterSpacing: '-0.02em' },
    subtitle: { color: 'var(--text-muted)', margin: 0, fontWeight: '600' },
    layout: { display: 'flex', flexDirection: 'column', gap: '20px' },
    sectionCard: { backgroundColor: 'var(--bg-card)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
    sectionTitle: { fontWeight: '900', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, letterSpacing: '0.03em' },
    editToggle: { background: 'var(--bg-hover)', border: 'none', color: 'white', padding: '6px', borderRadius: '8px', cursor: 'pointer' },
    infoDisplay: { display: 'flex', flexDirection: 'column', gap: '10px' },
    infoRow: { borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '8px' },
    label: { display: 'block', fontSize: '0.6rem', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px', letterSpacing: '0.05em' },
    value: { fontWeight: '700', color: 'white', margin: 0 },
    form: { display: 'flex', flexDirection: 'column', gap: '12px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '4px' },
    input: { backgroundColor: 'var(--bg-deep)', border: '1px solid var(--bg-hover)', borderRadius: '10px', padding: '10px', color: 'white', fontSize: '0.9rem', outline: 'none' },
    saveBtn: { backgroundColor: 'var(--primary-purple)', color: 'black', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.8rem' },
    grid: { display: 'grid' },
    avatarOption: { position: 'relative', borderRadius: '50%', aspectRatio: '1/1', overflow: 'hidden', border: '2px solid transparent', cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', backgroundColor: 'var(--bg-deep)' },
    avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
    checkOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(250, 204, 21, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }
};

export default ProfileSettings;
