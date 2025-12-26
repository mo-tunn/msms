import React, { useState, useEffect } from 'react';
import { getAuth } from '../../utils/authUtils';
import { getStudentsByMentor, sendBulkNotification, getSentNotifications } from '../../services/api';

const MentorNotificationsPage = () => {
    const auth = getAuth();
    const mentorId = auth?.user?.id;

    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [sentNotifications, setSentNotifications] = useState([]);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('send'); // 'send' or 'history'

    // Form states
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [priority, setPriority] = useState('Normal');
    const [notificationType, setNotificationType] = useState('Duyuru');

    const notificationTypes = [
        { value: 'Duyuru', label: 'Duyuru', icon: 'campaign', color: 'text-blue-500' },
        { value: 'Akademik', label: 'Akademik', icon: 'school', color: 'text-purple-500' },
        { value: 'Hatırlatma', label: 'Hatırlatma', icon: 'alarm', color: 'text-orange-500' },
        { value: 'Motivasyon', label: 'Motivasyon', icon: 'emoji_events', color: 'text-yellow-500' },
        { value: 'Ödev', label: 'Ödev', icon: 'assignment', color: 'text-green-500' },
        { value: 'Mesaj', label: 'Mesaj', icon: 'mail', color: 'text-cyan-500' },
    ];

    const priorityOptions = [
        { value: 'Düşük', label: 'Düşük', color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' },
        { value: 'Normal', label: 'Normal', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' },
        { value: 'Yüksek', label: 'Yüksek (Acil)', color: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400' },
    ];

    useEffect(() => {
        loadData();
    }, [mentorId]);

    const loadData = async () => {
        if (!mentorId) return;

        try {
            setLoading(true);

            // Get students
            const studentsData = await getStudentsByMentor(mentorId);
            setStudents(studentsData.map(s => ({
                id: s.user_id?.toString() || s.id?.toString(),
                name: `${s.first_name} ${s.last_name}`,
                email: s.email,
                avatarUrl: s.avatar_url
            })));

            // Get sent notifications
            const notificationsData = await getSentNotifications(mentorId);
            setSentNotifications(notificationsData);

        } catch (err) {
            console.error('Error loading data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleStudent = (id) => {
        if (selectedStudents.includes(id)) {
            setSelectedStudents(selectedStudents.filter(s => s !== id));
        } else {
            setSelectedStudents([...selectedStudents, id]);
        }
    };

    const handleSelectAll = () => {
        if (selectedStudents.length === students.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(students.map(s => s.id));
        }
    };

    const resetForm = () => {
        setTitle('');
        setMessage('');
        setPriority('Normal');
        setNotificationType('Duyuru');
        setSelectedStudents([]);
    };

    const handleSendNotification = async (e) => {
        e.preventDefault();

        if (selectedStudents.length === 0) {
            alert('Lütfen en az bir öğrenci seçin.');
            return;
        }

        if (!title.trim() || !message.trim()) {
            alert('Lütfen başlık ve mesaj alanlarını doldurun.');
            return;
        }

        try {
            setSubmitting(true);

            const notificationData = {
                senderId: parseInt(mentorId),
                receiverIds: selectedStudents.map(id => parseInt(id)),
                title: title.trim(),
                message: message.trim(),
                notificationType,
                priority
            };

            const result = await sendBulkNotification(notificationData);

            alert(`${result.sentCount} öğrenciye bildirim başarıyla gönderildi!`);
            resetForm();

            // Refresh sent notifications
            const notificationsData = await getSentNotifications(mentorId);
            setSentNotifications(notificationsData);

        } catch (err) {
            console.error('Send notification error:', err);
            alert('Bildirim gönderilirken bir hata oluştu: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTypeIcon = (type) => {
        const found = notificationTypes.find(t => t.value === type);
        return found ? found.icon : 'notifications';
    };

    const getTypeColor = (type) => {
        const found = notificationTypes.find(t => t.value === type);
        return found ? found.color : 'text-gray-500';
    };

    const getPriorityBadge = (priority) => {
        const found = priorityOptions.find(p => p.value === priority);
        return found ? found.color : 'bg-gray-100 text-gray-600';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 dark:text-gray-400">Yükleniyor...</p>
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
                    <button onClick={loadData} className="mt-4 text-primary hover:underline">
                        Tekrar Dene
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bildirim Merkezi</h1>
                <p className="text-gray-500 dark:text-gray-400">Öğrencilerinize toplu veya bireysel duyurular yapın.</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setActiveTab('send')}
                    className={`px-4 py-3 font-medium text-sm transition-colors relative ${activeTab === 'send'
                            ? 'text-primary'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                >
                    <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-xl">send</span>
                        Bildirim Gönder
                    </span>
                    {activeTab === 'send' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`px-4 py-3 font-medium text-sm transition-colors relative ${activeTab === 'history'
                            ? 'text-primary'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                >
                    <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-xl">history</span>
                        Gönderim Geçmişi
                        {sentNotifications.length > 0 && (
                            <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">
                                {sentNotifications.length}
                            </span>
                        )}
                    </span>
                    {activeTab === 'history' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>
                    )}
                </button>
            </div>

            {activeTab === 'send' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Student Selection */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm h-full">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Alıcılar</h2>
                                <button
                                    onClick={handleSelectAll}
                                    className="text-sm text-primary hover:underline font-medium"
                                >
                                    {selectedStudents.length === students.length ? 'Tümünü Kaldır' : 'Tümünü Seç'}
                                </button>
                            </div>

                            {students.length === 0 ? (
                                <div className="text-center py-8">
                                    <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600 mb-2">group_off</span>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">Henüz öğrenciniz bulunmuyor.</p>
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                                    {students.map(student => (
                                        <label key={student.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-all">
                                            <input
                                                type="checkbox"
                                                checked={selectedStudents.includes(student.id)}
                                                onChange={() => toggleStudent(student.id)}
                                                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                            <div className="flex items-center gap-3">
                                                {student.avatarUrl ? (
                                                    <img src={student.avatarUrl} alt={student.name} className="h-8 w-8 rounded-full object-cover" />
                                                ) : (
                                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-xs font-bold text-primary">
                                                        {student.name.charAt(0)}
                                                    </div>
                                                )}
                                                <div>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white block">{student.name}</span>
                                                    {student.email && (
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">{student.email}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}

                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-white">{selectedStudents.length}</span> öğrenci seçildi
                            </div>
                        </div>
                    </div>

                    {/* Message Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Bildirim İçeriği</h2>
                            <form onSubmit={handleSendNotification} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bildirim Başlığı</label>
                                    <input
                                        required
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        placeholder="Örn: Haftalık Ödev Hatırlatması"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mesaj</label>
                                    <textarea
                                        required
                                        rows="5"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                                        placeholder="Mesajınızı buraya yazın..."
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Öncelik</label>
                                        <select
                                            value={priority}
                                            onChange={(e) => setPriority(e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        >
                                            {priorityOptions.map(option => (
                                                <option key={option.value} value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tip</label>
                                        <select
                                            value={notificationType}
                                            onChange={(e) => setNotificationType(e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        >
                                            {notificationTypes.map(type => (
                                                <option key={type.value} value={type.value}>{type.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Preview Card */}
                                {(title || message) && (
                                    <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4">
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">Önizleme</p>
                                        <div className="flex items-start gap-3">
                                            <div className={`w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center ${getTypeColor(notificationType)}`}>
                                                <span className="material-symbols-outlined">{getTypeIcon(notificationType)}</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-semibold text-gray-900 dark:text-white">{title || 'Başlık'}</h4>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityBadge(priority)}`}>
                                                        {priority}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{message || 'Mesaj içeriği burada görünecek...'}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="pt-4 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={submitting || selectedStudents.length === 0}
                                        className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
                                    >
                                        {submitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Gönderiliyor...
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined">send</span>
                                                Bildirimi Gönder
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            ) : (
                /* History Tab */
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    {sentNotifications.length === 0 ? (
                        <div className="text-center py-16">
                            <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">notifications_off</span>
                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Henüz bildirim göndermediniz</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Öğrencilerinize bildirim gönderdikçe burada listelenecek.</p>
                            <button
                                onClick={() => setActiveTab('send')}
                                className="mt-4 text-primary hover:underline font-medium text-sm"
                            >
                                İlk bildirimnizi gönderin →
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            {sentNotifications.map(notification => (
                                <div key={notification.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center ${getTypeColor(notification.notificationType)}`}>
                                            <span className="material-symbols-outlined">{getTypeIcon(notification.notificationType)}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h4 className="font-semibold text-gray-900 dark:text-white">{notification.title}</h4>
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityBadge(notification.priority)}`}>
                                                            {notification.priority}
                                                        </span>
                                                        {notification.isRead && (
                                                            <span className="text-xs text-green-500 flex items-center gap-1">
                                                                <span className="material-symbols-outlined text-sm">done_all</span>
                                                                Okundu
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                                            {notification.receiver?.firstName} {notification.receiver?.lastName}
                                                        </span>
                                                    </p>
                                                </div>
                                                <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                                                    {formatDate(notification.createdAt)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{notification.message}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MentorNotificationsPage;
