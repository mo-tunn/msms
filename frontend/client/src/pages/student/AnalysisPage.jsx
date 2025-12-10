import React, { useState, useEffect } from 'react';
import { getDailyActivities, getTaskAnalysis } from '../../services/api';

const AnalysisPage = ({ embedded = false, studentId = null }) => {
    const [timeFilter, setTimeFilter] = useState('1 Hafta');
    const [contributionData, setContributionData] = useState([]);
    const [taskData, setTaskData] = useState({ total: 0, completed: 0, missed: 0, rate: 0, chart: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDailyActivities();
    }, [studentId]);

    useEffect(() => {
        fetchTaskAnalysis();
    }, [timeFilter, studentId]);

    const fetchDailyActivities = async () => {
        try {
            const data = await getDailyActivities(studentId);
            const activityMap = {};
            data.forEach(item => {
                const dateStr = new Date(item.activity_date).toDateString();
                activityMap[dateStr] = parseInt(item.completed_count || 0);
            });

            // Calculate Start Date for the Grid (Must be a Monday)
            // We want 53 weeks (~1 year). The grid has 53 columns.
            // We want the last column to include Today.
            // So we find the Monday of the current week.
            const today = new Date();
            const currentDay = today.getDay(); // 0=Sun, 1=Mon
            const daysSinceMonday = (currentDay + 6) % 7; // Convert to Mon=0 start
            const thisWeekMonday = new Date(today);
            thisWeekMonday.setDate(today.getDate() - daysSinceMonday);

            // Start date = 52 weeks before this week's Monday
            const gridStartDate = new Date(thisWeekMonday);
            gridStartDate.setDate(gridStartDate.getDate() - (52 * 7));

            const heatmapData = [];
            // Generate exactly 53 * 7 = 371 days of data
            for (let i = 0; i < 371; i++) {
                const date = new Date(gridStartDate);
                date.setDate(date.getDate() + i);
                const dateStr = date.toDateString();

                // Don't show future days
                if (date > today) {
                    heatmapData.push({ date, intensity: 0, count: 0, isFuture: true });
                    continue;
                }

                const count = activityMap[dateStr] || 0;
                let intensity = 0;
                if (count > 0) intensity = 1;
                if (count >= 3) intensity = 2;
                if (count >= 5) intensity = 3;

                heatmapData.push({ date, intensity, count, isFuture: false });
            }
            // No reverse needed, we built it chronologically (Mon -> Sun, Old -> New)
            setContributionData(heatmapData);
        } catch (error) {
            console.error('Failed to fetch daily activities:', error);
        }
    };

    const fetchTaskAnalysis = async () => {
        try {
            const data = await getTaskAnalysis(timeFilter, studentId);
            setTaskData({
                total: data.total,
                completed: data.completed,
                missed: data.missed,
                rate: data.rate,
                chart: data.chart || [],
                labels: data.labels || []
            });
        } catch (error) {
            console.error('Failed to fetch task analysis:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate streaks
    const calculateStreaks = () => {
        if (contributionData.length === 0) return { currentStreak: 0, maxStreak: 0 };

        let currentStreak = 0;
        let maxStreak = 0;
        let tempStreak = 0;

        // Iterate strictly by date sequence (oldest to newest)
        for (let i = 0; i < contributionData.length; i++) {
            if (contributionData[i].count > 0) {
                tempStreak++;
            } else {
                if (tempStreak > maxStreak) maxStreak = tempStreak;
                tempStreak = 0;
            }
        }
        if (tempStreak > maxStreak) maxStreak = tempStreak;


        // Smart Current Streak Logic
        // Find index of TODAY (last non-future entry)
        let todayIndex = -1;
        for (let i = contributionData.length - 1; i >= 0; i--) {
            if (!contributionData[i].isFuture) {
                todayIndex = i;
                break;
            }
        }

        if (todayIndex === -1) return { currentStreak: 0, maxStreak }; // Should not happen

        const todayActive = contributionData[todayIndex].count > 0;
        const yesterdayActive = todayIndex > 0 && contributionData[todayIndex - 1].count > 0;

        let startIndex = -1;
        if (todayActive) {
            startIndex = todayIndex;
        } else if (yesterdayActive) {
            startIndex = todayIndex - 1;
        }

        if (startIndex !== -1) {
            for (let i = startIndex; i >= 0; i--) {
                if (contributionData[i].count > 0) {
                    currentStreak++;
                } else {
                    break;
                }
            }
        }

        return { currentStreak, maxStreak };
    };

    const { currentStreak, maxStreak } = calculateStreaks();

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
                                <span className="text-2xl font-black text-primary">{currentStreak} Gün</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Mevcut Seri</span>
                            </div>
                            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
                            <div className="flex flex-col items-end">
                                <span className="text-2xl font-black text-green-500">{maxStreak} Gün</span>
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

                        {/* Pie Chart */}
                        <div className="lg:col-span-2 flex flex-col justify-between h-80 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-100 dark:border-gray-800">
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">Görev Dağılımı</h3>

                            <div className="flex items-center justify-center h-full gap-12">
                                {/* Pie Chart Visualization */}
                                <div className="relative size-48 rounded-full shadow-lg"
                                    style={{
                                        background: `conic-gradient(#3b82f6 0% ${taskData.rate}%, #ef4444 ${taskData.rate}% 100%)`
                                    }}
                                >
                                    {/* Inner Circle for Donut Effect (Optional, simplifies to Pie if removed, but Donut looks more modern) */}
                                    <div className="absolute inset-4 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                        <div className="text-center">
                                            <span className="text-3xl font-black text-gray-900 dark:text-white">{taskData.rate}%</span>
                                            <p className="text-xs text-gray-500 font-medium">Başarı</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Legend */}
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-4 rounded-full bg-blue-500 shadow-sm"></div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">Tamamlanan</p>
                                            <p className="text-xs text-gray-500">{taskData.completed} Görev</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="size-4 rounded-full bg-red-500 shadow-sm"></div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">Tamamlanmayan</p>
                                            <p className="text-xs text-gray-500">{taskData.total - taskData.completed} Görev</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AnalysisPage;
