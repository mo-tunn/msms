import React, { useState } from 'react';

const MeetingsPage = () => {
    const [hoveredDay, setHoveredDay] = useState(null);

    // Mock data for meetings
    const meetings = {
        2: { type: 'Birebir Görüşme', title: 'Haftalık Değerlendirme', desc: 'Geçen haftanın deneme analizleri ve yeni program.', time: '14:00 - 15:00', link: '#', color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
        5: { type: 'Toplantı', title: 'Veli Toplantısı', desc: 'Genel durum değerlendirmesi.', time: '19:00 - 20:00', link: '#', color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' },
        9: { type: 'Canlı Ders', title: 'Matematik Soru Çözümü', desc: 'Türev konusu soru çözümü.', time: '20:00 - 21:30', link: '#', color: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' },
        11: { type: 'Birebir Görüşme', title: 'Motivasyon Görüşmesi', desc: 'Sınav kaygısı üzerine konuşma.', time: '16:00 - 16:45', link: '#', color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
        14: { type: 'Sosyal Etkinlik', title: 'Film Gecesi', desc: 'Öğrencilerle film izleme etkinliği.', time: '21:00 - 23:00', link: null, color: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800' },
        17: { type: 'Birebir Görüşme', title: 'Program Kontrolü', desc: 'Haftalık programın revizesi.', time: '15:00 - 15:30', link: '#', color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
        19: { type: 'Seminer', title: 'Verimli Ders Çalışma', desc: 'Uzman psikolog eşliğinde seminer.', time: '18:00 - 19:30', link: '#', color: 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800' },
        24: { type: 'Birebir Görüşme', title: 'Deneme Analizi', desc: 'Son denemenin detaylı analizi.', time: '14:00 - 15:00', link: '#', color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
        26: { type: 'Toplantı', title: 'Grup Çalışması', desc: 'Fizik çalışma grubu.', time: '17:00 - 18:30', link: '#', color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' },
        30: { type: 'Canlı Ders', title: 'Geometri Kampı', desc: 'Üçgenler genel tekrar.', time: '10:00 - 13:00', link: '#', color: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' },
    };

    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const prevMonthDays = [25, 26, 27, 28, 29, 30];
    const nextMonthDays = [1, 2, 3, 4];

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
                            <button className="flex items-center justify-center size-8 rounded-md hover:bg-white dark:hover:bg-gray-700 shadow-sm transition-all">
                                <span className="material-symbols-outlined text-gray-600 dark:text-gray-300 text-sm">chevron_left</span>
                            </button>
                            <button className="flex items-center justify-center size-8 rounded-md hover:bg-white dark:hover:bg-gray-700 shadow-sm transition-all">
                                <span className="material-symbols-outlined text-gray-600 dark:text-gray-300 text-sm">chevron_right</span>
                            </button>
                        </div>
                        <h2 className="text-2xl font-bold text-[#111418] dark:text-white whitespace-nowrap">Aralık 2024</h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">calendar_month</span>
                            </div>
                            <input
                                type="date"
                                className="pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer"
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">filter_list</span>
                            </div>
                            <select className="pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none appearance-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all">
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
                    {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day) => (
                        <div key={day} className="bg-gray-50 dark:bg-gray-800/50 py-3 text-center text-sm font-semibold text-gray-500 dark:text-gray-400">
                            {day}
                        </div>
                    ))}

                    {prevMonthDays.map((day) => (
                        <div key={`prev-${day}`} className="bg-white dark:bg-[#18212a] min-h-[120px] p-2 text-gray-400/40 dark:text-gray-600/40 text-sm font-medium">
                            {day}
                        </div>
                    ))}

                    {days.map((day) => {
                        const meeting = meetings[day];
                        const isToday = day === 25;

                        return (
                            <div
                                key={day}
                                className={`bg-white dark:bg-[#18212a] min-h-[120px] p-2 relative group hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors ${isToday ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                                onMouseEnter={() => setHoveredDay(day)}
                                onMouseLeave={() => setHoveredDay(null)}
                            >
                                <span className={`text-sm font-medium inline-flex size-7 items-center justify-center rounded-full ${isToday ? 'bg-primary text-white shadow-sm' : 'text-gray-700 dark:text-gray-300'}`}>
                                    {day}
                                </span>

                                {meeting && (
                                    <>
                                        <div className={`mt-2 p-2 rounded-lg border ${meeting.color} text-xs font-medium truncate cursor-pointer transition-transform hover:scale-[1.02]`}>
                                            {meeting.type}
                                        </div>

                                        {/* Hover Popover */}
                                        <div className={`absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 transition-all duration-200 origin-bottom ${hoveredDay === day ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                                            <div className="flex items-start justify-between mb-2">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${meeting.color.split(' ')[0]} ${meeting.color.split(' ')[1]}`}>
                                                    {meeting.type}
                                                </span>
                                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                                                    {meeting.time}
                                                </span>
                                            </div>
                                            <h4 className="text-gray-900 dark:text-white font-bold text-sm mb-1">{meeting.title}</h4>
                                            <p className="text-gray-500 dark:text-gray-400 text-xs mb-3 leading-relaxed">{meeting.desc}</p>

                                            {meeting.link && (
                                                <button className="w-full bg-primary hover:bg-primary/90 text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                                                    <span className="material-symbols-outlined text-[16px]">video_camera_front</span>
                                                    Toplantıya Katıl
                                                </button>
                                            )}

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
