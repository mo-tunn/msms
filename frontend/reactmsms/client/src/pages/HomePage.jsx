import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    // Mock Data for Current Student (Emre) - Consistent with UI
    const studentData = {
        tasksCompleted: 12,
        tasksIncomplete: 3, // 15 total - 12 completed
        streak: 7, // Assumed
        examTrend: 'increasing' // Assumed
    };

    // Success Metric Calculation Logic (Same as MentorAnalyticsPage)
    const calculateSuccessMetric = (student) => {
        let score = (student.tasksCompleted * 1) - (student.tasksIncomplete * 2) + (student.streak * 5);
        if (student.examTrend === 'increasing') score += 20;
        else if (student.examTrend === 'stable') score += 10;
        else if (student.examTrend === 'decreasing') score -= 10;
        return score;
    };

    const getSuccessStatus = (score) => {
        if (score < 0) return { label: 'Çok Riskli', color: 'bg-red-500', text: 'text-red-500', bg: 'bg-red-500/10' };
        if (score >= 0 && score <= 30) return { label: 'Riskli', color: 'bg-orange-500', text: 'text-orange-500', bg: 'bg-orange-500/10' };
        if (score > 30 && score <= 60) return { label: 'Dengeli', color: 'bg-yellow-500', text: 'text-yellow-500', bg: 'bg-yellow-500/10' };
        if (score > 60 && score <= 90) return { label: 'Yükselişte', color: 'bg-green-500', text: 'text-green-500', bg: 'bg-green-500/10' };
        if (score > 90) return { label: 'Çok Yükselişte', color: 'bg-purple-600', text: 'text-purple-600', bg: 'bg-purple-600/10' };
        return { label: 'Bilinmiyor', color: 'bg-gray-500', text: 'text-gray-500', bg: 'bg-gray-500/10' };
    };

    const successScore = calculateSuccessMetric(studentData);
    const successStatus = getSuccessStatus(successScore);

    return (
        <>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8">
                <div className="flex min-w-72 flex-col gap-2">
                    <h1 className="text-[#111418] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Merhaba, Emre!</h1>
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
                    <div className={`flex items-center gap-4 p-4 rounded-2xl border border-[#e0e6ed] dark:border-[#202932] shadow-sm ${successStatus.bg}`}>
                        <div className="p-3 bg-white/50 dark:bg-black/20 rounded-xl">
                            <span className={`material-symbols-outlined text-2xl ${successStatus.text}`}>health_and_safety</span>
                        </div>
                        <div>
                            <p className={`text-xs font-bold uppercase tracking-wider ${successStatus.text}`}>Başarı Durumu</p>
                            <p className={`text-2xl font-black leading-none mt-1 ${successStatus.text}`}>{successStatus.label}</p>
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
                        <p className="text-[#111418] dark:text-white text-4xl font-black leading-none">95.2</p>
                        <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full mb-1">+1.5 net</span>
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
                        <p className="text-[#111418] dark:text-white text-4xl font-black leading-none">68.5</p>
                        <span className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full mb-1">-0.5 net</span>
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
                        <p className="text-[#111418] dark:text-white text-4xl font-black leading-none">81.85</p>
                        <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full mb-1">+0.5 net</span>
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
                        <p className="text-[#111418] dark:text-white text-4xl font-black leading-none">12</p>
                        <p className="text-[#617589] dark:text-gray-400 text-xl font-medium mb-1">/ 15</p>
                    </div>
                    <div className="mt-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 relative z-10">
                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '80%' }}></div>
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
                            <Link to="/app/sinavlarim" className="text-primary text-sm font-bold hover:underline">Tümünü Gör</Link>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm text-gray-900 dark:text-white font-bold text-lg w-12 h-12 flex items-center justify-center border border-gray-100 dark:border-gray-600">
                                        TYT
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#111418] dark:text-white">Genel Deneme - 5</p>
                                        <p className="text-sm text-[#617589] dark:text-gray-400 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                            24 Mayıs 2024
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-xl text-[#111418] dark:text-white">102.75</p>
                                    <p className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full inline-block">+3.25 net</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm text-gray-900 dark:text-white font-bold text-lg w-12 h-12 flex items-center justify-center border border-gray-100 dark:border-gray-600">
                                        AYT
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#111418] dark:text-white">Sayısal Deneme - 4</p>
                                        <p className="text-sm text-[#617589] dark:text-gray-400 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                            22 Mayıs 2024
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-xl text-[#111418] dark:text-white">65.50</p>
                                    <p className="text-xs font-bold text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full inline-block">-1.00 net</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="bg-white dark:bg-[#18212a] rounded-2xl border border-[#e0e6ed] dark:border-[#202932] p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[#111418] dark:text-white text-xl font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-500">notifications</span>
                                Bildirimler
                            </h2>
                            <Link to="/app/bildirimler" className="text-primary text-sm font-bold hover:underline">Tümünü Gör</Link>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
                                <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 p-2 rounded-lg shrink-0"><span className="material-symbols-outlined">task_alt</span></div>
                                <div className="flex-1">
                                    <p className="font-semibold text-[#111418] dark:text-white text-sm">Mentorun "Matematik Soru Analizi" görevini onayladı.</p>
                                    <p className="text-xs text-[#617589] dark:text-gray-400 mt-1">15 dakika önce</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                                <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 p-2 rounded-lg shrink-0"><span className="material-symbols-outlined">groups</span></div>
                                <div className="flex-1">
                                    <p className="font-semibold text-[#111418] dark:text-white text-sm">"Hedef Belirleme" toplantısı yarın 17:00'da.</p>
                                    <p className="text-xs text-[#617589] dark:text-gray-400 mt-1">2 saat önce</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-1 flex flex-col gap-8">
                    <div className="bg-white dark:bg-[#18212a] rounded-2xl border border-[#e0e6ed] dark:border-[#202932] p-6 shadow-sm sticky top-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[#111418] dark:text-white text-xl font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-purple-500">schedule</span>
                                Ders Programı
                            </h2>
                            <Link to="/app/ders-programi" className="text-primary text-sm font-bold hover:underline">Tümünü Gör</Link>
                        </div>
                        <div className="flex flex-col gap-6 relative">
                            {/* Timeline Line */}
                            <div className="absolute left-[60px] top-2 bottom-2 w-0.5 bg-gray-100 dark:bg-gray-700"></div>

                            <div className="flex gap-4 relative">
                                <div className="w-[45px] text-right shrink-0">
                                    <p className="text-[#111418] dark:text-white font-bold text-sm">09:00</p>
                                    <p className="text-[#617589] dark:text-gray-500 text-xs">11:00</p>
                                </div>
                                <div className="w-3 h-3 rounded-full bg-primary border-2 border-white dark:border-[#18212a] absolute left-[55px] top-1.5 z-10 shadow-sm"></div>
                                <div className="flex-1 bg-blue-50 dark:bg-blue-900/10 p-3 rounded-xl border border-blue-100 dark:border-blue-900/20 hover:shadow-md transition-shadow cursor-pointer">
                                    <p className="font-bold text-[#111418] dark:text-white text-sm">Matematik Soru Çözümü</p>
                                    <p className="text-xs text-[#617589] dark:text-gray-400 mt-0.5">Limit & Türev</p>
                                </div>
                            </div>

                            <div className="flex gap-4 relative">
                                <div className="w-[45px] text-right shrink-0">
                                    <p className="text-[#111418] dark:text-white font-bold text-sm">13:30</p>
                                    <p className="text-[#617589] dark:text-gray-500 text-xs">15:00</p>
                                </div>
                                <div className="w-3 h-3 rounded-full bg-teal-400 border-2 border-white dark:border-[#18212a] absolute left-[55px] top-1.5 z-10 shadow-sm"></div>
                                <div className="flex-1 bg-teal-50 dark:bg-teal-900/10 p-3 rounded-xl border border-teal-100 dark:border-teal-900/20 hover:shadow-md transition-shadow cursor-pointer">
                                    <p className="font-bold text-[#111418] dark:text-white text-sm">Fizik Konu Tekrarı</p>
                                    <p className="text-xs text-[#617589] dark:text-gray-400 mt-0.5">Basit Harmonik Hareket</p>
                                </div>
                            </div>

                            <div className="flex gap-4 relative">
                                <div className="w-[45px] text-right shrink-0">
                                    <p className="text-[#111418] dark:text-white font-bold text-sm">17:00</p>
                                    <p className="text-[#617589] dark:text-gray-500 text-xs">17:30</p>
                                </div>
                                <div className="w-3 h-3 rounded-full bg-orange-400 border-2 border-white dark:border-[#18212a] absolute left-[55px] top-1.5 z-10 shadow-sm"></div>
                                <div className="flex-1 bg-orange-50 dark:bg-orange-900/10 p-3 rounded-xl border border-orange-100 dark:border-orange-900/20 hover:shadow-md transition-shadow cursor-pointer">
                                    <p className="font-bold text-[#111418] dark:text-white text-sm">Mentor Toplantısı</p>
                                    <p className="text-xs text-[#617589] dark:text-gray-400 mt-0.5">Haftalık Değerlendirme</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* This Week's Meetings Section - Moved Here */}
                    <div className="bg-white dark:bg-[#18212a] rounded-2xl border border-[#e0e6ed] dark:border-[#202932] p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[#111418] dark:text-white text-xl font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">calendar_month</span>
                                Bu Haftaki Toplantılar
                            </h2>
                            <Link to="/app/toplantilar" className="text-primary text-sm font-bold hover:underline">Tümünü Gör</Link>
                        </div>
                        <div className="flex flex-col gap-4">
                            {[
                                { title: 'Haftalık Değerlendirme', type: 'Birebir Görüşme', date: 'Bugün', time: '14:00', icon: 'person', color: 'bg-blue-100 text-blue-700' },
                                { title: 'Matematik Soru Çözümü', type: 'Canlı Ders', date: 'Yarın', time: '20:00', icon: 'school', color: 'bg-green-100 text-green-700' },
                                { title: 'Veli Toplantısı', type: 'Toplantı', date: 'Cuma', time: '19:00', icon: 'groups', color: 'bg-purple-100 text-purple-700' },
                            ].map((meeting, index) => (
                                <div key={index} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group">
                                    <div className={`p-3 rounded-xl ${meeting.color} dark:bg-opacity-20`}>
                                        <span className="material-symbols-outlined">{meeting.icon}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-[#111418] dark:text-white truncate">{meeting.title}</h3>
                                        <p className="text-xs text-[#617589] dark:text-gray-400 font-medium mt-0.5">{meeting.type}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-[#111418] dark:text-white text-sm">{meeting.time}</p>
                                        <p className="text-xs text-[#617589] dark:text-gray-400">{meeting.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomePage;
