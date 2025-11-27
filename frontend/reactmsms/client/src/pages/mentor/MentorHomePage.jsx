import React from 'react';
import { NavLink } from 'react-router-dom';

const MentorHomePage = () => {
    // Mock data
    const stats = [
        { title: 'Toplam Öğrenci', value: '12', icon: 'groups', color: 'bg-blue-500' },
        { title: 'Yaklaşan Toplantılar', value: '3', icon: 'event', color: 'bg-purple-500' },
        { title: 'Bekleyen Görevler', value: '5', icon: 'pending_actions', color: 'bg-amber-500' },
    ];

    const quickActions = [
        { title: 'Ders Programı', icon: 'calendar_month', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20', path: '/mentor/ders-programi' },
        { title: 'Sınavlar', icon: 'quiz', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20', path: '/mentor/sinavlar' },
        { title: 'Toplantılar', icon: 'groups', color: 'text-red-600 bg-red-50 dark:bg-red-900/20', path: '/mentor/toplantilar' },
        { title: 'Bildirimler', icon: 'notifications', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20', path: '/mentor/bildirimler' },
        { title: 'Analizler', icon: 'monitoring', color: 'text-green-600 bg-green-50 dark:bg-green-900/20', path: '/mentor/analizler/genel' },
    ];

    const upcomingMeetings = [
        { id: 1, student: 'Ahmet Yılmaz', time: '14:00', type: 'Haftalık Görüşme' },
        { id: 2, student: 'Ayşe Demir', time: '16:30', type: 'Sınav Analizi' },
        { id: 3, student: 'Mehmet Kaya', time: 'Yarın 10:00', type: 'Rehberlik' },
    ];

    const recentActivities = [
        { id: 1, student: 'Zeynep Çelik', action: 'Matematik testini tamamladı', time: '15 dk önce', type: 'success' },
        { id: 2, student: 'Can Vural', action: 'Yeni hedef belirledi', time: '1 saat önce', type: 'info' },
        { id: 3, student: 'Elif Öztürk', action: 'Deneme sınavı sonucu girildi', time: '2 saat önce', type: 'warning' },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">MSMS Mentor Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400">Günlük aktivitelerinizi ve öğrenci durumlarını buradan yönetin.</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {quickActions.map((action, index) => (
                    <NavLink
                        key={index}
                        to={action.path}
                        className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group"
                    >
                        <div className={`p-3 rounded-xl mb-3 ${action.color} group-hover:scale-110 transition-transform`}>
                            <span className="material-symbols-outlined text-2xl">{action.icon}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{action.title}</span>
                    </NavLink>
                ))}
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${stat.color} text-white shadow-lg shadow-current/20`}>
                            <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Schedule & Performance */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Upcoming Schedule */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Yaklaşan Program</h2>
                            <NavLink to="/mentor/toplantilar" className="text-sm text-primary hover:underline">Tümünü Gör</NavLink>
                        </div>
                        <div className="space-y-3">
                            {upcomingMeetings.map((meeting) => (
                                <div key={meeting.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-sm">
                                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{meeting.time.split(' ')[0]}</span>
                                            <span className="text-xs text-gray-400 dark:text-gray-500">{meeting.time.split(' ')[1]}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">{meeting.student}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{meeting.type}</p>
                                        </div>
                                    </div>
                                    <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 transition-colors">
                                        <span className="material-symbols-outlined">videocam</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Exam Performance Summary */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Sınav Başarı Özeti</h2>
                            <NavLink to="/mentor/analizler/genel" className="text-sm text-primary hover:underline">Detaylı Analiz</NavLink>
                        </div>
                        <div className="h-48 flex items-end justify-between gap-2 px-2">
                            {[65, 78, 45, 82, 90, 75, 60, 85].map((height, i) => (
                                <div key={i} className="w-full bg-gray-100 dark:bg-gray-700 rounded-t-lg relative group">
                                    <div
                                        className="absolute bottom-0 left-0 right-0 bg-primary/80 hover:bg-primary transition-all rounded-t-lg"
                                        style={{ height: `${height}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            %{height}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 text-xs text-gray-500 dark:text-gray-400">
                            <span>TYT-1</span>
                            <span>AYT-1</span>
                            <span>TYT-2</span>
                            <span>AYT-2</span>
                            <span>TYT-3</span>
                            <span>AYT-3</span>
                            <span>TYT-4</span>
                            <span>AYT-4</span>
                        </div>
                    </div>
                </div>

                {/* Right Column - Activity & Quick Access */}
                <div className="space-y-8">
                    {/* Recent Activity */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Son Aktiviteler</h2>
                        </div>
                        <div className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-3 space-y-6">
                            {recentActivities.map((activity, index) => (
                                <div key={index} className="ml-6 relative">
                                    <div className={`absolute -left-[31px] top-0 h-4 w-4 rounded-full border-2 border-white dark:border-gray-800 ${activity.type === 'success' ? 'bg-green-500' :
                                            activity.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                                        }`}></div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.student}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{activity.action}</p>
                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Student Access */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Hızlı Erişim</h2>
                        <div className="space-y-3">
                            {['Ahmet Yılmaz', 'Ayşe Demir', 'Mehmet Kaya', 'Zeynep Çelik'].map((student, i) => (
                                <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                                            {student.charAt(0)}
                                        </div>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{student}</span>
                                    </div>
                                    <button className="text-gray-400 hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined text-xl">chat</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorHomePage;
