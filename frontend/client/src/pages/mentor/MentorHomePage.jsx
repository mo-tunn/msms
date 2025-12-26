import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getUpcomingMeetings, getMentorStudents } from '../../services/api';
import { getAuth } from '../../utils/authUtils';

const MentorHomePage = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState([
        { title: 'Toplam Öğrenci', value: '-', icon: 'groups', color: 'bg-blue-500' },
        { title: 'Yaklaşan Toplantılar', value: '-', icon: 'event', color: 'bg-purple-500' },
        { title: 'Bekleyen Görevler', value: '-', icon: 'pending_actions', color: 'bg-amber-500' },
    ]);
    const [upcomingMeetings, setUpcomingMeetings] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const auth = getAuth();
                if (!auth || !auth.user || !auth.user.id) return;

                const mentorId = auth.user.id;

                const [meetingsData, studentsData] = await Promise.all([
                    getUpcomingMeetings(mentorId),
                    getMentorStudents()
                ]);

                setUpcomingMeetings(meetingsData);
                setStudents(studentsData);

                setStats([
                    { title: 'Toplam Öğrenci', value: studentsData.length.toString(), icon: 'groups', color: 'bg-blue-500' },
                    { title: 'Yaklaşan Toplantılar', value: meetingsData.length.toString(), icon: 'event', color: 'bg-purple-500' },
                    { title: 'Bekleyen Görevler', value: '5', icon: 'pending_actions', color: 'bg-amber-500' }, // Todo: Fetch real task counts
                ]);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return { day: '-', time: '-' };
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return { day: '?', time: '?' };
        }
        return {
            day: date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
            time: date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        };
    };

    const quickActions = [
        { title: 'Ders Programı', icon: 'calendar_month', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20', path: '/mentor/ders-programi' },
        { title: 'Sınavlar', icon: 'quiz', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20', path: '/mentor/sinavlar' },
        { title: 'Toplantılar', icon: 'groups', color: 'text-red-600 bg-red-50 dark:bg-red-900/20', path: '/mentor/toplantilar' },
        { title: 'Bildirimler', icon: 'notifications', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20', path: '/mentor/bildirimler' },
        { title: 'Analizler', icon: 'monitoring', color: 'text-green-600 bg-green-50 dark:bg-green-900/20', path: '/mentor/analizler/genel' },
    ];

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">MSMS Mentor Ana Sayfa</h1>
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
                {/* Left Column - Schedule */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Upcoming Schedule */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Yaklaşan Program</h2>
                            <NavLink to="/mentor/toplantilar" className="text-sm text-primary hover:underline">Tümünü Gör</NavLink>
                        </div>
                        <div className="space-y-3">
                            {upcomingMeetings.length > 0 ? (
                                upcomingMeetings.slice(0, 3).map((meeting) => {
                                    const studentName = meeting.participants && meeting.participants.length > 0
                                        ? `${meeting.participants[0].first_name} ${meeting.participants[0].last_name}`
                                        : 'Bilinmeyen Öğrenci';
                                    const { day, time } = formatDate(meeting.meetingDate);

                                    return (
                                        <div key={meeting.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700">
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-sm">
                                                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                                                        {day}
                                                    </span>
                                                    <span className="text-xs text-gray-400 dark:text-gray-500">
                                                        {time}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{studentName}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{meeting.title}</p>
                                                </div>
                                            </div>
                                            <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 transition-colors">
                                                <span className="material-symbols-outlined">videocam</span>
                                            </button>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-center text-gray-500 py-4">Yaklaşan toplantı bulunmamaktadır.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Quick Access */}
                <div className="space-y-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Hızlı Erişim</h2>
                        <div className="space-y-3">
                            {students.length > 0 ? (
                                students.slice(0, 5).map((student, i) => {
                                    const studentName = `${student.first_name} ${student.last_name}`;
                                    return (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors cursor-pointer"
                                            onClick={() => navigate('/mentor/analizler/genel', { state: { selectedStudentId: student.id } })}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                                                    {student.first_name ? student.first_name.charAt(0) : '?'}
                                                </div>
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">{studentName}</span>
                                            </div>
                                            <button className="text-gray-400 hover:text-primary transition-colors">
                                                <span className="material-symbols-outlined text-xl">arrow_forward</span>
                                            </button>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-center text-gray-500 py-4">Öğrenci bulunamadı.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorHomePage;
