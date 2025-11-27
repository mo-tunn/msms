import React from 'react';
import { useNavigate } from 'react-router-dom';

const ExamsPage = ({ embedded = false, onExamClick }) => {
    const navigate = useNavigate();

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
                                    <input className="peer sr-only" name="exam-type" type="radio" value={type} defaultChecked={type === 'Tümü'} />
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
                            <p className="text-gray-900 dark:text-white text-3xl font-bold">85.4</p>
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
                            <p className="text-gray-900 dark:text-white text-3xl font-bold">23</p>
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
                            <p className="text-gray-900 dark:text-white text-3xl font-bold">112.5</p>
                            <span className="text-xs font-medium text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">Rekor</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
                <div className="lg:col-span-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-gray-900 dark:text-white text-lg font-bold">Net Gelişimi</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">75.5</span>
                                <span className="flex items-center text-sm font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                                    <span className="material-symbols-outlined text-sm mr-0.5">trending_up</span>
                                    +5.2%
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-primary"></span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Son 6 Ay</span>
                        </div>
                    </div>
                    <div className="grid min-h-[220px] grid-flow-col gap-4 sm:gap-8 grid-rows-[1fr_auto] items-end justify-items-center px-2">
                        {[
                            { month: 'Oca', height: '70%' },
                            { month: 'Şub', height: '80%' },
                            { month: 'Mar', height: '55%' },
                            { month: 'Nis', height: '65%' },
                            { month: 'May', height: '90%' },
                            { month: 'Haz', height: '100%' },
                        ].map((item, index) => (
                            <React.Fragment key={index}>
                                <div className="group relative w-full flex flex-col justify-end items-center" style={{ height: '100%' }}>
                                    <div
                                        className="w-full max-w-[40px] bg-primary/10 dark:bg-primary/20 rounded-t-xl relative overflow-hidden transition-all duration-300 group-hover:bg-primary/20 dark:group-hover:bg-primary/30"
                                        style={{ height: item.height }}
                                    >
                                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-primary to-primary/60 rounded-t-xl transition-all duration-500" style={{ height: '100%' }}></div>
                                    </div>
                                    {/* Tooltip */}
                                    <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10">
                                        {item.height.replace('%', '')} Net
                                    </div>
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mt-3">{item.month}</p>
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm flex flex-col">
                    <div className="mb-4">
                        <h3 className="text-gray-900 dark:text-white text-lg font-bold">Soru Dağılımı</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Tüm Sınavlar Ortalaması</p>
                    </div>

                    <div className="flex-1 flex items-center justify-center relative">
                        <div className="relative w-56 h-56">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                {/* Background Circle */}
                                <path className="text-gray-100 dark:text-gray-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" />
                                {/* Data Circles */}
                                <path className="text-green-500" strokeDasharray="80, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                                <path className="text-red-500" strokeDasharray="12, 100" strokeDashoffset="-82" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-black text-gray-900 dark:text-white">80%</span>
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Başarı</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-6">
                        <div className="flex flex-col items-center p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                            <span className="text-green-600 font-bold text-lg">96</span>
                            <span className="text-xs text-green-700/70 dark:text-green-400">Doğru</span>
                        </div>
                        <div className="flex flex-col items-center p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                            <span className="text-red-600 font-bold text-lg">14</span>
                            <span className="text-xs text-red-700/70 dark:text-red-400">Yanlış</span>
                        </div>
                        <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                            <span className="text-gray-600 dark:text-gray-300 font-bold text-lg">10</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Boş</span>
                        </div>
                    </div>
                </div>
            </div>

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
                                <th className="px-6 py-4 font-semibold text-center">Doğru</th>
                                <th className="px-6 py-4 font-semibold text-center">Yanlış</th>
                                <th className="px-6 py-4 font-semibold text-center">Net</th>
                                <th className="px-6 py-4 font-semibold text-right">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {[
                                { id: 1, name: 'TYT Deneme Sınavı #12', date: '15 Haziran 2024', correct: 90, wrong: 18, net: 85.50 },
                                { id: 2, name: 'AYT Deneme Sınavı #8', date: '08 Haziran 2024', correct: 65, wrong: 10, net: 62.50 },
                                { id: 3, name: 'TYT Deneme Sınavı #11', date: '01 Haziran 2024', correct: 88, wrong: 22, net: 82.50 },
                                { id: 4, name: 'AYT Deneme Sınavı #7', date: '25 Mayıs 2024', correct: 68, wrong: 8, net: 66.00 },
                            ].map((exam) => (
                                <tr
                                    key={exam.id}
                                    className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
                                    onClick={() => {
                                        if (embedded && onExamClick) {
                                            onExamClick(exam.id);
                                        } else {
                                            navigate(`/app/sinavlarim/${exam.id}`);
                                        }
                                    }}
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                <span className="material-symbols-outlined text-xl">description</span>
                                            </div>
                                            {exam.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{exam.date}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                            {exam.correct} D
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                            {exam.wrong} Y
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-base font-bold text-gray-900 dark:text-white">{exam.net.toFixed(2)}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">chevron_right</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default ExamsPage;
