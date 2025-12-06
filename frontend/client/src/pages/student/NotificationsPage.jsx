import React, { useState, useEffect } from 'react';
import { getAuth } from '../../utils/authUtils';
import {
    getNotificationsByUser,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
} from '../../services/api';

const NotificationsPage = () => {
    const auth = getAuth();
    const studentId = auth?.user?.id;

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('Tümü');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedNotification, setSelectedNotification] = useState(null);

    const filterOptions = [
        { value: 'Tümü', label: 'Tümü' },
        { value: 'Akademik', label: 'Akademik' },
        { value: 'Duyuru', label: 'Duyurular' },
        { value: 'Hatırlatma', label: 'Hatırlatma' },
        { value: 'Motivasyon', label: 'Motivasyon' },
        { value: 'Mesaj', label: 'Mesajlar' },
        { value: 'Ödev', label: 'Ödevler' },
    ];

    const notificationStyles = {
        Akademik: { icon: 'school', color: 'text-green-500', bgColor: 'bg-green-500/10 dark:bg-green-500/20' },
        Duyuru: { icon: 'campaign', color: 'text-red-500', bgColor: 'bg-red-500/10 dark:bg-red-500/20' },
        Hatırlatma: { icon: 'event_upcoming', color: 'text-yellow-500', bgColor: 'bg-yellow-500/10 dark:bg-yellow-500/20' },
        Motivasyon: { icon: 'celebration', color: 'text-purple-500', bgColor: 'bg-purple-500/10 dark:bg-purple-500/20' },
        Mesaj: { icon: 'chat', color: 'text-blue-500', bgColor: 'bg-blue-500/10 dark:bg-blue-500/20' },
        Ödev: { icon: 'assignment', color: 'text-cyan-500', bgColor: 'bg-cyan-500/10 dark:bg-cyan-500/20' },
    };

    useEffect(() => {
        loadNotifications();
    }, [studentId]);

    const loadNotifications = async () => {
        if (!studentId) return;

        try {
            setLoading(true);
            const data = await getNotificationsByUser(studentId);
            setNotifications(data);
        } catch (err) {
            console.error('Error loading notifications:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            await markNotificationAsRead(notificationId);
            setNotifications(notifications.map(n =>
                n.id === notificationId ? { ...n, isRead: true } : n
            ));
        } catch (err) {
            console.error('Error marking as read:', err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead(studentId);
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        } catch (err) {
            console.error('Error marking all as read:', err);
            alert('İşlem sırasında bir hata oluştu.');
        }
    };

    const handleDelete = async (notificationId) => {
        if (!window.confirm('Bu bildirimi silmek istediğinize emin misiniz?')) return;

        try {
            await deleteNotification(notificationId);
            setNotifications(notifications.filter(n => n.id !== notificationId));
            setSelectedNotification(null);
        } catch (err) {
            console.error('Error deleting notification:', err);
            alert('Bildirim silinirken bir hata oluştu.');
        }
    };

    const handleNotificationClick = async (notification) => {
        setSelectedNotification(notification);
        if (!notification.isRead) {
            await handleMarkAsRead(notification.id);
        }
    };

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Az önce';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} dakika önce`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} saat önce`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} gün önce`;

        return date.toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatFullDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStyle = (type) => {
        return notificationStyles[type] || { icon: 'notifications', color: 'text-gray-500', bgColor: 'bg-gray-500/10' };
    };

    const filteredNotifications = notifications.filter(n => {
        const matchesFilter = filter === 'Tümü' || n.notificationType === filter;
        const matchesSearch = searchQuery === '' ||
            n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            n.message.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const unreadCount = notifications.filter(n => !n.isRead).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 dark:text-gray-400">Bildirimler yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <span className="material-symbols-outlined text-5xl text-red-400 mb-3">error</span>
                    <p className="text-red-500">{error}</p>
                    <button onClick={loadNotifications} className="mt-4 text-primary hover:underline">
                        Tekrar Dene
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-wrap justify-between items-center gap-3 pb-4">
                <div>
                    <h1 className="text-[#111418] dark:text-gray-100 text-3xl font-black tracking-tight">Bildirimler</h1>
                    {unreadCount > 0 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <span className="font-medium text-primary">{unreadCount}</span> okunmamış bildirim
                        </p>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-3">
                <div className="w-full sm:w-auto overflow-x-auto">
                    <div className="flex h-10 w-full items-center justify-center rounded-lg bg-gray-200/50 dark:bg-gray-800/50 p-1 min-w-max">
                        {filterOptions.map(option => (
                            <label
                                key={option.value}
                                className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-3 sm:px-4 text-sm font-medium leading-normal transition-colors duration-200 ${filter === option.value
                                    ? 'bg-white shadow-sm text-primary dark:bg-gray-900'
                                    : 'text-[#617589] dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                <span className="truncate">{option.label}</span>
                                <input
                                    checked={filter === option.value}
                                    onChange={() => setFilter(option.value)}
                                    className="invisible w-0"
                                    name="notification_filter"
                                    type="radio"
                                    value={option.value}
                                />
                            </label>
                        ))}
                    </div>
                </div>
                <div className="flex w-full sm:w-auto gap-2">
                    <div className="relative flex-1">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary/60 text-sm"
                            placeholder="Bildirimlerde ara..."
                            type="search"
                        />
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="flex items-center justify-center h-10 px-4 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary text-sm font-medium hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors whitespace-nowrap"
                        >
                            <span className="material-symbols-outlined text-lg mr-1">done_all</span>
                            Hepsini Okundu İşaretle
                        </button>
                    )}
                </div>
            </div>

            {/* Notification List */}
            <div className="mt-6 flex flex-col gap-2">
                {filteredNotifications.length === 0 ? (
                    <div className="text-center py-16">
                        <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">notifications_off</span>
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            {filter !== 'Tümü' || searchQuery ? 'Bildirim bulunamadı' : 'Henüz bildiriminiz yok'}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            {filter !== 'Tümü' || searchQuery
                                ? 'Farklı bir filtre veya arama terimi deneyin.'
                                : 'Yeni bildirimler burada görünecek.'}
                        </p>
                    </div>
                ) : (
                    filteredNotifications.map(notification => {
                        const style = getStyle(notification.notificationType);
                        return (
                            <div
                                key={notification.id}
                                onClick={() => handleNotificationClick(notification)}
                                className={`flex items-center gap-4 bg-white dark:bg-gray-900/50 p-4 rounded-xl border border-transparent hover:border-primary/50 dark:hover:border-primary/60 transition-colors duration-200 cursor-pointer relative group ${notification.isRead ? 'opacity-70' : ''
                                    }`}
                            >
                                {/* Unread indicator */}
                                {!notification.isRead && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1.5 bg-primary rounded-r-full"></div>
                                )}

                                {/* Icon */}
                                <div className={`${style.color} flex items-center justify-center rounded-lg ${style.bgColor} shrink-0 size-12`}>
                                    <span className="material-symbols-outlined text-2xl">{style.icon}</span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <p className={`text-[#111418] dark:text-gray-100 text-base leading-normal line-clamp-1 ${notification.isRead ? 'font-medium' : 'font-semibold'
                                        }`}>
                                        {notification.title}
                                    </p>
                                    <p className={`${style.color.replace('text-', 'text-').replace('-500', '-600')} dark:${style.color.replace('-500', '-400')} text-sm font-normal leading-normal line-clamp-1`}>
                                        {notification.notificationType}
                                        {notification.sender && (
                                            <span className="text-gray-400 dark:text-gray-500 ml-2">
                                                • {notification.sender.firstName} {notification.sender.lastName}
                                            </span>
                                        )}
                                    </p>
                                </div>

                                {/* Time & Actions */}
                                <div className="shrink-0 text-right flex items-center gap-2">
                                    <p className="text-[#617589] dark:text-gray-400 text-sm font-normal leading-normal">
                                        {formatTimeAgo(notification.createdAt)}
                                    </p>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(notification.id); }}
                                        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-all"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Notification Detail Modal */}
            {selectedNotification && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedNotification(null)}
                >
                    <div
                        className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full max-h-[80vh] overflow-hidden shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-start gap-4">
                                <div className={`${getStyle(selectedNotification.notificationType).color} flex items-center justify-center rounded-lg ${getStyle(selectedNotification.notificationType).bgColor} shrink-0 size-12`}>
                                    <span className="material-symbols-outlined text-2xl">
                                        {getStyle(selectedNotification.notificationType).icon}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {selectedNotification.title}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        <span className={`${getStyle(selectedNotification.notificationType).color}`}>
                                            {selectedNotification.notificationType}
                                        </span>
                                        <span>•</span>
                                        <span>{formatFullDate(selectedNotification.createdAt)}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedNotification(null)}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto max-h-[50vh]">
                            {selectedNotification.sender && (
                                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-sm font-bold text-primary">
                                        {selectedNotification.sender.firstName?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {selectedNotification.sender.firstName} {selectedNotification.sender.lastName}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Gönderen</p>
                                    </div>
                                </div>
                            )}
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                                {selectedNotification.message}
                            </p>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
                            <button
                                onClick={() => handleDelete(selectedNotification.id)}
                                className="px-4 py-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium text-sm transition-colors"
                            >
                                Sil
                            </button>
                            <button
                                onClick={() => setSelectedNotification(null)}
                                className="px-4 py-2 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors"
                            >
                                Kapat
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default NotificationsPage;
