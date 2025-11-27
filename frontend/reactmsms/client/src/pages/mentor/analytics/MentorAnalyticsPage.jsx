import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ExamsPage from '../../ExamsPage';
import ExamDetailPage from '../../ExamDetailPage';
import AnalysisPage from '../../AnalysisPage';

const MentorAnalyticsPage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const [filterExamTrend, setFilterExamTrend] = useState('all');
    const [filterTasksCompleted, setFilterTasksCompleted] = useState({ min: '', max: '' });
    const [filterTasksIncomplete, setFilterTasksIncomplete] = useState({ min: '', max: '' });
    const [filterStreak, setFilterStreak] = useState({ min: '', max: '' });
    const [filterSuccessScore, setFilterSuccessScore] = useState({ min: '', max: '' });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('exams');
    const [selectedExamId, setSelectedExamId] = useState(null);

    // Mock Data
    const students = [
        { id: 1, name: 'Ali Yılmaz', avatar: 'AY', tasksCompleted: 45, tasksIncomplete: 2, streak: 12, examTrend: 'increasing', lastExamScore: 85 },
        { id: 2, name: 'Ayşe Demir', avatar: 'AD', tasksCompleted: 38, tasksIncomplete: 5, streak: 5, examTrend: 'stable', lastExamScore: 72 },
        { id: 3, name: 'Mehmet Kaya', avatar: 'MK', tasksCompleted: 50, tasksIncomplete: 0, streak: 20, examTrend: 'increasing', lastExamScore: 90 },
        { id: 4, name: 'Fatma Çelik', avatar: 'FÇ', tasksCompleted: 25, tasksIncomplete: 10, streak: 0, examTrend: 'decreasing', lastExamScore: 60 },
        { id: 5, name: 'Ahmet Şahin', avatar: 'AŞ', tasksCompleted: 42, tasksIncomplete: 3, streak: 8, examTrend: 'stable', lastExamScore: 78 },
        { id: 6, name: 'Zeynep Koç', avatar: 'ZK', tasksCompleted: 30, tasksIncomplete: 8, streak: 2, examTrend: 'decreasing', lastExamScore: 65 },
        { id: 7, name: 'Mustafa Öztürk', avatar: 'MÖ', tasksCompleted: 48, tasksIncomplete: 1, streak: 15, examTrend: 'increasing', lastExamScore: 88 },
        { id: 8, name: 'Elif Arslan', avatar: 'EA', tasksCompleted: 35, tasksIncomplete: 6, streak: 4, examTrend: 'stable', lastExamScore: 70 },
    ];

    const calculateSuccessMetric = (student) => {
        // Simple weighted score calculation
        const taskScore = (student.tasksCompleted / (student.tasksCompleted + student.tasksIncomplete)) * 40;
        const streakScore = Math.min(student.streak, 20) * 1.5; // Max 30 points from streak
        const examScore = student.lastExamScore * 0.3; // Max 30 points from exams
        return Math.round(taskScore + streakScore + examScore);
    };

    const getSuccessStatus = (score) => {
        if (score >= 85) return { label: 'Çok Yükselişte', color: 'text-purple-600', bg: 'bg-purple-100', text: 'text-purple-700' };
        if (score >= 70) return { label: 'Yükselişte', color: 'text-green-500', bg: 'bg-green-100', text: 'text-green-700' };
        if (score >= 50) return { label: 'Dengeli', color: 'text-yellow-500', bg: 'bg-yellow-100', text: 'text-yellow-700' };
        if (score >= 30) return { label: 'Riskli', color: 'text-orange-500', bg: 'bg-orange-100', text: 'text-orange-700' };
        return { label: 'Çok Riskli', color: 'text-red-500', bg: 'bg-red-100', text: 'text-red-700' };
    };

    // Filtered Students
    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTrend = filterExamTrend === 'all' || student.examTrend === filterExamTrend;

            const score = calculateSuccessMetric(student);
            const matchesSuccessScore =
                (filterSuccessScore.min === '' || score >= parseInt(filterSuccessScore.min)) &&
                (filterSuccessScore.max === '' || score <= parseInt(filterSuccessScore.max));

            const matchesTasksCompleted =
                (filterTasksCompleted.min === '' || student.tasksCompleted >= parseInt(filterTasksCompleted.min)) &&
                (filterTasksCompleted.max === '' || student.tasksCompleted <= parseInt(filterTasksCompleted.max));

            const matchesStreak =
                (filterStreak.min === '' || student.streak >= parseInt(filterStreak.min)) &&
                (filterStreak.max === '' || student.streak <= parseInt(filterStreak.max));

            return matchesSearch && matchesTrend && matchesSuccessScore && matchesTasksCompleted && matchesStreak;
        });
    }, [students, searchQuery, filterExamTrend, filterSuccessScore, filterTasksCompleted, filterStreak]);

    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const currentStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleExamClick = (examId) => {
        setSelectedExamId(examId);
    };

    const handleBackToExams = () => {
        setSelectedExamId(null);
    };

    // Chart Data Calculation
    const chartData = useMemo(() => {
        const statusCounts = { 'Çok Riskli': 0, 'Riskli': 0, 'Dengeli': 0, 'Yükselişte': 0, 'Çok Yükselişte': 0 };
        let totalTasksCompleted = 0;
        let totalTasksIncomplete = 0;
        let totalStreak = 0;

        students.forEach(student => {
            const score = calculateSuccessMetric(student);
            const status = getSuccessStatus(score);
            if (statusCounts[status.label] !== undefined) statusCounts[status.label]++;

            totalTasksCompleted += student.tasksCompleted;
            totalTasksIncomplete += student.tasksIncomplete;
            totalStreak += student.streak;
        });

        const avgTasksCompleted = Math.round(totalTasksCompleted / students.length);
        const avgTasksIncomplete = Math.round(totalTasksIncomplete / students.length);
        const avgStreak = Math.round(totalStreak / students.length);

        return { statusCounts, avgTasksCompleted, avgTasksIncomplete, avgStreak };
    }, [students]);

    const handleOpenModal = (student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
        setActiveTab('exams'); // Default tab
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedStudent(null);
        setSelectedExamId(null);
    };

    return (
        <div className="flex flex-col gap-8 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[#111418] dark:text-white text-3xl font-bold leading-tight tracking-[-0.015em]">Başarı Analizi</h1>
                    <p className="text-[#617589] dark:text-gray-400 text-base font-normal leading-normal mt-2">
                        Öğrencilerinizin genel başarı durumlarını ve risk analizlerini buradan takip edebilirsiniz.
                    </p>
                </div>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-[#18212a] p-6 rounded-2xl border border-[#e0e6ed] dark:border-[#202932] shadow-sm flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-blue-500 text-white shadow-lg shadow-blue-500/20">
                        <span className="material-symbols-outlined text-2xl">group</span>
                    </div>
                    <div>
                        <p className="text-sm text-[#617589] dark:text-gray-400 font-medium">Toplam Öğrenci</p>
                        <p className="text-2xl font-bold text-[#111418] dark:text-white mt-1">{students.length}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#18212a] p-6 rounded-2xl border border-[#e0e6ed] dark:border-[#202932] shadow-sm flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-green-500 text-white shadow-lg shadow-green-500/20">
                        <span className="material-symbols-outlined text-2xl">trending_up</span>
                    </div>
                    <div>
                        <p className="text-sm text-[#617589] dark:text-gray-400 font-medium">Ortalama Başarı</p>
                        <p className="text-2xl font-bold text-[#111418] dark:text-white mt-1">
                            {Math.round(students.reduce((acc, student) => acc + calculateSuccessMetric(student), 0) / students.length)} Puan
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#18212a] p-6 rounded-2xl border border-[#e0e6ed] dark:border-[#202932] shadow-sm flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                        <span className="material-symbols-outlined text-2xl">assignment</span>
                    </div>
                    <div>
                        <p className="text-sm text-[#617589] dark:text-gray-400 font-medium">Bekleyen Görevler</p>
                        <p className="text-2xl font-bold text-[#111418] dark:text-white mt-1">{chartData.avgTasksIncomplete * students.length}</p>
                    </div>
                </div>
            </div>

            {/* General Average Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Distribution Chart */}
                <div className="bg-white dark:bg-[#18212a] rounded-2xl p-6 border border-[#e0e6ed] dark:border-[#202932] shadow-sm">
                    <h3 className="text-[#111418] dark:text-white text-lg font-bold mb-6">Başarı Durumu Dağılımı</h3>
                    <div className="space-y-4">
                        {Object.entries(chartData.statusCounts).map(([label, count]) => {
                            const percentage = (count / students.length) * 100;
                            let colorClass = 'bg-gray-500';
                            if (label === 'Çok Riskli') colorClass = 'bg-red-500';
                            if (label === 'Riskli') colorClass = 'bg-orange-500';
                            if (label === 'Dengeli') colorClass = 'bg-yellow-500';
                            if (label === 'Yükselişte') colorClass = 'bg-green-500';
                            if (label === 'Çok Yükselişte') colorClass = 'bg-purple-600';

                            return (
                                <div key={label} className="flex items-center gap-4">
                                    <span className="w-24 text-sm font-medium text-[#617589] dark:text-gray-400">{label}</span>
                                    <div className="flex-1 h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${percentage}%` }}></div>
                                    </div>
                                    <span className="w-8 text-sm font-bold text-[#111418] dark:text-white text-right">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Average Metrics Chart */}
                <div className="bg-white dark:bg-[#18212a] rounded-2xl p-6 border border-[#e0e6ed] dark:border-[#202932] shadow-sm flex flex-col justify-between">
                    <h3 className="text-[#111418] dark:text-white text-lg font-bold mb-6">Ortalama Performans Metrikleri</h3>
                    <div className="flex items-end justify-around h-48 pb-4">
                        {/* Avg Tasks Completed */}
                        <div className="flex flex-col items-center gap-2 group w-1/3 h-full justify-end">
                            <div className="relative w-16 bg-blue-100 dark:bg-blue-900/30 rounded-t-xl flex items-end justify-center h-full overflow-hidden">
                                <div
                                    className="w-full bg-blue-500 rounded-t-xl transition-all duration-500 group-hover:bg-blue-600"
                                    style={{ height: `${Math.min((chartData.avgTasksCompleted / 60) * 100, 100)}%` }}
                                ></div>
                                <span className="absolute bottom-2 text-white font-bold text-lg drop-shadow-md z-10">{chartData.avgTasksCompleted}</span>
                            </div>
                            <span className="text-xs font-medium text-[#617589] dark:text-gray-400 text-center">Ort. Tamamlanan</span>
                        </div>

                        {/* Avg Tasks Incomplete */}
                        <div className="flex flex-col items-center gap-2 group w-1/3 h-full justify-end">
                            <div className="relative w-16 bg-red-100 dark:bg-red-900/30 rounded-t-xl flex items-end justify-center h-full overflow-hidden">
                                <div
                                    className="w-full bg-red-500 rounded-t-xl transition-all duration-500 group-hover:bg-red-600"
                                    style={{ height: `${Math.min((chartData.avgTasksIncomplete / 60) * 100, 100)}%` }}
                                ></div>
                                <span className="absolute bottom-2 text-white font-bold text-lg drop-shadow-md z-10">{chartData.avgTasksIncomplete}</span>
                            </div>
                            <span className="text-xs font-medium text-[#617589] dark:text-gray-400 text-center">Ort. Eksik</span>
                        </div>

                        {/* Avg Streak */}
                        <div className="flex flex-col items-center gap-2 group w-1/3 h-full justify-end">
                            <div className="relative w-16 bg-green-100 dark:bg-green-900/30 rounded-t-xl flex items-end justify-center h-full overflow-hidden">
                                <div
                                    className="w-full bg-green-500 rounded-t-xl transition-all duration-500 group-hover:bg-green-600"
                                    style={{ height: `${Math.min((chartData.avgStreak / 30) * 100, 100)}%` }}
                                ></div>
                                <span className="absolute bottom-2 text-white font-bold text-lg drop-shadow-md z-10">{chartData.avgStreak}</span>
                            </div>
                            <span className="text-xs font-medium text-[#617589] dark:text-gray-400 text-center">Ort. Zincir</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            <div className="bg-white dark:bg-[#18212a] p-6 rounded-2xl border border-[#e0e6ed] dark:border-[#202932] shadow-sm space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary">filter_list</span>
                    <h3 className="text-lg font-bold text-[#111418] dark:text-white">Filtreleme Seçenekleri</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-gray-500">search</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Öğrenci Ara..."
                            className="pl-10 pr-4 py-2 rounded-xl border border-[#e0e6ed] dark:border-[#202932] bg-[#f0f2f4] dark:bg-[#202932] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 w-full"
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        />
                    </div>

                    {/* Exam Trend Filter */}
                    <div>
                        <select
                            className="w-full px-4 py-2 rounded-xl border border-[#e0e6ed] dark:border-[#202932] bg-[#f0f2f4] dark:bg-[#202932] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                            value={filterExamTrend}
                            onChange={(e) => { setFilterExamTrend(e.target.value); setCurrentPage(1); }}
                        >
                            <option value="all">Tüm Trendler</option>
                            <option value="increasing">Yükselişte</option>
                            <option value="stable">Dengeli</option>
                            <option value="decreasing">Düşüşte</option>
                        </select>
                    </div>

                    {/* Success Score Range */}
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Min Puan"
                            className="w-1/2 px-3 py-2 rounded-xl border border-[#e0e6ed] dark:border-[#202932] bg-[#f0f2f4] dark:bg-[#202932] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                            value={filterSuccessScore.min}
                            onChange={(e) => { setFilterSuccessScore({ ...filterSuccessScore, min: e.target.value }); setCurrentPage(1); }}
                        />
                        <input
                            type="number"
                            placeholder="Max Puan"
                            className="w-1/2 px-3 py-2 rounded-xl border border-[#e0e6ed] dark:border-[#202932] bg-[#f0f2f4] dark:bg-[#202932] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                            value={filterSuccessScore.max}
                            onChange={(e) => { setFilterSuccessScore({ ...filterSuccessScore, max: e.target.value }); setCurrentPage(1); }}
                        />
                    </div>

                    {/* Tasks Completed Range */}
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Min Tamamlanan"
                            className="w-1/2 px-3 py-2 rounded-xl border border-[#e0e6ed] dark:border-[#202932] bg-[#f0f2f4] dark:bg-[#202932] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                            value={filterTasksCompleted.min}
                            onChange={(e) => { setFilterTasksCompleted({ ...filterTasksCompleted, min: e.target.value }); setCurrentPage(1); }}
                        />
                        <input
                            type="number"
                            placeholder="Max Tamamlanan"
                            className="w-1/2 px-3 py-2 rounded-xl border border-[#e0e6ed] dark:border-[#202932] bg-[#f0f2f4] dark:bg-[#202932] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                            value={filterTasksCompleted.max}
                            onChange={(e) => { setFilterTasksCompleted({ ...filterTasksCompleted, max: e.target.value }); setCurrentPage(1); }}
                        />
                    </div>

                    {/* Streak Range */}
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Min Zincir"
                            className="w-1/2 px-3 py-2 rounded-xl border border-[#e0e6ed] dark:border-[#202932] bg-[#f0f2f4] dark:bg-[#202932] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                            value={filterStreak.min}
                            onChange={(e) => { setFilterStreak({ ...filterStreak, min: e.target.value }); setCurrentPage(1); }}
                        />
                        <input
                            type="number"
                            placeholder="Max Zincir"
                            className="w-1/2 px-3 py-2 rounded-xl border border-[#e0e6ed] dark:border-[#202932] bg-[#f0f2f4] dark:bg-[#202932] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                            value={filterStreak.max}
                            onChange={(e) => { setFilterStreak({ ...filterStreak, max: e.target.value }); setCurrentPage(1); }}
                        />
                    </div>
                </div>
            </div>

            {/* Student List */}
            <div className="grid grid-cols-1 gap-4">
                {currentStudents.length > 0 ? (
                    currentStudents.map((student) => {
                        const score = calculateSuccessMetric(student);
                        const status = getSuccessStatus(score);

                        return (
                            <div key={student.id} className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl border border-[#e0e6ed] dark:border-[#202932] bg-white dark:bg-[#18212a] shadow-sm hover:shadow-md transition-shadow">
                                {/* Student Info */}
                                <div className="flex items-center gap-4 w-full md:w-1/4">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                        {student.avatar}
                                    </div>
                                    <div>
                                        <h3 className="text-[#111418] dark:text-white text-lg font-bold leading-tight">{student.name}</h3>
                                        <p className="text-[#617589] dark:text-gray-400 text-sm">ID: #{student.id}</p>
                                    </div>
                                </div>

                                {/* Metrics Summary */}
                                <div className="flex items-center justify-around w-full md:w-2/4 gap-4">
                                    <div className="text-center">
                                        <p className="text-[#617589] dark:text-gray-400 text-xs font-medium uppercase tracking-wider">Başarı Puanı</p>
                                        <p className="text-indigo-600 dark:text-indigo-400 text-lg font-bold">{score}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[#617589] dark:text-gray-400 text-xs font-medium uppercase tracking-wider">Tamamlanan</p>
                                        <p className="text-[#111418] dark:text-white text-lg font-bold">{student.tasksCompleted}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[#617589] dark:text-gray-400 text-xs font-medium uppercase tracking-wider">Eksik</p>
                                        <p className="text-red-500 text-lg font-bold">{student.tasksIncomplete}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[#617589] dark:text-gray-400 text-xs font-medium uppercase tracking-wider">Zincir</p>
                                        <p className="text-primary text-lg font-bold">{student.streak} Gün</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[#617589] dark:text-gray-400 text-xs font-medium uppercase tracking-wider">Sınav Trendi</p>
                                        <div className="flex items-center justify-center gap-1">
                                            {student.examTrend === 'increasing' && <span className="material-symbols-outlined text-green-500 text-lg">trending_up</span>}
                                            {student.examTrend === 'stable' && <span className="material-symbols-outlined text-yellow-500 text-lg">trending_flat</span>}
                                            {student.examTrend === 'decreasing' && <span className="material-symbols-outlined text-red-500 text-lg">trending_down</span>}
                                        </div>
                                    </div>
                                </div>

                                {/* Success Status & Action */}
                                <div className="flex items-center justify-end gap-6 w-full md:w-1/4">
                                    <div className={`px-4 py-2 rounded-full ${status.bg} border border-transparent`}>
                                        <p className={`${status.text} text-sm font-bold whitespace-nowrap`}>{status.label}</p>
                                    </div>
                                    <button
                                        onClick={() => handleOpenModal(student)}
                                        className="flex items-center justify-center h-10 w-10 rounded-full bg-[#f0f2f4] dark:bg-[#202932] hover:bg-[#e0e6ed] dark:hover:bg-[#2b3642] transition-colors text-[#111418] dark:text-white"
                                        title="Detaylı Analiz"
                                    >
                                        <span className="material-symbols-outlined">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                        Aradığınız kriterlere uygun öğrenci bulunamadı.
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="material-symbols-outlined text-[#617589] dark:text-gray-400">chevron_left</span>
                    </button>
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`w-8 h-8 rounded-lg text-sm font-bold transition-colors ${currentPage === index + 1
                                ? 'bg-primary text-white'
                                : 'text-[#617589] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="material-symbols-outlined text-[#617589] dark:text-gray-400">chevron_right</span>
                    </button>
                </div>
            )}

            {/* Student Detail Modal */}
            {isModalOpen && selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#18212a] w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#18212a]">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                    {selectedStudent.avatar}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-[#111418] dark:text-white">{selectedStudent.name}</h2>
                                    <p className="text-sm text-[#617589] dark:text-gray-400">Öğrenci Analizi</p>
                                </div>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">close</span>
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex items-center gap-8 px-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#18212a]">
                            <button
                                onClick={() => setActiveTab('exams')}
                                className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'exams'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                Sınavlar
                            </button>
                            <button
                                onClick={() => setActiveTab('analysis')}
                                className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'analysis'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                Analizler
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-6 bg-[#f0f2f4] dark:bg-[#111418]">
                            {activeTab === 'exams' && (
                                selectedExamId ? (
                                    <ExamDetailPage embedded={true} onBack={handleBackToExams} />
                                ) : (
                                    <ExamsPage embedded={true} onExamClick={handleExamClick} />
                                )
                            )}
                            {activeTab === 'analysis' && <AnalysisPage embedded={true} />}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MentorAnalyticsPage;
