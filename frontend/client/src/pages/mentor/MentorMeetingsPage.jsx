import React, { useState, useEffect } from 'react';
import { getAuth } from '../../utils/authUtils';
import {
    createMeeting,
    getMeetingsByMentor,
    deleteMeeting,
    updateMeeting,
    getStudentsByMentor
} from '../../services/api';

const MentorMeetingsPage = () => {
    const auth = getAuth();
    const mentorId = auth?.user?.id;

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const meetingTypes = [
        { label: 'Birebir Görüşme', color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800', dotColor: 'bg-blue-500' },
        { label: 'Canlı Ders', color: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800', dotColor: 'bg-green-500' },
        { label: 'Toplantı', color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800', dotColor: 'bg-purple-500' },
        { label: 'Seminer', color: 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800', dotColor: 'bg-teal-500' },
        { label: 'Sosyal Etkinlik', color: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800', dotColor: 'bg-orange-500' },
    ];

    const [meetings, setMeetings] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedMeeting, setSelectedMeeting] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState('month'); // 'month' or 'list'
    const [filterType, setFilterType] = useState('all');

    // Form State
    const [title, setTitle] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [type, setType] = useState(meetingTypes[0].label);
    const [desc, setDesc] = useState('');
    const [link, setLink] = useState('');

    // Load students and meetings on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                const studentsData = await getStudentsByMentor(mentorId);
                setStudents(studentsData.map(s => ({
                    id: s.user_id?.toString() || s.id?.toString(),
                    name: `${s.first_name} ${s.last_name}`
                })));

                const meetingsData = await getMeetingsByMentor(mentorId);
                const formattedMeetings = meetingsData.map(m => {
                    const meetingDate = new Date(m.meetingDate);
                    const selectedType = meetingTypes.find(t => t.label === m.meetingType) || meetingTypes[0];

                    return {
                        id: m.id,
                        title: m.title,
                        students: m.participants?.map(p => `${p.first_name} ${p.last_name}`) || [],
                        studentIds: m.participants?.map(p => p.student_id?.toString()) || [],
                        date: meetingDate.toISOString().split('T')[0],
                        time: meetingDate.toTimeString().slice(0, 5),
                        type: m.meetingType,
                        desc: m.notes || '',
                        link: m.meetingLink || '',
                        color: selectedType.color,
                        dotColor: selectedType.dotColor
                    };
                });
                setMeetings(formattedMeetings);

            } catch (err) {
                console.error('Error loading data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (mentorId) {
            loadData();
        }
    }, [mentorId]);

    // Calendar Logic
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => {
        const day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1;
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const prevMonthDays = getDaysInMonth(year, month - 1);

    const calendarDays = [];
    for (let i = 0; i < firstDay; i++) {
        calendarDays.push({ day: prevMonthDays - firstDay + i + 1, type: 'prev' });
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push({ day: i, type: 'current' });
    }
    const remainingCells = 42 - calendarDays.length;
    for (let i = 1; i <= remainingCells; i++) {
        calendarDays.push({ day: i, type: 'next' });
    }

    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const handleToday = () => setCurrentDate(new Date());

    const handleStudentToggle = (studentId) => {
        setSelectedStudents(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const resetForm = () => {
        setTitle('');
        setSelectedStudents([]);
        setDate('');
        setTime('');
        setDesc('');
        setLink('');
        setType(meetingTypes[0].label);
    };

    const handleCreateMeeting = async (e) => {
        e.preventDefault();

        if (selectedStudents.length === 0) {
            alert('Lütfen en az bir öğrenci seçin.');
            return;
        }

        try {
            setSubmitting(true);
            const meetingDateTime = new Date(`${date}T${time}`);

            const meetingData = {
                mentorId: parseInt(mentorId),
                meetingDate: meetingDateTime.toISOString(),
                title,
                meetingType: type,
                notes: desc,
                meetingLink: link,
                studentIds: selectedStudents.map(id => parseInt(id))
            };

            const createdMeeting = await createMeeting(meetingData);

            const selectedType = meetingTypes.find(t => t.label === type);
            const selectedStudentNames = students
                .filter(s => selectedStudents.includes(s.id))
                .map(s => s.name);

            const newMeeting = {
                id: createdMeeting.id,
                title,
                students: selectedStudentNames,
                studentIds: selectedStudents,
                date,
                time,
                type,
                desc,
                link,
                color: selectedType.color,
                dotColor: selectedType.dotColor
            };

            setMeetings([...meetings, newMeeting]);
            resetForm();
            setIsModalOpen(false);
            alert('Toplantı başarıyla oluşturuldu!');

        } catch (err) {
            console.error('Create meeting error:', err);
            alert('Toplantı oluşturulurken bir hata oluştu: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteMeeting = async (meetingId) => {
        if (!window.confirm('Bu toplantıyı silmek istediğinize emin misiniz?')) {
            return;
        }

        try {
            await deleteMeeting(meetingId);
            setMeetings(meetings.filter(m => m.id !== meetingId));
            setSelectedMeeting(null);
        } catch (err) {
            console.error('Delete meeting error:', err);
            alert('Toplantı silinirken bir hata oluştu: ' + err.message);
        }
    };

    const getMeetingsForDay = (day) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        let filtered = meetings.filter(m => m.date === dateStr);
        if (filterType !== 'all') {
            filtered = filtered.filter(m => m.type === filterType);
        }
        return filtered;
    };

    const getFilteredMeetings = () => {
        let filtered = [...meetings];
        if (filterType !== 'all') {
            filtered = filtered.filter(m => m.type === filterType);
        }
        return filtered.sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));
    };

    const getUpcomingMeetings = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return getFilteredMeetings().filter(m => new Date(m.date) >= today).slice(0, 5);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="text-gray-500 dark:text-gray-400">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center">
                <span className="material-symbols-outlined text-red-500 text-5xl mb-3">error</span>
                <h3 className="text-lg font-bold text-red-700 dark:text-red-300 mb-2">Bir Hata Oluştu</h3>
                <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
        );
    }

    return (
        <>
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Toplantı Yönetimi
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        Toplantılarınızı planlayın ve yönetin
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Filter */}
                    <div className="relative">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="h-10 pl-10 pr-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none appearance-none cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
                        >
                            <option value="all">Tümü</option>
                            {meetingTypes.map(t => (
                                <option key={t.label} value={t.label}>{t.label}</option>
                            ))}
                        </select>
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">filter_list</span>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">expand_more</span>
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm border border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setViewMode('month')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'month' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                            <span className="material-symbols-outlined text-xl">calendar_view_month</span>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                            <span className="material-symbols-outlined text-xl">view_list</span>
                        </button>
                    </div>

                    {/* Add Meeting Button */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all active:scale-95"
                    >
                        <span className="material-symbols-outlined text-xl">add</span>
                        <span className="text-sm font-semibold hidden sm:inline">Toplantı Ekle</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Sidebar - Upcoming Meetings */}
                <div className="xl:col-span-1 order-2 xl:order-1">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 sticky top-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">upcoming</span>
                            Yaklaşan Toplantılar
                        </h3>

                        {getUpcomingMeetings().length === 0 ? (
                            <div className="text-center py-8">
                                <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600 mb-2">event_busy</span>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Yaklaşan toplantı yok</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {getUpcomingMeetings().map(meeting => (
                                    <div
                                        key={meeting.id}
                                        onClick={() => setSelectedMeeting(meeting)}
                                        className={`p-3 rounded-xl border cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] ${meeting.color}`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{meeting.type}</span>
                                            <span className="text-xs font-medium flex items-center gap-1 opacity-70">
                                                <span className="material-symbols-outlined text-[12px]">schedule</span>
                                                {meeting.time}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-sm mb-1 line-clamp-1">{meeting.title}</h4>
                                        <p className="text-xs opacity-70">
                                            {new Date(meeting.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Legend */}
                        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">info</span>
                                Açıklamalar
                            </h4>
                            <div className="space-y-2">
                                {meetingTypes.map(item => (
                                    <div key={item.label} className="flex items-center gap-2">
                                        <div className={`size-2.5 rounded-full ${item.dotColor}`}></div>
                                        <span className="text-xs text-gray-600 dark:text-gray-400">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Calendar/List Area */}
                <div className="xl:col-span-3 order-1 xl:order-2">
                    {viewMode === 'month' ? (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                            {/* Calendar Header */}
                            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                                            <button
                                                onClick={handlePrevMonth}
                                                className="p-2 rounded-lg hover:bg-white dark:hover:bg-gray-600 transition-all"
                                            >
                                                <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">chevron_left</span>
                                            </button>
                                            <button
                                                onClick={handleToday}
                                                className="px-3 py-1.5 rounded-lg hover:bg-white dark:hover:bg-gray-600 transition-all text-sm font-medium text-gray-600 dark:text-gray-300"
                                            >
                                                Bugün
                                            </button>
                                            <button
                                                onClick={handleNextMonth}
                                                className="p-2 rounded-lg hover:bg-white dark:hover:bg-gray-600 transition-all"
                                            >
                                                <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">chevron_right</span>
                                            </button>
                                        </div>
                                        <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white capitalize">
                                            {currentDate.toLocaleString('tr-TR', { month: 'long', year: 'numeric' })}
                                        </h2>
                                    </div>

                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {meetings.length} toplantı
                                    </div>
                                </div>
                            </div>

                            {/* Calendar Grid */}
                            <div className="p-2 sm:p-4">
                                {/* Day Headers */}
                                <div className="grid grid-cols-7 mb-2">
                                    {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day, i) => (
                                        <div key={day} className={`py-3 text-center text-xs sm:text-sm font-semibold ${i >= 5 ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                            <span className="hidden sm:inline">{day}</span>
                                            <span className="sm:hidden">{day.charAt(0)}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar Days */}
                                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                                    {calendarDays.map((item, index) => {
                                        const isCurrentMonth = item.type === 'current';
                                        const dayMeetings = isCurrentMonth ? getMeetingsForDay(item.day) : [];
                                        const isToday = isCurrentMonth &&
                                            item.day === new Date().getDate() &&
                                            month === new Date().getMonth() &&
                                            year === new Date().getFullYear();

                                        return (
                                            <div
                                                key={index}
                                                className={`
                                                    min-h-[80px] sm:min-h-[100px] lg:min-h-[120px] p-1 sm:p-2 rounded-xl transition-all
                                                    ${isCurrentMonth
                                                        ? 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                                        : 'bg-transparent opacity-40'
                                                    }
                                                    ${isToday ? 'ring-2 ring-primary bg-primary/5 dark:bg-primary/10' : ''}
                                                `}
                                            >
                                                <span className={`
                                                    text-xs sm:text-sm font-medium inline-flex size-6 sm:size-7 items-center justify-center rounded-full mb-1
                                                    ${isToday
                                                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                                        : isCurrentMonth
                                                            ? 'text-gray-700 dark:text-gray-300'
                                                            : 'text-gray-400'
                                                    }
                                                `}>
                                                    {item.day}
                                                </span>

                                                <div className="space-y-1">
                                                    {dayMeetings.slice(0, 2).map((meeting) => (
                                                        <div
                                                            key={meeting.id}
                                                            onClick={() => setSelectedMeeting(meeting)}
                                                            className={`
                                                                p-1 sm:p-1.5 rounded-lg border text-[10px] sm:text-xs font-medium 
                                                                truncate cursor-pointer transition-all hover:scale-105 
                                                                ${meeting.color}
                                                            `}
                                                        >
                                                            <span className="hidden sm:inline">{meeting.title}</span>
                                                            <span className="sm:hidden">{meeting.time}</span>
                                                        </div>
                                                    ))}
                                                    {dayMeetings.length > 2 && (
                                                        <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium pl-1">
                                                            +{dayMeetings.length - 2} daha
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* List View */
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Tüm Toplantılar</h2>
                            </div>

                            {getFilteredMeetings().length === 0 ? (
                                <div className="p-12 text-center">
                                    <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-3">calendar_month</span>
                                    <p className="text-gray-500 dark:text-gray-400">Henüz toplantı bulunmuyor</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {getFilteredMeetings().map(meeting => (
                                        <div
                                            key={meeting.id}
                                            onClick={() => setSelectedMeeting(meeting)}
                                            className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-all"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                                {/* Date Badge */}
                                                <div className="flex-shrink-0 w-16 text-center">
                                                    <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-2">
                                                        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                                                            {new Date(meeting.date).toLocaleDateString('tr-TR', { month: 'short' })}
                                                        </div>
                                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                                            {new Date(meeting.date).getDate()}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${meeting.color}`}>
                                                            {meeting.type}
                                                        </span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                                                            {meeting.time}
                                                        </span>
                                                    </div>
                                                    <h4 className="font-bold text-gray-900 dark:text-white mb-1 truncate">{meeting.title}</h4>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[16px]">group</span>
                                                        {meeting.students.join(', ') || 'Katılımcı yok'}
                                                    </p>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2">
                                                    {meeting.link && (
                                                        <a
                                                            href={meeting.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="p-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all"
                                                        >
                                                            <span className="material-symbols-outlined">videocam</span>
                                                        </a>
                                                    )}
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteMeeting(meeting.id); }}
                                                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                                    >
                                                        <span className="material-symbols-outlined">delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Meeting Detail Modal */}
            {selectedMeeting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setSelectedMeeting(null)}>
                    <div
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={`p-6 ${selectedMeeting.color}`}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wider opacity-80">{selectedMeeting.type}</span>
                                    <h3 className="text-xl font-bold mt-1">{selectedMeeting.title}</h3>
                                </div>
                                <button
                                    onClick={() => setSelectedMeeting(null)}
                                    className="p-1 rounded-lg hover:bg-black/10 transition-colors"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                <span className="material-symbols-outlined">calendar_today</span>
                                <span>{new Date(selectedMeeting.date).toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                <span className="material-symbols-outlined">schedule</span>
                                <span>{selectedMeeting.time}</span>
                            </div>
                            <div className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                                <span className="material-symbols-outlined">group</span>
                                <span>{selectedMeeting.students.join(', ') || 'Katılımcı yok'}</span>
                            </div>
                            {selectedMeeting.desc && (
                                <div className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                                    <span className="material-symbols-outlined">description</span>
                                    <span>{selectedMeeting.desc}</span>
                                </div>
                            )}
                        </div>

                        <div className="p-6 pt-0 flex gap-3">
                            {selectedMeeting.link && (
                                <a
                                    href={selectedMeeting.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined">video_camera_front</span>
                                    Toplantıya Katıl
                                </a>
                            )}
                            <button
                                onClick={() => handleDeleteMeeting(selectedMeeting.id)}
                                className="px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold transition-colors flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined">delete</span>
                                Sil
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Meeting Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Yeni Toplantı Oluştur</h3>
                            <button
                                onClick={() => { setIsModalOpen(false); resetForm(); }}
                                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleCreateMeeting} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Başlık</label>
                                <input
                                    required
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    placeholder="Örn: Haftalık Görüşme"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Katılımcılar</label>
                                <div className="max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-xl p-3 bg-gray-50 dark:bg-gray-700/30 space-y-1">
                                    {students.length === 0 ? (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-3">Henüz öğrenci atanmamış</p>
                                    ) : (
                                        students.map(student => (
                                            <label
                                                key={student.id}
                                                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${selectedStudents.includes(student.id)
                                                    ? 'bg-primary/10 dark:bg-primary/20'
                                                    : 'hover:bg-gray-100 dark:hover:bg-gray-600'
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedStudents.includes(student.id)}
                                                    onChange={() => handleStudentToggle(student.id)}
                                                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                />
                                                <span className="text-sm text-gray-700 dark:text-gray-300">{student.name}</span>
                                            </label>
                                        ))
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">{selectedStudents.length} öğrenci seçildi</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tarih</label>
                                    <input
                                        required
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Saat</label>
                                    <input
                                        required
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Toplantı Tipi</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                >
                                    {meetingTypes.map(t => (
                                        <option key={t.label} value={t.label}>{t.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Açıklama</label>
                                <textarea
                                    rows="3"
                                    value={desc}
                                    onChange={(e) => setDesc(e.target.value)}
                                    className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                    placeholder="Toplantı içeriği hakkında kısa bilgi..."
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Toplantı Linki (Opsiyonel)</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-gray-400">link</span>
                                    </span>
                                    <input
                                        type="url"
                                        value={link}
                                        onChange={(e) => setLink(e.target.value)}
                                        className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 pl-12 pr-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        placeholder="https://meet.google.com/..."
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => { setIsModalOpen(false); resetForm(); }}
                                    className="flex-1 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold transition-all"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Oluşturuluyor...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined">add</span>
                                            Oluştur
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default MentorMeetingsPage;
