import React, { useState, useEffect } from 'react';
import { getAuth } from '../../utils/authUtils';
import { getMeetingsByStudent } from '../../services/api';

const MeetingsPage = () => {
    const auth = getAuth();
    const studentId = auth?.user?.id;

    const [hoveredDay, setHoveredDay] = useState(null);
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [filter, setFilter] = useState('Tümünü Göster');

    // Meeting type colors
    const meetingTypeColors = {
        'Birebir Görüşme': 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        'Toplantı': 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
        'Canlı Ders': 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
        'Seminer': 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
        'Sosyal Etkinlik': 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    };

    useEffect(() => {
        if (studentId) {
            loadMeetings();
        }
    }, [studentId]);

    const loadMeetings = async () => {
        try {
            setLoading(true);
            const data = await getMeetingsByStudent(studentId);
            setMeetings(data);
        } catch (err) {
            console.error('Error loading meetings:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Get meetings for a specific day
    const getMeetingsForDay = (day) => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        return meetings.filter(meeting => {
            const meetingDate = new Date(meeting.meeting_date);
            return meetingDate.getFullYear() === year &&
                meetingDate.getMonth() === month &&
                meetingDate.getDate() === day;
        }).filter(meeting => {
            if (filter === 'Tümünü Göster') return true;
            return meeting.meeting_type === filter;
        });
    };

    // Format time from date string
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    };

    // Calculate end time based on duration
    const getTimeRange = (meeting) => {
        const startTime = formatTime(meeting.meeting_date);
        if (meeting.duration_minutes) {
            const endDate = new Date(new Date(meeting.meeting_date).getTime() + meeting.duration_minutes * 60000);
            const endTime = endDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
            return `${startTime} - ${endTime}`;
        }
        return startTime;
    };

    // Get color for meeting type
    const getMeetingColor = (type) => {
        return meetingTypeColors[type] || 'bg-gray-100 dark:bg-gray-900/40 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800';
    };

    // Calendar navigation
    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const goToDate = (dateString) => {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            setCurrentDate(date);
        }
    };

    // Get calendar data
    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        // Convert Sunday (0) to 7 for Monday-first calendar
        return firstDay === 0 ? 6 : firstDay - 1;
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Previous month days to fill the first week
    const prevMonthDays = (() => {
        const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        const prevMonthTotalDays = prevMonth.getDate();
        const daysNeeded = firstDayOfMonth;
        return Array.from({ length: daysNeeded }, (_, i) => prevMonthTotalDays - daysNeeded + i + 1);
    })();

    // Next month days to fill the last week
    const totalCells = prevMonthDays.length + days.length;
    const nextMonthDaysNeeded = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    const nextMonthDays = Array.from({ length: nextMonthDaysNeeded }, (_, i) => i + 1);

    // Format month name
    const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    const monthName = monthNames[currentDate.getMonth()];
    const year = currentDate.getFullYear();

    // Check if a day is today
    const today = new Date();
    const isToday = (day) => {
        return day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Bir hata oluştu</h2>
                <p className="text-gray-500 dark:text-gray-400">{error}</p>
                <button
                    onClick={loadMeetings}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    Tekrar Dene
                </button>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col gap-1 mb-8">
                <h1 className="text-[#111418] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Toplantılar</h1>
                <p className="text-[#617589] dark:text-gray-400 text-base font-normal leading-normal">Takvimini yönet ve yaklaşan görüşmelerini planla.</p>
            </div>

            <div className="bg-white dark:bg-[#18212a] rounded-2xl border border-[#e0e6ed] dark:border-[#202932] p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                            <button
                                onClick={goToPreviousMonth}
                                className="flex items-center justify-center size-8 rounded-md hover:bg-white dark:hover:bg-gray-700 shadow-sm transition-all"
                            >
                                <span className="material-symbols-outlined text-gray-600 dark:text-gray-300 text-sm">chevron_left</span>
                            </button>
                            <button
                                onClick={goToNextMonth}
                                className="flex items-center justify-center size-8 rounded-md hover:bg-white dark:hover:bg-gray-700 shadow-sm transition-all"
                            >
                                <span className="material-symbols-outlined text-gray-600 dark:text-gray-300 text-sm">chevron_right</span>
                            </button>
                        </div>
                        <h2 className="text-2xl font-bold text-[#111418] dark:text-white whitespace-nowrap">{monthName} {year}</h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">calendar_month</span>
                            </div>
                            <input
                                type="date"
                                onChange={(e) => goToDate(e.target.value)}
                                className="pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer"
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">filter_list</span>
                            </div>
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none appearance-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all"
                            >
                                <option>Tümünü Göster</option>
                                <option>Birebir Görüşme</option>
                                <option>Canlı Ders</option>
                                <option>Toplantı</option>
                                <option>Seminer</option>
                                <option>Sosyal Etkinlik</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-sm">expand_more</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((dayName) => (
                        <div key={dayName} className="bg-gray-50 dark:bg-gray-800/50 py-3 text-center text-sm font-semibold text-gray-500 dark:text-gray-400">
                            {dayName}
                        </div>
                    ))}

                    {prevMonthDays.map((day) => (
                        <div key={`prev-${day}`} className="bg-white dark:bg-[#18212a] min-h-[120px] p-2 text-gray-400/40 dark:text-gray-600/40 text-sm font-medium">
                            {day}
                        </div>
                    ))}

                    {days.map((day) => {
                        const dayMeetings = getMeetingsForDay(day);
                        const firstMeeting = dayMeetings[0];
                        const todayCheck = isToday(day);

                        return (
                            <div
                                key={day}
                                className={`bg-white dark:bg-[#18212a] min-h-[120px] p-2 relative group hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors ${todayCheck ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                                onMouseEnter={() => setHoveredDay(day)}
                                onMouseLeave={() => setHoveredDay(null)}
                            >
                                <span className={`text-sm font-medium inline-flex size-7 items-center justify-center rounded-full ${todayCheck ? 'bg-primary text-white shadow-sm' : 'text-gray-700 dark:text-gray-300'}`}>
                                    {day}
                                </span>

                                {firstMeeting && (
                                    <>
                                        <div className={`mt-2 p-2 rounded-lg border ${getMeetingColor(firstMeeting.meeting_type)} text-xs font-medium truncate cursor-pointer transition-transform hover:scale-[1.02]`}>
                                            {firstMeeting.meeting_type}
                                            {dayMeetings.length > 1 && (
                                                <span className="ml-1 text-[10px]">+{dayMeetings.length - 1}</span>
                                            )}
                                        </div>

                                        {/* Hover Popover */}
                                        <div className={`absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 transition-all duration-200 origin-bottom ${hoveredDay === day ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                                            {dayMeetings.map((meeting, index) => (
                                                <div key={meeting.id || index} className={`${index > 0 ? 'mt-3 pt-3 border-t border-gray-200 dark:border-gray-700' : ''}`}>
                                                    <div className="flex items-start justify-between mb-2">
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getMeetingColor(meeting.meeting_type).split(' ').slice(0, 2).join(' ')}`}>
                                                            {meeting.meeting_type}
                                                        </span>
                                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                                                            {getTimeRange(meeting)}
                                                        </span>
                                                    </div>
                                                    <h4 className="text-gray-900 dark:text-white font-bold text-sm mb-1">{meeting.title}</h4>
                                                    <p className="text-gray-500 dark:text-gray-400 text-xs mb-3 leading-relaxed">{meeting.description}</p>

                                                    {meeting.meeting_link && (
                                                        <a
                                                            href={meeting.meeting_link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-full bg-primary hover:bg-primary/90 text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                                                        >
                                                            <span className="material-symbols-outlined text-[16px]">video_camera_front</span>
                                                            Toplantıya Katıl
                                                        </a>
                                                    )}
                                                </div>
                                            ))}

                                            {/* Arrow */}
                                            <div className="absolute left-1/2 -translate-x-1/2 top-full w-3 h-3 bg-white dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-700 transform rotate-45 -mt-1.5"></div>
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}

                    {nextMonthDays.map((day) => (
                        <div key={`next-${day}`} className="bg-white dark:bg-[#18212a] min-h-[120px] p-2 text-gray-400/40 dark:text-gray-600/40 text-sm font-medium">
                            {day}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6 bg-white dark:bg-[#18212a] rounded-2xl border border-[#e0e6ed] dark:border-[#202932] p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-gray-400">info</span>
                    Açıklamalar
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {[
                        { label: 'Birebir Görüşme', color: 'bg-blue-500' },
                        { label: 'Canlı Ders', color: 'bg-green-500' },
                        { label: 'Toplantı', color: 'bg-purple-500' },
                        { label: 'Seminer', color: 'bg-teal-500' },
                        { label: 'Sosyal Etkinlik', color: 'bg-orange-500' },
                    ].map((item) => (
                        <div key={item.label} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <div className={`size-3 rounded-full ${item.color} ring-2 ring-white dark:ring-[#18212a] shadow-sm`}></div>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default MeetingsPage;