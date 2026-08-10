import React, { useState, useEffect } from 'react';
import DepartmentSidebar from './DepartmentSidebar';
import DepartmentNavbar from './DepartmentNavbar';
import Loader from '../common/Loader';
import { authService } from '../../services/authService';
import { useResponsive } from '../../hooks/useResponsive';
import {
    Activity,
    Calendar,
    Search,
    Filter,
    Clock,
    User,
    FileText,
    AlertCircle,
} from 'lucide-react';

const DepartmentActivityLogs = () => {
    const { isMobile, isCompact } = useResponsive();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAction, setFilterAction] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchActivities();
    }, [searchTerm, filterAction]);

    const fetchActivities = async () => {
        try {
            setLoading(true);
            const data = await authService.getActivityLogs(searchTerm, filterAction);
            console.log('Activity logs:', data);
            setActivities(data.results || []);
        } catch (err) {
            setError('Failed to load activity logs');
            console.error(err);
            setActivities([]);
        } finally {
            setLoading(false);
        }
    };

    const getActionColor = (action) => {
        const colors = {
            'Created': '#4ade80',
            'Updated': '#60a5fa',
            'Deleted': '#f87171',
            'Login': '#a78bfa',
            'Logout': '#94a3b8',
        };
        for (let key in colors) {
            if (action?.includes(key)) return colors[key];
        }
        return '#818cf8';
    };

    const getActionIcon = (action) => {
        if (!action) return <Activity size={14} />;
        if (action.includes('Created')) return <FileText size={14} />;
        if (action.includes('Updated')) return <Activity size={14} />;
        if (action.includes('Deleted')) return <AlertCircle size={14} />;
        return <Activity size={14} />;
    };

    if (loading) return <Loader />;

    return (
        <div style={s.container}>
            <DepartmentSidebar />
            <div style={{ ...s.mainContent, ...(isCompact ? { marginLeft: 0 } : {}) }}>
                <DepartmentNavbar />
                <div style={{ ...s.content, ...(isMobile ? { padding: '90px 16px 32px 16px' } : {}) }}>

                    {/* Header */}
                    <header style={{ ...s.pageHeader, ...(isMobile ? { flexDirection: 'column', alignItems: 'flex-start', gap: '14px' } : {}) }}>
                        <div style={s.headerLeft}>
                            <div style={s.headerIconWrap}>
                                <Activity size={20} color="#818cf8" />
                            </div>
                            <div>
                                <h1 style={s.pageTitle}>Activity Logs</h1>
                                <p style={s.pageSubtitle}>Track all department activities</p>
                            </div>
                        </div>
                        <div style={s.headerRight}>
                            <div style={s.dateBadge}>
                                <Calendar size={14} color="#6366f1" />
                                <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                        </div>
                    </header>

                    {/* Error Alert */}
                    {error && (
                        <div style={s.errorAlert}>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Filters */}
                    <div style={{ ...s.filterBar, ...(isMobile ? { flexDirection: 'column' } : {}) }}>
                        <div style={s.searchWrap}>
                            <Search size={16} color="#475569" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="text"
                                placeholder="Search activities..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={s.searchInput}
                            />
                        </div>

                        <div style={s.filterWrap}>
                            <Filter size={16} color="#475569" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                            <select
                                value={filterAction}
                                onChange={(e) => setFilterAction(e.target.value)}
                                style={s.filterSelect}
                            >
                                <option value="">All Actions</option>
                                <option value="Created">Created</option>
                                <option value="Updated">Updated</option>
                                <option value="Deleted">Deleted</option>
                                <option value="Login">Login</option>
                            </select>
                        </div>
                    </div>

                    {/* Activity Timeline */}
                    <div style={{ ...s.timelineCard, ...(isMobile ? { padding: '20px 16px' } : {}) }}>
                        {activities.length > 0 ? (
                            <div style={s.timeline}>
                                {activities.map((activity, index) => (
                                    <div key={activity.id} style={s.timelineItem}>
                                        <div style={{
                                            ...s.timelineDot,
                                            backgroundColor: getActionColor(activity.action),
                                            boxShadow: `0 0 0 4px ${getActionColor(activity.action)}20`,
                                        }}>
                                            {getActionIcon(activity.action)}
                                        </div>
                                        <div style={s.timelineContent}>
                                            <div style={s.activityCard}>
                                                <div style={{ ...s.activityHeader, ...(isMobile ? { flexWrap: 'wrap', gap: '6px' } : {}) }}>
                                                    <div style={s.activityUser}>
                                                        <User size={14} color="#64748b" />
                                                        <span style={s.userName}>{activity.user_username || 'System'}</span>
                                                    </div>
                                                    <div style={s.activityTime}>
                                                        <Clock size={12} color="#475569" />
                                                        <span>{activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'N/A'}</span>
                                                    </div>
                                                </div>
                                                <div style={s.activityBody}>
                                                    <div style={{
                                                        ...s.actionBadge,
                                                        backgroundColor: `${getActionColor(activity.action)}15`,
                                                        border: `1px solid ${getActionColor(activity.action)}40`,
                                                        color: getActionColor(activity.action),
                                                    }}>
                                                        {activity.action || 'Unknown Action'}
                                                    </div>
                                                    <p style={s.activityDesc}>{activity.details || 'No details available'}</p>
                                                    {activity.ip_address && (
                                                        <div style={s.ipBadge}>
                                                            IP: {activity.ip_address}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {index < activities.length - 1 && <div style={s.timelineLine} />}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={s.noData}>
                                <Activity size={40} color="#334155" />
                                <p style={{ color: '#64748b', marginTop: '12px', fontSize: '14px' }}>No activities found</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

/* ─── Styles ──────────────────────────────────────── */

const s = {
    container: { display: 'flex', backgroundColor: '#020617', minHeight: '100vh' },
    mainContent: {
        minWidth: 0, marginLeft: '280px', flex: 1, display: 'flex', flexDirection: 'column' },
    content: { padding: '100px 40px 40px 40px' },

    pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px' },
    headerLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
    headerRight: { display: 'flex', alignItems: 'center', gap: '12px' },
    headerIconWrap: { width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#0f172a', border: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    pageTitle: { fontSize: '26px', fontWeight: '800', color: '#f8fafc', margin: 0, letterSpacing: '-0.5px' },
    pageSubtitle: { color: '#64748b', fontSize: '14px', margin: '4px 0 0 0' },
    dateBadge: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '10px 16px', borderRadius: '10px', color: '#f8fafc', fontSize: '13px', fontWeight: '600' },

    errorAlert: { backgroundColor: '#2d0a0a', border: '1px solid #5a1a1a', borderRadius: '10px', padding: '12px 18px', marginBottom: '24px', color: '#f87171', fontSize: '14px', fontWeight: '500' },

    filterBar: { display: 'flex', gap: '16px', marginBottom: '24px' },
    searchWrap: { position: 'relative', flex: 1 },
    searchInput: { width: '100%', padding: '11px 16px 11px 42px', fontSize: '14px', backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', color: '#f1f5f9', outline: 'none', boxSizing: 'border-box' },
    filterWrap: { position: 'relative', minWidth: '200px' },
    filterSelect: { width: '100%', padding: '11px 16px 11px 42px', fontSize: '14px', backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', color: '#f1f5f9', outline: 'none', cursor: 'pointer' },

    timelineCard: { backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b', padding: '32px' },
    timeline: { position: 'relative', paddingLeft: '32px' },
    timelineItem: { position: 'relative', marginBottom: '32px' },
    timelineDot: { position: 'absolute', left: '-40px', top: '8px', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', zIndex: 1 },
    timelineLine: { position: 'absolute', left: '-24px', top: '48px', width: '2px', height: 'calc(100% + 16px)', backgroundColor: '#1e293b' },
    timelineContent: { marginLeft: '8px' },

    activityCard: { backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px', transition: 'all 0.2s' },
    activityHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
    activityUser: { display: 'flex', alignItems: 'center', gap: '8px' },
    userName: { color: '#f1f5f9', fontSize: '14px', fontWeight: '600' },
    activityTime: { display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '12px' },
    activityBody: { display: 'flex', flexDirection: 'column', gap: '10px' },
    actionBadge: { display: 'inline-block', alignSelf: 'flex-start', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' },
    activityDesc: { color: '#cbd5e1', fontSize: '13px', margin: 0, lineHeight: '1.6' },
    ipBadge: { color: '#475569', fontSize: '11px', fontFamily: 'monospace', backgroundColor: '#1e293b', padding: '4px 8px', borderRadius: '4px', alignSelf: 'flex-start' },

    noData: { textAlign: 'center', padding: '64px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
};

export default DepartmentActivityLogs;