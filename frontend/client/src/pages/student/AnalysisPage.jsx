import React, { useState } from 'react';

const AnalysisPage = ({ embedded = false }) => {
    const [timeFilter, setTimeFilter] = useState('1 Hafta');

    // Mock data for "Zinciri Kırma" (Contribution Graph) - Last 365 days
    const generateContributionData = () => {
        const data = [];
        const today = new Date();
        for (let i = 0; i < 365; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            // Random intensity: 0 (empty), 1 (low), 2 (medium), 3 (high)
            const intensity = Math.random() > 0.7 ? Math.floor(Math.random() * 4) : 0;
            data.push({ date, intensity });
        }
        return data.reverse();
    };

    const contributionData = generateContributionData();

    // Mock data for "Ders Programı Görevleri" based on filter
    const getTaskData = (filter) => {
        switch (filter) {
            case '1 Hafta': return { total: 45, completed: 35, missed: 10, rate: 78, chart: [6, 7, 5, 8, 4, 3, 2] }; // Daily
            case '1 Ay': return { total: 180, completed: 140, missed: 40, rate: 77, chart: [30, 45, 35, 30] }; // Weekly
            case '3 Ay': return { total: 540, completed: 420, missed: 120, rate: 77, chart: [130, 140, 150] }; // Monthly
            case '6 Ay': return { total: 1080, completed: 850, missed: 230, rate: 78, chart: [140, 130, 150, 140, 130, 160] }; // Monthly
            case '1 Yıl': return { total: 2160, completed: 1700, missed: 460, rate: 79, chart: [140, 150, 130, 160, 140, 150, 130, 140, 150, 160, 140, 150] }; // Monthly
            default: return { total: 45, completed: 35, missed: 10, rate: 78, chart: [6, 7, 5, 8, 4, 3, 2] };
        }
    };

    const taskData = getTaskData(timeFilter);

    // Helper to get labels for the chart
    const getChartLabels = (filter) => {
        switch (filter) {
            case '1 Hafta': return ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
            case '1 Ay': return ['1. Hf', '2. Hf', '3. Hf', '4. Hf'];
            case '3 Ay': return ['Ay 1', 'Ay 2', 'Ay 3'];
            case '6 Ay': return ['Ay 1', 'Ay 2', 'Ay 3', 'Ay 4', 'Ay 5', 'Ay 6'];
            case '1 Yıl': return ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
            default: return [];
        }
    };

    const chartLabels = getChartLabels(timeFilter);

    return (
        <>
            {!embedded && (
                <div className="flex flex-col gap-1 mb-8">
                    <h1 className="text-[#111418] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Analizler</h1>
                    <p className="text-[#617589] dark:text-gray-400 text-base font-normal leading-normal">Akademik ilerlemeni ve çalışma alışkanlıklarını buradan takip et.</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Zinciri Kırma (Contribution Graph) */}
                <div className="col-span-1 lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-[#111418] dark:text-white text-xl font-bold">Zinciri Kırma</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Son 1 yıldaki çalışma aktiviten.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-end">
                                <span className="text-2xl font-black text-primary">28 Gün</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Mevcut Seri</span>
                            </div>
                            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
                            <div className="flex flex-col items-end">
                                <span className="text-2xl font-black text-green-500">142 Gün</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">En Uzun Seri</span>
                            </div>
                        </div>
                    </div>

                    {/* Heatmap Grid */}
                    <div className="w-full overflow-x-auto pb-2">
                        <div className="min-w-[800px]">
                            <div className="flex gap-1">
                                {Array.from({ length: 53 }).map((_, weekIndex) => (
                                    <div key={weekIndex} className="flex flex-col gap-1">
                                        {Array.from({ length: 7 }).map((_, dayIndex) => {
                                            const dataIndex = weekIndex * 7 + dayIndex;
                                            const dayData = contributionData[dataIndex] || { intensity: 0 };
                                            let bgColor = 'bg-gray-100 dark:bg-gray-700';
                                            if (dayData.intensity === 1) bgColor = 'bg-primary/30';
                                            if (dayData.intensity === 2) bgColor = 'bg-primary/60';
                                            if (dayData.intensity === 3) bgColor = 'bg-primary';

                                            return (
                                                <div
                                                    key={dayIndex}
                                                    className={`size-3 rounded-sm ${bgColor} hover:ring-2 hover:ring-offset-1 hover:ring-primary/50 transition-all cursor-pointer`}
                                                    title={dayData.date ? dayData.date.toLocaleDateString('tr-TR') : ''}
                                                ></div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>Az</span>
                        <div className="size-3 rounded-sm bg-gray-100 dark:bg-gray-700"></div>
                        <div className="size-3 rounded-sm bg-primary/30"></div>
                        <div className="size-3 rounded-sm bg-primary/60"></div>
                        <div className="size-3 rounded-sm bg-primary"></div>
                        <span>Çok</span>
                    </div>
                </div>

                {/* Ders Programı Görevleri */}
                <div className="col-span-1 lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                        <div>
                            <h2 className="text-[#111418] dark:text-white text-xl font-bold">Ders Programı Görevleri</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Tamamlanan görevlerin analizi.</p>
                        </div>

                        {/* Time Filters */}
                        <div className="flex bg-gray-100 dark:bg-gray-700/50 p-1 rounded-xl">
                            {['1 Hafta', '1 Ay', '3 Ay', '6 Ay', '1 Yıl'].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setTimeFilter(filter)}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${timeFilter === filter
                                        ? 'bg-white dark:bg-gray-800 text-primary shadow-sm'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Summary Stats */}
                        <div className="lg:col-span-1 flex flex-col justify-center gap-6">
                            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-800/40 rounded-lg text-blue-600 dark:text-blue-400">
                                        <span className="material-symbols-outlined text-xl">task_alt</span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Tamamlanan</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-gray-900 dark:text-white">{taskData.completed}</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">/ {taskData.total}</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-3">
                                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${taskData.rate}%` }}></div>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-red-100 dark:bg-red-800/40 rounded-lg text-red-600 dark:text-red-400">
                                        <span className="material-symbols-outlined text-xl">warning</span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">İhmal Edilen</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-gray-900 dark:text-white">{taskData.missed}</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">/ {taskData.total}</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-3">
                                    <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${100 - taskData.rate}%` }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="lg:col-span-2 flex flex-col justify-end h-64">
                            <div className="flex items-end justify-between gap-2 h-full px-2">
                                {taskData.chart.map((value, index) => {
                                    const maxVal = Math.max(...taskData.chart);
                                    const height = (value / maxVal) * 100;
                                    return (
                                        <div key={index} className="flex flex-col items-center flex-1 h-full justify-end gap-2 group">
                                            <div className="w-full relative flex items-end justify-center h-full">
                                                <div
                                                    className="w-full max-w-[40px] bg-primary opacity-80 hover:opacity-100 rounded-t-lg transition-all duration-300 relative group-hover:scale-y-105 origin-bottom"
                                                    style={{ height: `${height}%` }}
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-t-lg"></div>
                                                </div>
                                                {/* Tooltip */}
                                                <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10 mb-2">
                                                    {value} Görev
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate w-full text-center">
                                                {chartLabels[index]}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AnalysisPage;
