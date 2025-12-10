import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudentExams } from '../../services/api';
import { getAuth } from '../../utils/authUtils';

const ExamsPage = ({ embedded = false, onExamClick, studentId = null }) => {
    const navigate = useNavigate();
    const [exams, setExams] = useState([]);
    const [filter, setFilter] = useState('Tümü');
    const [stats, setStats] = useState({
        avgNet: 0,
        totalExams: 0,
        maxNet: 0
    });
    const user = getAuth().user;

    useEffect(() => {
        const targetId = studentId || (user && user.id);
        if (targetId) {
            fetchExams(targetId);
        }
    }, [user, studentId]);

    const fetchExams = async (studentId) => {
        try {
            const data = await getStudentExams(studentId);
            setExams(data);
            calculateStats(data);
        } catch (error) {
            console.error('Error fetching exams:', error);
        }
    };

    const calculateStats = (data) => {
        if (!data || data.length === 0) return;

        const totalNet = data.reduce((acc, curr) => acc + parseFloat(curr.total_net || 0), 0);
        const avgNet = totalNet / data.length;
        const maxNet = Math.max(...data.map(e => parseFloat(e.total_net || 0)));

        setStats({
            avgNet,
            totalExams: data.length,
            maxNet
        });
    };

    const filteredExams = exams.filter(exam => {
        if (filter === 'Tümü') return true;
        return exam.exam_type === filter;
    });

    return (
        <>
            {/* Header */}
            {!embedded && (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-gray-900 dark:text-white text-3xl font-bold tracking-tight">Sınavlarım</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Deneme sınavlarınızı ve gelişiminizi takip edin.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                            {['Tümü', 'TYT', 'AYT'].map((type) => (
                                <label key={type} className="relative cursor-pointer">
                                    <input
                                        className="peer sr-only"
                                        name="exam-type"
                                        type="radio"
                                        value={type}
                                        checked={filter === type}
                                        onChange={() => setFilter(type)}
                                    />
                                    <span className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 rounded-lg transition-all peer-checked:bg-white dark:peer-checked:bg-gray-700 peer-checked:text-gray-900 dark:peer-checked:text-white peer-checked:shadow-sm">
                                        {type}
                                    </span>
                                </label>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
                            <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-xl">calendar_month</span>
                            <select className="bg-transparent text-gray-700 dark:text-gray-200 text-sm font-medium border-0 focus:ring-0 p-0 pr-6 cursor-pointer">
                                <option>Son 6 Ay</option>
                                <option>Son 30 Gün</option>
                                <option>Son 7 Gün</option>
                                <option>Tüm Zamanlar</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="relative overflow-hidden rounded-2xl p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-6xl text-primary">analytics</span>
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <span className="material-symbols-outlined text-xl">analytics</span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Genel Ortalama</p>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-gray-900 dark:text-white text-3xl font-bold">{stats.avgNet.toFixed(1)}</p>
                            <span className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">Net</span>
                        </div>
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-6xl text-purple-500">assignment</span>
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                                <span className="material-symbols-outlined text-xl">assignment</span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Toplam Sınav</p>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-gray-900 dark:text-white text-3xl font-bold">{stats.totalExams}</p>
                            <span className="text-xs font-medium text-gray-500">Adet</span>
                        </div>
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-6xl text-amber-500">trophy</span>
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
                                <span className="material-symbols-outlined text-xl">trophy</span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">En Yüksek Net</p>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-gray-900 dark:text-white text-3xl font-bold">{stats.maxNet.toFixed(1)}</p>
                            <span className="text-xs font-medium text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">Rekor</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section - Placeholder for now as it requires more complex data processing */}
            {/* ... (Charts Section kept as is or hidden if no data) ... */}

            {/* Exam History Table */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Sınav Geçmişi</h3>
                    <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">Tümünü Gör</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-900/50">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Sınav Adı</th>
                                <th className="px-6 py-4 font-semibold">Tarih</th>
                                {/* Correct/Wrong counts are not directly available in the list view from backend yet, only total net. 
                                    We could update backend to return sum of correct/wrong too. 
                                    For now, I will hide Correct/Wrong columns or show N/A. 
                                    Actually, let's just show Net and Actions.
                                */}
                                <th className="px-6 py-4 font-semibold text-center">Net</th>
                                <th className="px-6 py-4 font-semibold text-right">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {filteredExams.map((exam) => (
                                <tr
                                    key={exam.id}
                                    className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
                                    onClick={() => {
                                        if (embedded && onExamClick) {
                                            onExamClick(exam.id);
                                        } else {
                                            navigate(`/student/sinavlarim/${exam.id}`);
                                        }
                                    }}
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                <span className="material-symbols-outlined text-xl">description</span>
                                            </div>
                                            {exam.exam_name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{new Date(exam.exam_date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-base font-bold text-gray-900 dark:text-white">{parseFloat(exam.total_net).toFixed(2)}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">chevron_right</span>
                                    </td>
                                </tr>
                            ))}
                            {filteredExams.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">Kayıtlı sınav bulunamadı.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default ExamsPage;
