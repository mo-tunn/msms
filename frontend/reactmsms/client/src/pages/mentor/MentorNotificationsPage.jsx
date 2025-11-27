import React, { useState } from 'react';

const MentorNotificationsPage = () => {
    const students = [
        { id: '1', name: 'Ahmet Yılmaz' },
        { id: '2', name: 'Ayşe Demir' },
        { id: '3', name: 'Mehmet Kaya' },
        { id: '4', name: 'Zeynep Çelik' },
    ];

    const [selectedStudents, setSelectedStudents] = useState([]);

    const toggleStudent = (id) => {
        if (selectedStudents.includes(id)) {
            setSelectedStudents(selectedStudents.filter(s => s !== id));
        } else {
            setSelectedStudents([...selectedStudents, id]);
        }
    };

    const handleSelectAll = () => {
        if (selectedStudents.length === students.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(students.map(s => s.id));
        }
    };

    const handleSendNotification = (e) => {
        e.preventDefault();
        if (selectedStudents.length === 0) {
            alert('Lütfen en az bir öğrenci seçin.');
            return;
        }
        alert(`${selectedStudents.length} öğrenciye bildirim gönderildi!`);
        e.target.reset();
        setSelectedStudents([]);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bildirim Gönder</h1>
                <p className="text-gray-500 dark:text-gray-400">Öğrencilerinize toplu veya bireysel duyurular yapın.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Student Selection */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm h-full">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Alıcılar</h2>
                            <button
                                onClick={handleSelectAll}
                                className="text-sm text-primary hover:underline font-medium"
                            >
                                {selectedStudents.length === students.length ? 'Tümünü Kaldır' : 'Tümünü Seç'}
                            </button>
                        </div>
                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                            {students.map(student => (
                                <label key={student.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-all">
                                    <input
                                        type="checkbox"
                                        checked={selectedStudents.includes(student.id)}
                                        onChange={() => toggleStudent(student.id)}
                                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                                            {student.name.charAt(0)}
                                        </div>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{student.name}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                            {selectedStudents.length} öğrenci seçildi
                        </div>
                    </div>
                </div>

                {/* Message Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Bildirim İçeriği</h2>
                        <form onSubmit={handleSendNotification} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bildirim Başlığı</label>
                                <input required type="text" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Örn: Haftalık Ödev Hatırlatması" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mesaj</label>
                                <textarea required rows="6" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" placeholder="Mesajınızı buraya yazın..."></textarea>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Öncelik</label>
                                    <select className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary">
                                        <option>Normal</option>
                                        <option>Yüksek (Acil)</option>
                                        <option>Düşük</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tip</label>
                                    <select className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary">
                                        <option value="Duyuru">Duyuru</option>
                                        <option value="Akademik">Akademik</option>
                                        <option value="Hatırlatma">Hatırlatma</option>
                                        <option value="Motivasyon">Motivasyon</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button type="submit" className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-primary/20">
                                    <span className="material-symbols-outlined">send</span>
                                    Bildirimi Gönder
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorNotificationsPage;
