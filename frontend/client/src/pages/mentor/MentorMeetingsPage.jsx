import React, { useState } from 'react';

const MentorMeetingsPage = () => {
    const students = [
        { id: '1', name: 'Ahmet Yılmaz' },
        { id: '2', name: 'Ayşe Demir' },
        { id: '3', name: 'Mehmet Kaya' },
        { id: '4', name: 'Zeynep Çelik' },
        { id: '5', name: 'Can Yıldız' },
        { id: '6', name: 'Elif Öztürk' },
    ];

    const meetingTypes = [
        { label: 'Birebir Görüşme', color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
        { label: 'Canlı Ders', color: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' },
        { label: 'Toplantı', color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' },
        { label: 'Seminer', color: 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800' },
        { label: 'Sosyal Etkinlik', color: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800' },
    ];

    const [meetings, setMeetings] = useState([
        {
            id: 1,
            title: 'Haftalık Değerlendirme',
            students: ['Ahmet Yılmaz'],
            date: '2023-11-26',
            time: '14:00',
            type: 'Birebir Görüşme',
            desc: 'Geçen haftanın deneme analizleri ve yeni program.',
            link: 'https://meet.google.com/abc-defg-hij',
            color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
        },
        {
            id: 2,
            title: 'Deneme Analizi',
            students: ['Ayşe Demir'],
            date: '2023-11-27',
            time: '16:30',
            type: 'Toplantı',
            desc: 'Son denemenin detaylı analizi.',
            link: '',
            color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
        },
    ]);

    // Calendar State
    const [currentDate, setCurrentDate] = useState(new Date());
    const [hoveredDay, setHoveredDay] = useState(null);

    // Form State
    const [title, setTitle] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [type, setType] = useState(meetingTypes[0].label);
    const [desc, setDesc] = useState('');
    const [link, setLink] = useState('');

    // Calendar Logic
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => {
        const day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1; // Adjust for Monday start
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const prevMonthDays = getDaysInMonth(year, month - 1);

    const calendarDays = [];
    // Prev Month Padding
    for (let i = 0; i < firstDay; i++) {
        calendarDays.push({ day: prevMonthDays - firstDay + i + 1, type: 'prev' });
    }
    // Current Month
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push({ day: i, type: 'current' });
    }
    // Next Month Padding
    const remainingCells = 42 - calendarDays.length;
    for (let i = 1; i <= remainingCells; i++) {
        calendarDays.push({ day: i, type: 'next' });
    }

    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const handleStudentToggle = (studentId) => {
        setSelectedStudents(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleCreateMeeting = (e) => {
        e.preventDefault();

        if (selectedStudents.length === 0) {
            alert('Lütfen en az bir öğrenci seçin.');
            return;
        }

        const selectedStudentNames = students
            .filter(s => selectedStudents.includes(s.id))
            .map(s => s.name);

        const selectedType = meetingTypes.find(t => t.label === type);

        const newMeeting = {
            id: Date.now(),
            title,
            students: selectedStudentNames,
            date,
            time,
            type,
            desc,
            link,
            color: selectedType.color
        };

        setMeetings([...meetings, newMeeting]);
        alert('Toplantı başarıyla oluşturuldu!');

        // Reset Form
        setTitle('');
        setSelectedStudents([]);
        setDate('');
        setTime('');
        setDesc('');
        setLink('');
    };

    const getMeetingsForDay = (day) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return meetings.filter(m => m.date === dateStr);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Toplantı Yönetimi</h1>
                <p className="text-gray-500 dark:text-gray-400">Yeni toplantı oluşturun ve takviminizi yönetin.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Create Meeting Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm sticky top-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Yeni Toplantı Oluştur</h2>
                        <form onSubmit={handleCreateMeeting} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Başlık</label>
                                <input
                                    required
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    placeholder="Örn: Haftalık Görüşme"
                                />
                            </div>

                            {/* Multi-select Students */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Alıcılar (Öğrenciler)</label>
                                <div className="max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-gray-50 dark:bg-gray-700/30">
                                    {students.map(student => (
                                        <label key={student.id} className="flex items-center gap-2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedStudents.includes(student.id)}
                                                onChange={() => handleStudentToggle(student.id)}
                                                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">{student.name}</span>
                                        </label>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{selectedStudents.length} öğrenci seçildi</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tarih</label>
                                    <input
                                        required
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Saat</label>
                                    <input
                                        required
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Görüşme Tipi</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                >
                                    {meetingTypes.map(t => (
                                        <option key={t.label} value={t.label}>{t.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Açıklama</label>
                                <textarea
                                    rows="3"
                                    value={desc}
                                    onChange={(e) => setDesc(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                                    placeholder="Toplantı içeriği hakkında kısa bilgi..."
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Toplantı Linki (Opsiyonel)</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-gray-500 text-sm">link</span>
                                    </span>
                                    <input
                                        type="url"
                                        value={link}
                                        onChange={(e) => setLink(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent pl-9 pr-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        placeholder="https://meet.google.com/..."
                                    />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2">
                                <span className="material-symbols-outlined">add_box</span>
                                Toplantı Oluştur
                            </button>
                        </form>
                    </div>
                </div>

                {/* Calendar View */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-[#18212a] rounded-2xl border border-[#e0e6ed] dark:border-[#202932] shadow-sm p-6">
                        {/* Calendar Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                                    <button onClick={handlePrevMonth} className="flex items-center justify-center size-8 rounded-md hover:bg-white dark:hover:bg-gray-700 shadow-sm transition-all">
                                        <span className="material-symbols-outlined text-gray-600 dark:text-gray-300 text-sm">chevron_left</span>
                                    </button>
                                    <button onClick={handleNextMonth} className="flex items-center justify-center size-8 rounded-md hover:bg-white dark:hover:bg-gray-700 shadow-sm transition-all">
                                        <span className="material-symbols-outlined text-gray-600 dark:text-gray-300 text-sm">chevron_right</span>
                                    </button>
                                </div>
                                <h2 className="text-2xl font-bold text-[#111418] dark:text-white whitespace-nowrap">
                                    {currentDate.toLocaleString('tr-TR', { month: 'long', year: 'numeric' })}
                                </h2>
                            </div>
                            <button className="text-primary text-sm font-medium hover:underline" onClick={() => setCurrentDate(new Date())}>
                                Bugün
                            </button>
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                            {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day) => (
                                <div key={day} className="bg-gray-50 dark:bg-gray-800/50 py-3 text-center text-sm font-semibold text-gray-500 dark:text-gray-400">
                                    {day}
                                </div>
                            ))}

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
                                        className={`bg-white dark:bg-[#18212a] min-h-[120px] p-2 relative group hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors ${!isCurrentMonth ? 'opacity-40' : ''} ${isToday ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                                        onMouseEnter={() => isCurrentMonth && setHoveredDay(item.day)}
                                        onMouseLeave={() => setHoveredDay(null)}
                                    >
                                        <span className={`text-sm font-medium inline-flex size-7 items-center justify-center rounded-full ${isToday ? 'bg-primary text-white shadow-sm' : 'text-gray-700 dark:text-gray-300'}`}>
                                            {item.day}
                                        </span>

                                        <div className="mt-1 space-y-1">
                                            {dayMeetings.map((meeting) => (
                                                <div
                                                    key={meeting.id}
                                                    className={`mt-2 p-2 rounded-lg border ${meeting.color} text-xs font-medium truncate cursor-pointer transition-transform hover:scale-[1.02]`}
                                                >
                                                    {meeting.title}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Hover Popover for Day */}
                                        {isCurrentMonth && hoveredDay === item.day && dayMeetings.length > 0 && (
                                            <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 transition-all duration-200 origin-bottom">
                                                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 border-b border-gray-100 dark:border-gray-700 pb-2">
                                                    {item.day} {currentDate.toLocaleString('tr-TR', { month: 'long' })}
                                                </h4>
                                                <div className="space-y-3">
                                                    {dayMeetings.map(meeting => (
                                                        <div key={meeting.id} className="relative">
                                                            <div className="flex items-start justify-between mb-1">
                                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${meeting.color.split(' ')[0]} ${meeting.color.split(' ')[1]}`}>
                                                                    {meeting.type}
                                                                </span>
                                                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                                                                    {meeting.time}
                                                                </span>
                                                            </div>
                                                            <h4 className="text-gray-900 dark:text-white font-bold text-sm mb-1">{meeting.title}</h4>
                                                            <p className="text-gray-500 dark:text-gray-400 text-xs mb-2 leading-relaxed line-clamp-2">{meeting.desc}</p>
                                                            <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                                                                <span className="material-symbols-outlined text-[14px]">group</span>
                                                                {meeting.students.join(', ')}
                                                            </p>

                                                            {meeting.link && (
                                                                <a
                                                                    href={meeting.link}
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
                                                </div>
                                                <div className="absolute left-1/2 -translate-x-1/2 top-full w-3 h-3 bg-white dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-700 transform rotate-45 -mt-1.5"></div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorMeetingsPage;
