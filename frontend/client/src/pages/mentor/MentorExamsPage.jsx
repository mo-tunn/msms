import React, { useState, useEffect } from 'react';

const MentorExamsPage = () => {
    const [selectedStudent, setSelectedStudent] = useState('1');

    const students = [
        { id: '1', name: 'Ahmet Yılmaz' },
        { id: '2', name: 'Ayşe Demir' },
        { id: '3', name: 'Mehmet Kaya' },
    ];

    const [exams, setExams] = useState([
        { id: 1, name: 'TYT Deneme 1', date: '2023-10-15', score: 380, net: 75.5, category: 'TYT' },
        { id: 2, name: 'AYT Deneme 1', date: '2023-10-22', score: 320, net: 45.0, category: 'AYT' },
        { id: 3, name: 'TYT Deneme 2', date: '2023-11-05', score: 410, net: 82.0, category: 'TYT' },
    ]);

    // Form State
    const [examName, setExamName] = useState('');
    const [examDate, setExamDate] = useState('');
    const [examCategory, setExamCategory] = useState('TYT');
    const [examScore, setExamScore] = useState('');
    const [subjectStats, setSubjectStats] = useState({});
    const [topicDetails, setTopicDetails] = useState([]);

    // Topic Entry State
    const [selectedTopicSubject, setSelectedTopicSubject] = useState('');
    const [topicName, setTopicName] = useState('');
    const [topicCorrect, setTopicCorrect] = useState('');
    const [topicWrong, setTopicWrong] = useState('');
    const [topicEmpty, setTopicEmpty] = useState('');

    const tytSubjects = ['Türkçe', 'Sosyal Bilimler', 'Temel Matematik', 'Fen Bilimleri'];
    const aytSubjects = ['T. Dili ve Edebiyatı-Sosyal Bil-1', 'Sosyal Bilimler-2', 'Matematik', 'Fen Bilimleri'];

    const currentSubjects = examCategory === 'TYT' ? tytSubjects : aytSubjects;

    // Initialize subject stats when category changes
    useEffect(() => {
        const initialStats = {};
        currentSubjects.forEach(sub => {
            initialStats[sub] = { correct: '', wrong: '', empty: '', net: 0 };
        });
        setSubjectStats(initialStats);
        setTopicDetails([]); // Clear topics on category change
        setSelectedTopicSubject(currentSubjects[0]);
    }, [examCategory]);

    const handleStatChange = (subject, field, value) => {
        const val = value === '' ? '' : parseInt(value) || 0;
        setSubjectStats(prev => {
            const newStats = { ...prev };
            newStats[subject] = { ...newStats[subject], [field]: val };

            // Calculate Net: Correct - (Wrong / 4)
            const correct = field === 'correct' ? val : (newStats[subject].correct || 0);
            const wrong = field === 'wrong' ? val : (newStats[subject].wrong || 0);
            newStats[subject].net = Math.max(0, correct - (wrong / 4));

            return newStats;
        });
    };

    const calculateTotalNet = () => {
        return Object.values(subjectStats).reduce((acc, curr) => acc + (curr.net || 0), 0);
    };

    const handleAddTopic = () => {
        if (!topicName || !selectedTopicSubject) return;

        const newTopic = {
            id: Date.now(),
            subject: selectedTopicSubject,
            name: topicName,
            correct: parseInt(topicCorrect) || 0,
            wrong: parseInt(topicWrong) || 0,
            empty: parseInt(topicEmpty) || 0,
        };

        setTopicDetails([...topicDetails, newTopic]);
        setTopicName('');
        setTopicCorrect('');
        setTopicWrong('');
        setTopicEmpty('');
    };

    const handleRemoveTopic = (id) => {
        setTopicDetails(topicDetails.filter(t => t.id !== id));
    };

    const handleAddExam = (e) => {
        e.preventDefault();
        const newExam = {
            id: Date.now(),
            name: examName,
            date: examDate,
            category: examCategory,
            score: parseFloat(examScore),
            net: calculateTotalNet(),
            details: {
                subjects: subjectStats,
                topics: topicDetails
            }
        };

        setExams([newExam, ...exams]);
        alert('Sınav sonucu başarıyla eklendi!');

        // Reset Form
        setExamName('');
        setExamDate('');
        setExamScore('');
        setExamCategory('TYT'); // Will trigger useEffect to reset stats
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Öğrenci Sınav Takibi</h1>
                    <p className="text-gray-500 dark:text-gray-400">Sınav sonuçlarını girin ve analiz edin.</p>
                </div>

                <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-2 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300 pl-2">Öğrenci Seç:</span>
                    <select
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                        className="bg-gray-50 dark:bg-gray-700 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary py-2 pl-3 pr-8"
                    >
                        {students.map(student => (
                            <option key={student.id} value={student.id}>{student.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Add Exam Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Yeni Sınav Sonucu Ekle</h2>
                        <form onSubmit={handleAddExam} className="space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sınav Adı</label>
                                    <input
                                        required
                                        type="text"
                                        value={examName}
                                        onChange={(e) => setExamName(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        placeholder="Örn: TYT Deneme 3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tarih</label>
                                    <input
                                        required
                                        type="date"
                                        value={examDate}
                                        onChange={(e) => setExamDate(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kategori</label>
                                    <select
                                        value={examCategory}
                                        onChange={(e) => setExamCategory(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    >
                                        <option value="TYT">TYT</option>
                                        <option value="AYT">AYT</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Toplam Puan</label>
                                    <input
                                        required
                                        type="number"
                                        value={examScore}
                                        onChange={(e) => setExamScore(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        placeholder="0-500"
                                    />
                                </div>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <h3 className="text-md font-bold text-gray-900 dark:text-white mb-3">Ders Bazlı Sonuçlar</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {currentSubjects.map((subject) => (
                                        <div key={subject} className="flex flex-col sm:flex-row sm:items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700">
                                            <div className="w-full sm:w-1/4 font-medium text-gray-900 dark:text-white">{subject}</div>
                                            <div className="flex-1 grid grid-cols-3 gap-2">
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">Doğru</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={subjectStats[subject]?.correct || ''}
                                                        onChange={(e) => handleStatChange(subject, 'correct', e.target.value)}
                                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">Yanlış</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={subjectStats[subject]?.wrong || ''}
                                                        onChange={(e) => handleStatChange(subject, 'wrong', e.target.value)}
                                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">Boş</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={subjectStats[subject]?.empty || ''}
                                                        onChange={(e) => handleStatChange(subject, 'empty', e.target.value)}
                                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 text-sm focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500"
                                                    />
                                                </div>
                                            </div>
                                            <div className="w-full sm:w-20 text-right">
                                                <span className="text-xs text-gray-500 block">Net</span>
                                                <span className="font-bold text-primary">{subjectStats[subject]?.net?.toFixed(2) || '0.00'}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 flex justify-end items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                                    <span>Toplam Net:</span>
                                    <span className="text-primary">{calculateTotalNet().toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <h3 className="text-md font-bold text-gray-900 dark:text-white mb-3">Konu Bazlı Detaylar (Opsiyonel)</h3>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col sm:flex-row gap-2 items-end">
                                        <div className="flex-1 w-full">
                                            <label className="block text-xs text-gray-500 mb-1">Ders</label>
                                            <select
                                                value={selectedTopicSubject}
                                                onChange={(e) => setSelectedTopicSubject(e.target.value)}
                                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm"
                                            >
                                                {currentSubjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                                            </select>
                                        </div>
                                        <div className="flex-[2] w-full">
                                            <label className="block text-xs text-gray-500 mb-1">Konu Adı</label>
                                            <input
                                                type="text"
                                                value={topicName}
                                                onChange={(e) => setTopicName(e.target.value)}
                                                placeholder="Örn: Türev"
                                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm"
                                            />
                                        </div>
                                        <div className="w-20">
                                            <label className="block text-xs text-gray-500 mb-1">D</label>
                                            <input type="number" value={topicCorrect} onChange={(e) => setTopicCorrect(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-2 py-2 text-sm" />
                                        </div>
                                        <div className="w-20">
                                            <label className="block text-xs text-gray-500 mb-1">Y</label>
                                            <input type="number" value={topicWrong} onChange={(e) => setTopicWrong(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-2 py-2 text-sm" />
                                        </div>
                                        <div className="w-20">
                                            <label className="block text-xs text-gray-500 mb-1">B</label>
                                            <input type="number" value={topicEmpty} onChange={(e) => setTopicEmpty(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-2 py-2 text-sm" />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleAddTopic}
                                            className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 p-2 rounded-lg"
                                        >
                                            <span className="material-symbols-outlined">add</span>
                                        </button>
                                    </div>

                                    {/* Added Topics List */}
                                    {topicDetails.length > 0 && (
                                        <div className="space-y-2">
                                            {topicDetails.map((topic) => (
                                                <div key={topic.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-gray-700 dark:text-gray-300">{topic.subject}:</span>
                                                        <span className="text-gray-900 dark:text-white">{topic.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-green-600">{topic.correct} D</span>
                                                        <span className="text-red-500">{topic.wrong} Y</span>
                                                        <span className="text-gray-500">{topic.empty} B</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveTopic(topic.id)}
                                                            className="text-red-400 hover:text-red-600"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">delete</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                                <span className="material-symbols-outlined">save</span>
                                Sınav Sonucunu Kaydet
                            </button>
                        </form>
                    </div>
                </div>

                {/* Exam List & Stats */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Ortalama Puan</p>
                            <p className="text-2xl font-bold text-primary mt-1">370.0</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Ortalama Net</p>
                            <p className="text-2xl font-bold text-green-600 mt-1">67.5</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Sınav</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{exams.length}</p>
                        </div>
                    </div>

                    {/* Recent Exams List (Simplified) */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="font-bold text-gray-900 dark:text-white">Son Eklenenler</h3>
                        </div>
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {exams.map((exam) => (
                                <div key={exam.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-gray-900 dark:text-white">{exam.name}</h4>
                                        <span className="text-xs font-bold px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{exam.category}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                                        <span>{exam.date}</span>
                                        <div className="flex gap-3">
                                            <span className="font-medium text-primary">{exam.score} Puan</span>
                                            <span className="font-medium text-green-600">{exam.net.toFixed(2)} Net</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorExamsPage;
