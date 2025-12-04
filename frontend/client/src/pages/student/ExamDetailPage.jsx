import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getExamDetail } from '../../services/api';

const ExamDetailPage = ({ embedded = false, onBack }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chartType, setChartType] = useState('bar');

    useEffect(() => {
        if (id) {
            fetchExamDetails(id);
        }
    }, [id]);

    const fetchExamDetails = async (examId) => {
        try {
            const data = await getExamDetail(examId);
            setExam(data);
        } catch (error) {
            console.error('Error fetching exam details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Yükleniyor...</div>;
    }

    if (!exam) {
        return <div className="p-8 text-center">Sınav bulunamadı.</div>;
    }

    // Prepare data for charts/lists
    // exam.details contains lessons.
    // We need to map them to the format expected by the UI.
    const subjectData = exam.details.map(detail => ({
        label: detail.lesson_name,
        short: detail.lesson_name.substring(0, 3) + '.', // Simple short name
        net: parseFloat(detail.net),
        correct: detail.correct_count,
        wrong: detail.wrong_count,
        empty: detail.empty_count,
        // Assign colors based on lesson name or random/cycle
        color: 'text-blue-500',
        bg: 'bg-blue-500' // Simplified for now, could use a mapping function
    }));

    // Collect all topics from all lessons
    const allTopics = [];
    exam.details.forEach(detail => {
        if (detail.topics) {
            detail.topics.forEach(topic => {
                allTopics.push({
                    topic: topic.topic_name,
                    lesson: detail.lesson_name,
                    count: `${topic.correct_count + topic.wrong_count + topic.empty_count} Soru`,
                    correct: topic.correct_count,
                    wrong: topic.wrong_count,
                    empty: topic.empty_count
                });
            });
        }
    });

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
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white ml-auto">{exam.exam_name}</h2>
                </div>
            ) : (
                <div className="flex flex-col gap-4 mb-8">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                        <Link className="hover:text-primary dark:hover:text-primary/80 transition-colors" to="/student/analizler">Analizler</Link>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <Link className="hover:text-primary dark:hover:text-primary/80 transition-colors" to="/student/sinavlarim">Sınavlarım</Link>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <span className="text-gray-900 dark:text-white">{exam.exam_name}</span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="text-gray-900 dark:text-white text-3xl font-bold tracking-tight">{exam.exam_name}</h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Sınav detaylarını ve konu analizlerini inceleyin.</p>
                        </div>
                        {/* <button className="bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all shadow-sm hover:shadow-md active:scale-95">
                            <span className="material-symbols-outlined text-xl">visibility</span>
                            Cevapları Görüntüle
                        </button> */}
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
                            <p className="text-gray-900 dark:text-white text-3xl font-bold">{exam.totalNet.toFixed(2)}</p>
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
                            <p className="text-gray-900 dark:text-white text-3xl font-bold">{exam.totalCorrect}</p>
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
                            <p className="text-gray-900 dark:text-white text-3xl font-bold">{exam.totalWrong}</p>
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
                                            style={{ height: `${Math.min((item.net / 40) * 100, 100)}%` }} // Assuming max 40 net for visualization scale
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-t-xl"></div>
                                        </div>
                                        {/* Tooltip */}
                                        <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10 mb-2">
                                            {item.net.toFixed(2)} Net
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">{item.short}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col md:flex-row items-center justify-around gap-8">
                            {/* Pie Chart Placeholder - Conic gradient is complex to dynamic generate without a library, using simple placeholder or list */}
                            <div className="text-center text-gray-500">Pasta grafik şu an için devre dışı.</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Subject Analysis & Topics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Topic Distribution List */}
                <div className="md:col-span-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-6">Konu Dağılımı</h3>
                    {allTopics.length > 0 ? (
                        <div className="flow-root">
                            <ul className="divide-y divide-gray-100 dark:divide-gray-700" role="list">
                                {allTopics.map((item, index) => (
                                    <li key={index} className="py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors rounded-lg px-2 -mx-2">
                                        <div className="flex items-center justify-between">
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.topic}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.lesson}</p>
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
                    ) : (
                        <p className="text-gray-500">Bu sınav için konu detayı girilmemiş.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default ExamDetailPage;
