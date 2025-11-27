import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ExamDetailPage = ({ embedded = false, onBack }) => {
    const [chartType, setChartType] = useState('bar');

    const subjectData = [
        { label: 'Matematik', short: 'Mat.', net: 24.5, correct: 26, wrong: 6, empty: 8, color: 'text-blue-500', bg: 'bg-blue-500' },
        { label: 'Fizik', short: 'Fiz.', net: 8.5, correct: 10, wrong: 4, empty: 0, color: 'text-indigo-500', bg: 'bg-indigo-500' },
        { label: 'Kimya', short: 'Kim.', net: 9.0, correct: 10, wrong: 3, empty: 0, color: 'text-purple-500', bg: 'bg-purple-500' },
        { label: 'Biyoloji', short: 'Biy.', net: 7.5, correct: 9, wrong: 4, empty: 0, color: 'text-pink-500', bg: 'bg-pink-500' },
        { label: 'Edebiyat', short: 'Edb.', net: 18.0, correct: 20, wrong: 4, empty: 0, color: 'text-orange-500', bg: 'bg-orange-500' },
        { label: 'Tarih', short: 'Tar.', net: 6.5, correct: 8, wrong: 4, empty: 0, color: 'text-amber-500', bg: 'bg-amber-500' },
        { label: 'Coğrafya', short: 'Coğ.', net: 3.5, correct: 5, wrong: 4, empty: 0, color: 'text-teal-500', bg: 'bg-teal-500' },
    ];

    return (
        <>
            {/* Header & Breadcrumbs */}
            {embedded ? (
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                        <span className="font-medium">Sınav Listesine Dön</span>
                    </button>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white ml-auto">AYT Deneme Sınavı #5</h2>
                </div>
            ) : (
                <div className="flex flex-col gap-4 mb-8">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                        <Link className="hover:text-primary dark:hover:text-primary/80 transition-colors" to="/app/analizler">Analizler</Link>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <Link className="hover:text-primary dark:hover:text-primary/80 transition-colors" to="/app/sinavlarim">Sınavlarım</Link>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <span className="text-gray-900 dark:text-white">AYT Deneme Sınavı #5</span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="text-gray-900 dark:text-white text-3xl font-bold tracking-tight">AYT Deneme Sınavı #5</h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Sınav detaylarını ve konu analizlerini inceleyin.</p>
                        </div>
                        <button className="bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all shadow-sm hover:shadow-md active:scale-95">
                            <span className="material-symbols-outlined text-xl">visibility</span>
                            Cevapları Görüntüle
                        </button>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="relative overflow-hidden rounded-2xl p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-6xl text-blue-500">calculate</span>
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                <span className="material-symbols-outlined text-xl">calculate</span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Toplam Net</p>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-gray-900 dark:text-white text-3xl font-bold">55.25</p>
                            <span className="text-xs font-medium text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">Net</span>
                        </div>
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-6xl text-green-500">check_circle</span>
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                                <span className="material-symbols-outlined text-xl">check_circle</span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Doğru</p>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-gray-900 dark:text-white text-3xl font-bold">62</p>
                            <span className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">Doğru</span>
                        </div>
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-6xl text-red-500">cancel</span>
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
                                <span className="material-symbols-outlined text-xl">cancel</span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Yanlış</p>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-gray-900 dark:text-white text-3xl font-bold">27</p>
                            <span className="text-xs font-medium text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full">Yanlış</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Net Distribution Chart */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 mb-8 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-gray-900 dark:text-white text-lg font-bold">Derslere Göre Net Dağılımı</h2>
                    <div className="flex bg-gray-100 dark:bg-gray-700/50 p-1 rounded-xl">
                        <button
                            onClick={() => setChartType('bar')}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${chartType === 'bar'
                                ? 'bg-white dark:bg-gray-800 text-primary shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                }`}
                        >
                            <span className="material-symbols-outlined text-lg">bar_chart</span>
                            Sütun
                        </button>
                        <button
                            onClick={() => setChartType('pie')}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${chartType === 'pie'
                                ? 'bg-white dark:bg-gray-800 text-primary shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                }`}
                        >
                            <span className="material-symbols-outlined text-lg">pie_chart</span>
                            Pasta
                        </button>
                    </div>
                </div>

                <div className="min-h-[300px] flex flex-col justify-center">
                    {chartType === 'bar' ? (
                        <div className="flex items-end gap-3 sm:gap-6 h-64 px-2">
                            {subjectData.map((item, index) => (
                                <div key={index} className="flex flex-col items-center flex-1 h-full justify-end gap-3 group">
                                    <div className="w-full relative flex items-end justify-center h-full">
                                        <div
                                            className={`w-full max-w-[48px] ${item.bg} opacity-80 hover:opacity-100 rounded-t-xl transition-all duration-300 relative group-hover:scale-y-105 origin-bottom`}
                                            style={{ height: `${(item.net / 30) * 100}%` }} // Assuming max 30 net for visualization scale
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-t-xl"></div>
                                        </div>
                                        {/* Tooltip */}
                                        <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10 mb-2">
                                            {item.net} Net
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">{item.short}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col md:flex-row items-center justify-around gap-8">
                            {/* Pie Chart */}
                            <div className="relative size-64 shrink-0">
                                <div
                                    className="size-full rounded-full"
                                    style={{
                                        background: `conic-gradient(
                                            ${subjectData.reduce((acc, item, index, arr) => {
                                            const total = arr.reduce((sum, i) => sum + i.net, 0);
                                            const start = arr.slice(0, index).reduce((sum, i) => sum + (i.net / total) * 100, 0);
                                            const end = start + (item.net / total) * 100;
                                            // Map Tailwind colors to hex for gradient (simplified mapping)
                                            const colors = {
                                                'bg-blue-500': '#3b82f6',
                                                'bg-indigo-500': '#6366f1',
                                                'bg-purple-500': '#a855f7',
                                                'bg-pink-500': '#ec4899',
                                                'bg-orange-500': '#f97316',
                                                'bg-amber-500': '#f59e0b',
                                                'bg-teal-500': '#14b8a6'
                                            };
                                            return `${acc}${index > 0 ? ',' : ''} ${colors[item.bg] || '#ccc'} ${start}% ${end}%`;
                                        }, '')}
                                        )`
                                    }}
                                ></div>
                                <div className="absolute inset-0 m-auto size-32 bg-white dark:bg-gray-800 rounded-full flex flex-col items-center justify-center shadow-inner">
                                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {subjectData.reduce((sum, item) => sum + item.net, 0)}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Toplam Net</span>
                                </div>
                            </div>

                            {/* Detailed Stats Legend */}
                            <div className="w-full max-w-md">
                                <div className="grid grid-cols-5 gap-2 mb-2 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700 pb-2">
                                    <div className="col-span-2">Ders</div>
                                    <div className="text-center">D</div>
                                    <div className="text-center">Y</div>
                                    <div className="text-center">B</div>
                                </div>
                                <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                    {subjectData.map((item, index) => (
                                        <div key={index} className="grid grid-cols-5 gap-2 items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-lg transition-colors">
                                            <div className="col-span-2 flex items-center gap-2">
                                                <div className={`size-3 rounded-full ${item.bg}`}></div>
                                                <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.label}</span>
                                            </div>
                                            <div className="text-center text-sm font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 py-0.5 rounded">{item.correct}</div>
                                            <div className="text-center text-sm font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 py-0.5 rounded">{item.wrong}</div>
                                            <div className="text-center text-sm font-bold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 py-0.5 rounded">{item.empty}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Subject Analysis */}
            <div>
                <h2 className="text-gray-900 dark:text-white text-xl font-bold mb-6">Ders Analizi</h2>
                <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
                    <nav aria-label="Tabs" className="flex space-x-6 -mb-px overflow-x-auto no-scrollbar">
                        {['Matematik', 'Fizik', 'Kimya', 'Biyoloji', 'Edebiyat'].map((subject, index) => (
                            <a
                                key={subject}
                                href="#"
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${index === 0
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                                    }`}
                            >
                                {subject}
                            </a>
                        ))}
                    </nav>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Radial Chart */}
                    <div className="md:col-span-1 flex flex-col gap-6">
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-4">Matematik Analizi</h3>
                            <div className="flex justify-center my-6">
                                <div className="relative w-48 h-48">
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                        <path className="text-gray-100 dark:text-gray-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" />
                                        <path className="text-green-500" strokeDasharray="65, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                                        <path className="text-red-500" strokeDasharray="15, 100" strokeDashoffset="-65" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                                        <path className="text-gray-400 dark:text-gray-600" strokeDasharray="20, 100" strokeDashoffset="-80" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-bold text-gray-900 dark:text-white">24.5</span>
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Net</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                                    <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                        <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                                        Doğru
                                    </span>
                                    <span className="font-bold text-gray-900 dark:text-white">26</span>
                                </div>
                                <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                                    <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                        <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                                        Yanlış
                                    </span>
                                    <span className="font-bold text-gray-900 dark:text-white">6</span>
                                </div>
                                <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                                    <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                        <span className="w-2.5 h-2.5 rounded-full bg-gray-400 dark:bg-gray-500"></span>
                                        Boş
                                    </span>
                                    <span className="font-bold text-gray-900 dark:text-white">8</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Topic Distribution List */}
                    <div className="md:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-6">Konu Dağılımı</h3>
                        <div className="flow-root">
                            <ul className="divide-y divide-gray-100 dark:divide-gray-700" role="list">
                                {[
                                    { topic: 'Türev', count: '4 Soru', correct: 3, wrong: 1, empty: 0 },
                                    { topic: 'Limit ve Süreklilik', count: '3 Soru', correct: 2, wrong: 1, empty: 0 },
                                    { topic: 'İntegral', count: '4 Soru', correct: 3, wrong: 0, empty: 1 },
                                    { topic: 'Trigonometri', count: '5 Soru', correct: 4, wrong: 1, empty: 0 },
                                ].map((item, index) => (
                                    <li key={index} className="py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors rounded-lg px-2 -mx-2">
                                        <div className="flex items-center justify-between">
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.topic}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.count}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                    {item.correct}D
                                                </span>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                                    {item.wrong}Y
                                                </span>
                                                {item.empty > 0 && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                        {item.empty}B
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ExamDetailPage;
