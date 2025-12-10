import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStudentExams, getStudentDashboardData } from '../../services/api';
import { getAuth } from '../../utils/authUtils';

const HomePage = () => {
    const [exams, setExams] = useState([]);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        tytAvg: 0,
        aytAvg: 0,
        totalNetAvg: 0
    });
    const user = getAuth().user;

    useEffect(() => {
        if (user && user.id) {
            fetchData(user.id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    const fetchData = async (studentId) => {
        try {
            setLoading(true);
            const [examsData, dashData] = await Promise.all([
                getStudentExams(studentId),
                getStudentDashboardData()
            ]);

            setExams(examsData);
            setDashboardData(dashData);
            calculateExamStats(examsData);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateExamStats = (examsData) => {
        if (!examsData || examsData.length === 0) return;

        const tytExams = examsData.filter(e => e.exam_type === 'TYT');
        const aytExams = examsData.filter(e => e.exam_type === 'AYT');

        const tytAvg = tytExams.length > 0
            ? tytExams.reduce((acc, curr) => acc + parseFloat(curr.total_net || 0), 0) / tytExams.length
            : 0;

        const aytAvg = aytExams.length > 0
            ? aytExams.reduce((acc, curr) => acc + parseFloat(curr.total_net || 0), 0) / aytExams.length
            : 0;

        const totalNetAvg = examsData.reduce((acc, curr) => acc + parseFloat(curr.total_net || 0), 0) / examsData.length;

        setStats({ tytAvg, aytAvg, totalNetAvg });
    };

    const getSuccessStatusStyles = (label) => {
        switch (label) {
            case 'Çok Yükselişte': return { color: 'text-purple-600', bg: 'bg-purple-100', text: 'text-purple-700' };
            case 'Yükselişte': return { color: 'text-green-500', bg: 'bg-green-100', text: 'text-green-700' };
            case 'Dengeli': return { color: 'text-yellow-500', bg: 'bg-yellow-100', text: 'text-yellow-700' };
            case 'Riskli': return { color: 'text-orange-500', bg: 'bg-orange-100', text: 'text-orange-700' };
            default: return { color: 'text-red-500', bg: 'bg-red-100', text: 'text-red-700' };
        }
    };

    const successScore = dashboardData?.stats?.success_score || 0;
    const riskStatus = dashboardData?.stats?.risk_status || 'Bilinmiyor';
    const statusStyle = getSuccessStatusStyles(riskStatus);

    if (loading) {
        return <div className="p-8 text-center">Yükleniyor...</div>;
    }

    return (
        <>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8">
                <div className="flex min-w-72 flex-col gap-2">
                    <h1 className="text-[#111418] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Merhaba, {user?.first_name || 'Öğrenci'}!</h1>
                    <p className="text-[#617589] dark:text-gray-400 text-base font-normal leading-normal">Bugün hedeflerine bir adım daha yaklaşmaya hazır mısın?</p>
                </div>

                <div className="flex flex-wrap gap-4">
                    {/* Success Score Card */}
                    <div className="flex items-center gap-4 bg-white dark:bg-[#18212a] p-4 rounded-2xl border border-[#e0e6ed] dark:border-[#202932] shadow-sm">
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400">
                            <span className="material-symbols-outlined text-2xl">stars</span>
                        </div>
                        <div>
                            <p className="text-[#617589] dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Başarı Puanı</p>
                            <p className="text-[#111418] dark:text-white text-2xl font-black leading-none mt-1">{successScore}</p>
                        </div>
                    </div>

                    {/* Success Status Card */}
                    <div className={`flex items-center gap-4 p-4 rounded-2xl border border-[#e0e6ed] dark:border-[#202932] shadow-sm ${statusStyle.bg}`}>
                        <div className="p-3 bg-white/50 dark:bg-black/20 rounded-xl">
                            <span className={`material-symbols-outlined text-2xl ${statusStyle.text}`}>health_and_safety</span>
                        </div>
                        <div>
                            <p className={`text-xs font-bold uppercase tracking-wider ${statusStyle.text}`}>Başarı Durumu</p>
                            <p className={`text-2xl font-black leading-none mt-1 ${statusStyle.text}`}>{riskStatus}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="flex flex-col gap-2 rounded-2xl p-6 bg-white dark:bg-[#18212a] border border-[#e0e6ed] dark:border-[#202932] shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[#617589] dark:text-gray-400 text-sm font-bold uppercase tracking-wider">TYT Deneme Ort.</p>
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">analytics</span>
                        </div>
                    </div>
                    <div className="flex items-end gap-3">
                        <p className="text-[#111418] dark:text-white text-4xl font-black leading-none">{stats.tytAvg.toFixed(1)}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-2 rounded-2xl p-6 bg-white dark:bg-[#18212a] border border-[#e0e6ed] dark:border-[#202932] shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[#617589] dark:text-gray-400 text-sm font-bold uppercase tracking-wider">AYT Deneme Ort.</p>
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">query_stats</span>
                        </div>
                    </div>
                    <div className="flex items-end gap-3">
                        <p className="text-[#111418] dark:text-white text-4xl font-black leading-none">{stats.aytAvg.toFixed(1)}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-2 rounded-2xl p-6 bg-white dark:bg-[#18212a] border border-[#e0e6ed] dark:border-[#202932] shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[#617589] dark:text-gray-400 text-sm font-bold uppercase tracking-wider">Ortalama Net</p>
                        <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">functions</span>
                        </div>
                    </div>
                    <div className="flex items-end gap-3">
                        <p className="text-[#111418] dark:text-white text-4xl font-black leading-none">{stats.totalNetAvg.toFixed(2)}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-2 rounded-2xl p-6 bg-white dark:bg-[#18212a] border border-[#e0e6ed] dark:border-[#202932] shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <span className="material-symbols-outlined text-8xl">task_alt</span>
                    </div>
                    <div className="flex items-center justify-between mb-2 relative z-10">
                        <p className="text-[#617589] dark:text-gray-400 text-sm font-bold uppercase tracking-wider">Haftalık Görevler</p>
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">check_circle</span>
                        </div>
                    </div>
                    <div className="flex items-end gap-2 relative z-10">
                        <p className="text-[#111418] dark:text-white text-4xl font-black leading-none">{dashboardData?.stats?.task_success_rate ? Number(dashboardData.stats.task_success_rate).toFixed(0) : 0}%</p>
                        <p className="text-[#617589] dark:text-gray-400 text-xl font-medium mb-1">Tamamlandı</p>
                    </div>
                    <div className="mt-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 relative z-10">
                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${dashboardData?.stats?.task_success_rate || 0}%` }}></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 flex flex-col gap-8">

                    {/* Recent Exams */}
                    <div className="bg-white dark:bg-[#18212a] rounded-2xl border border-[#e0e6ed] dark:border-[#202932] p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[#111418] dark:text-white text-xl font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-orange-500">history_edu</span>
                                Son Sınavlarım
                            </h2>
                            <Link to="/student/sinavlarim" className="text-primary text-sm font-bold hover:underline">Tümünü Gör</Link>
                        </div>
                        <div className="flex flex-col gap-4">
                            {exams.slice(0, 3).map((exam) => (
                                <div key={exam.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm text-gray-900 dark:text-white font-bold text-lg w-12 h-12 flex items-center justify-center border border-gray-100 dark:border-gray-600">
                                            {exam.exam_type}
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#111418] dark:text-white">{exam.exam_name}</p>
                                            <p className="text-sm text-[#617589] dark:text-gray-400 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                                {new Date(exam.exam_date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-xl text-[#111418] dark:text-white">{parseFloat(exam.total_net).toFixed(2)}</p>
                                        <p className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full inline-block">Net</p>
                                    </div>
                                </div>
                            ))}
                            {exams.length === 0 && (
                                <p className="text-center text-gray-500 dark:text-gray-400 py-4">Henüz sınav kaydı bulunmamaktadır.</p>
                            )}
                        </div>
                    </div>

                    {/* Notifications (Static for now as API not requested to change yet, or use stats?) */}
                    {/* Keeping existing notifications section as is, or removing if it was mock? The previous code had hardcoded notifications. 
                        The stats query fetches 'unread_notifications' count. 
                        I'll leave the hardcoded ones for UI demo unless asked, but user said "Bildirimler... doğru çalışmıyor" 
                        Actually user said: "Başarı Puanı , Başarı Durumu , Ders Programı (Mevcut günün görevleri) , Bu Haftaki Toplantılar ... doğru çalışmıyor"
                        So I will fix Tasks (Ders Programı) and Meetings.
                    */}
                </div>

                {/* Right Column */}
                <div className="lg:col-span-1 flex flex-col gap-8">
                    {/* Ders Programı (Upcoming Tasks) */}
                    <div className="bg-white dark:bg-[#18212a] rounded-2xl border border-[#e0e6ed] dark:border-[#202932] p-6 shadow-sm sticky top-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[#111418] dark:text-white text-xl font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-purple-500">schedule</span>
                                Ders Programı
                            </h2>
                            <Link to="/student/ders-programi" className="text-primary text-sm font-bold hover:underline">Tümünü Gör</Link>
                        </div>
                        <div className="flex flex-col gap-6 relative">
                            {/* Timeline Line */}
                            <div className="absolute left-[60px] top-2 bottom-2 w-0.5 bg-gray-100 dark:bg-gray-700"></div>

                            {dashboardData?.upcomingTasks && dashboardData.upcomingTasks.length > 0 ? (
                                dashboardData.upcomingTasks.map((task, index) => {
                                    const getPriorityStyles = (p) => {
                                        if (!p) return { dot: 'bg-gray-500', bg: 'bg-gray-50 dark:bg-gray-900/10', border: 'border-gray-100 dark:border-gray-900/20' };

                                        // Normalize: lowercase & trim
                                        const priority = p.toString().trim().toLowerCase();

                                        if (priority.includes('yüksek') || priority.includes('yuksek') || priority.includes('high'))
                                            return { dot: 'bg-red-500', bg: 'bg-red-100 dark:bg-red-900/10', border: 'border-red-100 dark:border-red-900/20' };
                                        if (priority.includes('orta') || priority.includes('medium'))
                                            return { dot: 'bg-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/10', border: 'border-blue-100 dark:border-blue-900/20' };
                                        if (priority.includes('düşük') || priority.includes('dusuk') || priority.includes('low'))
                                            return { dot: 'bg-green-500', bg: 'bg-green-100 dark:bg-green-900/10', border: 'border-green-100 dark:border-green-900/20' };

                                        return { dot: 'bg-gray-500', bg: 'bg-gray-50 dark:bg-gray-900/10', border: 'border-gray-100 dark:border-gray-900/20' };
                                    };
                                    const styles = getPriorityStyles(task.priority);

                                    return (
                                        <div key={task.id} className="flex gap-4 relative">
                                            <div className="w-[45px] text-right shrink-0">
                                                <p className="text-[#111418] dark:text-white font-bold text-sm">
                                                    {new Date(task.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                                <p className="text-[#617589] dark:text-gray-500 text-xs">{new Date(task.deadline).toLocaleDateString()}</p>
                                            </div>
                                            <div className={`w-3 h-3 rounded-full ${styles.dot} border-2 border-white dark:border-[#18212a] absolute left-[55px] top-1.5 z-10 shadow-sm`}></div>
                                            <div className={`flex-1 ${styles.bg} p-3 rounded-xl border ${styles.border} hover:shadow-md transition-shadow cursor-pointer`}>
                                                <p className="font-bold text-[#111418] dark:text-white text-sm">
                                                    {task.title}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-gray-500 text-center text-sm">Yaklaşan görev bulunmamaktadır.</p>
                            )}
                        </div>
                    </div>

                    {/* This Week's Meetings */}
                    <div className="bg-white dark:bg-[#18212a] rounded-2xl border border-[#e0e6ed] dark:border-[#202932] p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[#111418] dark:text-white text-xl font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">calendar_month</span>
                                Bu Haftaki Toplantılar
                            </h2>
                            <Link to="/student/toplantilar" className="text-primary text-sm font-bold hover:underline">Tümünü Gör</Link>
                        </div>
                        <div className="flex flex-col gap-4">
                            {dashboardData?.weeklyMeetings && dashboardData.weeklyMeetings.length > 0 ? (
                                dashboardData.weeklyMeetings.map((meeting, index) => (
                                    <div key={meeting.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group">
                                        <div className={`p-3 rounded-xl bg-blue-100 text-blue-700 dark:bg-opacity-20`}>
                                            <span className="material-symbols-outlined">groups</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-[#111418] dark:text-white truncate">{meeting.title}</h3>
                                            <p className="text-xs text-[#617589] dark:text-gray-400 font-medium mt-0.5">{meeting.meeting_type}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-[#111418] dark:text-white text-sm">
                                                {new Date(meeting.meeting_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                            <p className="text-xs text-[#617589] dark:text-gray-400">{new Date(meeting.meeting_date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center text-sm">Bu hafta planlanmış toplantı yok.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomePage;
